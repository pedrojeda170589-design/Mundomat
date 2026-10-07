"use client";

import { useState } from "react";
import Image from "next/image";
import Profe, { type PoseProfe } from "@/components/Profe";
import McActivity from "@/components/activities/McActivity";
import OrderActivity from "@/components/activities/OrderActivity";
import ClassifyActivity from "@/components/activities/ClassifyActivity";
import DictationActivity from "@/components/activities/DictationActivity";
import Burst from "@/components/weekend/Burst";
import { ETAPAS_MONTE_LEON } from "@/lib/monteLeon/contenido";
import { MOCHILA_MONTE_LEON, MASCOTA_MONTE_LEON, AVATARES_MONTE_LEON, MEDALLA_MONTE_LEON } from "@/lib/monteLeon/arte";
import type { ActivitySpec } from "@/lib/activities";
import { speak } from "@/lib/tts";

interface Props {
  etapa: number;
  studentCode: string;
  activities: ActivitySpec[];
  onExit: () => void;
  onFinished: (resultado: {
    scorePct: number;
    objetoPremio?: string;
    mascotaPremio?: string;
    nuevosAvatares?: string[];
    medallaPremio?: string;
  }) => void;
}

export default function StageRunner({
  etapa,
  studentCode,
  activities,
  onExit,
  onFinished,
}: Props) {
  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resultadoFinal, setResultadoFinal] = useState<{
    scorePct: number;
    objetoPremio?: string;
    mascotaPremio?: string;
    nuevosAvatares?: string[];
    medallaPremio?: string;
  } | null>(null);

  const infoEtapa = ETAPAS_MONTE_LEON.find((e) => e.id === etapa) ?? ETAPAS_MONTE_LEON[0];
  const total = activities.length;
  const currentActivity = activities[index];

  function handleActivityDone(correct: boolean) {
    const nextCorrect = correct ? correctCount + 1 : correctCount;
    if (correct) {
      setCorrectCount(nextCorrect);
    }

    if (index + 1 < total) {
      setIndex((prev) => prev + 1);
    } else {
      // Final de la vuelta
      const scorePct = Math.round((nextCorrect / total) * 100);
      void finishRound(scorePct);
    }
  }

  async function finishRound(scorePct: number) {
    setSubmitting(true);
    setFinished(true);
    try {
      const res = await fetch("/api/monte-leon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: studentCode,
          action: "completar-etapa",
          etapa,
          scorePct,
        }),
      });
      const data = await res.json();
      const resultado = {
        scorePct,
        objetoPremio: data.resultado?.objetoPremio,
        mascotaPremio: data.resultado?.mascotaPremio,
        nuevosAvatares: data.resultado?.nuevosAvatares,
        medallaPremio: data.resultado?.medallaPremio,
      };
      setResultadoFinal(resultado);
      onFinished(resultado);
    } catch {
      const fallback = { scorePct };
      setResultadoFinal(fallback);
      onFinished(fallback);
    } finally {
      setSubmitting(false);
    }
  }

  if (finished) {
    const scorePct = resultadoFinal?.scorePct ?? Math.round((correctCount / total) * 100);
    const superada = scorePct >= 80;
    const pose: PoseProfe = superada ? "trofeo" : "animo";
    const objetoInfo = resultadoFinal?.objetoPremio
      ? MOCHILA_MONTE_LEON.find((m) => m.id === resultadoFinal.objetoPremio)
      : null;
    const mascotaInfo = resultadoFinal?.mascotaPremio ? MASCOTA_MONTE_LEON : null;
    const medallaInfo = resultadoFinal?.medallaPremio ? MEDALLA_MONTE_LEON : null;
    const avataresInfo = (resultadoFinal?.nuevosAvatares ?? []).map((id) =>
      AVATARES_MONTE_LEON.find((a) => a.id === id)
    ).filter(Boolean);

    return (
      <div className="relative min-h-[500px] flex flex-col items-center justify-center p-6 text-center overflow-hidden">
        {superada && <Burst big count={24} />}
        <div className="parchment-panel relative z-10 rounded-3xl p-6 sm:p-8 max-w-md w-full border-2 border-amber-800/40 shadow-xl flex flex-col items-center">
          <div className="flex items-center gap-3 mb-2">
            <Profe pose={pose} className="w-20 h-28" />
            <div className="text-left">
              <span className="text-3xl">{superada ? "🌟" : "💪"}</span>
              <h3 className="text-2xl font-black text-amber-950">
                {superada ? "¡Etapa superada!" : "¡Buen intento!"}
              </h3>
              <p className="text-sm font-bold text-amber-900/80">
                Puntaje: {scorePct}% ({correctCount} de {total})
              </p>
            </div>
          </div>

          <p className="text-xs text-amber-950/80 my-3 leading-relaxed">
            {superada
              ? `¡Felicitaciones! Superaste «${infoEtapa.titulo}» con éxito.`
              : `Acertaste el ${scorePct}%. Podés volver a jugar esta etapa cuando quieras para sumar más objetos.`}
          </p>

          {/* Premios obtenidos en esta vuelta */}
          {(objetoInfo || mascotaInfo || medallaInfo || avataresInfo.length > 0) && (
            <div className="w-full rounded-2xl bg-amber-100/80 border-2 border-amber-600/30 p-3 my-2 flex flex-col gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-900">
                🎉 ¡Premios que guardaste!
              </span>

              {objetoInfo && (
                <div className="flex items-center gap-2.5 rounded-xl bg-white/80 p-2 border border-amber-600/20">
                  <div className="relative w-10 h-10 shrink-0">
                    <Image
                      src={`/theme/accessories-temporada/${objetoInfo.id}.png`}
                      alt={objetoInfo.label}
                      fill
                      sizes="40px"
                      className="object-contain"
                    />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <span className="block text-xs font-black text-amber-950 truncate">
                      {objetoInfo.label}
                    </span>
                    <span className="block text-[10px] text-amber-900/70">
                      ¡Guardado en tu mochila de viaje!
                    </span>
                  </div>
                </div>
              )}

              {mascotaInfo && (
                <div className="flex items-center gap-2.5 rounded-xl bg-emerald-100/80 p-2 border border-emerald-600/30">
                  <div className="relative w-10 h-10 shrink-0">
                    <Image
                      src={`/theme/accessories-temporada/${mascotaInfo.id}.png`}
                      alt={mascotaInfo.label}
                      fill
                      sizes="40px"
                      className="object-contain"
                    />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <span className="block text-xs font-black text-emerald-950 truncate">
                      🐧 {mascotaInfo.label} (Mascota)
                    </span>
                    <span className="block text-[10px] text-emerald-900/80">
                      ¡Mochila completa! Nueva mascota desbloqueada.
                    </span>
                  </div>
                </div>
              )}

              {medallaInfo && (
                <div className="flex items-center gap-2.5 rounded-xl bg-yellow-100/80 p-2 border border-yellow-600/30">
                  <div className="relative w-10 h-10 shrink-0">
                    <Image
                      src={`/theme/accessories-temporada/${medallaInfo.id}.png`}
                      alt={medallaInfo.label}
                      fill
                      sizes="40px"
                      className="object-contain"
                    />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <span className="block text-xs font-black text-amber-950 truncate">
                      🏅 {medallaInfo.label}
                    </span>
                    <span className="block text-[10px] text-amber-900/80">
                      ¡Medalla conmemorativa entregada!
                    </span>
                  </div>
                </div>
              )}

              {avataresInfo.map((av) => (
                <div
                  key={av?.id}
                  className="flex items-center gap-2.5 rounded-xl bg-purple-100/80 p-2 border border-purple-600/30"
                >
                  <div className="relative w-10 h-10 shrink-0 rounded-lg overflow-hidden bg-slate-800">
                    <Image
                      src={`/theme/avatars/${av?.id}.png`}
                      alt={av?.label ?? "Avatar"}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <span className="block text-xs font-black text-purple-950 truncate">
                      🌟 {av?.label}
                    </span>
                    <span className="block text-[10px] text-purple-900/80">
                      ¡Nuevo avatar superespecial en Mi perfil!
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {submitting && (
            <p className="text-xs text-amber-800/70 animate-pulse my-1">
              Guardando avance…
            </p>
          )}

          <button
            type="button"
            onClick={onExit}
            className="mt-4 rounded-xl bg-amber-500 text-slate-900 font-extrabold px-6 py-2.5 shadow hover:bg-amber-400 active:scale-95 transition"
          >
            Volver a Monte León
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col gap-4">
      {/* Barra superior con escena, etapa y progreso */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-amber-800/30 shadow-md">
        <div className="relative h-28 sm:h-36 w-full">
          <Image
            src={infoEtapa.escena}
            alt={infoEtapa.titulo}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover brightness-90"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
          <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 flex items-end justify-between gap-2">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 drop-shadow">
                Etapa {etapa} de 5
              </span>
              <h3 className="text-base sm:text-xl font-black text-white drop-shadow">
                {infoEtapa.titulo}
              </h3>
            </div>
            <div className="text-right shrink-0">
              <span className="rounded-full bg-black/60 backdrop-blur-xs px-2.5 py-1 text-xs font-black text-amber-300 border border-amber-400/40 shadow">
                Actividad {index + 1} de {total}
              </span>
            </div>
          </div>
        </div>
        {/* Barra de progreso */}
        <div className="h-2 bg-slate-900/60 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-300"
            style={{ width: `${((index + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Controles: volver y escuchar consigna */}
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onExit}
          className="text-xs text-amber-900/80 font-bold hover:text-amber-950 underline px-1 py-0.5"
        >
          ← Salir de la etapa
        </button>
        {currentActivity && (
          <button
            type="button"
            onClick={() => {
              const promptText = "prompt" in currentActivity ? currentActivity.prompt : "";
              const texto =
                currentActivity.type === "dictation"
                  ? currentActivity.say || promptText
                  : promptText;
              if (texto) {
                speak(texto, undefined, 0.9);
              }
            }}
            className="flex items-center gap-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-950 border border-amber-700/30 px-3 py-1 text-xs font-bold transition"
            title="Escuchar consigna en voz alta"
          >
            <span>🔊</span> Escuchar
          </button>
        )}
      </div>

      {/* Contenido de la actividad actual */}
      <div className="min-h-[280px]">
        {currentActivity.type === "mc" && (
          <McActivity
            key={currentActivity.id}
            prompt={currentActivity.prompt}
            choices={currentActivity.choices}
            answerIndex={currentActivity.answerIndex}
            onDone={handleActivityDone}
          />
        )}

        {currentActivity.type === "order" && (
          <OrderActivity
            key={currentActivity.id}
            prompt={currentActivity.prompt}
            items={currentActivity.items}
            correctOrder={currentActivity.correctOrder}
            onDone={handleActivityDone}
          />
        )}

        {currentActivity.type === "classify" && (
          <ClassifyActivity
            key={currentActivity.id}
            prompt={currentActivity.prompt}
            categories={currentActivity.categories}
            items={currentActivity.items}
            onDone={handleActivityDone}
          />
        )}

        {currentActivity.type === "dictation" && (
          <DictationActivity
            key={currentActivity.id}
            prompt={currentActivity.prompt}
            say={currentActivity.say}
            answer={currentActivity.answer}
            kind={currentActivity.kind}
            strictAccents={currentActivity.strictAccents}
            grade={3}
            onDone={handleActivityDone}
          />
        )}
      </div>
    </div>
  );
}
