import { NextRequest } from "next/server";
import { checkAdminPassword } from "@/lib/auth";
import { clearNews, displayName, encouragement, getNews } from "@/lib/news";
import { findStudentByCode, getProgress } from "@/lib/data";

// GET: novedades de la clase (últimas primero). Con ?code= también devuelve
// un mensaje para animar a ese alumno.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const items = await getNews();
  let message: string | undefined;
  if (code) {
    const student = await findStudentByCode(code);
    if (student) {
      const progress = await getProgress(student.code);
      message = encouragement(progress, displayName(student, progress));
    }
  }
  return Response.json({ items: items.slice(0, 20), message });
}

// DELETE: el docente borra el pizarrón.
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const adminPassword = searchParams.get("adminPassword");
  if (!adminPassword || !checkAdminPassword(adminPassword)) {
    return Response.json({ error: "No autorizado." }, { status: 401 });
  }
  await clearNews();
  return Response.json({ ok: true });
}
