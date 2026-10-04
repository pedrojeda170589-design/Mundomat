import { NextRequest } from "next/server";
import { checkCodeRateLimit, codigoDe, getClientIp, recordFailedLookup } from "@/lib/rateLimit";
import {
  completeTorneoTable,
  findStudentByCode,
  getClassroomTorneoRanking,
  weekendSaturdayKey,
} from "@/lib/data";
import { isTrialExpired } from "@/lib/openClassroomShared";
import { getWeekendDay } from "@/lib/weekend/plan";
import { delKey, getJSON, setJSON } from "@/lib/store";
import { PENALIDAD_ERROR_MS } from "@/lib/torneo/tiempos";

// Cada partida se abre en el servidor cuando arranca el reloj ({action:"start"})
// y se cierra una sola vez al terminar: así nadie puede mandar un tiempo
// inventado, repetir el envío ni cobrar dos veces con dos pestañas.
interface PartidaAbierta {
  id: string;
  tabla: number;
  t: number; // ms del servidor al arrancar
}
const partidaKey = (code: string) => `torneo:partida:${code.toUpperCase()}`;
const TOLERANCIA_MS = 2500; // red y redondeos
const MIN_MS_POR_PASO = 250; // nadie responde 11 pasos más rápido

export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const tablaParam = searchParams.get("tabla");

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

  const now = new Date();
  const tabla = tablaParam ? parseInt(tablaParam, 10) : 2;
  const weekendDay = getWeekendDay(now);
  const satKey = weekendSaturdayKey(now);

  const ranking = await getClassroomTorneoRanking(student.code, tabla, now);

  return Response.json({
    ok: true,
    available: weekendDay !== null,
    day: weekendDay?.day,
    satKey,
    tabla,
    ranking,
  });
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rateLimit = await checkCodeRateLimit(ip, await codigoDe(request));
  if (rateLimit.blocked) {
    return Response.json(
      { error: "Demasiados intentos fallidos. Esperá unos minutos y probá de nuevo.", blocked: true },
      { status: 429 }
    );
  }

  let body: {
    action?: "start";
    partida?: string;
    code?: string;
    tabla?: number;
    ms?: number;
    errores?: number;
  };

  try {
    body = (await request.json()) as typeof body;
  } catch {
    return Response.json({ error: "Cuerpo de solicitud inválido." }, { status: 400 });
  }

  const { code, tabla, ms, errores } = body;
  if (body.action === "start") {
    if (!code || typeof tabla !== "number" || !Number.isInteger(tabla) || tabla < 2 || tabla > 10) {
      return Response.json({ error: "Faltan parámetros (code, tabla)." }, { status: 400 });
    }
    const alumno = await findStudentByCode(code);
    if (!alumno) {
      await recordFailedLookup();
      return Response.json({ error: "Código no encontrado." }, { status: 404 });
    }
    if (!getWeekendDay(new Date())) {
      return Response.json({ error: "El torneo es solo el fin de semana." }, { status: 400 });
    }
    const partida: PartidaAbierta = { id: crypto.randomUUID(), tabla, t: Date.now() };
    await setJSON(partidaKey(alumno.code), partida, { ttlSeconds: 15 * 60 });
    return Response.json({ ok: true, partida: partida.id });
  }
  if (!code || typeof tabla !== "number" || typeof ms !== "number") {
    return Response.json({ error: "Faltan parámetros obligatorios (code, tabla, ms)." }, { status: 400 });
  }

  const student = await findStudentByCode(code);
  if (!student) {
    await recordFailedLookup();
    return Response.json({ error: "Código no encontrado." }, { status: 404 });
  }

  if (isTrialExpired(student)) {
    return Response.json({ error: "Tu período de prueba terminó.", trialExpired: true }, { status: 403 });
  }

  // La partida tiene que haberse abierto en el servidor, para esta tabla, y
  // se usa una sola vez.
  const abierta = await getJSON<PartidaAbierta | null>(partidaKey(student.code), null);
  if (!abierta || !body.partida || abierta.id !== body.partida || abierta.tabla !== tabla) {
    return Response.json({ error: "No encontramos tu partida. Volvé a empezar la tabla." }, { status: 400 });
  }
  await delKey(partidaKey(student.code));
  const nErrores = typeof errores === "number" && Number.isInteger(errores) ? errores : -1;
  const sinPenalidad = ms - Math.max(0, nErrores) * PENALIDAD_ERROR_MS;
  const transcurrido = Date.now() - abierta.t;
  if (nErrores < 0 || sinPenalidad < 11 * MIN_MS_POR_PASO || sinPenalidad < transcurrido - TOLERANCIA_MS) {
    return Response.json({ error: "El tiempo de la partida no coincide. Volvé a intentarlo." }, { status: 400 });
  }

  const result = await completeTorneoTable(
    student.code,
    tabla,
    ms,
    typeof errores === "number" ? errores : 0
  );

  if ("error" in result) {
    return Response.json({ error: result.error }, { status: 400 });
  }

  return Response.json({
    ok: true,
    ...result,
  });
}
