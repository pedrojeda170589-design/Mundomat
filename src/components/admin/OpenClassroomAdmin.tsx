"use client";

import { useEffect, useState } from "react";
import {
  OpenClassroomConfig,
  OpenClassroomRating,
  RATING_LIKED_OPTIONS,
} from "@/lib/openClassroomShared";
import { OpenClassroomStats } from "@/lib/openClassroom";

interface OpenClassroomAdminProps {
  adminPassword: string;
}

export default function OpenClassroomAdmin({
  adminPassword,
}: OpenClassroomAdminProps) {
  const [data, setData] = useState<{
    config: OpenClassroomConfig;
    stats: OpenClassroomStats;
    ratings: OpenClassroomRating[];
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [capacityInput, setCapacityInput] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`/api/prueba/admin?adminPassword=${encodeURIComponent(adminPassword)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => {
        if (d) {
          setData(d);
          setCapacityInput(String(d.config.capacity));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [adminPassword]);

  async function handleToggleOpen() {
    if (!data || saving) return;
    setSaving(true);
    try {
      const nextOpen = !data.config.open;
      const res = await fetch("/api/prueba/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminPassword,
          open: nextOpen,
        }),
      });
      const updated = await res.json();
      if (updated.ok) {
        setData((prev) =>
          prev
            ? {
                ...prev,
                config: updated.config,
                stats: updated.stats,
              }
            : prev
        );
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveCapacity(e: React.FormEvent) {
    e.preventDefault();
    if (!data || saving) return;
    const num = parseInt(capacityInput, 10);
    if (isNaN(num) || num < 1 || num > 1000) return;
    setSaving(true);
    try {
      const res = await fetch("/api/prueba/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminPassword,
          capacity: num,
        }),
      });
      const updated = await res.json();
      if (updated.ok) {
        setData((prev) =>
          prev
            ? {
                ...prev,
                config: updated.config,
                stats: updated.stats,
              }
            : prev
        );
      }
    } finally {
      setSaving(false);
    }
  }

  function handleCopyLink() {
    const url = "https://mundomat.vercel.app/prueba";
    navigator.clipboard?.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading || !data) return null;

  const { config, stats, ratings } = data;

  // Cálculo de estadísticas de valoración
  const totalRatings = ratings.length;
  const averageStars =
    totalRatings > 0
      ? (ratings.reduce((sum, r) => sum + r.stars, 0) / totalRatings).toFixed(1)
      : null;

  const chipCounts: Record<string, number> = {};
  for (const option of RATING_LIKED_OPTIONS) {
    chipCounts[option] = 0;
  }
  for (const r of ratings) {
    for (const item of r.liked) {
      chipCounts[item] = (chipCounts[item] ?? 0) + 1;
    }
  }

  const comments = ratings.filter((r) => r.comment && r.comment.trim().length > 0);

  return (
    <div className="parchment-panel rounded-2xl p-5 flex flex-col gap-4 shadow-sm border-2 border-amber-700/20">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h3 className="font-bold text-amber-950 text-base flex items-center gap-1.5">
            <span>🚪</span> Aula abierta de prueba (3.º grado)
          </h3>
          <p className="text-xs text-amber-900/80">
            Inscripción autónoma de chicos de otras escuelas por 30 días.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleOpen}
            disabled={saving}
            className={`rounded-full px-3 py-1 text-xs font-bold transition ${
              config.open
                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                : "bg-slate-500 text-white hover:bg-slate-600"
            }`}
          >
            {config.open ? "Inscripción abierta" : "Inscripción cerrada"}
          </button>
        </div>
      </div>

      {/* Enlace para compartir */}
      <div className="flex items-center gap-2 bg-white/60 rounded-xl p-2.5 border border-amber-700/20">
        <span className="text-xs font-bold text-amber-900 shrink-0">Enlace público:</span>
        <code className="text-xs text-amber-950 font-mono flex-1 truncate">
          https://mundomat.vercel.app/prueba
        </code>
        <button
          type="button"
          onClick={handleCopyLink}
          className="shrink-0 text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-500 text-amber-950 hover:bg-amber-600 transition"
        >
          {copied ? "¡Copiado! ✓" : "Copiar"}
        </button>
      </div>

      {/* Contadores y Cupo */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl bg-white/70 border border-amber-700/20 py-2.5 px-1">
          <p className="text-lg font-black text-amber-950">
            {stats.totalEnrolled} / {config.capacity}
          </p>
          <p className="text-[11px] font-semibold text-amber-800/80">Inscriptos / Cupo</p>
        </div>
        <div className="rounded-xl bg-white/70 border border-amber-700/20 py-2.5 px-1">
          <p className="text-lg font-black text-emerald-700">{stats.active}</p>
          <p className="text-[11px] font-semibold text-amber-800/80">Activos</p>
        </div>
        <div className="rounded-xl bg-white/70 border border-amber-700/20 py-2.5 px-1">
          <p className="text-lg font-black text-amber-800">{stats.expired}</p>
          <p className="text-[11px] font-semibold text-amber-800/80">Vencidos</p>
        </div>
      </div>

      {/* Modificar cupo */}
      <form onSubmit={handleSaveCapacity} className="flex items-center gap-2 text-xs">
        <span className="font-bold text-amber-950">Capacidad máxima (cupo):</span>
        <input
          type="number"
          min={1}
          max={1000}
          value={capacityInput}
          onChange={(e) => setCapacityInput(e.target.value)}
          className="w-20 rounded-lg bg-white/80 border border-amber-700/30 px-2 py-1 text-center font-bold text-amber-950 outline-none focus:border-amber-600"
        />
        <button
          type="submit"
          disabled={saving || capacityInput === String(config.capacity)}
          className="rounded-lg bg-amber-500 text-amber-950 px-3 py-1 font-bold disabled:opacity-40 hover:bg-amber-600 transition"
        >
          Guardar cupo
        </button>
      </form>

      {/* Sección de Valoraciones */}
      <div className="border-t border-amber-700/20 pt-3 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-amber-950 text-sm flex items-center gap-1.5">
            <span>⭐</span> Valoraciones de la experiencia
          </h4>
          {averageStars && (
            <span className="text-sm font-black text-amber-900">
              Promedio: {averageStars} / 5 ⭐ ({totalRatings})
            </span>
          )}
        </div>

        {totalRatings === 0 ? (
          <p className="text-xs text-amber-800/70 italic">
            Todavía no se recibieron valoraciones de alumnos de prueba.
          </p>
        ) : (
          <>
            {/* Conteo de chips */}
            <div>
              <p className="text-xs font-bold text-amber-900 mb-1.5">
                Aspectos más valorados:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {RATING_LIKED_OPTIONS.map((opt) => (
                  <span
                    key={opt}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/80 border border-amber-700/30 text-amber-950"
                  >
                    <span>{opt}:</span>
                    <strong className="text-amber-800">{chipCounts[opt] ?? 0}</strong>
                  </span>
                ))}
              </div>
            </div>

            {/* Comentarios */}
            {comments.length > 0 && (
              <div className="mt-1">
                <p className="text-xs font-bold text-amber-900 mb-1.5">
                  Comentarios recibidos ({comments.length}):
                </p>
                <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                  {comments.map((r, i) => (
                    <div
                      key={i}
                      className="bg-white/70 rounded-xl p-2.5 border border-amber-700/20 text-xs flex flex-col gap-1"
                    >
                      <div className="flex items-center justify-between text-[11px] text-amber-800/70">
                        <span className="font-bold text-amber-950">
                          {r.stars} ⭐ {r.liked.length > 0 ? `· ${r.liked.join(", ")}` : ""}
                        </span>
                        <span>{new Date(r.at).toLocaleDateString("es-AR")}</span>
                      </div>
                      <p className="text-amber-950 leading-relaxed italic">
                        «{r.comment}»
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
