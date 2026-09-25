import { NextRequest } from "next/server";
import { findStudentByCode, getProgress, saveProgress } from "@/lib/data";
import { applyWorldAttempt } from "@/lib/progressLogic";
import { TOTAL_ACTIVITIES_PER_WORLD } from "@/types";

// POST: el alumno terminó una vuelta completa de un mundo (las 10
// actividades respondidas). Acá se decide, según el sistema de refuerzo del
// 90%, si el mundo queda completado, "a un repaso de completar" o "a
// fortalecer" (a tratar por el docente).
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { code, worldId, correctCount, totalActivities } = body as {
    code?: string;
    worldId?: number;
    correctCount?: number;
    totalActivities?: number;
  };

  if (!code || worldId === undefined || correctCount === undefined) {
    return Response.json({ error: "Datos incompletos." }, { status: 400 });
  }

  const student = await findStudentByCode(code);
  if (!student) {
    return Response.json({ error: "Código no encontrado." }, { status: 404 });
  }

  const progress = await getProgress(student.code);
  const { progress: updated, outcome, coinsEarned } = applyWorldAttempt(
    progress,
    worldId,
    correctCount,
    totalActivities ?? TOTAL_ACTIVITIES_PER_WORLD
  );
  await saveProgress(updated);

  return Response.json({ progress: updated, outcome, coinsEarned });
}
