// Reglas de tiempo y fechas para el Mundo Especial «Viaje a Monte León» (3.º grado).
// Todo en hora de Argentina (UTC-3), con `now` inyectable para pruebas.
import { DESAFIOS, desafioActivo } from "@/lib/eventos/config";
import { getArgentinaDate } from "@/lib/seasons";
import { isOpenClassroomStudent } from "@/lib/openClassroomShared";

export const FECHA_VIAJE = "2026-10-28";

export const TEXTO_BUEN_VIAJE =
  "¡Mañana viajamos a Monte León! Que tengan un muy buen viaje: cuiden el parque, sigan al guardaparque y disfruten mucho de los pingüinos. ¡Buen viaje!";

// El viaje es el miércoles 28/10/2026.
// Visible en el mapa hasta el 27/10/2026 a las 23:59:59.999 (hora argentina).
// En UTC: 2026-10-28T02:59:59.999Z.
export const FIN_ACTIVO_MS = new Date("2026-10-27T23:59:59.999-03:00").getTime();

// Ventana del mensaje de buen viaje:
// Desde el 27/10 a las 20:00 (AR) hasta el 28/10 a las 23:59:59.999 (AR).
export const INICIO_BUEN_VIAJE_MS = new Date("2026-10-27T20:00:00.000-03:00").getTime();
export const FIN_BUEN_VIAJE_MS = new Date("2026-10-28T23:59:59.999-03:00").getTime();

/**
 * ¿Está activo y visible en el mapa el mundo de Monte León?
 * Activo desde su publicación hasta el 27/10/2026 a las 23:59:59 (AR).
 * El 28/10 ya no aparece en el mapa porque los chicos están de viaje.
 */
export function estaActivoMonteLeon(now: Date = new Date()): boolean {
  return now.getTime() <= FIN_ACTIVO_MS;
}

/**
 * ¿Es momento de mostrar el cartel de «Buen viaje» y entregar la medalla?
 * Desde el 27/10 a las 20:00 (AR) hasta el 28/10 a las 23:59:59 (AR).
 */
export function esMomentoBuenViaje(now: Date = new Date()): boolean {
  const t = now.getTime();
  return t >= INICIO_BUEN_VIAJE_MS && t <= FIN_BUEN_VIAJE_MS;
}

/**
 * Días que faltan para el viaje (28/10/2026) en días calendario de Argentina.
 * Si hoy es 27/10 en AR, devuelve 1 («¡Mañana viajamos!»).
 * Si hoy es 28/10 en AR, devuelve 0 («¡Es hoy!»).
 */
export function diasParaElViaje(now: Date = new Date()): number {
  const arg = getArgentinaDate(now);
  const msHoy = Date.UTC(arg.year, arg.month - 1, arg.day);
  const msViaje = Date.UTC(2026, 9, 28); // 28 de octubre (mes 9 en 0-index)
  const diffDias = Math.round((msViaje - msHoy) / (24 * 60 * 60 * 1000));
  return Math.max(0, diffDias);
}

/**
 * Texto de cuenta regresiva para la tarjeta del mundo.
 */
export function textoCuentaRegresiva(now: Date = new Date()): string {
  const dias = diasParaElViaje(now);
  if (dias === 0) return "¡Hoy es el viaje a Monte León!";
  if (dias === 1) return "¡Mañana es el gran viaje!";
  return `¡Faltan ${dias} días para el viaje!`;
}

/**
 * ¿Debe mostrarse el mundo de Monte León a este alumno?
 * - Debe estar activo por fecha.
 * - Solo para 3.º grado (aula piloto o aulas de 3.º).
 * - Nunca en el aula abierta de prueba.
 */
export function debeMostrarMonteLeon(
  student: { grade?: number; classroomId?: string } | null | undefined,
  now: Date = new Date()
): boolean {
  if (!student) return false;
  if (isOpenClassroomStudent(student)) return false;
  // Configurable desde el panel (Desafíos y eventos): fechas, días y grados.
  return desafioActivo(DESAFIOS.monteLeon, student.grade ?? 3, now, () => estaActivoMonteLeon(now));
}

/**
 * ¿Debe mostrarse el cartel de buen viaje a este alumno?
 * - Debe estar dentro de la ventana del 27/10 20:00 al 28/10 23:59.
 * - Solo para 3.º grado (no aula abierta).
 */
export function debeMostrarBuenViaje(
  student: { grade?: number; classroomId?: string } | null | undefined,
  now: Date = new Date()
): boolean {
  if (!student) return false;
  if (!esMomentoBuenViaje(now)) return false;
  if (isOpenClassroomStudent(student)) return false;
  const grade = student.grade;
  return grade === undefined || grade === 3;
}
