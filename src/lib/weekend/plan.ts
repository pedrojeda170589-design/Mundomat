// Plan de la "Aventura de fin de semana": 10 actividades por día (sábado y
// domingo), con dificultad progresiva, que alternan entre un repertorio de
// juegos de memoria:
//   - "memoria-secuencia": Memoria Numérica (cartas fijas + secuencias);
//   - "memorama-imagenes": pares de dibujos iguales (sin leer);
//   - "memorama-conceptos": pares palabra ↔ significado de una materia.
//
// Arquitectura modular: para sumar otro juego (ordenar números, completar
// el que falta, mayor/menor, intruso, series descendentes...) se agrega su
// `kind` acá, sus casilleros en DAY_SLOTS y su componente en
// src/components/weekend/registry.ts.

import { getArgentinaDate } from "@/lib/seasons";
import {
  CONCEPT_PAIRS,
  IMAGE_SETS,
  SUBJECT_ROTATION,
} from "@/lib/weekend/memoramaData";
import { SUBJECT_INFO } from "@/types";
import {
  SequenceParams,
  buildSequence,
  pick,
  seededRandom,
  shuffledPositions,
} from "@/lib/weekend/sequence";

export type WeekendGameKind = "memoria-secuencia" | "memorama-imagenes" | "memorama-conceptos";
export type WeekendDay = "sabado" | "domingo";

// Carta de memorama: dos cartas con el mismo `pairId` forman pareja.
export interface MemoCard {
  pairId: number;
  kind: "image" | "text";
  value: string; // ruta de imagen o texto
  label: string;
}

export interface WeekendActivity {
  index: number; // 0..9
  kind: WeekendGameKind;
  title: string;
  points: 1 | 2 | 3; // según dificultad
  // Memoria Numérica
  sequence: SequenceParams;
  values: number[]; // la secuencia, en el orden en que hay que encontrarla
  // Qué valor va en cada lugar de la mesa (las cartas nunca se mueven).
  layout: number[];
  // Memoramas
  memo?: { theme: string; pairs: number; cards: MemoCard[] };
}

export interface WeekendPlan {
  dayKey: string; // "AAAA-MM-DD" (Argentina)
  day: WeekendDay;
  title: string;
  activities: WeekendActivity[];
}

// Un nivel de Memoria Numérica describe rangos posibles; cada día se elige
// una combinación distinta (con semilla por fecha), así el sábado y el
// domingo no son iguales y el juego no se repite exactamente.
export interface SequenceSlot {
  kind: "memoria-secuencia";
  title: string;
  points: 1 | 2 | 3;
  starts: number[];
  steps: number[];
  counts: number[];
}
export interface MemoSlot {
  kind: "memorama-imagenes" | "memorama-conceptos";
  title: string;
  points: 1 | 2 | 3;
  pairs: number;
}
export type DaySlot = SequenceSlot | MemoSlot;

export const seq = (title: string, points: 1 | 2 | 3, starts: number[], steps: number[], counts: number[]): SequenceSlot => ({
  kind: "memoria-secuencia", title, points, starts, steps, counts,
});

// 10 actividades por día, alternando juegos y subiendo la dificultad.
const DAY_SLOTS: DaySlot[] = [
  seq("Descubrí la secuencia", 1, [0], [1], [3]),
  { kind: "memorama-imagenes", title: "Memorama de dibujos", points: 1, pairs: 3 },
  seq("Seguí la secuencia", 1, [0, 1], [1], [4]),
  { kind: "memorama-conceptos", title: "Memorama de palabras", points: 2, pairs: 3 },
  seq("Llegamos al 10", 2, [10, 11, 12, 13, 14, 15], [1], [5]),
  { kind: "memorama-imagenes", title: "Memorama de dibujos", points: 2, pairs: 4 },
  seq("Por los veinte y treinta", 2, [20, 22, 24, 30, 31, 33], [1], [5, 6]),
  { kind: "memorama-conceptos", title: "Memorama de palabras", points: 3, pairs: 4 },
  seq("Saltos de 2", 3, [10, 12, 14, 20, 22], [2], [5]),
  seq("Desafío final", 3, [10, 11, 20, 21, 24, 30, 33], [2, 3], [5, 6]),
];

// El domingo sube un poquito la dificultad (una carta o una pareja más en
// algunas actividades), para que no sea "el mismo juego" que el sábado.
const SUNDAY_HARDER = new Set([2, 5, 8]);

export const ACTIVITIES_PER_DAY = DAY_SLOTS.length;
export const PERFECT_BONUS = 1; // +1 si se resuelve sin errores
export const FINAL_BONUS = 5; // al completar las 10

function dayNumber(dayKey: string): number {
  return Math.floor(Date.parse(`${dayKey}T12:00:00Z`) / 86_400_000);
}

function buildMemo(slot: MemoSlot, themeIndex: number, rand: () => number, pairs: number) {
  const pool: MemoCard[][] = [];
  let theme: string;
  if (slot.kind === "memorama-imagenes") {
    const set = IMAGE_SETS[themeIndex % IMAGE_SETS.length];
    theme = set.title;
    const chosen = shuffledPositions(rand, set.cards.length).slice(0, pairs).map((i) => set.cards[i]);
    chosen.forEach((c, pairId) => {
      const card: MemoCard = { pairId, kind: "image", value: c.src, label: c.label };
      pool.push([card, { ...card }]);
    });
  } else {
    const subject = SUBJECT_ROTATION[themeIndex % SUBJECT_ROTATION.length];
    theme = SUBJECT_INFO[subject].label;
    const all = CONCEPT_PAIRS[subject];
    const chosen = shuffledPositions(rand, all.length).slice(0, pairs).map((i) => all[i]);
    chosen.forEach((p, pairId) => {
      pool.push([
        { pairId, kind: "text", value: p.left, label: p.left },
        { pairId, kind: "text", value: p.right, label: p.right },
      ]);
    });
  }
  const flat = pool.flat();
  const order = shuffledPositions(rand, flat.length);
  return { theme, pairs, cards: order.map((i) => flat[i]) };
}

// Arma una actividad a partir de su casillero. `seedKey` fija el azar (el
// mismo casillero con la misma semilla da siempre la misma mesa) y
// `themeIndex` elige el tema del memorama.
export function buildActivityFromSlot(
  slot: DaySlot,
  seedKey: string,
  index: number,
  themeIndex: number,
  harder = 0
): WeekendActivity {
  const rand = seededRandom(`${seedKey}#${index}`);
  if (slot.kind === "memoria-secuencia") {
    const sequence: SequenceParams = {
      start: pick(rand, slot.starts),
      step: pick(rand, slot.steps),
      count: pick(rand, slot.counts) + harder,
    };
    const values = buildSequence(sequence);
    const positions = shuffledPositions(rand, values.length);
    return {
      index,
      kind: slot.kind,
      title: slot.title,
      points: slot.points,
      sequence,
      values,
      layout: positions.map((i) => values[i]),
    };
  }
  return {
    index,
    kind: slot.kind,
    title: slot.title,
    points: slot.points,
    sequence: { start: 0, step: 1, count: 0 },
    values: [],
    layout: [],
    memo: buildMemo(slot, themeIndex, rand, slot.pairs + harder),
  };
}

export function buildWeekendPlan(dayKey: string, day: WeekendDay): WeekendPlan {
  const activities = DAY_SLOTS.map((slot, index) =>
    buildActivityFromSlot(
      slot,
      dayKey,
      index,
      dayNumber(dayKey) + Math.floor(index / 2),
      day === "domingo" && SUNDAY_HARDER.has(index) ? 1 : 0
    )
  );
  return {
    dayKey,
    day,
    title: day === "sabado" ? "Desafío del sábado" : "Desafío del domingo",
    activities,
  };
}

export function getWeekendDay(now: Date = new Date()): { day: WeekendDay; dayKey: string } | null {
  const d = getArgentinaDate(now);
  const dow = new Date(Date.UTC(d.year, d.month - 1, d.day)).getUTCDay();
  if (dow !== 0 && dow !== 6) return null;
  const dayKey = `${d.year}-${String(d.month).padStart(2, "0")}-${String(d.day).padStart(2, "0")}`;
  return { day: dow === 6 ? "sabado" : "domingo", dayKey };
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
