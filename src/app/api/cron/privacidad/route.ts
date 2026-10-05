import { NextRequest } from "next/server";
import { anonimizarVencidos } from "@/lib/privacidadPrueba";

// Tarea diaria (vercel.json → crons): reemplaza por un número el nombre de
// quienes cumplieron 30 días en el aula abierta. Vercel la llama con
// «Authorization: Bearer $CRON_SECRET».
export async function GET(request: NextRequest) {
  const secreto = process.env.CRON_SECRET;
  if (!secreto || request.headers.get("authorization") !== `Bearer ${secreto}`) {
    return Response.json({ error: "No autorizado." }, { status: 401 });
  }
  const n = await anonimizarVencidos();
  return Response.json({ ok: true, anonimizados: n });
}
