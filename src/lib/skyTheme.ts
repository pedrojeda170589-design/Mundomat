// Cálculos de ambientación de la portada: momento del día, fase lunar real
// y estación del año (para el hemisferio sur, donde está la escuela).
// Son funciones puras (sin "use client") para poder testearlas fácil.

export type DayPeriod = "day" | "night";

// De 7 a 19hs consideramos "de día"; el resto, "de noche".
export function getDayPeriod(date: Date = new Date()): DayPeriod {
  const h = date.getHours();
  return h >= 7 && h < 20 ? "day" : "night";
}

export interface MoonPhaseInfo {
  emoji: string;
  name: string;
  illumination: number; // 0-100, aproximado
}

const MOON_PHASES: { emoji: string; name: string }[] = [
  { emoji: "🌑", name: "Luna nueva" },
  { emoji: "🌒", name: "Luna creciente" },
  { emoji: "🌓", name: "Cuarto creciente" },
  { emoji: "🌔", name: "Gibosa creciente" },
  { emoji: "🌕", name: "Luna llena" },
  { emoji: "🌖", name: "Gibosa menguante" },
  { emoji: "🌗", name: "Cuarto menguante" },
  { emoji: "🌘", name: "Luna menguante" },
];

// Referencia astronómica: hubo luna nueva el 6 de enero de 2000, 18:14 UTC.
// A partir de ahí, cada 29.530588853 días se repite el ciclo (mes sinódico).
const KNOWN_NEW_MOON_UTC = Date.UTC(2000, 0, 6, 18, 14, 0);
const SYNODIC_MONTH_DAYS = 29.530588853;
const MS_PER_DAY = 86400000;

export function getMoonPhase(date: Date = new Date()): MoonPhaseInfo {
  const diffDays = (date.getTime() - KNOWN_NEW_MOON_UTC) / MS_PER_DAY;
  const cyclePos =
    ((diffDays % SYNODIC_MONTH_DAYS) + SYNODIC_MONTH_DAYS) % SYNODIC_MONTH_DAYS;
  const fraction = cyclePos / SYNODIC_MONTH_DAYS; // 0 (luna nueva) .. 1
  const index = Math.floor(fraction * 8) % 8;
  const illumination = Math.round(
    ((1 - Math.cos(fraction * 2 * Math.PI)) / 2) * 100
  );
  return { ...MOON_PHASES[index], illumination };
}

export type Season = "verano" | "otonio" | "invierno" | "primavera";

export const SEASON_INFO: Record<
  Season,
  { label: string; emoji: string; particle: string }
> = {
  verano: { label: "Verano", emoji: "☀️", particle: "✨" },
  otonio: { label: "Otoño", emoji: "🍂", particle: "🍂" },
  invierno: { label: "Invierno", emoji: "❄️", particle: "❄️" },
  primavera: { label: "Primavera", emoji: "🌸", particle: "🌸" },
};

// Hemisferio sur (Santa Cruz, Argentina): las estaciones van al revés que
// en el hemisferio norte.
export function getSeason(date: Date = new Date()): Season {
  const m = date.getMonth(); // 0 = enero
  if (m === 11 || m === 0 || m === 1) return "verano";
  if (m >= 2 && m <= 4) return "otonio";
  if (m >= 5 && m <= 7) return "invierno";
  return "primavera";
}
