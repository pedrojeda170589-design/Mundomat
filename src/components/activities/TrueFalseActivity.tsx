"use client";

import { useState } from "react";
import { choiceButtonClass, cardBase } from "./shared";

interface Justification {
  prompt: string;
  choices: string[];
  answerIndex: number;
}

interface Props {
  statement: string;
  isTrue: boolean;
  justification?: Justification;
  onDone: (correct: boolean) => void;
}

export default function TrueFalseActivity({
  statement,
  isTrue,
  justification,
  onDone,
}: Props) {
  const [answered, setAnswered] = useState<boolean | null>(null);
  const [firstCorrect, setFirstCorrect] = useState(false);
  const [justSelected, setJustSelected] = useState<number | null>(null);

  function handleAnswer(value: boolean) {
    if (answered !== null) return;
    setAnswered(value);
    const correct = value === isTrue;
    setFirstCorrect(correct);
    if (!justification) {
      setTimeout(() => onDone(correct), 900);
    }
  }

  function handleJustification(i: number) {
    if (justSelected !== null || !justification) return;
    setJustSelected(i);
    const bothCorrect = firstCorrect && i === justification.answerIndex;
    setTimeout(() => onDone(bothCorrect), 900);
  }

  return (
    <div className={cardBase}>
      <p className="text-xl font-bold text-white mb-6 text-center">
        {statement}
      </p>

      {answered === null && (
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleAnswer(true)}
            className="rounded-2xl border-2 border-emerald-500/50 bg-emerald-500/10 text-emerald-200 font-black text-lg py-4 hover:bg-emerald-500/20 transition"
          >
            ✅ Verdadero
          </button>
          <button
            type="button"
            onClick={() => handleAnswer(false)}
            className="rounded-2xl border-2 border-red-500/50 bg-red-500/10 text-red-200 font-black text-lg py-4 hover:bg-red-500/20 transition"
          >
            ❌ Falso
          </button>
        </div>
      )}

      {answered !== null && (
        <p
          className={`text-center font-bold mb-4 ${firstCorrect ? "text-emerald-300" : "text-red-300"}`}
        >
          {firstCorrect
            ? "¡Correcto!"
            : `No era, la respuesta correcta era "${isTrue ? "Verdadero" : "Falso"}".`}
        </p>
      )}

      {answered !== null && justification && (
        <>
          <p className="text-white font-semibold mb-3 text-center">
            {justification.prompt}
          </p>
          <div className="flex flex-col gap-2">
            {justification.choices.map((c, i) => {
              let state: "idle" | "correct" | "wrong" | "muted" = "idle";
              if (justSelected !== null) {
                if (i === justification.answerIndex) state = "correct";
                else if (i === justSelected) state = "wrong";
                else state = "muted";
              }
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleJustification(i)}
                  className={choiceButtonClass(state)}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
