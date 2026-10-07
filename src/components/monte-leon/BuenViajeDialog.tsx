"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Profe from "@/components/Profe";
import Burst from "@/components/weekend/Burst";
import { TEXTO_BUEN_VIAJE } from "@/lib/monteLeon/fechas";
import { MEDALLA_MONTE_LEON } from "@/lib/monteLeon/arte";
import { haParticipadoMonteLeon, alumnoTieneORegalo } from "@/lib/monteLeon/progreso";
import type { StudentProgress } from "@/types";

interface Props {
  studentCode: string;
  progress: StudentProgress;
  onProgressUpdated?: (progress: StudentProgress) => void;
}

export default function BuenViajeDialog({
  studentCode,
  progress,
  onProgressUpdated,
}: Props) {
  const [open, setOpen] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return !sessionStorage.getItem("buen_viaje_ml_visto");
    } catch {
      return true;
    }
  });
  // Se pide la medalla UNA sola vez por apertura (antes el efecto se repetía
  // cada vez que el padre pasaba una función nueva).
  const pedida = useRef(false);
  const avisar = useRef(onProgressUpdated);
  useEffect(() => {
    avisar.current = onProgressUpdated;
  }, [onProgressUpdated]);
  const [medallaEntregadaAhora, setMedallaEntregadaAhora] = useState(false);

  const participo = haParticipadoMonteLeon(progress);
  const tieneMedalla = alumnoTieneORegalo(progress, MEDALLA_MONTE_LEON.id);

  useEffect(() => {
    if (!open || pedida.current) return;

    // Si participó y aún no tenía la medalla, reclamarla en el backend
    if (participo && !tieneMedalla) {
      pedida.current = true;
      void fetch("/api/monte-leon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: studentCode,
          action: "reclamar-medalla",
        }),
      })
        .then((r) => r.json())
        .then((d) => {
          if (d.ok && d.entregada) {
            setMedallaEntregadaAhora(true);
            if (d.progress) {
              avisar.current?.(d.progress);
            }
          }
        })
        .catch(() => {});
    }
  }, [open, studentCode, participo, tieneMedalla]);

  function handleClose() {
    try {
      sessionStorage.setItem("buen_viaje_ml_visto", "1");
    } catch {
      /* sin almacenamiento: se cierra igual */
    }
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="¡Buen viaje a Monte León!"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 animate-fadeIn backdrop-blur-xs"
    >
      <div className="relative w-full max-w-md parchment-panel rounded-3xl border-4 border-amber-500 shadow-2xl p-6 sm:p-8 text-center my-auto flex flex-col items-center">
        {(tieneMedalla || medallaEntregadaAhora) && <Burst big count={20} />}

        {/* Profe y saludo */}
        <div className="flex items-end justify-center gap-3 mb-2">
          <Profe pose="guardaparque" className="w-20 h-28" />
          <span className="text-4xl mb-3">🐧</span>
        </div>

        <span className="text-xs font-black uppercase tracking-wider text-amber-900/70">
          Mensaje de la escuela
        </span>
        <h3 className="text-xl sm:text-2xl font-black text-amber-950 mt-0.5 mb-3">
          ¡Buen viaje a Monte León!
        </h3>

        <div className="rounded-2xl bg-amber-100/90 border-2 border-amber-600/30 p-4 text-amber-950 text-sm leading-relaxed font-medium mb-4 shadow-inner">
          «{TEXTO_BUEN_VIAJE}»
        </div>

        {/* Notificación de medalla si participó */}
        {(tieneMedalla || medallaEntregadaAhora) ? (
          <div className="w-full rounded-2xl bg-gradient-to-r from-yellow-100 via-amber-50 to-yellow-100 border-2 border-amber-500 p-3.5 mb-4 flex items-center gap-3 text-left shadow-sm">
            <div className="relative w-14 h-14 shrink-0 rounded-xl bg-white/80 p-1 border border-amber-600/30">
              <Image
                src={`/theme/accessories-temporada/${MEDALLA_MONTE_LEON.id}.png`}
                alt={MEDALLA_MONTE_LEON.label}
                fill
                sizes="56px"
                className="object-contain"
              />
            </div>
            <div className="flex-1 min-w-0">
              <span className="block text-[11px] font-black uppercase tracking-wider text-amber-800">
                🏅 ¡Medalla conmemorativa!
              </span>
              <span className="block text-xs font-black text-amber-950 truncate">
                {MEDALLA_MONTE_LEON.label}
              </span>
              <span className="block text-[11px] text-amber-900/80 leading-tight mt-0.5">
                Por participar en las actividades del viaje. ¡Queda en tu perfil para siempre!
              </span>
            </div>
          </div>
        ) : null}

        <button
          type="button"
          onClick={handleClose}
          className="rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-sm px-8 py-3 shadow-md hover:brightness-110 active:scale-95 transition"
        >
          ¡Muchas gracias, Profe! 🐧
        </button>
      </div>
    </div>
  );
}
