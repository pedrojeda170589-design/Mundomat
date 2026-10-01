import { WorldDef } from "@/types";

// Fichas de refuerzo para imprimir (private/fichas/mundo-<id>-<n>.pdf; se
// descargan por /api/fichas con código de alumno de un aula). No son la app
// en papel: proponen hacer, jugar en familia, investigar, conversar y crear
// sobre el contenido de cada mundo. Se generan con
// scripts/fichas/generar_fichas.py a partir de scripts/fichas/<materia>.json.
export function fichaVersions(world: WorldDef): number {
  void world;
  return 2;
}

export function fichaHref(worldId: number, version: number): string {
  return `/api/fichas/mundo-${worldId}-${version}.pdf`;
}
