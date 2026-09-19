"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { WorldDef } from "@/types";
import { ActivitySpec, buildActivitiesForWorld } from "@/lib/activities";
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
  const [phase, setPhase] = useState<"question" | "feedback" | "world-done">(
    "question"
  );
  const [lastCorrect, setLastCorrect] = useState(false);
  const [lastCoinsEarned, setLastCoinsEarned] = useState(0);
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
      if (data.worldJustCompleted) {
        setPhase("world-done");
        return;
      }
    } catch {
      // si falla la red, igual dejamos seguir jugando
    }
    setPhase("feedback");
  }

  function handleNext() {
    if (index + 1 >= activities.length) {
      setPhase("world-done");
    } else {
      setIndex(index + 1);
      startTimeRef.current = Date.now();
      setPhase("question");
    }
  }

  if (phase === "world-done") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
        <p className="text-6xl mb-4">🏆</p>
        <h2 className="text-2xl font-black text-amber-300 mb-2">
          ¡Completaste {world.name}!
        </h2>
        <p className="text-slate-300 mb-6">Muy buen trabajo, seguí así.</p>
        <button
          onClick={() => {
            onWorldCompleted();
          }}
          className="rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 font-extrabold px-8 py-3"
        >
          Volver al mapa
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col px-4 py-6">
      <div className="flex items-center justify-between mb-4 max-w-md w-full mx-auto">
        <button onClick={onExit} className="text-slate-400 text-sm">
          ← Salir
        </button>
        <span className="text-sm text-slate-400">
          {world.emoji} {world.name} · {index + 1}/{activities.length}
        </span>
        <CoinBadge coins={coins} />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-4">
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
          <div className="w-full max-w-md rounded-3xl bg-slate-900/80 border border-slate-700 p-8 text-center">
            <p className="text-5xl mb-3">{lastCorrect ? "🎉" : "💪"}</p>
            <p className="text-xl font-bold text-white mb-1">
              {lastCorrect ? "¡Muy bien!" : "¡Seguí practicando!"}
            </p>
            {lastCoinsEarned > 0 && (
              <p className="text-yellow-300 font-semibold mb-4">
                +{lastCoinsEarned} 🪙
              </p>
            )}
            <button
              onClick={handleNext}
              className="mt-4 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 font-extrabold px-8 py-3"
            >
              Siguiente actividad →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
