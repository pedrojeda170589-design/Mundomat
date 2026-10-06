"use client";

import Image from "next/image";
import { ISLA_MONTE_LEON, MOCHILA_MONTE_LEON } from "@/lib/monteLeon/arte";
import { textoCuentaRegresiva } from "@/lib/monteLeon/fechas";
import type { StudentProgress } from "@/types";

interface Props {
  progress?: StudentProgress | null;
  onClick: () => void;
}

export default function MonteLeonCard({ progress, onClick }: Props) {
  const owned = new Set(progress?.seasonalCollection ?? []);
  const regalados = new Set(progress?.objetosRegalados ?? []);
  const tieneItem = (id: string) => owned.has(id) || regalados.has(id);

  const mochileroCount = MOCHILA_MONTE_LEON.filter((m) => tieneItem(m.id)).length;
  const etapasSuperadas = Object.values(progress?.monteLeon?.etapas ?? {}).filter(
    (e) => (e?.bestScore ?? 0) >= 80
  ).length;

  const textoDias = textoCuentaRegresiva();

  return (
    <div className="relative z-10 max-w-3xl w-full mx-auto px-4 mb-4">
      <button
        type="button"
        onClick={onClick}
        className="w-full parchment-panel rounded-2xl p-3.5 sm:p-4 flex items-center justify-between gap-3.5 border-2 border-sky-400/80 bg-gradient-to-r from-sky-100/90 via-amber-50 to-sky-100/90 shadow-md hover:brightness-105 active:scale-[0.99] transition text-left group"
      >
        {/* Isla e información */}
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-2xl overflow-hidden bg-white/70 p-1 border-2 border-sky-500/30 shadow-sm group-hover:scale-105 transition-transform">
            <Image
              src={ISLA_MONTE_LEON}
              alt="Isla de Monte León"
              fill
              sizes="64px"
              className="object-contain"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-black text-amber-950 text-sm sm:text-base flex items-center gap-1.5">
                <span>🐧</span> Viaje a Monte León
              </span>
              <span className="rounded-full bg-sky-600 text-white text-[10px] font-black px-2 py-0.5 shadow-xs">
                {textoDias}
              </span>
            </div>
            <span className="block text-xs text-amber-900/80 mt-0.5 leading-snug">
              Mundo especial de 3.º grado · El viaje, el parque, los animales, normas y dictado
            </span>
            <div className="flex items-center gap-3 mt-1.5 text-[11px] font-bold text-amber-950/80">
              <span className="flex items-center gap-1">
                <span>🎒</span> Mochila: {mochileroCount}/6 objetos
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <span>⭐</span> Etapas: {etapasSuperadas}/5
              </span>
            </div>
          </div>
        </div>

        {/* Botón acción */}
        <span className="rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-400 hover:to-teal-400 text-white font-black text-xs px-3.5 py-2 shrink-0 shadow-sm">
          🐧 ¡Explorar!
        </span>
      </button>
    </div>
  );
}
