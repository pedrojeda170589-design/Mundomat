import { NextRequest } from "next/server";
import { findStudentByCode, getProgress, saveProgress } from "@/lib/data";

// Descuenta monedas cuando el alumno pide una pista o la lectura en voz
// alta en un mundo avanzado. Devuelve ok:false si no le alcanzan las
// monedas, sin descontar nada.
export async function POST(request: NextRequest) {
  const { code, amount } = (await request.json()) as {
    code?: string;
    amount?: number;
  };

  if (!code || !amount || amount <= 0) {
    return Response.json({ error: "Datos inválidos." }, { status: 400 });
  }

  const student = await findStudentByCode(code);
  if (!student) {
    return Response.json({ error: "Código no encontrado." }, { status: 404 });
  }

  const progress = await getProgress(student.code);
  if (progress.coins < amount) {
    return Response.json({ ok: false, coins: progress.coins });
  }

  const updated = { ...progress, coins: progress.coins - amount };
  await saveProgress(updated);

  return Response.json({ ok: true, coins: updated.coins });
}
