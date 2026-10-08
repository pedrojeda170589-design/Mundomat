import { checkCodeRateLimit, getClientIp, recordFailedCodeAttempt, recordFailedLookup } from "@/lib/rateLimit";
import { NextRequest } from "next/server";
import { findStudentByCode, getProgress, mundoHabilitadoPara, saveProgress } from "@/lib/data";
import { isTrialExpired } from "@/lib/openClassroomShared";
import { empezarVuelta, saltarEnVuelta, validRoundId, vueltaEnCurso } from "@/lib/vuelta";

// Vuelta en curso de un mundo (retomar donde se dejó). Ver src/lib/vuelta.ts.
//   GET  ?code=&worldId=  → { round } (o round: null si hay que empezar)
//   POST { code, worldId, roundId, activities }      → empieza una vuelta
//   POST { code, worldId, roundId, skipIndex }       → pasa el cuento (no se responde)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const worldId = Number(searchParams.get("worldId"));
  if (!code || !Number.isInteger(worldId)) return Response.json({ error: "Datos incompletos." }, { status: 400 });
  const ip = getClientIp(request);
  if ((await checkCodeRateLimit(ip, code)).blocked) {
    return Response.json({ error: "Demasiados intentos fallidos. Esperá unos minutos y probá de nuevo.", blocked: true }, { status: 429 });
  }
  const student = await findStudentByCode(code);
  if (!student) await recordFailedLookup();
  if (!student) return Response.json({ error: "Código no encontrado." }, { status: 404 });
  const round = vueltaEnCurso(await getProgress(student.code), worldId);
  return Response.json({ round });
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as {
    code?: string;
    worldId?: number;
    roundId?: string;
    activities?: unknown[];
    skipIndex?: number;
  };
  const { code, worldId, roundId } = body;
  if (!code || typeof worldId !== "number" || !validRoundId(roundId)) {
    return Response.json({ error: "Datos incompletos." }, { status: 400 });
  }
  const ip = getClientIp(request);
  if ((await checkCodeRateLimit(ip, code)).blocked) {
    return Response.json({ error: "Demasiados intentos fallidos. Esperá unos minutos y probá de nuevo.", blocked: true }, { status: 429 });
  }
  const student = await findStudentByCode(code);
  if (!student) await recordFailedCodeAttempt(ip);
  if (!student) return Response.json({ error: "Código no encontrado." }, { status: 404 });
  if (isTrialExpired(student)) return Response.json({ error: "Tu período de prueba terminó." }, { status: 403 });
  if (typeof body.skipIndex !== "number" && !(await mundoHabilitadoPara(student, worldId))) {
    return Response.json({ error: "Este mundo no está habilitado.", disabled: true }, { status: 403 });
  }
  const progress = await getProgress(student.code);
  const next =
    typeof body.skipIndex === "number"
      ? saltarEnVuelta(progress, worldId, roundId, body.skipIndex)
      : empezarVuelta(progress, worldId, roundId, Array.isArray(body.activities) ? body.activities : []);
  if (next !== progress) await saveProgress(next);
  return Response.json({ ok: true });
}
