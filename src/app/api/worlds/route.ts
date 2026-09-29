import { NextRequest } from "next/server";
import { findStudentByCode, getEnabledWorldIdsFor, getWorldsConfig, saveWorldsConfig } from "@/lib/data";
import { checkAdminPassword } from "@/lib/auth";

// GET → configuración del aula piloto (panel de siempre).
// GET ?code= → mundos habilitados para ese alumno (según su aula).
export async function GET(request: NextRequest) {
  const code = new URL(request.url).searchParams.get("code");
  if (code) {
    const student = await findStudentByCode(code);
    return Response.json({ config: { enabledWorldIds: await getEnabledWorldIdsFor(student) } });
  }
  const config = await getWorldsConfig();
  return Response.json({ config });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { enabledWorldIds, adminPassword } = body as {
    enabledWorldIds?: number[];
    adminPassword?: string;
  };

  if (!adminPassword || !checkAdminPassword(adminPassword)) {
    return Response.json({ error: "No autorizado." }, { status: 401 });
  }
  if (!Array.isArray(enabledWorldIds)) {
    return Response.json({ error: "Datos inválidos." }, { status: 400 });
  }

  await saveWorldsConfig({ enabledWorldIds });
  return Response.json({ ok: true });
}
