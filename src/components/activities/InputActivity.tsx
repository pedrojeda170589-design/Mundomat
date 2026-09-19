"use client";

import { useState } from "react";
import { cardBase } from "./shared";

interface Props {
  prompt: string;
  answer: number;
  onDone: (correct: boolean) => void;
}

export default function InputActivity({ prompt, answer, onDone }: Props) {
  const [value, setValue] = useState("");
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (result !== null) return;
    const num = parseInt(value, 10);
    const isCorrect = num === answer;
    setResult(isCorrect ? "correct" : "wrong");
    setTimeout(() => onDone(isCorrect), 900);
  }

  return (
    <div className={cardBase}>
      <p className="text-xl font-bold text-white mb-6 text-center">
        {prompt}
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
        <input
          type="number"
          inputMode="numeric"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={result !== null}
          autoFocus
          className="w-32 text-center text-3xl font-black rounded-xl bg-slate-800 border-2 border-slate-600 focus:border-amber-400 outline-none py-3 text-white disabled:opacity-70"
        />
        {result === null && (
          <button
            type="submit"
            className="rounded-full bg-amber-500 text-slate-900 font-bold px-6 py-2"
          >
            Responder
          </button>
        )}
        {result === "correct" && (
          <p className="text-emerald-300 font-bold text-lg">
            ¡Correcto! 🎉
          </p>
        )}
        {result === "wrong" && (
          <p className="text-red-300 font-bold text-lg">
            No era, la respuesta era {answer}.
          </p>
        )}
      </form>
    </div>
  );
}
