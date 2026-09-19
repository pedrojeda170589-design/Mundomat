"use client";

import { useEffect, useState } from "react";
import { choiceButtonClass, cardBase } from "./shared";

interface Fact {
  a: number;
  b: number;
}

interface Props {
  table: number;
  facts: Fact[];
  onDone: (correct: boolean) => void;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function TableReviewActivity({ table, facts, onDone }: Props) {
  const [step, setStep] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [allChoices, setAllChoices] = useState<number[][] | null>(null);

  // Generamos las opciones de cada pregunta una sola vez, en un efecto
  // (no durante el render) para no depender de Math.random en el cuerpo
  // del componente.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAllChoices(
      facts.map((f) => {
        const correct = f.a * f.b;
        const set = new Set<number>([correct]);
        while (set.size < 4) {
          const delta = Math.floor(Math.random() * 11) - 5;
          const candidate = correct + delta;
          if (candidate >= 0 && candidate !== correct) set.add(candidate);
        }
        return shuffle(Array.from(set));
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fact = facts[step];
  const correctAnswer = fact.a * fact.b;

  if (!allChoices) return null;

  const choices = allChoices[step];
  const answerIndex = choices.indexOf(correctAnswer);

  function handleSelect(i: number) {
    if (selected !== null) return;
    setSelected(i);
    const isCorrect = i === answerIndex;
    const newCorrectCount = correctCount + (isCorrect ? 1 : 0);
    setTimeout(() => {
      if (step + 1 >= facts.length) {
        onDone(newCorrectCount / facts.length >= 0.7);
      } else {
        setCorrectCount(newCorrectCount);
        setStep(step + 1);
        setSelected(null);
      }
    }, 500);
  }

  return (
    <div className={cardBase}>
      <p className="text-sm text-slate-400 mb-2 text-center">
        Pregunta {step + 1} de {facts.length} · Tabla del {table}
      </p>
      <div className="w-full h-2 bg-slate-800 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-amber-400 transition-all"
          style={{ width: `${((step + 1) / facts.length) * 100}%` }}
        />
      </div>
      <p className="text-xl font-bold text-white mb-6 text-center">
        {fact.a} × {fact.b} = ?
      </p>
      <div className="grid grid-cols-2 gap-3">
        {choices.map((c, i) => {
          let state: "idle" | "correct" | "wrong" | "muted" = "idle";
          if (selected !== null) {
            if (i === answerIndex) state = "correct";
            else if (i === selected) state = "wrong";
            else state = "muted";
          }
          return (
            <button
              key={i}
              type="button"
              onClick={() => handleSelect(i)}
              className={choiceButtonClass(state)}
            >
              {c}
            </button>
          );
        })}
      </div>
    </div>
  );
}
