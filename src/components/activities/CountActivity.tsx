"use client";

import { useEffect, useState } from "react";
import { playClip, stopClip } from "@/lib/audio";
import { numberWordEs } from "./numberWord";
import { cardBase } from "./shared";

interface Props {
  prompt: string;
  emoji: string;
  groups: number[];
  crossed?: number;
  answer: number;
  choices: number[];
  onDone: (correct: boolean) => void;
}

// Contar objetos dibujados (uno o varios grupos; algunos pueden estar
// tachados para quitar) y elegir el número.
export default function CountActivity({ prompt, emoji, groups, crossed = 0, answer, choices, onDone }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [marked, setMarked] = useState<Set<string>>(new Set());

  useEffect(() => {
    const t = setTimeout(() => playClip({ say: prompt }), 250);
    return () => {
      clearTimeout(t);
      stopClip();
    };
  }, [prompt]);

  function choose(n: number) {
    if (selected !== null) return;
    setSelected(n);
    stopClip();
    setTimeout(() => onDone(n === answer), 900);
  }

  // Tocar un dibujo lo marca (ayuda a no contarlo dos veces).
  function toggle(key: string) {
    setMarked((m) => {
      const next = new Set(m);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  const lastGroup = groups.length - 1;
  return (
    <div className={cardBase}>
      <div className="flex items-start gap-2 mb-3">
        <button
          type="button"
          onClick={() => playClip({ say: prompt })}
          className="shrink-0 w-11 h-11 rounded-full bg-sky-500 text-white text-xl shadow active:scale-95"
          aria-label="Escuchar la consigna"
        >
          🔊
        </button>
        <p className="text-lg font-bold text-white leading-snug pt-1.5">{prompt}</p>
      </div>
      <div className="rounded-2xl bg-white/95 p-3 mb-4 flex flex-wrap items-center justify-center gap-3">
        {groups.map((g, gi) => (
          <div key={gi} className="flex items-center gap-3">
            {gi > 0 && <span className="text-3xl font-black text-slate-500">+</span>}
            <div className={`flex flex-wrap justify-center gap-1 max-w-[15rem] ${groups.length > 1 ? "rounded-xl border-2 border-dashed border-slate-300 p-2" : ""}`}>
              {Array.from({ length: g }, (_, i) => {
                const key = `${gi}-${i}`;
                const isCrossed = gi === lastGroup && i >= g - crossed;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggle(key)}
                    className={`relative text-4xl leading-none p-0.5 rounded-lg ${marked.has(key) ? "bg-amber-200" : ""}`}
                    aria-label={isCrossed ? "tachado" : "objeto"}
                  >
                    <span className={isCrossed ? "opacity-40" : ""}>{emoji}</span>
                    {isCrossed && <span className="absolute inset-0 flex items-center justify-center text-red-600 text-4xl font-black">✕</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-400 text-center mb-3">Tip: tocá cada dibujo mientras contás para marcarlo.</p>
      <div className="grid grid-cols-3 gap-3">
        {choices.map((n) => {
          let cls = "bg-white text-slate-900 border-slate-300";
          if (selected !== null) {
            if (n === answer) cls = "bg-emerald-100 text-emerald-900 border-emerald-500 ring-4 ring-emerald-400/60";
            else if (n === selected) cls = "bg-red-100 text-red-900 border-red-500";
            else cls = "bg-white/50 text-slate-500 border-slate-300 opacity-60";
          }
          return (
            <button
              key={n}
              type="button"
              onClick={() => choose(n)}
              onDoubleClick={() => playClip({ say: numberWordEs(n) })}
              className={`rounded-2xl border-4 py-4 text-4xl font-black transition active:scale-95 ${cls}`}
            >
              {n}
            </button>
          );
        })}
      </div>
    </div>
  );
}
