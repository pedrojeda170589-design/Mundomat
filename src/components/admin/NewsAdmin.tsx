"use client";

import { useEffect, useState } from "react";
import type { NewsItem } from "@/lib/news";

// Vista del Pizarrón de novedades para el docente, con opción de borrarlo.
export default function NewsAdmin({ adminPassword }: { adminPassword: string }) {
  const [items, setItems] = useState<NewsItem[]>([]);

  useEffect(() => {
    fetch("/api/news")
      .then((r) => r.json())
      .then((d) => setItems(d.items ?? []))
      .catch(() => {});
  }, []);

  async function handleClear() {
    if (!confirm("¿Borrar todas las novedades del pizarrón?")) return;
    await fetch(`/api/news?adminPassword=${encodeURIComponent(adminPassword)}`, { method: "DELETE" });
    setItems([]);
  }

  return (
    <div className="parchment-panel rounded-2xl p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-amber-950">📌 Pizarrón de novedades (lo ven los alumnos)</h3>
        <button onClick={handleClear} className="text-xs text-red-700 underline">
          Borrar pizarrón
        </button>
      </div>
      {items.length === 0 ? (
        <p className="text-amber-800/60 text-sm">Sin novedades por ahora.</p>
      ) : (
        <ul className="text-sm text-amber-950 flex flex-col gap-1">
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
