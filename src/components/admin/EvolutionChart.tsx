"use client";

import { EvolutionWeekPoint } from "@/lib/activityMetrics";

interface EvolutionChartProps {
  title: string;
  subtitle?: string;
  points?: EvolutionWeekPoint[];
  data?: EvolutionWeekPoint[];
}

export default function EvolutionChart({ title, subtitle, points, data }: EvolutionChartProps) {
  const chartPoints = points ?? data ?? [];
  if (!chartPoints || chartPoints.length === 0) return null;

  const maxMinutes = Math.max(...chartPoints.map((p) => p.totalMinutes), 15);

  return (
    <div className="bg-white/80 border-2 border-amber-800/15 rounded-2xl p-4 shadow-sm">
      <div className="mb-3">
        <h4 className="text-sm font-black text-amber-950 flex items-center gap-1.5">
          <span>📈</span> {title}
        </h4>
        {subtitle && <p className="text-xs text-amber-900/70">{subtitle}</p>}
      </div>

      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${chartPoints.length}, minmax(0, 1fr))` }}
      >
        {chartPoints.map((pt, idx) => {
          const heightPct = Math.max(8, Math.min(100, pt.accuracyPct));
          const timeHeightPct = Math.max(6, Math.min(100, (pt.totalMinutes / maxMinutes) * 100));

          return (
            <div key={idx} className="flex flex-col items-center">
              {/* Contenedor de visualización */}
              <div
                className="w-full h-24 bg-amber-50/60 rounded-xl border border-amber-800/10 p-1 flex items-end justify-center gap-1 relative group cursor-help"
                title={`${pt.weekLabel}\nPrecisión: ${pt.accuracyPct}%\nTiempo: ${pt.totalMinutes} min\nActividades: ${pt.activitiesCount}`}
              >
                {/* Barra de precisión (%) */}
                <div
                  className="w-1/2 bg-indigo-500 rounded-t transition-all group-hover:bg-indigo-600"
                  style={{
                    height: `${heightPct}%`,
                    opacity: pt.activitiesCount > 0 ? 1 : 0.25,
                  }}
                />
                {/* Barra de tiempo (min) */}
                <div
                  className="w-1/2 bg-amber-500 rounded-t transition-all group-hover:bg-amber-600"
                  style={{
                    height: `${timeHeightPct}%`,
                    opacity: pt.activitiesCount > 0 ? 1 : 0.25,
                  }}
                />
              </div>

              {/* Etiquetas */}
              <div className="text-center mt-1.5 leading-tight">
                <p className="text-[11px] font-black text-slate-800">
                  {pt.activitiesCount > 0 ? `${pt.accuracyPct}%` : "—"}
                </p>
                <p className="text-[9px] font-semibold text-amber-800/70">
                  {pt.activitiesCount > 0 ? `${pt.totalMinutes}m` : "0m"}
                </p>
                <p className="text-[8px] text-slate-400 truncate max-w-[55px] mt-0.5">
                  {pt.weekLabel}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-4 mt-3 pt-2 border-t border-amber-800/10 text-[11px]">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500 inline-block" />
          <span className="text-slate-600 font-medium">Precisión de aciertos (%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 inline-block" />
          <span className="text-slate-600 font-medium">Tiempo jugado (minutos)</span>
        </div>
      </div>
    </div>
  );
}
