// Vestidor de cuerpo completo (pedido de Pedro, 10/10/2026): el alumno elige
// un cuerpo base y lo viste combinando prendas por capas. Las prendas se
// ganan (metas especiales, ver src/lib/coleccion/metasDatos.ts) o se compran
// con monedas en la tienda. Cuatro vienen de regalo.
//
// Las imágenes están en public/theme/vestidor/{cuerpos,prendas}/<id>.png:
// todas en el mismo lienzo (512 × 768) y en la misma posición, así que se
// apilan una encima de la otra (ver scripts/coleccion/vestidor.py).
//
// Solo datos y reglas puras (las usan el servidor y las pantallas).

export type ZonaPrenda = "calzado" | "abajo" | "arriba" | "extra" | "abrigo" | "cabeza";

// Orden de dibujo, de abajo hacia arriba.
export const ORDEN_ZONAS: ZonaPrenda[] = ["calzado", "abajo", "arriba", "abrigo", "extra", "cabeza"];

export const NOMBRE_ZONA: Record<ZonaPrenda, string> = {
  arriba: "Remeras y buzos",
  abajo: "Pantalones y polleras",
  calzado: "Calzado",
  abrigo: "Abrigos",
  cabeza: "Gorros",
  extra: "Complementos",
};

export const EMOJI_ZONA: Record<ZonaPrenda, string> = {
  arriba: "👕",
  abajo: "👖",
  calzado: "👟",
  abrigo: "🧥",
  cabeza: "🧢",
  extra: "🧣",
};

export interface CuerpoDef {
  id: string;
  label: string;
}

export const CUERPOS: CuerpoDef[] = [
  { id: "nene-a", label: "Nene de pelo castaño" },
  { id: "nena-a", label: "Nena de colitas" },
  { id: "nene-b", label: "Nene de pelo negro" },
  { id: "nena-b", label: "Nena de rodete" },
];

export interface PrendaDef {
  id: string;
  label: string;
  zona: ZonaPrenda;
  // Con precio: se compra en la tienda. Sin precio: se gana con una meta
  // (o es de regalo, si `regalo`).
  precio?: number;
  regalo?: boolean;
  // Calzado alto (botas): se dibuja ENCIMA del pantalón.
  sobrePantalon?: boolean;
}

export const PRENDAS: PrendaDef[] = [
  // De regalo (todos las tienen desde el principio).
  { id: "remera-roja", label: "Remera roja", zona: "arriba", regalo: true },
  { id: "jean", label: "Jean", zona: "abajo", regalo: true },
  { id: "zapatillas-rojas", label: "Zapatillas rojas", zona: "calzado", regalo: true },
  { id: "guardapolvo", label: "Guardapolvo", zona: "abrigo", regalo: true },
  // Remeras y buzos
  { id: "remera-rayas", label: "Remera a rayas", zona: "arriba", precio: 40 },
  { id: "remera-pinguino", label: "Remera del pingüino", zona: "arriba", precio: 50 },
  { id: "chomba-verde", label: "Chomba verde", zona: "arriba", precio: 45 },
  { id: "camiseta-celeste", label: "Camiseta celeste y blanca", zona: "arriba", precio: 60 },
  { id: "buzo-escolar", label: "Buzo azul", zona: "arriba", precio: 55 },
  { id: "camisa-cuadros", label: "Camisa a cuadros", zona: "arriba", precio: 60 },
  { id: "buzo-guarda", label: "Buzo con guarda", zona: "arriba", precio: 80 },
  // Pantalones y polleras
  { id: "pollera-tableada", label: "Pollera tableada", zona: "abajo", precio: 45 },
  { id: "short-verde", label: "Short verde", zona: "abajo", precio: 35 },
  { id: "jogging-azul", label: "Jogging azul", zona: "abajo", precio: 45 },
  { id: "cargo-marron", label: "Pantalón cargo", zona: "abajo", precio: 55 },
  { id: "bombacha-campo", label: "Bombacha de campo", zona: "abajo", precio: 70 },
  // Calzado
  { id: "zapatillas-azules", label: "Zapatillas de lona", zona: "calzado", precio: 40 },
  { id: "alpargatas", label: "Alpargatas", zona: "calzado", precio: 35 },
  { id: "botas-lluvia", label: "Botas de lluvia", zona: "calzado", precio: 55, sobrePantalon: true },
  { id: "botas-nieve", label: "Botas de nieve", zona: "calzado", precio: 75, sobrePantalon: true },
  { id: "botines", label: "Botines de fútbol", zona: "calzado" }, // meta
  // Abrigos
  { id: "chaleco-polar", label: "Chaleco polar", zona: "abrigo", precio: 60 },
  { id: "campera-jean", label: "Campera de jean", zona: "abrigo", precio: 70 },
  { id: "piloto", label: "Piloto de lluvia", zona: "abrigo", precio: 70 },
  { id: "campera-inflable", label: "Campera inflable", zona: "abrigo", precio: 90 },
  { id: "poncho", label: "Poncho pampa", zona: "abrigo" }, // meta
  // Gorros
  { id: "gorra-visera", label: "Gorra", zona: "cabeza", precio: 40 },
  { id: "casco-bici", label: "Casco de bici", zona: "cabeza", precio: 50 },
  { id: "gorro-pompon", label: "Gorro con pompón", zona: "cabeza" }, // meta
  // Complementos
  { id: "guantes", label: "Guantes de lana", zona: "extra", precio: 30 },
  { id: "rinonera", label: "Riñonera", zona: "extra", precio: 35 },
  { id: "bufanda", label: "Bufanda a rayas", zona: "extra" }, // meta
];

export function getPrenda(id: string): PrendaDef | undefined {
  return PRENDAS.find((p) => p.id === id);
}

// Idea de Pedro: el cuerpo es «invisible». De cada personaje se dibujan solo
// la cabeza y las manos (el color de piel); debajo de toda la ropa va la
// misma ropa térmica gris con medias, igual para todos.
export const RUTA_TERMICA = "/theme/vestidor/cuerpos/_termica.png";

// Capas en el orden en que se dibujan (de abajo hacia arriba).
export function capasVestimenta(v: Vestimenta): string[] {
  const zonas = [...ORDEN_ZONAS];
  const calzado = v.puesto.calzado ? getPrenda(v.puesto.calzado) : undefined;
  if (calzado?.sobrePantalon) {
    zonas.splice(zonas.indexOf("calzado"), 1);
    zonas.splice(zonas.indexOf("abajo") + 1, 0, "calzado");
  }
  return [RUTA_TERMICA, rutaCuerpo(v.cuerpo), ...zonas.flatMap((z) => (v.puesto[z] ? [rutaPrenda(v.puesto[z]!)] : []))];
}

export function rutaCuerpo(id: string): string {
  return `/theme/vestidor/cuerpos/${id}.png`;
}
export function rutaPrenda(id: string, mini = false): string {
  return `/theme/vestidor/prendas/${id}${mini ? "-mini" : ""}.png`;
}

export interface Vestimenta {
  cuerpo: string;
  puesto: Partial<Record<ZonaPrenda, string>>;
}

export const VESTIMENTA_INICIAL: Vestimenta = {
  cuerpo: "nene-a",
  puesto: { arriba: "remera-roja", abajo: "jean", calzado: "zapatillas-rojas" },
};

// Prendas que tiene el alumno: las de regalo más las ganadas o compradas.
export function prendasDe(p: { prendas?: string[] }, disponibles?: Set<string>): string[] {
  const set = new Set([...PRENDAS.filter((x) => x.regalo).map((x) => x.id), ...(p.prendas ?? [])]);
  return [...set].filter((id) => getPrenda(id) && (!disponibles || disponibles.has(id)));
}

// Valida lo que manda la pantalla: cuerpo existente, cada prenda en su zona
// y solo prendas que tiene.
export function validarVestimenta(
  v: unknown,
  tiene: string[]
): { ok: true; vestimenta: Vestimenta } | { ok: false; error: string } {
  if (!v || typeof v !== "object") return { ok: false, error: "Vestimenta inválida." };
  const { cuerpo, puesto } = v as { cuerpo?: unknown; puesto?: unknown };
  if (typeof cuerpo !== "string" || !CUERPOS.some((c) => c.id === cuerpo)) return { ok: false, error: "Ese cuerpo no existe." };
  if (!puesto || typeof puesto !== "object") return { ok: false, error: "Vestimenta inválida." };
  const limpio: Vestimenta["puesto"] = {};
  for (const [zona, id] of Object.entries(puesto as Record<string, unknown>)) {
    if (id === null || id === undefined || id === "") continue;
    if (!ORDEN_ZONAS.includes(zona as ZonaPrenda)) return { ok: false, error: "Zona de ropa inválida." };
    if (typeof id !== "string") return { ok: false, error: "Prenda inválida." };
    const def = getPrenda(id);
    if (!def || def.zona !== zona) return { ok: false, error: "Esa prenda no va ahí." };
    if (!tiene.includes(id)) return { ok: false, error: `Todavía no tenés: ${def.label}.` };
    limpio[zona as ZonaPrenda] = id;
  }
  return { ok: true, vestimenta: { cuerpo, puesto: limpio } };
}
