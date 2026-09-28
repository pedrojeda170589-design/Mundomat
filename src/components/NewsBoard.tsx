"use client";

import { useEffect, useState } from "react";
import type { NewsItem } from "@/lib/news";

function timeAgo(iso: string): string {
  const mins = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (mins < 1) return "recién";
  if (mins < 60) return `hace ${mins} min`;
  const h = Math.round(mins / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.round(h / 24);
  return d === 1 ? "ayer" : `hace ${d} días`;
}

// Pizarrón de novedades de la clase: logros recientes de los compañeros y
// un mensaje para animar al alumno a seguir participando.
export default function NewsBoard({ code }: { code: string }) {
  const [items, setItems] = useState<NewsItem[] | null>(null);
  const [message, setMessage] = useState<string | undefined>();
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/news?code=${encodeURIComponent(code)}`)
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        setItems(d.items ?? []);
        setMessage(d.message);
      })
      .catch(() => !cancelled && setItems([]));
    return () => {
      cancelled = true;
    };
  }, [code]);

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
            <button
              onClick={() => setExpanded((e) => !e)}
              className="text-xs text-white/80 underline"
            >
              {expanded ? "Ver menos" : `Ver todo (${items.length})`}
            </button>
          )}
        </div>
        {message && (
          <p className="text-yellow-200 font-bold text-sm mb-2 leading-snug">✨ {message}</p>
        )}
        {items.length === 0 ? (
          <p className="text-white/80 text-sm">
            Todavía no hay novedades. ¡Completá un mundo y aparecé en el pizarrón!
          </p>
        ) : (
          <ul className="flex flex-col gap-1.5">
            {shown.map((n) => (
              <li key={n.id} className="flex items-start gap-2 text-white/95 text-sm leading-snug">
                <span className="text-base shrink-0">{n.emoji}</span>
                <span className="flex-1">
                  <b className="text-sky-200">{n.who}</b> {n.text}
                  {n.kind !== "racha" && " 👏"}
                </span>
                <span className="text-[11px] text-white/50 shrink-0 mt-0.5">{timeAgo(n.at)}</span>
              </li>
            ))}
          </ul>
        )}
        {/* Tiza y borrador de adorno */}
        <div className="mt-2 h-1.5 w-16 rounded-full bg-white/70 ml-auto" aria-hidden />
      </div>
    </section>
  );
}
