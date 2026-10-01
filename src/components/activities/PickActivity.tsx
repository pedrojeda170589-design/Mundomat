"use client";

import { useEffect, useState } from "react";
import type { ActivityCard } from "@/lib/activities";
import { playClip, stopClip } from "@/lib/audio";
import { cardBase } from "./shared";

interface Props {
  prompt: string;
  say?: string;
  audio?: string;
  promptBig?: string;
  promptEmoji?: string;
  story?: { title: string; text: string; scenes?: string[] };
  storyFirst?: boolean;
  cards: ActivityCard[];
  answerIds: string[];
  onDone: (correct: boolean) => void;
}

// Elegir una (o varias) tarjetas. Pensada para chicos que todavía no leen:
// la consigna se escucha sola al empezar y cada tarjeta tiene su 🔊.
export default function PickActivity({ prompt, say, audio, promptBig, promptEmoji, story, storyFirst = true, cards, answerIds, onDone }: Props) {
  const multi = answerIds.length > 1;
  const [selected, setSelected] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [storyOpen, setStoryOpen] = useState(!!story && storyFirst);

  useEffect(() => {
    const t = setTimeout(() => {
      if (story && storyFirst) playClip({ say: `${story.title}. ${story.text}` });
      else playClip({ audio, say: say ?? prompt });
    }, 250);
    return () => {
      clearTimeout(t);
      stopClip();
    };
  }, [audio, say, prompt, story, storyFirst]);

  function finish(sel: string[]) {
    setDone(true);
    stopClip();
    const ok = sel.length === answerIds.length && sel.every((id) => answerIds.includes(id));
    setTimeout(() => onDone(ok), 900);
  }

  function tap(id: string) {
    if (done) return;
    if (!multi) {
      setSelected([id]);
      finish([id]);
      return;
    }
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  if (story && storyOpen) {
    return (
      <div className={cardBase}>
        <p className="text-amber-300 text-xs font-black uppercase tracking-wide text-center">Escuchá el cuento</p>
        <h3 className="text-xl font-black text-white text-center mb-3">{story.title}</h3>
        {story.scenes && <p className="text-4xl text-center mb-2">{story.scenes.join(" ")}</p>}
        <p className="text-base text-slate-100 leading-relaxed mb-4">{story.text}</p>
        <div className="flex gap-2 justify-center">
          <button
            type="button"
            onClick={() => playClip({ say: `${story.title}. ${story.text}` })}
            className="rounded-full bg-sky-500/20 border border-sky-400/50 text-sky-100 px-4 py-2 font-bold"
          >
            🔊 Escuchar de nuevo
          </button>
          <button
            type="button"
            onClick={() => {
              stopClip();
              setStoryOpen(false);
              setTimeout(() => playClip({ audio, say: say ?? prompt }), 200);
            }}
            className="rounded-full bg-amber-400 text-slate-900 px-5 py-2 font-black"
          >
            Responder →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cardBase}>
      <div className="flex items-start gap-2 mb-3">
        <button
          type="button"
          onClick={() => playClip({ audio, say: say ?? prompt })}
          className="shrink-0 w-11 h-11 rounded-full bg-sky-500 text-white text-xl shadow active:scale-95"
          aria-label="Escuchar la consigna"
        >
          🔊
        </button>
        <p className="text-lg font-bold text-white leading-snug pt-1.5">{prompt}</p>
      </div>
      {story && (
        <button type="button" onClick={() => setStoryOpen(true)} className="text-sky-300 text-sm underline mb-2">
          📖 Volver a ver el cuento
        </button>
      )}
      {(promptEmoji || promptBig) && (
        <div className="text-center mb-4">
          {promptEmoji && <div className="text-6xl leading-tight whitespace-pre-line">{promptEmoji}</div>}
          {promptBig && (
            <div className="mt-1 text-4xl sm:text-5xl font-black text-amber-200 whitespace-pre-line tracking-wide" style={{ fontFamily: "Andika, ui-rounded, system-ui, sans-serif" }}>
              {promptBig}
            </div>
          )}
        </div>
      )}
      <div className={`grid gap-3 ${cards.length === 2 || cards.length === 4 ? "grid-cols-2" : "grid-cols-3"}`}>
        {cards.map((c) => {
          const isSel = selected.includes(c.id);
          const isAns = answerIds.includes(c.id);
          let cls = "bg-white text-slate-900 border-slate-300 hover:border-amber-400";
          if (done) {
            if (isAns) cls = "bg-emerald-100 text-emerald-900 border-emerald-500 ring-4 ring-emerald-400/60";
            else if (isSel) cls = "bg-red-100 text-red-900 border-red-500";
            else cls = "bg-white/50 text-slate-500 border-slate-300 opacity-60";
          } else if (isSel) cls = "bg-amber-100 text-slate-900 border-amber-500 ring-4 ring-amber-300/70";
          return (
            <div key={c.id} className="relative">
              <button
                type="button"
                onClick={() => tap(c.id)}
                className={`w-full min-h-[96px] rounded-2xl border-4 px-2 py-3 flex flex-col items-center justify-center gap-1 transition active:scale-95 ${cls}`}
              >
                {c.emoji && <span className="text-5xl leading-none">{c.emoji}</span>}
                {c.big && (
                  <span
                    className={`font-black leading-tight whitespace-pre-line break-words ${c.big.length > 8 ? "text-lg" : c.big.length > 3 ? "text-2xl" : "text-4xl"}`}
                    style={{ fontFamily: "Andika, ui-rounded, system-ui, sans-serif" }}
                  >
                    {c.big}
                  </span>
                )}
                {c.label && <span className="text-sm font-bold leading-tight">{c.label}</span>}
              </button>
              {(c.say || c.audio) && (
                <button
                  type="button"
                  onClick={() => playClip({ audio: c.audio, say: c.say })}
                  className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-sky-500 text-white text-sm shadow border-2 border-white"
                  aria-label={`Escuchar ${c.say ?? ""}`}
                >
                  🔊
                </button>
              )}
            </div>
          );
        })}
      </div>
      {multi && !done && (
        <button
          type="button"
          disabled={selected.length === 0}
          onClick={() => finish(selected)}
          className="mt-4 w-full rounded-2xl bg-amber-400 text-slate-900 font-black py-3 disabled:opacity-40"
        >
          ¡Listo! ({selected.length})
        </button>
      )}
    </div>
  );
}
