"use client";

import Image from "next/image";
import { getAccessoryById, getAccessorySrc } from "@/types";
import InsigniaTorneo from "@/components/InsigniaTorneo";
import {
  METALES,
  NOMBRE_METAL,
  PORCENTAJE_ORO,
  PORCENTAJE_PLATA,
  TABLAS_DE_LA_VUELTA,
  type Metal,
  type ObjetoTorneo,
  type PremioTorneo,
  type ResultadoVuelta,
} from "@/lib/torneo/vueltas";

const MESES = ["", "enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const MEDALLA: Record<Metal, string> = { oro: "🥇", plata: "🥈", bronce: "🥉" };

export interface EstadoVuelta {
  vueltas: number;
  insignia: string | null;
  proximaInsignia: string | null;
  tablasHechas: number[];
  objetoMes: ObjetoTorneo | null;
  superEspecial: boolean;
  metalQueTiene: Metal | null;
  hastaVueltas: number;
  prestados: { id: string; hastaVueltas: number; vence: string }[];
}

function Dibujo({ id, emoji, size = 40 }: { id: string; emoji: string; size?: number }) {
  return (
    <span className="relative shrink-0 flex items-center justify-center text-2xl" style={{ width: size, height: size }}>
      {getAccessoryById(id) ? <Image src={getAccessorySrc(id)} alt="" fill sizes={`${size}px`} className="object-contain" /> : emoji}
    </span>
  );
}

// Pantalla de elegir tabla: vuelta en curso, insignia y objeto del mes.
export function InfoVuelta({ estado }: { estado: EstadoVuelta | null }) {
  if (!estado) return null;
  const hechas = new Set(estado.tablasHechas);
  const o = estado.objetoMes;
  return (
    <div className="rounded-2xl bg-amber-50 border border-amber-300 p-3 text-left text-xs text-amber-950 flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <p className="font-black text-sm">🔁 Tu vuelta: {hechas.size} de 9 tablas</p>
        {estado.insignia && <InsigniaTorneo vueltas={estado.vueltas} className="min-w-8 h-8 px-1 text-xs" />}
      </div>
      <div className="grid grid-cols-9 gap-1">
        {TABLAS_DE_LA_VUELTA.map((t) => (
          <span
            key={t}
            className={`rounded-md text-center font-black py-0.5 ${hechas.has(t) ? "bg-emerald-500 text-white" : "bg-white border border-amber-200 text-amber-900/60"}`}
          >
            {t}
          </span>
        ))}
      </div>
      <p className="leading-relaxed">
        Completá las <b>9 tablas</b> (del 2 al 10, podés hacerlo en varios días) para cerrar la vuelta. Cada vuelta sube tu insignia:{" "}
        <b>{estado.proximaInsignia}</b> con la próxima. A las 10 vueltas pasás a <b>A1</b> y los premios se vuelven superespeciales.
      </p>
      {o && (
        <div className="rounded-xl bg-white/80 border border-amber-200 p-2 flex flex-col gap-1.5">
          <p className="font-black">
            {estado.superEspecial ? "✨ Objeto superespecial" : "🎁 Objeto especial"} de {MESES[o.mes]}: {o.label}
          </p>
          <div className="flex items-center gap-2">
            {METALES.map((m) => (
              <span key={m} className="flex items-center gap-1">
                <Dibujo id={`${o.base}-${m}`} emoji={MEDALLA[m]} size={34} />
                <span className="text-[10px] leading-tight">{NOMBRE_METAL[m]}</span>
              </span>
            ))}
          </div>
          <p className="text-[11px] leading-snug">
            Al cerrar la vuelta se calcula con tus errores y tu tiempo: <b>dorado</b> con más de {PORCENTAJE_ORO} % de aciertos y dentro del tiempo
            de plata; <b>plateado</b> con {PORCENTAJE_PLATA} % o más; <b>de bronce</b> con menos de {PORCENTAJE_PLATA} %.
          </p>
          <p className="text-[11px] leading-snug">
            Es <b>prestado</b> hasta que completes {estado.hastaVueltas} vueltas: ahí te lo quedás para siempre (si el 31/12 no llegaste, se
            devuelve).
          </p>
          {estado.metalQueTiene && (
            <p className="text-[11px] font-bold">
              Ya tenés el {NOMBRE_METAL[estado.metalQueTiene]} de este mes.
              {estado.metalQueTiene !== "oro" ? " ¡Con otra vuelta mejor podés ganar uno de metal más alto!" : ""}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export interface VueltaCompleta extends ResultadoVuelta {
  vueltas: number;
  insignia: string;
  premio?: PremioTorneo;
  yaTeniaMejor?: boolean;
  hastaVueltas?: number;
  seQuedo: string[];
}

// Resultado al cerrar una vuelta.
export function ResultadoDeVuelta({ v }: { v: VueltaCompleta }) {
  return (
    <div className="rounded-2xl bg-gradient-to-r from-yellow-100 via-amber-100 to-yellow-100 border-2 border-amber-400 p-3 flex flex-col gap-2 text-left text-xs text-amber-950 shadow-sm">
      <div className="flex items-center gap-3">
        <InsigniaTorneo texto={v.insignia} className="min-w-12 h-12 px-1 text-base" />
        <div>
          <p className="font-black text-sm">🎉 ¡Completaste la vuelta de las 9 tablas!</p>
          <p>
            Tu insignia ahora es <b>{v.insignia}</b> ({v.vueltas} {v.vueltas === 1 ? "vuelta" : "vueltas"}). La podés quitar desde «Mi perfil».
          </p>
        </div>
      </div>
      <p>
        Aciertos: <b>{v.porcentaje.toLocaleString("es-AR")} %</b> ({v.errores} {v.errores === 1 ? "error" : "errores"}) · Tiempo:{" "}
        <b>{Math.round(v.ms / 1000)} s</b> {v.dentroDeTiempo ? "(dentro del tiempo de plata ✅)" : `(el de plata era ${Math.round(v.msPlata / 1000)} s)`}
      </p>
      {v.premio && (
        <div className="flex items-center gap-3 rounded-xl bg-white/80 border border-amber-300 p-2">
          <Dibujo id={v.premio.id} emoji={MEDALLA[v.premio.metal]} size={48} />
          <p>
            <b>
              {MEDALLA[v.premio.metal]} ¡Ganaste {v.premio.superEspecial ? "el objeto superespecial" : "el objeto"}: {v.premio.label}!
            </b>
            <br />
            Es prestado hasta que completes {v.hastaVueltas} vueltas; ahí es tuyo para siempre.
            {getAccessoryById(v.premio.id) ? " Ya te lo podés poner desde «Mi perfil»." : " Muy pronto vas a poder ponértelo en el avatar."}
          </p>
        </div>
      )}
      {v.yaTeniaMejor && <p>Ya tenías el objeto de este mes con un metal igual o mejor: ¡lo conservás!</p>}
      {v.seQuedo.length > 0 && (
        <p className="font-bold">
          🏁 ¡Llegaste a las vueltas que hacían falta! Ahora son tuyos para siempre:{" "}
          {v.seQuedo.map((id) => getAccessoryById(id)?.label ?? id).join(", ")}.
        </p>
      )}
    </div>
  );
}
