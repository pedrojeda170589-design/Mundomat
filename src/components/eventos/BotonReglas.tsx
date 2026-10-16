"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

// Ícono de reglas dentro de cada evento (pedido de Pedro, 16/10/2026): en vez
// de párrafos largos en la pantalla, un botón 📜 que abre las reglas en
// renglones cortos.
export default function BotonReglas({
  titulo,
  reglas,
  className = "",
  claro = false,
}: {
  titulo: string;
  reglas: React.ReactNode[];
  className?: string;
  claro?: boolean; // sobre fondo de madera oscura
}) {
  const [abierto, setAbierto] = useState(false);
  useEffect(() => {
    if (!abierto) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setAbierto(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [abierto]);
  return (
    <>
      <button
        type="button"
        onClick={() => setAbierto(true)}
        aria-label={`Reglas: ${titulo}`}
        title="Reglas del juego"
        className={`shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-full border-2 shadow text-lg active:scale-95 transition ${
          claro ? "bg-amber-50 border-amber-300" : "bg-white border-amber-400"
        } ${className}`}
      >
        📜
      </button>
      {abierto &&
        createPortal(
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/55 p-4"
            onClick={() => setAbierto(false)}
            role="dialog"
            aria-modal="true"
            aria-label={`Reglas: ${titulo}`}
          >
            <div
              className="w-full max-w-sm parchment-panel rounded-3xl p-5 shadow-2xl text-amber-950"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl" aria-hidden>
                  📜
                </span>
                <h2 className="flex-1 font-black text-lg leading-tight">{titulo}</h2>
                <button
                  type="button"
                  onClick={() => setAbierto(false)}
                  aria-label="Cerrar"
                  className="w-9 h-9 rounded-full bg-white/80 border border-amber-300 font-black"
                >
                  ✕
                </button>
              </div>
              <ul className="flex flex-col gap-2">
                {reglas.map((r, i) => (
                  <li key={i} className="flex gap-2 text-sm leading-snug">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-black flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="pt-0.5">{r}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => setAbierto(false)}
                className="mt-4 w-full rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-400 py-2.5 font-black text-slate-900"
              >
                ¡Entendido!
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
