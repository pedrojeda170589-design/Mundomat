import { MedalTier } from "@/types";

// Evolución de medallas recuperada de la planificación original:
// Sin medalla -> Bronce (mundos 1-4) -> Plata (mundos 5-9) -> Oro (mundo 10+)
export function getMedalTier(completedWorldsCount: number): MedalTier {
  if (completedWorldsCount >= 10) return "oro";
  if (completedWorldsCount >= 5) return "plata";
  if (completedWorldsCount >= 1) return "bronce";
  return "ninguna";
}

export const MEDAL_INFO: Record<
  MedalTier,
  { label: string; emoji: string; color: string }
> = {
  ninguna: { label: "Sin medalla", emoji: "⚪", color: "#9ca3af" },
  bronce: { label: "Medalla de Bronce", emoji: "🥉", color: "#b45309" },
  plata: { label: "Medalla de Plata", emoji: "🥈", color: "#94a3b8" },
  oro: { label: "Medalla de Oro", emoji: "🥇", color: "#eab308" },
};
