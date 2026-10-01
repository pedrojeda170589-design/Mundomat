import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { FICHAS_COOKIE, FICHAS_COOKIE_MAX_AGE, studentForFichas } from "@/lib/fichasAccess";

// GET → ¿este navegador ya tiene acceso a las fichas?
export async function GET() {
  const jar = await cookies();
  const student = await studentForFichas(jar.get(FICHAS_COOKIE)?.value);
  return Response.json({ ok: !!student });
}

// POST { code } → habilita las descargas con el código de alumno.
export async function POST(request: NextRequest) {
  const { code } = (await request.json().catch(() => ({}))) as { code?: string };
  const student = await studentForFichas(code?.trim());
  if (!student) {
    return Response.json(
      { error: "Ese código no es válido o la prueba ya terminó." },
      { status: 403 }
    );
  }
  const jar = await cookies();
  jar.set(FICHAS_COOKIE, student.code, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: FICHAS_COOKIE_MAX_AGE,
  });
  return Response.json({ ok: true });
}
