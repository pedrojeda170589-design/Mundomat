"use client";

import { MedallaTorneo } from "@/lib/torneo/tiempos";
import { prioridadesTablas } from "@/lib/torneo/prioridades";
import type { StudentProgress } from "@/types";

interface TablaRecord {
  mejorMs: number;
  medalla: MedallaTorneo;
  errores?: number;
  monedasDia?: string[];
}

interface Props {
  tablasTorneo?: Record<string, Record<number, TablaRecord>>;
  // Con el avance completo, muestra también las tablas que más le cuestan.
  progress?: StudentProgress;
}

export default function TorneoReport({ tablasTorneo, progress }: Props) {
  const cuestan = progress
    ? prioridadesTablas(progress, "", 9).filter((p) => p.motivo === "errores" || p.motivo === "tiempo")
    : [];
  if (!tablasTorneo || Object.keys(tablasTorneo).length === 0) {
    return (
      <div className="rounded-xl bg-amber-50/60 border border-amber-200 p-3 text-xs text-amber-900/70 italic">
        Aún no ha participado en el Torneo de tablas de fin de semana.
      </div>
    );
  }

  // Ordenar los fines de semana del más reciente al más antiguo
  const weekendKeys = Object.keys(tablasTorneo).sort().reverse();

  return (
    <div className="flex flex-col gap-3">
      {cuestan.length > 0 && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-950">
          <p className="font-black mb-1">🎯 Tablas que más le cuestan (se le proponen primero cada día)</p>
          <ul className="list-disc pl-5 space-y-0.5">
            {cuestan.slice(0, 4).map((p) => (
              <li key={p.tabla}>
                <b>Tabla del {p.tabla}</b>: {p.erroresPorPartida !== undefined && `${Math.round(p.erroresPorPartida * 10) / 10} errores por partida`}
                {p.segundos !== undefined && ` · ${Math.round(p.segundos)} s (meta de oro: ${p.metaOro} s)`}
              </li>
            ))}
          </ul>
        </div>
      )}
      {weekendKeys.map((satKey) => {
        const tablas = tablasTorneo[satKey] ?? {};
        const nums = Object.keys(tablas)
          .map((n) => parseInt(n, 10))
          .sort((a, b) => a - b);

        if (nums.length === 0) return null;

        return (
          <div
            key={satKey}
            className="rounded-xl bg-white border border-amber-200/90 p-3 text-xs shadow-xs"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-black text-amber-950 flex items-center gap-1">
                <span>⚡</span> Torneo del fin de semana ({satKey})
              </span>
              <span className="text-[11px] text-amber-900/70 font-medium">
                {nums.length} {nums.length === 1 ? "tabla jugada" : "tablas jugadas"}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {nums.map((tabla) => {
                const rec = tablas[tabla];
                const segs = (rec.mejorMs / 1000).toFixed(1);
                const errores = rec.errores ?? 0;
                const esLentaODificil = errores >= 3 || rec.medalla === "bronce";

                return (
                  <div
                    key={tabla}
                    className={`rounded-lg p-2.5 border flex flex-col gap-1 transition ${
                      esLentaODificil
                        ? "bg-rose-50/70 border-rose-300"
                        : rec.medalla === "oro"
                          ? "bg-amber-50/80 border-amber-300"
                          : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-slate-900">Tabla del {tabla}</span>
                      <span className="text-sm">
                        {rec.medalla === "oro" ? "🥇" : rec.medalla === "plata" ? "🥈" : "🥉"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-600 font-mono">
                      <span>⏱️ {segs} s</span>
                      <span
                        className={
                          errores > 0 ? "text-rose-600 font-bold" : "text-emerald-700"
                        }
                      >
                        {errores === 0 ? "0 err" : `${errores} err`}
                      </span>
                    </div>

                    {esLentaODificil && (
                      <span className="text-[10px] text-rose-700 font-semibold mt-0.5">
                        ⚠️ Conviene reforzar esta tabla
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
