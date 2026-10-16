// Desbloqueo en orden (pedido de Pedro, 16/10/2026): aunque el docente deje
// habilitados todos los mundos, para el alumno se van abriendo de a uno.
// Dentro de cada materia, un mundo se abre cuando el mundo habilitado
// anterior (en el orden del mapa) se superó con 80 % o más en alguna vuelta.
//
// - Los mundos de refuerzo, dictado y zonas de práctica no entran en la fila.
// - Si el docente no habilitó un mundo, se saltea: cuenta el habilitado anterior.
// - Un mundo que el alumno ya empezó o jugó queda abierto (no se le quita).
// - El primer mundo habilitado de cada materia está siempre abierto.
//
// Reglas puras: las usan la pantalla del mapa y el servidor (/api/round).
import type { StudentProgress, WorldDef } from "@/types";

export const PCT_PARA_ABRIR = 80;

function mejorPuntaje(progress: StudentProgress, id: number): number {
  return Math.max(progress.bestWorldScore?.[id] ?? 0, progress.lastWorldAttemptScore?.[id] ?? 0);
}

export function superadoParaAbrir(progress: StudentProgress, id: number): boolean {
  return progress.completedWorlds.includes(id) || mejorPuntaje(progress, id) >= PCT_PARA_ABRIR;
}

function yaLoJugo(progress: StudentProgress, id: number): boolean {
  return (
    progress.completedWorlds.includes(id) ||
    progress.bestWorldScore?.[id] !== undefined ||
    progress.lastWorldAttemptScore?.[id] !== undefined ||
    !!progress.roundsInProgress?.[id] ||
    !!progress.roundsResume?.[id]
  );
}

const entraEnLaFila = (w: WorldDef) => w.kind !== "refuerzo" && w.kind !== "dictado";

// Devuelve el mundo que falta superar con 80 % para abrir `world`, o null si
// ya está abierto.
export function mundoQueFalta(
  world: WorldDef,
  mundosDelGrado: WorldDef[],
  habilitados: number[],
  progress: StudentProgress
): WorldDef | null {
  if (!entraEnLaFila(world)) return null;
  const fila = mundosDelGrado.filter(
    (w) => w.subject === world.subject && entraEnLaFila(w) && habilitados.includes(w.id)
  );
  const i = fila.findIndex((w) => w.id === world.id);
  if (i <= 0) return null;
  if (yaLoJugo(progress, world.id)) return null;
  const anterior = fila[i - 1];
  return superadoParaAbrir(progress, anterior.id) ? null : anterior;
}
