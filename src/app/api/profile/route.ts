import { checkCodeRateLimit, getClientIp, recordFailedCodeAttempt } from "@/lib/rateLimit";
import { NextRequest } from "next/server";
import { isTrialExpired } from "@/lib/openClassroomShared";
import { findStudentByCode, updateStudentProfile, liteProgress } from "@/lib/data";
import { AccessorySlot, MAX_NICKNAME_LENGTH } from "@/types";

// El alumno personaliza su avatar (personaje + accesorios) y/o apodo con su
// propio código de acceso (no requiere clave de docente). El nombre real
// (Student.name) nunca se toca acá: el docente siempre ve ese nombre en el
// Panel Docente.
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { code, avatar, nickname, accessories, background, tweaks } = body as {
    tweaks?: Record<string, { x?: number; y?: number; s?: number } | null>;
    code?: string;
    avatar?: string;
    nickname?: string;
    accessories?: Partial<Record<AccessorySlot, string | null>>;
    background?: string;
  };

  if (!code) {
    return Response.json({ error: "Falta el código." }, { status: 400 });
  }
  if (
    avatar === undefined &&
    nickname === undefined &&
    accessories === undefined &&
    background === undefined &&
    tweaks === undefined
  ) {
    return Response.json(
      { error: "No hay nada para actualizar." },
      { status: 400 }
    );
  }
  if (nickname !== undefined && nickname.length > MAX_NICKNAME_LENGTH * 4) {
    // Corte defensivo antes de sanear (por si mandan un texto enorme).
    return Response.json({ error: "El apodo es muy largo." }, { status: 400 });
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

  const updated = await updateStudentProfile(student.code, {
    avatar,
    nickname,
    accessories,
    background,
    tweaks: tweaks as Partial<Record<AccessorySlot, { x?: number; y?: number; s?: number } | null>> | undefined,
  });
  if (!updated) {
    return Response.json(
      { error: "Avatar, accesorio o fondo inválido." },
      { status: 400 }
    );
  }

  return Response.json({ progress: liteProgress(updated) });
}
