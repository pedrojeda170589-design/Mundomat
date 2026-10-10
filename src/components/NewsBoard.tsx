"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import AvatarDisplay from "@/components/AvatarDisplay";
import type { NewsItem, TeacherNote } from "@/lib/news";
import { BIRTHDAY_MESSAGES, PRESET_GIFTS } from "@/lib/messagesShared";
import { AvatarAccessories } from "@/types";

function timeAgo(iso: string): string {
  const mins = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (mins < 1) return "recién";
  if (mins < 60) return `hace ${mins} min`;
  const h = Math.round(mins / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.round(h / 24);
  return d === 1 ? "ayer" : `hace ${d} días`;
}

interface BirthdayInfo {
  code: string;
  name: string;
  age: number | null;
  avatar?: string;
  accessories?: AvatarAccessories;
  tweaks?: import("@/types").AvatarTweaks;
  capas?: import("@/types").AvatarCapa[];
  background?: string;
  me: boolean;
  greeted: boolean;
  greetings: number;
}

const BIRTHDAY_GIFTS = PRESET_GIFTS.filter((g) => ["torta", "regalito", "globo"].includes(g.id));

// Pizarrón de novedades de la clase: cumpleaños de hoy (fijos arriba, con
// botón para saludar), logros recientes de los compañeros y un mensaje para
// animar al alumno a seguir participando.
export default function NewsBoard({ code }: { code: string }) {
  const [items, setItems] = useState<NewsItem[] | null>(null);
  const [notes, setNotes] = useState<TeacherNote[]>([]);
  const [message, setMessage] = useState<string | undefined>();
  const [birthdays, setBirthdays] = useState<BirthdayInfo[]>([]);
  const [canGreet, setCanGreet] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [greeting, setGreeting] = useState<BirthdayInfo | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const load = useCallback(async () => {
    try {
      const d = await fetch(`/api/news?code=${encodeURIComponent(code)}`).then((r) => r.json());
      setItems(d.items ?? []);
      setNotes(d.notes ?? []);
      setMessage(d.message);
      setBirthdays(d.birthdays ?? []);
      setCanGreet(!!d.messagingEnabled);
    } catch {
      setItems((i) => i ?? []);
    }
  }, [code]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
    const t = setInterval(() => void load(), 90_000);
    return () => clearInterval(t);
  }, [load]);

  async function send(kind: "mensaje" | "regalo", presetId: string) {
    if (!greeting) return;
    setSending(true);
    setStatus(null);
    try {
      const r = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, to: greeting.code, kind, presetId }),
      });
      const d = await r.json();
      if (!r.ok) setStatus(`⚠️ ${d.error}`);
      else {
        setStatus(`🎉 ¡Le mandaste tu saludo a ${greeting.name}!`);
        void load();
      }
    } finally {
      setSending(false);
    }
  }

  if (items === null) return null;
  const shown = expanded ? items : items.slice(0, 4);

  return (
    <section className="relative z-10 w-full max-w-3xl mx-auto mb-5 px-4">
      <div
        className="rounded-2xl border-[6px] border-amber-800 shadow-lg px-4 pt-3 pb-4"
        style={{
          background:
            "radial-gradient(circle at 20% 10%, rgba(255,255,255,0.08), transparent 50%), linear-gradient(180deg, #2f5a3f, #24472f)",
          fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'Segoe Print', cursive",
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-white font-black text-lg tracking-wide">📌 Pizarrón de novedades</h2>
          {items.length > 4 && (
            <button onClick={() => setExpanded((e) => !e)} className="text-xs text-white/80 underline">
              {expanded ? "Ver menos" : `Ver todo (${items.length})`}
            </button>
          )}
        </div>

        {notes.length > 0 && (
          <ul className="flex flex-col gap-2 mb-3">
            {notes.map((n) => (
              <li
                key={n.id}
                className="relative rounded-xl bg-yellow-100 text-amber-950 px-3 py-2 shadow-md -rotate-[0.6deg]"
                style={{ fontFamily: "inherit" }}
              >
                <span className="absolute -top-2.5 right-3 text-lg" aria-hidden>
                  📌
                </span>
                <span className="block text-[11px] font-bold uppercase tracking-wide text-amber-700">
                  Mensaje del docente · {timeAgo(n.at)}
                </span>
                <span className="block text-sm font-bold leading-snug whitespace-pre-line">
                  {n.emoji} {n.text}
                </span>
              </li>
            ))}
          </ul>
        )}

        {birthdays.length > 0 && (
          <ul className="flex flex-col gap-2 mb-3">
            {birthdays.map((b) => (
              <li
                key={b.code}
                className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-pink-500/35 via-amber-400/30 to-sky-400/30 border-2 border-dashed border-yellow-200/70 px-3 py-2"
              >
                <AvatarDisplay
                  character={b.avatar}
                  accessories={b.accessories}
                  tweaks={b.tweaks}
                  capas={b.capas}
                  background={b.background}
                  birthday
                  className="w-14 h-14 rounded-xl shrink-0"
                  imageSizes="56px"
                />
                <span className="flex-1 min-w-0 text-white text-sm leading-snug">
                  {b.me ? (
                    <>
                      <b className="text-yellow-200">¡Hoy es tu cumpleaños!</b> 🎂
                      <span className="block text-white/90 text-xs">
                        {b.greetings > 0
                          ? `${b.greetings} ${b.greetings === 1 ? "compañero te saludó" : "compañeros te saludaron"}. ¡Mirá tu buzón 💌!`
                          : "¡Todo el grado te desea un feliz día!"}
                      </span>
                    </>
                  ) : (
                    <>
                      🎂 <b className="text-yellow-200">{b.name}</b> cumple años hoy. ¡Saludalo!
                      {b.greetings > 0 && (
                        <span className="block text-white/80 text-xs">
                          Ya {b.greetings === 1 ? "lo saludó 1 compañero" : `lo saludaron ${b.greetings} compañeros`}
                        </span>
                      )}
                    </>
                  )}
                </span>
                {!b.me && canGreet && (
                  <button
                    onClick={() => {
                      setGreeting(b);
                      setStatus(null);
                    }}
                    className={`shrink-0 rounded-xl px-3 py-1.5 text-sm font-black ${
                      b.greeted ? "bg-white/25 text-white" : "bg-yellow-300 text-amber-900 animate-pulse"
                    }`}
                    style={{ fontFamily: "inherit" }}
                  >
                    {b.greeted ? "✓ Saludado" : "🎉 Saludar"}
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}

        {message && <p className="text-yellow-200 font-bold text-sm mb-2 leading-snug">✨ {message}</p>}
        {items.length === 0 && notes.length === 0 ? (
          <p className="text-white/80 text-sm">
            Todavía no hay novedades. ¡Superá un mundo y aparecé en el pizarrón!
          </p>
        ) : (
          <ul className="flex flex-col gap-1.5">
            {shown.map((n) => (
              <li key={n.id} className="flex items-start gap-2 text-white/95 text-sm leading-snug">
                <span className="text-base shrink-0">{n.emoji}</span>
                <span className="flex-1">
                  {/* Las novedades viejas traen «con 95%»: no se muestra la nota. */}
                  <b className="text-sky-200">{n.who}</b> {n.text.replace(/ con \d+ ?%$/, "")}
                  {n.kind !== "racha" && " 👏"}
                </span>
                <span className="text-[11px] text-white/50 shrink-0 mt-0.5">{timeAgo(n.at)}</span>
              </li>
            ))}
          </ul>
        )}
        {/* Tiza de adorno */}
        <div className="mt-2 h-1.5 w-16 rounded-full bg-white/70 ml-auto" aria-hidden />
      </div>

      {greeting &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 py-6 overflow-y-auto">
            <div className="w-full max-w-md rounded-3xl fondo-ilustrado fondo-novedades border-2 border-white/25 p-5 shadow-2xl flex flex-col gap-3 my-auto">
              <div className="flex items-center gap-3">
                <AvatarDisplay
                  character={greeting.avatar}
                  accessories={greeting.accessories}
                  tweaks={greeting.tweaks}
                  capas={greeting.capas}
                  background={greeting.background}
                  birthday
                  className="w-14 h-14 rounded-xl"
                  imageSizes="56px"
                />
                <h2 className="flex-1 text-white font-black text-lg leading-tight">
                  Saludá a {greeting.name} 🎂
                </h2>
                <button onClick={() => setGreeting(null)} className="text-slate-400 text-xl" aria-label="Cerrar">
                  ✕
                </button>
              </div>
              <p className="text-slate-400 text-xs">Elegí un saludo:</p>
              <div className="grid grid-cols-1 gap-1.5">
                {BIRTHDAY_MESSAGES.map((m) => (
                  <button
                    key={m.id}
                    disabled={sending}
                    onClick={() => void send("mensaje", m.id)}
                    className="text-left rounded-xl bg-slate-800 hover:bg-slate-700 px-3 py-2 text-white text-sm disabled:opacity-50"
                  >
                    {m.emoji} {m.text}
                  </button>
                ))}
              </div>
              <p className="text-slate-400 text-xs">…o mandale un regalito:</p>
              <div className="grid grid-cols-3 gap-2">
                {BIRTHDAY_GIFTS.map((g) => (
                  <button
                    key={g.id}
                    disabled={sending}
                    onClick={() => void send("regalo", g.id)}
                    className="rounded-xl bg-slate-800 hover:bg-slate-700 py-2 flex flex-col items-center text-white text-xs disabled:opacity-50"
                  >
                    <span className="text-3xl">{g.emoji}</span>
                    {g.text}
                  </button>
                ))}
              </div>
              {status && <p className="text-sm text-center text-white">{status}</p>}
            </div>
          </div>,
          document.body
        )}
    </section>
  );
}
