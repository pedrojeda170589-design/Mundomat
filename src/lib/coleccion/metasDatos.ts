// Metas especiales (pedido de Pedro, 10/10/2026): avatares, objetos y ropa
// del vestidor que se desbloquean para siempre con
//   🔥 la racha de días de estudio (la mejor racha),
//   🗺️ las etapas superadas (módulos completos del mapa), y
//   ⚡ los días súper (un día con muchas actividades bien hechas).
// Se entregan solas en el servidor (ver metas.ts). Este archivo es solo de
// datos: lo importa src/types para sumar los avatares y objetos al catálogo.

export const ACTIVIDADES_DIA_SUPER = 20;
export const ACIERTO_DIA_SUPER = 0.6;

export type SlotMeta = "headwear" | "pet" | "prop";

export type PremioMeta =
  | { tipo: "avatar"; id: string; label: string; emoji: string; comoAvatar: string; blurb: string }
  | { tipo: "objeto"; id: string; label: string; emoji: string; slot: SlotMeta; molde?: string; blurb: string }
  | { tipo: "prenda"; id: string; label: string; emoji: string };

export interface Meta {
  id: string;
  racha?: number; // mejor racha ≥
  etapas?: number; // etapas (módulos) superadas ≥
  diasSuper?: number; // días súper ≥
  premio: PremioMeta;
}

const avatar = (id: string, label: string, emoji: string, comoAvatar: string, blurb: string): PremioMeta => ({
  tipo: "avatar",
  id,
  label,
  emoji,
  comoAvatar,
  blurb,
});
const objeto = (id: string, label: string, emoji: string, slot: SlotMeta, blurb: string, molde?: string): PremioMeta => ({
  tipo: "objeto",
  id,
  label,
  emoji,
  slot,
  blurb,
  ...(molde ? { molde } : {}),
});
const prenda = (id: string, label: string, emoji: string): PremioMeta => ({ tipo: "prenda", id, label, emoji });

export const METAS: Meta[] = [
  // 🔥 Racha
  { id: "r3", racha: 3, premio: prenda("bufanda", "Bufanda a rayas", "🧣") },
  { id: "r6", racha: 6, premio: objeto("mascota-pichi", "Pichi (mascota)", "🦔", "pet", "Un armadillo patagónico chiquito y curioso.") },
  { id: "r10", racha: 10, premio: objeto("vincha-llamas", "Vincha de llamitas de fuego", "🔥", "headwear", "Para los que no cortan la racha.", "cuernitos-dragon") },
  { id: "r14", racha: 14, premio: avatar("huemul", "Huemul", "🦌", "guanaco", "El ciervo de los Andes patagónicos.") },
  { id: "r21", racha: 21, premio: objeto("antorcha-racha", "Antorcha de la racha", "🔥", "prop", "Tres semanas sin apagar el fuego.") },
  { id: "r30", racha: 30, premio: avatar("lobo-marino", "Lobo marino", "🦭", "pinguino", "El rey de las costas de Santa Cruz.") },
  { id: "r45", racha: 45, premio: prenda("poncho", "Poncho pampa", "🧶") },
  // 🗺️ Etapas superadas
  { id: "e1", etapas: 1, premio: prenda("gorro-pompon", "Gorro con pompón", "🧶") },
  { id: "e2", etapas: 2, premio: objeto("barrilete", "Barrilete", "🪁", "prop", "Para remontarlo con el viento patagónico.") },
  { id: "e3", etapas: 3, premio: avatar("choique", "Choique", "🪶", "condor", "El ñandú petiso, corredor de la meseta.") },
  { id: "e4", etapas: 4, premio: objeto("mascota-lobito", "Lobito marino (mascota)", "🦭", "pet", "Un cachorro de lobo marino juguetón.") },
  { id: "e6", etapas: 6, premio: objeto("brujula-dorada", "Brújula dorada", "🧭", "prop", "Para no perderse nunca en el mapa.") },
  { id: "e8", etapas: 8, premio: avatar("inventora", "Inventora", "🤖", "exploradora", "Arma robots con lo que encuentra.") },
  { id: "e10", etapas: 10, premio: objeto("corona-laureles", "Corona de laureles", "🌿", "headwear", "Para quien recorrió todo el mapa.", "tiara-estrellas") },
  // ⚡ Días súper
  { id: "d1", diasSuper: 1, premio: objeto("libro-brillante", "Libro brillante", "📖", "prop", "Tu primer día súper.") },
  { id: "d2", diasSuper: 2, premio: prenda("botines", "Botines de fútbol", "⚽") },
  { id: "d3", diasSuper: 3, premio: avatar("lectora", "Lectora", "📚", "curiosa", "Siempre con un libro en la mochila.") },
  { id: "d5", diasSuper: 5, premio: objeto("mascota-vizcacha", "Vizcacha (mascota)", "🐭", "pet", "La vizcacha de la sierra, siempre atenta.") },
  { id: "d7", diasSuper: 7, premio: objeto("pincel-arcoiris", "Pincel arcoíris", "🖌️", "prop", "Pinta con todos los colores.") },
  { id: "d10", diasSuper: 10, premio: avatar("artista", "Artista", "🎨", "curioso", "Pinta murales con los paisajes del sur.") },
  { id: "d12", diasSuper: 12, premio: objeto("telescopio", "Telescopio", "🔭", "prop", "Para mirar las estrellas del cielo austral.") },
  { id: "d15", diasSuper: 15, premio: objeto("mascota-cauquen", "Cauquén (mascota)", "🪿", "pet", "El ganso de la Patagonia.") },
];

export const AVATARES_META = METAS.flatMap((m) => (m.premio.tipo === "avatar" ? [m.premio] : []));
export const OBJETOS_META = METAS.flatMap((m) => (m.premio.tipo === "objeto" ? [m.premio] : []));
