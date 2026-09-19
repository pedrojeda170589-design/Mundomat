"use client";

import { useMemo, useState } from "react";
import { cardBase } from "./shared";

interface Pair {
  left: string;
  right: string;
}

interface Props {
  prompt: string;
  pairs: Pair[];
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

export default function MatchActivity({ prompt, pairs, onDone }: Props) {
  const rightOrder = useMemo(
    () => shuffle(pairs.map((_, i) => i)),
    [pairs]
  );
  const [matched, setMatched] = useState<Record<number, number>>({});
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [wrongFlash, setWrongFlash] = useState<number | null>(null);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [finished, setFinished] = useState(false);

  const matchedLefts = new Set(Object.keys(matched).map(Number));
  const matchedRights = new Set(Object.values(matched));

  function handleLeftClick(leftIdx: number) {
    if (finished || matchedLefts.has(leftIdx)) return;
    setSelectedLeft(leftIdx);
  }

  function handleRightClick(rightIdx: number) {
    if (finished || selectedLeft === null || matchedRights.has(rightIdx))
      return;
    const isCorrect = selectedLeft === rightIdx;
    if (isCorrect) {
      const nextMatched = { ...matched, [selectedLeft]: rightIdx };
      setMatched(nextMatched);
      setSelectedLeft(null);
      if (Object.keys(nextMatched).length === pairs.length) {
        setFinished(true);
        const correct = wrongAttempts <= pairs.length;
        setTimeout(() => onDone(correct), 700);
      }
    } else {
      setWrongAttempts((n) => n + 1);
      setWrongFlash(rightIdx);
      setTimeout(() => {
        setWrongFlash(null);
        setSelectedLeft(null);
      }, 500);
    }
  }

  return (
    <div className={cardBase}>
      <p className="text-xl font-bold text-white mb-6 text-center">
        {prompt}
      </p>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          {pairs.map((p, i) => {
            const isMatched = matchedLefts.has(i);
            const isSelected = selectedLeft === i;
            return (
              <button
                key={i}
                type="button"
                onClick={() => handleLeftClick(i)}
                disabled={isMatched}
                className={`rounded-xl border-2 px-3 py-2.5 text-sm font-bold text-center transition ${
                  isMatched
                    ? "bg-emerald-500/20 border-emerald-400 text-emerald-200"
                    : isSelected
                      ? "bg-amber-500/20 border-amber-400 text-amber-200"
                      : "bg-slate-800 border-slate-600 text-white hover:border-amber-400"
                }`}
              >
                {p.left}
              </button>
            );
          })}
        </div>
        <div className="flex flex-col gap-2">
          {rightOrder.map((rightIdx) => {
            const isMatched = matchedRights.has(rightIdx);
            const isWrong = wrongFlash === rightIdx;
            return (
              <button
                key={rightIdx}
                type="button"
                onClick={() => handleRightClick(rightIdx)}
                disabled={isMatched}
                className={`rounded-xl border-2 px-3 py-2.5 text-sm font-bold text-center transition ${
                  isMatched
                    ? "bg-emerald-500/20 border-emerald-400 text-emerald-200"
                    : isWrong
                      ? "bg-red-500/20 border-red-400 text-red-200"
                      : "bg-slate-800 border-slate-600 text-white hover:border-amber-400"
                }`}
              >
                {pairs[rightIdx].right}
              </button>
            );
          })}
        </div>
      </div>
      {finished && (
        <p className="text-emerald-300 font-bold text-lg text-center mt-4">
          ¡Uniste todos los pares! 🎉
        </p>
      )}
    </div>
  );
}
