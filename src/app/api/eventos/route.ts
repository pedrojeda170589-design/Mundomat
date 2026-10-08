// Desafíos y eventos configurables desde el panel de administración.
// GET  ?adminPassword=… → catálogo + configuración guardada (panel).
// POST { adminPassword, config } → guarda la configuración completa.
import { NextRequest } from "next/server";
import { checkAdminPassword } from "@/lib/auth";
import { catalogoEventos, idsEventos } from "@/lib/eventos/catalogo";
import { validarEventosConfig } from "@/lib/eventos/config";
import { guardarEventosConfig, leerEventosConfig } from "@/lib/eventos/server";

export async function GET(request: NextRequest) {
  const adminPassword = new URL(request.url).searchParams.get("adminPassword") ?? request.headers.get("x-admin-password") ?? "";
  if (!checkAdminPassword(adminPassword)) return Response.json({ error: "No autorizado." }, { status: 401 });
  return Response.json({ catalogo: catalogoEventos(), config: await leerEventosConfig() });
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as { adminPassword?: string; config?: unknown };
  if (!checkAdminPassword(body.adminPassword ?? "")) return Response.json({ error: "No autorizado." }, { status: 401 });
  const r = validarEventosConfig(body.config, idsEventos());
  if (!r.ok) return Response.json({ error: r.error }, { status: 400 });
  await guardarEventosConfig(r.config);
  return Response.json({ ok: true, config: r.config });
}
