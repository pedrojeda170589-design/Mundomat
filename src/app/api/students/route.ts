import { NextRequest } from "next/server";
import { addStudent, deleteStudent, getStudents } from "@/lib/data";
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
