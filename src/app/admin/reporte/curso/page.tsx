"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Student, StudentProgress, WorldDef } from "@/types";
import { WORLDS } from "@/lib/worlds";
import { GRADE1_WORLDS } from "@/lib/grade1/worlds";
import { GRADE2_WORLDS } from "@/lib/grade2/worlds";
import { CurriculumEntry } from "@/lib/curriculo";
import {
  computeClassroomMetrics,
  computeStudentsNeedingHelp,
  getStudentWorldSummary,
} from "@/lib/courseSummary";
import { generateCourseCSV, downloadCourseCSV } from "@/lib/courseExport";
import { contenidosAReforzar } from "@/lib/reforzar";
import ReforzarPorEje from "@/components/admin/ReforzarPorEje";
import RepasoDelCurso from "@/components/admin/RepasoDelCurso";

export default function CourseReportPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Cargando reporte del curso...</div>}>
      <CourseReportContent />
    </Suspense>
  );
}

function CourseReportContent() {
  const searchParams = useSearchParams();
  const initialGrade = searchParams.get("grade") ? Number(searchParams.get("grade")) : undefined;

  const [adminPassword, setAdminPassword] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [students, setStudents] = useState<Student[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, StudentProgress>>({});
  const [enabledWorldIds, setEnabledWorldIds] = useState<number[]>([]);
  const [curriculumEntries, setCurriculumEntries] = useState<Record<string, CurriculumEntry>>({});
  const [gradeFilter, setGradeFilter] = useState<number | undefined>(initialGrade);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const pw = sessionStorage.getItem("mundomat_admin_password");
    if (pw) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAdminPassword(pw);
      void loadData(pw);
    } else {
      setLoading(false);
    }
  }, []);

  async function loadData(pw: string) {
    setLoading(true);
    try {
      const [studentsRes, worldsRes, currRes] = await Promise.all([
        fetch("/api/students?withProgress=true", {
          headers: { "x-admin-password": pw },
        }),
        fetch("/api/worlds"),
        fetch("/api/curriculum"),
      ]);

      const studentsData = await studentsRes.json();
      const worldsData = await worldsRes.json();
      const currData = await currRes.json();

      setStudents(studentsData.students ?? []);
      setProgressMap(studentsData.progressMap ?? {});
      setEnabledWorldIds(worldsData.config?.enabledWorldIds ?? []);
      setCurriculumEntries(currData.entries ?? {});
    } finally {
      setLoading(false);
    }
  }

  function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!passwordInput.trim()) return;
    sessionStorage.setItem("mundomat_admin_password", passwordInput.trim());
    setAdminPassword(passwordInput.trim());
    void loadData(passwordInput.trim());
  }

  // Filtrado de alumnos por grado
  const filteredStudents = useMemo(() => {
    if (!gradeFilter) return students;
    return students.filter((s) => (s.grade ?? 3) === gradeFilter);
  }, [students, gradeFilter]);

  // Mundos habilitados según grado seleccionado
  const relevantWorlds: WorldDef[] = useMemo(() => {
    let all: WorldDef[] = [];
    if (gradeFilter === 1) {
      all = GRADE1_WORLDS;
    } else if (gradeFilter === 2) {
      all = GRADE2_WORLDS;
    } else if (gradeFilter === 3) {
      all = WORLDS;
    } else {
      all = [...WORLDS, ...GRADE2_WORLDS, ...GRADE1_WORLDS];
    }

    if (enabledWorldIds.length === 0) return all;
    return all.filter((w) => enabledWorldIds.includes(w.id));
  }, [gradeFilter, enabledWorldIds]);

  const worldIds = useMemo(() => relevantWorlds.map((w) => w.id), [relevantWorlds]);

  // Métricas del aula
  const metrics = useMemo(() => {
    return computeClassroomMetrics(filteredStudents, progressMap, worldIds);
  }, [filteredStudents, progressMap, worldIds]);

  // Alumnos que requieren ayuda
  const helpList = useMemo(() => {
    return computeStudentsNeedingHelp(filteredStudents, progressMap, worldIds);
  }, [filteredStudents, progressMap, worldIds]);

  function handleDownloadCSV() {
    const csv = generateCourseCSV(filteredStudents, progressMap, worldIds, curriculumEntries);
    const gradeName = gradeFilter ? `${gradeFilter}grado` : "todos-los-grados";
    const dateStr = new Date().toISOString().slice(0, 10);
    downloadCourseCSV(`mundomat-reporte-aula-${gradeName}-${dateStr}.csv`, csv);
  }

  if (!adminPassword && !loading) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <form
          onSubmit={handleLoginSubmit}
          className="bg-white p-6 rounded-2xl shadow-md max-w-sm w-full border border-slate-200"
        >
          <h1 className="text-lg font-black text-slate-800 mb-2">Acceso a Reportes</h1>
          <p className="text-xs text-slate-500 mb-4">
            Ingresá la contraseña docente para visualizar el informe.
          </p>
          <input
            type="password"
            placeholder="Contraseña docente"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm mb-3"
            autoFocus
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-bold py-2 rounded-lg text-sm hover:bg-indigo-700 transition"
          >
            Ingresar
          </button>
        </form>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <p className="text-slate-500 font-semibold text-sm">Cargando reporte general del curso...</p>
      </main>
    );
  }

  const generatedDate = new Date().toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-slate-100 py-6 px-4 print:p-0 print:bg-white text-slate-900 font-sans">
      {/* Barra de herramientas en pantalla (oculta en print) */}
      <div className="max-w-6xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl shadow-sm border border-slate-200 print:hidden">
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href="/admin/dashboard"
            className="text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 transition"
          >
            ← Volver al Panel
          </Link>

          <div className="flex items-center gap-1 ml-2">
            <span className="text-xs font-semibold text-slate-500">Filtrar Grado:</span>
            {[
              { id: undefined, label: "Todos" },
              { id: 3, label: "3.º grado" },
              { id: 2, label: "2.º grado" },
              { id: 1, label: "1.º grado" },
            ].map((g) => (
              <button
                key={String(g.id)}
                onClick={() => setGradeFilter(g.id)}
                className={`text-xs font-bold px-2.5 py-1 rounded-md transition ${
                  gradeFilter === g.id
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadCSV}
            className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
          >
            📥 Descargar CSV (Excel)
          </button>
          <button
            onClick={() => window.print()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow flex items-center gap-1.5 transition cursor-pointer"
          >
            🖨️ Imprimir / Guardar como PDF
          </button>
        </div>
      </div>

      {/* Contenedor imprimible A4 horizontal */}
      <main className="max-w-6xl mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 print:border-none print:shadow-none print:p-0 print:max-w-none">
        {/* Cabecera institucional */}
        <header className="border-b-2 border-indigo-600 pb-4 mb-6 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🧭</span>
              <span className="text-xl font-black tracking-tight text-indigo-950">Mundomat</span>
              <span className="text-xs font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full ml-1">
                Panel Docente
              </span>
            </div>
            <h1 className="text-lg font-black text-slate-800 mt-2">
              Informe General de Desempeño y Trayectorias del Aula
            </h1>
            <p className="text-xs text-slate-500">
              Escuela Primaria · Grado: <strong className="text-slate-700">{gradeFilter ? `${gradeFilter}.º grado` : "Todos los grados"}</strong> ({filteredStudents.length} alumnos)
            </p>
          </div>
          <div className="text-right text-xs text-slate-500">
            <p className="font-semibold text-slate-700">Fecha de emisión:</p>
            <p>{generatedDate}</p>
          </div>
        </header>

        {/* Métricas Globales del Aula */}
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            1. Métricas Globales del Curso
          </h2>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl">
              <p className="text-2xl font-black text-indigo-900">{metrics.averageAccuracy}%</p>
              <p className="text-xs font-bold text-indigo-800 mt-0.5">Precisión global del aula</p>
              <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                Sobre {metrics.totalActivitiesCount} actividades resueltas
              </p>
            </div>
            <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl">
              <p className="text-2xl font-black text-emerald-900">
                {metrics.activeThisWeek.count} / {metrics.activeThisWeek.total}
              </p>
              <p className="text-xs font-bold text-emerald-800 mt-0.5">Alumnos activos esta semana</p>
              <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                {metrics.activeThisWeek.pct}% del total de matriculados
              </p>
            </div>
            <div className="p-3 bg-amber-50/70 border border-amber-100 rounded-xl text-left">
              <p className="text-xs font-bold text-amber-900 mb-1">Mundos con mayor desafío:</p>
              {metrics.hardestWorlds.length > 0 ? (
                <ul className="text-[11px] text-slate-700 space-y-0.5">
                  {metrics.hardestWorlds.map((hw) => (
                    <li key={hw.worldId} className="truncate">
                      • {hw.emoji} {hw.name}: <strong>{hw.averageScore}%</strong> ({hw.playersCount} alumnos)
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[11px] text-slate-500">Sin datos de dificultad representativos.</p>
              )}
            </div>
          </div>
        </section>

        {/* Prioridades Pedagógicas: A quién ayudar primero */}
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
            <span>🎯</span> 2. Prioridades Pedagógicas («A quién ayudar primero»)
          </h2>
          {helpList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {helpList.slice(0, 6).map((h) => {
                const ids = h.redWorldIds && h.redWorldIds.length > 0 ? h.redWorldIds : [];
                const grupos = ids.length > 0
                  ? contenidosAReforzar(
                      ids.map((id) => ({ worldId: id, nivel: "practica-guiada" as const, precision: progressMap[h.student.code]?.lastWorldAttemptScore?.[id] })),
                      { worlds: relevantWorlds, entradas: curriculumEntries }
                    )
                  : [];
                return (
                  <div
                    key={h.student.code}
                    className="p-3 rounded-xl border border-rose-200 bg-rose-50/50 text-xs flex flex-col justify-between break-inside-avoid"
                    style={{ breakInside: "avoid" }}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-black text-rose-950 truncate">{h.student.name}</span>
                        <span className="text-[10px] font-bold bg-white text-rose-800 border border-rose-300 px-1.5 py-0.5 rounded">
                          {h.student.grade ?? 3}.º
                        </span>
                      </div>
                      <ul className="text-[11px] text-rose-800 space-y-0.5 mb-2">
                        {h.reasons.map((r, i) => (
                          <li key={i}>• {r}</li>
                        ))}
                      </ul>
                    </div>
                    {grupos.length > 0 && (
                      <div className="pt-2 border-t border-rose-200/60">
                        <ReforzarPorEje grupos={grupos} printable={true} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-emerald-800 bg-emerald-50 p-3 rounded-xl border border-emerald-200 font-medium">
              ✨ ¡Excelente! No hay alumnos con bajo desempeño acumulado ni inactividad crítica.
            </p>
          )}
        </section>

        {/* Qué repasar con todo el grupo */}
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5">
            <span>📚</span> 3. Dónde hacer énfasis en el repaso (contenidos por eje)
          </h2>
          <p className="text-[11px] text-slate-500 mb-2">
            Contenidos que más alumnos necesitan reforzar, entre los que ya los trabajaron (aciertan menos del 60% en lo último).
          </p>
          <RepasoDelCurso
            students={filteredStudents}
            progressMap={progressMap}
            curriculumEntries={curriculumEntries}
            printable
            max={20}
          />
        </section>

        {/* Grilla Resumen del Curso */}
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            4. Grilla de Desempeño por Alumno y Contenido
          </h2>
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold">
                  <th className="py-2.5 px-3">Estudiante</th>
                  <th className="py-2.5 px-2 text-center">Grado</th>
                  <th className="py-2.5 px-2 text-center">Completados</th>
                  {relevantWorlds.slice(0, 15).map((w) => (
                    <th key={w.id} className="py-2.5 px-2 text-center truncate max-w-[70px]" title={w.name}>
                      <span className="block text-sm">{w.emoji}</span>
                      <span className="text-[9px] font-medium block truncate">{w.name}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150">
                {filteredStudents.map((s) => {
                  const p = progressMap[s.code];
                  const completedCount = p?.completedWorlds?.length ?? 0;
                  return (
                    <tr key={s.code} className="hover:bg-slate-50/80">
                      <td className="py-2 px-3 font-semibold text-slate-900 truncate max-w-[150px]">
                        {s.name}
                      </td>
                      <td className="py-2 px-2 text-center text-slate-500">{s.grade ?? 3}.º</td>
                      <td className="py-2 px-2 text-center font-bold text-indigo-700">{completedCount}</td>
                      {relevantWorlds.slice(0, 15).map((w) => {
                        const sum = getStudentWorldSummary(s, p, w.id);
                        let badgeBg = "bg-slate-100 text-slate-400";
                        if (sum.status === "mastered") badgeBg = "bg-emerald-100 text-emerald-900 font-bold";
                        else if (sum.status === "in_progress") badgeBg = "bg-amber-100 text-amber-900 font-bold";
                        else if (sum.status === "needs_help") badgeBg = "bg-rose-100 text-rose-900 font-bold";

                        return (
                          <td key={w.id} className="py-2 px-1 text-center">
                            <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] ${badgeBg}`}>
                              {sum.played ? `${sum.bestScore}%` : "—"}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-[10px] text-slate-400 mt-1.5 text-center">
            🟩 Dominado (≥ 90% en 3.º, ≥ 85% en 2.º, ≥ 80% en 1.º) · 🟨 En progreso (50-89%) · 🟥 Requiere ayuda (&lt; 50%) · ⬜ No jugado
          </p>
        </section>

        {/* Pie de informe */}
        <footer className="mt-8 pt-4 border-t border-slate-200 flex justify-between items-center text-xs text-slate-400">
          <p>Mundomat Educación Primaria · Sistema de Gestión de Aprendizajes</p>
          <p>Página de control docente</p>
        </footer>
      </main>

      <style jsx global>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 8mm;
          }
          body {
            background-color: white !important;
            color: black !important;
          }
        }
      `}</style>
    </div>
  );
}
