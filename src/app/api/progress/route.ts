import { NextRequest, after } from "next/server";
import { recordActivityResult } from "@/lib/platform/server";
import { findStudentByCode, getProgress, liteProgress, saveProgress, syncStudentWithPlatform } from "@/lib/data";
import { applyActivityResult } from "@/lib/progressLogic";
import { collectActiveSeasonalRewards } from "@/lib/seasons";
import { isTrialExpired } from "@/lib/openClassroomShared";
import { ActivityResult } from "@/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  if (!code) {
    return Response.json({ error: "Falta el código." }, { status: 400 });
  }
  // Al entrar/cargar el mapa: se actualiza el aula actual del alumno según
  // la plataforma (promociones, cambios de aula) antes de responder.
  const student = (await syncStudentWithPlatform(code)) ?? (await findStudentByCode(code));
  if (!student) {
    return Response.json({ error: "Código no encontrado." }, { status: 404 });
  }
  if (isTrialExpired(student)) {
    return Response.json({ trialExpired: true, student, error: "Tu período de prueba terminó." }, { status: 403 });
  }
  const progress = await getProgress(student.code);
  // ?lite=1 (pantallas del alumno): sin el registro detallado de
  // actividades, que solo usa el docente. La respuesta es mucho más chica.
  if (searchParams.get("lite")) {
    return Response.json({ student, progress: liteProgress(progress) });
  }
  return Response.json({ student, progress });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { code, worldId, activityIndex, correct, incorrect, timeSpentSeconds, clientId } =
    body as {
      clientId?: string;
      code?: string;
      worldId?: number;
      activityIndex?: number;
      correct?: number;
      incorrect?: number;
      timeSpentSeconds?: number;
    };

  if (!code || worldId === undefined || activityIndex === undefined) {
    return Response.json({ error: "Datos incompletos." }, { status: 400 });
  }

  const student = await findStudentByCode(code);
  if (!student) {
    return Response.json({ error: "Código no encontrado." }, { status: 404 });
  }
  if (isTrialExpired(student)) {
    return Response.json({ error: "Tu período de prueba terminó.", trialExpired: true }, { status: 403 });
  }

  const progress = await getProgress(student.code);
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
    result
  );
  // Jugar durante una estación o festividad entrega sus premios de
  // temporada (accesorios y fondo), que quedan para siempre.
  const { progress: updated, newRewards } =
    collectActiveSeasonalRewards(afterActivity, new Date(), student.birthday);
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

  return Response.json({ progress: liteProgress(updated), coinsEarned, newRewards });
}

function validClientId(id: unknown): string | null {
  return typeof id === "string" && /^[A-Za-z0-9-]{8,80}$/.test(id) ? id : null;
}
