"use client";

import type { StudentProgress } from "@/types";
import { ETAPAS, etapasSuperadas, proximaEtapa } from "@/lib/reserva";

// Tarjeta de la actividad especial en la pantalla del mapa (3.º y 4.º).
export default function ReservaCard({ progress, onClick }: { progress?: StudentProgress | null; onClick: () => void }) {
  const hechas = etapasSuperadas(progress);
  const sig = proximaEtapa(progress);
  const proxima = sig ? ETAPAS.find((e) => e.n === sig) : null;
  return (
    <div className="relative z-10 max-w-3xl w-full mx-auto px-4 mb-4">
      <button
        type="button"
        onClick={onClick}
        className="w-full parchment-panel rounded-2xl p-3.5 flex items-center justify-between gap-3 border-2 border-emerald-400 bg-gradient-to-r from-emerald-100/90 via-amber-50 to-sky-100/90 shadow-md hover:brightness-105 active:scale-[0.99] transition text-left"
      >
        <span className="flex items-center gap-3 min-w-0">
          <span className="text-3xl">🦙</span>
          <span className="min-w-0">
            <span className="block font-black text-amber-950 text-sm">Reserva y expedición patagónica · actividad especial</span>
            <span className="block text-xs text-amber-900/80 leading-snug">
              {proxima
                ? `Próxima parada: ${proxima.nivel === "departamento" ? "departamento" : "provincia de"} ${proxima.nombre}. Animales, plantas y lugares de la Patagonia.`
                : "¡Recorriste toda la expedición! Mirá tu reserva."}
            </span>
            <span className="block text-[11px] font-bold text-amber-950/80 mt-0.5">⭐ Etapas: {hechas}/{ETAPAS.length}</span>
          </span>
        </span>
        <span className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-xs px-3.5 py-2 shrink-0">🗺️ ¡Explorar!</span>
      </button>
    </div>
  );
}
