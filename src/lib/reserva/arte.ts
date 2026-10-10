// Rutas de las ilustraciones de la Reserva patagónica (public/theme/reserva).
import { ESPECIES, OBJETOS, EMBLEMAS, MEDALLA_SANTA_CRUZ } from "./fichas";

const OBJETOS_Y_MEDALLA = [...OBJETOS, MEDALLA_SANTA_CRUZ];

export const rutaPostal = (territorio: string) => `/theme/reserva/postales/${territorio}.jpg`;

export type TipoPremio = "animal" | "planta" | "objeto" | "emblema";

export function tipoDePremio(id: string): TipoPremio | null {
  const e = ESPECIES.find((x) => x.id === id);
  if (e) return e.tipo;
  if (OBJETOS_Y_MEDALLA.some((x) => x.id === id)) return "objeto";
  if (EMBLEMAS.some((x) => x.id === id)) return "emblema";
  return null;
}

export function rutaPremio(id: string): string {
  const t = tipoDePremio(id);
  if (t === "animal" || t === "planta") return `/theme/reserva/especies/${id}.png`;
  if (t === "objeto") return `/theme/reserva/objetos/${id}.png`;
  return `/theme/reserva/emblemas/${id}.png`;
}

export function nombrePremio(id: string): string {
  return ESPECIES.find((x) => x.id === id)?.nombre ?? OBJETOS_Y_MEDALLA.find((x) => x.id === id)?.nombre ?? EMBLEMAS.find((x) => x.id === id)?.nombre ?? id;
}

export function emojiPremio(id: string): string {
  const e = ESPECIES.find((x) => x.id === id);
  if (e) return e.emoji;
  const o = OBJETOS_Y_MEDALLA.find((x) => x.id === id);
  if (o) return o.emoji;
  const m = EMBLEMAS.find((x) => x.id === id);
  return m?.tipo === "bandera" ? "🏳️" : "🛡️";
}
