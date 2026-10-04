"use client";

import { useState } from "react";
import { cardBase } from "./shared";
import { COLOR_COLUMNA, COLOR_FILA, TABLA_MAX } from "@/lib/tablaPitagorica";

// Tabla pitagórica interactiva con el modelo de Pedro (0 a 10, columnas de
// colores; la fila es el primer número y la columna el segundo):
// - "cruce": para a × b, tocar el casillero donde se cruzan la fila a y la
//   columna b.
// - "inversa": para D ÷ d, buscar el D en la fila d y después tocar el
//   número de arriba de esa columna (el resultado).
interface Props {
  prompt: string;
  modo: "cruce" | "inversa";
  fila: number; // a (cruce) o divisor (inversa)
  columna: number; // b (cruce) o cociente (inversa)
  onDone: (correct: boolean) => void;
}

const N = TABLA_MAX;

export default function PitagoricaActivity({ prompt, modo, fila, columna, onDone }: Props) {
  const [tocado, setTocado] = useState<{ f: number; c: number } | null>(null);
  const [dividendoOk, setDividendoOk] = useState(false);
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);

  function terminar(ok: boolean) {
    setResult(ok ? "correct" : "wrong");
    setTimeout(() => onDone(ok), 1400);
  }

  // f y c van de -1 (encabezados) a N.
  function tocar(f: number, c: number) {
    if (result) return;
    setTocado({ f, c });
    if (modo === "cruce") return terminar(f === fila && c === columna);
    if (!dividendoOk) {
      if (f === fila && c === columna) setDividendoOk(true);
      else terminar(false);
      return;
    }
    terminar(f === -1 && c === columna);
  }

  const cuenta =
    modo === "cruce"
      ? `${fila} × ${columna} = ${fila * columna}`
      : `${fila * columna} ÷ ${fila} = ${columna}, porque ${fila} × ${columna} = ${fila * columna}`;
  const ayuda =
    modo === "cruce"
      ? `En la fila está el primer número (${fila}) y en la columna el segundo (${columna}). Tocá donde se cruzan.`
      : dividendoOk
        ? `¡Bien! El ${fila * columna} está en la columna del ${columna}. Tocá el número de arriba de esa columna.`
        : `Buscá el ${fila * columna} en la fila del ${fila} y tocalo.`;

  const filaMarcada = modo === "inversa" || dividendoOk ? fila : -2;

  return (
    <div className={cardBase}>
      <p className="text-lg font-bold text-white mb-1 text-center">{prompt}</p>
      <p className="text-xs text-amber-200 text-center mb-3">{ayuda}</p>
      <div
        className="grid gap-[2px] mx-auto select-none rounded-lg overflow-hidden p-[2px]"
        style={{ gridTemplateColumns: `repeat(${N + 2}, minmax(0, 1fr))`, maxWidth: 380, background: "#3f3a8c" }}
        role="grid"
        aria-label="Tabla pitagórica"
      >
        {Array.from({ length: N + 2 }, (_, i) => i - 1).map((f) =>
          Array.from({ length: N + 2 }, (_, j) => j - 1).map((c) => {
            const esquina = f === -1 && c === -1;
            const encFila = c === -1 && f >= 0; // número de la fila (izquierda)
            const encCol = f === -1 && c >= 0; // número de la columna (arriba)
            const valor = esquina ? "×" : encFila ? f : encCol ? c : f * c;
            let bg = esquina
              ? COLOR_FILA.esquina
              : encFila
                ? COLOR_FILA.encabezado
                : encCol
                  ? COLOR_COLUMNA[c].encabezado
                  : COLOR_COLUMNA[c].celda;
            let extra = "";
            const enFila = f === filaMarcada && c >= 0;
            if (enFila) extra = "ring-2 ring-inset ring-sky-600";
            const esRespuesta =
              result !== null &&
              ((modo === "cruce" && f === fila && c === columna) ||
                (modo === "inversa" && ((f === -1 && c === columna) || (f === fila && c === columna))));
            if (dividendoOk && f === fila && c === columna) {
              bg = "#22c55e";
              extra = "text-white";
            }
            if (esRespuesta) {
              bg = "#16a34a";
              extra = "text-white ring-2 ring-emerald-200";
            }
            if (tocado?.f === f && tocado?.c === c && result === "wrong") {
              bg = "#ef4444";
              extra = "text-white";
            }
            const clickeable = modo === "cruce" ? !encFila && !encCol && !esquina : !esquina && !encFila;
            return (
              <button
                key={`${f}:${c}`}
                type="button"
                disabled={!clickeable || result !== null}
                onClick={() => tocar(f, c)}
                style={{ background: bg }}
                className={`aspect-square rounded-[3px] text-[10px] sm:text-xs leading-none flex items-center justify-center text-slate-900 ${
                  encFila || encCol || esquina ? "font-black text-[11px] sm:text-sm" : "font-semibold"
                } ${esquina ? "text-white" : ""} ${extra} disabled:cursor-default`}
                aria-label={esquina ? "por" : encFila ? `fila ${f}` : encCol ? `columna ${c}` : `${f} por ${c}`}
              >
                {valor}
              </button>
            );
          })
        )}
      </div>
      {result && (
        <p className={`${result === "correct" ? "text-emerald-300" : "text-red-300"} font-bold text-center mt-3`}>
          {result === "correct" ? "¡Correcto! " : "No era. "}
          {cuenta}
          {result === "correct" ? " 🎉" : "."}
        </p>
      )}
      <p className="text-center mt-2">
        <a href="/tabla-pitagorica" target="_blank" className="text-[11px] text-sky-300 underline">
          📥 Descargar mi tabla pitagórica
        </a>
      </p>
    </div>
  );
}
