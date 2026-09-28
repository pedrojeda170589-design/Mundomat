// Plan de la "Aventura de fin de semana": 10 actividades por día (sábado y
// domingo), con dificultad progresiva.
//
// Arquitectura modular: cada actividad tiene un `kind` (tipo de juego). Por
// ahora existe solo "memoria-secuencia" (memoria + secuencia numérica), pero
// se pueden sumar otros tipos (ordenar números, completar el que falta,
// mayor/menor, número intruso, series descendentes...) agregando su `kind`
// acá, sus niveles en LEVELS y su componente en
// src/components/weekend/registry.ts.

import { getArgentinaDate } from "@/lib/seasons";
import {
  SequenceParams,
  buildSequence,
  pick,
  seededRandom,
  shuffledPositions,
} from "@/lib/weekend/sequence";

export type WeekendGameKind = "memoria-secuencia";
export type WeekendDay = "sabado" | "domingo";

export interface WeekendActivity {
  index: number; // 0..9
  kind: WeekendGameKind;
  title: string;
  points: 1 | 2 | 3; // según dificultad
  sequence: SequenceParams;
  values: number[]; // la secuencia, en el orden en que hay que encontrarla
  // Qué valor va en cada lugar de la mesa (las cartas nunca se mueven).
  layout: number[];
}

export interface WeekendPlan {
  dayKey: string; // "AAAA-MM-DD" (Argentina)
  day: WeekendDay;
  title: string;
  activities: WeekendActivity[];
}

// Un nivel describe rangos posibles; cada día se elige una combinación
// distinta (con semilla por fecha), así el sábado y el domingo no son
// iguales y el juego no se repite exactamente de un finde a otro.
interface LevelTemplate {
  title: string;
  points: 1 | 2 | 3;
  starts: number[];
  steps: number[];
  counts: number[];
}

const LEVELS: LevelTemplate[] = [
  { title: "Descubrí la secuencia", points: 1, starts: [0], steps: [1], counts: [3] },
  { title: "Seguí la secuencia", points: 1, starts: [0, 1], steps: [1], counts: [4] },
  { title: "Cinco cartas", points: 1, starts: [0, 1, 2], steps: [1], counts: [5] },
  { title: "Números que siguen", points: 2, starts: [1, 2, 3, 4, 5], steps: [1], counts: [5] },
  { title: "Llegamos al 10", points: 2, starts: [10, 11, 12, 13, 14, 15], steps: [1], counts: [5] },
  { title: "Por los veinte", points: 2, starts: [20, 21, 22, 23, 24, 25], steps: [1], counts: [5] },
  { title: "Por los treinta", points: 2, starts: [30, 31, 32, 33, 34, 35], steps: [1], counts: [5, 6] },
  { title: "Saltos de 2", points: 3, starts: [10, 12, 14, 20, 22], steps: [2], counts: [5] },
  { title: "Saltos de 3", points: 3, starts: [10, 11, 12, 13, 20], steps: [3], counts: [5] },
  { title: "Desafío final", points: 3, starts: [20, 21, 24, 30, 33], steps: [2, 3], counts: [5, 6] },
];

// El domingo sube un poquito la dificultad en algunos niveles (una carta
// más), para que no sea "el mismo juego" que el sábado.
const SUNDAY_EXTRA_CARD = new Set([2, 5, 8]);

export const ACTIVITIES_PER_DAY = LEVELS.length;
export const PERFECT_BONUS = 1; // +1 si se resuelve sin errores
export const FINAL_BONUS = 5; // al completar las 10

export function getWeekendDay(now: Date = new Date()): { day: WeekendDay; dayKey: string } | null {
  const d = getArgentinaDate(now);
  const dow = new Date(Date.UTC(d.year, d.month - 1, d.day)).getUTCDay();
  if (dow !== 0 && dow !== 6) return null;
  const dayKey = `${d.year}-${String(d.month).padStart(2, "0")}-${String(d.day).padStart(2, "0")}`;
  return { day: dow === 6 ? "sabado" : "domingo", dayKey };
}

export function buildWeekendPlan(dayKey: string, day: WeekendDay): WeekendPlan {
  const activities = LEVELS.map((lvl, index): WeekendActivity => {
    const rand = seededRandom(`${dayKey}#${index}`);
    let count = pick(rand, lvl.counts);
    if (day === "domingo" && SUNDAY_EXTRA_CARD.has(index)) count += 1;
    const sequence: SequenceParams = {
      start: pick(rand, lvl.starts),
      step: pick(rand, lvl.steps),
      count,
    };
    const values = buildSequence(sequence);
    const positions = shuffledPositions(rand, values.length);
    return {
      index,
      kind: "memoria-secuencia",
      title: lvl.title,
      points: lvl.points,
      sequence,
      values,
      layout: positions.map((i) => values[i]),
    };
  });
  return {
    dayKey,
    day,
    title: day === "sabado" ? "Desafío del sábado" : "Desafío del domingo",
    activities,
  };
}

// Puntos de una actividad resuelta.
export function scoreActivity(activity: WeekendActivity, errors: number): {
  points: number;
  perfectBonus: number;
} {
  const perfectBonus = errors === 0 ? PERFECT_BONUS : 0;
  return { points: activity.points + perfectBonus, perfectBonus };
}

// Para mostrar en la pantalla de fin: el máximo posible del día.
export function maxPointsForDay(plan: WeekendPlan): number {
  return plan.activities.reduce((s, a) => s + a.points + PERFECT_BONUS, 0) + FINAL_BONUS;
}
