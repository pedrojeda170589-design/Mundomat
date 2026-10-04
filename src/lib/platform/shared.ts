// Tipos y reglas de la plataforma (se usan en el navegador y el servidor).
import { SUBJECT_INFO, WorldSubject } from "@/types";

export type AppRole = "student" | "teacher" | "family" | "school_admin" | "super_admin";
export type EnrollmentStatus = "active" | "promoted" | "repeated" | "moved" | "transferred" | "withdrawn" | "finished";

export interface Classroom {
  id: string;
  school_id: string;
  name: string;
  grade: number;
  division: string;
  school_year: number;
  enabled_world_ids: number[];
  is_legacy_pilot: boolean;
  active: boolean;
}

export interface School {
  id: string;
  name: string;
  code: string;
  active: boolean;
  plan?: string;
}

export interface SchoolClassroomSummary {
  classroom_id: string;
  classroom_name: string;
  grade: number;
  division: string;
  school_year: number;
  total_students: number;
  active_students_7d: number;
  avg_accuracy_pct: number;
  total_activities: number;
  practice_minutes: number;
}

export const STATUS_LABEL: Record<EnrollmentStatus, string> = {
  active: "En curso",
  promoted: "Promovido/a",
  repeated: "Permanece en el grado",
  moved: "Cambio de aula",
  transferred: "Cambio de escuela",
  withdrawn: "Baja",
  finished: "Ciclo terminado",
};

export function subjectLabel(subject: string): string {
  return SUBJECT_INFO[subject as WorldSubject]?.label ?? subject;
}
export function subjectEmoji(subject: string): string {
  return SUBJECT_INFO[subject as WorldSubject]?.emoji ?? "📘";
}

// Nivel de un contenido según el desempeño registrado en MundoTest26 (no
// es un diagnóstico: describe la práctica dentro de la app).
export type SkillLevel = "consolidado" | "en-desarrollo" | "necesita-practica" | "practica-guiada" | "sin-datos";
export const MIN_ANSWERS_FOR_LEVEL = 4;

export function skillLevel(correct: number, incorrect: number): SkillLevel {
  const total = correct + incorrect;
  if (total < MIN_ANSWERS_FOR_LEVEL) return "sin-datos";
  const pct = (correct / total) * 100;
  if (pct >= 85) return "consolidado";
  if (pct >= 70) return "en-desarrollo";
  if (pct >= 50) return "necesita-practica";
  return "practica-guiada";
}

export const SKILL_INFO: Record<SkillLevel, { emoji: string; label: string; className: string }> = {
  consolidado: { emoji: "🟢", label: "Consolidado", className: "text-emerald-700" },
  "en-desarrollo": { emoji: "🟡", label: "En desarrollo", className: "text-amber-700" },
  "necesita-practica": { emoji: "🟠", label: "Necesita práctica", className: "text-orange-700" },
  "practica-guiada": { emoji: "🔴", label: "Comenzar práctica guiada", className: "text-rose-700" },
  "sin-datos": { emoji: "⚪", label: "Todavía con poca práctica", className: "text-slate-500" },
};

export function formatMinutes(seconds: number): string {
  const m = Math.round(seconds / 60);
  return m < 60 ? `${m} min` : `${Math.floor(m / 60)} h ${m % 60} min`;
}
