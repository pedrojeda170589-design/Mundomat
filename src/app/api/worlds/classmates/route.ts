import { checkCodeRateLimit, getClientIp, recordFailedLookup } from "@/lib/rateLimit";
import { NextRequest } from "next/server";
import { findStudentByCode, getClassmateWorldCounts } from "@/lib/data";
import { WORLDS } from "@/lib/worlds";
import { WorldSubject } from "@/types";

const VALID_SUBJECTS: WorldSubject[] = [
  "matematica",
  "lengua",
  "naturales",
  "sociales",
];

// Devuelve, para una materia, cuántos compañeros de clase están actualmente
// en cada mundo (ver getClassmateWorldCounts). Es autoservicio del alumno
// con su propio código: no expone nombres ni apodos, solo un conteo por
// mundo, así que no requiere clave de docente.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const subject = searchParams.get("subject") as WorldSubject | null;

  if (!code) {
    return Response.json({ error: "Falta el código." }, { status: 400 });
  }
  if (!subject || !VALID_SUBJECTS.includes(subject)) {
    return Response.json({ error: "Materia inválida." }, { status: 400 });
  }

  const ip = getClientIp(request);
  if ((await checkCodeRateLimit(ip, code)).blocked) {
    return Response.json({ error: "Demasiados intentos fallidos. Esperá unos minutos y probá de nuevo.", blocked: true }, { status: 429 });
  }
  const student = await findStudentByCode(code);
  if (!student) await recordFailedLookup();
  if (!student) {
    return Response.json({ error: "Código no encontrado." }, { status: 404 });
  }

  const subjectWorldIds = WORLDS.filter((w) => w.subject === subject).map(
    (w) => w.id
  );
  const counts = await getClassmateWorldCounts(subjectWorldIds, student);
  return Response.json({ counts });
}
