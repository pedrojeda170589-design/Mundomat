"use client";

import { useEffect, useState } from "react";
import { playClip, stopClip } from "@/lib/audio";
import { cardBase } from "./shared";

interface Props {
  prompt: string;
  say?: string;
  target: string[];
  tiles: string[];
  emoji?: string;
  onDone: (correct: boolean) => void;
}

// Armar una palabra o un número con fichas (sílabas, letras móviles o
// cifras): se toca una ficha y va al primer lugar libre; tocar un lugar la
// devuelve.
export default function BuildActivity({ prompt, say, target, tiles, emoji, onDone }: Props) {
  const [slots, setSlots] = useState<(number | null)[]>(() => target.map(() => null));
  const [done, setDone] = useState<null | boolean>(null);

  useEffect(() => {
    const t = setTimeout(() => playClip({ say: say ?? prompt }), 250);
    return () => {
      clearTimeout(t);
      stopClip();
    };
  }, [say, prompt]);

  const used = new Set(slots.filter((x): x is number => x !== null));

  function place(tileIdx: number) {
    if (done !== null || used.has(tileIdx)) return;
    playClip({ say: tiles[tileIdx] });
    setSlots((s) => {
      const i = s.indexOf(null);
      if (i < 0) return s;
      const next = [...s];
      next[i] = tileIdx;
      return next;
    });
  }

  function remove(slot: number) {
    if (done !== null) return;
    setSlots((s) => {
      const next = [...s];
      next[slot] = null;
      return next;
    });
  }

  function check() {
    const built = slots.map((x) => (x === null ? "" : tiles[x]));
    const ok = built.every((t, i) => t === target[i]);
    setDone(ok);
    playClip({ say: built.join("") });
    setTimeout(() => onDone(ok), 1200);
  }

  const full = slots.every((x) => x !== null);
  return (
    <div className={cardBase}>
      <div className="flex items-start gap-2 mb-3">
        <button
          type="button"
          onClick={() => playClip({ say: say ?? prompt })}
          className="shrink-0 w-11 h-11 rounded-full bg-sky-500 text-white text-xl shadow active:scale-95"
          aria-label="Escuchar la consigna"
        >
          🔊
        </button>
        <p className="text-lg font-bold text-white leading-snug pt-1.5">{prompt}</p>
      </div>
      {emoji && <p className="text-7xl text-center mb-3">{emoji}</p>}
      <div className="flex flex-wrap justify-center gap-2 mb-5">
        {slots.map((x, i) => (
          <button
            key={i}
            type="button"
            onClick={() => remove(i)}
            className={`min-w-[3.5rem] h-16 px-2 rounded-xl border-4 border-dashed text-3xl font-black ${
              done === null
                ? x === null
                  ? "border-slate-500 bg-slate-800/60 text-transparent"
                  : "border-amber-400 bg-amber-100 text-slate-900"
                : done
                  ? "border-emerald-500 bg-emerald-100 text-emerald-900"
                  : tiles[x ?? 0] === target[i]
                    ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                    : "border-red-500 bg-red-100 text-red-900"
            }`}
            style={{ fontFamily: "Andika, ui-rounded, system-ui, sans-serif" }}
          >
            {x === null ? "_" : tiles[x]}
          </button>
        ))}
      </div>
      {done === false && (
        <p className="text-center text-amber-200 font-bold mb-3" style={{ fontFamily: "Andika, ui-rounded, system-ui, sans-serif" }}>
          Era: {target.join("")}
        </p>
      )}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {tiles.map((t, i) => (
          <button
            key={i}
            type="button"
            onClick={() => place(i)}
            disabled={used.has(i) || done !== null}
            className="min-w-[3.5rem] h-14 px-3 rounded-xl bg-white text-slate-900 border-b-4 border-slate-400 text-3xl font-black shadow active:translate-y-0.5 disabled:opacity-25"
            style={{ fontFamily: "Andika, ui-rounded, system-ui, sans-serif" }}
          >
            {t}
          </button>
        ))}
      </div>
      {done === null && (
        <button
          type="button"
          onClick={check}
          disabled={!full}
          className="w-full rounded-2xl bg-amber-400 text-slate-900 font-black py-3 disabled:opacity-40"
        >
          ¡Listo!
        </button>
      )}
    </div>
  );
}
