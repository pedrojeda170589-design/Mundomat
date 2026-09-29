import { NextRequest } from "next/server";
import {
  completeWeekendActivity,
  findStudentByCode,
  getProgress,
  getTodayWeekendRecord,
} from "@/lib/data";
import {
  computeNextStreak,
  computeSpecialChallengeReward,
  getDisplayStreak,
} from "@/lib/specialChallenge";
import {
  FINAL_BONUS,
  PERFECT_BONUS,
  buildWeekendPlan,
  getWeekendDay,
  maxPointsForDay,
} from "@/lib/weekend/plan";
import { WEEKEND_REWARD_IDS } from "@/types";
import { addNews, displayName } from "@/lib/news";

// GET: plan de la Aventura de fin de semana de hoy (10 actividades, iguales
// para todos los alumnos ese día) y el avance del alumno. Entre semana
// devuelve available: false y la racha vigente.
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
  const today = getWeekendDay(now);
  const streak = getDisplayStreak(progress, now);
  if (!today) {
    return Response.json({ available: false, streak });
  }
  const plan = buildWeekendPlan(today.dayKey, today.day);
  const record = getTodayWeekendRecord(progress, today.dayKey);
  const argDay = new Date(`${today.dayKey}T12:00:00`);
  const previewStreak = computeNextStreak(progress, argDay);
  const owned = new Set(progress.seasonalCollection ?? []);
  return Response.json({
    available: true,
    plan,
    record,
    streak,
    previewStreak,
    chestCoins: FINAL_BONUS + computeSpecialChallengeReward(previewStreak),
    nextRewardId: WEEKEND_REWARD_IDS.find((id) => !owned.has(id)) ?? null,
    perfectBonus: PERFECT_BONUS,
    finalBonus: FINAL_BONUS,
    maxPoints: maxPointsForDay(plan),
    daysCompleted: progress.weekendDaysCompleted ?? 0,
  });
}

// POST: el alumno resolvió la actividad `activityIndex` con `errors`
// intentos equivocados.
export async function POST(request: NextRequest) {
  const { code, activityIndex, errors } = (await request.json()) as {
    code?: string;
    activityIndex?: number;
    errors?: number;
  };
  if (!code || typeof activityIndex !== "number") {
    return Response.json({ error: "Datos incompletos." }, { status: 400 });
  }
  const student = await findStudentByCode(code);
  if (!student) {
    return Response.json({ error: "Código no encontrado." }, { status: 404 });
  }
  const result = await completeWeekendActivity(
    student.code,
    activityIndex,
    typeof errors === "number" ? errors : 0
  );
  if (!result) {
    return Response.json(
      { error: "Esta actividad no se puede registrar ahora." },
      { status: 409 }
    );
  }
  if (result.record.finished) {
    const who = displayName(student, result.progress);
    const items: Parameters<typeof addNews>[0] = [
      { code: student.code, who, kind: "finde", emoji: "🃏", text: `completó la Aventura de fin de semana con ${result.record.points} puntos` },
    ];
    if ((result.streak ?? 0) >= 2) {
      items.push({ code: student.code, who, kind: "racha", emoji: "🔥", text: `lleva ${result.streak} fines de semana seguidos jugando` });
    }
    await addNews(items, student.classroomId);
  }
  return Response.json({
    record: result.record,
    coins: result.progress.coins,
    pointsEarned: result.pointsEarned,
    perfectBonus: result.perfectBonus,
    finalBonus: result.finalBonus,
    streak: result.streak,
    daysCompleted: result.progress.weekendDaysCompleted ?? 0,
  });
}
