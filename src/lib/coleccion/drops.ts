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
import { configDe, diaPermitido, idDrop, ventanaConfigurada } from "@/lib/eventos/config";
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

// Calendario de drops: siempre en los huecos entre temporadas (ver
// temporadas.ts), dejando días sin nada especial a la venta.
// Opciones generadas en ChatGPT el 4/10/2026 (láminas A y B, ver
// docs/CREDITOS-IMAGENES.md). Un ítem aparece cuando tiene imagen.
export const DROPS: Drop[] = [
  {
    id: "six-seven",
    label: "Six-Seven",
    emoji: "6️⃣7️⃣",
    desde: "2026-11-25", // miércoles; termina el martes 1/12
    dias: 7,
    mundosRequeridos: 3,
    items: [
      { id: "anteojos-67", label: "Anteojos 67", price: 60, slot: "eyewear", molde: "lentes-corazon", blurb: "Anteojos de fiesta con lentes 6 y 7." },
      { id: "vincha-67", label: "Vincha 67", price: 60, slot: "headwear", molde: "cuernitos-dragon", blurb: "Vincha con un 6 y un 7 con resortes." },
      { id: "gorra-67", label: "Gorra 67", price: 70, slot: "headwear", molde: "casco-bombero", blurb: "Gorra violeta con parche 67." },
      { id: "monio-67", label: "Moño 67", price: 40, slot: "face", molde: "corbatin-lunares", blurb: "Moño verde con 6 y 7." },
      { id: "medalla-67", label: "Medalla 67", price: 50, slot: "pendant", molde: "sol-de-mayo", blurb: "Medalla 67 con cinta arcoíris." },
      { id: "squishy-6", label: "Squishy 6", price: 50, slot: "pet", blurb: "Un 6 blandito y sonriente." },
      { id: "squishy-7", label: "Squishy 7", price: 50, slot: "pet", blurb: "Un 7 blandito y sonriente." },
      { id: "globos-67", label: "Globos 67", price: 40, slot: "prop", blurb: "Globos metalizados 6 y 7." },
    ],
    // El más buscado: solo para quienes están al día con sus mundos.
    superEspecial: { id: "cadena-67", label: "Cadena dorada 67", price: 120, slot: "pendant", molde: "collar-caracoles", blurb: "Cadena dorada con un 67 brillante." },
  },
  {
    id: "squishy-fest",
    label: "Squishy Fest",
    emoji: "🧸",
    desde: "2026-12-07", // lunes a viernes, antes de Navidad
    dias: 5,
    mundosRequeridos: 3,
    items: [
      { id: "squishy-tostada", label: "Tostada con manteca", price: 60, slot: "pet", blurb: "Tostada squishy con un cubito de manteca feliz." },
      { id: "squishy-gatito", label: "Gatito bollito", price: 60, slot: "pet", blurb: "Gatito redondo y blandito." },
      { id: "squishy-estrella", label: "Estrella squishy", price: 50, slot: "pet", blurb: "Estrella amarilla sonriente." },
      { id: "squishy-nube", label: "Nube squishy", price: 50, slot: "pet", blurb: "Nube con cachetes rosados." },
      { id: "squishy-leche", label: "Leche de frutilla", price: 50, slot: "prop", blurb: "Cajita de leche de frutilla con carita." },
      { id: "squishy-palta", label: "Palta squishy", price: 50, slot: "pet", blurb: "Media palta sonriente." },
      { id: "squishy-dumpling", label: "Dumpling squishy", price: 50, slot: "pet", blurb: "Bollito al vapor con carita." },
      { id: "squishy-pinguino", label: "Pingüino squishy", price: 60, slot: "pet", blurb: "Pingüino bebé redondito." },
    ],
    superEspecial: { id: "squishy-carpincho", label: "Carpincho squishy", price: 120, slot: "pet", blurb: "Carpincho con una mandarina en la cabeza." },
  },
];

const DAY = 86_400_000;
// Medianoche argentina (UTC−3) del día indicado, en ms.
function inicioAR(fecha: string): number {
  const [y, m, d] = fecha.split("-").map(Number);
  return Date.UTC(y, m - 1, d) + 3 * 3600 * 1000;
}

export function ventanaDrop(d: Drop): { desde: number; hasta: number } {
  // Fechas configuradas en el panel (Desafíos y eventos).
  const v = ventanaConfigurada(idDrop(d.id));
  if (v === "apagado") return { desde: 0, hasta: 0 };
  if (v) return v;
  const desde = inicioAR(d.desde);
  return { desde, hasta: desde + d.dias * DAY };
}

export function dropActivo(d: Drop, now: Date = new Date()): boolean {
  const { desde, hasta } = ventanaDrop(d);
  if (!(now.getTime() >= desde && now.getTime() < hasta)) return false;
  const cfg = configDe(idDrop(d.id));
  return !cfg || cfg.modo === "auto" || diaPermitido(cfg, now);
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
