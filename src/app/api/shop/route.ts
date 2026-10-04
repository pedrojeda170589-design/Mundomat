import { checkCodeRateLimit, getClientIp, recordFailedCodeAttempt } from "@/lib/rateLimit";
import { NextRequest } from "next/server";
import { buyShopItem, findStudentByCode, liteProgress } from "@/lib/data";
import { isTrialExpired } from "@/lib/openClassroomShared";

// POST { code, itemId } → compra un avatar u objeto de la tienda.
export async function POST(request: NextRequest) {
  const { code, itemId } = (await request.json()) as { code?: string; itemId?: string };
  if (!code || !itemId) return Response.json({ error: "Datos incompletos." }, { status: 400 });
  const ip = getClientIp(request);
  if ((await checkCodeRateLimit(ip, code)).blocked) {
    return Response.json({ error: "Demasiados intentos fallidos. Esperá unos minutos y probá de nuevo.", blocked: true }, { status: 429 });
  }
  const student = await findStudentByCode(code);
  if (!student) await recordFailedCodeAttempt(ip);
  if (!student) return Response.json({ error: "Código no encontrado." }, { status: 404 });
  if (isTrialExpired(student)) return Response.json({ error: "Tu período de prueba terminó.", trialExpired: true }, { status: 403 });
  const result = await buyShopItem(student.code, itemId);
  if (!result.ok) return Response.json({ error: result.error }, { status: 400 });
  return Response.json({ ok: true, progress: liteProgress(result.progress) });
}
