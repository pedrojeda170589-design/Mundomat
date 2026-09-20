import { NextRequest } from "next/server";
import {
  completeSpecialChallenge,
  findStudentByCode,
  getProgress,
  isSpecialChallengeAvailable,
} from "@/lib/data";
import {
  computeNextStreak,
  computeSpecialChallengeReward,
  getDisplayStreak,
  getTodaysChallengePairs,
  getTodaysChallengeSubject,
  isWeekend,
} from "@/lib/specialChallenge";

// GET: ¿está disponible el Desafío Especial (solo sábado y domingo) para
// este alumno? Devuelve también los pares del memorama de hoy (mismos para
// todos), la recompensa que le tocaría si juega ahora (según su racha) y
// la racha vigente, para mostrarla aunque hoy no sea fin de semana.
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
  const now = new Date();
  const previewStreak = computeNextStreak(progress, now);
  return Response.json({
    available: isSpecialChallengeAvailable(progress, now),
    isWeekend: isWeekend(now),
    subject: getTodaysChallengeSubject(),
    pairs: getTodaysChallengePairs(),
    coinsReward: computeSpecialChallengeReward(previewStreak),
    streak: getDisplayStreak(progress, now),
    previewStreak,
  });
}

// POST: el alumno terminó el memorama del fin de semana. Acredita la
// recompensa (según su racha) una sola vez por día (no requiere clave de
// docente: es autoservicio del alumno con su propio código).
export async function POST(request: NextRequest) {
  const { code } = (await request.json()) as { code?: string };
  if (!code) {
    return Response.json({ error: "Falta el código." }, { status: 400 });
  }
  const student = await findStudentByCode(code);
  if (!student) {
    return Response.json({ error: "Código no encontrado." }, { status: 404 });
  }
  const result = await completeSpecialChallenge(student.code);
  if (!result) {
    return Response.json(
      {
        error:
          "El Desafío Especial solo está disponible el sábado y el domingo, una vez por día.",
      },
      { status: 409 }
    );
  }
  return Response.json({
    progress: result.progress,
    coinsEarned: result.coinsEarned,
    streak: result.streak,
  });
}
