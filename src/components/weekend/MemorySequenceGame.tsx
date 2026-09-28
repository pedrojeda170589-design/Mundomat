"use client";

import { useEffect, useRef, useState } from "react";
import type { WeekendGameProps } from "@/components/weekend/registry";
import Burst from "@/components/weekend/Burst";

// Cuánto tiempo se ve una carta equivocada antes de volver a taparse.
const WRONG_SHOW_MS = 1100;

// "Memoria Numérica": cartas boca abajo que NUNCA cambian de lugar. Hay que
// encontrar los números de la secuencia en orden. Si se toca una carta que
// no es la que se busca, se muestra un momento y se vuelve a tapar (sin
// castigo: sirve para recordar dónde está); si es la correcta, queda a la
// vista y se pasa al número siguiente.
export default function MemorySequenceGame({ activity, onComplete }: WeekendGameProps) {
  const { values, layout } = activity;
  const [found, setFound] = useState<Set<number>>(new Set()); // posiciones descubiertas
  const [wrongPos, setWrongPos] = useState<number | null>(null);
  const [justFound, setJustFound] = useState<number | null>(null);
  const [errors, setErrors] = useState(0);
  const [done, setDone] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const targetIdx = found.size;
  const target = values[targetIdx];

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  function handleTap(pos: number) {
    if (done || wrongPos !== null || found.has(pos)) return;
    if (layout[pos] === target) {
      const next = new Set(found);
      next.add(pos);
      setFound(next);
      setJustFound(pos);
      if (next.size === values.length) {
        setDone(true);
        timer.current = setTimeout(() => onComplete({ errors }), 1400);
      }
    } else {
      setErrors((e) => e + 1);
      setWrongPos(pos);
      timer.current = setTimeout(() => setWrongPos(null), WRONG_SHOW_MS);
    }
  }

  // Tamaño de carta según cuántas hay, para que entren grandes en celular.
  const n = layout.length;
  const cardSize =
    n <= 3
      ? "w-24 h-32 sm:w-32 sm:h-40 text-5xl sm:text-6xl"
      : n <= 4
        ? "w-[4.6rem] h-28 sm:w-28 sm:h-36 text-4xl sm:text-5xl"
        : "w-[5.2rem] h-28 sm:w-28 sm:h-36 text-4xl sm:text-5xl";

  return (
    <div className="relative flex flex-col items-center gap-5 w-full">
      {/* Consigna siempre visible */}
      <div className="parchment-panel rounded-2xl px-5 py-3 text-center w-full max-w-md">
        {done ? (
          <p className="font-black text-xl text-emerald-700">¡Secuencia completa! ✨</p>
        ) : (
          <>
            <p className="text-sm font-semibold opacity-80">Buscá el número</p>
            <p className="text-5xl font-black text-violet-700 leading-tight" aria-live="polite">
              {target}
            </p>
          </>
        )}
        {/* Camino de la secuencia: lo encontrado, lo que se busca y lo que falta */}
        <div className="mt-2 flex flex-wrap items-center justify-center gap-1 text-sm font-black">
          {values.map((v, i) => (
            <span key={v} className="flex items-center gap-1">
              <span
                className={`min-w-8 px-1.5 py-0.5 rounded-lg border-2 ${
                  i < targetIdx
                    ? "bg-emerald-100 border-emerald-400 text-emerald-800"
                    : i === targetIdx && !done
                      ? "bg-amber-100 border-amber-400 text-amber-800 animate-pulse"
                      : "bg-white/60 border-slate-300 text-slate-400"
                }`}
              >
                {i <= targetIdx || done ? v : "?"}
              </span>
              {i < values.length - 1 && <span className="text-slate-400">→</span>}
            </span>
          ))}
        </div>
      </div>

      {/* Mesa de cartas: cada una siempre en el mismo lugar */}
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4 max-w-xl">
        {layout.map((value, pos) => {
          const isFound = found.has(pos);
          const isWrong = wrongPos === pos;
          const up = isFound || isWrong;
          return (
            <button
              key={pos}
              onClick={() => handleTap(pos)}
              aria-label={up ? `Carta ${value}` : "Carta boca abajo"}
              className={`wk-card ${cardSize} ${up ? "is-up" : ""} ${isWrong ? "is-wrong" : ""} ${
                isFound ? "is-found" : ""
              } ${justFound === pos ? "just-found" : ""} ${
                !up && !done ? "active:scale-95 hover:-translate-y-1" : ""
              } transition-transform`}
            >
              <span className="wk-card-inner block">
                <span className="wk-face wk-face-back">
                  <span className="text-3xl opacity-90">❓</span>
                </span>
                <span className="wk-face wk-face-front font-black text-slate-800">{value}</span>
              </span>
            </button>
          );
        })}
      </div>

      <p className="text-sm text-slate-700 min-h-5">
        {wrongPos !== null
          ? `Ese es el ${layout[wrongPos]}. ¡Acordate dónde está! Seguí buscando el ${target}.`
          : errors === 0
            ? "Tocá una carta para darla vuelta."
            : "Las cartas no se mueven: usá tu memoria 🧠"}
      </p>

      {done && <Burst />}
    </div>
  );
}
