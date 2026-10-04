import { NextRequest, after } from "next/server";
import { recordActivityResult } from "@/lib/platform/server";
import { findStudentByCode, getProgress, liteProgress, saveProgress, syncStudentWithPlatform } from "@/lib/data";
import { applyActivityResult } from "@/lib/progressLogic";
import { collectActiveSeasonalRewards } from "@/lib/seasons";
import { isOpenClassroomStudent, isTrialExpired } from "@/lib/openClassroomShared";
import { closeTrialIfExpired, isTrialWorldBlocked } from "@/lib/openClassroom";
import { ActivityResult } from "@/types";
import { avanzarVuelta } from "@/lib/vuelta";
import { reclamarCamino, registrarRespuesta } from "@/lib/coleccion/racha";

import { checkCodeRateLimit, codigoDe, getClientIp, recordFailedCodeAttempt, recordSuccessfulCodeAttempt } from "@/lib/rateLimit";
import { proposeDisplayName } from "@/lib/studentNames";

export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  const rateLimit = await checkCodeRateLimit(ip, await codigoDe(request));
  if (rateLimit.blocked) {
    return Response.json(
      { error: "Demasiados intentos fallidos. Esperá unos minutos y probá de nuevo.", blocked: true },
      { status: 429 }
    );
  }

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  if (!code) {
    return Response.json({ error: "Falta el código." }, { status: 400 });
  }
  // Al entrar/cargar el mapa: se actualiza el aula actual del alumno según
  // la plataforma (promociones, cambios de aula) antes de responder.
  const student = (await syncStudentWithPlatform(code)) ?? (await findStudentByCode(code));
  if (!student) {
    await recordFailedCodeAttempt(ip);
    return Response.json({ error: "Código no encontrado." }, { status: 404 });
  }
  await recordSuccessfulCodeAttempt(ip, student.code);

  if (isTrialExpired(student)) {
    // Primera vez después del vencimiento: se guarda el informe final y se
    // borra el historial de juego.
    const report = await closeTrialIfExpired(student);
    return Response.json({ trialExpired: true, student, report, error: "Tu período de prueba terminó." }, { status: 403 });
  }
  const progress = await getProgress(student.code);
  // ?lite=1 (pantallas del alumno): sin el registro detallado de
  // actividades, que solo usa el docente. Por privacidad, solo expone el nombre para mostrar.
  if (searchParams.get("lite")) {
    const safeStudent = {
      ...student,
      name: student.displayName?.trim() || proposeDisplayName(student.name) || student.name,
    };
    return Response.json({ student: safeStudent, progress: liteProgress(progress) });
  }
  return Response.json({ student, progress });
}

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
  const { code, worldId, activityIndex, correct, incorrect, timeSpentSeconds, clientId, roundId, mistake } =
    body as {
      roundId?: string; // vuelta en curso (para retomar el mundo donde se dejó)
      mistake?: string; // en dictados: lo que había que escribir
      clientId?: string;
      code?: string;
      worldId?: number;
      activityIndex?: number;
      correct?: number;
      incorrect?: number;
      timeSpentSeconds?: number;
      skills?: string[];
    };

  if (!code || worldId === undefined || activityIndex === undefined) {
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
  if (isOpenClassroomStudent(student) && typeof worldId === "number" && isTrialWorldBlocked(progress, worldId)) {
    return Response.json({ error: "En la prueba se pueden superar hasta 5 mundos por materia.", trialLimit: true }, { status: 403 });
  }
  const result: ActivityResult = {
    worldId,
    activityIndex,
    correct: correct ?? 0,
    incorrect: incorrect ?? 0,
    timeSpentSeconds: timeSpentSeconds ?? 0,
    finishedAt: new Date().toISOString(),
  };

  const { progress: afterActivity, coinsEarned } = applyActivityResult(
    progress,
    result,
    Array.isArray(body.skills) ? body.skills.filter((x: unknown): x is string => typeof x === "string") : []
  );
  // Jugar durante una estación o festividad entrega sus premios de
  // temporada (accesorios y fondo), que quedan para siempre.
  const { progress: afterRewards, newRewards } =
    collectActiveSeasonalRewards(afterActivity, new Date(), student.birthday);
  const afterRound = avanzarVuelta(
    afterRewards,
    worldId,
    roundId,
    activityIndex,
    (correct ?? 0) > 0,
    typeof mistake === "string" ? mistake : undefined
  );
  // Racha de estudio: cuenta la respuesta del día y entrega los premios del camino.
  const { progress: updated, nuevos: camino } = reclamarCamino(registrarRespuesta(afterRound, (correct ?? 0) > 0));
  await saveProgress(updated);
  // Historial académico en la plataforma (después de responder: no demora
  // el juego). `clientId` evita duplicar la misma respuesta.
  after(() =>
    recordActivityResult({
      code: student.code,
      clientId: validClientId(clientId) ?? `${student.code}-${worldId}-${activityIndex}-${Date.now()}`,
      worldId,
      activityIndex,
      correct: result.correct,
      incorrect: result.incorrect,
      timeSpentSeconds: result.timeSpentSeconds,
      occurredAt: result.finishedAt,
    })
  );

  return Response.json({ progress: liteProgress(updated), coinsEarned, newRewards, camino: camino.map((n) => n.id) });
}

function validClientId(id: unknown): string | null {
  return typeof id === "string" && /^[A-Za-z0-9-]{8,80}$/.test(id) ? id : null;
}
