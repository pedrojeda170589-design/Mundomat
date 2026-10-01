// Constantes, tipos y funciones compartidas para el aula abierta de 3.º grado.
// Este archivo se puede importar tanto en el servidor como en componentes de cliente ("use client").

export const OPEN_CLASSROOM_ID = "abierta-3";

// En la prueba se pueden superar hasta 5 mundos de cada materia. La prueba
// termina a los 30 días o cuando se completan los 5 mundos de cada materia.
export const TRIAL_WORLDS_PER_SUBJECT = 5;

export interface OpenClassroomConfig {
  open: boolean;
  capacity: number;
  trialDays: number;
}

export const DEFAULT_OPEN_CLASSROOM_CONFIG: OpenClassroomConfig = {
  open: true,
  capacity: 100,
  trialDays: 30,
};

export const RATING_LIKED_OPTIONS = [
  "Los mundos",
  "Los avatares",
  "La aventura del finde",
  "Los duelos",
  "Aprender jugando",
  "Las monedas y la tienda",
] as const;

export type RatingLikedOption = (typeof RATING_LIKED_OPTIONS)[number];

export interface OpenClassroomRating {
  code: string;
  at: string;
  stars: number; // 1..5
  liked: string[];
  comment?: string;
}

// Los alumnos del aula abierta vienen de distintas familias y escuelas y no
// se conocen: en esa aula no hay buzón ni duelos entre compañeros.
export function isOpenClassroomStudent(student: { classroomId?: string } | null | undefined): boolean {
  return student?.classroomId === OPEN_CLASSROOM_ID;
}

// Duración de la prueba de un alumno, en días (para los textos).
export function getTrialLengthDays(student: { trialStartedAt?: string; trialEndsAt?: string } | null | undefined): number {
  const a = new Date(student?.trialStartedAt ?? "").getTime();
  const b = new Date(student?.trialEndsAt ?? "").getTime();
  if (!Number.isFinite(a) || !Number.isFinite(b) || b <= a) return DEFAULT_OPEN_CLASSROOM_CONFIG.trialDays;
  return Math.round((b - a) / (24 * 60 * 60 * 1000));
}

// Devuelve true si el período de prueba del alumno ya venció.
export function isTrialExpired(
  student: { trialEndsAt?: string } | null | undefined,
  nowMs: number = Date.now()
): boolean {
  if (!student?.trialEndsAt) return false;
  const ends = new Date(student.trialEndsAt).getTime();
  return Number.isFinite(ends) && nowMs > ends;
}

// Devuelve los días restantes de la prueba (redondeado hacia arriba, mínimo 0).
export function getTrialDaysLeft(
  trialEndsAt?: string,
  nowMs: number = Date.now()
): number {
  if (!trialEndsAt) return 0;
  const ends = new Date(trialEndsAt).getTime();
  if (!Number.isFinite(ends)) return 0;
  const diffMs = ends - nowMs;
  if (diffMs <= 0) return 0;
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

// La valoración se habilita cuando la prueba venció, o desde 3 días antes del
// vencimiento (para quienes no vuelvan a entrar).
export function canRateTrial(
  student: { trialEndsAt?: string } | null | undefined,
  nowMs: number = Date.now()
): boolean {
  if (!student?.trialEndsAt) return false;
  if (isTrialExpired(student, nowMs)) return true;
  return getTrialDaysLeft(student.trialEndsAt, nowMs) <= 3;
}

// --- Informe final de la prueba --------------------------------------------

export interface TrialReportSubject {
  subject: string;
  label: string;
  emoji: string;
  completedWorlds: string[]; // nombres de los mundos superados
  answered: number; // respuestas dadas
  correct: number;
  pct: number | null; // % de aciertos (null si no jugó)
}

export interface TrialReport {
  code: string;
  name: string;
  createdAt: string;
  startedAt?: string;
  endedReason: "dias" | "mundos";
  daysPlayed: number; // días distintos en los que jugó
  totalCompleted: number;
  totalAnswered: number;
  totalCorrect: number;
  bySubject: TrialReportSubject[];
  strengths: string[]; // mundos con muy buen resultado
  toReinforce: { world: string; subject: string; pct: number; tip: string }[];
  notExplored: string[]; // materias que no llegó a jugar
}

// Mundos de una materia que todavía cuentan para el límite de la prueba.
export function trialSubjectCounts(
  completedWorlds: number[],
  subjectOf: (worldId: number) => string | undefined
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const id of completedWorlds) {
    const s = subjectOf(id);
    if (s) counts[s] = (counts[s] ?? 0) + 1;
  }
  return counts;
}
