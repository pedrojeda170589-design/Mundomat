"use client";

import { useState } from "react";
import { choiceButtonClass, cardBase } from "./shared";

interface Props {
  prompt: string;
  resolution: string;
  choices: string[];
  answerIndex: number;
  correctAnswer?: string;
  onDone: (correct: boolean) => void;
}

export default function FindErrorActivity({
  prompt,
  resolution,
  choices,
  answerIndex,
  correctAnswer,
  onDone,
}: Props) {
  const [selected, setSelected] = useState<number | null>(null);

  function handleSelect(i: number) {
    if (selected !== null) return;
    setSelected(i);
    setTimeout(() => onDone(i === answerIndex), 1000);
  }

  return (
    <div className={cardBase}>
      <p className="text-lg font-bold text-white mb-3 text-center">
        {prompt}
      </p>
      <p className="text-center text-amber-200 font-mono text-lg bg-slate-800/70 border border-slate-700 rounded-xl px-4 py-3 mb-5">
        {resolution}
      </p>
      <div className="flex flex-col gap-3">
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
      {selected !== null && correctAnswer && (
        <p className="text-center text-emerald-200 text-sm mt-4 bg-emerald-500/10 border border-emerald-400/30 rounded-lg px-3 py-2">
          Correcto: {correctAnswer}
        </p>
      )}
    </div>
  );
}
