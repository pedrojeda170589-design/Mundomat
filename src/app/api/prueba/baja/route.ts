import { NextRequest } from "next/server";
import { checkCodeRateLimit, getClientIp, recordFailedCodeAttempt } from "@/lib/rateLimit";
import { findStudentByCode } from "@/lib/data";
import { isOpenClassroomStudent } from "@/lib/openClassroomShared";
import { eliminarCuentaPrueba } from "@/lib/privacidadPrueba";

// «Eliminar cuenta y datos» del aula abierta: borra de verdad la cuenta, los
// resultados y los registros asociados a ese código.
export async function POST(request: NextRequest) {
  let body: { code?: string; confirmar?: boolean };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Pedido inválido." }, { status: 400 });
  }
  const code = String(body.code ?? "").trim().toUpperCase();
  if (!code || body.confirmar !== true) {
    return Response.json({ error: "Falta confirmar el borrado." }, { status: 400 });
  }
  const ip = getClientIp(request);
  if ((await checkCodeRateLimit(ip, code)).blocked) {
    return Response.json({ error: "Demasiados intentos. Esperá unos minutos." }, { status: 429 });
  }
  const student = await findStudentByCode(code);
  if (!student) {
    await recordFailedCodeAttempt(ip);
    return Response.json({ error: "Código no encontrado." }, { status: 404 });
  }
  if (!isOpenClassroomStudent(student)) {
    return Response.json(
      { error: "Esta cuenta es de un aula de la escuela: el borrado lo pide la familia a la escuela." },
      { status: 403 }
    );
  }
  const ok = await eliminarCuentaPrueba(student.code);
  if (!ok) return Response.json({ error: "No se pudo borrar la cuenta." }, { status: 500 });
  return Response.json({ ok: true, borrado: new Date().toISOString() });
}
