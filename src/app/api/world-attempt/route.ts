import { NextRequest, after } from "next/server";
import { recordAchievement, recordWorldAttempt } from "@/lib/platform/server";
import { getMedalTier } from "@/lib/medals";
import { findStudentByCode, getProgress, saveProgress, liteProgress, isDictationWorld, applyDictationWorldAttempt } from "@/lib/data";
import { applyWorldAttempt } from "@/lib/progressLogic";
import { masteryPctForWorld } from "@/lib/grades";
import { TOTAL_ACTIVITIES_PER_WORLD } from "@/types";
import { addNews, newsForWorldProgress } from "@/lib/news";
import { isOpenClassroomStudent, isTrialExpired } from "@/lib/openClassroomShared";
import { endTrialNow, isTrialWorldBlocked, trialAllSubjectsDone } from "@/lib/openClassroom";
import { getEnabledWorldIdsFor } from "@/lib/data";

import { checkCodeRateLimit, getClientIp, recordFailedCodeAttempt } from "@/lib/rateLimit";

// POST: el alumno terminó una vuelta completa de un mundo (las 10
// actividades respondidas). Acá se decide, según el sistema de refuerzo del
// 90%, si el mundo queda completado, "a un repaso de completar" o "a
// fortalecer" (a tratar por el docente).
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rateLimit = await checkCodeRateLimit(ip);
  if (rateLimit.blocked) {
    return Response.json(
      { error: "Demasiados intentos fallidos. Esperá unos minutos y probá de nuevo.", blocked: true },
      { status: 429 }
    );
  }

  const body = await request.json();
  const { code, worldId, correctCount, totalActivities, clientId, mistakes } = body as {
    clientId?: string;
    code?: string;
    worldId?: number;
    correctCount?: number;
    totalActivities?: number;
    mistakes?: string[];
  };

  if (!code || worldId === undefined || correctCount === undefined) {
    return Response.json({ error: "Datos incompletos." }, { status: 400 });
  }

  const student = await findStudentByCode(code);
  if (!student) {
    await recordFailedCodeAttempt(ip);
    return Response.json({ error: "Código no encontrado." }, { status: 404 });
  }
  if (isTrialExpired(student)) {
    return Response.json({ error: "Tu período de prueba terminó.", trialExpired: true }, { status: 403 });
  }

  const progress = await getProgress(student.code);
  const isTrial = isOpenClassroomStudent(student);
  if (isTrial && isTrialWorldBlocked(progress, worldId)) {
    return Response.json({ error: "En la prueba se pueden superar hasta 5 mundos por materia.", trialLimit: true }, { status: 403 });
  }

  if (isDictationWorld(worldId)) {
    const total = totalActivities ?? 10;
    const { progress: updated, rewardEarned, bonusCoins, lapizUnlocked } = applyDictationWorldAttempt(
      progress,
      worldId,
      correctCount,
      total,
      mistakes ?? []
    );
    await saveProgress(updated);
    const scorePct = Math.round((Math.min(correctCount, total) / Math.max(1, total)) * 100);
    const outcome = {
      kind: "dictation" as const,
      scorePct,
      rewardEarned,
      lapizUnlocked,
    };
    return Response.json({
      progress: liteProgress(updated),
      outcome,
      coinsEarned: bonusCoins,
      trialFinished: false,
    });
  }

  const { progress: updated, outcome, coinsEarned } = applyWorldAttempt(
    progress,
    worldId,
    correctCount,
    totalActivities ?? TOTAL_ACTIVITIES_PER_WORLD,
    masteryPctForWorld(worldId)
  );
  await saveProgress(updated);
  // Aula de prueba: si ya superó los mundos de todas las materias, la prueba
  // termina (al volver al mapa ve su informe final).
  let trialFinished = false;
  if (isTrial && trialAllSubjectsDone(updated, await getEnabledWorldIdsFor(student))) {
    await endTrialNow(student);
    trialFinished = true;
  }
  // Pizarrón de novedades: mundo completado / medalla nueva.
  await addNews(newsForWorldProgress(student, progress, updated), student.classroomId);

  // Historial académico en la plataforma.
  const total = totalActivities ?? TOTAL_ACTIVITIES_PER_WORLD;
  after(async () => {
    const newlyCompleted = outcome.kind === "completed" && !outcome.alreadyCompleted;
    await recordWorldAttempt({
      code: student.code,
      clientId:
        typeof clientId === "string" && /^[A-Za-z0-9-]{8,80}$/.test(clientId)
          ? clientId
          : `${student.code}-w${worldId}-${Date.now()}`,
      worldId,
      correctCount,
      total,
      scorePct: Math.round((Math.min(correctCount, total) / Math.max(1, total)) * 100),
      outcome: outcome.kind === "completed" && outcome.alreadyCompleted ? "review" : outcome.kind,
      worldStatus:
        outcome.kind === "completed"
          ? "completed"
          : outcome.kind === "pending-retry"
            ? "pending_retry"
            : "needs_review",
      newlyCompleted,
    });
    const tier = getMedalTier(updated.completedWorlds.length);
    if (newlyCompleted && tier !== getMedalTier(progress.completedWorlds.length) && tier !== "ninguna") {
      await recordAchievement(student.code, "medalla", tier);
    }
  });

  return Response.json({ progress: liteProgress(updated), outcome, coinsEarned, trialFinished });
}
