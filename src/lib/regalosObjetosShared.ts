// Regalar objetos ganados (reglas puras, también para el navegador).
// Ver regalosObjetos.ts.
import { ACCESSORY_CATALOG_PREMIO, ACCESSORY_CATALOG_TEMPORADA, type StudentProgress } from "@/types";
import { prestamoVigente } from "@/lib/torneo/prestamo";

export const DIAS_PARA_RESPONDER = 7;
export const MAX_REGALOS_OBJETO_POR_DIA = 3;
export const MAX_EN_CAMINO = 5;

export type EstadoRegalo = "pendiente" | "aceptado" | "rechazado" | "vencido" | "devuelto";

export interface RegaloObjeto {
  id: string;
  at: string;
  from: string; // código de quien regala
  to: string; // código de quien lo recibe
  itemId: string;
  estado: EstadoRegalo;
  respondidoAt?: string;
}

// Objetos ganados (con dibujo): temporadas, premios del torneo, legendarios,
// camino de premios, mascotas de logro.
const GANABLES = new Set([...ACCESSORY_CATALOG_TEMPORADA, ...ACCESSORY_CATALOG_PREMIO].map((a) => a.id));

// Los que este alumno puede regalar ahora: ganados, suyos y no prestados.
export function objetosRegalables(p: Pick<StudentProgress, "seasonalCollection" | "torneoPrestados" | "prestamo67">): string[] {
  const prestados = new Set((p.torneoPrestados ?? []).map((x) => x.id));
  const sixSeven = prestamoVigente(p);
  if (sixSeven) prestados.add(sixSeven);
  return (p.seasonalCollection ?? []).filter((id) => GANABLES.has(id) && !prestados.has(id));
}

export const TEXTO_RESPUESTA: Record<Exclude<EstadoRegalo, "pendiente">, string> = {
  aceptado: "aceptó tu regalo",
  rechazado: "no aceptó tu regalo (volvió a tu colección)",
  vencido: "no respondió a tiempo: tu regalo volvió a tu colección",
  devuelto: "ya lo tenía: tu regalo volvió a tu colección",
};
