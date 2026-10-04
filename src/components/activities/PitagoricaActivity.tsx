"use client";

import { useState } from "react";
import { cardBase } from "./shared";

// Tabla pitagórica interactiva (metodología de Pedro, clases 1, 2, 6 y 7):
// - "cruce": buscar la fila de a y la columna de b y tocar el casillero
//   donde se cruzan (a × b).
// - "inversa": para dividir D ÷ d, buscar la fila del divisor, avanzar hasta
//   el dividendo y subir hasta el número de arriba de esa columna (el
//   cociente). Se toca ese número de arriba.
interface Props {
  prompt: string;
  modo: "cruce" | "inversa";
  fila: number; // a (cruce) o divisor (inversa)
  columna: number; // b (cruce) o cociente (inversa)
  onDone: (correct: boolean) => void;
}

const N = 10;

export default function PitagoricaActivity({ prompt, modo, fila, columna, onDone }: Props) {
  const [tocado, setTocado] = useState<{ f: number; c: number } | null>(null);
  // En "inversa", primero se toca el dividendo en la fila del divisor.
  const [dividendoOk, setDividendoOk] = useState(false);
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);

  function terminar(ok: boolean) {
    setResult(ok ? "correct" : "wrong");
    setTimeout(() => onDone(ok), 1300);
  }

  function tocar(f: number, c: number) {
    if (result) return;
    setTocado({ f, c });
    if (modo === "cruce") {
      terminar(f === fila && c === columna);
      return;
    }
    // inversa
    if (!dividendoOk) {
      if (f === fila && c === columna) setDividendoOk(true);
      else terminar(false);
      return;
    }
    // segundo toque: el número de arriba de la columna (fila 0 = encabezado)
    terminar(f === 0 && c === columna);
  }

  const resaltarFila = modo === "inversa" || (tocado && result === null) ? fila : -1;
  const ayuda =
    modo === "cruce"
      ? `Buscá la fila del ${fila} (←) y la columna del ${columna} (↑). Tocá donde se cruzan.`
      : dividendoOk
        ? "¡Bien! Ahora subí por esa columna y tocá el número de arriba: ese es el resultado."
        : `Andá a la fila del ${fila} (el divisor) y tocá el ${fila * columna} (el dividendo).`;

  return (
    <div className={cardBase}>
      <p className="text-lg font-bold text-white mb-1 text-center">{prompt}</p>
      <p className="text-xs text-amber-200 text-center mb-3">{ayuda}</p>
      <div
        className="grid gap-[2px] mx-auto select-none"
        style={{ gridTemplateColumns: `repeat(${N + 1}, minmax(0, 1fr))`, maxWidth: 360 }}
        role="grid"
        aria-label="Tabla pitagórica"
      >
        {Array.from({ length: N + 1 }, (_, f) =>
          Array.from({ length: N + 1 }, (_, c) => {
            const esquina = f === 0 && c === 0;
            const encabezado = f === 0 || c === 0;
            const valor = esquina ? "×" : f === 0 ? c : c === 0 ? f : f * c;
            const enFila = f === resaltarFila && c > 0;
            const elegido = tocado?.f === f && tocado?.c === c;
            const esRespuesta =
              result !== null &&
              ((modo === "cruce" && f === fila && c === columna) ||
                (modo === "inversa" && ((f === 0 && c === columna) || (f === fila && c === columna))));
            const clickeable = modo === "cruce" ? !encabezado : !esquina && (f === 0 ? c > 0 : c > 0);
            let color = encabezado ? "bg-amber-500/80 text-slate-950 font-black" : "bg-slate-800 text-slate-100";
            if (enFila && !encabezado) color = "bg-sky-700/80 text-white";
            if (dividendoOk && f === fila && c === columna) color = "bg-emerald-500 text-white font-black";
            if (esRespuesta) color = "bg-emerald-500 text-white font-black ring-2 ring-emerald-200";
            if (elegido && result === "wrong") color = "bg-rose-500 text-white font-black";
            return (
              <button
                key={`${f}-${c}`}
                type="button"
                disabled={!clickeable || result !== null}
                onClick={() => tocar(f, c)}
                className={`aspect-square rounded-[4px] text-[11px] sm:text-xs leading-none flex items-center justify-center ${color} disabled:cursor-default`}
                aria-label={esquina ? "por" : encabezado ? String(valor) : `${f} por ${c}`}
              >
                {valor}
              </button>
            );
          })
        )}
      </div>
      {result === "correct" && (
        <p className="text-emerald-300 font-bold text-center mt-3">
          ¡Correcto! {modo === "cruce" ? `${fila} × ${columna} = ${fila * columna}` : `${fila * columna} ÷ ${fila} = ${columna}, porque ${fila} × ${columna} = ${fila * columna}`} 🎉
        </p>
      )}
      {result === "wrong" && (
        <p className="text-red-300 font-bold text-center mt-3">
          No era. {modo === "cruce" ? `${fila} × ${columna} = ${fila * columna}` : `${fila * columna} ÷ ${fila} = ${columna}, porque ${fila} × ${columna} = ${fila * columna}`}.
        </p>
      )}
    </div>
  );
}
