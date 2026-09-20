// Contenido del "Desafío Especial" diario: un memorama (juego de memoria)
// temático por materia. Cada día del año usa una materia distinta (rota en
// orden), así todos los alumnos que jueguen ese día tienen el mismo desafío
// — un mini evento compartido, no algo random por alumno.

import {
  COINS_SPECIAL_CHALLENGE,
  COINS_SPECIAL_CHALLENGE_STREAK_MAX_BONUS,
  COINS_SPECIAL_CHALLENGE_STREAK_STEP,
  StudentProgress,
  WorldSubject,
} from "@/types";

export interface MemoryPair {
  left: string;
  right: string;
}

const MATEMATICA_PARES: MemoryPair[] = [
  { left: "6 × 7", right: "42" },
  { left: "8 × 5", right: "40" },
  { left: "9 × 3", right: "27" },
  { left: "100 - 45", right: "55" },
  { left: "1/2 de 20", right: "10" },
  { left: "1 hora", right: "60 minutos" },
];

const LENGUA_PARES: MemoryPair[] = [
  { left: "Feliz", right: "Contento" },
  { left: "Grande", right: "Chico" },
  { left: "Veloz", right: "Rápido" },
  { left: "Sustantivo", right: "Nombra algo" },
  { left: "Verbo", right: "Indica acción" },
  { left: "Trabalenguas", right: "Difícil de decir rápido" },
];

const NATURALES_PARES: MemoryPair[] = [
  { left: "Guanaco", right: "Fauna de la estepa" },
  { left: "Luna llena", right: "Se ve completa" },
  { left: "Agua + sal", right: "Mezcla" },
  { left: "Norte", right: "Punto cardinal" },
  { left: "Cubo", right: "Cuerpo geométrico" },
  { left: "Vibración", right: "Produce sonido" },
];

const SOCIALES_PARES: MemoryPair[] = [
  { left: "Intendente", right: "Gobierno municipal" },
  { left: "Cabildo", right: "Autoridad colonial" },
  { left: "Circuito productivo", right: "Producción → venta" },
  { left: "Patrimonio", right: "Se cuida del pasado" },
  { left: "Zona rural", right: "Campo" },
  { left: "Zona urbana", right: "Ciudad" },
];

export const CHALLENGE_PAIRS: Record<WorldSubject, MemoryPair[]> = {
  matematica: MATEMATICA_PARES,
  lengua: LENGUA_PARES,
  naturales: NATURALES_PARES,
  sociales: SOCIALES_PARES,
};

const SUBJECT_ROTATION: WorldSubject[] = [
  "matematica",
  "lengua",
  "naturales",
  "sociales",
];

function dayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / 86400000);
}

// La materia del desafío de hoy: rota entre las 4 materias según el día del
// año, así es la misma para todos los alumnos ese día.
export function getTodaysChallengeSubject(date: Date = new Date()): WorldSubject {
  return SUBJECT_ROTATION[dayOfYear(date) % SUBJECT_ROTATION.length];
}

export function getTodaysChallengePairs(date: Date = new Date()): MemoryPair[] {
  return CHALLENGE_PAIRS[getTodaysChallengeSubject(date)];
}

// Fecha en formato "YYYY-MM-DD" en horario local, para comparar "mismo día".
export function localDateKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// --- Fin de semana y racha del Desafío Especial ---
//
// El Desafío Especial (con recompensa extra) solo está disponible el
// sábado y el domingo, para que sea "algo especial del finde" y no compita
// con las actividades normales de lunes a viernes.

export function isWeekend(date: Date = new Date()): boolean {
  const day = date.getDay(); // 0 = domingo ... 6 = sábado
  return day === 0 || day === 6;
}

// Identifica a qué fin de semana pertenece una fecha, usando como clave el
// sábado de ese fin de semana. Así el sábado y el domingo de un mismo finde
// comparten la misma clave, sin importar cuál de los dos jugó el alumno.
export function weekendKey(date: Date = new Date()): string {
  const d = new Date(date);
  const daysSinceSaturday = (d.getDay() + 1) % 7; // sáb=0, dom=1, lun=2, ...
  d.setDate(d.getDate() - daysSinceSaturday);
  return localDateKey(d);
}

// ¿`nextKey` es el fin de semana inmediatamente siguiente a `previousKey`
// (7 días después)? Se usa para saber si una racha sigue viva o se cortó
// por saltear un fin de semana completo sin jugar.
export function isConsecutiveWeekend(
  previousKey: string,
  nextKey: string
): boolean {
  const prev = new Date(`${previousKey}T00:00:00`);
  const next = new Date(`${nextKey}T00:00:00`);
  const diffDays = Math.round((next.getTime() - prev.getTime()) / 86400000);
  return diffDays === 7;
}

type StreakProgress = Pick<
  StudentProgress,
  "specialChallengeStreak" | "lastSpecialChallengeWeekendKey"
>;

// Racha que correspondería si el alumno completa el Desafío Especial en
// `date` (pensada para un día de fin de semana). Es pura (sin efectos): la
// usan tanto la vista previa del GET como la acreditación real del POST.
export function computeNextStreak(
  progress: StreakProgress,
  date: Date = new Date()
): number {
  const currentWeekend = weekendKey(date);
  const lastWeekend = progress.lastSpecialChallengeWeekendKey;
  const currentStreak = progress.specialChallengeStreak ?? 0;
  if (lastWeekend === currentWeekend) {
    // Ya había jugado este mismo fin de semana (el otro día): mantiene la
    // racha tal cual, no la vuelve a sumar.
    return currentStreak > 0 ? currentStreak : 1;
  }
  if (lastWeekend && isConsecutiveWeekend(lastWeekend, currentWeekend)) {
    return currentStreak + 1;
  }
  return 1; // racha nueva (primera vez o se cortó por saltear un finde)
}

// Racha "vigente" para mostrar en la interfaz. Si el alumno se salteó un
// fin de semana entero sin jugar, la racha ya se cortó aunque el número
// guardado todavía no se haya actualizado (eso pasa recién cuando vuelve a
// jugar) — esto evita mostrar una racha "falsa" entre semana.
export function getDisplayStreak(
  progress: StreakProgress,
  today: Date = new Date()
): number {
  const streak = progress.specialChallengeStreak ?? 0;
  const lastWeekend = progress.lastSpecialChallengeWeekendKey;
  if (streak === 0 || !lastWeekend) return 0;
  const currentWeekend = weekendKey(today);
  if (lastWeekend === currentWeekend) return streak;
  if (isConsecutiveWeekend(lastWeekend, currentWeekend)) return streak;
  return 0;
}

// Recompensa en monedas según la racha: la base más un extra por cada fin
// de semana consecutivo, con un tope para que no se vuelva desmedido.
export function computeSpecialChallengeReward(streak: number): number {
  const bonus = Math.min(
    Math.max(streak - 1, 0) * COINS_SPECIAL_CHALLENGE_STREAK_STEP,
    COINS_SPECIAL_CHALLENGE_STREAK_MAX_BONUS
  );
  return COINS_SPECIAL_CHALLENGE + bonus;
}
