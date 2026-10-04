// Vueltas en curso: retomar un mundo donde se dejó.
//
// Pedido de Pedro: si el alumno hace 3 actividades, sale del mundo y vuelve
// a entrar, no tiene que empezar de nuevo: sigue desde la primera que le
// falta. Por eso, al empezar una vuelta se guardan en el servidor sus
// actividades (como se generaron, con el mismo orden y las mismas opciones),
// y con cada respuesta se avanza el índice. Al terminar la vuelta se borra.
//
// - Es por alumno y por mundo, y sirve en cualquier dispositivo.
// - No hay "empezar de nuevo": así no se puede borrar una vuelta que viene
//   mal para mejorar el puntaje.
// - Una vuelta sin tocar por más de VENCE_DIAS días se descarta (y la del
//   Mundo del Dictado, cuando cambia la semana).
import type { RoundInProgress, StudentProgress } from "@/types";
import { claveSemanaDictado } from "@/lib/dictado/banco";

export const VENCE_DIAS = 14;
const MAX_VUELTAS = 8; // como mucho, tantos mundos a medias por alumno
const MAX_BYTES = 80_000; // tope de tamaño de las actividades guardadas

const DICTADO_IDS = new Set([28001, 38001]);

function vencida(r: RoundInProgress, worldId: number, now: Date): boolean {
  const last = Date.parse(r.updatedAt);
  if (!Number.isFinite(last) || now.getTime() - last > VENCE_DIAS * 86_400_000) return true;
  if (DICTADO_IDS.has(worldId)) return claveSemanaDictado(new Date(r.startedAt)) !== claveSemanaDictado(now);
  return false;
}

export function validRoundId(id: unknown): id is string {
  return typeof id === "string" && /^[A-Za-z0-9-]{8,80}$/.test(id);
}

// La vuelta guardada de ese mundo, si sigue vigente y le quedan actividades.
export function vueltaEnCurso(p: StudentProgress, worldId: number, now: Date = new Date()): RoundInProgress | null {
  const r = p.roundsInProgress?.[worldId];
  if (!r || !Array.isArray(r.activities) || r.activities.length === 0) return null;
  if (r.index <= 0 || r.index >= r.activities.length) return null;
  if (vencida(r, worldId, now)) return null;
  return r;
}

// Empieza (o reemplaza) la vuelta de un mundo.
export function empezarVuelta(
  p: StudentProgress,
  worldId: number,
  id: string,
  activities: unknown[],
  now: Date = new Date()
): StudentProgress {
  if (!validRoundId(id) || !Array.isArray(activities) || activities.length === 0 || activities.length > 40) return p;
  if (JSON.stringify(activities).length > MAX_BYTES) return p;
  const iso = now.toISOString();
  const rounds: Record<number, RoundInProgress> = {};
  // Se limpian las vencidas y, si hay demasiadas, se dejan las más recientes.
  const prev = Object.entries(p.roundsInProgress ?? {})
    .filter(([w, r]) => Number(w) !== worldId && !vencida(r, Number(w), now))
    .sort((a, b) => b[1].updatedAt.localeCompare(a[1].updatedAt))
    .slice(0, MAX_VUELTAS - 1);
  for (const [w, r] of prev) rounds[Number(w)] = r;
  rounds[worldId] = { id, activities, index: 0, correctCount: 0, startedAt: iso, updatedAt: iso };
  return { ...p, roundsInProgress: rounds };
}

// Una respuesta más de la vuelta. Solo avanza si coincide la vuelta y la
// actividad es la que tocaba (o una posterior, si se perdió una respuesta
// por la red); una respuesta repetida no suma dos veces.
export function avanzarVuelta(
  p: StudentProgress,
  worldId: number,
  id: string | undefined,
  activityIndex: number,
  correct: boolean,
  mistake?: string,
  now: Date = new Date()
): StudentProgress {
  const r = p.roundsInProgress?.[worldId];
  if (!r || !id || r.id !== id) return p;
  if (!Number.isInteger(activityIndex) || activityIndex < r.index || activityIndex >= r.activities.length) return p;
  const mistakes = !correct && mistake ? [...(r.mistakes ?? []), mistake.slice(0, 80)].slice(0, 20) : r.mistakes;
  const next: RoundInProgress = {
    ...r,
    index: activityIndex + 1,
    correctCount: r.correctCount + (correct ? 1 : 0),
    ...(mistakes ? { mistakes } : {}),
    updatedAt: now.toISOString(),
  };
  return { ...p, roundsInProgress: { ...p.roundsInProgress, [worldId]: next } };
}

// Para actividades que no se responden (el cuento): solo mueve el índice.
export function saltarEnVuelta(p: StudentProgress, worldId: number, id: string | undefined, activityIndex: number, now: Date = new Date()): StudentProgress {
  const r = p.roundsInProgress?.[worldId];
  if (!r || !id || r.id !== id || activityIndex !== r.index || activityIndex >= r.activities.length) return p;
  return { ...p, roundsInProgress: { ...p.roundsInProgress, [worldId]: { ...r, index: activityIndex + 1, updatedAt: now.toISOString() } } };
}

// Al terminar la vuelta (o el mundo) se borra.
export function terminarVuelta(p: StudentProgress, worldId: number): StudentProgress {
  if (!p.roundsInProgress?.[worldId]) return p;
  const rest = { ...p.roundsInProgress };
  delete rest[worldId];
  return { ...p, roundsInProgress: rest };
}

// Mundos a medias (para mostrar «Seguí: 4/10» en el mapa).
export function resumenVueltas(p: StudentProgress, now: Date = new Date()): Record<number, { hechas: number; total: number }> {
  const out: Record<number, { hechas: number; total: number }> = {};
  for (const w of Object.keys(p.roundsInProgress ?? {})) {
    const r = vueltaEnCurso(p, Number(w), now);
    if (!r) continue;
    const preguntas = r.activities.filter((a) => (a as { type?: string })?.type !== "listen");
    const hechas = r.activities.slice(0, r.index).filter((a) => (a as { type?: string })?.type !== "listen").length;
    out[Number(w)] = { hechas, total: preguntas.length };
  }
  return out;
}
