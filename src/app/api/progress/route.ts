import { NextRequest } from "next/server";
import { findStudentByCode, getProgress, saveProgress } from "@/lib/data";
import { applyActivityResult } from "@/lib/progressLogic";
import { collectActiveSeasonalRewards } from "@/lib/seasons";
import { ActivityResult } from "@/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  if (!code) {
    return Response.json({ error: "Falta el código." }, { status: 400 });
  }
  const student = await findStudentByCode(code);
  if (!student) {
    return Response.json({ error: "Código no encontrado." }, { status: 404 });
  }
  const progress = await getProgress(student.code);
  return Response.json({ student, progress });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { code, worldId, activityIndex, correct, incorrect, timeSpentSeconds } =
    body as {
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

  return Response.json({ progress: updated, coinsEarned, newRewards });
}
