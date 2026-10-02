"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { playClip, stopClip } from "@/lib/audio";

interface Props {
  title: string;
  storyId: string;
  // "listen" (1.º): se lee en voz alta y pasa sola. "read" (2.º y 3.º): lo
  // leen ellos; el audio queda en un botón por si necesitan ayuda.
  mode?: "listen" | "read";
  scenes: { text: string; image: string }[];
  onFinish: () => void;
}

// Cuento ilustrado: en modo "listen" cada escena se lee en voz alta (audio
// grabado si existe en /audio/cuentos/<id>-<n>.mp3, si no la voz del
// navegador) y pasa sola a la siguiente; en modo "read" los chicos leen y
// pueden tocar 🔊 si lo necesitan. Al final se habilitan las preguntas.
// No suma ni resta puntos.
export default function ListenActivity({ title, storyId, mode = "listen", scenes, onFinish }: Props) {
  const reader = mode === "read";
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(!reader);
  const [heard, setHeard] = useState<Set<number>>(new Set());
  const [reading, setReading] = useState(false);
  const token = useRef(0);
  const last = scenes.length - 1;

  function read(k: number, advance: boolean) {
    const my = ++token.current;
    setReading(true);
    playClip({
      audio: `/audio/cuentos/${storyId}-${k + 1}.mp3`,
      say: k === 0 ? `${title}. ${scenes[k].text}` : scenes[k].text,
      onEnd: () => {
        if (token.current !== my) return;
        setReading(false);
        setHeard((h) => new Set(h).add(k));
        if (advance && k < last) {
          setTimeout(() => {
            if (token.current === my) setI(k + 1);
          }, 1200);
        }
      },
    });
  }

  useEffect(() => {
    if (reader) return; // en modo lectura no se narra solo
    const t = setTimeout(() => read(i, auto), 350);
    return () => {
      clearTimeout(t);
    };
    // Se lee cada vez que cambia la escena.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i]);

  useEffect(
    () => () => {
      token.current++;
      stopClip();
    },
    []
  );

  function go(k: number) {
    token.current++;
    stopClip();
    setReading(false);
    setI(Math.max(0, Math.min(last, k)));
  }

  const scene = scenes[i];
  const done = i === last && (reader || heard.has(last) || !reading);

  return (
    <div className="w-full max-w-md rounded-3xl bg-slate-900/85 border border-slate-700 p-4 shadow-xl">
      <p className="text-amber-300 text-xs font-black uppercase tracking-wide text-center">📖 {reader ? "Leé el cuento" : "Escuchá el cuento"}</p>
      <h3 className="text-xl font-black text-white text-center mb-3">{title}</h3>
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden border-4 border-amber-200/80 bg-slate-800 mb-3">
        <Image src={scene.image} alt="" fill sizes="(max-width: 480px) 100vw, 420px" className="object-cover" priority />
        {reading && (
          <span className="absolute top-2 right-2 rounded-full bg-sky-500 text-white text-sm font-bold px-2.5 py-1 shadow animate-pulse">
            🔊 Leyendo…
          </span>
        )}
      </div>
      <p className={`${reader ? "text-xl" : "text-lg"} text-slate-50 leading-relaxed min-h-[5.5rem] mb-3`} style={{ fontFamily: "Andika, ui-rounded, system-ui, sans-serif" }}>
        {scene.text}
      </p>
      <div className="flex justify-center gap-1.5 mb-3" aria-label={`Escena ${i + 1} de ${scenes.length}`}>
        {scenes.map((_, k) => (
          <span key={k} className={`h-2.5 w-8 rounded-full ${k < i ? "bg-emerald-400" : k === i ? "bg-amber-400" : "bg-white/25"}`} />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2">
        <button type="button" onClick={() => go(i - 1)} disabled={i === 0} className="rounded-2xl bg-slate-700 text-white font-bold py-3 disabled:opacity-30">
          ⏮ Atrás
        </button>
        <button type="button" onClick={() => read(i, false)} className="rounded-2xl bg-sky-500 text-white font-bold py-3">
          {reader ? "🔊 Escuchar" : "🔊 Repetir"}
        </button>
        {i < last ? (
          <button type="button" onClick={() => go(i + 1)} className="rounded-2xl bg-amber-400 text-slate-900 font-black py-3">
            Sigue ⏭
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              token.current++;
              stopClip();
              onFinish();
            }}
            disabled={!done}
            className="rounded-2xl bg-emerald-500 text-white font-black py-3 disabled:opacity-40"
          >
            ¡A responder!
          </button>
        )}
      </div>
      {!reader && (
        <label className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-300">
          <input type="checkbox" checked={auto} onChange={(e) => setAuto(e.target.checked)} />
          Pasar de página solo
        </label>
      )}
    </div>
  );
}
