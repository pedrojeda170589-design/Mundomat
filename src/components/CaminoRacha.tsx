"use client";

import Profe from "@/components/Profe";
import { useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import AvatarDisplay from "@/components/AvatarDisplay";
import { capasDe } from "@/lib/avatarCapas";
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

// Camino de premios sobre el MAPA ESPECIAL (lámina propia, 1024×1536): un
// sendero de piedras que sube de la pradera con lupinos hasta el Fitz Roy,
// con banderines, globos y fuegos artificiales, y arriba el trofeo con el
// profe Pedro alentando. Cada parada está sobre una piedra del dibujo
// (posiciones en % de la lámina). Se toca una parada para ver su premio.
const PIEDRAS: [number, number][] = [
  [39.5, 95.6], [55, 91.3], [53.8, 85.1], [45, 80.3], [34.7, 76.7], [23.8, 73.3], [15.5, 69.7],
  [38, 53.7], [38.7, 47.2], [48.8, 45.2], [59.5, 43], [69.5, 40.9], [78.2, 38.1], [71.7, 32.1],
  [64.2, 29.8], [56.8, 27.6], [62.8, 23], [70.5, 21], [83.3, 17.6], [76.2, 13], [81.7, 8.3],
];

export default function CaminoRacha({
  progress,
  onClose,
}: {
  progress: StudentProgress;
  grade?: number;
  onClose: () => void;
}) {
  const est = estadoRacha(progress);
  const mundos = mundosSuperados(progress);
  const dados = new Set(progress.caminoReclamados ?? []);
  const siguiente = CAMINO.findIndex((n) => !nodoCumplido(n, est.mejor, mundos));
  const [elegido, setElegido] = useState<number>(siguiente >= 0 ? siguiente : CAMINO.length - 1);
  const hoyN = est.hoy.c + est.hoy.i;
  const hoyPct = hoyN ? Math.round((est.hoy.c / hoyN) * 100) : 0;
  const faltanHoy = Math.max(0, MIN_ACTIVIDADES_DIA - hoyN);
  const hecho = (i: number) => dados.has(CAMINO[i].id) || nodoCumplido(CAMINO[i], est.mejor, mundos);

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 px-2 py-3">
      <div className="relative w-full max-w-md h-[94vh] rounded-[2rem] overflow-hidden border-4 border-sky-300 shadow-2xl flex flex-col bg-sky-200">
        {/* Encabezado: cartel de madera + pergamino con la racha */}
        <div className="relative z-10 px-3 pt-3">
          <div className="wood-panel rounded-2xl px-4 py-2 flex items-center justify-between">
            <h2 className="font-black text-lg tracking-wide drop-shadow">🔥 Camino de premios</h2>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-gradient-to-b from-rose-400 to-rose-600 border-2 border-white text-white font-black shadow"
              aria-label="Cerrar"
            >
              ✕
            </button>
          </div>
          <div className="parchment-panel mt-2 rounded-2xl px-3 py-2 flex items-center gap-3 shadow-lg">
            <AvatarDisplay
              character={progress.avatar}
              accessories={progress.avatarAccessories}
              tweaks={progress.avatarTweaks}
              capas={capasDe(progress)}
              background={progress.avatarBackground}
              className="w-12 h-12 rounded-full border-2 border-amber-500 shrink-0"
              imageSizes="48px"
            />
            <div className="flex-1 min-w-0">
              <div className="flex gap-1.5 text-[11px] font-black">
                <span className="rounded-full bg-gradient-to-b from-orange-400 to-orange-600 text-white px-2 py-0.5 shadow">🔥 {est.racha} {est.racha === 1 ? "día" : "días"}</span>
                <span className="rounded-full bg-gradient-to-b from-sky-400 to-sky-600 text-white px-2 py-0.5 shadow">🛡️ {est.escudos}</span>
                <span className="rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600 text-white px-2 py-0.5 shadow">🏆 {mundos}</span>
              </div>
              <p className="mt-1 text-[11px] leading-tight font-bold text-amber-950">
                {est.hoyCuenta
                  ? `¡Hoy ya suma a tu racha! (${hoyN} actividades, ${hoyPct} % bien)`
                  : faltanHoy > 0
                    ? `Hacé ${faltanHoy} ${faltanHoy === 1 ? "actividad" : "actividades"} más (con ${Math.round(MIN_ACIERTO_DIA * 100)} % bien) y hoy suma.`
                    : `Necesitás ${Math.round(MIN_ACIERTO_DIA * 100)} % bien para que hoy sume. ¡Seguí practicando!`}
              </p>
            </div>
            <Profe pose={est.hoyCuenta ? "aplaude" : "reloj"} className="w-10 h-14 -my-1" />
          </div>
        </div>

        {/* Mapa especial con las paradas sobre las piedras */}
        <div
          className="relative flex-1 overflow-y-auto -mt-1"
          ref={(el) => {
            // Abre mostrando la parada en la que está.
            if (el && !el.dataset.listo) {
              el.dataset.listo = "1";
              const p = PIEDRAS[siguiente >= 0 ? siguiente : PIEDRAS.length - 1];
              const alto = el.clientWidth * 1.5;
              el.scrollTop = Math.max(0, (p[1] / 100) * alto - el.clientHeight / 2);
            }
          }}
        >
          <div className="relative w-full" style={{ aspectRatio: "1024 / 1536" }}>
            <Image src="/theme/mapa-especial.jpg" alt="" fill sizes="448px" className="object-cover" priority />
            {/* El profe arriba, junto al trofeo, alentando */}
            <div className="absolute" style={{ left: "47%", top: "1%", width: "21%", height: "15%" }}>
              <Image src="/theme/profe/festejo.png" alt="El profe Pedro alentando" fill sizes="96px" className="object-contain object-bottom drop-shadow-[0_4px_4px_rgba(0,0,0,0.4)]" />
            </div>
            <div className="absolute rounded-2xl bg-white/95 border-2 border-amber-400 px-2 py-1 shadow-lg" style={{ left: "6%", top: "3%", maxWidth: "40%" }}>
              <p className="text-[10px] font-black text-amber-900 leading-tight">¡Vamos, campeones! 💪 ¡Los espero en la cima!</p>
            </div>
            {CAMINO.map((n, i) => (
              <Parada
                key={n.id}
                n={n}
                numero={i + 1}
                x={PIEDRAS[i][0]}
                y={PIEDRAS[i][1]}
                hecho={hecho(i)}
                actual={i === siguiente}
                elegido={i === elegido}
                onClick={() => setElegido(i)}
                progress={progress}
              />
            ))}
          </div>
        </div>

        {/* Premio de la parada elegida + botón para jugar */}
        <div className="relative z-10 p-3 bg-gradient-to-t from-sky-900/60 to-sky-900/20">
          <Detalle n={CAMINO[elegido]} numero={elegido + 1} hecho={hecho(elegido)} mejor={est.mejor} mundos={mundos} />
          <button
            onClick={onClose}
            className="mt-2 w-full rounded-full py-2.5 text-xl font-black text-white border-4 border-white shadow-xl bg-gradient-to-b from-amber-400 via-orange-500 to-orange-600 active:scale-95"
          >
            ¡A jugar! 🧭
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

function Parada({
  n,
  numero,
  x,
  y,
  hecho,
  actual,
  elegido,
  onClick,
  progress,
}: {
  n: Nodo;
  numero: number;
  x: number;
  y: number;
  hecho: boolean;
  actual: boolean;
  elegido: boolean;
  onClick: () => void;
  progress: StudentProgress;
}) {
  const esFinal = n.id === "final";
  const caramelo = hecho
    ? "from-emerald-300 via-emerald-500 to-emerald-700"
    : actual
      ? "from-yellow-200 via-amber-400 to-orange-500"
      : "from-slate-200 via-slate-400 to-slate-600";
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute"
      style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -60%)" }}
      aria-label={`Parada ${numero}`}
    >
      {actual && (
        <span className="absolute left-1/2 -translate-x-1/2 -top-12 flex flex-col items-center animate-bounce pointer-events-none">
          <AvatarDisplay
            character={progress.avatar}
            capas={capasDe(progress)}
            background={progress.avatarBackground}
            className="w-9 h-9 rounded-full border-[3px] border-white shadow-lg"
            imageSizes="36px"
          />
          <span className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-white" />
        </span>
      )}
      <span
        className={`relative flex items-center justify-center ${esFinal ? "w-12 h-12 text-lg" : "w-9 h-9 text-sm"} rounded-full border-[3px] ${
          elegido ? "border-yellow-300 ring-4 ring-yellow-300/60" : "border-white"
        } bg-gradient-to-br ${caramelo} font-black text-white shadow-[0_4px_0_rgba(0,0,0,0.3),0_6px_10px_rgba(0,0,0,0.35)]`}
      >
        <span className="absolute top-1 left-1.5 w-3.5 h-2 rounded-full bg-white/60 rotate-[-20deg]" />
        <span className="drop-shadow">{hecho ? "✓" : esFinal ? "👑" : numero}</span>
      </span>
    </button>
  );
}

// Tarjeta con el premio de la parada elegida.
function Detalle({ n, numero, hecho, mejor, mundos }: { n: Nodo; numero: number; hecho: boolean; mejor: number; mundos: number }) {
  const def = n.premio.tipo === "objeto" ? getAccessoryById(n.premio.id) : undefined;
  const req = [n.racha ? `🔥 ${n.racha} días de racha` : null, n.mundos ? `🏆 ${n.mundos} mundos al 90 %` : null].filter(Boolean).join(" + ");
  const falta = [
    n.racha && mejor < n.racha ? (n.racha - mejor === 1 ? "1 día" : `${n.racha - mejor} días`) : null,
    n.mundos && mundos < n.mundos ? (n.mundos - mundos === 1 ? "1 mundo" : `${n.mundos - mundos} mundos`) : null,
  ]
    .filter(Boolean)
    .join(" y ");
  return (
    <div className="parchment-panel rounded-2xl px-3 py-2 flex items-center gap-3 shadow-lg">
      <span className="relative w-14 h-14 shrink-0 rounded-full bg-gradient-to-br from-amber-100 to-amber-300 border-2 border-amber-500 flex items-center justify-center">
        {n.premio.tipo === "monedas" ? (
          <span className="text-sm font-black text-amber-900">🪙{n.premio.cantidad}</span>
        ) : def ? (
          <Image src={getAccessorySrc(def.id)} alt={def.label} fill sizes="56px" className="object-contain p-1.5" />
        ) : (
          <span className="text-2xl">{n.premio.slot === "eyewear" ? "🕶️" : "🎀"}</span>
        )}
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-black text-amber-950">
          Parada {numero}: {n.premio.tipo === "monedas" ? `${n.premio.cantidad} monedas` : n.premio.label}
        </p>
        <p className="text-[10px] font-bold text-amber-800">{req}</p>
        <p className={`text-[10px] font-black ${hecho ? "text-emerald-700" : "text-orange-700"}`}>
          {hecho ? "✅ ¡Ya lo ganaste!" : `Te faltan ${falta}.`}
        </p>
      </div>
    </div>
  );
}
