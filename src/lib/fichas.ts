import { WorldDef } from "@/types";

// Fichas de refuerzo para imprimir (private/fichas/mundo-<id>-<n>.pdf; se
// descargan por /api/fichas con código de alumno de un aula). No son la app
// en papel: proponen hacer, jugar en familia, investigar, conversar y crear
// sobre el contenido de cada mundo. Se generan con
// scripts/fichas/generar_fichas.py a partir de scripts/fichas/<materia>.json.
// Mundos de cuentos, leyendas y fábulas (1.º 11101+, 2.º 21101+, 3.º 31101+):
// además de la ficha para hacer en familia, tienen una «Ficha de lectura»
// (el texto ilustrado con preguntas de comprensión), generada con
// scripts/fichas/fichas_lectura.ts como mundo-<id>-2.pdf.
export function esMundoDeTexto(id: number): boolean {
  return [11100, 21100, 31100].some((b) => id > b && id < b + 100);
}

export function fichaVersions(world: WorldDef): number {
  if (esMundoDeTexto(world.id)) return 2;
  if (world.grade === 1 || world.grade === 2 || world.id >= 10000) return 1;
  return 2;
}

export function fichaLabel(world: WorldDef, version: number): string {
  if (esMundoDeTexto(world.id)) return version === 2 ? "Ficha de lectura ⬇" : "Ficha para hacer en familia ⬇";
  return fichaVersions(world) === 1 ? "Descargar ficha ⬇" : `Ficha ${version} ⬇`;
}

export function fichaHref(worldId: number, version: number): string {
  return `/api/fichas/mundo-${worldId}-${version}.pdf`;
}
