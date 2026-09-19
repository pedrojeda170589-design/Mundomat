import { NextRequest } from "next/server";
import { getWorldsConfig, saveWorldsConfig } from "@/lib/data";
import { checkAdminPassword } from "@/lib/auth";

export async function GET() {
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
