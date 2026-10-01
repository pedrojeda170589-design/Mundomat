"use client";

import { useEffect, useState } from "react";
import type { NewsItem, TeacherNote } from "@/lib/news";

const EMOJIS = ["📣", "⭐", "🎉", "📚", "🧠", "🌟", "👏", "📅", "🏆", "💡", "❤️", "🌈"];
const MAX_LENGTH = 280;

// Pizarrón de novedades para el docente: escribir mensajes propios (quedan
// fijos arriba del pizarrón hasta borrarlos), ver los logros automáticos y
// borrarlos.
export default function NewsAdmin({ adminPassword }: { adminPassword: string }) {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [notes, setNotes] = useState<TeacherNote[]>([]);
  const [text, setText] = useState("");
  const [emoji, setEmoji] = useState("📣");
  const [status, setStatus] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  function load() {
    fetch("/api/news")
      .then((r) => r.json())
      .then((d) => {
        setItems(d.items ?? []);
        setNotes(d.notes ?? []);
      })
      .catch(() => {});
  }

  useEffect(load, []);

  async function publish(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    setStatus(null);
    try {
      const r = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminPassword, text, emoji }),
      });
      const d = await r.json();
      if (!r.ok) {
        setStatus(`⚠️ ${d.error}`);
        return;
      }
      setText("");
      setStatus("✅ Publicado en el pizarrón.");
      load();
    } finally {
      setSending(false);
    }
  }

  async function removeNote(id: string) {
    await fetch(`/api/news?adminPassword=${encodeURIComponent(adminPassword)}&noteId=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    setNotes((n) => n.filter((x) => x.id !== id));
  }

  async function handleClear() {
    if (!confirm("¿Borrar las novedades automáticas (logros) del pizarrón? Tus mensajes quedan.")) return;
    await fetch(`/api/news?adminPassword=${encodeURIComponent(adminPassword)}`, { method: "DELETE" });
    setItems([]);
  }

  return (
    <div className="parchment-panel rounded-2xl p-4 text-amber-950">
      <h3 className="font-bold mb-2">📌 Pizarrón de novedades (lo ven los alumnos)</h3>

      <form onSubmit={publish} className="flex flex-col gap-2 mb-3">
        <label className="text-sm font-semibold">Escribí un mensaje para la clase</label>
        <div className="flex flex-wrap gap-1">
          {EMOJIS.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => setEmoji(e)}
              className={`w-9 h-9 rounded-lg text-xl ${emoji === e ? "bg-amber-400 ring-2 ring-amber-700" : "bg-white/70"}`}
              aria-label={`Elegir ${e}`}
            >
              {e}
            </button>
          ))}
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, MAX_LENGTH))}
          rows={3}
          placeholder="Ej.: ¡Mañana traemos la tabla del 6 repasada! 💪"
          className="rounded-xl border-2 border-amber-800/30 bg-white/80 px-3 py-2 text-sm"
        />
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs opacity-70">
            {text.length}/{MAX_LENGTH} · Queda fijo arriba del pizarrón hasta que lo borres.
          </span>
          <button
            disabled={sending || !text.trim()}
            className="rounded-xl bg-emerald-600 text-white font-bold px-4 py-2 text-sm disabled:opacity-50"
          >
            Publicar
          </button>
        </div>
        {status && <p className="text-sm font-bold">{status}</p>}
      </form>

      {notes.length > 0 && (
        <div className="mb-3">
          <p className="text-sm font-semibold mb-1">Tus mensajes publicados</p>
          <ul className="flex flex-col gap-1">
            {notes.map((n) => (
              <li key={n.id} className="flex items-start gap-2 rounded-lg bg-white/60 px-2 py-1 text-sm">
                <span>{n.emoji}</span>
                <span className="flex-1 whitespace-pre-line">{n.text}</span>
                <button onClick={() => removeNote(n.id)} className="text-xs text-red-700 underline shrink-0">
                  Borrar
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-center justify-between mb-1">
        <p className="text-sm font-semibold">Logros de la clase (automáticos)</p>
        {items.length > 0 && (
          <button onClick={handleClear} className="text-xs text-red-700 underline">
            Borrar logros
          </button>
        )}
      </div>
      {items.length === 0 ? (
        <p className="text-amber-800/60 text-sm">Sin novedades por ahora.</p>
      ) : (
        <ul className="text-sm flex flex-col gap-1">
          {items.slice(0, 10).map((n) => (
            <li key={n.id}>
              {n.emoji} <b>{n.who}</b> {n.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
