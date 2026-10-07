import { NextRequest } from "next/server";
import { checkCodeRateLimit, codigoDe, getClientIp, recordFailedLookup } from "@/lib/rateLimit";
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
  buildMonteLeonActivities,
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
  const etapaParam = searchParams.get("etapa");

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
    await recordFailedLookup();
    return Response.json({ error: "Código no encontrado." }, { status: 404 });
  }

  if (isTrialExpired(student)) {
    return Response.json({ error: "El período de prueba terminó.", trialExpired: true }, { status: 403 });
  }

  const now = new Date();
  const progress = await getProgress(student.code);

  let activities;
  if (etapaParam) {
    const etapaNum = parseInt(etapaParam, 10);
    if (etapaNum >= 1 && etapaNum <= 5) {
      activities = buildMonteLeonActivities(etapaNum);
    }
  }

  // Si estamos en la ventana de buen viaje y el alumno participó, entregar medalla automáticamente si aún no la tiene
  let currentProgress = progress;
  if (debeMostrarBuenViaje(student, now) && !alumnoTieneORegalo(progress, MEDALLA_MONTE_LEON.id) && haParticipadoMonteLeon(progress)) {
    const entrega = entregarMedallaBuenViaje(progress);
    if (entrega.entregada) {
      currentProgress = entrega.nextProgress;
      await saveProgress(currentProgress);
    }
  }

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
    activities,
  });
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const body = await request.json().catch(() => ({}));
  const { code, action, etapa, scorePct } = body as {
    code?: string;
    action?: string;
    etapa?: number;
    scorePct?: number;
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
    await recordFailedLookup();
    return Response.json({ error: "Código no encontrado." }, { status: 404 });
  }

  if (isTrialExpired(student)) {
    return Response.json({ error: "El período de prueba terminó.", trialExpired: true }, { status: 403 });
  }

  const progress = await getProgress(student.code);
  const now = new Date();

  if (action === "actividades") {
    const e = typeof etapa === "number" ? etapa : 1;
    const activities = buildMonteLeonActivities(e);
    return Response.json({ activities });
  }

  if (action === "completar-etapa") {
    if (typeof etapa !== "number" || etapa < 1 || etapa > 5) {
      return Response.json({ error: "Etapa inválida (debe ser de 1 a 5)." }, { status: 400 });
    }
    const score = typeof scorePct === "number" ? Math.max(0, Math.min(100, Math.round(scorePct))) : 0;

    const res = registrarResultadoEtapa(progress, etapa, score, now);
    await saveProgress(res.nextProgress);

    return Response.json({
      ok: true,
      progress: liteProgress(res.nextProgress),
      resultado: {
        objetoPremio: res.objetoPremio,
        mascotaPremio: res.mascotaPremio,
        nuevosAvatares: res.nuevosAvatares,
        medallaPremio: res.medallaPremio,
      },
    });
  }

  if (action === "reclamar-medalla") {
    const res = entregarMedallaBuenViaje(progress);
    if (res.entregada) {
      await saveProgress(res.nextProgress);
    }
    return Response.json({
      ok: true,
      entregada: res.entregada,
      progress: liteProgress(res.nextProgress),
    });
  }

  return Response.json({ error: "Acción no reconocida." }, { status: 400 });
}
