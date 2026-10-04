// Premios que se ganan aprendiendo (no se compran):
// - Avatar de LOGRO de cada texto de comprensión: 90 % o más en ese mundo.
// - LEGENDARIO de la temporada: superar LEGENDARIO_MUNDOS mundos distintos
//   con 90 % o más mientras la temporada está a la venta.
// Se llama desde /api/world-attempt (en el servidor).
import type { StudentProgress } from "@/types";
import { LEGENDARIO_MUNDOS, TEMPORADAS } from "./temporadas";
import { UMBRAL_LOGRO, logroDeCuento } from "./logros";
import { claveTemporada } from "@/lib/tiempo-limitado";

export interface PremiosNuevos {
  logros: string[]; // ids de avatares de logro (y mascotas) ganados ahora
  legendarios: string[]; // ids de legendarios ganados ahora
  // Avance hacia el legendario de cada temporada activa: «tradicion»: 2 (de 3).
  avance: Record<string, number>;
}

export function aplicarPremiosDeMundo(
  p: StudentProgress,
  worldId: number,
  scorePct: number,
  storyId: string | undefined,
  now: Date = new Date()
): { progress: StudentProgress; premios: PremiosNuevos } {
  const premios: PremiosNuevos = { logros: [], legendarios: [], avance: {} };
  if (scorePct < UMBRAL_LOGRO) return { progress: p, premios };
  // Registro de mundos superados (para drops y «al día»).
  let next: StudentProgress = {
    ...p,
    pasesRecientes: [...(p.pasesRecientes ?? []), { w: worldId, at: now.toISOString() }].slice(-40),
  };

  // Avatar de logro del texto (y su mascota, si tiene).
  const logro = storyId ? logroDeCuento(storyId) : undefined;
  if (logro && !(next.achievementCollection ?? []).includes(logro.id)) {
    next = { ...next, achievementCollection: [...(next.achievementCollection ?? []), logro.id] };
    premios.logros.push(logro.id);
    if (logro.mascota && !(next.seasonalCollection ?? []).includes(logro.mascota.id)) {
      next = { ...next, seasonalCollection: [...(next.seasonalCollection ?? []), logro.mascota.id] };
      premios.logros.push(logro.mascota.id);
    }
  }

  // Legendarios de las temporadas activas.
  for (const t of TEMPORADAS) {
    if (!t.legendario) continue;
    const clave = claveTemporada(t.id, now);
    if (!clave) continue;
    const mundos = new Set(next.legendaryProgress?.[clave] ?? []);
    if (mundos.size >= LEGENDARIO_MUNDOS) continue;
    mundos.add(worldId);
    next = { ...next, legendaryProgress: { ...(next.legendaryProgress ?? {}), [clave]: [...mundos] } };
    premios.avance[t.id] = mundos.size;
    if (mundos.size >= LEGENDARIO_MUNDOS && !(next.seasonalCollection ?? []).includes(t.legendario.id)) {
      next = { ...next, seasonalCollection: [...(next.seasonalCollection ?? []), t.legendario.id] };
      premios.legendarios.push(t.legendario.id);
    }
  }
  return { progress: next, premios };
}
