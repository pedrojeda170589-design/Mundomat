"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AvatarDisplay from "@/components/AvatarDisplay";
import PanelShell, { ErrorNote, NotConfigured, Panel, usePanelSession } from "@/components/platform/PanelShell";
import { platform } from "@/lib/platform/client";
import {
  EnrollmentStatus,
  SKILL_INFO,
  STATUS_LABEL,
  SkillLevel,
  formatMinutes,
  skillLevel,
  subjectEmoji,
  subjectLabel,
} from "@/lib/platform/shared";
import { getWorld } from "@/lib/worlds";
import SkillReportByCode from "@/components/admin/SkillReportByCode";
import DictationReportByCode from "@/components/admin/DictationReportByCode";
import { AvatarAccessories } from "@/types";

interface Student {
  id: string;
  full_name: string;
  nickname: string | null;
  avatar: string | null;
  avatar_accessories: AvatarAccessories | null;
  avatar_background: string | null;
  birth_date: string | null;
  access_code: string;
}
interface Step {
  enrollment_id: string;
  school_year: number;
  grade: number;
  division: string;
  school_name: string;
  classroom_name: string;
  status: EnrollmentStatus;
  start_date: string;
  end_date: string | null;
}
interface YearStat {
  school_year: number;
  subject: string;
  accuracy_pct: number | null;
  activities: number;
  practice_seconds: number;
}
interface WorldStat {
  school_year: number;
  world_id: number;
  subject: string;
  correct: number;
  incorrect: number;
}
interface Attempt {
  world_id: number;
  score_pct: number;
  outcome: string;
  occurred_at: string;
  school_year: number;
}

const OUTCOME: Record<string, string> = {
  completed: "✅ Completó el mundo",
  "pending-retry": "⭐ Superado (falta un repaso)",
  "needs-review": "🧩 A fortalecer",
  review: "🔁 Repaso",
};

// Legajo de Progreso: identidad, trayectoria, evolución por área y qué
// fortalecer. Lo que se ve depende de la base (RLS): quien tiene hoy al
// alumno ve su historia completa; quien lo tuvo antes, solo su período.
export default function StudentRecordPage() {
  const router = useRouter();
  const { state } = usePanelSession();
  const [student, setStudent] = useState<Student | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [years, setYears] = useState<YearStat[]>([]);
  const [worlds, setWorlds] = useState<WorldStat[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [achievements, setAchievements] = useState<{ kind: string; code: string; school_year: number | null }[]>([]);
  const [teachers, setTeachers] = useState<string[]>([]);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    if (state === "anon") router.replace("/docente");
    if (state !== "ready") return;
    const id = new URLSearchParams(window.location.search).get("id");
    if (!id) return;
    const sb = platform();
    (async () => {
      const { data: s, error: e } = await sb.from("students").select("*").eq("id", id).maybeSingle();
      if (e) return setError(e);
      if (!s) return setError(new Error("No tenés acceso a este alumno."));
      setStudent(s);
      const [tr, ys, ws, at, ac] = await Promise.all([
        sb.rpc("student_trajectory", { p_student: id }),
        sb.from("student_subject_year_stats").select("school_year, subject, accuracy_pct, activities, practice_seconds").eq("student_id", id),
        sb.from("student_world_year_stats").select("school_year, world_id, subject, correct, incorrect").eq("student_id", id),
        sb.from("world_attempts").select("world_id, score_pct, outcome, occurred_at, school_year").eq("student_id", id).order("occurred_at", { ascending: false }).limit(12),
        sb.from("achievements").select("kind, code, school_year").eq("student_id", id),
      ]);
      const trajectory = (tr.data ?? []) as Step[];
      setSteps(trajectory);
      setYears((ys.data ?? []) as YearStat[]);
      setWorlds((ws.data ?? []) as WorldStat[]);
      setAttempts((at.data ?? []) as Attempt[]);
      setAchievements(ac.data ?? []);
      const current = trajectory.find((t) => t.status === "active");
      if (current) {
        const { data: enr } = await sb.from("student_enrollments").select("classroom_id").eq("id", current.enrollment_id).maybeSingle();
        if (enr) {
          const { data: t } = await sb.rpc("classroom_teachers", { p_classroom: enr.classroom_id });
          setTeachers(((t ?? []) as { display_name: string }[]).map((x) => x.display_name));
        }
      }
    })();
  }, [state, router]);

  // Evolución: área → [ciclo, %] (sumando todas las aulas del ciclo).
  const evolution = useMemo(() => {
    const acc = new Map<string, Map<number, { c: number; t: number; secs: number }>>();
    for (const y of years) {
      const bySubject = acc.get(y.subject) ?? new Map();
      const cur = bySubject.get(y.school_year) ?? { c: 0, t: 0, secs: 0 };
      if (y.accuracy_pct != null) {
        cur.c += (y.accuracy_pct / 100) * y.activities;
        cur.t += y.activities;
      }
      cur.secs += y.practice_seconds ?? 0;
      bySubject.set(y.school_year, cur);
      acc.set(y.subject, bySubject);
    }
    return [...acc].map(([subject, m]) => ({
      subject,
      years: [...m].sort((a, b) => a[0] - b[0]).map(([year, v]) => ({ year, pct: v.t ? Math.round((v.c / v.t) * 100) : null })),
    }));
  }, [years]);

  // Fortalezas / a reforzar: último ciclo con datos, por mundo (contenido).
  const skills = useMemo(() => {
    const lastYear = Math.max(0, ...worlds.map((w) => w.school_year ?? 0));
    const agg = new Map<number, { correct: number; incorrect: number; subject: string }>();
    for (const w of worlds.filter((x) => x.school_year === lastYear)) {
      const cur = agg.get(w.world_id) ?? { correct: 0, incorrect: 0, subject: w.subject };
      cur.correct += w.correct;
      cur.incorrect += w.incorrect;
      agg.set(w.world_id, cur);
    }
    const order: SkillLevel[] = ["practica-guiada", "necesita-practica", "en-desarrollo", "consolidado", "sin-datos"];
    return {
      year: lastYear,
      items: [...agg]
        .map(([worldId, v]) => ({ worldId, subject: v.subject, level: skillLevel(v.correct, v.incorrect), total: v.correct + v.incorrect }))
        .sort((a, b) => order.indexOf(a.level) - order.indexOf(b.level)),
    };
  }, [worlds]);

  if (state === "off") return <PanelShell title="Legajo"><NotConfigured /></PanelShell>;
  const current = steps.find((s) => s.status === "active");
  const totalPractice = years.reduce((s, y) => s + (y.practice_seconds ?? 0), 0);

  return (
    <PanelShell title="📒 Legajo de progreso" subtitle={student?.full_name} back={{ href: "/docente", label: "Mis aulas" }}>
      {error ? (
        <Panel><ErrorNote error={error} /></Panel>
      ) : !student ? (
        <Panel>Cargando…</Panel>
      ) : (
        <div className="flex flex-col gap-4">
          <Panel className="flex items-center gap-4">
            <AvatarDisplay
              character={student.avatar ?? undefined}
              accessories={student.avatar_accessories ?? undefined}
              background={student.avatar_background ?? undefined}
              className="w-20 h-20 rounded-2xl shrink-0"
              imageSizes="80px"
            />
            <div className="min-w-0 text-sm">
              <p className="text-xl font-black">{student.full_name}</p>
              {student.nickname && <p>Apodo en el juego: {student.nickname}</p>}
              {current ? (
                <p>
                  <b>{current.classroom_name}</b> · Ciclo {current.school_year} · {current.school_name}
                </p>
              ) : (
                <p className="opacity-70">Sin aula activa.</p>
              )}
              {teachers.length > 0 && <p>Docente: {teachers.join(", ")}</p>}
              <p className="opacity-70">Tiempo de práctica registrado: {formatMinutes(totalPractice)}</p>
            </div>
          </Panel>

          <Panel>
            <p className="font-black mb-2">🧭 Trayectoria</p>
            {steps.length === 0 ? (
              <p className="text-sm opacity-70">Sin datos de trayectoria visibles para vos.</p>
            ) : (
              <ol className="flex flex-col gap-1 text-sm">
                {steps.map((s) => (
                  <li key={s.enrollment_id} className="flex flex-wrap gap-x-2">
                    <b>{s.school_year}</b> → {s.classroom_name}
                    <span className="opacity-70">· {s.school_name}</span>
                    <span className={s.status === "active" ? "text-emerald-700 font-bold" : "opacity-70"}>
                      · {STATUS_LABEL[s.status]}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </Panel>

          <Panel>
            <p className="font-black mb-2">📈 Evolución por área</p>
            {evolution.length === 0 ? (
              <p className="text-sm opacity-70">Todavía no hay resultados registrados.</p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                {evolution.map((e) => (
                  <div key={e.subject} className="rounded-xl bg-white/60 px-3 py-2">
                    <p className="font-bold">
                      {subjectEmoji(e.subject)} {subjectLabel(e.subject)}
                    </p>
                    {e.years.map((y) => (
                      <div key={y.year} className="flex items-center gap-2 text-sm">
                        <span className="w-12">{y.year}</span>
                        <span className="flex-1 h-2.5 rounded-full bg-amber-900/10 overflow-hidden">
                          <span className="block h-full bg-emerald-500" style={{ width: `${y.pct ?? 0}%` }} />
                        </span>
                        <b className="w-10 text-right">{y.pct != null ? `${y.pct}%` : "—"}</b>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </Panel>

          {student && steps.some((st) => st.status === "active" && (st.grade === 1 || st.grade === 2)) && (() => {
            const activeGrade = steps.find((st) => st.status === "active" && (st.grade === 1 || st.grade === 2))?.grade ?? 1;
            return (
              <Panel>
                <p className="font-black mb-2">📚 Habilidades de {activeGrade}.º grado</p>
                <SkillReportByCode code={student.access_code} grade={activeGrade} />
              </Panel>
            );
          })()}

          {student && steps.some((st) => st.status === "active" && (st.grade === 2 || st.grade === 3)) && (
            <Panel>
              <p className="font-black mb-2">✍️ Mundo del Dictado (semanal)</p>
              <DictationReportByCode code={student.access_code} />
            </Panel>
          )}

          <Panel>
            <p className="font-black mb-1">🎯 Fortalezas y aspectos a reforzar {skills.year ? `(${skills.year})` : ""}</p>
            <p className="text-xs opacity-70 mb-2">
              Según su práctica en cada mundo de MundoTest26. No es un diagnóstico.
            </p>
            {skills.items.length === 0 ? (
              <p className="text-sm opacity-70">Todavía no hay práctica suficiente.</p>
            ) : (
              <ul className="grid sm:grid-cols-2 gap-1 text-sm">
                {skills.items.map((s) => {
                  const info = SKILL_INFO[s.level];
                  const w = getWorld(s.worldId);
                  return (
                    <li key={s.worldId} className={info.className}>
                      {info.emoji} <b>{w?.name ?? `Mundo ${s.worldId}`}</b> — {info.label}
                    </li>
                  );
                })}
              </ul>
            )}
          </Panel>

          <div className="grid sm:grid-cols-2 gap-4">
            <Panel>
              <p className="font-black mb-2">🗺️ Últimas vueltas de mundos</p>
              {attempts.length === 0 ? (
                <p className="text-sm opacity-70">Sin vueltas registradas.</p>
              ) : (
                <ul className="text-sm flex flex-col gap-1">
                  {attempts.map((a, i) => (
                    <li key={i}>
                      {getWorld(a.world_id)?.emoji} {getWorld(a.world_id)?.name}: <b>{a.score_pct}%</b>{" "}
                      <span className="opacity-80">{OUTCOME[a.outcome] ?? a.outcome}</span>
                      <span className="opacity-60 text-xs"> · {new Date(a.occurred_at).toLocaleDateString("es-AR")}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
            <Panel>
              <p className="font-black mb-2">⭐ Logros</p>
              {achievements.length === 0 ? (
                <p className="text-sm opacity-70">Todavía sin logros registrados.</p>
              ) : (
                <ul className="text-sm flex flex-wrap gap-1.5">
                  {achievements.map((a) => (
                    <li key={`${a.kind}-${a.code}`} className="rounded-full bg-white/70 px-2 py-0.5">
                      {a.kind === "medalla" ? "🏅" : a.kind === "temporada" ? "🎁" : "⭐"} {a.code}
                      {a.school_year ? ` · ${a.school_year}` : ""}
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          </div>
        </div>
      )}
    </PanelShell>
  );
}
