import {
  ActivityResult,
  StudentProgress,
  TOTAL_ACTIVITIES_PER_WORLD,
  WORLD_MASTERY_THRESHOLD_PCT,
  COINS_PER_CORRECT_ANSWER,
  COINS_BONUS_WORLD_COMPLETE,
} from "@/types";

export interface ApplyResultOutcome {
  progress: StudentProgress;
  coinsEarned: number;
}

// Registra el resultado de UNA actividad (se llama en cada pregunta). Ya no
// completa mundos acá: eso lo decide el intento completo, en
// applyWorldAttempt (ver más abajo) — sistema de refuerzo por 90%.
export function applyActivityResult(
  progress: StudentProgress,
  result: ActivityResult
): ApplyResultOutcome {
  const activityLog = [...progress.activityLog, result];

  let coinsEarned = 0;
  if (result.correct > 0) {
    coinsEarned += COINS_PER_CORRECT_ANSWER;
  }

  const updated: StudentProgress = {
    ...progress,
    activityLog,
    coins: progress.coins + coinsEarned,
    lastPlayedAt: new Date().toISOString(),
  };

  return { progress: updated, coinsEarned };
}

export type WorldMasteryOutcome =
  | { kind: "completed"; alreadyCompleted: boolean }
  | { kind: "pending-retry"; scorePct: number }
  | { kind: "needs-review"; scorePct: number };

export interface ApplyWorldAttemptOutcome {
  progress: StudentProgress;
  outcome: WorldMasteryOutcome;
  coinsEarned: number;
}

// Se llama cuando el alumno termina una vuelta completa de un mundo (las 10
// actividades respondidas). Sistema de refuerzo:
// - Si el mundo ya estaba completado, esta vuelta es solo repaso: no cambia
//   nada (el alumno puede repetir mundos completados las veces que quiera).
// - Si el mundo estaba esperando la repetición de refuerzo (ya había
//   llegado al 90%+ antes), esta vuelta lo completa, sea cual sea el
//   puntaje de esta vez.
// - Si en esta vuelta llega al 90% o más, queda "a un repaso de completar".
// - Si no llega al 90%, queda "a fortalecer" / a tratar por el docente,
//   pero el alumno puede seguir intentando cuando quiera.
export function applyWorldAttempt(
  progress: StudentProgress,
  worldId: number,
  correctCount: number,
  totalActivities: number = TOTAL_ACTIVITIES_PER_WORLD
): ApplyWorldAttemptOutcome {
  const total = Math.max(1, totalActivities);
  const clampedCorrect = Math.min(Math.max(correctCount, 0), total);
  const scorePct = Math.round((clampedCorrect / total) * 100);

  if (progress.completedWorlds.includes(worldId)) {
    return {
      progress,
      outcome: { kind: "completed", alreadyCompleted: true },
      coinsEarned: 0,
    };
  }

  const pendingRetry = new Set(progress.worldsPendingReinforcementRetry ?? []);
  const needsReview = new Set(progress.worldsNeedingTeacherReview ?? []);
  const lastWorldAttemptScore = {
    ...(progress.lastWorldAttemptScore ?? {}),
    [worldId]: scorePct,
  };

  let outcome: WorldMasteryOutcome;
  let coinsEarned = 0;
  let completedWorlds = progress.completedWorlds;

  if (pendingRetry.has(worldId)) {
    // Ya había llegado al 90%+ antes: esta repetición de refuerzo alcanza
    // para completarlo, sin importar el puntaje de esta vuelta.
    pendingRetry.delete(worldId);
    needsReview.delete(worldId);
    completedWorlds = [...progress.completedWorlds, worldId].sort(
      (a, b) => a - b
    );
    coinsEarned = COINS_BONUS_WORLD_COMPLETE;
    outcome = { kind: "completed", alreadyCompleted: false };
  } else if (scorePct >= WORLD_MASTERY_THRESHOLD_PCT) {
    needsReview.delete(worldId);
    pendingRetry.add(worldId);
    outcome = { kind: "pending-retry", scorePct };
  } else {
    pendingRetry.delete(worldId);
    needsReview.add(worldId);
    outcome = { kind: "needs-review", scorePct };
  }

  const updated: StudentProgress = {
    ...progress,
    completedWorlds,
    coins: progress.coins + coinsEarned,
    worldsPendingReinforcementRetry: Array.from(pendingRetry).sort(
      (a, b) => a - b
    ),
    worldsNeedingTeacherReview: Array.from(needsReview).sort((a, b) => a - b),
    lastWorldAttemptScore,
    lastPlayedAt: new Date().toISOString(),
  };

  return { progress: updated, outcome, coinsEarned };
}

export interface StudentStats {
  totalCorrect: number;
  totalIncorrect: number;
  accuracyPct: number;
  totalTimeSeconds: number;
  worldsCompleted: number;
  strengths: string[];
  toImprove: string[];
}

export function computeStudentStats(
  progress: StudentProgress,
  worldNameById: (id: number) => string
): StudentStats {
  const totalCorrect = progress.activityLog.reduce((s, r) => s + r.correct, 0);
  const totalIncorrect = progress.activityLog.reduce(
    (s, r) => s + r.incorrect,
    0
  );
  const totalAttempts = totalCorrect + totalIncorrect;
  const accuracyPct =
    totalAttempts === 0 ? 0 : Math.round((totalCorrect / totalAttempts) * 100);
  const totalTimeSeconds = progress.activityLog.reduce(
    (s, r) => s + r.timeSpentSeconds,
    0
  );

  // Fortalezas / a reforzar por mundo, según precisión relativa.
  const perWorld = new Map<number, { correct: number; incorrect: number }>();
  for (const r of progress.activityLog) {
    const cur = perWorld.get(r.worldId) ?? { correct: 0, incorrect: 0 };
    cur.correct += r.correct;
    cur.incorrect += r.incorrect;
    perWorld.set(r.worldId, cur);
  }
  const strengths: string[] = [];
  const toImprove: string[] = [];
  for (const [worldId, s] of perWorld.entries()) {
    const total = s.correct + s.incorrect;
    if (total < 2) continue;
    const acc = s.correct / total;
    const name = worldNameById(worldId);
    if (acc >= 0.8) strengths.push(name);
    else if (acc <= 0.5) toImprove.push(name);
  }

  return {
    totalCorrect,
    totalIncorrect,
    accuracyPct,
    totalTimeSeconds,
    worldsCompleted: progress.completedWorlds.length,
    strengths,
    toImprove,
  };
}
