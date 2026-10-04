import { NextRequest } from "next/server";
import { addStudent, deleteStudent, getProgressMany, getStudents, setMultipleStudentDisplayNames, setStudentBirthday, setStudentDisplayName, setStudentGrade } from "@/lib/data";
import { StudentProgress } from "@/types";
import { GRADES } from "@/lib/grades";
import { checkAdminPassword } from "@/lib/auth";

// Lista del aula piloto para el panel de siempre (con la contraseña del
// docente). Antes era pública: ya no se exponen nombres ni códigos. Los
// alumnos de otras aulas se ven en el panel de la plataforma (/docente).
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const adminPassword = url.searchParams.get("adminPassword");
  if (!adminPassword || !checkAdminPassword(adminPassword)) {
    return Response.json({ error: "No autorizado." }, { status: 401 });
  }
  const withProgress = url.searchParams.get("withProgress") === "true";
  const students = (await getStudents()).filter((s) => !s.classroomId);
  if (withProgress) {
    const progressList = await getProgressMany(students.map((s) => s.code));
    const progressMap: Record<string, StudentProgress> = {};
    for (const p of progressList) {
      progressMap[p.code] = p;
    }
    return Response.json({ students, progressMap });
  }
  return Response.json({ students });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, displayName, adminPassword, grade } = body as {
    name?: string;
    displayName?: string;
    adminPassword?: string;
    grade?: number;
  };

  if (!adminPassword || !checkAdminPassword(adminPassword)) {
    return Response.json({ error: "No autorizado." }, { status: 401 });
  }
  if (!name || !name.trim()) {
    return Response.json({ error: "Falta el nombre." }, { status: 400 });
  }

  const g = GRADES.some((x) => x.grade === grade) ? grade : undefined;
  const student = await addStudent(name.trim(), "agregado", g, displayName?.trim());
  return Response.json({ student });
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const adminPassword = searchParams.get("adminPassword");

  if (!adminPassword || !checkAdminPassword(adminPassword)) {
    return Response.json({ error: "No autorizado." }, { status: 401 });
  }
  if (!code) {
    return Response.json({ error: "Falta el código." }, { status: 400 });
  }

  await deleteStudent(code);
  return Response.json({ ok: true });
}

// PATCH: el docente actualiza cumpleaños, grado o nombre para mostrar (displayName) de un alumno.
// También soporta actualizaciones por lote con `updates: Array<{ code, displayName }>`.
export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { code, birthday, displayName, updates, adminPassword, grade } = body as {
    code?: string;
    birthday?: string;
    displayName?: string;
    updates?: Array<{ code: string; displayName?: string }>;
    adminPassword?: string;
    grade?: number;
  };
  if (!adminPassword || !checkAdminPassword(adminPassword)) {
    return Response.json({ error: "No autorizado." }, { status: 401 });
  }

  // Actualización por lote de nombres para mostrar (migración / confirmación masiva)
  if (Array.isArray(updates) && updates.length > 0) {
    const updatedCount = await setMultipleStudentDisplayNames(updates);
    return Response.json({ ok: true, count: updatedCount });
  }

  // Cambio de grado (1.º / 2.º / 3.º) de un alumno del aula piloto.
  if (code && typeof grade === "number") {
    if (!GRADES.some((x) => x.grade === grade)) return Response.json({ error: "Grado inválido." }, { status: 400 });
    await setStudentGrade(code, grade);
    return Response.json({ ok: true });
  }

  if (!code) {
    return Response.json({ error: "Falta el código." }, { status: 400 });
  }

  if (displayName !== undefined) {
    const ok = await setStudentDisplayName(code, displayName || undefined);
    if (!ok) return Response.json({ error: "Código no encontrado." }, { status: 404 });
  }

  if (birthday !== undefined) {
    if (birthday && !/^((19|20)\d\d-)?(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(birthday)) {
      return Response.json({ error: "Fecha inválida." }, { status: 400 });
    }
    const ok = await setStudentBirthday(code, birthday || undefined);
    if (!ok) {
      return Response.json({ error: "Código no encontrado." }, { status: 404 });
    }
  }

  return Response.json({ ok: true });
}
