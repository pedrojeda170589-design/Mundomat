// Dónde van los mundos de cuentos en el mapa de Lengua de cada grado.
//
// Pedido de Pedro: un mundo de comprensión en la posición 3, 6, 9, 12… del
// recorrido de Lengua. Se intercalan uno cada dos mundos comunes. El cuento
// pide como prerrequisito el mundo común anterior, pero NO bloquea al
// siguiente (así no se traba a nadie, y en 3.º no cambia el progreso de los
// chicos que ya venían jugando).
import type { WorldDef } from "@/types";
import { GENERO_LABEL, type ComprehensionKind, type CuentoQuestion } from "./tipos";
import { getCuento } from "./catalogo";
import { PREGUNTAS_G1 } from "./preguntas-g1";
import { PREGUNTAS_G2 } from "./preguntas-g2";
import { PREGUNTAS_G3 } from "./preguntas-g3";
import { TEXTOS_G2 } from "./textos-g2";
import { TEXTOS_G3 } from "./textos-g3";

// Orden de los textos en el recorrido de cada grado. Se alternan los géneros
// narrativos del Diseño Curricular: cuento → leyenda → fábula (y vuelta a
// empezar), priorizando leyendas de Santa Cruz y de la Argentina. Cada grado
// tiene su selección según su nivel: 1.º los relatos más simples y cercanos,
// 2.º relatos más largos y de autor, 3.º (6 lugares) los de trama más rica.
const C1 = ["tres-chanchitos", "gallinita-roja", "ricitos-osos", "caperucita", "patito-feo", "musicos-bremen", "juan-porotos"];
const L1 = ["leyenda-calafate", "leyenda-hornero", "leyenda-yerba-mate", "leyenda-siete-colores", "leyenda-koonch", "leyenda-elal"];
const F1 = ["liebre-tortuga", "leon-raton", "zorro-cuervo", "cigarra-hormiga", "pastorcito-mentiroso", "raton-campo-ciudad"];

const C2 = ["caperucita", "patito-feo", "musicos-bremen", "juan-porotos", "traje-emperador", "medias-flamencos", "tortuga-gigante"];
const L2 = ["leyenda-koonch", "leyenda-hornero", "leyenda-calafate", "leyenda-yerba-mate", "leyenda-siete-colores", "leyenda-elal"];
const F2 = ["leon-raton", "zorro-cuervo", "cigarra-hormiga", "pastorcito-mentiroso", "raton-campo-ciudad", "gallina-huevos-oro"];

const C3 = ["tortuga-gigante", "medias-flamencos"];
const L3 = ["leyenda-ballena", "leyenda-iguazu"];
const F3 = ["gallina-huevos-oro", "raton-campo-ciudad"];

// cuento, leyenda, fábula, cuento, leyenda, fábula…
function alternar(c: string[], l: string[], f: string[]): string[] {
  const out: string[] = [];
  for (let i = 0; i < Math.max(c.length, l.length, f.length); i++) {
    if (c[i]) out.push(c[i]);
    if (l[i]) out.push(l[i]);
    if (f[i]) out.push(f[i]);
  }
  return out;
}

export const ORDEN_G1 = alternar(C1, L1, F1);
export const ORDEN_G2 = alternar(C2, L2, F2);
export const ORDEN_G3 = alternar(C3, L3, F3);

export const ORDEN: Record<number, string[]> = { 1: ORDEN_G1, 2: ORDEN_G2, 3: ORDEN_G3 };

// Ids de los mundos de comprensión: <base> + posición (1, 2, 3…).
// 1.º 11101+, 2.º 21101+, 3.º 31101+ (no chocan con los mundos comunes).
export const STORY_BASE: Record<number, number> = { 1: 11100, 2: 21100, 3: 31100 };

export function storyWorldId(grade: number, storyId: string): number | undefined {
  const i = (ORDEN[grade] ?? []).indexOf(storyId);
  return i < 0 ? undefined : STORY_BASE[grade] + i + 1;
}

export function isStoryWorldId(id: number): boolean {
  return Object.values(STORY_BASE).some((b) => id > b && id <= b + 99);
}

// Habilidad que registra cada tipo de pregunta, por grado.
export const SKILL_BY_KIND: Record<number, Record<ComprehensionKind, string>> = {
  1: {
    literal: "l-comp-literal",
    secuencia: "l-comp-secuencia",
    inferencial: "l-comp-inferencial",
    vocabulario: "l-comp-inferencial",
    estructura: "l-comp-secuencia",
    valoracion: "l-comp-inferencial",
  },
  2: {
    literal: "l2-comp-literal",
    secuencia: "l2-comp-secuencia",
    inferencial: "l2-comp-inferencial",
    vocabulario: "l2-comp-vocabulario",
    estructura: "l2-comp-critica",
    valoracion: "l2-comp-critica",
  },
  3: {
    literal: "l3-comp-literal",
    secuencia: "l3-comp-secuencia",
    inferencial: "l3-comp-inferencial",
    vocabulario: "l3-comp-vocabulario",
    estructura: "l3-comp-critica",
    valoracion: "l3-comp-critica",
  },
};
export const BASE_SKILL: Record<number, string> = { 1: "l-comprension-oral", 2: "l2-comprension-cuento", 3: "l3-comprension-lectora" };

// Texto del grado: cada grado lee una versión más larga del mismo relato
// (1.º la de catalogo.ts; 2.º y 3.º las suyas). Siempre 6 escenas, una por
// ilustración; si falta o no tiene 6, se usa la del grado anterior.
export function escenasDe(grade: number, storyId: string): string[] {
  const base = getCuento(storyId)?.scenes ?? [];
  const g2 = TEXTOS_G2[storyId]?.length === base.length ? TEXTOS_G2[storyId] : base;
  if (grade >= 3) return TEXTOS_G3[storyId]?.length === base.length ? TEXTOS_G3[storyId] : g2;
  if (grade === 2) return g2;
  return base;
}

// Lectura en voz alta del texto: gratis en 1.º y 2.º; desde 3.º es una
// ayuda opcional que cuesta monedas (se paga una vez por texto).
export const COSTO_NARRACION: Record<number, number> = { 1: 0, 2: 0, 3: 5 };

// Preguntas del grado. Mientras un grado no tenga las suyas para un cuento,
// usa las de 1.º (así el mundo funciona igual).
export function preguntasDe(grade: number, storyId: string): CuentoQuestion[] {
  const own = grade === 3 ? PREGUNTAS_G3[storyId] : grade === 2 ? PREGUNTAS_G2[storyId] : undefined;
  return own?.length ? own : PREGUNTAS_G1[storyId] ?? [];
}

const COLORS: [string, string][] = [
  ["#fde68a", "#f59e0b"],
  ["#fbcfe8", "#ec4899"],
  ["#c7d2fe", "#6366f1"],
];

function storyWorld(grade: number, storyId: string, pos: number, prev: WorldDef): WorldDef {
  const c = getCuento(storyId);
  if (!c) throw new Error(`Cuento desconocido: ${storyId}`);
  const kinds = new Set(preguntasDe(grade, storyId).map((q) => SKILL_BY_KIND[grade][q.kind]));
  const reading = grade >= 2;
  const w: WorldDef = {
    id: STORY_BASE[grade] + pos,
    name: `${GENERO_LABEL[c.genre]}: ${c.title}`,
    emoji: c.emoji,
    subject: "lengua",
    category: "lectura-cuentos",
    description: c.description,
    colorFrom: COLORS[pos % COLORS.length][0],
    colorTo: COLORS[pos % COLORS.length][1],
    difficulty: "basico",
    objective: reading
      ? "Leer un cuento del canon literario y comprenderlo: información explícita, secuencia, inferencias, vocabulario y opinión."
      : "Escuchar un cuento del canon literario y comprenderlo: personajes, hechos, secuencia y enseñanza.",
    contents: [c.origin, reading ? "Lectura comprensiva de textos literarios" : "Escucha comprensiva de textos literarios leídos por un adulto"],
    skills: [BASE_SKILL[grade], ...kinds],
    prerequisites: [prev.id],
    kind: "normal",
    activityCount: preguntasDe(grade, storyId).length,
    storyId,
    image: storyIsland(grade, storyId),
  };
  if (grade !== 3) w.grade = grade; // los mundos de 3.º no llevan grado (como siempre)
  if (prev.assessment) w.assessment = prev.assessment;
  return w;
}

// Isla del mundo: ilustra el texto, en el ambiente de cada grado.
export function storyIsland(grade: number, storyId: string): string {
  if (grade === 1) return `/theme/grados/1/islas/cuento-${storyId}.png`;
  if (grade === 2) return `/theme/grados/2/islas/cuento-${storyId}.png`;
  return `/theme/islands/cuento-${storyId}.png`;
}

// Intercala los cuentos del grado en el recorrido de Lengua: después de
// cada dos mundos comunes va uno de cuento (posiciones 3, 6, 9…).
export function withStories(grade: number, lengua: WorldDef[]): WorldDef[] {
  const order = ORDEN[grade] ?? [];
  const out: WorldDef[] = [];
  let k = 0;
  lengua.forEach((w, i) => {
    out.push(w);
    if (i % 2 === 1 && k < order.length) {
      out.push(storyWorld(grade, order[k], k + 1, w));
      k++;
    }
  });
  return out;
}
