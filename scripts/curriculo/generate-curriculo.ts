import * as fs from "node:fs";
import * as path from "node:path";
import { WORLDS } from "@/lib/worlds";
import { GRADE1_WORLDS } from "@/lib/grade1/worlds";
import { GRADE2_WORLDS } from "@/lib/grade2/worlds";
import { WorldDef, WorldSubject } from "@/types";

interface CurriculoEntry {
  area: string;
  eje: string;
  contenido: string;
  fuente: string;
  validado: boolean;
}

const AREA_LABELS: Record<WorldSubject, string> = {
  matematica: "Matemática",
  lengua: "Lengua",
  sociales: "Ciencias Sociales",
  naturales: "Ciencias Naturales",
};

// Determina el eje de Santa Cruz para Matemática
function getEjeMatematica(w: WorldDef): { eje: string; fuente: string } {
  const cat = w.category ?? "";
  const name = w.name.toLowerCase();
  const desc = (w.description + " " + (w.objective ?? "")).toLowerCase();

  if (
    cat.includes("espacio") ||
    cat.includes("geometria") ||
    cat.includes("cuerpos") ||
    name.includes("figura") ||
    name.includes("espacio") ||
    name.includes("croquis") ||
    name.includes("cuerpo")
  ) {
    return { eje: "Geometría y Espacio", fuente: "DC Santa Cruz 1.er ciclo, p. 94" };
  }
  if (
    cat.includes("medida") ||
    cat.includes("tiempo") ||
    name.includes("medida") ||
    name.includes("tiempo") ||
    desc.includes("longitud") ||
    desc.includes("peso") ||
    desc.includes("capacidad")
  ) {
    return { eje: "La Medida", fuente: "DC Santa Cruz 1.er ciclo, p. 96" };
  }
  return { eje: "Número y Operaciones", fuente: "DC Santa Cruz 1.er ciclo, p. 88" };
}

// Determina el eje de Santa Cruz para Lengua
function getEjeLengua(w: WorldDef): { eje: string; fuente: string } {
  const cat = w.category ?? "";
  const name = w.name.toLowerCase();
  const desc = (w.description + " " + (w.objective ?? "")).toLowerCase();

  if (
    cat.includes("oralidad") ||
    cat.includes("dialogo") ||
    cat.includes("debate") ||
    name.includes("conversación") ||
    name.includes("hablar") ||
    name.includes("debate")
  ) {
    return { eje: "Comprensión y Producción Oral", fuente: "DC Santa Cruz 1.er ciclo, p. 28" };
  }
  if (
    cat.includes("lectura") ||
    w.storyId ||
    name.includes("cuento") ||
    name.includes("leyenda") ||
    name.includes("fábula") ||
    name.includes("leer") ||
    name.includes("lectura") ||
    name.includes("faro") ||
    name.includes("castillo")
  ) {
    return { eje: "Lectura", fuente: "DC Santa Cruz 1.er ciclo, p. 31" };
  }
  if (
    cat.includes("escritura") ||
    name.includes("escribir") ||
    name.includes("oficina de correos") ||
    name.includes("estudio de los cuentos")
  ) {
    return { eje: "Escritura", fuente: "DC Santa Cruz 1.er ciclo, p. 36" };
  }
  return { eje: "Reflexión sobre la Lengua y los Textos", fuente: "DC Santa Cruz 1.er ciclo, p. 39" };
}

// Determina el eje de Santa Cruz para Ciencias Sociales
function getEjeSociales(w: WorldDef): { eje: string; fuente: string } {
  const name = w.name.toLowerCase();
  const desc = (w.description + " " + (w.objective ?? "")).toLowerCase();

  if (
    name.includes("pasado") ||
    name.includes("histori") ||
    name.includes("colonial") ||
    name.includes("originario") ||
    name.includes("independencia") ||
    name.includes("revolución") ||
    desc.includes("tiempo histórico") ||
    desc.includes("época") ||
    desc.includes("pasado")
  ) {
    return { eje: "Las sociedades a través del tiempo", fuente: "DC Santa Cruz 1.er ciclo, p. 36" };
  }
  if (
    name.includes("gobierno") ||
    name.includes("comunidad") ||
    name.includes("cabildo") ||
    name.includes("municipal") ||
    name.includes("ciudadan") ||
    name.includes("derecho") ||
    name.includes("convivencia") ||
    desc.includes("instituciones") ||
    desc.includes("normas") ||
    desc.includes("derechos")
  ) {
    return { eje: "Las actividades humanas y la organización social", fuente: "DC Santa Cruz 1.er ciclo, p. 38" };
  }
  return { eje: "Las sociedades y los espacios geográficos", fuente: "DC Santa Cruz 1.er ciclo, p. 34" };
}

// Determina el eje de Santa Cruz para Ciencias Naturales
function getEjeNaturales(w: WorldDef): { eje: string; fuente: string } {
  const name = w.name.toLowerCase();
  const desc = (w.description + " " + (w.objective ?? "")).toLowerCase();

  if (
    name.includes("material") ||
    name.includes("mezcla") ||
    name.includes("transforma") ||
    name.includes("líquid") ||
    name.includes("sólid") ||
    desc.includes("materiales") ||
    desc.includes("mezclas")
  ) {
    return { eje: "Los materiales y sus cambios", fuente: "DC Santa Cruz 1.er ciclo, p. 29" };
  }
  if (
    name.includes("sonido") ||
    name.includes("calor") ||
    name.includes("luz") ||
    name.includes("cielo") ||
    name.includes("físico") ||
    name.includes("experimento") ||
    name.includes("movimiento") ||
    desc.includes("fuerza") ||
    desc.includes("astronóm") ||
    desc.includes("óptica")
  ) {
    return { eje: "Los fenómenos del mundo físico", fuente: "DC Santa Cruz 1.er ciclo, p. 31" };
  }
  return { eje: "Los seres vivos: diversidad, unidad, interrelaciones y cambios", fuente: "DC Santa Cruz 1.er ciclo, p. 26" };
}

// Contenido específico para mundos de 3.º grado que no tenían contents explícito
const G3_CURRICULAR_CONTENT: Record<number, { eje: string; contenido: string; fuente: string }> = {
  1: {
    eje: "Número y Operaciones",
    contenido: "Resolución de problemas que permiten retomar la lectura, escritura y orden de los números hasta aproximadamente 1.000 ó 1.500.",
    fuente: "DC Santa Cruz 1.er ciclo, p. 88",
  },
  2: {
    eje: "Número y Operaciones",
    contenido: "Resolución de problemas de suma y resta que involucran distintos sentidos (unir, agregar, ganar, avanzar, quitar, perder) y uso de cálculos.",
    fuente: "DC Santa Cruz 1.er ciclo, p. 89",
  },
  3: {
    eje: "Número y Operaciones",
    contenido: "Construcción y utilización de estrategias de cálculo mental para resolver sumas y restas con repertorio memorizado.",
    fuente: "DC Santa Cruz 1.er ciclo, p. 90",
  },
  4: {
    eje: "Geometría y Espacio",
    contenido: "Ubicación espacial, interpretación y producción de croquis y planos del espacio cercano con puntos de referencia.",
    fuente: "DC Santa Cruz 1.er ciclo, p. 94",
  },
  5: {
    eje: "Número y Operaciones",
    contenido: "Resolución de problemas de proporcionalidad directa y organizaciones rectangulares mediante tablas del 2, 5 y 10.",
    fuente: "DC Santa Cruz 1.er ciclo, p. 91",
  },
  6: {
    eje: "Número y Operaciones",
    contenido: "Análisis de relaciones numéricas y regularidades en las tablas de multiplicar intermedias (3, 4 y 6).",
    fuente: "DC Santa Cruz 1.er ciclo, p. 91",
  },
  7: {
    eje: "Número y Operaciones",
    contenido: "Uso progresivo de resultados memorizados y estrategias de cálculo multiplicativo con factores mayores (7, 8 y 9).",
    fuente: "DC Santa Cruz 1.er ciclo, p. 91",
  },
  8: {
    eje: "Número y Operaciones",
    contenido: "Resolución de problemas de partición y reparto equitativo analizando el cociente y el resto.",
    fuente: "DC Santa Cruz 1.er ciclo, p. 92",
  },
  9: {
    eje: "Geometría y Espacio",
    contenido: "Reconocimiento y descripción de figuras geométricas (lados, vértices, diagonales) y relaciones entre triángulos y cuadriláteros.",
    fuente: "DC Santa Cruz 1.er ciclo, p. 95",
  },
  10: {
    eje: "La Medida",
    contenido: "Estimación y medición de longitudes, pesos y capacidades con unidades convencionales (metro, centímetro, kilo, litro).",
    fuente: "DC Santa Cruz 1.er ciclo, p. 96",
  },
  11: {
    eje: "Número y Operaciones",
    contenido: "Resolución de problemas complejos que combinan las cuatro operaciones básicas e interpretación de la información del enunciado.",
    fuente: "DC Santa Cruz 1.er ciclo, p. 92",
  },
  12: {
    eje: "Número y Operaciones",
    contenido: "Uso de fracciones de uso social habitual (1/2, 1/4, 3/4) en situaciones de reparto y medición.",
    fuente: "DC Santa Cruz 1.er ciclo, p. 93",
  },
  13: {
    eje: "Número y Operaciones",
    contenido: "Exploración de la serie numérica hasta el 10.000: lectura, escritura, orden y valor posicional de las cifras (miles, cienes, dieces, unos).",
    fuente: "DC Santa Cruz 1.er ciclo, p. 89",
  },
  14: {
    eje: "Geometría y Espacio",
    contenido: "Exploración de cuerpos geométricos (caras, aristas, vértices) y lectura horaria en reloj de agujas y digital.",
    fuente: "DC Santa Cruz 1.er ciclo, p. 95",
  },
  15: {
    eje: "Comprensión y Producción Oral",
    contenido: "Participación en conversaciones áulicas, narración de experiencias y descripción oral fluida de objetos y situaciones.",
    fuente: "DC Santa Cruz 1.er ciclo, p. 28",
  },
  16: {
    eje: "Lectura",
    contenido: "Frecuentación asidua de cuentos de autores consagrados, recuperación de la secuencia argumental e inferencias directas.",
    fuente: "DC Santa Cruz 1.er ciclo, p. 32",
  },
  17: {
    eje: "Escritura",
    contenido: "Escritura autónoma de palabras y oraciones complejas con correspondencia fonema-grafema y separación de palabras.",
    fuente: "DC Santa Cruz 1.er ciclo, p. 37",
  },
  18: {
    eje: "Reflexión sobre la Lengua y los Textos",
    contenido: "Reconocimiento y clasificación de sustantivos comunes y propios, adjetivos calificativos y concordancia de género y número.",
    fuente: "DC Santa Cruz 1.er ciclo, p. 40",
  },
  19: {
    eje: "Lectura",
    contenido: "Lectura comprensiva de leyendas y relatos tradicionales de los pueblos originarios de la región patagónica y argentina.",
    fuente: "DC Santa Cruz 1.er ciclo, p. 33",
  },
  20: {
    eje: "Lectura",
    contenido: "Lectura de textos informativos breves, notas de enciclopedia y localización de datos específicos en el texto.",
    fuente: "DC Santa Cruz 1.er ciclo, p. 34",
  },
  21: {
    eje: "Escritura",
    contenido: "Producción de cartas personales, notas y mensajes considerando el destinatario, la estructura y fórmulas de cortesía.",
    fuente: "DC Santa Cruz 1.er ciclo, p. 38",
  },
  22: {
    eje: "Reflexión sobre la Lengua y los Textos",
    contenido: "Familias de palabras, derivación léxica mediante prefijos y sufijos de uso frecuente y ortografía de la raíz.",
    fuente: "DC Santa Cruz 1.er ciclo, p. 40",
  },
  23: {
    eje: "Comprensión y Producción Oral",
    contenido: "Participación en intercambios orales de opinión, escucha atenta del punto de vista ajeno y fundamentación de ideas.",
    fuente: "DC Santa Cruz 1.er ciclo, p. 29",
  },
  24: {
    eje: "Lectura",
    contenido: "Lectura autónoma, fluida y con entonación de textos narrativos extensos de literatura infantil.",
    fuente: "DC Santa Cruz 1.er ciclo, p. 33",
  },
  25: {
    eje: "Escritura",
    contenido: "Escritura de relatos narrativos breves respetando la estructura canónica (inicio, conflicto, desenlace).",
    fuente: "DC Santa Cruz 1.er ciclo, p. 37",
  },
  26: {
    eje: "Reflexión sobre la Lengua y los Textos",
    contenido: "Relaciones de sinonimia y antonimia en textos diversos para evitar repeticiones y enriquecer el vocabulario.",
    fuente: "DC Santa Cruz 1.er ciclo, p. 41",
  },
  27: {
    eje: "Los seres vivos: diversidad, unidad, interrelaciones y cambios",
    contenido: "Reconocimiento de la flora y fauna autóctona de Santa Cruz y sus adaptaciones a las condiciones ambientales.",
    fuente: "DC Santa Cruz 1.er ciclo, p. 26",
  },
  28: {
    eje: "Los materiales y sus cambios",
    contenido: "Exploración de mezclas de sólidos y líquidos y métodos sencillos de separación (tamización, filtración, decantación).",
    fuente: "DC Santa Cruz 1.er ciclo, p. 29",
  },
  29: {
    eje: "Los fenómenos del mundo físico",
    contenido: "Efectos del calor en los objetos, nociones de temperatura y propagación térmica en materiales cotidianos.",
    fuente: "DC Santa Cruz 1.er ciclo, p. 31",
  },
  30: {
    eje: "Los seres vivos: diversidad, unidad, interrelaciones y cambios",
    contenido: "Observación y descripción de paisajes naturales y modificados por la acción humana en la región patagónica.",
    fuente: "DC Santa Cruz 1.er ciclo, p. 27",
  },
  31: {
    eje: "Los seres vivos: diversidad, unidad, interrelaciones y cambios",
    contenido: "Cadenas alimentarias y relaciones de interdependencia entre productores, consumidores y descomponedores.",
    fuente: "DC Santa Cruz 1.er ciclo, p. 27",
  },
  32: {
    eje: "Los materiales y sus cambios",
    contenido: "Cambios de estado de agregación de la materia (fusión, solidificación, evaporación, condensación) en el ciclo del agua.",
    fuente: "DC Santa Cruz 1.er ciclo, p. 30",
  },
  33: {
    eje: "Los fenómenos del mundo físico",
    contenido: "Producción y propagación del sonido a través de vibraciones y distinción de tonos e intensidades.",
    fuente: "DC Santa Cruz 1.er ciclo, p. 32",
  },
  34: {
    eje: "Los fenómenos del mundo físico",
    contenido: "Movimientos aparentes del Sol y la Luna, fenómenos meteorológicos locales (viento, nieve, escarcha) y estaciones.",
    fuente: "DC Santa Cruz 1.er ciclo, p. 32",
  },
  35: {
    eje: "Los seres vivos: diversidad, unidad, interrelaciones y cambios",
    contenido: "Comparación anatómica y funcional de vertebrados e invertebrados en ambientes aeroterrestres y acuáticos.",
    fuente: "DC Santa Cruz 1.er ciclo, p. 28",
  },
  36: {
    eje: "Los materiales y sus cambios",
    contenido: "Transformaciones químicas cotidianas (oxidación, combustión, cocción) y elaboración de informes descriptivos.",
    fuente: "DC Santa Cruz 1.er ciclo, p. 30",
  },
  37: {
    eje: "Los fenómenos del mundo físico",
    contenido: "Integración de fenómenos ópticos, térmicos y acústicos a través de experimentos guiados y registro de datos.",
    fuente: "DC Santa Cruz 1.er ciclo, p. 33",
  },
  38: {
    eje: "Los fenómenos del mundo físico",
    contenido: "Instrumentos de orientación temporal y espacial (puntos cardinales, brújula, reloj solar) en la vida cotidiana.",
    fuente: "DC Santa Cruz 1.er ciclo, p. 33",
  },
  39: {
    eje: "Las sociedades y los espacios geográficos",
    contenido: "Características de los espacios urbanos y rurales en Santa Cruz, servicios básicos y vínculos de interconexión.",
    fuente: "DC Santa Cruz 1.er ciclo, p. 34",
  },
  40: {
    eje: "Las sociedades a través del tiempo",
    contenido: "Formas de vida cotidiana, grupos sociales y trabajo en la época colonial en el Río de la Plata.",
    fuente: "DC Santa Cruz 1.er ciclo, p. 36",
  },
  41: {
    eje: "Las actividades humanas y la organización social",
    contenido: "Instituciones de gobierno colonial y actual, funciones del Cabildo histórico y pautas de convivencia social.",
    fuente: "DC Santa Cruz 1.er ciclo, p. 38",
  },
  42: {
    eje: "Las actividades humanas y la organización social",
    contenido: "Circuitos productivos regionales de la Patagonia (ganadería ovina, pesca, energía) desde la materia prima al comercio.",
    fuente: "DC Santa Cruz 1.er ciclo, p. 39",
  },
  43: {
    eje: "Las sociedades a través del tiempo",
    contenido: "Patrimonio cultural, monumentos y edificios históricos como huellas materiales del pasado en la comunidad.",
    fuente: "DC Santa Cruz 1.er ciclo, p. 37",
  },
  44: {
    eje: "Las actividades humanas y la organización social",
    contenido: "Organización municipal, roles de las autoridades locales y participación de los ciudadanos en la vida comunitaria.",
    fuente: "DC Santa Cruz 1.er ciclo, p. 39",
  },
  45: {
    eje: "Las sociedades y los espacios geográficos",
    contenido: "Medios de transporte y vías de comunicación en Santa Cruz y su impacto en la conservación ambiental.",
    fuente: "DC Santa Cruz 1.er ciclo, p. 35",
  },
  46: {
    eje: "Las sociedades a través del tiempo",
    contenido: "Cronología histórica de acontecimientos significativos de la historia argentina y efemérides patrias.",
    fuente: "DC Santa Cruz 1.er ciclo, p. 37",
  },
  47: {
    eje: "Las actividades humanas y la organización social",
    contenido: "Diversidad cultural, respeto por las diferencias, derechos del niño y construcción democrática de la ciudadanía.",
    fuente: "DC Santa Cruz 1.er ciclo, p. 40",
  },
};

// Generación de la base de datos completa de Santa Cruz
function buildSantaCruzCurriculum(): Record<string, CurriculoEntry> {
  const result: Record<string, CurriculoEntry> = {};

  const allWorlds: WorldDef[] = [...GRADE1_WORLDS, ...GRADE2_WORLDS, ...WORLDS];

  for (const w of allWorlds) {
    const idKey = String(w.id);
    const area = AREA_LABELS[w.subject] ?? "Área General";

    // Si está en el diccionario de 3.º grado
    if (G3_CURRICULAR_CONTENT[w.id]) {
      const entry = G3_CURRICULAR_CONTENT[w.id];
      result[idKey] = {
        area,
        eje: entry.eje,
        contenido: entry.contenido,
        fuente: entry.fuente,
        validado: false,
      };
      continue;
    }

    // Si tiene contents u objective propios (1.º, 2.º y cuentos)
    let eje = "";
    let fuente = "";

    if (w.subject === "matematica") {
      const e = getEjeMatematica(w);
      eje = e.eje;
      fuente = e.fuente;
    } else if (w.subject === "lengua") {
      const e = getEjeLengua(w);
      eje = e.eje;
      fuente = e.fuente;
    } else if (w.subject === "sociales") {
      const e = getEjeSociales(w);
      eje = e.eje;
      fuente = e.fuente;
    } else {
      const e = getEjeNaturales(w);
      eje = e.eje;
      fuente = e.fuente;
    }

    const contenido =
      w.contents?.length
        ? w.contents.join(". ")
        : w.objective ?? w.description ?? "Práctica y consolidación de saberes curriculares";

    result[idKey] = {
      area,
      eje,
      contenido,
      fuente,
      validado: false,
    };
  }

  // Dictados especiales
  result["28001"] = {
    area: "Lengua y Matemática",
    eje: "Reflexión sobre la Lengua y Número",
    contenido: "Dictado de números hasta 1.000 y escritura correcta de palabras y oraciones con mayúscula y punto.",
    fuente: "DC Santa Cruz 1.er ciclo (2.º grado), pp. 37 y 89",
    validado: false,
  };

  result["38001"] = {
    area: "Lengua y Matemática",
    eje: "Reflexión sobre la Lengua y Número",
    contenido: "Dictado de números hasta 10.000, ortografía literal estricta y oraciones con signos de interrogación, exclamación y coma.",
    fuente: "DC Santa Cruz 1.er ciclo (3.º grado), pp. 38 y 89",
    validado: false,
  };

  return result;
}

// Generación de la base de datos NAP (Núcleos de Aprendizajes Prioritarios)
function buildNapCurriculum(sc: Record<string, CurriculoEntry>): Record<string, CurriculoEntry> {
  const result: Record<string, CurriculoEntry> = {};

  for (const [id, entry] of Object.entries(sc)) {
    let napEje = entry.eje;
    let napFuente = `NAP ${entry.area} 1.er ciclo`;

    if (entry.area === "Matemática") {
      napEje = entry.eje === "Geometría y Espacio" ? "En relación con la geometría y el espacio" : entry.eje === "La Medida" ? "En relación con la medida" : "En relación con el número y las operaciones";
      napFuente = "NAP Matemática 1.er ciclo (EGB 1 / Primaria)";
    } else if (entry.area === "Lengua") {
      napEje = entry.eje === "Comprensión y Producción Oral" ? "En relación con la comprensión y producción oral" : entry.eje === "Lectura" ? "En relación con la lectura" : entry.eje === "Escritura" ? "En relación con la escritura" : "En relación con la reflexión sobre la lengua y los textos";
      napFuente = "NAP Lengua 1.er ciclo (EGB 1 / Primaria)";
    } else if (entry.area === "Ciencias Sociales") {
      napEje = entry.eje;
      napFuente = "NAP Ciencias Sociales 1.er ciclo";
    } else if (entry.area === "Ciencias Naturales") {
      napEje = entry.eje;
      napFuente = "NAP Ciencias Naturales 1.er ciclo";
    }

    result[id] = {
      area: entry.area,
      eje: napEje,
      contenido: entry.contenido,
      fuente: napFuente,
      validado: false,
    };
  }

  return result;
}

const sc = buildSantaCruzCurriculum();
const nap = buildNapCurriculum(sc);

const outDir = path.resolve(process.cwd(), "src/lib/curriculo");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

fs.writeFileSync(path.join(outDir, "santa-cruz.json"), JSON.stringify(sc, null, 2), "utf-8");
fs.writeFileSync(path.join(outDir, "nap.json"), JSON.stringify(nap, null, 2), "utf-8");

console.log(`Generated santa-cruz.json with ${Object.keys(sc).length} entries.`);
console.log(`Generated nap.json with ${Object.keys(nap).length} entries.`);
