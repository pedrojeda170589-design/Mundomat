"use client";

import { useState } from "react";
import { RATING_LIKED_OPTIONS, RatingLikedOption } from "@/lib/openClassroomShared";

interface TrialRatingCardProps {
  studentCode: string;
  onSubmitted?: () => void;
}

export default function TrialRatingCard({
  studentCode,
  onSubmitted,
}: TrialRatingCardProps) {
  const [stars, setStars] = useState<number>(5);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [liked, setLiked] = useState<RatingLikedOption[]>([]);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleLiked(option: RatingLikedOption) {
    setLiked((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/prueba/valoracion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: studentCode,
          stars,
          liked,
          comment: comment.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "No pudimos guardar tu valoración.");
        setSubmitting(false);
        return;
      }
      setSubmitted(true);
      onSubmitted?.();
    } catch {
      setError("Ocurrió un error. Probá nuevamente.");
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="parchment-panel rounded-2xl p-6 text-center shadow-lg border-2 border-amber-600/40">
        <span className="text-4xl block mb-2">🌟</span>
        <h3 className="text-xl font-black text-amber-950 mb-1">
          ¡Muchas gracias por dejarnos tu opinión!
        </h3>
        <p className="text-sm text-amber-900/80">
          Tu experiencia nos ayuda a seguir mejorando MundoTest26.
        </p>
      </div>
    );
  }

  const activeStars = hoveredStar !== null ? hoveredStar : stars;

  return (
    <div className="parchment-panel rounded-2xl p-6 shadow-lg border-2 border-amber-600/40">
      <h3 className="text-lg font-black text-amber-950 text-center mb-1">
        ¿Cómo fue tu experiencia en MundoTest26?
      </h3>
      <p className="text-xs text-amber-800 text-center mb-4">
        Valorá la prueba para ayudarnos a seguir construyendo este espacio.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Estrellas */}
        <div className="text-center">
          <label className="block text-sm font-bold text-amber-950 mb-2">
            ¿Te gustó el juego?
          </label>
          <div className="inline-flex gap-1 items-center justify-center">
            {[1, 2, 3, 4, 5].map((starNum) => (
              <button
                key={starNum}
                type="button"
                onClick={() => setStars(starNum)}
                onMouseEnter={() => setHoveredStar(starNum)}
                onMouseLeave={() => setHoveredStar(null)}
                className="text-3xl sm:text-4xl transition-transform hover:scale-125 focus:outline-none"
                title={`${starNum} estrella${starNum > 1 ? "s" : ""}`}
              >
                {starNum <= activeStars ? "⭐" : "☆"}
              </button>
            ))}
          </div>
        </div>

        {/* Chips de lo que más gustó */}
        <div>
          <label className="block text-sm font-bold text-amber-950 mb-2 text-center">
            ¿Qué fue lo que más te gustó?
          </label>
          <div className="flex flex-wrap gap-2 justify-center">
            {RATING_LIKED_OPTIONS.map((option) => {
              const selected = liked.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleLiked(option)}
                  className={`rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-bold border-2 transition ${
                    selected
                      ? "bg-amber-500 text-amber-950 border-amber-700 shadow-sm scale-105"
                      : "bg-white/70 text-amber-900 border-amber-700/30 hover:bg-white"
                  }`}
                >
                  {selected ? "✓ " : ""}{option}
                </button>
              );
            })}
          </div>
        </div>

        {/* Comentario de la persona adulta */}
        <div>
          <label className="block text-xs font-bold text-amber-950 mb-1">
            Comentario de la persona adulta (opcional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value.slice(0, 300))}
            maxLength={300}
            rows={3}
            placeholder="Contanos qué te pareció la propuesta educativa, qué disfrutaron o sugerencias..."
            className="w-full rounded-xl bg-white/70 border-2 border-amber-700/30 p-2.5 text-sm text-amber-950 outline-none focus:border-amber-600 placeholder:text-amber-800/40 resize-none"
          />
          <div className="text-right text-[11px] text-amber-800/60 font-semibold">
            {comment.length} / 300 caracteres
          </div>
        </div>

        {error && (
          <p className="text-red-700 text-xs text-center font-bold">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 font-extrabold text-base py-3 border-2 border-amber-700/50 hover:brightness-105 active:scale-95 transition disabled:opacity-60"
        >
          {submitting ? "Enviando..." : "Enviar valoración ✨"}
        </button>
      </form>
    </div>
  );
}
