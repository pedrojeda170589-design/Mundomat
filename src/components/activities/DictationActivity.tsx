"use client";

import { useEffect, useState } from "react";
import { cardBase } from "./shared";
import { speak, stopSpeaking } from "@/lib/tts";
import { evaluarDictado, EvaluacionDictado } from "@/lib/dictado/evaluacion";

interface Props {
  prompt: string;
  say?: string;
  answer: string;
  kind: "numero" | "palabra" | "oracion";
  strictAccents?: boolean;
  grade?: number;
  onDone: (correct: boolean) => void;
}

export default function DictationActivity({
  prompt,
  say,
  answer,
  kind,
  strictAccents = false,
  grade = 2,
  onDone,
}: Props) {
  const [value, setValue] = useState("");
  const [result, setResult] = useState<EvaluacionDictado | null>(null);
  const textToSay = say || answer;

  // Reproducción automática de audio al montar la consigna
  useEffect(() => {
    speak(textToSay, undefined, 0.85);
    return () => {
      stopSpeaking();
    };
  }, [textToSay]);

  function handlePlayAudio() {
    speak(textToSay, undefined, 0.85);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (result !== null || !value.trim()) return;

    const ev = evaluarDictado(kind, value, answer, grade, strictAccents);
    setResult(ev);

    if (ev.ok) {
      setTimeout(() => {
        onDone(true);
      }, ev.warning ? 1800 : 1200);
    }
  }

  function handleContinueAfterError() {
    onDone(false);
  }

  return (
    <div className={cardBase}>
      <p className="text-xl font-bold text-white mb-4 text-center">
        {prompt}
      </p>

      {/* Botón grande para escuchar y repetir */}
      <div className="flex justify-center mb-6">
        <button
          type="button"
          onClick={handlePlayAudio}
          className="flex items-center gap-2 rounded-2xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black px-6 py-3.5 text-lg shadow-lg hover:shadow-amber-500/20 transition cursor-pointer"
          title="Escuchar dictado"
          aria-label="Escuchar dictado"
        >
          <span className="text-2xl animate-pulse">🔊</span>
          <span>Escuchar</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
        {kind === "numero" ? (
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={value}
            onChange={(e) => {
              // Permitir solo números y puntos/espacios que el niño pueda tipear
              const clean = e.target.value.replace(/[^0-9.,]/g, "");
              setValue(clean);
            }}
            disabled={result !== null}
            autoFocus
            placeholder="0"
            className="w-48 text-center text-4xl font-black rounded-2xl bg-slate-800 border-2 border-slate-600 focus:border-amber-400 outline-none py-3 text-white disabled:opacity-80 transition"
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={result !== null}
            autoFocus
            placeholder={kind === "oracion" ? "Escribí la oración..." : "Escribí la palabra..."}
            className="w-full text-center text-xl font-bold rounded-2xl bg-slate-800 border-2 border-slate-600 focus:border-amber-400 outline-none py-3.5 px-4 text-white disabled:opacity-80 transition"
          />
        )}

        {result === null && (
          <button
            type="submit"
            disabled={!value.trim()}
            className="rounded-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-black px-8 py-2.5 text-base shadow transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Comprobar
          </button>
        )}

        {result && (
          <div className="flex flex-col items-center gap-2 mt-2 text-center animate-fadeIn">
            {result.ok ? (
              <>
                <p className="text-emerald-300 font-bold text-lg">
                  {result.feedback} 🎉
                </p>
                {result.warning && (
                  <p className="text-amber-300 font-semibold text-sm bg-amber-950/60 border border-amber-500/40 rounded-xl px-3 py-1.5">
                    {result.warning}
                  </p>
                )}
              </>
            ) : (
              <>
                <p className="text-red-300 font-bold text-base">
                  {result.feedback}
                </p>
                <button
                  type="button"
                  onClick={handleContinueAfterError}
                  autoFocus
                  className="rounded-full bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black px-6 py-2 text-sm shadow mt-2 transition"
                >
                  Continuar →
                </button>
              </>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
