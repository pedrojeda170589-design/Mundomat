// Acceso a las fichas para imprimir: solo para alumnos de las aulas (no
// para el aula abierta de prueba). El código se guarda en una cookie del
// navegador.
import { findStudentByCode } from "@/lib/data";
import { isOpenClassroomStudent } from "@/lib/openClassroomShared";
import { Student } from "@/types";

export const FICHAS_COOKIE = "mm_fichas";
export const FICHAS_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 días

export async function studentForFichas(code: string | undefined | null): Promise<Student | null> {
  if (!code || !/^[A-Za-z0-9]{3,12}$/.test(code)) return null;
  const student = await findStudentByCode(code);
  if (!student || student.type === "prueba" || isOpenClassroomStudent(student)) return null;
  return student;
}
