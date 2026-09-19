"use client";

import { useState } from "react";
import { speak } from "@/lib/tts";
import { COST_HINT, COST_VOICE_AVANZADO, WorldDifficulty } from "@/types";

interface Props {
  speakText: string;
  hint: string;
  difficulty: WorldDifficulty;
  coins: number;
  studentCode: string;
  onCoinsChange: (coins: number) => void;
}

async function trySpend(
  studentCode: string,
  amount: number
): Promise<{ ok: boolean; coins: number }> {
  const res = await fetch("/api/spend-coins", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code: studentCode, amount }),
  });
  return res.json();
}

export default function AssistControls({
  speakText,
  hint,
  difficulty,
  coins,
  studentCode,
  onCoinsChange,
}: Props) {
  const [showHint, setShowHint] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const voiceCost = difficulty === "avanzado" ? COST_VOICE_AVANZADO : 0;

  async function handleSpeak() {
    if (voiceCost > 0) {
      const result = await trySpend(studentCode, voiceCost);
      if (!result.ok) {
        setNotice("¡Necesitás más monedas para escuchar esta consigna! 🪙");
        return;
      }
      onCoinsChange(result.coins);
    }
    speak(speakText);
  }

  async function handleHint() {
    if (showHint) return;
    const result = await trySpend(studentCode, COST_HINT);
    if (!result.ok) {
      setNotice("¡Necesitás más monedas para pedir una pista! 🪙");
      return;
    }
    onCoinsChange(result.coins);
    setShowHint(true);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={handleSpeak}
          disabled={voiceCost > 0 && coins < voiceCost}
          className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/15 border border-sky-400/40 text-sky-200 px-3 py-1.5 text-sm font-semibold hover:bg-sky-500/25 transition disabled:opacity-40"
        >
          🔊 Escuchar {voiceCost > 0 ? `(${voiceCost} 🪙)` : "(gratis)"}
        </button>
        <button
          type="button"
          onClick={handleHint}
          disabled={showHint || coins < COST_HINT}
          className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/15 border border-purple-400/40 text-purple-200 px-3 py-1.5 text-sm font-semibold hover:bg-purple-500/25 transition disabled:opacity-40"
        >
          💡 Pista ({COST_HINT} 🪙)
        </button>
      </div>
      {notice && <p className="text-amber-300 text-xs">{notice}</p>}
      {showHint && (
        <p className="text-purple-200 text-sm bg-purple-500/10 border border-purple-400/30 rounded-lg px-3 py-2">
          {hint}
        </p>
      )}
    </div>
  );
}
