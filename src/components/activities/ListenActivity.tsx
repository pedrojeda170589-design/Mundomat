"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { playClip, stopClip } from "@/lib/audio";
import { speak } from "@/lib/tts";
import { bajarMusica } from "@/lib/musica";
import { oraciones as sentences, vozUrl } from "@/lib/cuentos/voz";

type Genre = "cuento" | "leyenda" | "fabula";

interface Props {
  title: string;
  storyId: string;
  // "listen" (1.º): se lee en voz alta y pasa sola, como diapositivas.
  // "read" (2.º y 3.º): lo leen ellos; el audio queda en un botón por si
  // necesitan ayuda (y también resalta cada oración mientras suena).
  mode?: "listen" | "read";
  genre?: Genre;
  scenes: { text: string; image: string }[];
  // Desde 3.º la lectura en voz alta es opcional y cuesta monedas (una vez por texto).
  voiceCost?: number;
  coins?: number;
  studentCode?: string;
  onCoinsChange?: (coins: number) => void;
  onFinish: () => void;
}

const LABEL: Record<Genre, { art: string; icon: string }> = {
  cuento: { art: "el cuento", icon: "📖" },
  leyenda: { art: "la leyenda", icon: "🏔️" },
  fabula: { art: "la fábula", icon: "🦊" },
};


// Texto narrativo ilustrado, como diapositivas: cada escena muestra su
// imagen y su texto, y mientras se lee en voz alta se resalta la oración
// que suena (correspondencia imagen–texto–voz). Si hay audio grabado
// (/audio/cuentos/<id>-<n>.mp3) se usa ese; si no, la voz del navegador
// lee oración por oración. Al final se habilitan las preguntas. No suma
// ni resta puntos.
export default function ListenActivity({
  title,
  storyId,
  mode = "listen",
  genre = "cuento",
  scenes,
  voiceCost = 0,
  coins = 0,
  studentCode,
  onCoinsChange,
  onFinish,
}: Props) {
  const reader = mode === "read";
  const [paid, setPaid] = useState(voiceCost <= 0);
  const [notice, setNotice] = useState<string | null>(null);
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(!reader);
  const [heard, setHeard] = useState<Set<number>>(new Set());
  const [reading, setReading] = useState(false);
  const [current, setCurrent] = useState<number | "all" | null>(null); // oración resaltada
  const token = useRef(0);
  const last = scenes.length - 1;
  const parts = useMemo(() => scenes.map((s) => sentences(s.text)), [scenes]);
  const label = LABEL[genre];

  // Una oración: voz grabada (Kokoro) si existe; si no, la del navegador.
  function say(text: string, onDone: () => void) {
    const url = vozUrl(text);
    if (url) playClip({ audio: url, onEnd: onDone, onFallback: () => speak(text, onDone) });
    else speak(text, onDone);
  }

  function read(k: number, advance: boolean) {
    const my = ++token.current;
    setReading(true);
    bajarMusica(true);
    const finish = () => {
      if (token.current !== my) return;
      bajarMusica(false);
      setReading(false);
      setCurrent(null);
      setHeard((h) => new Set(h).add(k));
      if (advance && k < last) {
        setTimeout(() => {
          if (token.current === my) setI(k + 1);
        }, 1400);
      }
    };
    const bySentence = (n: number) => {
      if (token.current !== my) return;
      if (n >= parts[k].length) return finish();
      setCurrent(n);
      const next = () => setTimeout(() => bySentence(n + 1), 150);
      if (k === 0 && n === 0) say(title, () => token.current === my && say(parts[k][n], next));
      else say(parts[k][n], next);
    };
    setCurrent("all");
    playClip({ audio: `/audio/cuentos/${storyId}-${k + 1}.mp3`, onEnd: finish, onFallback: () => bySentence(0) });
  }

  useEffect(() => {
    if (reader) return; // en modo lectura no se narra solo
    const t = setTimeout(() => read(i, auto), 600);
    return () => clearTimeout(t);
    // Se lee cada vez que cambia la escena.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i]);

  useEffect(
    () => () => {
      token.current++;
      stopClip();
      bajarMusica(false);
    },
    []
  );

  function go(k: number) {
    token.current++;
    stopClip();
    bajarMusica(false);
    setReading(false);
    setCurrent(null);
    setI(Math.max(0, Math.min(last, k)));
  }

  // 🔊: gratis en 1.º y 2.º; en 3.º se paga una vez y queda habilitado para todo el texto.
  async function listen() {
    if (!paid) {
      if (!studentCode) return;
      const res = await fetch("/api/spend-coins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: studentCode, amount: voiceCost }),
      }).then((r) => r.json() as Promise<{ ok: boolean; coins: number }>);
      if (!res.ok) {
        setNotice(`Necesitás ${voiceCost} 🪙 para escuchar el texto. ¡Podés leerlo vos!`);
        return;
      }
      onCoinsChange?.(res.coins);
      setPaid(true);
      setNotice(null);
    }
    read(i, false);
  }

  const scene = scenes[i];
  const done = i === last && (reader || heard.has(last) || !reading);

  return (
    <div className="w-full max-w-md rounded-3xl bg-slate-900/85 border border-slate-700 p-4 shadow-xl">
      <p className="text-amber-300 text-xs font-black uppercase tracking-wide text-center">
        {label.icon} {reader ? "Leé" : "Escuchá"} {label.art}
      </p>
      <h3 className="text-xl font-black text-white text-center mb-3">{title}</h3>
      {/* Diapositiva: la imagen entra con un fundido y se acerca despacio. */}
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden border-4 border-amber-200/80 bg-slate-800 mb-3">
        <div key={i} className="absolute inset-0 slide-in">
          <Image src={scene.image} alt="" fill sizes="(max-width: 480px) 100vw, 420px" className="object-cover kenburns" priority />
        </div>
        <span className="absolute top-2 left-2 rounded-full bg-black/55 text-white text-xs font-bold px-2 py-0.5">
          {i + 1} / {scenes.length}
        </span>
        {reading && (
          <span className="absolute top-2 right-2 rounded-full bg-sky-500 text-white text-sm font-bold px-2.5 py-1 shadow animate-pulse">
            🔊 Leyendo…
          </span>
        )}
      </div>
      <p
        key={`t-${i}`}
        className={`${reader ? "text-xl" : "text-lg"} text-slate-50 leading-relaxed min-h-[5.5rem] mb-3 slide-in`}
        style={{ fontFamily: "Andika, ui-rounded, system-ui, sans-serif" }}
      >
        {parts[i].map((s, n) => (
          <span
            key={n}
            className={`rounded-md px-0.5 transition-colors duration-300 ${
              current === n || current === "all" ? "bg-amber-300/30 text-white" : reading ? "text-slate-300" : ""
            }`}
          >
            {s}{" "}
          </span>
        ))}
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
        <button
          type="button"
          onClick={() => void listen()}
          disabled={!paid && coins < voiceCost}
          className="rounded-2xl bg-sky-500 text-white font-bold py-3 disabled:opacity-40"
        >
          {!reader ? "🔊 Repetir" : paid ? "🔊 Escuchar" : `🔊 ${voiceCost} 🪙`}
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
      {notice && <p className="mt-2 text-center text-sm font-bold text-amber-300">{notice}</p>}
      {reader && !paid && !notice && (
        <p className="mt-2 text-center text-xs text-slate-300">Si necesitás ayuda, podés escucharlo por {voiceCost} 🪙 (todo el texto).</p>
      )}
      {!reader && (
        <label className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-300">
          <input type="checkbox" checked={auto} onChange={(e) => setAuto(e.target.checked)} />
          Pasar de diapositiva solo
        </label>
      )}
    </div>
  );
}
