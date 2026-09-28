// Contenido de los memoramas de fin de semana.
// - Memorama de conceptos: pares palabra ↔ significado (rota la materia
//   según el día, igual que el memorama original del Desafío Especial).
// - Memorama de imágenes: pares de dibujos iguales, para jugar sin leer.
import { WorldSubject } from "@/types";

export interface ConceptPair {
  left: string;
  right: string;
}

export const CONCEPT_PAIRS: Record<WorldSubject, ConceptPair[]> = {
  matematica: [
    { left: "6 × 7", right: "42" },
    { left: "8 × 5", right: "40" },
    { left: "9 × 3", right: "27" },
    { left: "100 - 45", right: "55" },
    { left: "1/2 de 20", right: "10" },
    { left: "1 hora", right: "60 minutos" },
    { left: "Triángulo", right: "3 lados" },
    { left: "Doble de 15", right: "30" },
  ],
  lengua: [
    { left: "Feliz", right: "Contento" },
    { left: "Grande", right: "Chico" },
    { left: "Veloz", right: "Rápido" },
    { left: "Sustantivo", right: "Nombra algo" },
    { left: "Verbo", right: "Indica acción" },
    { left: "Trabalenguas", right: "Difícil de decir rápido" },
    { left: "Fábula", right: "Deja una enseñanza" },
    { left: "Rima", right: "Suenan parecido al final" },
  ],
  naturales: [
    { left: "Guanaco", right: "Fauna de la estepa" },
    { left: "Luna llena", right: "Se ve completa" },
    { left: "Agua + sal", right: "Mezcla" },
    { left: "Norte", right: "Punto cardinal" },
    { left: "Cubo", right: "Cuerpo geométrico" },
    { left: "Vibración", right: "Produce sonido" },
    { left: "Hielo", right: "Agua sólida" },
    { left: "Lenga", right: "Árbol patagónico" },
  ],
  sociales: [
    { left: "Intendente", right: "Gobierno municipal" },
    { left: "Cabildo", right: "Autoridad colonial" },
    { left: "Circuito productivo", right: "Producción → venta" },
    { left: "Patrimonio", right: "Se cuida del pasado" },
    { left: "Zona rural", right: "Campo" },
    { left: "Zona urbana", right: "Ciudad" },
    { left: "25 de Mayo", right: "Revolución de Mayo" },
    { left: "2 de Abril", right: "Héroes de Malvinas" },
  ],
};

export const SUBJECT_ROTATION: WorldSubject[] = ["matematica", "lengua", "naturales", "sociales"];

export interface ImageCardDef {
  id: string;
  label: string; // para accesibilidad
  src: string;
}

const memo = (id: string, label: string): ImageCardDef => ({ id, label, src: `/theme/memo/${id}.png` });

export const IMAGE_SETS: { id: string; title: string; cards: ImageCardDef[] }[] = [
  {
    id: "fauna",
    title: "Animales de la Patagonia",
    cards: [
      memo("guanaco", "Guanaco"),
      memo("choique", "Choique"),
      memo("condor", "Cóndor"),
      memo("pinguino", "Pingüino"),
      memo("zorro", "Zorro"),
      memo("ballena", "Ballena"),
      memo("huemul", "Huemul"),
      memo("puma", "Puma"),
    ],
  },
  {
    id: "objetos",
    title: "Cosas de todos los días",
    cards: [
      memo("lenga", "Lenga"),
      memo("calafate", "Calafate"),
      memo("mochila", "Mochila"),
      memo("lapiz", "Lápiz"),
      memo("libro", "Libro"),
      memo("reloj", "Reloj"),
      memo("mate", "Mate"),
      memo("pelota", "Pelota"),
    ],
  },
  {
    id: "mundos",
    title: "Los mundos de MundoTest26",
    cards: Array.from({ length: 47 }, (_, i) => ({
      id: `mundo-${i + 1}`,
      label: `Mundo ${i + 1}`,
      src: `/theme/islands/mundo-${i + 1}.png`,
    })),
  },
];
