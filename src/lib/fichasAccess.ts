// Acceso a las fichas para imprimir: solo para quienes entran a la app con
// un código de alumno válido (y con la prueba vigente, si es del aula de
// prueba). El código se guarda en una cookie del navegador.
import { findStudentByCode } from "@/lib/data";
import { isTrialExpired } from "@/lib/openClassroomShared";
import { Student } from "@/types";

export const FICHAS_COOKIE = "mm_fichas";
export const FICHAS_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 días

export async function studentForFichas(code: string | undefined | null): Promise<Student | null> {
  if (!code || !/^[A-Za-z0-9]{3,12}$/.test(code)) return null;
  const student = await findStudentByCode(code);
  if (!student || isTrialExpired(student)) return null;
  return student;
}
