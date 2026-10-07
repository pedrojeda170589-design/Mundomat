import { NextRequest } from "next/server";
import { checkCodeRateLimit, codigoDe, getClientIp, recordFailedCodeAttempt } from "@/lib/rateLimit";
import { findStudentByCode, getProgress, saveProgress, liteProgress } from "@/lib/data";
import { isTrialExpired } from "@/lib/openClassroomShared";
import {
  estaActivoMonteLeon,
  esMomentoBuenViaje,
  diasParaElViaje,
  textoCuentaRegresiva,
  debeMostrarMonteLeon,
  debeMostrarBuenViaje,
  TEXTO_BUEN_VIAJE,
  ACTIVIDADES_POR_ETAPA,
  registrarResultadoEtapa,
  entregarMedallaBuenViaje,
  tieneMochilaCompleta,
  haParticipadoMonteLeon,
  alumnoTieneORegalo,
  MOCHILA_MONTE_LEON,
  MASCOTA_MONTE_LEON,
  MEDALLA_MONTE_LEON,
  ETAPAS_MONTE_LEON,
} from "@/lib/monteLeon";

export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return Response.json({ error: "Falta el código de alumno." }, { status: 400 });
  }

  const rateLimit = await checkCodeRateLimit(ip, await codigoDe(request));
  if (rateLimit.blocked) {
    return Response.json(
      { error: "Demasiados intentos fallidos. Esperá unos minutos y probá de nuevo.", blocked: true },
      { status: 429 }
    );
  }

  const student = await findStudentByCode(code);
  if (!student) {
    await recordFailedCodeAttempt(ip);
    return Response.json({ error: "Código no encontrado." }, { status: 404 });
  }

  if (isTrialExpired(student)) {
    return Response.json({ error: "El período de prueba terminó.", trialExpired: true }, { status: 403 });
  }

  const now = new Date();
  // Solo lectura: la medalla se entrega con POST {action: "reclamar-medalla"}.
  const currentProgress = await getProgress(student.code);

  const mochilaItems = MOCHILA_MONTE_LEON.map((item) => ({
    ...item,
    ganado: alumnoTieneORegalo(currentProgress, item.id),
    enColeccion: (currentProgress.seasonalCollection ?? []).includes(item.id),
    regalado: (currentProgress.objetosRegalados ?? []).includes(item.id),
  }));

  return Response.json({
    activo: estaActivoMonteLeon(now),
    buenViaje: esMomentoBuenViaje(now),
    diasFaltantes: diasParaElViaje(now),
    textoContador: textoCuentaRegresiva(now),
    debeMostrar: debeMostrarMonteLeon(student, now),
    debeMostrarBuenViaje: debeMostrarBuenViaje(student, now),
    textoBuenViaje: TEXTO_BUEN_VIAJE,
    etapasInfo: ETAPAS_MONTE_LEON,
    etapasProgreso: currentProgress.monteLeon?.etapas ?? {},
    mochila: mochilaItems,
    mascotaGanada: alumnoTieneORegalo(currentProgress, MASCOTA_MONTE_LEON.id),
    medallaGanada: alumnoTieneORegalo(currentProgress, MEDALLA_MONTE_LEON.id),
    mochilaCompleta: tieneMochilaCompleta(currentProgress),
    participo: haParticipadoMonteLeon(currentProgress),
  });
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const body = await request.json().catch(() => ({}));
  const { code, action, etapa, correctas } = body as {
    code?: string;
    action?: string;
    etapa?: number;
    correctas?: number; // de 8 (el servidor calcula el porcentaje)
  };

  if (!code) {
    return Response.json({ error: "Falta el código de alumno." }, { status: 400 });
  }

  const rateLimit = await checkCodeRateLimit(ip, code);
  if (rateLimit.blocked) {
    return Response.json(
      { error: "Demasiados intentos fallidos. Esperá unos minutos y probá de nuevo.", blocked: true },
      { status: 429 }
    );
  }

  const student = await findStudentByCode(code);
  if (!student) {
    await recordFailedCodeAttempt(ip);
    return Response.json({ error: "Código no encontrado." }, { status: 404 });
  }

  if (isTrialExpired(student)) {
    return Response.json({ error: "El período de prueba terminó.", trialExpired: true }, { status: 403 });
  }

  const progress = await getProgress(student.code);
  const now = new Date();

  if (action === "completar-etapa") {
    // Solo 3.º grado, nunca el aula abierta, y hasta el 27/10 a la noche.
    if (!debeMostrarMonteLeon(student, now)) {
      return Response.json({ error: "El viaje a Monte León no está disponible." }, { status: 403 });
    }
    if (typeof etapa !== "number" || !Number.isInteger(etapa) || etapa < 1 || etapa > 5) {
      return Response.json({ error: "Etapa inválida (debe ser de 1 a 5)." }, { status: 400 });
    }
    if (typeof correctas !== "number" || !Number.isInteger(correctas) || correctas < 0 || correctas > ACTIVIDADES_POR_ETAPA) {
      return Response.json({ error: "Resultado inválido." }, { status: 400 });
    }
    const res = registrarResultadoEtapa(progress, etapa, correctas, now);
    await saveProgress(res.nextProgress);
    return Response.json({
      ok: true,
      progress: liteProgress(res.nextProgress),
      resultado: {
        scorePct: res.scorePct,
        objetoPremio: res.objetoPremio,
        objetosPremio: res.objetosPremio,
        mascotaPremio: res.mascotaPremio,
        nuevosAvatares: res.nuevosAvatares,
        medallaPremio: res.medallaPremio,
      },
    });
  }

  if (action === "reclamar-medalla") {
    // Solo en la ventana del buen viaje y solo a quien superó alguna etapa.
    if (!debeMostrarBuenViaje(student, now)) {
      return Response.json({ ok: true, entregada: false, progress: liteProgress(progress) });
    }
    const res = entregarMedallaBuenViaje(progress);
    if (res.entregada) await saveProgress(res.nextProgress);
    return Response.json({ ok: true, entregada: res.entregada, progress: liteProgress(res.nextProgress) });
  }

  return Response.json({ error: "Acción no reconocida." }, { status: 400 });
}
