"use client";

import { useState } from "react";
import { cardBase } from "./shared";

// Reparto con cajitas y tapitas (metodología de Pedro, clases 4 y 5): se
// toca una cajita para poner una tapita, de a una, hasta que no alcanza para
// darle una más a cada una. Después se responde cuánto le tocó a cada una
// (cociente) y cuánto sobró (resto).
interface Props {
  prompt: string;
  total: number; // dividendo (tapitas)
  cajas: number; // divisor (cajitas)
  objeto?: string; // emoji de lo que se reparte
  onDone: (correct: boolean) => void;
}

export default function RepartoActivity({ prompt, total, cajas, objeto = "🔵", onDone }: Props) {
  const [enCaja, setEnCaja] = useState<number[]>(() => Array(cajas).fill(0));
  const [aviso, setAviso] = useState<string | null>(null);
  const [cociente, setCociente] = useState("");
  const [resto, setResto] = useState("");
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);

  const repartidas = enCaja.reduce((s, n) => s + n, 0);
  const quedan = total - repartidas;
  const min = Math.min(...enCaja);
  // Termina cuando no alcanza para dar una más a cada cajita (y están parejas).
  const terminado = quedan < cajas && enCaja.every((n) => n === min);

  function poner(i: number) {
    if (terminado || result) return;
    if (quedan <= 0) return;
    if (enCaja[i] > min) {
      setAviso("¡Así no queda justo! Primero completá las otras cajitas.");
      return;
    }
    setAviso(null);
    setEnCaja((c) => c.map((n, k) => (k === i ? n + 1 : n)));
  }

  function responder(e: React.FormEvent) {
    e.preventDefault();
    if (result) return;
    const ok = Number(cociente) === Math.floor(total / cajas) && Number(resto) === total % cajas;
    setResult(ok ? "correct" : "wrong");
    setTimeout(() => onDone(ok), 1300);
  }

  return (
    <div className={cardBase}>
      <p className="text-lg font-bold text-white mb-3 text-center">{prompt}</p>
      {/* Montón de tapitas que faltan repartir */}
      <div className="rounded-2xl bg-slate-800/80 border border-slate-600 p-2 mb-3 min-h-[44px] flex flex-wrap gap-1 justify-center">
        {quedan > 0 ? (
          Array.from({ length: quedan }, (_, k) => (
            <span key={k} className="text-xl leading-none">{objeto}</span>
          ))
        ) : (
          <span className="text-xs text-slate-300 self-center">¡No quedan más!</span>
        )}
      </div>
      {/* Cajitas */}
      <div className="grid gap-2 mb-2" style={{ gridTemplateColumns: `repeat(${Math.min(cajas, 4)}, minmax(0, 1fr))` }}>
        {enCaja.map((n, i) => (
          <button
            key={i}
            type="button"
            onClick={() => poner(i)}
            disabled={terminado || !!result}
            className="rounded-2xl border-4 border-amber-700 bg-amber-200/90 min-h-[88px] p-1.5 flex flex-col items-center justify-between active:scale-95 transition disabled:active:scale-100"
            aria-label={`Cajita ${i + 1}: ${n}`}
          >
            <span className="flex flex-wrap gap-0.5 justify-center">
              {Array.from({ length: n }, (_, k) => (
                <span key={k} className="text-base leading-none">{objeto}</span>
              ))}
            </span>
            <span className="text-[11px] font-black text-amber-950">📦 {n}</span>
          </button>
        ))}
      </div>
      {aviso && <p className="text-amber-200 text-xs text-center font-bold mb-2">{aviso}</p>}
      {!terminado && !aviso && (
        <p className="text-slate-300 text-xs text-center mb-2">Tocá una cajita para poner una tapita. ¡De a una por vez!</p>
      )}
      {terminado && (
        <form onSubmit={responder} className="flex flex-col items-center gap-2 mt-1">
          <label className="text-white text-sm font-bold flex items-center gap-2">
            ¿Cuántas le tocaron a cada cajita?
            <input
              type="number"
              inputMode="numeric"
              value={cociente}
              onChange={(e) => setCociente(e.target.value)}
              disabled={!!result}
              className="w-16 text-center text-xl font-black rounded-xl bg-slate-800 border-2 border-slate-600 focus:border-amber-400 outline-none py-1 text-white"
            />
          </label>
          <label className="text-white text-sm font-bold flex items-center gap-2">
            ¿Cuántas sobraron?
            <input
              type="number"
              inputMode="numeric"
              value={resto}
              onChange={(e) => setResto(e.target.value)}
              disabled={!!result}
              className="w-16 text-center text-xl font-black rounded-xl bg-slate-800 border-2 border-slate-600 focus:border-amber-400 outline-none py-1 text-white"
            />
          </label>
          {!result && (
            <button type="submit" disabled={cociente === "" || resto === ""} className="rounded-full bg-amber-500 text-slate-900 font-bold px-6 py-2 disabled:opacity-50">
              Responder
            </button>
          )}
        </form>
      )}
      {result && (
        <p className={`${result === "correct" ? "text-emerald-300" : "text-red-300"} font-bold text-center mt-2`}>
          {result === "correct" ? "¡Correcto! " : "No era. "}
          {total} ÷ {cajas} = {Math.floor(total / cajas)}
          {total % cajas ? ` y sobra${total % cajas === 1 ? "" : "n"} ${total % cajas}` : " (no sobra nada)"}
        </p>
      )}
    </div>
  );
}
