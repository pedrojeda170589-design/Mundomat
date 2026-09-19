import { NextRequest } from "next/server";
import { findStudentByCode, updateStudentProfile } from "@/lib/data";
import { MAX_NICKNAME_LENGTH } from "@/types";

// El alumno personaliza su avatar y/o apodo con su propio código de acceso
// (no requiere clave de docente). El nombre real (Student.name) nunca se
// toca acá: el docente siempre ve ese nombre en el Panel Docente.
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { code, avatar, nickname } = body as {
    code?: string;
    avatar?: string;
    nickname?: string;
  };

  if (!code) {
    return Response.json({ error: "Falta el código." }, { status: 400 });
  }
  if (avatar === undefined && nickname === undefined) {
    return Response.json(
      { error: "No hay nada para actualizar." },
      { status: 400 }
    );
  }
  if (nickname !== undefined && nickname.length > MAX_NICKNAME_LENGTH * 4) {
    // Corte defensivo antes de sanear (por si mandan un texto enorme).
    return Response.json({ error: "El apodo es muy largo." }, { status: 400 });
  }

  const student = await findStudentByCode(code);
  if (!student) {
    return Response.json({ error: "Código no encontrado." }, { status: 404 });
  }

  const updated = await updateStudentProfile(student.code, {
    avatar,
    nickname,
  });
  if (!updated) {
    return Response.json({ error: "Avatar inválido." }, { status: 400 });
  }

  return Response.json({ progress: updated });
}
