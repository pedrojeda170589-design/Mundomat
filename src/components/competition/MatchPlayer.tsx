"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { WEEKEND_GAMES } from "@/components/weekend/registry";
import { buildMatch, formatTime } from "@/lib/competition/shared";

// Juega una partida de competencia: 3 rondas (una por juego de memoria),
// siempre las mismas cartas para la misma semilla. Cuenta errores y tiempo
// de juego (las pantallas de "cómo se juega" no cuentan).
export default function MatchPlayer({
  seed,
  onFinish,
  onProgress,
  side,
}: {
  seed: string;
  onFinish: (r: { errors: number; timeMs: number }) => void;
  onProgress?: (p: { round: number; done: number; total: number }) => void;
  side?: React.ReactNode; // p. ej. el avance del rival en vivo
}) {
  const rounds = useMemo(() => buildMatch(seed), [seed]);
  const [round, setRound] = useState(0);
  const [phase, setPhase] = useState<"intro" | "play">("intro");
  const [errors, setErrors] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const playStart = useRef<number | null>(null);
  const accumulated = useRef(0);

  useEffect(() => {
    if (phase !== "play") return;
    const t = setInterval(() => {
      if (playStart.current) setElapsed(accumulated.current + Date.now() - playStart.current);
    }, 500);
    return () => clearInterval(t);
  }, [phase]);

  const activity = rounds[round];
  const def = WEEKEND_GAMES[activity.kind];
  const intro = def.intro(activity);
  const Game = def.component;

  function start() {
    playStart.current = Date.now();
    setPhase("play");
    onProgress?.({ round, done: 0, total: 1 });
  }

  function complete(result: { errors: number }) {
    accumulated.current += Date.now() - (playStart.current ?? Date.now());
    playStart.current = null;
    const totalErrors = errors + result.errors;
    setErrors(totalErrors);
    setElapsed(accumulated.current);
    if (round + 1 >= rounds.length) {
      onProgress?.({ round: rounds.length, done: 1, total: 1 });
      onFinish({ errors: totalErrors, timeMs: accumulated.current });
      return;
    }
    onProgress?.({ round: round + 1, done: 0, total: 1 });
    setRound(round + 1);
    setPhase("intro");
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="w-full max-w-md flex items-center justify-between gap-2 rounded-2xl bg-white/85 border-2 border-violet-300 px-4 py-2 text-sm font-black text-violet-800">
        <span>
          Ronda {round + 1} de {rounds.length}
        </span>
        <span>❌ {errors}</span>
        <span>⏱️ {formatTime(elapsed)}</span>
      </div>
      {side}
      {phase === "intro" ? (
        <div className="parchment-panel rounded-3xl px-5 py-5 w-full max-w-md text-center flex flex-col gap-3">
          <p className="text-xs font-bold uppercase tracking-wide opacity-70">Ronda {round + 1}</p>
          <h2 className="text-2xl font-black text-violet-800">{intro.gameName}</h2>
          <p className="text-sm leading-snug">{intro.howTo}</p>
          {intro.example && (
            <p className="text-sm font-bold">
              Secuencia {intro.sequenceType}: {intro.example.join(", ")}…
            </p>
          )}
          <p className="text-xs opacity-70">El reloj empieza cuando tocás “¡Listo!”.</p>
          <button
            onClick={start}
            className="mx-auto rounded-2xl bg-violet-600 text-white font-black text-lg px-8 py-3 shadow active:scale-95"
          >
            ¡Listo!
          </button>
        </div>
      ) : (
        <Game
          key={`${seed}-${round}`}
          activity={activity}
          onComplete={complete}
          onProgress={(done, total) => onProgress?.({ round, done, total })}
        />
      )}
    </div>
  );
}
