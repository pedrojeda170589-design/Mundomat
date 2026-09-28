// Registro de juegos de la Aventura de fin de semana. Para sumar un juego
// nuevo (ordenar números, completar el que falta, mayor/menor, intruso,
// series descendentes...):
//   1. agregar su `kind` en WeekendGameKind (src/lib/weekend/plan.ts) y sus
//      niveles en el plan;
//   2. crear su componente (recibe WeekendGameProps);
//   3. registrarlo acá con su texto de presentación.
import { ComponentType } from "react";
import { WeekendActivity, WeekendGameKind } from "@/lib/weekend/plan";
import { describeStep } from "@/lib/weekend/sequence";
import MemorySequenceGame from "@/components/weekend/MemorySequenceGame";

export interface WeekendGameProps {
  activity: WeekendActivity;
  onComplete: (result: { errors: number }) => void;
}

export interface WeekendGameIntro {
  gameName: string;
  howTo: string;
  sequenceType?: string;
  example?: number[];
}

interface WeekendGameDef {
  component: ComponentType<WeekendGameProps>;
  intro: (activity: WeekendActivity) => WeekendGameIntro;
}

function listNumbers(values: number[]): string {
  if (values.length <= 3) {
    return `Primero encontrá el ${values[0]}, después el ${values[1]}${
      values[2] !== undefined ? ` y finalmente el ${values[2]}` : ""
    }.`;
  }
  return `Primero encontrá el ${values[0]}, después el ${values[1]}, y así hasta llegar al ${
    values[values.length - 1]
  }.`;
}

export const WEEKEND_GAMES: Record<WeekendGameKind, WeekendGameDef> = {
  "memoria-secuencia": {
    component: MemorySequenceGame,
    intro: (a) => ({
      gameName: "Memoria Numérica",
      howTo: `Descubrí las cartas en el orden correcto. ${listNumbers(a.values)} Las cartas nunca cambian de lugar: si te equivocás, mirá bien el número y acordate dónde está.`,
      sequenceType: describeStep(a.sequence.step),
      example: a.values.slice(0, 3),
    }),
  },
};
