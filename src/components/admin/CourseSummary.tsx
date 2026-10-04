"use client";

import { useMemo, useState } from "react";
import { Student, StudentProgress, SUBJECT_INFO, WorldDef, WorldSubject } from "@/types";
import {
  computeClassroomMetrics,
  computeStudentsNeedingHelp,
  getMasteryThreshold,
  getStudentWorldSummary,
  getWorldsForGrade,
} from "@/lib/courseSummary";
import { CurriculumEntry } from "@/lib/curriculo";
import { generateCourseCSV, downloadCourseCSV } from "@/lib/courseExport";
import SubjectBadge from "@/components/SubjectBadge";

interface CourseSummaryProps {
  students: Student[];
  progressMap: Record<string, StudentProgress>;
  enabledWorldIds: number[]; // 3.º
  g2Enabled: number[]; // 2.º
  g1Enabled: number[]; // 1.º
  curriculumEntries?: Record<string, CurriculumEntry>;
  onSelectStudent: (code: string) => void;
}

const ALL_SUBJECTS: WorldSubject[] = ["matematica", "lengua", "naturales", "sociales"];

export default function CourseSummary({
  students,
  progressMap,
  enabledWorldIds,
  g2Enabled,
  g1Enabled,
  curriculumEntries,
  onSelectStudent,
}: CourseSummaryProps) {
  // Filtro de materia: "todas" o una materia puntual.
  const [selectedSubject, setSelectedSubject] = useState<WorldSubject | "todas">("todas");
  // Filtro de grado: por defecto 3.º (grado principal del aula piloto).
  const [gradeFilter, setGradeFilter] = useState<number | "todos">(3);

  // Alumnos filtrados por grado
  const filteredStudents = useMemo(() => {
    let list = students;
    if (gradeFilter !== "todos") {
      list = students.filter((s) => (s.grade ?? 3) === gradeFilter);
    }
    // Orden alfabético por nombre completo (regla: usar nombre completo en el panel docente)
    return [...list].sort((a, b) => a.name.localeCompare(b.name, "es", { sensitivity: "base" }));
  }, [students, gradeFilter]);

  // Mundos habilitados para el grado seleccionado
  const activeGradeEnabledIds = useMemo(() => {
    if (gradeFilter === 1) return g1Enabled;
    if (gradeFilter === 2) return g2Enabled;
    return enabledWorldIds;
  }, [gradeFilter, g1Enabled, g2Enabled, enabledWorldIds]);

  // Mundos a considerar en la grilla
  const gridWorlds = useMemo(() => {
    const g = typeof gradeFilter === "number" ? gradeFilter : 3;
    const baseWorlds = getWorldsForGrade(g);
    const enabledSet = new Set(
      gradeFilter === 1 ? g1Enabled : gradeFilter === 2 ? g2Enabled : enabledWorldIds
    );

    // Solo mundos habilitados para ese grado
    let worlds = baseWorlds.filter((w) => enabledSet.has(w.id));

    // Si no hubiera ninguno explícitamente habilitado, mostramos los base para que la grilla no quede vacía
    if (worlds.length === 0) {
      worlds = baseWorlds.slice(0, 14);
    }

    if (selectedSubject !== "todas") {
      worlds = worlds.filter((w) => w.subject === selectedSubject);
    }

    return worlds;
  }, [gradeFilter, g1Enabled, g2Enabled, enabledWorldIds, selectedSubject]);

  // Mundos agrupados por materia
  const worldsBySubject = useMemo(() => {
    const map = new Map<WorldSubject, WorldDef[]>();
    for (const w of gridWorlds) {
      const list = map.get(w.subject) ?? [];
      list.push(w);
      map.set(w.subject, list);
    }
    return map;
  }, [gridWorlds]);

  // Métricas del aula
  const allEnabledIds = useMemo(() => {
    return Array.from(new Set([...enabledWorldIds, ...g2Enabled, ...g1Enabled]));
  }, [enabledWorldIds, g2Enabled, g1Enabled]);

  const metrics = useMemo(() => {
    return computeClassroomMetrics(filteredStudents, progressMap, allEnabledIds);
  }, [filteredStudents, progressMap, allEnabledIds]);

  // Alumnos que necesitan ayuda primero
  const studentsNeedingHelp = useMemo(() => {
    return computeStudentsNeedingHelp(filteredStudents, progressMap, activeGradeEnabledIds);
  }, [filteredStudents, progressMap, activeGradeEnabledIds]);

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Métricas arriba */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Promedio de aciertos del aula */}
        <div className="parchment-panel rounded-2xl p-4 border-2 border-amber-800/20 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900/60">
              Precisión global
            </span>
            <h3 className="text-2xl font-black text-amber-950 mt-1">
              {metrics.averageAccuracy > 0 ? `${metrics.averageAccuracy}%` : "—"}
            </h3>
          </div>
          <p className="text-xs text-amber-900/80 mt-2">
            Promedio de respuestas correctas en todo el curso ({metrics.totalActivitiesCount} actividades resueltas).
          </p>
        </div>

        {/* Alumnos activos esta semana */}
        <div className="parchment-panel rounded-2xl p-4 border-2 border-amber-800/20 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900/60">
              Actividad semanal
            </span>
            <h3 className="text-2xl font-black text-emerald-800 mt-1">
              {metrics.activeThisWeek.count} de {metrics.activeThisWeek.total}
              <span className="text-sm font-semibold text-amber-900/70 ml-2">
                ({metrics.activeThisWeek.pct}%)
              </span>
            </h3>
          </div>
          <p className="text-xs text-amber-900/80 mt-2">
            Alumnos que completaron al menos una actividad en los últimos 7 días.
          </p>
        </div>

        {/* 3 mundos más difíciles */}
        <div className="parchment-panel rounded-2xl p-4 border-2 border-amber-800/20 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900/60">
              Mundos más difíciles
            </span>
            {metrics.hardestWorlds.length > 0 ? (
              <div className="flex flex-col gap-1 mt-1.5">
                {metrics.hardestWorlds.map((w, idx) => (
                  <div key={w.worldId} className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-amber-950 truncate max-w-[190px]">
                      {idx + 1}. {w.emoji} {w.name}
                    </span>
                    <span className="font-bold text-rose-700 shrink-0 ml-1">
                      {w.averageScore}%
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-amber-900/70 mt-2 italic">
                Requiere al menos 3 alumnos por mundo para calcular el ranking.
              </p>
            )}
          </div>
          <p className="text-[11px] text-amber-900/60 mt-2">
            Mundos con menor puntaje promedio (mínimo 3 alumnos).
          </p>
        </div>
      </div>

      {/* 2. Sección «A quién ayudar primero» */}
      <div className="rounded-2xl border-2 border-rose-300 bg-rose-50/70 p-4 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎯</span>
            <h3 className="font-black text-rose-950 text-base">
              A quién ayudar primero
            </h3>
          </div>
          <span className="text-xs text-rose-900/70">
            Priorización pedagógica automática
          </span>
        </div>

        {studentsNeedingHelp.length === 0 ? (
          <div className="rounded-xl bg-white/70 p-3 text-center text-sm font-semibold text-emerald-800 border border-emerald-300">
            🎉 ¡Excelente! Todo el curso está al día y con buen desempeño.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {studentsNeedingHelp.map((item) => (
              <div
                key={item.student.code}
                onClick={() => onSelectStudent(item.student.code)}
                className="group cursor-pointer rounded-xl bg-white/90 hover:bg-white border border-rose-200 hover:border-rose-400 p-3 transition shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <p className="font-bold text-amber-950 text-sm group-hover:text-amber-800 transition">
                      {item.student.name}
                    </p>
                    <span className="text-[10px] text-amber-900/50 font-mono">
                      {item.student.code}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.reasons.map((r, i) => (
                      <span
                        key={i}
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          r.includes("en rojo")
                            ? "bg-rose-100 text-rose-800 border border-rose-200"
                            : "bg-amber-100 text-amber-900 border border-amber-200"
                        }`}
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                  {item.redWorldNames.length > 0 && (
                    <p className="text-[11px] text-rose-900/80 mt-1.5 line-clamp-1">
                      ⚠️ {item.redWorldNames.join(", ")}
                    </p>
                  )}
                </div>
                <div className="mt-2.5 pt-2 border-t border-rose-100 flex items-center justify-between text-[11px]">
                  <span className="text-amber-900/60">
                    {item.lastPlayedAt
                      ? `Última vez: ${new Date(item.lastPlayedAt).toLocaleDateString("es-AR")}`
                      : "Sin ingresos"}
                  </span>
                  <span className="font-bold text-amber-800 group-hover:underline">
                    Ver registro →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Filtros y cabecera de la grilla */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="font-black text-amber-950 text-lg flex items-center gap-2">
              <span>📋</span> Grilla de desempeño por mundo
            </h3>
            <p className="text-xs text-amber-900/70">
              Seguimiento integral de {filteredStudents.length} alumnos en los mundos habilitados.
            </p>
          </div>

          {/* Selector de grado y acciones de exportación */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs font-semibold">
              <span className="text-amber-900/70">Grado:</span>
              {[3, 2, 1, "todos" as const].map((g) => (
                <button
                  key={g}
                  onClick={() => setGradeFilter(g)}
                  className={`rounded-lg px-2.5 py-1 transition border ${
                    gradeFilter === g
                      ? "bg-amber-600 text-white border-amber-700"
                      : "bg-white/70 text-amber-900 border-amber-700/20 hover:bg-white"
                  }`}
                >
                  {typeof g === "number" ? `${g}.º` : "Todos"}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const gradeParam = typeof gradeFilter === "number" ? `?grade=${gradeFilter}` : "";
                  window.open(`/admin/reporte/curso${gradeParam}`, "_blank");
                }}
                className="rounded-xl bg-white/90 hover:bg-white text-indigo-900 border border-indigo-300 px-3 py-1.5 text-xs font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                title="Abrir vista imprimible del curso completo"
              >
                🖨️ Reporte del curso
              </button>
              <button
                onClick={() => {
                  const worldIdsToExport = gridWorlds.map((w) => w.id);
                  const csv = generateCourseCSV(filteredStudents, progressMap, worldIdsToExport, curriculumEntries);
                  const gradeName = typeof gradeFilter === "number" ? `${gradeFilter}grado` : "todos";
                  const dateStr = new Date().toISOString().slice(0, 10);
                  downloadCourseCSV(`mundomat-curso-${gradeName}-${dateStr}.csv`, csv);
                }}
                className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 text-xs font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                title="Descargar planilla CSV compatible con Excel"
              >
                📥 Descargar CSV
              </button>
            </div>
          </div>
        </div>

        {/* Filtro por materia */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-amber-900/70 mr-1">Materia:</span>
          <button
            onClick={() => setSelectedSubject("todas")}
            className={`rounded-full px-3 py-1 text-xs font-bold border transition ${
              selectedSubject === "todas"
                ? "bg-amber-700 text-white border-amber-800 shadow-sm"
                : "bg-white/80 text-amber-900 border-amber-800/20 hover:bg-white"
            }`}
          >
            Todas las materias
          </button>
          {ALL_SUBJECTS.map((subj) => {
            const info = SUBJECT_INFO[subj];
            return (
              <button
                key={subj}
                onClick={() => setSelectedSubject(subj)}
                className={`rounded-full px-3 py-1 text-xs font-bold border flex items-center gap-1.5 transition ${
                  selectedSubject === subj
                    ? "bg-amber-700 text-white border-amber-800 shadow-sm"
                    : "bg-white/80 text-amber-900 border-amber-800/20 hover:bg-white"
                }`}
              >
                <SubjectBadge subject={subj} size={16} />
                <span>{info.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Grilla con scroll horizontal */}
      <div className="rounded-2xl border-2 border-amber-800/20 bg-white/95 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto max-w-full">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              {/* Fila 1: Encabezados de materias */}
              <tr className="bg-amber-100/70 border-b border-amber-800/20 text-xs">
                <th
                  rowSpan={2}
                  className="sticky left-0 bg-amber-100 border-r border-amber-800/20 px-3 py-2 text-amber-950 font-black z-20 min-w-[170px]"
                >
                  Alumno ({filteredStudents.length})
                </th>
                {Array.from(worldsBySubject.entries()).map(([subj, ws]) => {
                  const info = SUBJECT_INFO[subj];
                  return (
                    <th
                      key={subj}
                      colSpan={ws.length}
                      className="px-2 py-1.5 text-center font-bold text-amber-950 border-r border-amber-800/20 bg-amber-50"
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        <SubjectBadge subject={subj} size={16} />
                        <span>{info.label}</span>
                        <span className="text-[10px] text-amber-900/60 font-normal">
                          ({ws.length})
                        </span>
                      </div>
                    </th>
                  );
                })}
              </tr>

              {/* Fila 2: Encabezados de cada mundo */}
              <tr className="bg-amber-50/80 border-b border-amber-800/20 text-[11px]">
                {gridWorlds.map((w) => {
                  const curr = curriculumEntries?.[String(w.id)];
                  const headerTitle = `${w.name}${
                    curr
                      ? `\nDiseño Curricular: ${curr.area} · ${curr.eje}\nContenido: ${curr.contenido}\nFuente: ${curr.fuente} (${
                          curr.validado ? "Validado por docente" : "Pendiente de validar"
                        })`
                      : ""
                  }`;

                  return (
                    <th
                      key={w.id}
                      title={headerTitle}
                      className="px-1.5 py-1 text-center font-semibold text-amber-900 border-r border-amber-800/10 min-w-[55px] max-w-[80px]"
                    >
                      <div className="flex flex-col items-center">
                        <div className="relative">
                          <span className="text-base leading-none mb-0.5">{w.emoji}</span>
                          {curr && !curr.validado && (
                            <span
                              className="absolute -top-1 -right-2 text-[9px] leading-none"
                              title="⚠️ Pendiente de validar"
                            >
                              ⚠️
                            </span>
                          )}
                        </div>
                        <span className="truncate max-w-[65px] text-[10px] text-amber-950 font-bold">
                          {w.worldNumber ? `M${w.worldNumber}` : w.name.split(" ")[0]}
                        </span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody className="divide-y divide-amber-800/10 text-xs">
              {filteredStudents.map((student) => {
                const p = progressMap[student.code];
                const threshold = getMasteryThreshold(student.grade);

                return (
                  <tr key={student.code} className="hover:bg-amber-50/40 transition">
                    {/* Columna fija: Nombre del alumno */}
                    <td className="sticky left-0 bg-white hover:bg-amber-50/40 border-r border-amber-800/20 px-3 py-2 z-10">
                      <div className="flex items-center justify-between gap-1.5">
                        <button
                          onClick={() => onSelectStudent(student.code)}
                          className="text-left font-bold text-amber-950 hover:text-amber-700 hover:underline flex flex-col min-w-0"
                        >
                          <span className="truncate max-w-[135px]">{student.name}</span>
                          <span className="text-[10px] text-amber-900/50 font-normal">
                            {student.grade ? `${student.grade}.º grado` : "3.º grado"} · {student.code}
                          </span>
                        </button>
                        <a
                          href={`/admin/reporte/alumno?code=${encodeURIComponent(student.code)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 p-1 rounded-md text-slate-400 hover:text-indigo-700 hover:bg-indigo-50 text-xs transition"
                          title={`Abrir reporte para la familia de ${student.name}`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          🖨️
                        </a>
                      </div>
                    </td>

                    {/* Celdas de mundos */}
                    {gridWorlds.map((world) => {
                      const summary = getStudentWorldSummary(student, p, world.id);
                      const curr = curriculumEntries?.[String(world.id)];

                      let cellBg = "bg-slate-50 text-slate-400";
                      let tooltip = `${student.name}: Sin jugar aún en «${world.name}»`;

                      if (summary.played) {
                        tooltip = `${student.name}: ${summary.bestScore}% en ${summary.vueltas} ${
                          summary.vueltas === 1 ? "vuelta" : "vueltas"
                        } (umbral de dominio: ${threshold}%)`;
                        if (curr) {
                          tooltip += `\nCurricular: ${curr.area} · ${curr.eje} (${
                            curr.validado ? "Validado" : "⚠️ Pendiente de validar"
                          })`;
                        }

                        if (summary.status === "mastered") {
                          cellBg = "bg-emerald-100/90 text-emerald-800 font-bold border-emerald-300";
                        } else if (summary.status === "in_progress") {
                          cellBg = "bg-amber-100 text-amber-800 font-semibold border-amber-300";
                        } else {
                          cellBg = "bg-rose-100 text-rose-800 font-bold border-rose-300";
                        }
                      }

                      return (
                        <td
                          key={world.id}
                          title={tooltip}
                          className="px-1 py-1.5 text-center border-r border-amber-800/10"
                        >
                          <div
                            className={`mx-auto rounded-lg py-1 px-1 text-[11px] transition cursor-default select-none border ${cellBg}`}
                          >
                            {summary.played ? `${summary.bestScore}%` : "—"}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 5. Leyenda aclaratoria */}
        <div className="bg-amber-50/70 p-3 border-t border-amber-800/20 text-xs text-amber-950 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-bold text-amber-900/80">Estados:</span>
            <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-800">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
              🟩 Dominado (≥ 90% en 3.º, ≥ 85% en 2.º, ≥ 80% en 1.º)
            </span>
            <span className="inline-flex items-center gap-1.5 font-semibold text-amber-800">
              <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
              🟨 En progreso (50% – 89%)
            </span>
            <span className="inline-flex items-center gap-1.5 font-semibold text-rose-800">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
              🟥 Requiere ayuda (&lt; 50%)
            </span>
            <span className="inline-flex items-center gap-1.5 font-semibold text-slate-500">
              <span className="w-3 h-3 rounded-full bg-slate-300 inline-block" />
              ⬜ No jugado
            </span>
          </div>
          <p className="text-[11px] text-amber-900/70 italic">
            * Se muestra el mejor puntaje obtenido por el alumno. Pasá el cursor sobre cualquier celda para ver el detalle de vueltas.
          </p>
        </div>
      </div>
    </div>
  );
}
