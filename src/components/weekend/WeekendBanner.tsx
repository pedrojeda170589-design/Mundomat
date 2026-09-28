"use client";

import { WeekendPlan } from "@/lib/weekend/plan";
import { WeekendRecord } from "@/types";

export interface WeekendSummary {
  available: boolean;
  streak: number;
  plan?: WeekendPlan;
  record?: WeekendRecord;
  chestCoins?: number;
}

// Cartel de entrada a la Aventura de fin de semana (solo sábado y domingo).
export default function WeekendBanner({
  summary,
  onPlay,
}: {
  summary: WeekendSummary;
  onPlay: () => void;
}) {
  const total = summary.plan?.activities.length ?? 10;
  const done = summary.record?.completed ?? 0;
  const finished = summary.record?.finished ?? false;
  return (
    <button onClick={onPlay} className="relative z-10 w-full max-w-3xl mx-auto mb-6 px-4 text-left">
      <div className="rounded-2xl border-4 border-yellow-300 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-orange-400 px-4 py-3 flex items-center gap-3 shadow-lg hover:brightness-110 transition">
        <span className="text-3xl wk-float">🃏</span>
        <span className="flex-1 min-w-0">
          <span className="block text-white font-black text-base drop-shadow">
            {summary.plan?.title ?? "Aventura de fin de semana"} · Juegos de memoria
          </span>
          <span className="block text-white/90 text-xs">
            {finished
              ? "¡Completaste los 10 juegos de hoy! Tocá para ver tu premio."
              : `Memoria Numérica y memoramas · cofre con 🪙 ${summary.chestCoins ?? ""} y un accesorio`}
          </span>
          <span className="mt-1.5 block h-2 rounded-full bg-white/30 overflow-hidden">
            <span
              className="block h-full bg-yellow-300 rounded-full transition-all"
              style={{ width: `${(done / total) * 100}%` }}
            />
          </span>
        </span>
        <span className="shrink-0 rounded-xl bg-white/90 px-3 py-1.5 font-black text-violet-700">
          {finished ? "🎁" : done === 0 ? "Jugar →" : `${done}/${total} →`}
        </span>
      </div>
    </button>
  );
}
