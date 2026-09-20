"use client";

import { useEffect, useMemo, useState } from "react";
import { MemoryPair } from "@/lib/specialChallenge";
import { SUBJECT_INFO, WorldSubject } from "@/types";

interface Props {
  code: string;
  subject: WorldSubject;
  pairs: MemoryPair[];
  coinsReward: number;
  onClose: () => void;
  onCompleted: (coinsEarned: number, streak: number) => void;
}

interface Card {
  cardId: number;
  pairId: number;
  text: string;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildDeck(pairs: MemoryPair[]): Card[] {
  const cards: Card[] = [];
  pairs.forEach((pair, pairId) => {
    cards.push({ cardId: pairId * 2, pairId, text: pair.left });
    cards.push({ cardId: pairId * 2 + 1, pairId, text: pair.right });
  });
  return shuffle(cards);
}

export default function SpecialChallengeModal({
  code,
  subject,
  pairs,
  coinsReward,
  onClose,
  onCompleted,
}: Props) {
  const deck = useMemo(() => buildDeck(pairs), [pairs]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matchedPairIds, setMatchedPairIds] = useState<Set<number>>(new Set());
  const [moves, setMoves] = useState(0);
  const [finishing, setFinishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [earnedStreak, setEarnedStreak] = useState(0);

  const info = SUBJECT_INFO[subject];
  const allMatched = matchedPairIds.size === pairs.length;
  // Con 2 cartas ya dadas vuelta, se bloquean nuevos clics hasta que el
  // efecto de abajo resuelva si hicieron par o no.
  const locked = flipped.length === 2;

  useEffect(() => {
    if (flipped.length !== 2) return;
    const [a, b] = flipped;
    const cardA = deck[a];
    const cardB = deck[b];
    const isMatch = cardA.pairId === cardB.pairId;
    const timeout = setTimeout(
      () => {
        if (isMatch) {
          setMatchedPairIds((prev) => new Set(prev).add(cardA.pairId));
        }
        setFlipped([]);
      },
      isMatch ? 400 : 800
    );
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flipped]);

  function handleCardClick(idx: number) {
    if (locked || done) return;
    if (flipped.includes(idx)) return;
    if (matchedPairIds.has(deck[idx].pairId)) return;
    if (flipped.length >= 2) return;
    setFlipped((prev) => [...prev, idx]);
    if (flipped.length === 0) setMoves((m) => m + 1);
  }

  async function handleFinish() {
    setFinishing(true);
    setError(null);
    try {
      const res = await fetch("/api/special-challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "No pudimos acreditar la recompensa.");
        setFinishing(false);
        return;
      }
      setEarnedStreak(data.streak ?? 0);
      setDone(true);
      onCompleted(data.coinsEarned, data.streak ?? 0);
    } catch {
      setError("Ocurrió un error. Probá de nuevo.");
      setFinishing(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-md rounded-3xl bg-slate-900 border-2 border-amber-400/60 p-5 flex flex-col gap-4 shadow-2xl shadow-amber-500/20">
        <div className="flex items-center justify-between">
          <h2 className="text-white font-black text-lg">
            🎉 Desafío Especial · {info.emoji} {info.label}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 text-xl leading-none"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        {!allMatched && (
          <p className="text-slate-400 text-sm">
            Encontrá los {pairs.length} pares del memorama. Movimientos: {moves}
          </p>
        )}

        {!done && (
          <div className="grid grid-cols-3 gap-2">
            {deck.map((card, idx) => {
              const isFlipped =
                flipped.includes(idx) || matchedPairIds.has(card.pairId);
              const isMatched = matchedPairIds.has(card.pairId);
              return (
                <button
                  key={card.cardId}
                  data-pair-id={card.pairId}
                  data-testid={`memcard-${idx}`}
                  onClick={() => handleCardClick(idx)}
                  disabled={isMatched}
                  className={`aspect-square rounded-xl border-2 flex items-center justify-center text-center p-1 text-[11px] sm:text-xs font-bold leading-tight transition ${
                    isMatched
                      ? "border-emerald-400 bg-emerald-400/10 text-emerald-300"
                      : isFlipped
                        ? "border-amber-400 bg-amber-400/10 text-white"
                        : "border-slate-700 bg-slate-800 text-transparent"
                  }`}
                >
                  {isFlipped ? card.text : "❓"}
                </button>
              );
            })}
          </div>
        )}

        {allMatched && !done && (
          <div className="text-center flex flex-col gap-3 py-2">
            <p className="text-emerald-300 font-bold">
              ¡Encontraste todos los pares en {moves} movimientos! 🎊
            </p>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              onClick={handleFinish}
              disabled={finishing}
              className="rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 font-bold py-2.5 disabled:opacity-60"
            >
              {finishing ? "Guardando..." : `🪙 Cobrar ${coinsReward} monedas extra`}
            </button>
          </div>
        )}

        {done && (
          <div className="text-center flex flex-col gap-3 py-4">
            <p className="text-3xl">🏆</p>
            <p className="text-white font-bold">
              ¡Ganaste {coinsReward} monedas extra!
            </p>
            {earnedStreak > 0 && (
              <p className="text-amber-300 font-bold text-sm">
                🔥 Racha de {earnedStreak}{" "}
                {earnedStreak === 1 ? "fin de semana" : "fines de semana"}{" "}
                seguidos
              </p>
            )}
            <p className="text-slate-400 text-sm">
              Volvé el fin de semana que viene para no perder la racha.
            </p>
            <button
              onClick={onClose}
              className="rounded-xl bg-slate-800 text-slate-200 font-semibold py-2.5"
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
