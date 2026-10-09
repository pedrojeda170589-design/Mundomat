import { Student, StudentProgress, WorldDef, WorldSubject } from "@/types";
import { getWorld, WORLDS } from "@/lib/worlds";
import { GRADE1_WORLDS } from "@/lib/grade1/worlds";
import { GRADE2_WORLDS } from "@/lib/grade2/worlds";
import { GRADE4_WORLDS } from "@/lib/grade4/worlds";
import { DEFAULT_GRADE, getGrade, masteryPctForWorld } from "@/lib/grades";

export interface StudentWorldSummary {
  worldId: number;
  played: boolean;
  bestScore: number;
  vueltas: number;
  status: "mastered" | "in_progress" | "needs_help" | "unplayed";
}

export interface HardestWorldMetric {
  worldId: number;
  name: string;
  emoji: string;
  subject: WorldSubject;
  averageScore: number;
  playersCount: number;
}

export interface StudentHelpPriority {
  student: Student;
  redWorldsCount: number;
  redWorldNames: string[];
  redWorldIds?: number[];
  daysInactive: number | null;
  lastPlayedAt: string | null;
  reasons: string[];
  priorityScore: number;
}

export interface ClassroomMetrics {
  averageAccuracy: number;
  activeThisWeek: { count: number; total: number; pct: number };
  hardestWorlds: HardestWorldMetric[];
  totalActivitiesCount: number;
}

export function getMasteryThreshold(grade: number | undefined): number {
  return getGrade(grade ?? DEFAULT_GRADE).masteryPct;
}

export function getStudentWorldSummary(
  student: Student,
  progress: StudentProgress | undefined,
  worldId: number
): StudentWorldSummary {
  if (!progress) {
    return {
      worldId,
      played: false,
      bestScore: 0,
      vueltas: 0,
      status: "unplayed",
    };
  }

  const summary = progress.activitySummary?.[worldId];
  const inLog = progress.activityLog?.filter((a) => a.worldId === worldId) ?? [];
  const answered = (summary?.correct ?? 0) + (summary?.incorrect ?? 0) + inLog.length;

  const isCompleted = progress.completedWorlds?.includes(worldId) ?? false;
  const isPendingRetry = progress.worldsPendingReinforcementRetry?.includes(worldId) ?? false;
  const isNeedingReview = progress.worldsNeedingTeacherReview?.includes(worldId) ?? false;
  const lastScore = progress.lastWorldAttemptScore?.[worldId];
  const bestStored = progress.bestWorldScore?.[worldId];

  const played =
    answered > 0 ||
    isCompleted ||
    isPendingRetry ||
    isNeedingReview ||
    lastScore !== undefined ||
    bestStored !== undefined;

  if (!played) {
    return {
      worldId,
      played: false,
      bestScore: 0,
      vueltas: 0,
      status: "unplayed",
    };
  }

  const threshold = masteryPctForWorld(worldId);
  let best = bestStored ?? lastScore ?? 0;

  if (isCompleted || isPendingRetry) {
    best = Math.max(best, threshold);
  }

  if (answered > 0) {
    const correct =
      (summary?.correct ?? 0) + inLog.filter((a) => a.correct > 0).length;
    const calc = Math.round((correct / answered) * 100);
    best = Math.max(best, calc);
  }

  best = Math.min(100, Math.max(0, best));
  const vueltas = Math.max(1, Math.round(answered / 10));

  let status: StudentWorldSummary["status"];
  if (best >= threshold) {
    status = "mastered";
  } else if (best >= 50) {
    status = "in_progress";
  } else {
    status = "needs_help";
  }

  return {
    worldId,
    played: true,
    bestScore: best,
    vueltas,
    status,
  };
}

export function computeClassroomMetrics(
  students: Student[],
  progressMap: Record<string, StudentProgress>,
  worldIdsToCheck: number[]
): ClassroomMetrics {
  let totalCorrect = 0;
  let totalAttempts = 0;

  for (const s of students) {
    const p = progressMap[s.code];
    if (!p) continue;

    for (const sum of Object.values(p.activitySummary ?? {})) {
      totalCorrect += sum.correct;
      totalAttempts += sum.correct + sum.incorrect;
    }
    for (const log of p.activityLog ?? []) {
      totalCorrect += log.correct;
      totalAttempts += log.correct + log.incorrect;
    }
  }

  const averageAccuracy =
    totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  const now = Date.now();
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  let activeCount = 0;

  for (const s of students) {
    const p = progressMap[s.code];
    if (p?.lastPlayedAt) {
      const diff = now - new Date(p.lastPlayedAt).getTime();
      if (diff >= 0 && diff <= sevenDaysMs) {
        activeCount++;
      }
    }
  }

  const activeThisWeek = {
    count: activeCount,
    total: students.length,
    pct: students.length > 0 ? Math.round((activeCount / students.length) * 100) : 0,
  };

  const hardestWorlds: HardestWorldMetric[] = [];
  const checkedWorldIds = Array.from(new Set(worldIdsToCheck));

  for (const worldId of checkedWorldIds) {
    const world = getWorld(worldId);
    if (!world) continue;

    const scores: number[] = [];
    for (const s of students) {
      const summary = getStudentWorldSummary(s, progressMap[s.code], worldId);
      if (summary.played) {
        scores.push(summary.bestScore);
      }
    }

    if (scores.length >= 3) {
      const avg = Math.round(
        scores.reduce((sum, score) => sum + score, 0) / scores.length
      );
      hardestWorlds.push({
        worldId,
        name: world.name,
        emoji: world.emoji,
        subject: world.subject,
        averageScore: avg,
        playersCount: scores.length,
      });
    }
  }

  hardestWorlds.sort((a, b) => a.averageScore - b.averageScore);

  return {
    averageAccuracy,
    activeThisWeek,
    hardestWorlds: hardestWorlds.slice(0, 3),
    totalActivitiesCount: totalAttempts,
  };
}

export function computeStudentsNeedingHelp(
  students: Student[],
  progressMap: Record<string, StudentProgress>,
  enabledWorldIds: number[],
  now = Date.now()
): StudentHelpPriority[] {
  const result: StudentHelpPriority[] = [];
  const oneDayMs = 24 * 60 * 60 * 1000;

  for (const student of students) {
    const p = progressMap[student.code];
    const redWorldNames: string[] = [];
    const redWorldIds: number[] = [];

    for (const wId of enabledWorldIds) {
      const summary = getStudentWorldSummary(student, p, wId);
      if (summary.played && summary.status === "needs_help") {
        const w = getWorld(wId);
        redWorldNames.push(w?.name ?? `Mundo ${wId}`);
        redWorldIds.push(wId);
      }
    }

    let daysInactive: number | null = null;
    let lastPlayedAt: string | null = null;
    if (p?.lastPlayedAt) {
      lastPlayedAt = p.lastPlayedAt;
      const diff = now - new Date(p.lastPlayedAt).getTime();
      daysInactive = Math.max(0, Math.floor(diff / oneDayMs));
    }

    const reasons: string[] = [];
    if (redWorldNames.length > 0) {
      reasons.push(
        `${redWorldNames.length} ${
          redWorldNames.length === 1 ? "mundo en rojo" : "mundos en rojo"
        }`
      );
    }

    if (daysInactive === null) {
      reasons.push("Sin actividad registrada");
    } else if (daysInactive >= 7) {
      reasons.push(`No juega hace ${daysInactive} días`);
    }

    if (reasons.length > 0) {
      const priorityScore =
        redWorldNames.length * 10 +
        (daysInactive === null
          ? 5
          : daysInactive >= 7
          ? Math.min(daysInactive, 30)
          : 0);

      result.push({
        student,
        redWorldsCount: redWorldNames.length,
        redWorldNames,
        redWorldIds,
        daysInactive,
        lastPlayedAt,
        reasons,
        priorityScore,
      });
    }
  }

  result.sort((a, b) => b.priorityScore - a.priorityScore);
  return result;
}

export function getWorldsForGrade(grade: number | undefined): WorldDef[] {
  if (grade === 1) return GRADE1_WORLDS;
  if (grade === 2) return GRADE2_WORLDS;
  if (grade === 4) return GRADE4_WORLDS;
  return WORLDS;
}
