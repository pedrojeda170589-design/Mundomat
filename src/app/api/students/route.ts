import { NextRequest } from "next/server";
import { addStudent, deleteStudent, getStudents, setStudentBirthday } from "@/lib/data";
import { checkAdminPassword } from "@/lib/auth";

export async function GET() {
  const students = await getStudents();
  return Response.json({ students });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, adminPassword } = body as {
    name?: string;
    adminPassword?: string;
  };

  if (!adminPassword || !checkAdminPassword(adminPassword)) {
    return Response.json({ error: "No autorizado." }, { status: 401 });
  }
  if (!name || !name.trim()) {
    return Response.json({ error: "Falta el nombre." }, { status: 400 });
  }

  const student = await addStudent(name.trim(), "agregado");
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

// PATCH: el docente carga (o borra) el cumpleaños de un alumno, "MM-DD".
export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { code, birthday, adminPassword } = body as {
    code?: string;
    birthday?: string;
    adminPassword?: string;
  };
  if (!adminPassword || !checkAdminPassword(adminPassword)) {
    return Response.json({ error: "No autorizado." }, { status: 401 });
  }
  if (!code) {
    return Response.json({ error: "Falta el código." }, { status: 400 });
  }
  if (birthday && !/^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(birthday)) {
    return Response.json({ error: "Fecha inválida." }, { status: 400 });
  }
  const ok = await setStudentBirthday(code, birthday || undefined);
  if (!ok) {
    return Response.json({ error: "Código no encontrado." }, { status: 404 });
  }
  return Response.json({ ok: true });
}
