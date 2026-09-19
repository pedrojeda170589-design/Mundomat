import {
  ActivityResult,
  StudentProgress,
  TOTAL_ACTIVITIES_PER_WORLD,
  COINS_PER_CORRECT_ANSWER,
  COINS_BONUS_WORLD_COMPLETE,
} from "@/types";

// Un mundo se considera completado cuando el alumno tiene al menos un
// intento correcto registrado para cada una de las 10 actividades.
export function computeCompletedWorldIds(log: ActivityResult[]): number[] {
  const byWorld = new Map<number, Set<number>>();
  for (const r of log) {
    if (r.correct > 0) {
      if (!byWorld.has(r.worldId)) byWorld.set(r.worldId, new Set());
      byWorld.get(r.worldId)!.add(r.activityIndex);
    }
  }
  const completed: number[] = [];
  for (const [worldId, activitiesDone] of byWorld.entries()) {
    if (activitiesDone.size >= TOTAL_ACTIVITIES_PER_WORLD) completed.push(worldId);
  }
  return completed.sort((a, b) => a - b);
}

export interface ApplyResultOutcome {
  progress: StudentProgress;
  coinsEarned: number;
  worldJustCompleted: boolean;
}

export function applyActivityResult(
  progress: StudentProgress,
  result: ActivityResult
): ApplyResultOutcome {
  const wasCompletedBefore = new Set(progress.completedWorlds);

  const activityLog = [...progress.activityLog, result];
  const completedWorlds = computeCompletedWorldIds(activityLog);

  let coinsEarned = 0;
  if (result.correct > 0) {
    coinsEarned += COINS_PER_CORRECT_ANSWER;
  }
  const worldJustCompleted =
    completedWorlds.includes(result.worldId) &&
    !wasCompletedBefore.has(result.worldId);
  if (worldJustCompleted) {
    coinsEarned += COINS_BONUS_WORLD_COMPLETE;
  }

  const updated: StudentProgress = {
    ...progress,
    activityLog,
    completedWorlds,
    coins: progress.coins + coinsEarned,
    lastPlayedAt: new Date().toISOString(),
  };

  return { progress: updated, coinsEarned, worldJustCompleted };
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
