"use client";

import { useEffect, useRef } from "react";

// Pantalla del premio ganado: el premio se acerca (zoom) hasta el centro de
// la pantalla con un contorno de luz dorada. Se cierra tocando el botón, la
// tecla Escape o el fondo.
export default function PremioAparece({
  titulo,
  children,
  onCerrar,
}: {
  titulo: string;
  children: React.ReactNode;
  onCerrar: () => void;
}) {
  const boton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    boton.current?.focus();
    const tecla = (e: KeyboardEvent) => e.key === "Escape" && onCerrar();
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  }, [onCerrar]);
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={titulo}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-6"
      onClick={onCerrar}
    >
      <div
        className="mm-premio-zoom w-full max-w-xs rounded-3xl bg-gradient-to-b from-yellow-50 to-amber-100 border-2 border-yellow-300 p-6 text-center text-amber-950"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-xs font-black uppercase tracking-widest text-amber-700">🎉 ¡Premio!</p>
        <div className="my-4 flex justify-center">
          <span className="mm-premio-zoom-emoji">{children}</span>
        </div>
        <p className="font-black text-lg leading-tight">{titulo}</p>
        <button
          ref={boton}
          onClick={onCerrar}
          className="mt-5 w-full rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 py-3 font-black text-slate-950 shadow min-h-11"
        >
          ¡Genial!
        </button>
      </div>
    </div>
  );
}
