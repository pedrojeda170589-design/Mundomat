"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PanelShell, { ErrorNote, NotConfigured, Panel, usePanelSession } from "@/components/platform/PanelShell";
import { friendlyError, platform } from "@/lib/platform/client";
import type { Classroom, School, SchoolClassroomSummary } from "@/lib/platform/shared";
import { puedeUsar, limiteDe, planUpgradeNotice, getPlan } from "@/lib/planes";

interface ClassroomInfo extends Classroom {
  students: number;
  teachers: { teacher_id: string; display_name: string; email: string }[];
  active_students_7d?: number;
  avg_accuracy_pct?: number;
  total_activities?: number;
  practice_minutes?: number;
}

// Gestión de una escuela (dirección / super admin):
// - Vista de directivo multi-aula con métricas consolidadas
// - Comparación pedagógica entre aulas del mismo grado (tabla y barras)
// - Control de planes institucionales (Piloto, Escuela, Distrito)
// - Aulas por ciclo, docentes, cierre de ciclo y traslados
export default function SchoolPage() {
  const router = useRouter();
  const { state } = usePanelSession();
  const [id, setId] = useState<string | null>(null);
  const [school, setSchool] = useState<School | null>(null);
  const [classrooms, setClassrooms] = useState<ClassroomInfo[]>([]);
  const [cycles, setCycles] = useState<{ school_year: number; status: string }[]>([]);
  const [selectedGradeTab, setSelectedGradeTab] = useState<number>(3);
  const [error, setError] = useState<unknown>(null);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setId(new URLSearchParams(window.location.search).get("id"));
  }, []);

  const load = useCallback(async () => {
    if (!id) return;
    const sb = platform();
    const { data: s, error: e } = await sb.from("schools").select("*").eq("id", id).maybeSingle();
    if (e) return setError(e);
    if (!s) return setError(new Error("No tenés acceso a esta escuela."));

    const [
      { data: cls },
      { data: cyc },
      planRes,
      summariesRes,
    ] = await Promise.all([
      sb.from("classrooms").select("*").eq("school_id", id).order("school_year", { ascending: false }).order("grade").order("division"),
      sb.from("school_cycles").select("school_year, status").eq("school_id", id).order("school_year", { ascending: false }),
      Promise.resolve(sb.rpc("school_active_plan", { p_school: id })).catch(() => ({ data: null })),
      Promise.resolve(sb.rpc("school_classrooms_summary", { p_school: id })).catch(() => ({ data: null })),
    ]);

    const activePlan = planRes?.data ? String(planRes.data) : s.plan ?? "piloto_gratuito";
    setSchool({ ...s, plan: activePlan });

    const summaryMap = new Map<string, SchoolClassroomSummary>();
    if (Array.isArray(summariesRes?.data)) {
      for (const sum of summariesRes.data as SchoolClassroomSummary[]) {
        summaryMap.set(sum.classroom_id, sum);
      }
    }

    const list = (cls ?? []) as Classroom[];
    const info = await Promise.all(
      list.map(async (c) => {
        const sum = summaryMap.get(c.id);
        const [{ count }, { data: t }] = await Promise.all([
          sb.from("student_enrollments").select("id", { count: "exact", head: true }).eq("classroom_id", c.id).eq("status", "active"),
          sb.rpc("classroom_teachers", { p_classroom: c.id }),
        ]);
        return {
          ...c,
          students: count ?? sum?.total_students ?? 0,
          teachers: t ?? [],
          active_students_7d: sum?.active_students_7d ?? 0,
          avg_accuracy_pct: sum?.avg_accuracy_pct ?? 0,
          total_activities: sum?.total_activities ?? 0,
          practice_minutes: sum?.practice_minutes ?? 0,
        };
      })
    );
    setClassrooms(info);
    setCycles(cyc ?? []);
  }, [id]);

  useEffect(() => {
    if (state === "anon") router.replace("/docente");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (state === "ready") void load();
  }, [state, load, router]);

  async function act(fn: () => PromiseLike<{ error: unknown }>, ok: string) {
    setMsg(null);
    const { error: e } = await fn();
    if (e) setMsg(`⚠️ ${friendlyError(e)}`);
    else {
      setMsg(`✅ ${ok}`);
      await load();
    }
  }

  // Agregados métricos multi-aula
  const totalSchoolStudents = useMemo(
    () => classrooms.reduce((acc, c) => acc + c.students, 0),
    [classrooms]
  );
  const totalActive7d = useMemo(
    () => classrooms.reduce((acc, c) => acc + (c.active_students_7d ?? 0), 0),
    [classrooms]
  );
  const totalPracticeMinutes = useMemo(
    () => classrooms.reduce((acc, c) => acc + (c.practice_minutes ?? 0), 0),
    [classrooms]
  );
  const avgSchoolAccuracy = useMemo(() => {
    const list = classrooms.filter((c) => (c.avg_accuracy_pct ?? 0) > 0);
    if (list.length === 0) return 0;
    return Math.round(list.reduce((acc, c) => acc + (c.avg_accuracy_pct ?? 0), 0) / list.length);
  }, [classrooms]);

  const gradesInSchool = useMemo(() => {
    const grades = Array.from(new Set(classrooms.map((c) => c.grade))).sort((a, b) => a - b);
    return grades.length ? grades : [1, 2, 3];
  }, [classrooms]);

  const classroomsOfSelectedGrade = useMemo(() => {
    return classrooms.filter((c) => c.grade === selectedGradeTab);
  }, [classrooms, selectedGradeTab]);

  const gradeGap = useMemo(() => {
    if (classroomsOfSelectedGrade.length < 2) return null;
    const valid = classroomsOfSelectedGrade.filter((c) => (c.avg_accuracy_pct ?? 0) > 0);
    if (valid.length < 2) return null;
    const accuracies = valid.map((c) => c.avg_accuracy_pct ?? 0);
    const max = Math.max(...accuracies);
    const min = Math.min(...accuracies);
    const diff = max - min;
    return diff >= 15 ? { diff, max, min } : null;
  }, [classroomsOfSelectedGrade]);

  if (state === "off") return <PanelShell title="Escuela"><NotConfigured /></PanelShell>;
  const years = [...new Set(classrooms.map((c) => c.school_year))].sort((a, b) => b - a);
  const closed = new Set(cycles.filter((c) => c.status === "closed").map((c) => c.school_year));

  const planDef = getPlan(school?.plan);
  const canViewDirectivo = puedeUsar(school, "vista_directivo");
  const canCompareAulas = puedeUsar(school, "comparacion_aulas");
  const maxAulas = limiteDe(school, "aulas");
  const maxAlumnos = limiteDe(school, "alumnos");

  return (
    <PanelShell
      title={`🏫 ${school?.name ?? "Escuela"}`}
      subtitle={school ? `Código ${school.code} · ${planDef.badge}` : undefined}
      back={{ href: "/docente", label: "Mis aulas" }}
    >
      {error ? (
        <Panel><ErrorNote error={error} /></Panel>
      ) : !school ? (
        <Panel>Cargando…</Panel>
      ) : (
        <div className="flex flex-col gap-5">
          {msg && <p className="rounded-xl bg-white/90 px-3 py-2 font-bold text-sm text-slate-800">{msg}</p>}

          {/* 1. Banner de Plan institucional y límites */}
          <div className="rounded-2xl border-2 border-amber-800/15 bg-white/80 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-slate-900 text-base">{planDef.badge}</span>
                <span className="text-xs bg-amber-100 text-amber-900 font-semibold px-2 py-0.5 rounded-full border border-amber-300">
                  {school.plan ?? "piloto_gratuito"}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 max-w-xl">{planDef.description}</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-700 bg-amber-50/80 px-3 py-2 rounded-xl border border-amber-200/60 shrink-0">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Aulas</span>
                <span className="font-black text-slate-900 text-sm">
                  {classrooms.length} / {maxAulas === Infinity ? "∞" : maxAulas}
                </span>
              </div>
              <div className="h-6 w-px bg-amber-200" />
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Alumnos</span>
                <span className="font-black text-slate-900 text-sm">
                  {totalSchoolStudents} / {maxAlumnos === Infinity ? "∞" : maxAlumnos}
                </span>
              </div>
            </div>
          </div>

          {/* 2. Vista de Directivo (Multi-aula) */}
          {canViewDirectivo ? (
            <div className="flex flex-col gap-4">
              <Panel>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                    <span>🧭</span> Resumen General de la Escuela
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">Ciclos activos y vigentes</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="rounded-xl bg-amber-50/70 border border-amber-800/15 py-2.5 px-2">
                    <p className="text-xl font-black text-slate-900">{classrooms.length}</p>
                    <p className="text-[11px] text-slate-600 mt-0.5">Aulas activas</p>
                  </div>
                  <div className="rounded-xl bg-amber-50/70 border border-amber-800/15 py-2.5 px-2">
                    <p className="text-xl font-black text-slate-900">{totalSchoolStudents}</p>
                    <p className="text-[11px] text-slate-600 mt-0.5">Alumnos matriculados</p>
                  </div>
                  <div className="rounded-xl bg-amber-50/70 border border-amber-800/15 py-2.5 px-2">
                    <p className="text-xl font-black text-emerald-700">
                      {totalActive7d}
                      <span className="text-xs text-slate-500 font-normal ml-1">
                        ({totalSchoolStudents > 0 ? Math.round((totalActive7d / totalSchoolStudents) * 100) : 0}%)
                      </span>
                    </p>
                    <p className="text-[11px] text-slate-600 mt-0.5">Activos (últimos 7d)</p>
                  </div>
                  <div className="rounded-xl bg-amber-50/70 border border-amber-800/15 py-2.5 px-2">
                    <p className="text-xl font-black text-indigo-700">{avgSchoolAccuracy}%</p>
                    <p className="text-[11px] text-slate-600 mt-0.5">Aciertos promedio</p>
                  </div>
                </div>
                {totalPracticeMinutes > 0 && (
                  <p className="text-[11px] text-slate-500 text-right mt-2">
                    ⏱️ Tiempo acumulado en la plataforma: {Math.round(totalPracticeMinutes / 60)} horas de práctica
                  </p>
                )}
              </Panel>

              {/* 3. Comparación entre divisiones del mismo grado */}
              {canCompareAulas ? (
                <Panel>
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                    <div>
                      <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                        <span>📊</span> Comparación entre aulas del mismo grado
                      </h3>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Permite a la dirección monitorear la equidad pedagógica y avance entre divisiones paralelas.
                      </p>
                    </div>
                    {/* Selector de grado */}
                    <div className="flex gap-1">
                      {gradesInSchool.map((g) => (
                        <button
                          key={g}
                          onClick={() => setSelectedGradeTab(g)}
                          className={`rounded-full px-3 py-1 text-xs font-bold border transition ${
                            selectedGradeTab === g
                              ? "bg-amber-500 text-white border-amber-600 shadow-sm"
                              : "bg-white/80 text-slate-700 border-slate-200 hover:bg-white"
                          }`}
                        >
                          {g}.º grado
                        </button>
                      ))}
                    </div>
                  </div>

                  {classroomsOfSelectedGrade.length === 0 ? (
                    <p className="text-xs text-slate-500 italic py-3 text-center">
                      No hay aulas registradas para {selectedGradeTab}.º grado.
                    </p>
                  ) : classroomsOfSelectedGrade.length === 1 ? (
                    <div className="rounded-xl bg-amber-50/50 border border-amber-200 p-3 text-xs text-slate-600 flex items-center justify-between">
                      <span>Solo hay una división en {selectedGradeTab}.º grado ({classroomsOfSelectedGrade[0].name}).</span>
                      <span className="text-slate-500 font-medium">
                        {classroomsOfSelectedGrade[0].students} alumnos · {classroomsOfSelectedGrade[0].avg_accuracy_pct ?? 0}% aciertos
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {/* Alerta de brecha pedagógica */}
                      {gradeGap && (
                        <div className="rounded-xl border border-amber-400 bg-amber-50/90 p-3 text-xs text-amber-950 flex items-start gap-2 shadow-sm">
                          <span className="text-base">💡</span>
                          <div>
                            <p className="font-bold">Brecha de rendimiento detectada en {selectedGradeTab}.º grado ({gradeGap.diff} pts de diferencia)</p>
                            <p className="text-amber-900/80 mt-0.5">
                              La división más alta registra {gradeGap.max}% y la más baja {gradeGap.min}%. Sugerencia: coordinar contenidos y compartir estrategias de refuerzo entre los docentes de grado.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Tabla comparativa */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                              <th className="py-2 px-2">División</th>
                              <th className="py-2 px-2">Docente(s)</th>
                              <th className="py-2 px-2 text-center">Alumnos</th>
                              <th className="py-2 px-2 text-center">Activos 7d</th>
                              <th className="py-2 px-2 text-right">Aciertos %</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {classroomsOfSelectedGrade.map((c) => {
                              const accPct = c.avg_accuracy_pct ?? 0;
                              return (
                                <tr key={c.id} className="hover:bg-slate-50/60 transition">
                                  <td className="py-2.5 px-2 font-bold text-slate-900">
                                    <Link href={`/docente/aula?id=${c.id}`} className="hover:underline">
                                      {c.name}
                                    </Link>
                                  </td>
                                  <td className="py-2.5 px-2 text-slate-600">
                                    {c.teachers.length > 0
                                      ? c.teachers.map((t) => t.display_name || t.email).join(", ")
                                      : <span className="opacity-50">Sin docente</span>}
                                  </td>
                                  <td className="py-2.5 px-2 text-center font-semibold">{c.students}</td>
                                  <td className="py-2.5 px-2 text-center">
                                    <span className="rounded-full bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 text-[11px]">
                                      {c.active_students_7d ?? 0}
                                    </span>
                                  </td>
                                  <td className="py-2.5 px-2 text-right font-black">
                                    <span className={accPct >= 85 ? "text-emerald-700" : accPct >= 70 ? "text-amber-700" : "text-rose-700"}>
                                      {accPct}%
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      {/* Gráfico comparativo de barras simples */}
                      <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-3">
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                          Comparativa visual de aciertos (%)
                        </p>
                        <div className="flex flex-col gap-2">
                          {classroomsOfSelectedGrade.map((c) => {
                            const accPct = c.avg_accuracy_pct ?? 0;
                            const barColor = accPct >= 85 ? "bg-emerald-500" : accPct >= 70 ? "bg-amber-500" : "bg-rose-500";
                            return (
                              <div key={c.id} className="flex items-center gap-2 text-xs">
                                <span className="w-16 font-bold truncate text-slate-800 text-right">{c.name}</span>
                                <div className="flex-1 bg-slate-200 rounded-full h-4 overflow-hidden relative">
                                  <div
                                    className={`${barColor} h-full rounded-full transition-all duration-500`}
                                    style={{ width: `${Math.max(5, accPct)}%` }}
                                  />
                                </div>
                                <span className="w-10 font-black text-slate-900 text-right">{accPct}%</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </Panel>
              ) : (
                <div className="rounded-2xl border border-amber-300 bg-amber-50/80 p-4 text-xs text-amber-900 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-slate-900">📊 Comparación pedagógica entre aulas</p>
                    <p className="text-slate-600 mt-0.5">{planUpgradeNotice("comparacion_aulas").message}</p>
                  </div>
                  <span className="text-xs bg-amber-200 text-amber-950 font-bold px-2.5 py-1 rounded-lg shrink-0">
                    Plan Escuela
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-amber-200 bg-white/70 p-4 text-xs text-slate-700 flex items-center justify-between gap-3 shadow-sm">
              <div>
                <p className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <span>🏛️</span> {planUpgradeNotice("vista_directivo").title}
                </p>
                <p className="text-slate-600 mt-1">{planUpgradeNotice("vista_directivo").message}</p>
              </div>
              <span className="text-xs bg-amber-100 text-amber-950 font-bold px-3 py-1.5 rounded-xl border border-amber-300 shrink-0">
                Plan Escuela / Distrito
              </span>
            </div>
          )}

          {/* 4. Formulario de creación de aula con control de cupos */}
          <NewClassroom
            schoolId={school.id}
            currentCount={classrooms.length}
            maxAllowed={maxAulas}
            planName={planDef.name}
            onCreate={(g, d, y) => {
              if (classrooms.length >= maxAulas) {
                alert(`Tu escuela alcanzó el cupo máximo de ${maxAulas} aulas del ${planDef.name}. Para agregar más divisiones, consultá por la ampliación al Plan Escuela o Distrito.`);
                return;
              }
              act(
                () => platform().rpc("create_classroom", { p_school: school.id, p_grade: g, p_division: d, p_year: y }),
                "Aula creada."
              );
            }}
          />

          {/* 5. Aulas por ciclo */}
          {years.map((y) => (
            <Panel key={y}>
              <div className="flex items-center justify-between gap-2 mb-2">
                <p className="font-black text-lg">
                  Ciclo {y} {closed.has(y) ? "🔒 cerrado" : ""}
                </p>
                {!closed.has(y) && (
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          `¿Cerrar el ciclo ${y}? Se conserva todo el historial, pero ya no se registran resultados nuevos en ese ciclo. Después podés promover a los alumnos.`
                        )
                      )
                        void act(
                          () => platform().rpc("close_school_year", { p_school: school.id, p_year: y }),
                          `Ciclo ${y} cerrado.`
                        );
                    }}
                    className="rounded-lg bg-slate-800 text-white text-xs font-bold px-3 py-1.5"
                  >
                    Cerrar ciclo lectivo
                  </button>
                )}
              </div>
              <ul className="flex flex-col gap-2">
                {classrooms
                  .filter((c) => c.school_year === y)
                  .map((c) => (
                    <ClassroomRow
                      key={c.id}
                      c={c}
                      disabled={closed.has(y)}
                      onAssign={(email) =>
                        act(
                          () => platform().rpc("assign_teacher", { p_classroom: c.id, p_email: email }),
                          `Docente asignado a ${c.name}.`
                        )
                      }
                      onUnassign={(t) =>
                        act(
                          () => platform().rpc("unassign_teacher", { p_classroom: c.id, p_teacher: t }),
                          "Docente quitado del aula."
                        )
                      }
                    />
                  ))}
              </ul>
            </Panel>
          ))}

          {/* 6. Traslado de alumnos entre escuelas */}
          <Transfer
            classrooms={classrooms.filter((c) => !closed.has(c.school_year))}
            onTransfer={(code, target) =>
              act(
                () => platform().rpc("transfer_student", { p_access_code: code, p_target: target }),
                "Alumno incorporado a la escuela con todo su historial."
              )
            }
          />
        </div>
      )}
    </PanelShell>
  );
}

// Grados que ya tienen mundos en el juego (ver GRADES en src/lib/grades.ts).
const GRADOS_CON_MUNDOS = [1, 2, 3, 4];

function NewClassroom({
  currentCount,
  maxAllowed,
  planName,
  onCreate,
}: {
  schoolId: string;
  currentCount: number;
  maxAllowed: number;
  planName: string;
  onCreate: (grade: number, division: string, year: number) => void;
}) {
  const [grade, setGrade] = useState(3);
  const [division, setDivision] = useState("A");
  const [year, setYear] = useState(new Date().getFullYear());

  const atLimit = currentCount >= maxAllowed;

  return (
    <Panel>
      <div className="flex items-center justify-between mb-2">
        <p className="font-black">➕ Nueva aula</p>
        {atLimit && (
          <span className="text-xs bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full border border-rose-300">
            Límite alcanzado ({currentCount}/{maxAllowed})
          </span>
        )}
      </div>

      {atLimit && (
        <p className="text-xs text-rose-800/90 mb-3 bg-rose-50 border border-rose-200 p-2.5 rounded-xl">
          Tu escuela alcanzó el cupo máximo de {maxAllowed} aulas del {planName}. Para agregar más divisiones, consultá por la ampliación al Plan Escuela o Distrito.
        </p>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!atLimit) onCreate(grade, division, year);
        }}
        className="flex flex-wrap items-end gap-2 text-sm"
      >
        <label className="flex flex-col">
          Grado
          <select
            disabled={atLimit}
            value={grade}
            onChange={(e) => setGrade(Number(e.target.value))}
            className="rounded-lg border px-2 py-1 disabled:opacity-50"
          >
            {[1, 2, 3, 4, 5, 6, 7].map((g) => (
              <option key={g} value={g}>
                {g}.º{GRADOS_CON_MUNDOS.includes(g) ? "" : " (próximamente)"}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col">
          División
          <input
            disabled={atLimit}
            value={division}
            maxLength={10}
            onChange={(e) => setDivision(e.target.value)}
            className="w-20 rounded-lg border px-2 py-1 disabled:opacity-50"
            placeholder="A"
          />
        </label>
        <label className="flex flex-col">
          Ciclo
          <input
            disabled={atLimit}
            type="number"
            min={2000}
            max={2100}
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="w-24 rounded-lg border px-2 py-1 disabled:opacity-50"
          />
        </label>
        <button
          disabled={atLimit}
          className="rounded-xl bg-emerald-600 text-white font-bold px-4 py-2 disabled:opacity-50"
        >
          Crear aula
        </button>
      </form>
    </Panel>
  );
}

function ClassroomRow({
  c,
  disabled,
  onAssign,
  onUnassign,
}: {
  c: ClassroomInfo;
  disabled: boolean;
  onAssign: (email: string) => void;
  onUnassign: (teacherId: string) => void;
}) {
  const [email, setEmail] = useState("");
  return (
    <li className="rounded-xl bg-white/60 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Link href={`/docente/aula?id=${c.id}`} className="font-black text-base underline decoration-dotted">
            {c.name}
          </Link>
          <span>
            {c.students} {c.students === 1 ? "alumno" : "alumnos"}
          </span>
          {c.is_legacy_pilot && <span className="text-xs rounded bg-amber-200 px-1 font-bold text-amber-900">aula piloto</span>}
        </div>
        {/* Métricas rápidas de la división */}
        <div className="flex items-center gap-3 text-xs">
          {c.active_students_7d !== undefined && c.active_students_7d > 0 && (
            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              ⚡ {c.active_students_7d} activos (7d)
            </span>
          )}
          {c.avg_accuracy_pct !== undefined && c.avg_accuracy_pct > 0 && (
            <span className="font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              🎯 {c.avg_accuracy_pct}% aciertos
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-1 mt-1">
        {c.teachers.length === 0 && <span className="text-xs opacity-70">Sin docente asignado.</span>}
        {c.teachers.map((t) => (
          <span key={t.teacher_id} className="rounded-full bg-sky-100 px-2 py-0.5 text-xs">
            👩‍🏫 {t.display_name || t.email}
            <button onClick={() => onUnassign(t.teacher_id)} className="ml-1 text-rose-600" title="Quitar del aula">
              ✕
            </button>
          </span>
        ))}
      </div>
      {!disabled && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (email.trim()) onAssign(email.trim());
            setEmail("");
          }}
          className="flex gap-1 mt-1"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email del docente"
            className="flex-1 rounded-lg border px-2 py-1 text-xs"
          />
          <button className="rounded-lg bg-sky-600 text-white text-xs font-bold px-2">Asignar</button>
        </form>
      )}
    </li>
  );
}

function Transfer({ classrooms, onTransfer }: { classrooms: ClassroomInfo[]; onTransfer: (code: string, target: string) => void }) {
  const [code, setCode] = useState("");
  const [target, setTarget] = useState("");
  return (
    <Panel>
      <p className="font-black mb-1">🚚 Recibir un alumno de otra escuela</p>
      <p className="text-xs mb-2">
        Con el código del alumno (se lo da la familia o la escuela anterior). Conserva su identidad, su avatar y todo su
        historial; la escuela anterior deja de verlo desde hoy.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (code && target) onTransfer(code.trim().toUpperCase(), target);
        }}
        className="flex flex-wrap gap-2 text-sm"
      >
        <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Código del alumno" className="rounded-lg border px-2 py-1 font-mono uppercase" />
        <select value={target} onChange={(e) => setTarget(e.target.value)} className="rounded-lg border px-2 py-1">
          <option value="">Aula…</option>
          {classrooms.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} · {c.school_year}
            </option>
          ))}
        </select>
        <button className="rounded-xl bg-emerald-600 text-white font-bold px-3 py-1.5">Incorporar</button>
      </form>
    </Panel>
  );
}
