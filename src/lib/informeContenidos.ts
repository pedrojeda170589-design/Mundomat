// Informe por contenidos para el docente (todos los grados): qué contenidos
// trabajó el alumno, cuáles son sus fortalezas, cuáles conviene reforzar y
// cuáles todavía no empezó. Cada mundo es un contenido del programa (con su
// eje curricular, ver src/lib/reforzar.ts). Se calcula con lo que ya guarda
// la app (respuestas por mundo, última vuelta, mundos completados), así que
// sirve también para lo jugado antes de este informe.
import type { Student, StudentProgress, WorldDef } from "@/types";
import type { SkillLevel } from "@/lib/platform/shared";

export type EstadoContenido = "fortaleza" | "en-desarrollo" | "a-reforzar" | "sin-trabajar";

export interface ContenidoAlumno {
  worldId: number;
  estado: EstadoContenido;
  // Respuestas en ese mundo (todas) y % de aciertos.
  respuestas: number;
  precision?: number;
  // % de aciertos de las últimas actividades (lo más reciente pesa más que
  // un error viejo).
  reciente?: number;
  // % de la última vuelta completa.
  ultimaVuelta?: number;
}

// Pocas respuestas no alcanzan para decir que «cuesta».
const MIN_RESPUESTAS = 4;
// Debajo de esto, el contenido se marca para reforzar.
export const UMBRAL_REFUERZO = 60;
const RECIENTES = 10;

// El nivel que muestra ReforzarPorEje para cada estado.
export const NIVEL_DE_ESTADO: Record<EstadoContenido, SkillLevel> = {
  fortaleza: "consolidado",
  "en-desarrollo": "en-desarrollo",
  "a-reforzar": "practica-guiada",
  "sin-trabajar": "sin-datos",
};

function pct(c: number, i: number): number | undefined {
  return c + i > 0 ? Math.round((c / (c + i)) * 100) : undefined;
}

export function estadoDeContenido(
  progress: StudentProgress,
  worldId: number,
  masteryPct: number
): ContenidoAlumno {
  const log = progress.activityLog.filter((a) => a.worldId === worldId);
  const sum = progress.activitySummary?.[worldId];
  const c = (sum?.correct ?? 0) + log.reduce((n, a) => n + a.correct, 0);
  const i = (sum?.incorrect ?? 0) + log.reduce((n, a) => n + a.incorrect, 0);
  const ult = log.slice(-RECIENTES);
  const reciente = pct(
    ult.reduce((n, a) => n + a.correct, 0),
    ult.reduce((n, a) => n + a.incorrect, 0)
  );
  const ultimaVuelta = progress.lastWorldAttemptScore?.[worldId];
  const precision = pct(c, i);
  const base = { worldId, respuestas: c + i, precision, reciente, ultimaVuelta };

  const completo = progress.completedWorlds.includes(worldId);
  const jugado = c + i > 0 || ultimaVuelta !== undefined || completo;
  if (!jugado) return { ...base, estado: "sin-trabajar" };

  // Lo que mejor describe cómo le va ahora: lo reciente, si hay; si no, todo.
  const actual = reciente ?? precision ?? ultimaVuelta;
  const suficiente = c + i >= MIN_RESPUESTAS || ultimaVuelta !== undefined;

  if (progress.worldsNeedingTeacherReview?.includes(worldId)) return { ...base, estado: "a-reforzar" };
  if (suficiente && actual !== undefined && actual < UMBRAL_REFUERZO) return { ...base, estado: "a-reforzar" };
  if (completo || (ultimaVuelta !== undefined && ultimaVuelta >= masteryPct)) {
    // Completado, pero si lo último le viene costando, todavía en desarrollo.
    if (reciente !== undefined && ult.length >= MIN_RESPUESTAS && reciente < 75) return { ...base, estado: "en-desarrollo" };
    return { ...base, estado: "fortaleza" };
  }
  return { ...base, estado: "en-desarrollo" };
}

// Los contenidos (mundos) del grado que entran en el informe: no cuentan las
// zonas de práctica automáticas ni el dictado semanal (tienen su informe).
export function mundosDelInforme(worlds: WorldDef[]): WorldDef[] {
  return worlds.filter((w) => w.kind !== "refuerzo" && w.kind !== "dictado");
}

export function informeDelAlumno(
  progress: StudentProgress,
  worlds: WorldDef[],
  masteryPct: number,
  enabledIds?: number[]
): ContenidoAlumno[] {
  return mundosDelInforme(worlds)
    .map((w) => estadoDeContenido(progress, w.id, masteryPct))
    // Lo no habilitado y no jugado no es «sin trabajar»: todavía no se dio.
    .filter((c) => c.estado !== "sin-trabajar" || !enabledIds || enabledIds.includes(c.worldId));
}

// Para el curso: en cada contenido, cuántos alumnos lo trabajaron y cuántos
// necesitan reforzarlo. Sirve para decidir qué repasar con todo el grupo.
export interface PrioridadCurso {
  worldId: number;
  trabajaron: number;
  aReforzar: number;
  enDesarrollo: number;
  fortaleza: number;
  // Alumnos que lo necesitan reforzar (nombres, para el docente).
  quienes: string[];
  // Precisión promedio de los que lo trabajaron.
  precision?: number;
}

export function prioridadesDelCurso(
  students: Student[],
  progressMap: Record<string, StudentProgress | undefined>,
  worlds: WorldDef[],
  masteryPct: number
): PrioridadCurso[] {
  const out: PrioridadCurso[] = [];
  for (const w of mundosDelInforme(worlds)) {
    const p: PrioridadCurso = { worldId: w.id, trabajaron: 0, aReforzar: 0, enDesarrollo: 0, fortaleza: 0, quienes: [] };
    let suma = 0;
    let n = 0;
    for (const s of students) {
      const pr = progressMap[s.code];
      if (!pr) continue;
      const e = estadoDeContenido(pr, w.id, masteryPct);
      if (e.estado === "sin-trabajar") continue;
      p.trabajaron++;
      if (e.estado === "a-reforzar") {
        p.aReforzar++;
        p.quienes.push(s.name);
      } else if (e.estado === "en-desarrollo") p.enDesarrollo++;
      else p.fortaleza++;
      const v = e.reciente ?? e.precision;
      if (v !== undefined) {
        suma += v;
        n++;
      }
    }
    if (n) p.precision = Math.round(suma / n);
    if (p.trabajaron) out.push(p);
  }
  // Primero lo que más alumnos necesitan reforzar (en proporción), después
  // lo de menor precisión.
  return out.sort(
    (a, b) =>
      b.aReforzar / b.trabajaron - a.aReforzar / a.trabajaron ||
      b.aReforzar - a.aReforzar ||
      (a.precision ?? 101) - (b.precision ?? 101)
  );
}
