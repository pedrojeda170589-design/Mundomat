import { NextRequest } from "next/server";
import { checkCodeRateLimit, getClientIp, recordFailedCodeAttempt } from "@/lib/rateLimit";
import { findStudentByCode, getProgress, saveProgress, liteProgress } from "@/lib/data";
import { isTrialExpired } from "@/lib/openClassroomShared";
import { ACTIVIDADES_POR_VUELTA, debeMostrarReserva, etapaAbierta, registrarVuelta, TOTAL_ETAPAS } from "@/lib/reserva";

// POST {code, action: "completar-etapa", etapa: 1..11, correctas: 0..8}
// El servidor recibe cuántas acertó (no un porcentaje), revisa que la etapa
// esté abierta y entrega los premios.
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const body = await request.json().catch(() => ({}));
  const { code, action, etapa, correctas } = body as { code?: string; action?: string; etapa?: number; correctas?: number };
  if (!code) return Response.json({ error: "Falta el código de alumno." }, { status: 400 });

  const rl = await checkCodeRateLimit(ip, code);
  if (rl.blocked) {
    return Response.json({ error: "Demasiados intentos fallidos. Esperá unos minutos y probá de nuevo.", blocked: true }, { status: 429 });
  }
  const student = await findStudentByCode(code);
  if (!student) {
    await recordFailedCodeAttempt(ip);
    return Response.json({ error: "Código no encontrado." }, { status: 404 });
  }
  if (isTrialExpired(student)) {
    return Response.json({ error: "El período de prueba terminó.", trialExpired: true }, { status: 403 });
  }
  if (action !== "completar-etapa") return Response.json({ error: "Acción no reconocida." }, { status: 400 });
  if (!debeMostrarReserva(student)) {
    return Response.json({ error: "La reserva patagónica no está disponible." }, { status: 403 });
  }
  if (typeof etapa !== "number" || !Number.isInteger(etapa) || etapa < 1 || etapa > TOTAL_ETAPAS) {
    return Response.json({ error: "Etapa inválida." }, { status: 400 });
  }
  if (typeof correctas !== "number" || !Number.isInteger(correctas) || correctas < 0 || correctas > ACTIVIDADES_POR_VUELTA) {
    return Response.json({ error: "Resultado inválido." }, { status: 400 });
  }
  const progress = await getProgress(student.code);
  if (!etapaAbierta(progress, etapa)) {
    return Response.json({ error: "Primero superá la etapa anterior." }, { status: 403 });
  }
  const r = registrarVuelta(progress, etapa, correctas);
  await saveProgress(r.nextProgress);
  return Response.json({
    ok: true,
    progress: liteProgress(r.nextProgress),
    resultado: { superada: r.superada, primeraVez: r.primeraVez, premios: r.premios, correctas },
  });
}
