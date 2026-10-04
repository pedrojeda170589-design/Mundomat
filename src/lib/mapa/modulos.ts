// MÓDULOS DEL MAPA DE MUNDOS: un viaje por Santa Cruz.
//
// Pedido de Pedro: «usar imágenes de diferentes localidades de Santa Cruz» y
// «tener en cuenta cuando pasemos de un módulo a otro en contenidos para
// poder cambiar la interfaz de fondo del mapa de mundos».
//
// Cada materia de un grado se divide en MÓDULOS de contenido (grupos de
// mundos seguidos que trabajan un mismo bloque: «Tablas y repartos»,
// «Figuras y medidas»...). Cada módulo sucede en un LUGAR de la provincia:
// al bajar por el mapa y pasar de un módulo al siguiente, el paisaje de
// fondo cambia (con un cartel que lo anuncia y el profe vestido para la
// ocasión).
//
// Para sumar módulos a un grado nuevo (4.º a 7.º): agregar sus entradas en
// MODULOS (grado → materia → lista). Si un grado o materia no tiene módulos,
// el mapa usa el fondo de siempre del ambiente del grado.
import type { WorldDef, WorldSubject } from "@/types";
import type { PoseProfe } from "@/components/Profe";

export interface Lugar {
  id: string;
  nombre: string; // como aparece en el cartel
  localidad: string; // dónde queda
  imagen: string; // fondo vertical (1024×1536)
  listo?: boolean; // true cuando la imagen ya está en public/
}

// Lugares de Santa Cruz (ilustraciones propias, sin marcas ni fotos de
// terceros: ver docs/CREDITOS-IMAGENES.md).
export const LUGARES: Record<string, Lugar> = {
  "cerro-ventana": {
    id: "cerro-ventana",
    nombre: "Cerro Ventana",
    localidad: "Gobernador Gregores",
    imagen: "/theme/santa-cruz/cerro-ventana.jpg",
    listo: true,
  },
  chalten: {
    id: "chalten",
    nombre: "Cerro Fitz Roy",
    localidad: "El Chaltén",
    imagen: "/theme/santa-cruz/chalten.jpg",
    listo: true,
  },
  glaciar: {
    id: "glaciar",
    nombre: "Glaciar Perito Moreno",
    localidad: "El Calafate",
    imagen: "/theme/santa-cruz/glaciar.jpg",
    listo: true,
  },
  "cueva-manos": {
    id: "cueva-manos",
    nombre: "Cueva de las Manos",
    localidad: "Cañadón del Río Pinturas",
    imagen: "/theme/santa-cruz/cueva-manos.jpg",
    listo: true,
  },
  "bosque-petrificado": {
    id: "bosque-petrificado",
    nombre: "Bosque Petrificado",
    localidad: "Jaramillo",
    imagen: "/theme/santa-cruz/bosque-petrificado.jpg",
    listo: true,
  },
  "puerto-deseado": {
    id: "puerto-deseado",
    nombre: "Ría Deseado",
    localidad: "Puerto Deseado",
    imagen: "/theme/santa-cruz/puerto-deseado.jpg",
    listo: true,
  },
};

export interface ModuloDef {
  titulo: string;
  lugar: keyof typeof LUGARES;
  profe: PoseProfe; // vestimenta del profe en el cartel
  mundos: number[]; // ids de los mundos que ABREN o forman el módulo
}

// 3.º grado (aula piloto): la meseta central y sus alrededores.
const TERCERO: Partial<Record<WorldSubject, ModuloDef[]>> = {
  matematica: [
    { titulo: "Números y cálculo", lugar: "cerro-ventana", profe: "matematico", mundos: [1, 2, 3, 4] },
    { titulo: "Tablas y repartos", lugar: "chalten", profe: "andinista", mundos: [5, 6, 7, 8] },
    { titulo: "Figuras y medidas", lugar: "bosque-petrificado", profe: "almacenero", mundos: [9, 10] },
    { titulo: "Problemas y números grandes", lugar: "glaciar", profe: "guardaparque", mundos: [11, 12, 13, 14] },
  ],
  lengua: [
    { titulo: "Hablar, leer y escribir", lugar: "cerro-ventana", profe: "escritor", mundos: [15, 16, 31101, 17] },
    { titulo: "Palabras y leyendas", lugar: "cueva-manos", profe: "explorador", mundos: [18, 31102, 19, 20] },
    { titulo: "Escribir y opinar", lugar: "puerto-deseado", profe: "escritor", mundos: [31103, 21, 22, 31104, 23] },
    { titulo: "Lectores autónomos", lugar: "glaciar", profe: "guardaparque", mundos: [24, 31105, 25, 26, 31106] },
  ],
  sociales: [
    { titulo: "Paisajes y autoridades", lugar: "cerro-ventana", profe: "gaucho", mundos: [39, 40, 41] },
    { titulo: "Trabajo y patrimonio", lugar: "cueva-manos", profe: "explorador", mundos: [42, 43, 44] },
    { titulo: "Transportes e historia", lugar: "puerto-deseado", profe: "gaucho", mundos: [45, 46, 47] },
  ],
  naturales: [
    { titulo: "Seres vivos y materiales", lugar: "glaciar", profe: "guardaparque", mundos: [27, 28, 29, 30] },
    { titulo: "Naturaleza, sonido y cielo", lugar: "chalten", profe: "astronomo", mundos: [31, 32, 33, 34] },
    { titulo: "Investigadores", lugar: "bosque-petrificado", profe: "cientifico", mundos: [35, 36, 37, 38] },
  ],
};

export const MODULOS: Record<number, Partial<Record<WorldSubject, ModuloDef[]>>> = {
  3: TERCERO,
};

// Vestimenta del profe para un mundo: la de su módulo y, si no tiene,
// una según el tema o la materia.
const POR_CATEGORIA: Record<string, PoseProfe> = {
  tabla: "matematico",
  reparto: "matematico",
  medidas: "almacenero",
  problemas: "almacenero",
  "cielo-fenomenos-atmosfericos": "astronomo",
  "cuerpos-tiempo": "astronomo",
  "materiales-mezclas": "cientifico",
  "materiales-cambios-estado": "cientifico",
  "fenomenos-fisicos-basicos": "cientifico",
  "fenomenos-fisicos-integracion": "cientifico",
  "patrimonio-cambios": "explorador",
  "linea-tiempo-historica": "explorador",
  "lectura-cuentos": "escritor",
};
const POR_MATERIA: Record<WorldSubject, PoseProfe> = {
  matematica: "matematico",
  lengua: "escritor",
  sociales: "gaucho",
  naturales: "guardaparque",
};
export function profeDelMundo(w: WorldDef): PoseProfe {
  const cat = POR_CATEGORIA[w.category];
  if (cat) return cat;
  for (const porMateria of Object.values(MODULOS)) {
    const m = porMateria[w.subject]?.find((x) => x.mundos.includes(w.id));
    if (m) return m.profe;
  }
  return POR_MATERIA[w.subject] ?? "aplaude";
}

// Tramo del mapa: módulo + desde qué isla hasta cuál (índices del mapa).
export interface TramoMapa {
  numero: number; // 1, 2, 3...
  modulo: ModuloDef;
  lugar: Lugar;
  desde: number;
  hasta: number; // inclusive
}

// Reparte las islas del mapa (en su orden) entre los módulos. Las islas
// que no están en ningún módulo (dictado, zonas de práctica, refuerzos) se
// quedan en el módulo del mundo que tienen al lado; si van al principio,
// en el primero.
export function tramosDelMapa(grade: number, subject: WorldSubject, worlds: WorldDef[]): TramoMapa[] {
  const mods = MODULOS[grade]?.[subject];
  if (!mods?.length || !worlds.length) return [];
  // Hasta tener todos los paisajes de la materia, el mapa sigue como siempre.
  if (mods.some((m) => !LUGARES[m.lugar].listo)) return [];
  const deMundo = new Map<number, number>();
  mods.forEach((m, i) => m.mundos.forEach((id) => deMundo.set(id, i)));
  // Módulo de cada isla: el propio, o el del último mundo con módulo (sin bajar nunca).
  const asignado: number[] = [];
  let actual = 0;
  worlds.forEach((w) => {
    const m = deMundo.get(w.id);
    if (m !== undefined && m > actual) actual = m;
    asignado.push(actual);
  });
  const tramos: TramoMapa[] = [];
  asignado.forEach((m, i) => {
    const ult = tramos[tramos.length - 1];
    if (ult && ult.modulo === mods[m]) ult.hasta = i;
    else tramos.push({ numero: tramos.length + 1, modulo: mods[m], lugar: LUGARES[mods[m].lugar], desde: i, hasta: i });
  });
  return tramos;
}

// Módulo en el que está el alumno: el del primer mundo sin completar.
export function tramoActual(tramos: TramoMapa[], worlds: WorldDef[], completados: number[]): TramoMapa | undefined {
  const hechos = new Set(completados);
  const i = worlds.findIndex((w) => !hechos.has(w.id) && w.kind !== "dictado");
  return tramos.find((t) => i >= t.desde && i <= t.hasta) ?? tramos[tramos.length - 1];
}
