import { WorldDef } from "@/types";

// Fichas de refuerzo para imprimir (private/fichas/mundo-<id>-<n>.pdf; se
// descargan por /api/fichas con código de alumno de un aula). No son la app
// en papel: proponen hacer, jugar en familia, investigar, conversar y crear
// sobre el contenido de cada mundo. Se generan con
// scripts/fichas/generar_fichas.py a partir de scripts/fichas/<materia>.json.
// Mundos de leyendas: además de la ficha de refuerzo, tienen una «Ficha de
// lectura» (la leyenda ilustrada con preguntas de comprensión), generada con
// scripts/fichas/fichas_leyendas.ts como mundo-<id>-2.pdf.
export const MUNDOS_LEYENDA = new Set([11102, 11105, 11108, 11111, 11114, 11117, 21102, 21105, 21108, 21111, 21114, 21117, 31102, 31105]);

export function fichaVersions(world: WorldDef): number {
  if (MUNDOS_LEYENDA.has(world.id)) return 2;
  if (world.grade === 1 || world.grade === 2 || world.id >= 10000) return 1;
  return 2;
}

export function fichaLabel(world: WorldDef, version: number): string {
  if (MUNDOS_LEYENDA.has(world.id)) return version === 2 ? "Ficha de lectura ⬇" : "Ficha para hacer en familia ⬇";
  return fichaVersions(world) === 1 ? "Descargar ficha ⬇" : `Ficha ${version} ⬇`;
}

export function fichaHref(worldId: number, version: number): string {
  return `/api/fichas/mundo-${worldId}-${version}.pdf`;
}
