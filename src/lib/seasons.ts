// Estaciones y festividades de MundoMat.
//
// Cada evento tiene una ventana de fechas (hora de Argentina) y entrega
// premios: accesorios de temporada (ACCESSORY_CATALOG_TEMPORADA) y un fondo
// para el avatar. Los premios se ganan jugando al menos una actividad
// mientras el evento está activo, y quedan en la colección del alumno para
// siempre (StudentProgress.seasonalCollection).
//
// Las estaciones son las del hemisferio sur. Carnaval y Pascuas se calculan
// a partir de la fecha de Pascua de cada año; el Día de las Infancias es el
// tercer domingo de agosto.

import {
  ACCESSORY_CATALOG_TEMPORADA,
  AUTO_BACKGROUND,
  BACKGROUND_OPTIONS,
  StudentProgress,
} from "@/types";

export type SeasonalKind = "estacion" | "festividad";

export interface SeasonalEvent {
  id: string;
  label: string;
  emoji: string;
  kind: SeasonalKind;
  // Texto corto para el cartel del juego ("¿qué se celebra?").
  description: string;
  isActive: (d: ArgDate) => boolean;
}

// Fecha "de calendario" en Argentina (sin horas), para no depender de la
// zona horaria del servidor (Vercel corre en UTC) ni de la del dispositivo.
export interface ArgDate {
  year: number;
  month: number; // 1-12
  day: number;
}

export function getArgentinaDate(now: Date = new Date()): ArgDate {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Argentina/Buenos_Aires",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  return { year: get("year"), month: get("month"), day: get("day") };
}

const md = (d: ArgDate) => d.month * 100 + d.day;

// Ventana por mes/día que puede cruzar el fin de año (ej. 12-21 → 03-20).
function inRange(d: ArgDate, from: number, to: number): boolean {
  const x = md(d);
  return from <= to ? x >= from && x <= to : x >= from || x <= to;
}

// Días desde una fecha de referencia (en UTC, solo para comparar fechas).
function dayNumber(year: number, month: number, day: number): number {
  return Math.floor(Date.UTC(year, month - 1, day) / 86_400_000);
}

// Domingo de Pascua (algoritmo anónimo gregoriano).
export function easterSunday(year: number): { month: number; day: number } {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return { month, day };
}

function daysFromEaster(d: ArgDate): number {
  const e = easterSunday(d.year);
  return dayNumber(d.year, d.month, d.day) - dayNumber(d.year, e.month, e.day);
}

// Tercer domingo de agosto (Día de las Infancias en Argentina).
function thirdSundayOfAugust(year: number): number {
  const firstDow = new Date(Date.UTC(year, 7, 1)).getUTCDay(); // 0 = domingo
  const firstSunday = 1 + ((7 - firstDow) % 7);
  return firstSunday + 14;
}

export const SEASONAL_EVENTS: SeasonalEvent[] = [
  // --- Estaciones (hemisferio sur) ---
  {
    id: "verano",
    label: "Verano",
    emoji: "☀️",
    kind: "estacion",
    description: "¡Llegó el verano! Días largos y lagos para disfrutar.",
    isActive: (d) => inRange(d, 1221, 320),
  },
  {
    id: "otono",
    label: "Otoño",
    emoji: "🍂",
    kind: "estacion",
    description: "Las lengas se ponen rojas y doradas.",
    isActive: (d) => inRange(d, 321, 620),
  },
  {
    id: "invierno",
    label: "Invierno",
    emoji: "❄️",
    kind: "estacion",
    description: "Nieve en la estepa: ¡a abrigarse!",
    isActive: (d) => inRange(d, 621, 920),
  },
  {
    id: "primavera",
    label: "Primavera",
    emoji: "🌸",
    kind: "estacion",
    description: "¡Feliz primavera y feliz Día del Estudiante!",
    isActive: (d) => inRange(d, 921, 1220),
  },
  // --- Festividades ---
  {
    id: "malvinas",
    label: "Malvinas",
    emoji: "🇦🇷",
    kind: "festividad",
    description: "2 de abril: recordamos a los Héroes de Malvinas, como el nombre de nuestra escuela.",
    isActive: (d) => inRange(d, 326, 402),
  },
  {
    id: "carnaval",
    label: "Carnaval",
    emoji: "🎭",
    kind: "festividad",
    description: "¡Máscaras, colores y alegría de carnaval!",
    // Del sábado al martes de carnaval (Miércoles de Ceniza = Pascua - 46).
    isActive: (d) => {
      const n = daysFromEaster(d);
      return n >= -50 && n <= -47;
    },
  },
  {
    id: "pascuas",
    label: "Pascuas",
    emoji: "🐰",
    kind: "festividad",
    description: "¡Felices Pascuas! A buscar huevitos.",
    isActive: (d) => {
      const n = daysFromEaster(d);
      return n >= -3 && n <= 1;
    },
  },
  {
    id: "semana-mayo",
    label: "Semana de Mayo",
    emoji: "🎗️",
    kind: "festividad",
    description: "18 de mayo, Día de la Escarapela, y 25 de mayo, Revolución de Mayo.",
    isActive: (d) => inRange(d, 518, 525),
  },
  {
    id: "patria",
    label: "Fiestas patrias",
    emoji: "🇦🇷",
    kind: "festividad",
    description: "20 de junio, Día de la Bandera, y 9 de julio, Día de la Independencia.",
    isActive: (d) => inRange(d, 615, 709),
  },
  {
    id: "infancias",
    label: "Día de las Infancias",
    emoji: "🎈",
    kind: "festividad",
    description: "¡Feliz Día de las Infancias!",
    // La semana que termina en el tercer domingo de agosto (y el lunes).
    isActive: (d) => {
      if (d.month !== 8) return false;
      const sunday = thirdSundayOfAugust(d.year);
      return d.day >= sunday - 6 && d.day <= sunday + 1;
    },
  },
  {
    id: "tradicion",
    label: "Día de la Tradición",
    emoji: "🐴",
    kind: "festividad",
    description: "10 de noviembre: celebramos nuestras tradiciones gauchas.",
    isActive: (d) => inRange(d, 1103, 1110),
  },
  {
    id: "navidad",
    label: "Navidad",
    emoji: "🎄",
    kind: "festividad",
    description: "¡Felices fiestas! Del armado del arbolito hasta Reyes.",
    isActive: (d) => inRange(d, 1208, 106),
  },
];

export function getSeasonalEventById(id: string): SeasonalEvent | undefined {
  return SEASONAL_EVENTS.find((e) => e.id === id);
}

// Eventos activos hoy: primero las festividades (en el orden de
// SEASONAL_EVENTS: Malvinas va primero porque es el nombre de la escuela),
// después la estación.
export function getActiveEvents(now: Date = new Date()): SeasonalEvent[] {
  const d = getArgentinaDate(now);
  const active = SEASONAL_EVENTS.filter((e) => e.isActive(d));
  return [
    ...active.filter((e) => e.kind === "festividad"),
    ...active.filter((e) => e.kind === "estacion"),
  ];
}

// Ids de colección (accesorios y "fondo:<id>") que entrega un evento.
export function getEventRewardIds(eventId: string): string[] {
  return [
    ...ACCESSORY_CATALOG_TEMPORADA.filter((a) => a.eventId === eventId).map((a) => a.id),
    ...BACKGROUND_OPTIONS.filter((b) => b.eventId === eventId).map((b) => `fondo:${b.id}`),
  ];
}

// Fondo que muestra el modo "automático": el de la festividad activa, o si
// no hay ninguna, el de la estación.
export function getAutoBackgroundId(now: Date = new Date()): string {
  const [first] = getActiveEvents(now);
  const bg = first && BACKGROUND_OPTIONS.find((b) => b.eventId === first.id);
  return bg ? bg.id : "patagonia";
}

// Resuelve el fondo guardado del alumno a uno concreto para dibujar.
export function resolveBackgroundId(saved: string | undefined, now: Date = new Date()): string {
  if (!saved || saved === AUTO_BACKGROUND) return getAutoBackgroundId(now);
  return BACKGROUND_OPTIONS.some((b) => b.id === saved) ? saved : getAutoBackgroundId(now);
}

// Suma a la colección los premios de los eventos activos que todavía no
// tenía. Devuelve el progreso actualizado y la lista de premios nuevos (para
// poder avisarle al alumno). Se llama cuando el alumno juega una actividad.
export function collectActiveSeasonalRewards(
  progress: StudentProgress,
  now: Date = new Date()
): { progress: StudentProgress; newRewards: string[] } {
  const owned = new Set(progress.seasonalCollection ?? []);
  const newRewards: string[] = [];
  for (const event of getActiveEvents(now)) {
    for (const id of getEventRewardIds(event.id)) {
      if (!owned.has(id)) {
        owned.add(id);
        newRewards.push(id);
      }
    }
  }
  if (newRewards.length === 0) return { progress, newRewards };
  return {
    progress: { ...progress, seasonalCollection: [...owned] },
    newRewards,
  };
}
