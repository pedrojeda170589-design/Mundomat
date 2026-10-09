import type { WorldDef } from "@/types";

// Mundos «por superar»: los que el alumno ya puede jugar y todavía no
// completó. No cuentan el Mundo del Dictado (es semanal) ni las zonas de
// práctica (son de refuerzo, opcionales). Vale para todos los grados.
export function esPorSuperar(world: WorldDef, playableIds: number[], completed: number[]): boolean {
  if (world.kind === "dictado" || world.kind === "refuerzo") return false;
  return playableIds.includes(world.id) && !completed.includes(world.id);
}

// Cuántos mundos quedan por superar en cada materia (la pantalla solo usa
// si hay o no: al alumno no se le muestra la cantidad).
export function porSuperarPorMateria(
  worlds: WorldDef[],
  playableIds: number[],
  completed: number[]
): Record<string, number> {
  const out: Record<string, number> = {};
  for (const w of worlds) {
    if (esPorSuperar(w, playableIds, completed)) out[w.subject] = (out[w.subject] ?? 0) + 1;
  }
  return out;
}
