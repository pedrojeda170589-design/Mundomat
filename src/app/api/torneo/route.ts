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
