"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { LogoDeEvento, type LogoEvento } from "./LogosEventos";

// Barra lateral del mapa con los eventos y actividades especiales (pedido de
// Pedro, 16/10/2026): en vez de carteles grandes arriba de las materias, un
// logo chico con un letrero de una o dos palabras. Así las materias y los
// mundos quedan arriba, sin tener que bajar.

export interface ItemEvento {
  id: string;
  logo: LogoEvento;
  emoji?: string; // para las fiestas y temporadas
  letrero: string; // una o dos palabras
  titulo: string; // para lectores de pantalla y el cartelito al pasar el mouse
  nuevo?: boolean; // puntito: hay algo nuevo o un premio para ganar
  onClick: () => void;
}

export default function BarraEventos({ items }: { items: ItemEvento[] }) {
  if (items.length === 0) return null;
  return (
    <aside
      aria-label="Eventos y actividades especiales"
      className="sticky top-2 z-20 shrink-0 self-start flex flex-col items-center gap-2 sm:gap-3 rounded-2xl bg-amber-950/25 backdrop-blur-[2px] border border-amber-200/40 px-1 py-2 sm:px-1.5"
    >
      {items.map((it) => (
        <button
          key={it.id}
          type="button"
          onClick={it.onClick}
          title={it.titulo}
          aria-label={it.titulo}
          className="relative flex w-[4.25rem] sm:w-20 flex-col items-center gap-0.5 active:scale-95 hover:scale-105 transition"
        >
          <span className="block w-11 h-11 sm:w-14 sm:h-14 drop-shadow">
            <LogoDeEvento logo={it.logo} emoji={it.emoji} />
          </span>
          <span className="max-w-full rounded-md bg-amber-50/95 px-1 text-[10px] sm:text-xs font-black leading-tight text-center whitespace-nowrap tracking-tight text-amber-950 shadow-sm">
            {it.letrero}
          </span>
          {it.nuevo && (
            <span
              aria-hidden
              className="absolute top-0 right-1 sm:right-2 w-3.5 h-3.5 rounded-full bg-rose-500 border-2 border-white shadow animate-pulse"
            />
          )}
        </button>
      ))}
    </aside>
  );
}

// Ventana simple para lo que antes estaba arriba del mapa (pizarrón,
// temporadas): se abre desde la barra y se cierra con ✕, tocando afuera o Esc.
export function VentanaEvento({
  titulo,
  logo,
  emoji,
  onClose,
  children,
}: {
  titulo: string;
  logo: LogoEvento;
  emoji?: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);
  return createPortal(
    <div
      className="fixed inset-0 z-[90] flex items-start sm:items-center justify-center bg-black/55 p-2 sm:p-4 overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={titulo}
    >
      <div className="relative w-full max-w-2xl my-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2 mb-2 px-1">
          <span className="block w-10 h-10 shrink-0">
            <LogoDeEvento logo={logo} emoji={emoji} />
          </span>
          <h2 className="flex-1 text-white font-black text-lg drop-shadow">{titulo}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="w-10 h-10 rounded-full bg-white/90 text-slate-800 font-black text-lg shadow"
          >
            ✕
          </button>
        </div>
        <div className="[&>*]:!mb-0 [&>*]:!px-0">{children}</div>
      </div>
    </div>,
    document.body
  );
}
