"use client";

import { useEffect, useState } from "react";
import { cardBase } from "./shared";
import { esperarVoces, estadoVoz, speak, stopSpeaking, type EstadoVoz } from "@/lib/tts";
import { evaluarDictado, EvaluacionDictado } from "@/lib/dictado/evaluacion";

interface Props {
  prompt: string;
  say?: string;
  contexto?: string; // oración con «____» donde va la palabra
  answer: string;
  kind: "numero" | "palabra" | "oracion";
  strictAccents?: boolean;
  grade?: number;
  onDone: (correct: boolean) => void;
}

export default function DictationActivity({
  prompt,
  say,
  contexto,
  answer,
  kind,
  strictAccents = false,
  grade = 2,
  onDone,
}: Props) {
  const [value, setValue] = useState("");
  const [result, setResult] = useState<EvaluacionDictado | null>(null);
  const textToSay = say || answer;

  const [voz, setVoz] = useState<EstadoVoz>("cargando");
  const [mirar, setMirar] = useState(false); // ver la palabra unos segundos (sin voz)

  // Reproducción automática de audio al montar la consigna. Antes se fija si
  // el navegador tiene voz en español (si no, la voz en inglés no se entiende).
  useEffect(() => {
    let vivo = true;
    void esperarVoces().then(() => {
      if (!vivo) return;
      // Si después de esperar todavía no hay voces, el navegador no tiene ninguna.
      const e = estadoVoz();
      setVoz(e === "cargando" ? "sin-voz" : e);
      speak(textToSay, undefined, 0.85);
    });
    return () => {
      vivo = false;
      stopSpeaking();
    };
  }, [textToSay]);

  function verUnosSegundos() {
    setMirar(true);
    setTimeout(() => setMirar(false), 3000);
  }

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

      {contexto && (
        <p className="mb-4 rounded-2xl bg-slate-800/80 border border-slate-600 px-4 py-3 text-center text-lg text-slate-100 leading-snug">
          {contexto.split(/_{2,}/).map((parte, i, arr) => (
            <span key={i}>
              {parte}
              {i < arr.length - 1 && (
                <span className="inline-block min-w-24 mx-1 border-b-4 border-amber-400 text-amber-300 font-black align-baseline">
                  {mirar ? answer : "\u00a0"}
                </span>
              )}
            </span>
          ))}
        </p>
      )}

      {(voz === "sin-voz" || voz === "sin-espanol") && (
        <div className="mb-4 rounded-2xl bg-amber-950/70 border border-amber-500/50 px-4 py-3 text-center text-sm text-amber-100">
          <p className="font-bold">
            {voz === "sin-voz"
              ? "Este dispositivo no puede leer en voz alta."
              : "Este dispositivo no tiene voz en español: la lectura puede no entenderse."}
          </p>
          <p className="mt-1">Pedile a tu docente que te dicte la palabra, o mirala unos segundos y después escribila de memoria.</p>
          {!mirar && result === null && (
            <button type="button" onClick={verUnosSegundos} className="mt-2 rounded-full bg-amber-500 text-slate-950 font-black px-4 py-1.5">
              👀 Ver la palabra 3 segundos
            </button>
          )}
          {mirar && !contexto && <p className="mt-2 text-2xl font-black text-amber-300">{answer}</p>}
        </div>
      )}

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
