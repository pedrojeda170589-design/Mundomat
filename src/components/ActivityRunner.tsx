"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { COINS_BONUS_WORLD_COMPLETE, WorldDef } from "@/types";
import { ActivitySpec, buildActivitiesForWorld } from "@/lib/activities";
import { WorldMasteryOutcome } from "@/lib/progressLogic";
import McActivity from "@/components/activities/McActivity";
import InputActivity from "@/components/activities/InputActivity";
import ShapeActivity from "@/components/activities/ShapeActivity";
import TableReviewActivity from "@/components/activities/TableReviewActivity";
import TimedActivity from "@/components/activities/TimedActivity";
import OrderActivity from "@/components/activities/OrderActivity";
import MatchActivity from "@/components/activities/MatchActivity";
import ClassifyActivity from "@/components/activities/ClassifyActivity";
import TrueFalseActivity from "@/components/activities/TrueFalseActivity";
import FindErrorActivity from "@/components/activities/FindErrorActivity";
import AssistControls from "@/components/AssistControls";
import CoinBadge from "@/components/CoinBadge";
import Mountains from "@/components/Mountains";

interface Props {
  world: WorldDef;
  studentCode: string;
  coins: number;
  onCoinsChange: (coins: number) => void;
  onExit: () => void;
  onWorldCompleted: () => void;
}

function speakTextFor(activity: ActivitySpec): string {
  switch (activity.type) {
    case "mc":
    case "input":
    case "shape-identify":
    case "order":
    case "match":
    case "classify":
      return activity.prompt;
    case "full-table-review":
      return `Repasemos toda la tabla del ${activity.table}.`;
    case "timed":
      return "Contra el reloj: respondé lo más rápido que puedas.";
    case "true-false":
      return activity.statement;
    case "find-error":
      return `${activity.prompt} ${activity.resolution}`;
  }
}

export default function ActivityRunner({
  world,
  studentCode,
  coins,
  onCoinsChange,
  onExit,
  onWorldCompleted,
}: Props) {
  const activities = useMemo(() => buildActivitiesForWorld(world), [world]);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<
    "question" | "feedback" | "finishing" | "world-done"
  >("question");
  const [lastCorrect, setLastCorrect] = useState(false);
  const [lastCoinsEarned, setLastCoinsEarned] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [attemptOutcome, setAttemptOutcome] =
    useState<WorldMasteryOutcome | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    startTimeRef.current = Date.now();
  }, []);

  const activity = activities[index];

  async function submitResult(correct: boolean) {
    const timeSpentSeconds = Math.round(
      (Date.now() - startTimeRef.current) / 1000
    );
    setLastCorrect(correct);
    if (correct) setCorrectCount((c) => c + 1);
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: studentCode,
          worldId: world.id,
          activityIndex: index,
          correct: correct ? 1 : 0,
          incorrect: correct ? 0 : 1,
          timeSpentSeconds,
        }),
      });
      const data = await res.json();
      if (data.coinsEarned) {
        onCoinsChange(data.progress.coins);
        setLastCoinsEarned(data.coinsEarned);
      } else {
        setLastCoinsEarned(0);
      }
    } catch {
      // si falla la red, igual dejamos seguir jugando
    }
    setPhase("feedback");
  }

  async function finishWorldAttempt(finalCorrectCount: number) {
    setPhase("finishing");
    try {
      const res = await fetch("/api/world-attempt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: studentCode,
          worldId: world.id,
          correctCount: finalCorrectCount,
          totalActivities: activities.length,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setAttemptOutcome(data.outcome);
        if (data.coinsEarned) {
          onCoinsChange(data.progress.coins);
        }
      } else {
        setAttemptOutcome(null);
      }
    } catch {
      // si falla la red, igual dejamos ver la pantalla final (sin detalle)
      setAttemptOutcome(null);
    }
    setPhase("world-done");
  }

  function handleNext() {
    if (index + 1 >= activities.length) {
      void finishWorldAttempt(correctCount);
    } else {
      setIndex(index + 1);
      startTimeRef.current = Date.now();
      setPhase("question");
    }
  }

  if (phase === "finishing") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
        <p className="text-4xl mb-3 animate-pulse">✨</p>
        <p className="text-slate-400">Calculando tu resultado...</p>
      </div>
    );
  }

  if (phase === "world-done") {
    return (
      <WorldDoneScreen
        world={world}
        outcome={attemptOutcome}
        onBack={onWorldCompleted}
      />
    );
  }

  return (
    <div className="relative flex-1 flex flex-col px-4 py-6 overflow-hidden">
      <Mountains isDay={false} />
      <div className="wood-panel-light relative z-10 flex items-center justify-between mb-4 max-w-md w-full mx-auto rounded-2xl px-4 py-2">
        <button onClick={onExit} className="text-amber-50 text-sm font-semibold">
          ← Salir
        </button>
        <span className="text-sm text-amber-50 font-semibold">
          {world.emoji} {world.name} · {index + 1}/{activities.length}
        </span>
        <CoinBadge coins={coins} />
      </div>
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center gap-4">
        {phase === "question" && (
          <>
            {activity.type === "mc" && (
              <McActivity
                prompt={activity.prompt}
                choices={activity.choices}
                answerIndex={activity.answerIndex}
                onDone={submitResult}
              />
            )}
            {activity.type === "input" && (
              <InputActivity
                prompt={activity.prompt}
                answer={activity.answer}
                onDone={submitResult}
              />
            )}
            {activity.type === "shape-identify" && (
              <ShapeActivity
                prompt={activity.prompt}
                choices={activity.choices}
                answerIndex={activity.answerIndex}
                onDone={submitResult}
              />
            )}
            {activity.type === "full-table-review" && (
              <TableReviewActivity
                table={activity.table}
                facts={activity.facts}
                onDone={submitResult}
              />
            )}
            {activity.type === "timed" && (
              <TimedActivity
                seconds={activity.seconds}
                questions={activity.questions}
                onDone={submitResult}
              />
            )}
            {activity.type === "order" && (
              <OrderActivity
                prompt={activity.prompt}
                items={activity.items}
                correctOrder={activity.correctOrder}
                onDone={submitResult}
              />
            )}
            {activity.type === "match" && (
              <MatchActivity
                prompt={activity.prompt}
                pairs={activity.pairs}
                onDone={submitResult}
              />
            )}
            {activity.type === "classify" && (
              <ClassifyActivity
                prompt={activity.prompt}
                categories={activity.categories}
                items={activity.items}
                onDone={submitResult}
              />
            )}
            {activity.type === "true-false" && (
              <TrueFalseActivity
                statement={activity.statement}
                isTrue={activity.isTrue}
                justification={activity.justification}
                onDone={submitResult}
              />
            )}
            {activity.type === "find-error" && (
              <FindErrorActivity
                prompt={activity.prompt}
                resolution={activity.resolution}
                choices={activity.choices}
                answerIndex={activity.answerIndex}
                correctAnswer={activity.correctAnswer}
                onDone={submitResult}
              />
            )}

            <div className="w-full max-w-md">
              <AssistControls
                speakText={speakTextFor(activity)}
                hint={activity.hint}
                difficulty={world.difficulty}
                coins={coins}
                studentCode={studentCode}
                onCoinsChange={onCoinsChange}
              />
            </div>
          </>
        )}

        {phase === "feedback" && (
          <div className="parchment-panel w-full max-w-md rounded-3xl p-8 text-center">
            <p className="text-5xl mb-3">{lastCorrect ? "🎉" : "💪"}</p>
            <p className="text-xl font-bold text-amber-950 mb-1">
              {lastCorrect ? "¡Muy bien!" : "¡Seguí practicando!"}
            </p>
            {lastCoinsEarned > 0 && (
              <p className="text-amber-700 font-semibold mb-4">
                +{lastCoinsEarned} 🪙
              </p>
            )}
            <button
              onClick={handleNext}
              className="mt-4 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 font-extrabold px-8 py-3 border-2 border-amber-700/40"
            >
              {index + 1 >= activities.length
                ? "Ver resultado →"
                : "Siguiente actividad →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

interface WorldDoneScreenProps {
  world: WorldDef;
  outcome: WorldMasteryOutcome | null;
  onBack: () => void;
}

// Pantalla final al terminar una vuelta completa del mundo. El contenido
// depende del resultado del sistema de refuerzo (90%): completado (de
// primera o tras la repetición de refuerzo), a un repaso de completar, o a
// fortalecer (a tratar por el docente).
function WorldDoneScreen({ world, outcome, onBack }: WorldDoneScreenProps) {
  let emoji = "🏆";
  let title = `¡Completaste ${world.name}!`;
  let message = "Muy buen trabajo, seguí así.";
  let coinsNote: string | null = null;

  if (outcome?.kind === "completed") {
    if (outcome.alreadyCompleted) {
      emoji = "🔁";
      title = `¡Repasaste ${world.name}!`;
      message = "Este mundo ya lo tenías completado — repasarlo siempre suma.";
    } else {
      emoji = "🏆";
      title = `¡Reforzaste y completaste ${world.name}!`;
      message = "Ya lo dominás. ¡Excelente trabajo!";
      coinsNote = `+${COINS_BONUS_WORLD_COMPLETE} 🪙 de bonus por completar el mundo`;
    }
  } else if (outcome?.kind === "pending-retry") {
    emoji = "🌟";
    title = `¡Lograste ${outcome.scorePct}%!`;
    message =
      "Muy bien. Repetí este mundo una vez más para terminar de dominarlo.";
  } else if (outcome?.kind === "needs-review") {
    emoji = "🌱";
    title = "Necesitás fortalecer este mundo";
    message = `Esta vez lograste ${outcome.scorePct}%. Practicá un poco más y volvé a intentarlo cuando quieras.`;
  }

  return (
    <div className="relative flex-1 flex flex-col items-center justify-center px-6 py-12 text-center overflow-hidden bg-explorer-night">
      <Mountains isDay={false} />
      <div className="parchment-panel relative z-10 rounded-3xl px-8 py-10 max-w-sm w-full mx-4">
        <p className="text-6xl mb-4">{emoji}</p>
        <h2 className="text-2xl font-black text-amber-800 mb-2">{title}</h2>
        <p className="text-amber-950/80 mb-2">{message}</p>
        {coinsNote && (
          <p className="text-amber-700 font-semibold mb-4">{coinsNote}</p>
        )}
        <button
          onClick={onBack}
          className="mt-4 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 font-extrabold px-8 py-3 border-2 border-amber-700/40"
        >
          Volver al mapa
        </button>
      </div>
    </div>
  );
}
