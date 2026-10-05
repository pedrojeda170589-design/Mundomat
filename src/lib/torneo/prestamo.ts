// Préstamo de un accesorio Six-Seven (pedido de Pedro, oct. 2026).
//
// Quien juega el Repaso de las tablas en la semana Y está al día con sus
// mundos habilitados (como mucho MAX_PENDING_WORLDS sin terminar, la misma
// regla de la competencia) puede elegir UN accesorio Six-Seven prestado por
// el resto de la semana: hasta el viernes a la noche (cuando empieza el
// torneo siguiente). Después se devuelve solo: deja de estar puesto en el
// avatar y ya no aparece en el perfil.
//
// Solo reglas puras (las usan el servidor, el perfil y el torneo).
import type { StudentProgress } from "@/types";
import { DROPS } from "@/lib/coleccion/drops";

const DIA = 86_400_000;
export const DROP_PRESTAMO = "six-seven";

// Accesorios que se pueden pedir prestados: los del drop Six-Seven (sin el
// superespecial, que sigue siendo solo de la tienda).
export const IDS_PRESTAMO: string[] = (DROPS.find((d) => d.id === DROP_PRESTAMO)?.items ?? []).map((o) => o.id);

// Medianoche argentina (UTC−3) del sábado "AAAA-MM-DD".
function inicioAR(fecha: string): number {
  const [y, m, d] = fecha.split("-").map(Number);
  return Date.UTC(y, m - 1, d) + 3 * 3600 * 1000;
}

// Hasta cuándo dura un préstamo pedido en la semana que empieza ese sábado:
// hasta el viernes a las 23:59 (hora argentina).
export function hastaDelPrestamo(sabado: string): string {
  return new Date(inicioAR(sabado) + 7 * DIA - 1000).toISOString();
}

export function prestamoVigente(p: Pick<StudentProgress, "prestamo67">, now: Date = new Date()): string | null {
  const pr = p.prestamo67;
  if (!pr) return null;
  return now.getTime() <= Date.parse(pr.hasta) ? pr.id : null;
}

// Colección «de tienda» con el préstamo vigente sumado (para validar qué se
// puede poner en el avatar y para mostrarlo en el perfil).
export function tiendaConPrestamo(p: Pick<StudentProgress, "shopCollection" | "prestamo67">, now: Date = new Date()): string[] {
  const propio = p.shopCollection ?? [];
  const id = prestamoVigente(p, now);
  return id && !propio.includes(id) ? [...propio, id] : propio;
}

// Devuelve el préstamo vencido: lo saca del avatar (si no lo compró) y borra
// el registro. Si no venció, devuelve el mismo objeto.
export function devolverPrestamoVencido<T extends StudentProgress>(p: T, now: Date = new Date()): T {
  const pr = p.prestamo67;
  if (!pr || prestamoVigente(p, now)) return p;
  const next = { ...p };
  delete next.prestamo67;
  if (!(p.shopCollection ?? []).includes(pr.id) && p.avatarAccessories) {
    const acc = { ...p.avatarAccessories };
    for (const k of Object.keys(acc) as (keyof typeof acc)[]) {
      if (acc[k] === pr.id) delete acc[k];
    }
    next.avatarAccessories = acc;
  }
  return next;
}

// «viernes 9/10» (hora argentina), para mostrar hasta cuándo dura.
export function textoHasta(iso: string): string {
  const d = new Date(Date.parse(iso) - 3 * 3600 * 1000);
  const dias = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
  return `${dias[d.getUTCDay()]} ${d.getUTCDate()}/${d.getUTCMonth() + 1}`;
}
