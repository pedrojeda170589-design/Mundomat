import { WorldDef } from "@/types";

// Fichas para imprimir (public/fichas/mundo-<id>-<n>.pdf). Cada versión trae
// actividades distintas (en Matemática, con números nuevos): repasar y
// dibujar, actividades de repaso con soluciones, y cartas para recortar y
// jugar Memoria Numérica y memorama en familia.
export function fichaVersions(world: WorldDef): number {
  return world.subject === "matematica" ? 3 : 2;
}

export function fichaHref(worldId: number, version: number): string {
  return `/fichas/mundo-${worldId}-${version}.pdf`;
}
