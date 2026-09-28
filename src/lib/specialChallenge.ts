// Racha de fines de semana y monedas del cofre de la Aventura de fin de
// semana (ver src/lib/weekend/plan.ts y completeWeekendActivity).

import {
  COINS_SPECIAL_CHALLENGE,
  COINS_SPECIAL_CHALLENGE_STREAK_MAX_BONUS,
  COINS_SPECIAL_CHALLENGE_STREAK_STEP,
  StudentProgress,
} from "@/types";

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
