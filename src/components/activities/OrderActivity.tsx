"use client";

import { useState } from "react";
import { cardBase } from "./shared";

interface Props {
  prompt: string;
  items: string[];
  correctOrder: number[];
  onDone: (correct: boolean) => void;
}

export default function OrderActivity({
  prompt,
  items,
  correctOrder,
  onDone,
}: Props) {
  const [picked, setPicked] = useState<number[]>([]);
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);

  const remaining = items
    .map((_, i) => i)
    .filter((i) => !picked.includes(i));

  function handlePick(i: number) {
    if (result !== null) return;
    const next = [...picked, i];
    setPicked(next);
    if (next.length === items.length) {
      const isCorrect = next.every((v, idx) => v === correctOrder[idx]);
      setResult(isCorrect ? "correct" : "wrong");
      setTimeout(() => onDone(isCorrect), 1100);
    }
  }

  function handleUndo() {
    if (result !== null) return;
    setPicked(picked.slice(0, -1));
  }

  return (
    <div className={cardBase}>
      <p className="text-xl font-bold text-white mb-4 text-center">
        {prompt}
      </p>

      <div className="flex flex-wrap gap-2 justify-center min-h-[3rem] mb-4 rounded-xl bg-slate-800/60 border border-slate-700 p-3">
        {picked.length === 0 && (
          <span className="text-slate-500 text-sm">
            Tocá los números en el orden correcto
          </span>
        )}
        {picked.map((i, order) => (
          <span
            key={`${i}-${order}`}
            className="rounded-lg bg-amber-500/20 border border-amber-400 text-amber-200 font-bold px-3 py-1.5"
          >
            {items[i]}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        {remaining.map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => handlePick(i)}
            disabled={result !== null}
            className="rounded-xl border-2 border-slate-600 bg-slate-800 text-white font-bold px-3 py-3 hover:border-amber-400 active:scale-[0.98] transition disabled:opacity-50"
          >
            {items[i]}
          </button>
        ))}
      </div>

      {picked.length > 0 && result === null && (
        <button
          type="button"
          onClick={handleUndo}
          className="text-slate-400 text-sm underline mx-auto block"
        >
          Deshacer último
        </button>
      )}

      {result === "correct" && (
        <p className="text-emerald-300 font-bold text-lg text-center mt-3">
          ¡Correcto! 🎉
        </p>
      )}
      {result === "wrong" && (
        <p className="text-red-300 font-bold text-lg text-center mt-3">
          Ese no era el orden correcto.
        </p>
      )}
    </div>
  );
}
