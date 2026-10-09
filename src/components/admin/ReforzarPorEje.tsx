"use client";

import { useState } from "react";
import { GrupoRefuerzoPorEje } from "@/lib/reforzar";
import { SKILL_INFO } from "@/lib/platform/shared";

export interface ReforzarPorEjeProps {
  grupos: GrupoRefuerzoPorEje[];
  printable?: boolean;
  emptyMessage?: string;
  className?: string;
  defaultExpanded?: boolean;
}

export default function ReforzarPorEje({
  grupos,
  printable = false,
  emptyMessage = "No hay contenidos para mostrar.",
  className = "",
  defaultExpanded = false,
}: ReforzarPorEjeProps) {
  // En modo interactivo, rastrear ítems desplegados por su clave única
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(() => new Set());

  if (!grupos || grupos.length === 0) {
    return (
      <p className={`text-xs text-slate-500 italic ${className}`}>
        {emptyMessage}
      </p>
    );
  }

  function toggleExpand(key: string) {
    if (printable) return;
    setExpandedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {grupos.map((grupo) => (
        <div key={`${grupo.materiaId}-${grupo.eje}`} className="text-xs">
          {/* Cabecera del eje */}
          <div className="flex items-center gap-1.5 font-black text-slate-800 mb-1">
            <span className="text-amber-800">{grupo.materia}</span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-700">{grupo.eje}</span>
            <span className="text-[10px] font-bold text-slate-400 ml-1">
              ({grupo.items.length})
            </span>
          </div>

          {/* Lista de contenidos del eje */}
          <ul className="space-y-1 pl-2 border-l-2 border-slate-200">
            {grupo.items.map((item, idx) => {
              const itemKey = `${grupo.materiaId}-${grupo.eje}-${item.worldId}-${idx}`;
              const isExpanded = printable || defaultExpanded || expandedKeys.has(itemKey);
              const info = SKILL_INFO[item.nivel] ?? { emoji: "⚪", label: "Práctica" };

              return (
                <li key={itemKey} className="group">
                  <div
                    onClick={() => toggleExpand(itemKey)}
                    className={`flex items-start gap-1.5 leading-snug ${
                      !printable ? "cursor-pointer hover:bg-slate-50 rounded px-1 -mx-1 py-0.5 transition" : ""
                    }`}
                    title={!printable ? "Tocá para ver el detalle curricular" : undefined}
                  >
                    <span className="shrink-0 text-sm leading-none mt-0.5" aria-hidden="true">
                      {info.emoji}
                    </span>
                    <div className="flex-1">
                      <span className="font-semibold text-slate-900">
                        {item.contenido}
                      </span>
                      {item.precision !== undefined && (
                        <span className="text-slate-500 font-medium ml-1">
                          ({item.precision}% de aciertos)
                        </span>
                      )}
                      <span className="text-slate-400 text-[11px] ml-1.5 font-normal">
                        — mundo: {item.mundo}
                      </span>
                    </div>
                  </div>

                  {/* Detalle curricular desplegado */}
                  {isExpanded && (item.contenidoDetallado || item.fuente || item.validado === false) && (
                    <div className="mt-1 mb-1.5 ml-5 p-2 rounded-lg bg-amber-50/70 border border-amber-200/80 text-[11px] text-slate-700 space-y-1">
                      {item.contenidoDetallado && (
                        <p className="leading-relaxed">
                          <strong className="text-amber-950 font-bold">Diseño Curricular:</strong>{" "}
                          {item.contenidoDetallado}
                        </p>
                      )}
                      <div className="flex items-center justify-between flex-wrap gap-2 text-[10px] text-amber-900/70 pt-0.5">
                        {item.fuente && (
                          <span className="font-medium italic">
                            📖 {item.fuente}
                          </span>
                        )}
                        {item.validado === false && (
                          <span className="bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.2 rounded font-semibold">
                            ⚠️ Vínculo curricular sin validar
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
