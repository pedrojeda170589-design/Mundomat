import { NextRequest } from "next/server";
import { checkCodeRateLimit, getClientIp, recordFailedCodeAttempt } from "@/lib/rateLimit";
import { findStudentByCode, liteProgress, saveVestimenta } from "@/lib/data";
import { isTrialExpired } from "@/lib/openClassroomShared";

// POST { code, vestimenta: { cuerpo, puesto } } → guarda lo que tiene puesto
// en el vestidor de cuerpo completo.
export async function POST(request: NextRequest) {
  let body: { code?: string; vestimenta?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Datos inválidos." }, { status: 400 });
  }
  const { code, vestimenta } = body;
  if (!code || !vestimenta) return Response.json({ error: "Datos incompletos." }, { status: 400 });
  const ip = getClientIp(request);
  if ((await checkCodeRateLimit(ip, code)).blocked) {
    return Response.json({ error: "Demasiados intentos fallidos. Esperá unos minutos y probá de nuevo.", blocked: true }, { status: 429 });
  }
  const student = await findStudentByCode(code);
  if (!student) {
    await recordFailedCodeAttempt(ip);
    return Response.json({ error: "Código no encontrado." }, { status: 404 });
  }
  if (isTrialExpired(student)) return Response.json({ error: "Tu período de prueba terminó.", trialExpired: true }, { status: 403 });
  const r = await saveVestimenta(student.code, vestimenta);
  if (!r.ok) return Response.json({ error: r.error }, { status: 400 });
  return Response.json({ ok: true, progress: liteProgress(r.progress) });
}
