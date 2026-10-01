// Constantes, tipos y funciones compartidas para el aula abierta de 3.º grado.
// Este archivo se puede importar tanto en el servidor como en componentes de cliente ("use client").

export const OPEN_CLASSROOM_ID = "abierta-3";

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
