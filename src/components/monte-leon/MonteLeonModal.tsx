"use client";

import { useState } from "react";
import Image from "next/image";
import MochilaView from "./MochilaView";
import StageRunner from "./StageRunner";
import {
  ETAPAS_MONTE_LEON,
  buildMonteLeonActivities,
} from "@/lib/monteLeon/contenido";
import {
  ISLA_MONTE_LEON,
  MOCHILA_MONTE_LEON,
} from "@/lib/monteLeon/arte";
import { textoCuentaRegresiva } from "@/lib/monteLeon/fechas";
import type { ActivitySpec } from "@/lib/activities";
import type { StudentProgress } from "@/types";

interface Props {
  studentCode: string;
  progress: StudentProgress;
  onClose: () => void;
  onProgressUpdated?: (progress: StudentProgress) => void;
  onOpenProfile?: () => void;
}

export default function MonteLeonModal({
  studentCode,
  progress,
  onClose,
  onProgressUpdated,
  onOpenProfile,
}: Props) {
  const [tab, setTab] = useState<"etapas" | "mochila">("etapas");
  const [playingEtapa, setPlayingEtapa] = useState<number | null>(null);
  const [activities, setActivities] = useState<ActivitySpec[]>([]);
  const [localProgress, setLocalProgress] = useState<StudentProgress | null>(null);

  const currentProgress = localProgress ?? progress;

  const ownedSeasonal = new Set(currentProgress.seasonalCollection ?? []);
  const regalados = new Set(currentProgress.objetosRegalados ?? []);
  const yaObtenido = (id: string) => ownedSeasonal.has(id) || regalados.has(id);

  const mochilaItems = MOCHILA_MONTE_LEON.map((it) => ({
    ...it,
    ganado: yaObtenido(it.id),
    enColeccion: ownedSeasonal.has(it.id),
    regalado: regalados.has(it.id),
  }));

  const ganadosMochila = mochilaItems.filter((it) => it.ganado).length;
  const mascotaGanada = yaObtenido("pinguino-peluche-ml");
  const medallaGanada = yaObtenido("medalla-monte-leon");

  function handlePlayStage(etapaNum: number) {
    const acts = buildMonteLeonActivities(etapaNum);
    setActivities(acts);
    setPlayingEtapa(etapaNum);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 sm:p-5 overflow-y-auto animate-fadeIn backdrop-blur-xs">
      <div className="relative w-full max-w-2xl parchment-panel rounded-3xl border-2 border-amber-800/40 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Cabecera del modal */}
        <div className="relative p-4 sm:p-5 border-b-2 border-amber-800/20 bg-gradient-to-r from-amber-100 via-amber-50 to-amber-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-2xl overflow-hidden bg-sky-900/10 border-2 border-amber-700/30 p-1 shadow-sm">
              <Image
                src={ISLA_MONTE_LEON}
                alt="Isla Monte León"
                fill
                sizes="56px"
                className="object-contain"
              />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-900/70">
                Mundo especial de 3.º grado
              </span>
              <h2 className="text-lg sm:text-xl font-black text-amber-950 truncate flex items-center gap-1.5">
                <span>🐧</span> Viaje a Monte León
              </h2>
              <p className="text-xs font-bold text-sky-800 truncate">
                {textoCuentaRegresiva()}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 shrink-0 rounded-full bg-amber-950/10 hover:bg-amber-950/20 text-amber-950 flex items-center justify-center font-bold text-lg transition"
            aria-label="Cerrar ventana"
          >
            ✕
          </button>
        </div>

        {/* Pestañas de navegación (solo cuando no está jugando una etapa) */}
        {playingEtapa === null && (
          <div className="px-4 pt-3 flex gap-2 border-b border-amber-800/15 bg-amber-50/60 shrink-0">
            <button
              type="button"
              onClick={() => setTab("etapas")}
              className={`rounded-t-xl px-4 py-2 text-xs sm:text-sm font-black border-t-2 border-x-2 transition ${
                tab === "etapas"
                  ? "bg-amber-100/90 text-amber-950 border-amber-800/30 shadow-xs"
                  : "bg-transparent text-amber-900/60 border-transparent hover:text-amber-950"
              }`}
            >
              🗺️ Las 5 etapas
            </button>
            <button
              type="button"
              onClick={() => setTab("mochila")}
              className={`rounded-t-xl px-4 py-2 text-xs sm:text-sm font-black border-t-2 border-x-2 transition flex items-center gap-1.5 ${
                tab === "mochila"
                  ? "bg-amber-100/90 text-amber-950 border-amber-800/30 shadow-xs"
                  : "bg-transparent text-amber-900/60 border-transparent hover:text-amber-950"
              }`}
            >
              <span>🎒</span> Mi mochila
              <span className="ml-1 rounded-full bg-amber-500/20 px-1.5 py-0.2 text-[10px] text-amber-950">
                {ganadosMochila}/6
              </span>
            </button>
          </div>
        )}

        {/* Contenedor scrolleable */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {playingEtapa !== null ? (
            <StageRunner
              etapa={playingEtapa}
              studentCode={studentCode}
              activities={activities}
              onExit={() => setPlayingEtapa(null)}
              onFinished={(resultado) => {
                // Actualizar estado local
                const prevML = currentProgress.monteLeon ?? { etapas: {} };
                const prevEtapas = { ...(prevML.etapas ?? {}) };
                const prevRecord = prevEtapas[playingEtapa];
                const newBest = Math.max(prevRecord?.bestScore ?? 0, resultado.scorePct);

                prevEtapas[playingEtapa] = {
                  bestScore: newBest,
                  completedAt: new Date().toISOString(),
                };

                const nextSeasonal = new Set(currentProgress.seasonalCollection ?? []);
                if (resultado.objetoPremio) nextSeasonal.add(resultado.objetoPremio);
                if (resultado.mascotaPremio) nextSeasonal.add(resultado.mascotaPremio);
                if (resultado.medallaPremio) nextSeasonal.add(resultado.medallaPremio);

                const nextAch = new Set(currentProgress.achievementCollection ?? []);
                (resultado.nuevosAvatares ?? []).forEach((av) => nextAch.add(av));

                const updated: StudentProgress = {
                  ...currentProgress,
                  seasonalCollection: [...nextSeasonal],
                  achievementCollection: [...nextAch],
                  monteLeon: {
                    ...prevML,
                    etapas: prevEtapas,
                    medallaEntregada: prevML.medallaEntregada || !!resultado.medallaPremio,
                  },
                };

                setLocalProgress(updated);
                onProgressUpdated?.(updated);
              }}
            />
          ) : tab === "etapas" ? (
            <div className="flex flex-col gap-3.5">
              <div className="text-center sm:text-left mb-1">
                <p className="text-xs text-amber-950/80 leading-relaxed">
                  Repasá todo sobre el viaje de estudio en estas 5 etapas de 8 actividades.
                  ¡Podés repetirlas todas las veces que quieras para completar tu mochila!
                </p>
              </div>

              {ETAPAS_MONTE_LEON.map((et) => {
                const rec = currentProgress.monteLeon?.etapas?.[et.id];
                const bestScore = rec?.bestScore ?? 0;
                const superada = bestScore >= 80;
                const premioInfo = MOCHILA_MONTE_LEON.find((m) => m.id === et.objetoId);
                const premioGanado = premioInfo ? yaObtenido(premioInfo.id) : false;

                return (
                  <div
                    key={et.id}
                    className="rounded-2xl border-2 border-amber-800/25 bg-amber-50/80 p-3.5 sm:p-4 shadow-sm flex flex-col sm:flex-row items-center gap-3.5 hover:border-amber-700/50 transition"
                  >
                    {/* Miniatura de escena */}
                    <div className="relative w-full sm:w-28 h-24 sm:h-20 shrink-0 rounded-xl overflow-hidden bg-black/10 border border-amber-800/20">
                      <Image
                        src={et.escena}
                        alt={et.titulo}
                        fill
                        sizes="(max-width: 640px) 100vw, 112px"
                        className="object-cover"
                      />
                      <span className="absolute top-1 left-1 bg-black/70 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md">
                        Etapa {et.id}
                      </span>
                    </div>

                    {/* Descripción y estado */}
                    <div className="flex-1 min-w-0 text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                        <h4 className="text-sm sm:text-base font-black text-amber-950">
                          {et.titulo}
                        </h4>
                        {superada && (
                          <span className="rounded-full bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 shadow-xs">
                            ⭐ Superada ({bestScore}%)
                          </span>
                        )}
                        {!superada && bestScore > 0 && (
                          <span className="rounded-full bg-amber-500/20 text-amber-950 text-[10px] font-bold px-2 py-0.5 border border-amber-600/30">
                            Mejor intento: {bestScore}%
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-amber-900/80 mt-0.5 line-clamp-2">
                        {et.subtitulo} · {et.descripcion}
                      </p>

                      <div className="mt-2 flex items-center justify-center sm:justify-start gap-2 text-[11px] text-amber-900/70">
                        <span>🎒 Premio:</span>
                        <span className="font-bold text-amber-950">
                          {premioInfo?.label}
                        </span>
                        {premioGanado ? (
                          <span className="text-emerald-700 font-bold">✅ ¡En tu mochila!</span>
                        ) : (
                          <span className="text-amber-800/70">(80% o más)</span>
                        )}
                      </div>
                    </div>

                    {/* Botón para jugar */}
                    <button
                      type="button"
                      onClick={() => handlePlayStage(et.id)}
                      className="rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs px-4 py-2.5 shrink-0 shadow-sm active:scale-95 transition"
                    >
                      {superada ? "🔁 Repetir etapa" : "🚀 Jugar etapa"}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <MochilaView
              items={mochilaItems}
              mascotaGanada={mascotaGanada}
              medallaGanada={medallaGanada}
              achievementCollection={currentProgress.achievementCollection}
              onOpenProfile={() => {
                onClose();
                onOpenProfile?.();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
