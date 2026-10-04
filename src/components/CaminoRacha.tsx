"use client";

import { createPortal } from "react-dom";
import Image from "next/image";
import AvatarDisplay from "@/components/AvatarDisplay";
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

// Camino de premios con la personalidad de MundoTest26 (estilo «mapa de
// niveles» de los juegos que conocen los chicos): de fondo, el mapa
// ilustrado de la Patagonia con su sendero de piedras; arriba, un cartel de
// madera y un pergamino con la racha; las paradas son «caramelos» brillantes
// y el avatar del alumno marca dónde está. Se recorre de abajo hacia arriba.
const X = [50, 26, 50, 74];
const PASO = 118;

// Mapa de fondo según el grado (el mismo de su recorrido).
function fondoDe(grade?: number): string {
  if (grade === 1) return "/theme/grados/1/mapa/etapa-2.jpg";
  if (grade === 2) return "/theme/grados/2/mapa/etapa-3.jpg";
  return "/theme/map/etapa-1.jpg";
}

export default function CaminoRacha({
  progress,
  grade,
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
  const hoyN = est.hoy.c + est.hoy.i;
  const hoyPct = hoyN ? Math.round((est.hoy.c / hoyN) * 100) : 0;
  const faltanHoy = Math.max(0, MIN_ACTIVIDADES_DIA - hoyN);

  // De abajo hacia arriba: la primera parada queda abajo de todo.
  const alto = CAMINO.length * PASO + 120;
  const pts = CAMINO.map((_, i) => ({ x: X[i % X.length], y: alto - 80 - i * PASO }));
  const actualY = pts[siguiente >= 0 ? siguiente : CAMINO.length - 1].y;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 px-2 py-3">
      <div className="relative w-full max-w-md h-[94vh] rounded-[2rem] overflow-hidden border-4 border-sky-300 shadow-2xl flex flex-col bg-sky-200">
        {/* Encabezado: cartel de madera */}
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
          {/* Pergamino con la racha y el avatar del alumno */}
          <div className="parchment-panel mt-2 rounded-2xl px-3 py-2 flex items-center gap-3 shadow-lg">
            <AvatarDisplay
              character={progress.avatar}
              accessories={progress.avatarAccessories}
              tweaks={progress.avatarTweaks}
              background={progress.avatarBackground}
              className="w-14 h-14 rounded-full border-2 border-amber-500 shrink-0"
              imageSizes="56px"
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
          </div>
        </div>

        {/* Camino sobre el mapa ilustrado */}
        <div
          className="relative flex-1 overflow-y-auto -mt-2"
          ref={(el) => {
            // Abre mostrando la parada en la que está.
            if (el && !el.dataset.listo) {
              el.dataset.listo = "1";
              el.scrollTop = Math.max(0, actualY - el.clientHeight / 2);
            }
          }}
        >
          <div
            className="relative w-full"
            style={{
              height: alto,
              backgroundImage: `url(${fondoDe(grade)})`,
              backgroundSize: "100% auto",
              backgroundRepeat: "repeat-y",
              backgroundPosition: "center bottom",
            }}
          >
            <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 100 ${alto}`} preserveAspectRatio="none" aria-hidden>
              <polyline
                points={pts.map((p) => `${p.x},${p.y}`).join(" ")}
                fill="none"
                stroke="rgba(255,255,255,0.85)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray="1 14"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            {CAMINO.map((n, i) => (
              <Parada
                key={n.id}
                n={n}
                numero={i + 1}
                x={pts[i].x}
                y={pts[i].y}
                hecho={dados.has(n.id) || nodoCumplido(n, est.mejor, mundos)}
                actual={i === siguiente}
                mejor={est.mejor}
                mundos={mundos}
                progress={progress}
              />
            ))}
          </div>
        </div>

        {/* Botón grande para ir a jugar */}
        <div className="relative z-10 p-3 bg-gradient-to-t from-sky-900/40 to-transparent">
          <p className="text-center text-[10px] font-bold text-white drop-shadow mb-1">
            Sábados, domingos y vacaciones no cortan la racha · cada 5 días ganás un escudo 🛡️
          </p>
          <button
            onClick={onClose}
            className="w-full rounded-full py-3 text-xl font-black text-white border-4 border-white shadow-xl bg-gradient-to-b from-amber-400 via-orange-500 to-orange-600 active:scale-95"
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
  mejor,
  mundos,
  progress,
}: {
  n: Nodo;
  numero: number;
  x: number;
  y: number;
  hecho: boolean;
  actual: boolean;
  mejor: number;
  mundos: number;
  progress: StudentProgress;
}) {
  const def = n.premio.tipo === "objeto" ? getAccessoryById(n.premio.id) : undefined;
  const esFinal = n.id === "final";
  const req = [n.racha ? `🔥${n.racha}` : null, n.mundos ? `🏆${n.mundos}` : null].filter(Boolean).join(" + ");
  const falta =
    !hecho && actual
      ? [
          n.racha && mejor < n.racha ? (n.racha - mejor === 1 ? "1 día" : `${n.racha - mejor} días`) : null,
          n.mundos && mundos < n.mundos ? (n.mundos - mundos === 1 ? "1 mundo" : `${n.mundos - mundos} mundos`) : null,
        ]
          .filter(Boolean)
          .join(" y ")
      : "";
  const caramelo = hecho
    ? "from-emerald-300 via-emerald-500 to-emerald-700 border-white"
    : actual
      ? "from-yellow-200 via-amber-400 to-orange-500 border-white"
      : "from-slate-200 via-slate-400 to-slate-600 border-slate-100";
  const tam = esFinal ? "w-24 h-24" : "w-[4.5rem] h-[4.5rem]";
  return (
    <div className="absolute flex flex-col items-center" style={{ left: `${x}%`, top: y, transform: "translate(-50%, -50%)", width: 130 }}>
      {actual && (
        <div className="absolute -top-14 flex flex-col items-center animate-bounce">
          <AvatarDisplay
            character={progress.avatar}
            accessories={progress.avatarAccessories}
            tweaks={progress.avatarTweaks}
            background={progress.avatarBackground}
            className="w-11 h-11 rounded-full border-[3px] border-white shadow-lg"
            imageSizes="44px"
          />
          <span className="w-0 h-0 border-l-[7px] border-r-[7px] border-t-[9px] border-l-transparent border-r-transparent border-t-white" />
        </div>
      )}
      <div
        className={`relative ${tam} rounded-full border-4 bg-gradient-to-br ${caramelo} shadow-[0_6px_0_rgba(0,0,0,0.25),0_10px_18px_rgba(0,0,0,0.35)] flex items-center justify-center`}
      >
        {/* brillo de caramelo */}
        <span className="absolute top-1.5 left-3 w-6 h-3 rounded-full bg-white/60 rotate-[-20deg]" />
        {n.premio.tipo === "monedas" ? (
          <span className="text-sm font-black text-amber-950 drop-shadow">🪙{n.premio.cantidad}</span>
        ) : def ? (
          <Image src={getAccessorySrc(def.id)} alt={def.label} fill sizes="96px" className={`object-contain p-2.5 ${hecho || actual ? "" : "grayscale opacity-70"}`} />
        ) : (
          <span className="text-3xl drop-shadow">{esFinal ? "🧉" : n.premio.slot === "eyewear" ? "🕶️" : "🎀"}</span>
        )}
        {hecho && <span className="absolute -top-1 -right-1 rounded-full bg-white text-emerald-600 text-sm font-black w-6 h-6 flex items-center justify-center shadow">✓</span>}
        {!hecho && !actual && <span className="absolute -bottom-1 -right-1 text-base drop-shadow">🔒</span>}
        <span className="absolute -bottom-2 -left-2 rounded-full bg-sky-700 border-2 border-white text-white text-[10px] font-black w-6 h-6 flex items-center justify-center">{numero}</span>
      </div>
      <div className="mt-1.5 rounded-full bg-white/90 px-2 py-0.5 shadow text-center">
        <p className="text-[10px] font-black text-sky-900 leading-tight">{req}</p>
      </div>
      <p className="text-[10px] font-black text-white text-center leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
        {n.premio.tipo === "monedas" ? `${n.premio.cantidad} monedas` : n.premio.label}
      </p>
      {falta && <p className="mt-0.5 rounded-full bg-amber-400 px-2 text-[10px] font-black text-amber-950 shadow">Faltan {falta}</p>}
    </div>
  );
}
