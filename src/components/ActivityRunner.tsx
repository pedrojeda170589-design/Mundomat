"use client";

import Profe, { type PoseProfe } from "@/components/Profe";
import { profeDelMundo } from "@/lib/mapa/modulos";
import { useEffect, useRef, useState } from "react";
import {
  AVATAR_INFO,
  COINS_BONUS_WORLD_COMPLETE,
  COINS_PER_CORRECT_ANSWER,
  WorldDef,
  getAccessoryById,
  getAccessorySrc,
  getAvatarSrc,
} from "@/types";
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
import PickActivity from "@/components/activities/PickActivity";
import CountActivity from "@/components/activities/CountActivity";
import BuildActivity from "@/components/activities/BuildActivity";
import TraceActivity from "@/components/activities/TraceActivity";
import ListenActivity from "@/components/activities/ListenActivity";
import { festejo } from "@/lib/musica";
import type { PremiosNuevos } from "@/lib/coleccion/premios";
import { LEGENDARIO_MUNDOS, TEMPORADAS } from "@/lib/coleccion/temporadas";
import DictationActivity from "@/components/activities/DictationActivity";
import AssistControls from "@/components/AssistControls";
import CoinBadge from "@/components/CoinBadge";
import Mountains from "@/components/Mountains";
import Seashore from "@/components/Seashore";
import Forest from "@/components/Forest";
import { themeForWorld } from "@/lib/grades";
import Image from "next/image";
import VisualAid from "@/components/activities/VisualAid";
import PitagoricaActivity from "@/components/activities/PitagoricaActivity";
import RepartoActivity from "@/components/activities/RepartoActivity";
import Burst from "@/components/weekend/Burst";

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
    case "pitagorica":
    case "reparto":
      return activity.prompt;
    case "listen":
      return activity.scenes.map((sc) => sc.text).join(" ");
    case "pick":
    case "count":
    case "build":
    case "trace":
      return activity.say ?? activity.prompt;
    case "dictation":
      return activity.say ?? activity.prompt;
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
  // Vuelta del mundo: si quedó una a medias, se retoma desde la primera
  // actividad que falta (mismas actividades); si no, se arma una nueva y se
  // guarda en el servidor. Ver src/lib/vuelta.ts.
  const [activities, setActivities] = useState<ActivitySpec[] | null>(null);
  const [resumedAt, setResumedAt] = useState<number | null>(null);
  const roundId = useRef<string>("");
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<
    "question" | "feedback" | "finishing" | "world-done"
  >("question");
  const [lastCorrect, setLastCorrect] = useState(false);
  const [lastCoinsEarned, setLastCoinsEarned] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [dictationMistakes, setDictationMistakes] = useState<string[]>([]);
  const [premios, setPremios] = useState<PremiosNuevos | null>(null);
  const [attemptOutcome, setAttemptOutcome] =
    useState<WorldMasteryOutcome | null>(null);
  const startTimeRef = useRef<number>(0);
  // Los resultados se guardan "de fondo" (la respuesta se muestra al
  // instante) pero en orden, uno detrás de otro, para no pisarse.
  const saveQueue = useRef<Promise<void>>(Promise.resolve());

  useEffect(() => {
    let alive = true;
    const startNew = () => {
      const fresh = buildActivitiesForWorld(world);
      roundId.current = newClientId();
      const body = JSON.stringify({ code: studentCode, worldId: world.id, roundId: roundId.current, activities: fresh });
      saveQueue.current = saveQueue.current.then(() =>
        fetch("/api/round", { method: "POST", headers: { "Content-Type": "application/json" }, body }).then(
          () => undefined,
          () => undefined
        )
      );
      return fresh;
    };
    (async () => {
      let list: ActivitySpec[] | null = null;
      try {
        const r = await fetch(`/api/round?code=${encodeURIComponent(studentCode)}&worldId=${world.id}`);
        const d = r.ok ? ((await r.json()) as { round: { id: string; activities: ActivitySpec[]; index: number; correctCount: number; mistakes?: string[] } | null }) : null;
        const round = d?.round;
        if (round && alive) {
          roundId.current = round.id;
          list = round.activities;
          setIndex(round.index);
          setCorrectCount(round.correctCount);
          setDictationMistakes(round.mistakes ?? []);
          setResumedAt(round.activities.slice(0, round.index + 1).filter((a) => a.type !== "listen").length);
        }
      } catch {
        // sin red: se empieza una vuelta nueva
      }
      if (!alive) return;
      setActivities(list ?? startNew());
      startTimeRef.current = Date.now();
    })();
    return () => {
      alive = false;
    };
    // Una vez por mundo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [world.id]);

  if (!activities) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
        <p className="text-4xl mb-3 animate-pulse">{world.emoji}</p>
        <p className="text-slate-400">Preparando el mundo...</p>
      </div>
    );
  }

  const list = activities;
  const activity = list[index];
  // El cuento (listen) no cuenta como actividad: el contador muestra solo las preguntas.
  const shownTotal = activities.filter((a) => a.type !== "listen").length;
  const shownIndex = activities.slice(0, index + 1).filter((a) => a.type !== "listen").length;

  function submitResult(correct: boolean) {
    if (!correct && activity.type === "dictation") {
      setDictationMistakes((prev) => [...prev, activity.answer]);
    }
    const timeSpentSeconds = Math.round(
      (Date.now() - startTimeRef.current) / 1000
    );
    setLastCorrect(correct);
    if (correct) setCorrectCount((c) => c + 1);
    setLastCoinsEarned(correct ? COINS_PER_CORRECT_ANSWER : 0);
    setPhase("feedback");
    const payload = JSON.stringify({
      clientId: newClientId(),
      code: studentCode,
      worldId: world.id,
      activityIndex: index,
      roundId: roundId.current,
      ...(!correct && activity.type === "dictation" ? { mistake: activity.answer } : {}),
      correct: correct ? 1 : 0,
      incorrect: correct ? 0 : 1,
      timeSpentSeconds,
      ...(activity.skills?.length ? { skills: activity.skills } : {}),
    });
    saveQueue.current = saveQueue.current.then(async () => {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const res = await fetch("/api/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: payload,
          });
          if (!res.ok) continue;
          const data = await res.json();
          if (data.progress) onCoinsChange(data.progress.coins);
          return;
        } catch {
          // si falla la red, se reintenta una vez y se sigue jugando
        }
      }
    });
  }

  async function finishWorldAttempt(finalCorrectCount: number) {
    setPhase("finishing");
    // Zona de práctica: no es un mundo, no cambia el avance.
    if (world.kind === "refuerzo") {
      await saveQueue.current;
      setAttemptOutcome({ kind: "practice", scorePct: Math.round((finalCorrectCount / Math.max(1, list.length)) * 100) });
      setPhase("world-done");
      return;
    }
    try {
      // Primero terminan de guardarse las respuestas pendientes.
      await saveQueue.current;
      const res = await fetch("/api/world-attempt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: newClientId(),
          code: studentCode,
          worldId: world.id,
          correctCount: finalCorrectCount,
          // El cuento para escuchar no cuenta como actividad con puntaje.
          totalActivities: list.filter((a) => a.type !== "listen").length,
          mistakes: dictationMistakes,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setAttemptOutcome(data.outcome);
        if (data.premios) setPremios(data.premios);
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
    festejo();
    setPhase("world-done");
  }

  function handleNext() {
    if (!activities) return;
    setResumedAt(null);
    // El cuento no se responde: igual se anota que ya lo vio, para retomar después de él.
    if (activity.type === "listen") {
      const body = JSON.stringify({ code: studentCode, worldId: world.id, roundId: roundId.current, skipIndex: index });
      saveQueue.current = saveQueue.current.then(() =>
        fetch("/api/round", { method: "POST", headers: { "Content-Type": "application/json" }, body }).then(
          () => undefined,
          () => undefined
        )
      );
    }
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
        premios={premios}
        onBack={onWorldCompleted}
      />
    );
  }

  return (
    <div className={`relative flex-1 flex flex-col px-4 py-6 overflow-hidden ${themeForWorld(world).nightBg}`}>
      <Scenery world={world} isDay={false} />
      <div className="wood-panel-light relative z-10 flex items-center justify-between mb-4 max-w-md w-full mx-auto rounded-2xl px-4 py-2">
        <button onClick={onExit} className="text-amber-50 text-sm font-semibold">
          ← Salir
        </button>
        <span className="text-sm text-amber-50 font-semibold">
          {world.emoji} {world.name}
          {activity.type !== "listen" && ` · ${shownIndex}/${shownTotal}`}
        </span>
        <CoinBadge coins={coins} />
      </div>
      <div className="relative z-10 max-w-md w-full mx-auto mb-3 flex items-center gap-3">
        <span className="relative w-16 h-16 shrink-0 wk-float">
          <WorldIcon world={world} sizes="64px" />
        </span>
        <span className="flex-1 flex gap-1" aria-label={`Actividad ${shownIndex} de ${shownTotal}`}>
          {activities.map((a, i) => a.type === "listen" ? null : (
            <span
              key={i}
              className={`h-2.5 flex-1 rounded-full ${
                i < index ? "bg-emerald-400" : i === index ? "bg-amber-400 animate-pulse" : "bg-white/25"
              }`}
            />
          ))}
        </span>
      </div>
      {resumedAt !== null && phase === "question" && (
        <div className="relative z-10 max-w-md w-full mx-auto mb-2 text-center bg-emerald-500/20 border border-emerald-400 text-emerald-100 text-sm font-bold rounded-xl px-3 py-1.5 shadow">
          👣 ¡Seguís donde dejaste! Vas por la actividad {resumedAt} de {shownTotal}.
        </div>
      )}
      {(world.id === 28001 || world.id === 38001 || world.category === "dictado") && (
        <div className="relative z-10 max-w-md w-full mx-auto mb-2 text-center bg-amber-500/20 border border-amber-400 text-amber-200 text-xs font-bold rounded-xl px-3 py-1.5 shadow">
          ✍️ ¡Semana de dictado! Si hacés todo bien en el primer intento, ganás 20 🪙 y el Lápiz dorado.
        </div>
      )}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center gap-4">
        {phase === "question" && (
          <>
            {(activity.apoyo || (world.grade !== 1 && !world.storyId && activity.type !== "pitagorica" && activity.type !== "reparto")) && <VisualAid key={`aid-${index}`} activity={activity} world={world} />}
            {activity.type === "pick" && (
              <PickActivity
                key={`pick-${index}`}
                prompt={activity.prompt}
                say={activity.say}
                audio={activity.audio}
                promptBig={activity.promptBig}
                promptEmoji={activity.promptEmoji}
                story={activity.story}
                storyFirst={activity.storyFirst}
                cards={activity.cards}
                answerIds={activity.answerIds}
                onDone={submitResult}
              />
            )}
            {activity.type === "count" && (
              <CountActivity
                key={`count-${index}`}
                prompt={activity.prompt}
                emoji={activity.emoji}
                groups={activity.groups}
                crossed={activity.crossed}
                answer={activity.answer}
                choices={activity.choices}
                onDone={submitResult}
              />
            )}
            {activity.type === "build" && (
              <BuildActivity
                key={`build-${index}`}
                prompt={activity.prompt}
                say={activity.say}
                target={activity.target}
                tiles={activity.tiles}
                emoji={activity.emoji}
                onDone={submitResult}
              />
            )}
            {activity.type === "listen" && (
              <ListenActivity key={`listen-${index}`} title={activity.title} storyId={activity.storyId} mode={activity.mode ?? "listen"} genre={activity.genre} scenes={activity.scenes} voiceCost={activity.voiceCost ?? 0} coins={coins} studentCode={studentCode} onCoinsChange={onCoinsChange} onFinish={handleNext} />
            )}
            {activity.type === "trace" && (
              <TraceActivity key={`trace-${index}`} prompt={activity.prompt} say={activity.say} glyph={activity.glyph} onDone={submitResult} />
            )}
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
            {activity.type === "pitagorica" && (
              <PitagoricaActivity
                key={`pit-${index}`}
                prompt={activity.prompt}
                modo={activity.modo}
                fila={activity.fila}
                columna={activity.columna}
                onDone={submitResult}
              />
            )}
            {activity.type === "reparto" && (
              <RepartoActivity
                key={`rep-${index}`}
                prompt={activity.prompt}
                total={activity.total}
                cajas={activity.cajas}
                objeto={activity.objeto}
                onDone={submitResult}
              />
            )}
            {activity.type === "dictation" && (
              <DictationActivity
                key={`dict-${index}`}
                prompt={activity.prompt}
                say={activity.say}
                answer={activity.answer}
                kind={activity.kind}
                strictAccents={activity.strictAccents}
                grade={world.grade ?? 2}
                onDone={submitResult}
              />
            )}

            {activity.type !== "listen" && activity.type !== "dictation" && (
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
            )}
          </>
        )}

        {phase === "feedback" && (
          <div className="parchment-panel relative w-full max-w-md rounded-3xl p-8 text-center">
            {lastCorrect && <Burst />}
            <div className="flex items-end justify-center gap-2 mb-2">
              <span className="relative block w-24 h-24 wk-float">
                <WorldIcon world={world} sizes="96px" />
              </span>
              <Profe pose={lastCorrect ? profeDelMundo(world) : "animo"} className="w-16 h-24" />
            </div>
            <p className="text-4xl mb-2">{lastCorrect ? "🎉" : "💪"}</p>
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
  premios: PremiosNuevos | null;
  onBack: () => void;
}

// Pantalla final al terminar una vuelta completa del mundo. El contenido
// depende del resultado del sistema de refuerzo (90%): completado (de
// primera o tras la repetición de refuerzo), a un repaso de completar, o a
// fortalecer (a tratar por el docente).
function WorldDoneScreen({ world, outcome, premios, onBack }: WorldDoneScreenProps) {
  let emoji = "🏆";
  let title = `¡Completaste ${world.name}!`;
  let message = "Muy buen trabajo, seguí así.";
  let coinsNote: string | null = null;
  // Pose del profe según cómo le fue.
  let pose: PoseProfe = "aplaude";

  if (outcome?.kind === "dictation") {
    if (outcome.rewardEarned) {
      emoji = "✏️";
      pose = "trofeo";
      title = "¡Semana de Dictado al 100%!";
      message = "¡Increíble! Lograste 100% en tu primer intento semanal.";
      coinsNote = "+20 🪙 de premio y desbloqueaste el «Lápiz dorado» ✏️";
    } else {
      emoji = outcome.scorePct === 100 ? "🌟" : "💪";
      pose = outcome.scorePct === 100 ? "aplaude" : "animo";
      title = `¡Completaste el dictado (${outcome.scorePct}%)!`;
      message =
        outcome.scorePct === 100
          ? "¡Excelente práctica con todas las respuestas correctas!"
          : "¡Buen intento! Repasá las palabras y números para la próxima.";
    }
  } else if (outcome?.kind === "practice") {
    emoji = "🎯";
    title = "¡Buena práctica!";
    message = `Acertaste ${outcome.scorePct}%. Cada práctica te hace más fuerte.`;
  } else if (outcome?.kind === "completed") {
    if (outcome.alreadyCompleted) {
      emoji = "🔁";
      title = `¡Repasaste ${world.name}!`;
      message = "Este mundo ya lo tenías completado — repasarlo siempre suma.";
    } else {
      emoji = "🏆";
      pose = "trofeo";
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
    pose = "animo";
    title = "Necesitás fortalecer este mundo";
    message = `Esta vez lograste ${outcome.scorePct}%. Practicá un poco más y volvé a intentarlo cuando quieras.`;
  }

  return (
    <div className={`relative flex-1 flex flex-col items-center justify-center px-6 py-12 text-center overflow-hidden ${themeForWorld(world).nightBg}`}>
      <Scenery world={world} isDay={false} />
      <div className="parchment-panel relative z-10 rounded-3xl px-8 py-10 max-w-sm w-full mx-4">
        {outcome?.kind === "completed" && <Burst big count={20} />}
        <span className="relative block w-36 h-36 mx-auto mb-2 wk-float">
          <WorldIcon world={world} sizes="144px" />
        </span>
        <div className="flex items-end justify-center gap-2 mb-3">
          <Profe pose={pose} className="w-20 h-28" />
          <p className="text-5xl mb-2">{emoji}</p>
        </div>
        <h2 className="text-2xl font-black text-amber-800 mb-2">{title}</h2>
        <p className="text-amber-950/80 mb-2">{message}</p>
        {coinsNote && (
          <p className="text-amber-700 font-semibold mb-4">{coinsNote}</p>
        )}
        <PremiosGanados premios={premios} />
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

// Identificador único de cada respuesta: si se reenvía (reintento), la
// plataforma no la duplica.
function newClientId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

// Imagen del mundo (isla), según el ambiente de su grado.
function WorldIcon({ world, sizes }: { world: WorldDef; sizes: string }) {
  return <Image src={world.image ?? themeForWorld(world).island(world.id)} alt="" fill sizes={sizes} className="object-contain drop-shadow-lg" />;
}

// Silueta de fondo según el ambiente del grado (montañas, costa, bosque…).
function Scenery({ world, isDay }: { world: WorldDef; isDay: boolean }) {
  const s = themeForWorld(world).scenery;
  if (s === "seashore") return <Seashore isDay={isDay} />;
  if (s === "forest") return <Forest isDay={isDay} />;
  return <Mountains isDay={isDay} />;
}

// Lo que se ganó aprendiendo en esta vuelta: avatar de logro del texto,
// legendario de la temporada, y cuánto falta para el legendario.
function PremiosGanados({ premios }: { premios: PremiosNuevos | null }) {
  if (!premios) return null;
  const avatares = premios.logros.filter((id) => AVATAR_INFO[id]);
  const objetos = [...premios.logros, ...premios.legendarios].filter((id) => getAccessoryById(id));
  const avance = Object.entries(premios.avance).filter(([, n]) => n < LEGENDARIO_MUNDOS);
  if (!avatares.length && !objetos.length && !avance.length) return null;
  return (
    <div className="mt-3 flex flex-col gap-2">
      {avatares.map((id) => (
        <div key={id} className="flex items-center gap-3 rounded-2xl bg-amber-100 border-2 border-amber-400 p-2 text-left">
          <span className="relative w-14 h-14 shrink-0 rounded-xl overflow-hidden bg-sky-200">
            <Image src={getAvatarSrc(id)} alt="" fill sizes="56px" className="object-cover" />
          </span>
          <p className="text-sm font-black text-amber-900">🏆 ¡Desbloqueaste el avatar «{AVATAR_INFO[id].label}»! Elegilo en tu perfil.</p>
        </div>
      ))}
      {objetos.map((id) => {
        const def = getAccessoryById(id)!;
        return (
          <div key={id} className="flex items-center gap-3 rounded-2xl bg-violet-100 border-2 border-violet-400 p-2 text-left">
            <span className="relative w-14 h-14 shrink-0">
              <Image src={getAccessorySrc(id)} alt="" fill sizes="56px" className="object-contain" />
            </span>
            <p className="text-sm font-black text-violet-900">
              {def.legendarioDe ? "👑 ¡Ganaste el legendario" : "🎁 ¡Ganaste"} «{def.label}»!
            </p>
          </div>
        );
      })}
      {avance.map(([t, n]) => {
        const temp = TEMPORADAS.find((x) => x.id === t);
        if (!temp?.legendario || !getAccessoryById(temp.legendario.id)) return null;
        return (
          <p key={t} className="text-xs font-bold text-violet-800">
            👑 {temp.emoji} Legendario «{temp.legendario.label}»: {n} de {LEGENDARIO_MUNDOS} mundos superados esta temporada.
          </p>
        );
      })}
    </div>
  );
}
