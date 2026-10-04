"use client";

import { createPortal } from "react-dom";
import Image from "next/image";
import { StudentProgress, getAccessoryById, getAccessorySrc } from "@/types";
import {
  CAMINO,
  MIN_ACIERTO_DIA,
  MIN_ACTIVIDADES_DIA,
  estadoRacha,
  mundosSuperados,
  nodoCumplido,
  type Nodo,
} from "@/lib/coleccion/racha";

// Camino de premios estilo Candy Crush: cada parada se desbloquea para
// siempre con días de racha (🔥) o con mundos superados con 90 % (🏆).
const X = [50, 24, 50, 76]; // zigzag (en % del ancho)
const PASO = 112; // separación vertical entre paradas (px)

export default function CaminoRacha({ progress, onClose }: { progress: StudentProgress; onClose: () => void }) {
  const est = estadoRacha(progress);
  const mundos = mundosSuperados(progress);
  const dados = new Set(progress.caminoReclamados ?? []);
  const siguiente = CAMINO.findIndex((n) => !nodoCumplido(n, est.mejor, mundos));
  const hoyN = est.hoy.c + est.hoy.i;
  const hoyPct = hoyN ? Math.round((est.hoy.c / hoyN) * 100) : 0;
  const faltanHoy = Math.max(0, MIN_ACTIVIDADES_DIA - hoyN);

  const alto = CAMINO.length * PASO + 60;
  const pts = CAMINO.map((_, i) => ({ x: X[i % X.length], y: 50 + i * PASO }));

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-3 py-4">
      <div className="w-full max-w-md max-h-[92vh] rounded-3xl bg-gradient-to-b from-indigo-950 to-slate-900 border border-indigo-400/40 flex flex-col overflow-hidden">
        <div className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-black text-lg">🔥 Camino de premios</h2>
            <button onClick={onClose} className="text-slate-300 text-xl" aria-label="Cerrar">
              ✕
            </button>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2 text-center">
            <Dato valor={`${est.racha}`} label={est.racha === 1 ? "día de racha" : "días de racha"} emoji="🔥" />
            <Dato valor={`${est.escudos}`} label="escudos" emoji="🛡️" />
            <Dato valor={`${mundos}`} label="mundos al 90 %" emoji="🏆" />
          </div>
          <p
            className={`mt-2 rounded-xl px-3 py-2 text-xs font-bold ${
              est.hoyCuenta ? "bg-emerald-500/20 text-emerald-200" : "bg-amber-500/15 text-amber-100"
            }`}
          >
            {est.hoyCuenta
              ? `✅ ¡Hoy ya cuenta para tu racha! (${hoyN} actividades, ${hoyPct} % bien)`
              : faltanHoy > 0
                ? `Hoy: ${hoyN} de ${MIN_ACTIVIDADES_DIA} actividades. Hacé ${faltanHoy} más (con ${Math.round(MIN_ACIERTO_DIA * 100)} % bien) para sumar el día.`
                : `Hoy: ${hoyN} actividades con ${hoyPct} % bien. Necesitás ${Math.round(MIN_ACIERTO_DIA * 100)} % para que cuente: ¡seguí practicando!`}
          </p>
          <p className="mt-1 text-[10px] text-slate-400">
            Sábados, domingos y vacaciones no cortan la racha. Cada 5 días ganás un escudo 🛡️ que la cuida si faltás un día.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-6">
          <div className="relative w-full" style={{ height: alto }}>
            <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 100 ${alto}`} preserveAspectRatio="none" aria-hidden>
              <polyline
                points={pts.map((p) => `${p.x},${p.y}`).join(" ")}
                fill="none"
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="1.6"
                strokeDasharray="2 2.5"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            {CAMINO.map((n, i) => (
              <Parada
                key={n.id}
                n={n}
                x={pts[i].x}
                y={pts[i].y}
                hecho={dados.has(n.id) || nodoCumplido(n, est.mejor, mundos)}
                actual={i === siguiente}
                mejor={est.mejor}
                mundos={mundos}
              />
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

function Dato({ valor, label, emoji }: { valor: string; label: string; emoji: string }) {
  return (
    <div className="rounded-xl bg-white/10 py-1.5">
      <p className="text-white font-black text-lg leading-none">
        {emoji} {valor}
      </p>
      <p className="text-[10px] text-slate-300">{label}</p>
    </div>
  );
}

function Parada({ n, x, y, hecho, actual, mejor, mundos }: { n: Nodo; x: number; y: number; hecho: boolean; actual: boolean; mejor: number; mundos: number }) {
  const def = n.premio.tipo === "objeto" ? getAccessoryById(n.premio.id) : undefined;
  const req = [n.racha ? `🔥 ${n.racha} días` : null, n.mundos ? `🏆 ${n.mundos} mundos` : null].filter(Boolean).join(" + ");
  const falta =
    !hecho && actual
      ? [
          n.racha && mejor < n.racha ? (n.racha - mejor === 1 ? "1 día" : `${n.racha - mejor} días`) : null,
          n.mundos && mundos < n.mundos ? (n.mundos - mundos === 1 ? "1 mundo" : `${n.mundos - mundos} mundos`) : null,
        ]
          .filter(Boolean)
          .join(" y ")
      : "";
  return (
    <div className="absolute flex flex-col items-center" style={{ left: `${x}%`, top: y, transform: "translate(-50%, -50%)", width: 120 }}>
      <div
        className={`relative w-16 h-16 rounded-full border-4 flex items-center justify-center shadow-lg ${
          hecho
            ? "bg-emerald-400 border-emerald-200"
            : actual
              ? "bg-amber-300 border-white animate-pulse"
              : "bg-slate-600 border-slate-400"
        }`}
      >
        {n.premio.tipo === "monedas" ? (
          <span className="text-xs font-black text-slate-900">🪙{n.premio.cantidad}</span>
        ) : def ? (
          <Image src={getAccessorySrc(def.id)} alt={def.label} fill sizes="64px" className={`object-contain p-2 ${hecho || actual ? "" : "grayscale opacity-60"}`} />
        ) : (
          <span className="text-2xl">{n.premio.slot === "eyewear" ? "🕶️" : "🎀"}</span>
        )}
        {hecho && <span className="absolute -top-1 -right-1 rounded-full bg-white text-emerald-600 text-xs font-black w-5 h-5 flex items-center justify-center">✓</span>}
        {!hecho && !actual && <span className="absolute -bottom-1 -right-1 text-sm">🔒</span>}
      </div>
      <p className="mt-1 text-[10px] font-black text-white text-center leading-tight">{req}</p>
      <p className="text-[10px] text-slate-300 text-center leading-tight">
        {n.premio.tipo === "monedas" ? `${n.premio.cantidad} monedas` : n.premio.label}
      </p>
      {falta && <p className="text-[10px] font-bold text-amber-300">Te faltan {falta}</p>}
    </div>
  );
}
