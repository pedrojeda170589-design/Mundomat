"use client";

import { useState } from "react";
import { choiceButtonClass, cardBase } from "./shared";

interface Props {
  prompt: string;
  choices: string[];
  answerIndex: number;
  onDone: (correct: boolean) => void;
}

export default function McActivity({
  prompt,
  choices,
  answerIndex,
  onDone,
}: Props) {
  const [selected, setSelected] = useState<number | null>(null);

  function handleSelect(i: number) {
    if (selected !== null) return;
    setSelected(i);
    setTimeout(() => onDone(i === answerIndex), 700);
  }

  return (
    <div className={cardBase}>
      <p className="text-xl font-bold text-white mb-6 text-center">
        {prompt}
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
