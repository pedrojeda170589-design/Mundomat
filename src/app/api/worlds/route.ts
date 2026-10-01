import { NextRequest } from "next/server";
import { findStudentByCode, getEnabledWorldIdsFor, getGradeWorldsConfig, getProgress, getWorldsConfig, saveGradeWorldsConfig, saveWorldsConfig } from "@/lib/data";
import { DEFAULT_GRADE, GRADES, gradeOf } from "@/lib/grades";
import { filterTrialWorlds } from "@/lib/openClassroom";
import { isOpenClassroomStudent } from "@/lib/openClassroomShared";
import { checkAdminPassword } from "@/lib/auth";

// GET → configuración del aula piloto (panel de siempre).
// GET ?code= → mundos habilitados para ese alumno (según su aula).
export async function GET(request: NextRequest) {
  const params = new URL(request.url).searchParams;
  const code = params.get("code");
  if (code) {
    const student = await findStudentByCode(code);
    const enabled = await getEnabledWorldIdsFor(student);
    if (student && isOpenClassroomStudent(student)) {
      // Aula de prueba: hasta 5 mundos superados por materia.
      const progress = await getProgress(student.code);
      return Response.json({ config: { enabledWorldIds: filterTrialWorlds(enabled, progress), trialAllEnabledIds: enabled } });
    }
    return Response.json({ config: { enabledWorldIds: enabled }, grade: gradeOf(student) });
  }
  const grade = Number(params.get("grade") ?? DEFAULT_GRADE);
  if (grade !== DEFAULT_GRADE && GRADES.some((g) => g.grade === grade)) {
    return Response.json({ config: await getGradeWorldsConfig(grade) });
  }
  const config = await getWorldsConfig();
  return Response.json({ config });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { enabledWorldIds, adminPassword, grade } = body as {
    enabledWorldIds?: number[];
    adminPassword?: string;
    grade?: number;
  };

  if (!adminPassword || !checkAdminPassword(adminPassword)) {
    return Response.json({ error: "No autorizado." }, { status: 401 });
  }
  if (!Array.isArray(enabledWorldIds)) {
    return Response.json({ error: "Datos inválidos." }, { status: 400 });
  }

  if (typeof grade === "number" && grade !== DEFAULT_GRADE) {
    if (!GRADES.some((g) => g.grade === grade)) return Response.json({ error: "Grado inválido." }, { status: 400 });
    await saveGradeWorldsConfig(grade, { enabledWorldIds: enabledWorldIds.filter((x) => Number.isInteger(x)) });
    return Response.json({ ok: true });
  }
  await saveWorldsConfig({ enabledWorldIds });
  return Response.json({ ok: true });
}
