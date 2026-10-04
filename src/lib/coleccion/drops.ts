// DROPS: lanzamientos cortos de la tienda (pedido de Pedro, octubre 2026).
//
// - Duran 3, 5 o 7 días, en fechas puntuales (no vuelven cada año: son
//   exclusivos de ese lanzamiento).
// - Para COMPRAR hay que superar antes `mundosRequeridos` mundos (90 % o
//   más) desde que empezó el drop, y además pagar el precio.
// - Objeto SUPERESPECIAL: solo lo ve (y lo puede comprar) quien está «al
//   día»: superó 3 mundos o más con 90 %+ en los últimos 7 días y no tiene
//   mundos «a fortalecer» pendientes. A los demás no les aparece.
//
// Solo datos y reglas puras (sin imports de la app salvo tipos), así lo usan
// el servidor (compra) y la tienda (qué mostrar).
import type { StudentProgress } from "@/types";
import type { ItemColeccion } from "./temporadas";

export interface Drop {
  id: string;
  label: string;
  emoji: string;
  desde: string; // "AAAA-MM-DD", hora argentina
  dias: 3 | 5 | 7;
  mundosRequeridos: number; // para poder comprar
  items: ItemColeccion[];
  superEspecial?: ItemColeccion;
}

export const AL_DIA_MUNDOS = 3;
export const AL_DIA_DIAS = 7;

// Los ítems se definen cuando Pedro elige de las opciones (y tienen imagen).
export const DROPS: Drop[] = [];

const DAY = 86_400_000;
// Medianoche argentina (UTC−3) del día indicado, en ms.
function inicioAR(fecha: string): number {
  const [y, m, d] = fecha.split("-").map(Number);
  return Date.UTC(y, m - 1, d) + 3 * 3600 * 1000;
}

export function ventanaDrop(d: Drop): { desde: number; hasta: number } {
  const desde = inicioAR(d.desde);
  return { desde, hasta: desde + d.dias * DAY };
}

export function dropActivo(d: Drop, now: Date = new Date()): boolean {
  const { desde, hasta } = ventanaDrop(d);
  return now.getTime() >= desde && now.getTime() < hasta;
}

// Lo que queda: «quedan 2 días», «¡último día!», «quedan 5 horas».
export function textoDrop(d: Drop, now: Date = new Date()): string {
  const ms = ventanaDrop(d).hasta - now.getTime();
  if (ms <= 0) return "Terminó";
  const horas = Math.ceil(ms / 3_600_000);
  if (horas <= 24) return horas <= 1 ? "¡Última hora!" : `¡Último día! Quedan ${horas} h`;
  return `Quedan ${Math.ceil(ms / DAY)} días`;
}

export function getDrop(id: string): Drop | undefined {
  return DROPS.find((d) => d.id === id);
}

// Mundos superados (90 %+) desde que empezó el drop.
export function mundosEnDrop(p: StudentProgress, d: Drop): number {
  const { desde, hasta } = ventanaDrop(d);
  const set = new Set(
    (p.pasesRecientes ?? []).filter((x) => {
      const t = Date.parse(x.at);
      return t >= desde && t < hasta;
    }).map((x) => x.w)
  );
  return set.size;
}

// «Al día»: 3+ mundos superados en los últimos 7 días y nada a fortalecer.
export function estaAlDia(p: StudentProgress, now: Date = new Date()): boolean {
  if ((p.worldsNeedingTeacherReview ?? []).length > 0) return false;
  const desde = now.getTime() - AL_DIA_DIAS * DAY;
  const set = new Set((p.pasesRecientes ?? []).filter((x) => Date.parse(x.at) >= desde).map((x) => x.w));
  return set.size >= AL_DIA_MUNDOS;
}

// ¿Puede comprar este ítem del drop ahora? (si no, el motivo para mostrar)
export function puedeComprarDrop(p: StudentProgress, d: Drop, superEspecial: boolean, now: Date = new Date()): { ok: true } | { ok: false; motivo: string } {
  if (!dropActivo(d, now)) return { ok: false, motivo: "Este lanzamiento ya no está disponible." };
  if (superEspecial && !estaAlDia(p, now)) return { ok: false, motivo: "Este objeto es solo para quienes están al día con sus mundos." };
  const hechos = mundosEnDrop(p, d);
  if (hechos < d.mundosRequeridos) {
    return { ok: false, motivo: `Primero superá ${d.mundosRequeridos} mundos con 90 % o más (llevás ${hechos}).` };
  }
  return { ok: true };
}
