"use client";

import { useEffect, useRef, useState } from "react";
import { MAPA } from "@/lib/reserva/mapaDatos";
import { ETAPAS } from "@/lib/reserva/etapas";

export type Caja = readonly [number, number, number, number];

export const CAJA_PAIS: Caja = [0, 0, MAPA.ancho, MAPA.alto];
export const CAJA_SANTA_CRUZ: Caja = MAPA.santaCruz.caja as unknown as Caja;
// Patagonia entera (de Neuquén a Tierra del Fuego, con Malvinas).
export const CAJA_PATAGONIA: Caja = [20, 500, 420, 545];

// Caja del territorio con aire alrededor (para que entren los nombres de las
// localidades y se vea qué lo rodea).
export function cajaDeTerritorio(id: string): Caja {
  const t = MAPA.departamentos.find((x) => x.id === id) ?? MAPA.provincias.find((x) => x.id === id);
  if (!t) return CAJA_PAIS;
  const [x, y, w, h] = t.caja;
  const m = Math.max(w, h) * 0.22;
  return [x - m, y - m, w + 2 * m, h + 2 * m];
}

export type EstadoTerritorio = "superada" | "abierta" | "cerrada";

// Animación del viewBox (zoom suave de una caja a otra).
function useCajaAnimada(destino: Caja): Caja {
  const [actual, setActual] = useState<Caja>(destino);
  const desde = useRef<Caja>(destino);
  const ultima = useRef<Caja>(destino);
  useEffect(() => {
    const reducir = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    desde.current = ultima.current;
    const t0 = performance.now();
    const dur = reducir ? 1 : 1100;
    let raf = 0;
    const paso = (t: number) => {
      const k = Math.min(1, (t - t0) / dur);
      const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      const c = desde.current.map((v, i) => v + (destino[i] - v) * e) as unknown as Caja;
      ultima.current = c;
      setActual(c);
      if (k < 1) raf = requestAnimationFrame(paso);
    };
    raf = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destino.join(",")]);
  return actual;
}

const COLOR: Record<EstadoTerritorio, string> = {
  superada: "#6fcf97",
  abierta: "#ffd166",
  cerrada: "#f6b98a",
};

// Mapa de la Argentina con la Patagonia sombreada, Santa Cruz remarcada y sus
// departamentos numerados (orden de la expedición). Sirve también para las
// actividades de «tocá en el mapa» (`alTocar`).
export default function MapaReserva({
  caja,
  estados,
  resaltar,
  localidades = [],
  alTocar,
  numeros = true,
  elegido,
  correcto,
  className = "",
}: {
  caja: Caja;
  estados?: Record<string, EstadoTerritorio>;
  resaltar?: string; // territorio en foco
  localidades?: string[];
  alTocar?: (territorio: string) => void;
  numeros?: boolean;
  elegido?: string | null;
  correcto?: string | null;
  className?: string;
}) {
  const vb = useCajaAnimada(caja);
  const escala = vb[2] / MAPA.ancho; // 1 = país entero
  const trazo = Math.max(0.25, escala * 1.6);
  const tocable = !!alTocar;

  function relleno(id: string, base: string): string {
    if (correcto && id === correcto) return "#34d399";
    if (elegido && id === elegido) return correcto ? "#f87171" : "#fbbf24";
    if (resaltar === id) return "#ffd166";
    return estados?.[id] ? COLOR[estados[id]] : base;
  }

  return (
    <svg
      viewBox={vb.join(" ")}
      className={`block w-full h-full ${className}`}
      role="img"
      aria-label="Mapa de la Argentina con la Patagonia y los departamentos de Santa Cruz"
      preserveAspectRatio="xMidYMid meet"
    >
      <rect x={-200} y={-200} width={MAPA.ancho + 400} height={MAPA.alto + 400} fill="#bfe3f5" />
      {MAPA.vecinos.map((v) => (
        <path key={v.id} d={v.d} fill="#ece6d4" stroke="#c9c1a8" strokeWidth={trazo * 0.6} />
      ))}
      {MAPA.provincias.map((p) => {
        const esEtapa = ETAPAS.some((e) => e.territorio === p.id);
        const puede = tocable && p.patagonia && p.id !== "santa-cruz";
        return (
          <path
            key={p.id}
            d={p.d}
            fill={p.patagonia ? relleno(esEtapa ? p.id : "", "#f3c86b") : "#fbf3dc"}
            stroke="#a0804f"
            strokeWidth={trazo}
            onClick={puede ? () => alTocar?.(p.id) : undefined}
            className={puede ? "cursor-pointer hover:brightness-110" : undefined}
          >
            <title>{p.nombre}</title>
          </path>
        );
      })}
      {MAPA.departamentos.map((d) => (
        <path
          key={d.id}
          d={d.d}
          fill={relleno(d.id, "#f6b98a")}
          stroke="#7a3d10"
          strokeWidth={trazo * 0.8}
          onClick={tocable ? () => alTocar?.(d.id) : undefined}
          className={`${tocable ? "cursor-pointer hover:brightness-110" : ""} ${resaltar === d.id ? "mm-territorio-foco" : ""}`}
        >
          <title>{d.nombre}</title>
        </path>
      ))}
      <path d={MAPA.santaCruz.d} fill="none" stroke="#8b1a1a" strokeWidth={trazo * 2.4} strokeLinejoin="round" pointerEvents="none" />

      {/* Recuadro de la Antártida Argentina y las islas del Atlántico Sur */}
      {escala > 0.6 && (
        <g pointerEvents="none">
          <svg x={410} y={850} width={110} height={110} viewBox={MAPA.antartida.caja.join(" ")}>
            <rect x={MAPA.antartida.caja[0]} y={MAPA.antartida.caja[1]} width={MAPA.antartida.caja[2]} height={MAPA.antartida.caja[3]} fill="#dff1fb" stroke="#64748b" strokeWidth={0.4} />
            <path d={MAPA.antartida.sector} fill="#f8fafc" stroke="#94a3b8" strokeWidth={0.25} />
            <path d={MAPA.antartida.d} fill="#ffffff" stroke="#64748b" strokeWidth={0.25} />
            <path d={MAPA.antartida.islas} fill="#f3c86b" stroke="#64748b" strokeWidth={0.25} />
          </svg>
          <text x={465} y={972} textAnchor="middle" fontSize={8.5} fontWeight={700} fill="#334155">Antártida Argentina</text>
        </g>
      )}
      {escala > 0.6 && (
        <text x={380} y={905} textAnchor="middle" fontSize={8} fontWeight={700} fill="#334155">Islas Malvinas</text>
      )}

      {/* Localidades */}
      {MAPA.localidades
        .filter((l) => localidades.includes(l.id))
        .map((l) => (
          <g key={l.id} pointerEvents="none">
            <circle cx={l.x} cy={l.y} r={escala * 5 + 0.6} fill="#dc2626" stroke="#fff" strokeWidth={escala * 1.6 + 0.2} />
            <text
              x={l.x}
              y={l.y + escala * 22 + 2.6}
              textAnchor="middle"
              fontSize={escala * 15 + 1.5}
              fontWeight={800}
              fill="#1e293b"
              stroke="#fff"
              strokeWidth={escala * 3 + 0.3}
              paintOrder="stroke"
            >
              {l.nombre}
            </text>
          </g>
        ))}

      {/* Números de la expedición */}
      {numeros &&
        ETAPAS.map((e) => {
          const t = MAPA.departamentos.find((d) => d.id === e.territorio) ?? MAPA.provincias.find((p) => p.id === e.territorio);
          if (!t) return null;
          const r = Math.max(2.2, escala * 15);
          const est = estados?.[e.territorio] ?? "cerrada";
          return (
            <g key={e.n} pointerEvents="none">
              <circle cx={t.centro[0]} cy={t.centro[1]} r={r} fill={est === "superada" ? "#059669" : est === "abierta" ? "#d97706" : "#7c2d12"} stroke="#fff" strokeWidth={r * 0.18} />
              <text x={t.centro[0]} y={t.centro[1] + r * 0.36} textAnchor="middle" fontSize={r * 1.05} fontWeight={900} fill="#fff">
                {est === "superada" ? "✓" : e.n}
              </text>
            </g>
          );
        })}
    </svg>
  );
}
