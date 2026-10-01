import { NextRequest } from "next/server";
import { buyShopItem, findStudentByCode, liteProgress } from "@/lib/data";

// POST { code, itemId } → compra un avatar u objeto de la tienda.
export async function POST(request: NextRequest) {
  const { code, itemId } = (await request.json()) as { code?: string; itemId?: string };
  if (!code || !itemId) return Response.json({ error: "Datos incompletos." }, { status: 400 });
  const student = await findStudentByCode(code);
  if (!student) return Response.json({ error: "Código no encontrado." }, { status: 404 });
  const result = await buyShopItem(student.code, itemId);
  if (!result.ok) return Response.json({ error: result.error }, { status: 400 });
  return Response.json({ ok: true, progress: liteProgress(result.progress) });
}
