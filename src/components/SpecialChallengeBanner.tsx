"use client";

import { SUBJECT_INFO, WorldSubject } from "@/types";

interface Props {
  subject: WorldSubject;
  coinsReward: number;
  streak: number;
  previewStreak: number;
  onPlay: () => void;
}

export default function SpecialChallengeBanner({
  subject,
  coinsReward,
  streak,
  previewStreak,
  onPlay,
}: Props) {
  const info = SUBJECT_INFO[subject];
  return (
    <button
      onClick={onPlay}
      className="relative z-10 w-full max-w-3xl mx-auto mb-6 px-4 text-left"
    >
      <div className="rounded-2xl border-2 border-amber-400 bg-gradient-to-r from-amber-500/20 via-yellow-400/20 to-amber-500/20 px-4 py-3 flex items-center justify-between gap-3 shadow-[0_0_18px_rgba(251,191,36,0.35)] hover:brightness-110 transition">
        <div className="flex items-center gap-2">
          <span className="text-2xl animate-pulse">🎉</span>
          <span>
            <span className="block text-amber-300 font-black text-sm">
              ¡Desafío Especial del fin de semana!
            </span>
            <span className="block text-slate-300 text-xs">
              Memorama de {info.emoji} {info.label} · ganá {coinsReward}{" "}
              monedas extra
              {streak > 0 && (
                <> · 🔥 racha de {streak} → {previewStreak} si jugás hoy</>
              )}
            </span>
          </span>
        </div>
        <span className="text-amber-300 font-bold text-sm shrink-0">
          Jugar →
        </span>
      </div>
    </button>
  );
}
