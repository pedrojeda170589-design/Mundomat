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

  const isLong = choices.some((c) => c.length > 10 || c.includes(" "));

  return (
    <div className={cardBase}>
      <p className="text-xl font-bold text-white mb-6 text-center">
        {prompt}
      </p>
      <div className={isLong ? "flex flex-col gap-2" : "grid grid-cols-2 gap-3"}>
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
              className={`${choiceButtonClass(state)} ${isLong ? "text-sm sm:text-base text-left px-3.5 py-2.5" : ""}`}
            >
              {c}
            </button>
          );
        })}
      </div>
    </div>
  );
}
