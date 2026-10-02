"use client";

import { StudentProgress, SUBJECT_INFO, WorldSubject } from "@/types";
import { getGrade } from "@/lib/grades";
import { GRADE1_SKILLS } from "@/lib/grade1/skills";
import { GRADE1_WORLDS } from "@/lib/grade1/worlds";
import { SKILL_LEVEL_INFO, SkillLevel, skillLevel } from "@/lib/progressLogic";

// Informe por habilidad para el docente (1.º y 2.º grado): qué sabe, qué está
// aprendiendo, dónde tiene dificultades y qué conviene practicar. Los
// niveles describen la práctica en la app; no son una nota.
export default function SkillReport({ progress, grade = 1 }: { progress: StudentProgress; grade?: number }) {
  const g = getGrade(grade);
  const skills = g.skills ?? (grade === 1 ? GRADE1_SKILLS : []);
  const worldsForGrade = g.worlds.length ? g.worlds : GRADE1_WORLDS;
  const rows = skills.map((s) => {
    const st = progress.skillStats?.[s.id];
    const level = skillLevel(st);
    const recentPct = st && st.recent.length ? Math.round((st.recent.reduce((a, b) => a + b, 0) / st.recent.length) * 100) : null;
    return { skill: s, level, answers: st ? st.c + st.i : 0, recentPct };
  });
  const by = (lv: SkillLevel[]) => rows.filter((r) => lv.includes(r.level));
  const sabe = by(["dominado"]);
  const aprendiendo = by(["practicando", "iniciando"]);
  const dificultad = by(["aprendiendo"]);
  // Qué practicar: primero lo que cuesta; si no hay, lo que sigue en el
  // orden de cada materia y todavía no empezó.
  const practicar = dificultad.length
    ? dificultad
    : rows.filter((r) => r.level === "sin-iniciar").slice(0, 3);

  const subjects = Object.keys(SUBJECT_INFO) as WorldSubject[];
  const done = new Set(progress.completedWorlds);
  const pending = new Set(progress.worldsPendingReinforcementRetry ?? []);
  const review = new Set(progress.worldsNeedingTeacherReview ?? []);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Box title="🟢 ¿Qué sabe?" color="text-emerald-700" items={sabe.map((r) => r.skill.label)} empty="Todavía ninguna habilidad dominada." />
        <Box title="🟡 ¿Qué está aprendiendo?" color="text-amber-700" items={aprendiendo.map((r) => r.skill.label)} empty="—" />
        <Box title="🔴 ¿Dónde tiene dificultades?" color="text-red-700" items={dificultad.map((r) => `${r.skill.label}${r.recentPct !== null ? ` (${r.recentPct}% en lo último)` : ""}`)} empty="No se ven dificultades por ahora." />
        <Box
          title="🎯 ¿Qué debería practicar?"
          color="text-sky-700"
          items={practicar.map((r) => `${r.skill.label}: ${r.skill.practice}`)}
          empty="—"
        />
      </div>

      {subjects.map((subject) => {
        const subjRows = rows.filter((r) => r.skill.subject === subject);
        const worlds = worldsForGrade.filter((w) => w.subject === subject);
        const started = worlds.filter((w) => progress.lastWorldAttemptScore?.[w.id] !== undefined || done.has(w.id));
        return (
          <div key={subject} className="rounded-xl bg-white/60 border border-amber-700/20 p-3">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
              <p className="font-black text-amber-950">
                {SUBJECT_INFO[subject].emoji} {SUBJECT_INFO[subject].label}
              </p>
              <p className="text-xs text-amber-900/80">
                Mundos: {worlds.filter((w) => done.has(w.id)).length} logrados · {worlds.filter((w) => pending.has(w.id)).length} en
                aprendizaje · {worlds.filter((w) => review.has(w.id)).length} necesitan refuerzo · {started.length} iniciados de {worlds.length}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
              {subjRows.map((r) => {
                const info = SKILL_LEVEL_INFO[r.level];
                return (
                  <div key={r.skill.id} className="flex items-center gap-2 text-sm" title={r.skill.description}>
                    <span>{info.emoji}</span>
                    <span className="flex-1 text-amber-950 leading-tight">{r.skill.label}</span>
                    <span className="text-xs font-bold" style={{ color: info.color }}>
                      {info.label}
                      {r.answers > 0 ? ` · ${r.answers} resp.` : ""}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
      <p className="text-[11px] text-amber-900/70">
        Los niveles (sin iniciar → iniciando → aprendiendo → practicando → dominado) se calculan con las últimas respuestas de
        cada habilidad en la app; describen la práctica, no son una calificación.
      </p>
    </div>
  );
}

function Box({ title, color, items, empty }: { title: string; color: string; items: string[]; empty: string }) {
  return (
    <div className="rounded-xl bg-white/60 border border-amber-700/20 p-3">
      <p className={`font-black text-sm mb-1 ${color}`}>{title}</p>
      {items.length ? (
        <ul className="text-sm text-amber-950/90 list-disc pl-5 space-y-0.5">
          {items.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-amber-800/60">{empty}</p>
      )}
    </div>
  );
}
