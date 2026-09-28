"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { WeekendGameProps } from "@/components/weekend/registry";
import Burst from "@/components/weekend/Burst";

// Cuánto tiempo quedan a la vista dos cartas que no son pareja.
const MISMATCH_SHOW_MS = 1100;

// Memorama clásico (encontrar parejas). Sirve para los dos tipos:
// - imágenes: dos dibujos iguales;
// - conceptos: una palabra y su significado.
// Como en Memoria Numérica, las cartas nunca cambian de lugar y el error no
// castiga: las dos cartas se muestran un momento y se vuelven a tapar.
export default function MemoramaGame({ activity, onComplete, onProgress }: WeekendGameProps) {
  const memo = activity.memo!;
  const { cards } = memo;
  const [matched, setMatched] = useState<Set<number>>(new Set()); // índices de carta
  const [open, setOpen] = useState<number[]>([]);
  const [lastMatch, setLastMatch] = useState<number | null>(null);
  const [mismatches, setMismatches] = useState(0);
  const [done, setDone] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  function handleTap(i: number) {
    if (done || matched.has(i) || open.includes(i) || open.length === 2) return;
    const next = [...open, i];
    setOpen(next);
    if (next.length < 2) return;
    const [a, b] = next;
    if (cards[a].pairId === cards[b].pairId) {
      const m = new Set(matched);
      m.add(a);
      m.add(b);
      setMatched(m);
      setOpen([]);
      setLastMatch(cards[a].pairId);
      onProgress?.(m.size / 2, memo.pairs);
      if (m.size === cards.length) {
        setDone(true);
        // "Sin errores" en un memorama: como mucho una vuelta de más por
        // pareja (hay que dar vuelta cartas para conocerlas).
        const errors = Math.max(0, mismatches - memo.pairs);
        timer.current = setTimeout(() => onComplete({ errors }), 1400);
      }
    } else {
      setMismatches((n) => n + 1);
      timer.current = setTimeout(() => setOpen([]), MISMATCH_SHOW_MS);
    }
  }

  const n = cards.length;
  const cols = n <= 6 ? "grid-cols-3" : n <= 8 ? "grid-cols-4" : "grid-cols-4 sm:grid-cols-5";
  const isText = cards[0]?.kind === "text";
  const found = matched.size / 2;

  return (
    <div className="relative flex flex-col items-center gap-5 w-full">
      <div className="parchment-panel rounded-2xl px-5 py-3 text-center w-full max-w-md">
        {done ? (
          <p className="font-black text-xl text-emerald-700">¡Encontraste todas las parejas! ✨</p>
        ) : (
          <>
            <p className="text-sm font-semibold opacity-80">
              {isText ? "Uní cada palabra con su significado" : "Encontrá los dibujos iguales"}
            </p>
            <p className="text-2xl font-black text-violet-700 leading-tight">
              Parejas: {found} de {memo.pairs}
            </p>
            <p className="text-xs opacity-70">{memo.theme}</p>
          </>
        )}
      </div>

      <div className={`grid ${cols} gap-2.5 sm:gap-3 w-full max-w-lg`}>
        {cards.map((card, i) => {
          const isMatched = matched.has(i);
          const isOpen = open.includes(i);
          const wrong = open.length === 2 && isOpen && !isMatched;
          const up = isMatched || isOpen;
          return (
            <button
              key={i}
              onClick={() => handleTap(i)}
              aria-label={up ? card.label : "Carta boca abajo"}
              className={`wk-card aspect-[3/4] w-full ${up ? "is-up" : ""} ${wrong ? "is-wrong" : ""} ${
                isMatched ? "is-found" : ""
              } ${isMatched && lastMatch === card.pairId ? "just-found" : ""} ${
                !up && !done ? "active:scale-95 hover:-translate-y-1" : ""
              } transition-transform`}
            >
              <span className="wk-card-inner block">
                <span className="wk-face wk-face-back">
                  <span className="text-2xl opacity-90">❓</span>
                </span>
                <span className="wk-face wk-face-front p-1.5">
                  {card.kind === "image" ? (
                    <span className="relative block w-full h-full">
                      <Image src={card.value} alt={card.label} fill sizes="140px" className="object-contain p-1" />
                    </span>
                  ) : (
                    <span className="text-sm sm:text-lg font-black text-slate-800 leading-tight text-center">
                      {card.value}
                    </span>
                  )}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <p className="text-sm text-slate-700 min-h-5 text-center">
        {open.length === 2 && !done
          ? "No son pareja. ¡Mirá bien dónde están y seguí intentando!"
          : "Las cartas no se mueven: usá tu memoria 🧠"}
      </p>

      {done && <Burst />}
    </div>
  );
}
