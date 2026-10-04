import { checkCodeRateLimit, getClientIp, recordFailedCodeAttempt } from "@/lib/rateLimit";
import { NextRequest } from "next/server";
import { isTrialExpired } from "@/lib/openClassroomShared";
import { findStudentByCode, getProgress, saveProgress } from "@/lib/data";

// Descuenta monedas cuando el alumno pide una pista o la lectura en voz
// alta en un mundo avanzado. Devuelve ok:false si no le alcanzan las
// monedas, sin descontar nada.
export async function POST(request: NextRequest) {
  const { code, amount } = (await request.json()) as {
    code?: string;
    amount?: number;
  };

  if (!code || !amount || amount <= 0) {
    return Response.json({ error: "Datos inválidos." }, { status: 400 });
  }

  const ip = getClientIp(request);
  if ((await checkCodeRateLimit(ip, code)).blocked) {
    return Response.json({ error: "Demasiados intentos fallidos. Esperá unos minutos y probá de nuevo.", blocked: true }, { status: 429 });
  }
  const student = await findStudentByCode(code);
  if (!student) await recordFailedCodeAttempt(ip);
  if (!student) {
    return Response.json({ error: "Código no encontrado." }, { status: 404 });
  }
  if (isTrialExpired(student)) {
    return Response.json({ error: "Tu período de prueba terminó.", trialExpired: true }, { status: 403 });
  }

  const progress = await getProgress(student.code);
  if (progress.coins < amount) {
    return Response.json({ ok: false, coins: progress.coins });
  }

  const updated = { ...progress, coins: progress.coins - amount };
  await saveProgress(updated);

  return Response.json({ ok: true, coins: updated.coins });
}
