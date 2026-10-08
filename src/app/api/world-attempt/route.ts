import { gradeOfWorld } from "@/lib/grades";
import { NextRequest, after } from "next/server";
import { recordAchievement, recordWorldAttempt } from "@/lib/platform/server";
import { getMedalTier } from "@/lib/medals";
import { findStudentByCode, getProgress, saveProgress, liteProgress, isDictationWorld, applyDictationWorldAttempt, companerosParaNombres } from "@/lib/data";
import { applyWorldAttempt } from "@/lib/progressLogic";
import { esSemanaDeDictado } from "@/lib/dictado/banco";
import { terminarVuelta } from "@/lib/vuelta";
import { aplicarPremiosDeMundo } from "@/lib/coleccion/premios";
import { reclamarCamino } from "@/lib/coleccion/racha";
import { getWorld } from "@/lib/worlds";
import { masteryPctForWorld } from "@/lib/grades";
import { TOTAL_ACTIVITIES_PER_WORLD } from "@/types";
import { addNews, newsForWorldProgress } from "@/lib/news";
import { isOpenClassroomStudent, isTrialExpired } from "@/lib/openClassroomShared";
import { endTrialNow, isTrialWorldBlocked, trialAllSubjectsDone } from "@/lib/openClassroom";
import { getEnabledWorldIdsFor, mundoHabilitadoPara } from "@/lib/data";
import { resolveDisplayNames } from "@/lib/studentNames";

import { checkCodeRateLimit, codigoDe, getClientIp, recordFailedCodeAttempt } from "@/lib/rateLimit";

// POST: el alumno terminó una vuelta completa de un mundo (las 10
// actividades respondidas). Acá se decide, según el sistema de refuerzo del
// 90%, si el mundo queda completado, "a un repaso de completar" o "a
// fortalecer" (a tratar por el docente).
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rateLimit = await checkCodeRateLimit(ip, await codigoDe(request));
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

  // Un mundo que el docente bloqueó no suma (aunque alguien lo abra a mano).
  if (!(await mundoHabilitadoPara(student, worldId))) {
    return Response.json({ error: "Este mundo no está habilitado.", disabled: true }, { status: 403 });
  }

  // La vuelta terminó: ya no hay nada que retomar en este mundo.
  const progress = terminarVuelta(await getProgress(student.code), worldId);
  const isTrial = isOpenClassroomStudent(student);
  if (isTrial && isTrialWorldBlocked(progress, worldId)) {
    return Response.json({ error: "En la prueba se pueden superar hasta 5 mundos por materia.", trialLimit: true }, { status: 403 });
  }

  if (isDictationWorld(worldId)) {
    // Fuera de la semana de dictado el mundo está apagado: no se acredita nada.
    if (!esSemanaDeDictado(new Date(), gradeOfWorld(worldId))) {
      return Response.json({ error: "El Mundo del Dictado vuelve la semana que viene." }, { status: 403 });
    }
    // La vuelta siempre tiene 10 dictados: no se confía en el total que manda el navegador.
    const total = 10;
    const ok = Math.max(0, Math.min(total, Math.floor(Number(correctCount) || 0)));
    const errores = (Array.isArray(mistakes) ? mistakes : [])
      .filter((m): m is string => typeof m === "string")
      .slice(0, total)
      .map((m) => m.slice(0, 80));
    const { progress: updated, rewardEarned, bonusCoins, lapizUnlocked } = applyDictationWorldAttempt(
      progress,
      worldId,
      ok,
      total,
      errores
    );
    await saveProgress(updated);
    const scorePct = Math.round((ok / total) * 100);
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

  const { progress: afterAttempt, outcome, coinsEarned } = applyWorldAttempt(
    progress,
    worldId,
    correctCount,
    totalActivities ?? TOTAL_ACTIVITIES_PER_WORLD,
    masteryPctForWorld(worldId)
  );
  // Premios que se ganan aprendiendo: avatar de logro del texto (90 %+) y
  // avance hacia el legendario de la temporada.
  const totalVuelta = Math.max(1, totalActivities ?? TOTAL_ACTIVITIES_PER_WORLD);
  const pct = Math.round((Math.min(correctCount, totalVuelta) / totalVuelta) * 100);
  const { progress: afterPremios, premios } = aplicarPremiosDeMundo(afterAttempt, worldId, pct, getWorld(worldId)?.storyId);
  // Mundos superados también avanzan el camino de premios (nodos 🏆).
  const { progress: updated } = reclamarCamino(afterPremios);
  await saveProgress(updated);
  // Aula de prueba: si ya superó los mundos de todas las materias, la prueba
  // termina (al volver al mapa ve su informe final).
  let trialFinished = false;
  if (isTrial && trialAllSubjectsDone(updated, await getEnabledWorldIdsFor(student))) {
    await endTrialNow(student);
    trialFinished = true;
  }
  // Pizarrón de novedades: mundo completado / medalla nueva.
  // (Los nombres repetidos se resuelven solo si hay algo para publicar.)
  if (newsForWorldProgress(student, progress, updated).length) {
    const resolvedNames = resolveDisplayNames(await companerosParaNombres(student));
    await addNews(
      newsForWorldProgress(student, progress, updated, resolvedNames.get(student.code)),
      student.classroomId
    );
  }

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

  return Response.json({ progress: liteProgress(updated), outcome, coinsEarned, trialFinished, premios });
}
