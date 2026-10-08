// Préstamo Six-Seven del torneo (parte del servidor). Ver prestamo.ts.
import { torneoHabilitado } from "./tiempos";
import { DESAFIOS, desafioActivo } from "@/lib/eventos/config";
import { gradeOf } from "@/lib/grades";
import { findStudentByCode, getProgress, saveProgress, weekendSaturdayKey } from "@/lib/data";
import { getEligibility } from "@/lib/competition/server";
import { MAX_PENDING_WORLDS } from "@/lib/competition/shared";
import { ACCESSORY_CATALOG_TIENDA } from "@/types";
import { hastaDelPrestamo, IDS_PRESTAMO, prestamoVigente } from "./prestamo";

export interface EstadoPrestamo {
  jugoEsteFinde: boolean; // completó al menos una tabla del torneo esta semana (de sábado a viernes)
  alDia: boolean;
  pendientes: { id: number; name: string; emoji: string }[];
  maxPendientes: number;
  puedeElegir: boolean;
  opciones: string[]; // ids con dibujo que todavía no tiene comprados
  actual: { id: string; hasta: string } | null;
}

export async function estadoPrestamo(code: string, now: Date = new Date()): Promise<EstadoPrestamo | null> {
  const student = await findStudentByCode(code);
  if (!student) return null;
  const [progress, eleg] = await Promise.all([getProgress(student.code), getEligibility(student.code)]);
  const sat = weekendSaturdayKey(now);
  const jugoEsteFinde = Object.keys(progress.tablasTorneo?.[sat] ?? {}).length > 0;
  const propios = new Set(progress.shopCollection ?? []);
  const conDibujo = new Set(ACCESSORY_CATALOG_TIENDA.map((a) => a.id));
  const opciones = IDS_PRESTAMO.filter((id) => conDibujo.has(id) && !propios.has(id));
  const vigente = prestamoVigente(progress, now);
  return {
    jugoEsteFinde,
    alDia: eleg.eligible,
    pendientes: eleg.pending,
    maxPendientes: MAX_PENDING_WORLDS,
    puedeElegir: jugoEsteFinde && eleg.eligible && opciones.length > 0 && desafioActivo(DESAFIOS.prestamo67, gradeOf(student), now, () => torneoHabilitado(gradeOf(student), now)),
    opciones,
    actual: vigente && progress.prestamo67 ? { id: vigente, hasta: progress.prestamo67.hasta } : null,
  };
}

// Elige (o cambia) el accesorio prestado de esta semana.
export async function elegirPrestamo(code: string, id: string, now: Date = new Date()): Promise<{ ok: true; hasta: string } | { ok: false; error: string }> {
  const estado = await estadoPrestamo(code, now);
  if (!estado) return { ok: false, error: "Código no encontrado." };
  const alumno = await findStudentByCode(code);
  if (!desafioActivo(DESAFIOS.prestamo67, gradeOf(alumno), now, () => torneoHabilitado(gradeOf(alumno), now))) return { ok: false, error: "El préstamo no está disponible ahora." };
  if (!estado.jugoEsteFinde) return { ok: false, error: "Primero completá una tabla del Torneo de las tablas." };
  if (!estado.alDia) {
    return { ok: false, error: `Para el préstamo tenés que estar al día con tus mundos (podés tener hasta ${MAX_PENDING_WORLDS} sin terminar).` };
  }
  if (!estado.opciones.includes(id)) return { ok: false, error: "Ese accesorio no se puede pedir prestado." };
  const student = await findStudentByCode(code);
  const progress = await getProgress(student!.code);
  const semana = weekendSaturdayKey(now);
  const hasta = hastaDelPrestamo(semana);
  // Si cambia de accesorio, el anterior se saca del avatar.
  const anterior = progress.prestamo67?.id;
  const acc = { ...(progress.avatarAccessories ?? {}) };
  if (anterior && anterior !== id && !(progress.shopCollection ?? []).includes(anterior)) {
    for (const k of Object.keys(acc) as (keyof typeof acc)[]) if (acc[k] === anterior) delete acc[k];
  }
  await saveProgress({ ...progress, avatarAccessories: acc, prestamo67: { id, hasta, semana } });
  return { ok: true, hasta };
}
