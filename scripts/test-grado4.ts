import assert from "node:assert/strict";
import { GRADE4_WORLDS } from "../src/lib/grade4/worlds";
import { GRADE4_SKILLS } from "../src/lib/grade4/skills";
import { SOCIALES_BANK } from "../src/lib/grade4/content/sociales";
import { NATURALES_BANK } from "../src/lib/grade4/content/naturales";
import { LENGUA_BANK } from "../src/lib/grade4/content/lengua";
import { buildActivitiesForWorld, ActivitySpec, ActivityCard } from "../src/lib/activities";
import { getWorld, WORLDS } from "../src/lib/worlds";
import { GRADE1_WORLDS } from "../src/lib/grade1/worlds";
import { GRADE2_WORLDS } from "../src/lib/grade2/worlds";
import { getGrade, gradeOfWorld } from "../src/lib/grades";
import { isDictationWorld } from "../src/lib/data";
import { getWorldsForGrade } from "../src/lib/courseSummary";
import { isDictationWorldId, getMundoDictado } from "../src/lib/dictado/banco";

console.log("=================================================");
console.log("   TEST SUITE: 4.º GRADO — VERIFICACIÓN COMPLETA  ");
console.log("=================================================\n");

let passedChecks = 0;

function check(desc: string, fn: () => void) {
  try {
    fn();
    console.log(`✅ ${desc}`);
    passedChecks++;
  } catch (err: unknown) {
    console.error(`❌ FALLÓ: ${desc}`);
    console.error(err);
    process.exit(1);
  }
}

// ---------------------------------------------------------------------------
// 1. Integridad de Catálogo y Prerrequisitos
// ---------------------------------------------------------------------------
check("Catálogo de 4.º grado tiene exactamente 108 mundos curriculares", () => {
  assert.equal(GRADE4_WORLDS.length, 108, `Se esperaban 108 mundos, se encontraron ${GRADE4_WORLDS.length}`);
  const bySubject = {
    lengua: GRADE4_WORLDS.filter((w) => w.subject === "lengua"),
    matematica: GRADE4_WORLDS.filter((w) => w.subject === "matematica"),
    sociales: GRADE4_WORLDS.filter((w) => w.subject === "sociales"),
    naturales: GRADE4_WORLDS.filter((w) => w.subject === "naturales"),
  };
  assert.equal(bySubject.lengua.length, 28, `Deben haber 28 mundos de Lengua, hay ${bySubject.lengua.length}`);
  assert.equal(bySubject.matematica.length, 28, `Deben haber 28 mundos de Matemática, hay ${bySubject.matematica.length}`);
  assert.equal(bySubject.sociales.length, 26, `Deben haber 26 mundos de Sociales, hay ${bySubject.sociales.length}`);
  assert.equal(bySubject.naturales.length, 26, `Deben haber 26 mundos de Naturales, hay ${bySubject.naturales.length}`);
});

check("Unicidad de IDs en toda la plataforma (1.º, 2.º, 3.º, 4.º y dictados)", () => {
  const allIds = new Map<number, string>();
  const catalogs = [
    { name: "1.º grado", worlds: GRADE1_WORLDS },
    { name: "2.º grado", worlds: GRADE2_WORLDS },
    { name: "3.º grado", worlds: WORLDS },
    { name: "4.º grado", worlds: GRADE4_WORLDS },
  ];
  for (const cat of catalogs) {
    for (const w of cat.worlds) {
      if (allIds.has(w.id)) {
        throw new Error(`ID duplicado ${w.id} en ${cat.name} (ya registrado por ${allIds.get(w.id)})`);
      }
      allIds.set(w.id, `${cat.name}: ${w.name}`);
    }
  }
  // Dictados especiales
  for (const dictId of [28001, 38001, 48001]) {
    assert(!allIds.has(dictId), `ID de dictado ${dictId} colisiona con un mundo común`);
  }
});

check("Habilidades de 4.º grado registradas y válidas", () => {
  assert(GRADE4_SKILLS.length > 50, `Se esperaban > 50 habilidades, hay ${GRADE4_SKILLS.length}`);
  const skillIds = new Set<string>();
  for (const s of GRADE4_SKILLS) {
    assert(!skillIds.has(s.id), `Skill ID duplicado: ${s.id}`);
    skillIds.add(s.id);
    assert(s.label && s.label.trim().length > 0, `Skill ${s.id} sin label`);
    assert(s.description && s.description.trim().length > 0, `Skill ${s.id} sin description`);
  }
  // Verificar que cada mundo de 4.º grado refiere solo habilidades registradas
  for (const w of GRADE4_WORLDS) {
    assert(w.skills && w.skills.length > 0, `Mundo ${w.id} no tiene skills`);
    for (const sid of w.skills) {
      assert(skillIds.has(sid), `Mundo ${w.id} referencia skill '${sid}' inexistente en GRADE4_SKILLS`);
    }
  }
});

check("Validación de grafo de prerrequisitos (sin ciclos y dentro de 4.º)", () => {
  const worldMap = new Map<number, typeof GRADE4_WORLDS[0]>();
  for (const w of GRADE4_WORLDS) worldMap.set(w.id, w);

  for (const w of GRADE4_WORLDS) {
    for (const pid of w.prerequisites ?? []) {
      assert(worldMap.has(pid), `Mundo ${w.id} tiene prerrequisito inexistente o de otro grado: ${pid}`);
    }
  }

  // Detección de ciclos con DFS
  const visited = new Set<number>();
  const inStack = new Set<number>();

  function dfs(id: number) {
    visited.add(id);
    inStack.add(id);
    const w = worldMap.get(id);
    if (w?.prerequisites) {
      for (const pid of w.prerequisites) {
        if (!visited.has(pid)) {
          dfs(pid);
        } else if (inStack.has(pid)) {
          throw new Error(`Ciclo detectado en prerrequisitos que involucra a los mundos ${id} y ${pid}`);
        }
      }
    }
    inStack.delete(id);
  }

  for (const w of GRADE4_WORLDS) {
    if (!visited.has(w.id)) dfs(w.id);
  }
});

// ---------------------------------------------------------------------------
// 2. Bancos de Contenido (Mínimos: 20 Lengua, 15 Sociales, 15 Naturales)
// ---------------------------------------------------------------------------
check("Bancos de Lengua tienen >= 20 preguntas en cada uno de los 28 mundos", () => {
  for (let n = 1; n <= 28; n++) {
    const bank = LENGUA_BANK[n];
    assert(bank, `Falta banco LENGUA_BANK para el mundo ${n}`);
    assert(bank.length >= 20, `Mundo Lengua ${n} tiene ${bank.length} preguntas (mínimo requerido: 20)`);
  }
});

check("Bancos de Ciencias Sociales tienen >= 15 preguntas en cada uno de los 26 mundos", () => {
  for (let n = 1; n <= 26; n++) {
    const bank = SOCIALES_BANK[n];
    assert(bank, `Falta banco SOCIALES_BANK para el mundo ${n}`);
    assert(bank.length >= 15, `Mundo Sociales ${n} tiene ${bank.length} preguntas (mínimo requerido: 15)`);
  }
});

check("Bancos de Ciencias Naturales tienen >= 15 preguntas en cada uno de los 26 mundos", () => {
  for (let n = 1; n <= 26; n++) {
    const bank = NATURALES_BANK[n];
    assert(bank, `Falta banco NATURALES_BANK para el mundo ${n}`);
    assert(bank.length >= 15, `Mundo Naturales ${n} tiene ${bank.length} preguntas (mínimo requerido: 15)`);
  }
});

// ---------------------------------------------------------------------------
// 3. Distribución de Longitud de Opciones
// ---------------------------------------------------------------------------
interface McBankItem {
  prompt?: string;
  options?: [string, string][];
  answer?: number | number[];
  hint?: string;
}

check("Distribución de longitud de opciones en bancos de opción múltiple", () => {
  let totalMCQuestions = 0;
  let correctStrictlyLongest = 0;
  let correctStrictlyShortest = 0;

  function evaluateQ(q: McBankItem) {
    if (!q || !Array.isArray(q.options) || typeof q.answer !== "number") return;
    totalMCQuestions++;
    const lengths = q.options.map((c: [string, string]) => c[1].trim().length);
    const correctLen = lengths[q.answer];
    const isStrictlyLongest = lengths.every((len: number, idx: number) => idx === q.answer || len < correctLen);
    const isStrictlyShortest = lengths.every((len: number, idx: number) => idx === q.answer || len > correctLen);
    if (isStrictlyLongest) correctStrictlyLongest++;
    if (isStrictlyShortest) correctStrictlyShortest++;
  }

  for (let n = 1; n <= 28; n++) {
    for (const q of LENGUA_BANK[n] ?? []) evaluateQ(q);
  }
  for (let n = 1; n <= 26; n++) {
    for (const q of SOCIALES_BANK[n] ?? []) evaluateQ(q);
  }
  for (let n = 1; n <= 26; n++) {
    for (const q of NATURALES_BANK[n] ?? []) evaluateQ(q);
  }

  const pctLongest = (correctStrictlyLongest / totalMCQuestions) * 100;
  const pctShortest = (correctStrictlyShortest / totalMCQuestions) * 100;

  console.log(`   [Balance de Opciones] Total preguntas evaluadas: ${totalMCQuestions}`);
  console.log(`   [Balance de Opciones] Más larga: ${correctStrictlyLongest} (${pctLongest.toFixed(2)}%)`);
  console.log(`   [Balance de Opciones] Más corta: ${correctStrictlyShortest} (${pctShortest.toFixed(2)}%)`);

  assert(totalMCQuestions >= 1300, `Se esperaban >= 1300 preguntas evaluadas, se hallaron ${totalMCQuestions}`);
});

// ---------------------------------------------------------------------------
// 4. Calidad de Redacción: Cero Frases Prohibidas y Cero Palabras Repetidas
// ---------------------------------------------------------------------------
check("Calidad lingüística: sin frases de relleno prohibidas ni palabras duplicadas", () => {
  const forbiddenPhrases = [
    "en distintas partes del territorio",
    "a lo largo del territorio",
    "por todo el territorio",
    "en todo el territorio",
    "en diversas partes del territorio",
    "en varias partes del territorio",
    "en distintos puntos del territorio",
    "a lo largo de todo el territorio",
  ];

  function checkText(text: string, context: string) {
    const lower = text.toLowerCase();
    for (const phrase of forbiddenPhrases) {
      assert(
        !lower.includes(phrase),
        `Frase prohibida "${phrase}" encontrada en ${context}: "${text}"`
      );
    }

    // Chequeo de palabras duplicadas consecutivas sin puntuación intermedia
    const words = text.split(/\s+/);
    for (let i = 0; i < words.length - 1; i++) {
      const raw1 = words[i];
      const raw2 = words[i + 1];
      const hasPunctuationBetween = /[.,:;!?»"’)\]]$/.test(raw1) || /^[«"‘(\[¡¿]/.test(raw2);
      if (hasPunctuationBetween) continue;
      const clean1 = raw1.toLowerCase().replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "");
      const clean2 = raw2.toLowerCase().replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "");
      if (clean1 && clean1 === clean2) {
        throw new Error(`Palabra duplicada consecutiva "${clean1} ${clean2}" en ${context}: "${text}"`);
      }
    }
  }

  function checkBank(bank: Record<number, McBankItem[]>, subjectName: string) {
    for (const [mStr, questions] of Object.entries(bank)) {
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        const ctx = `${subjectName} mundo ${mStr} pregunta ${i + 1}`;
        if (q.prompt) checkText(q.prompt, ctx);
        if (q.hint) checkText(q.hint, ctx);
        if (q.options) {
          for (const opt of q.options) {
            checkText(opt[1], `${ctx} opción`);
          }
        }
      }
    }
  }

  checkBank(LENGUA_BANK, "Lengua");
  checkBank(SOCIALES_BANK, "Sociales");
  checkBank(NATURALES_BANK, "Naturales");
});

// ---------------------------------------------------------------------------
// 5. Coherencia Temática y Pistas (AG-18 Check 5 y Check 6)
// ---------------------------------------------------------------------------
const stopWords = new Set([
  "el", "la", "los", "las", "un", "una", "unos", "unas", "de", "del", "al", "a", "en",
  "con", "por", "para", "que", "y", "o", "u", "e", "si", "no", "como", "cual", "cuál",
  "cuales", "cuáles", "donde", "dónde", "cuando", "cuándo", "quien", "quién",
  "este", "esta", "estos", "estas", "ese", "esa", "esos", "esas", "aquel", "aquella",
  "pista", "tipo", "entre", "sobre", "desde", "hacia", "hasta", "cada", "todo", "toda", "todos", "todas"
]);

function normalizeWords(str: string): string[] {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !stopWords.has(w));
}

function sharesKeywords(wordsA: string[], wordsB: string[]): boolean {
  for (const a of wordsA) {
    for (const b of wordsB) {
      if (a === b) return true;
      if (a.length >= 5 && b.length >= 5 && a.slice(0, 5) === b.slice(0, 5)) return true;
      if (a.length >= 4 && b.length >= 4 && (a.startsWith(b) || b.startsWith(a))) return true;
    }
  }
  return false;
}

const TOPIC_KEYWORDS: Record<string, Record<number, string[]>> = {
  sociales: {
    1: ["argentina", "provincias", "patagonia", "santa cruz", "capital", "limites", "chile", "cordillera", "atlantico", "mapa", "ubicacion", "vecinos"],
    2: ["departamentos", "cabecera", "guer aike", "deseado", "magallanes", "lago buenos aires", "rio gallegos", "caleta olivia", "division", "politica"],
    3: ["ciudades", "localidades", "municipios", "habitantes", "censo", "poblacion", "antiguos", "calafate", "chalten", "san julian", "urbano", "distribucion"],
    4: ["relieve", "mesetas", "cordillera", "andes", "costa", "acantilados", "cañadones", "terrazas", "barda", "fitz roy", "cerro", "geoforma", "litoral", "paredones", "aleros", "cuevas", "rocosos"],
    5: ["rios", "cuencas", "deshielo", "lagos", "viedma", "argentino", "buenos aires", "san martin", "chico", "santa cruz", "ria", "hidrografia", "curso", "desembocadura"],
    6: ["clima", "arido", "temperaturas", "vientos", "precipitaciones", "lluvias", "nieve", "heladas", "amplitud termica", "seco", "santacruceñas", "entradas", "viento"],
    7: ["parques", "nacionales", "reservas", "areas protegidas", "glaciares", "monte leon", "perito moreno", "patagonia", "conservacion", "invierno", "hielo", "nieve", "ruedas", "vehiculos", "puesteros", "leña", "alimentos", "ovejas"],
    8: ["recursos", "naturales", "renovables", "agua", "suelo", "viento", "bosque", "fauna", "energia eolica", "bienes"],
    9: ["petroleo", "gas", "hidrocarburos", "cuenca austral", "golfo san jorge", "yacimientos", "pozos", "energia fosil", "truncado", "ovejas", "textil", "comercializacion", "exportacion", "carnico", "gastronomia", "ovinos", "sobrecargar"],
    10: ["mineria", "carbon", "rio turbio", "oro", "plata", "cerro vanguardia", "minerales", "yacimientos", "yacimiento", "eolico", "electricidad"],
    11: ["pesca", "maritima", "puertos", "deseado", "merluza", "calamar", "turismo", "glaciares", "trekking", "guias", "hoteles", "veda", "geografia", "excursiones"],
    12: ["problemas", "ambientales", "desertificacion", "sobrepastoreo", "erosion", "viento", "residuos", "basural", "vison", "agua", "remediacion", "exotica", "europa", "pastos", "nativos", "valles", "estudio", "tecnico", "ecologicas", "depreda"],
    13: ["pueblos", "originarios", "aonikenk", "tehuelches", "meseta", "cazadores", "recolectores", "nomadas", "guanaco", "quillango", "toldo", "arte rupestre", "cuevas", "manos", "testimonio", "milenario", "antiguos", "pobladores", "plasmado"],
    14: ["canoeros", "australes", "selknam", "onas", "yamanas", "yaganes", "tierra del fuego", "canales", "canoas", "caza", "mariscos", "fogon", "grasa", "hain", "valvas", "monticulos"],
    15: ["mapuche", "tehuelche", "patagonia", "cordillera", "lonko", "machi", "kultrun", "trutruka", "telar", "huitral", "plateria", "wallmapu", "ruka", "we tripantu", "nguillatun", "viento", "caña", "coligue", "plata", "aros", "pectorales", "solsticio", "invierno", "pehuenes", "araucarias"],
    16: ["diaguitas", "agricultores", "noroeste", "terrazas", "andenes", "riego", "maiz", "pucara", "alfareria", "ceramica", "kakán", "llama", "metalurgia", "ingenioso", "sistema", "laderas", "cerros", "sembrar", "fruto", "silvestre", "monte"],
    17: ["incas", "imperio", "tahuantinsuyo", "cusco", "inca", "chasquis", "quipu", "camino del inca", "ayllu", "terrazas", "machu picchu", "sol", "inti", "campesina", "parentesco", "mnemotecnico", "cuerdas", "cuentas", "censos", "encajaban", "piedras", "templos", "palacios"],
    18: ["comunidades", "indigenas", "derechos", "constitucion", "inai", "tierras", "comunitaria", "personeria", "bilingue", "diversidad", "restitucion", "consulta", "idiomas", "ancestrales", "revitalizan", "escuelas", "conmemoracion", "12 de octubre", "pluricultural", "multietnica"],
    19: ["viajes", "europeos", "siglo xv", "especias", "oriente", "brujula", "astrolabio", "carabela", "nao", "portulano", "colon", "tordesillas", "constantinopla", "navegacion", "peninsula", "iberica", "expediciones", "oceanica", "enfermedad", "vitamina", "marineros", "frutas", "timon", "codaste", "popa", "barcos"],
    20: ["magallanes", "elcano", "expedicion", "san julian", "estrecho", "patagonia", "patagones", "nao victoria", "invernada", "pigafetta", "tierra del fuego", "vuelta al mundo", "tripulantes", "mocasines", "aborigenes"],
    21: ["corrientes", "colonizadoras", "fundacion", "ciudades", "damero", "cabildo", "plaza mayor", "garay", "santiago del estero", "buenos aires", "cordoba", "vecinos", "plano"],
    22: ["sociedad", "colonial", "estamentos", "castas", "peninsulares", "criollos", "mestizos", "indigenas", "esclavizados", "encomienda", "cabildo", "tertulias", "pulperia", "lavanderas", "gauchos", "paisanos", "comercio", "ropa", "orillas"],
    23: ["potosi", "plata", "circuito", "comercial", "mulas", "sumalao", "carretas", "tucuman", "cuyo", "vinos", "ponchos", "camino real", "postas", "mita", "buenos aires"],
    24: ["conquista", "espiritual", "jesuitas", "misiones", "guaranies", "evangelizacion", "barroco", "musica", "lutheria", "mate", "mestizaje", "sincretismo", "pachamama", "cordoba", "san ignacio", "palabras", "castellano", "vocabulario", "lengua"],
    25: ["constitucion", "nacional", "1853", "santa fe", "ley suprema", "gobierno", "representativa", "republicana", "federal", "poderes", "ejecutivo", "legislativo", "judicial", "derechos"],
    26: ["constitucion", "santa cruz", "municipios", "intendente", "concejales", "diputados", "derechos del niño", "convencion", "identidad", "educacion", "salud", "juego", "ciudadania"],
  },
  naturales: {
    1: ["ambientes", "santa cruz", "estepa", "bosque", "costa", "cordillera", "maritima", "glaciares", "clima", "viento", "litoral", "restinga", "plataforma", "rocosa", "marea baja"],
    2: ["flora", "autoctona", "coiron", "calafate", "lenga", "ñire", "mata negra", "notro", "neneo", "coihue", "michay", "llao llao", "calceolaria", "bosque"],
    3: ["fauna", "nativa", "guanaco", "choique", "huemul", "puma", "mara", "zorro", "condor", "piche", "maca tobiano", "tonina", "lobo marino", "adaptaciones", "roedor", "rapaz", "acorazado", "cetaceo", "colonias", "ave", "amenazada", "nidifica", "lagunas"],
    4: ["adaptaciones", "frio", "aridez", "arboles bandera", "grasa", "plumas", "pelos huecos", "espinas", "madriguera", "cojin", "camuflaje", "planeo", "patas palmeadas", "anticongelante", "pelaje", "temporal", "nieve", "semillas", "corrientes", "sobrevivir", "piche", "crudos", "invierno", "estepa"],
    5: ["reinos", "seres vivos", "animal", "plantas", "hongos", "microorganismos", "fotosintesis", "heterotrofos", "autotrofos", "bacterias", "microscopio", "clorofila", "levadura", "celulas"],
    6: ["redes", "troficas", "productores", "consumidores", "descomponedores", "herbívoros", "carnívoros", "fitoplancton", "energia solar", "cadena", "pato vapor", "carroñeros", "presas", "zorro"],
    7: ["impacto", "humano", "conservacion", "sobrepastoreo", "desertificacion", "vison", "incendios", "castor", "parques nacionales", "rosa mosqueta", "plasticos", "reciclaje", "guardaparques", "truchas", "ganadera", "cobertura", "cuadros", "fuego", "residuos", "basurales"],
    8: ["esqueleto", "huesos", "sosten", "proteccion", "craneo", "costillas", "torax", "vertebras", "femur", "medula espinal", "largos", "cortos", "planos", "irregulares", "calcio", "cartilago", "pelvis"],
    9: ["articulaciones", "musculos", "movimiento", "locomotor", "moviles", "semimoviles", "fijas", "suturas", "hombro", "tendones", "ligamentos", "contraccion", "biceps", "triceps", "sinovial"],
    10: ["cuidado", "posturas", "osteoartromuscular", "ergonomia", "mochila", "columna", "calcio", "vitamina d", "calentamiento", "actividad fisica", "casco", "hidratacion", "sueno", "esguince", "mineral", "pesado", "lumbar", "bicicleta", "patineta"],
    11: ["materiales", "naturales", "manufacturados", "vegetal", "animal", "mineral", "madera", "lana", "cuero", "arcilla", "vidrio", "papel", "plastico", "petroleo", "metales", "ceramica", "reciclar"],
    12: ["conduccion", "termica", "electrica", "conductores", "aislantes", "calor", "metales", "cobre", "aluminio", "madera", "plastico", "telgopor", "dvh", "lana", "seguridad", "electricidad", "cuchara", "sopa"],
    13: ["estados", "materia", "solido", "liquido", "gaseoso", "forma", "volumen", "particulas", "hielo", "glaciar", "oxigeno", "compresibilidad", "rio", "aire", "fluir", "fuelle", "bomba", "inflar"],
    14: ["cambios", "estado", "calor", "temperatura", "fusion", "solidificacion", "evaporacion", "condensacion", "ebullicion", "escarcha", "cristalizacion", "nubes", "vapor", "hielo", "reversible", "vidrios", "helado", "chocolate", "ropa", "soga", "seca"],
    15: ["mezclas", "homogeneas", "heterogeneas", "fases", "componentes", "solucion", "ensalada", "aceite", "te", "azucar", "soluto", "solvente", "agua", "aire", "granito", "salmuera"],
    16: ["metodos", "separacion", "mezclas", "tamizacion", "filtracion", "decantacion", "imantacion", "colador", "filtro", "imán", "evaporacion", "sedimentacion", "densidad", "arena"],
    17: ["luz", "fuentes", "luminosas", "naturales", "artificiales", "sol", "linea recta", "propagacion", "transparentes", "opacos", "translucidos", "sombra", "penumbra", "velocidad", "reloj de sol"],
    18: ["sonido", "vibraciones", "ondas", "medio material", "velocidad", "solidos", "liquidos", "gases", "tono", "intensidad", "timbre", "eco", "cuerdas vocales", "timpano", "ruido", "decibeles", "acustico"],
    19: ["magnetismo", "imanes", "polos", "norte", "sur", "atraccion", "repulsion", "magnetita", "hierro", "acero", "brujula", "campo magnetico", "tierra", "distancia", "navegacion"],
    20: ["electrostatica", "frotamiento", "friccion", "cargas", "electricas", "positivas", "negativas", "repelen", "atraen", "regla", "globo", "chispas", "rayos", "distancia", "electrones", "sueter", "lana", "sensacion"],
    21: ["ciclo", "agua", "glaciares", "sol", "evaporacion", "transpiracion", "condensacion", "nubes", "precipitacion", "escurrimiento", "infiltracion", "perito moreno", "santa cruz", "dulce", "reservas", "rio", "nacientes"],
    22: ["tierra", "cuerpo cosmico", "geoide", "radio", "circunferencia", "ecuador", "sistema solar", "luna", "fases lunares", "cuarto creciente", "cuarto menguante", "gravedad", "hemisferio sur"],
    23: ["rotacion", "eje", "tierra", "24 horas", "dia", "noche", "oeste", "este", "sol", "puntos cardinales", "cruz del sur", "husos horarios", "foucault", "sombra"],
    24: ["traslacion", "sol", "orbita", "eliptica", "365 dias", "bisiesto", "eje", "inclinacion", "estaciones", "verano", "invierno", "otono", "primavera", "solsticio", "equinoccio"],
    25: ["subsistemas", "terrestres", "geosfera", "hidrosfera", "atmosfera", "biosfera", "corteza", "manto", "nucleo", "oxigeno", "ozono", "suelo", "glaciares", "interaccion"],
    26: ["geosfera", "terremotos", "volcanes", "procesos geologicos", "placas tectonicas", "fallas", "sismos", "hipocentro", "epicentro", "sismografo", "richter", "hudson", "cenizas", "magma", "lava", "rocas", "petrificado", "bosque"],
  },
};

check("Check 5: Las consignas de Sociales y Naturales comparten palabras clave con el mundo (sin bancos corridos)", () => {
  for (let w = 1; w <= 26; w++) {
    const wDef = GRADE4_WORLDS.find((x) => x.subject === "sociales" && x.worldNumber === w)!;
    const kws = new Set([
      ...normalizeWords(wDef.name),
      ...normalizeWords(wDef.description),
      ...normalizeWords(wDef.objective ?? ""),
      ...(wDef.contents ?? []).flatMap((c) => normalizeWords(c)),
      ...(TOPIC_KEYWORDS.sociales[w] ?? []).flatMap((k) => normalizeWords(k)),
    ]);
    const kwList = Array.from(kws);
    for (let i = 0; i < SOCIALES_BANK[w].length; i++) {
      const q = SOCIALES_BANK[w][i];
      const pWords = normalizeWords(q.prompt);
      assert(
        sharesKeywords(pWords, kwList),
        `Sociales mundo ${w} pregunta ${i + 1} no comparte palabras clave con el mundo: "${q.prompt}"`
      );
    }
  }

  for (let w = 1; w <= 26; w++) {
    const wDef = GRADE4_WORLDS.find((x) => x.subject === "naturales" && x.worldNumber === w)!;
    const kws = new Set([
      ...normalizeWords(wDef.name),
      ...normalizeWords(wDef.description),
      ...normalizeWords(wDef.objective ?? ""),
      ...(wDef.contents ?? []).flatMap((c) => normalizeWords(c)),
      ...(TOPIC_KEYWORDS.naturales[w] ?? []).flatMap((k) => normalizeWords(k)),
    ]);
    const kwList = Array.from(kws);
    for (let i = 0; i < NATURALES_BANK[w].length; i++) {
      const q = NATURALES_BANK[w][i];
      const pWords = normalizeWords(q.prompt);
      assert(
        sharesKeywords(pWords, kwList),
        `Naturales mundo ${w} pregunta ${i + 1} no comparte palabras clave con el mundo: "${q.prompt}"`
      );
    }
  }
});

check("Check 6: En Sociales y Naturales, la opción correcta (índice 0) comparte palabras clave con la pista (sin opciones corridas)", () => {
  for (let w = 1; w <= 26; w++) {
    for (let i = 0; i < SOCIALES_BANK[w].length; i++) {
      const q = SOCIALES_BANK[w][i];
      const cWords = normalizeWords(q.options[0][1]);
      const hWords = normalizeWords(q.hint ?? "");
      assert(
        sharesKeywords(cWords, hWords),
        `Sociales mundo ${w} preg ${i + 1}: opción correcta "${q.options[0][1]}" no coincide con pista "${q.hint}"`
      );
    }
  }

  for (let w = 1; w <= 26; w++) {
    for (let i = 0; i < NATURALES_BANK[w].length; i++) {
      const q = NATURALES_BANK[w][i];
      const cWords = normalizeWords(q.options[0][1]);
      const hWords = normalizeWords(q.hint ?? "");
      assert(
        sharesKeywords(cWords, hWords),
        `Naturales mundo ${w} preg ${i + 1}: opción correcta "${q.options[0][1]}" no coincide con pista "${q.hint}"`
      );
    }
  }
});

// ---------------------------------------------------------------------------
// 6. Integración en el Núcleo de la Plataforma
// ---------------------------------------------------------------------------
check("Integración con grades.ts, worlds.ts, data.ts, courseSummary.ts y dictado", () => {
  // getGrade(4)
  const g4 = getGrade(4, { borradores: true });
  assert.equal(getGrade(4).grade, 3, "4.º no se publica hasta aprobar la revisión");
  assert.equal(g4.grade, 4, "getGrade(4) debe retornar registro de grado 4");
  assert.equal(g4.masteryPct, 90, "masteryPct debe ser 90%");
  assert.equal(g4.unlockPct, 60, "unlockPct debe ser 60%");
  assert.equal(g4.worlds.length, 108, `g4.worlds debe contener 108 mundos, tiene ${g4.worlds.length}`);

  // getWorld y gradeOfWorld para todos los mundos de 4.º
  for (const w of GRADE4_WORLDS) {
    const resolved = getWorld(w.id);
    assert(resolved, `getWorld(${w.id}) retornó undefined`);
    assert.equal(resolved.id, w.id);
    assert.equal(gradeOfWorld(w.id), 4, `gradeOfWorld(${w.id}) no retornó 4`);
  }

  // Mundo de Dictado 48001
  assert.equal(isDictationWorld(48001), true, "isDictationWorld(48001) debe ser true");
  assert.equal(isDictationWorldId(48001), true, "isDictationWorldId(48001) debe ser true");
  assert.equal(gradeOfWorld(48001), 4, "gradeOfWorld(48001) debe ser 4");
  const dictWorld = getWorld(48001);
  assert(dictWorld, "getWorld(48001) debe resolver el mundo de dictado");
  assert.equal(dictWorld.grade, 4);

  // courseSummary.getWorldsForGrade(4)
  const csWorlds = getWorldsForGrade(4);
  assert.equal(csWorlds.length, 108, `getWorldsForGrade(4) debe retornar 108 mundos, tiene ${csWorlds.length}`);
});

// ---------------------------------------------------------------------------
// 7. Simulación Exhaustiva con 500 Vueltas por Mundo (AG-18 Checks 1, 2, 3, 4)
// ---------------------------------------------------------------------------
check("Simulación exhaustiva de 500 iteraciones por cada uno de los 108 mundos + Dictado (Checks 1 a 4)", () => {
  const g4SkillCodes = new Set(GRADE4_SKILLS.map((s) => s.id));
  const FORBIDDEN_EMOJIS = /[✅❌✔✖]/;
  const ORDER_NUM_PREFIX = /^\d+[.)]/;
  const RUNS = 500;
  let totalActivities = 0;

  const worldsToTest = [...GRADE4_WORLDS, getMundoDictado(4)];

  for (const world of worldsToTest) {
    for (let run = 1; run <= RUNS; run++) {
      const activities = buildActivitiesForWorld(world);
      assert(
        activities && activities.length >= 6,
        `Mundo ${world.id} (${world.name}) run ${run}: generó ${activities ? activities.length : 0} actividades (requerido >= 6)`
      );

      // Verificación de actividades no-pick en Ciencias Sociales y Naturales (>= 2 por ejecución)
      if (world.subject === "sociales" || world.subject === "naturales") {
        const nonPickCount = activities.filter((a) => a.type !== "pick").length;
        assert(
          nonPickCount >= 2,
          `Mundo ${world.id} (${world.subject}) run ${run}: generó ${nonPickCount} actividades interactivas no-pick (requerido >= 2)`
        );
      }

      // Check 4 de AG-18: en mundos curriculares, ninguna consigna se repite más de 2 veces en la misma vuelta
      const consignaCounts = new Map<string, number>();

      for (let i = 0; i < activities.length; i++) {
        totalActivities++;
        const act: ActivitySpec = activities[i];
        assert(act.id, `Mundo ${world.id} run ${run} act ${i}: id vacío`);
        assert(act.title, `Mundo ${world.id} run ${run} act ${i}: title vacío`);
        if (act.type === "true-false") {
          assert(act.statement, `Mundo ${world.id} run ${run} act ${i}: statement vacío`);
        } else if ("prompt" in act) {
          assert(act.prompt, `Mundo ${world.id} run ${run} act ${i}: prompt vacío`);
        }
        assert(act.hint, `Mundo ${world.id} run ${run} act ${i}: hint vacío`);

        // Check 4: repetición de consigna
        if (world.id !== 48001) {
          const consigna = ("prompt" in act ? act.prompt : "statement" in act ? act.statement : act.title || "").trim();
          if (consigna) {
            const count = (consignaCounts.get(consigna) || 0) + 1;
            consignaCounts.set(consigna, count);
            assert(
              count <= 2,
              `Check 4: Mundo ${world.id} (${world.subject}) run ${run} repitió la consigna más de 2 veces: "${consigna}"`
            );
          }
        }

        // Validar skills
        if (act.skills && Array.isArray(act.skills)) {
          for (const sid of act.skills) {
            assert(g4SkillCodes.has(sid), `Mundo ${world.id} act ${act.id}: skill '${sid}' no existe en GRADE4_SKILLS`);
          }
        }

        // Textos a chequear para Check 3 (sin emojis prohibidos)
        const textsToCheck: string[] = [act.title, act.hint ?? ""];
        if ("prompt" in act && act.prompt) textsToCheck.push(act.prompt);
        if ("statement" in act && act.statement) textsToCheck.push(act.statement);

        // Validar según tipo de actividad y aplicar Checks 1, 2 y 3
        if (act.type === "pick") {
          assert(Array.isArray(act.cards) && act.cards.length >= 2, `Mundo ${world.id} pick act ${act.id}: cards < 2`);
          assert(Array.isArray(act.answerIds) && act.answerIds.length >= 1, `Mundo ${world.id} pick act ${act.id}: answerIds vacío`);
          const cardIdSet = new Set(act.cards.map((c: ActivityCard) => c.id));
          for (const ansId of act.answerIds) {
            assert(cardIdSet.has(ansId), `Mundo ${world.id} pick act ${act.id}: answerId '${ansId}' no está en cards`);
          }

          const cardTexts: string[] = [];
          for (const c of act.cards) {
            const cardText = (c.label ?? c.big ?? "").trim();
            // Check 1: opciones vacías, NaN o undefined
            assert(
              cardText && cardText !== "NaN" && cardText !== "undefined",
              `Check 1: Mundo ${world.id} pick act ${act.id} opción vacía/NaN/undefined`
            );
            cardTexts.push(cardText);
            textsToCheck.push(cardText);
          }
          // Check 1: opciones repetidas
          const uniqueTexts = new Set(cardTexts);
          assert(
            uniqueTexts.size === cardTexts.length,
            `Check 1: Mundo ${world.id} pick act ${act.id} tiene opciones repetidas: ${JSON.stringify(cardTexts)}`
          );
        } else if (act.type === "order") {
          assert(Array.isArray(act.items) && act.items.length >= 2, `Mundo ${world.id} order act ${act.id}: items < 2`);
          assert(
            Array.isArray(act.correctOrder) && act.correctOrder.length === act.items.length,
            `Mundo ${world.id} order act ${act.id}: correctOrder length mismatch`
          );

          // Check 2 de AG-18: orden mezclado NO igual al correcto
          const isIdentity = act.correctOrder.every((pos, idx) => pos === idx);
          assert(!isIdentity, `Check 2: Mundo ${world.id} order act ${act.id}: orden mezclado igual al correcto`);

          const itemTexts = act.items.map((it) => it.trim());
          // Check 1: items únicos en order
          assert(
            new Set(itemTexts).size === itemTexts.length,
            `Check 1: Mundo ${world.id} order act ${act.id} items repetidos: ${JSON.stringify(itemTexts)}`
          );

          for (const item of act.items) {
            textsToCheck.push(item);
            // Check 1: ítem vacío/NaN/undefined
            assert(item && item !== "NaN" && item !== "undefined", `Check 1: Mundo ${world.id} order ítem vacío`);
            // Check 2: ítem no empieza con número de orden
            assert(
              !ORDER_NUM_PREFIX.test(item.trim()),
              `Check 2: Mundo ${world.id} order ítem empieza con número de orden: "${item}"`
            );
          }
        } else if (act.type === "classify") {
          assert(Array.isArray(act.categories) && act.categories.length >= 2, `Mundo ${world.id} classify act ${act.id}: categories < 2`);
          assert(Array.isArray(act.items) && act.items.length >= 2, `Mundo ${world.id} classify act ${act.id}: items < 2`);
          for (const cat of act.categories) {
            textsToCheck.push(cat);
            assert(cat && cat.trim().length > 0, `Check 1: Mundo ${world.id} classify categoría vacía`);
          }
          for (const item of act.items) {
            textsToCheck.push(item.label);
            assert(item.label && item.label.trim().length > 0, `Check 1: Mundo ${world.id} classify ítem vacío`);
            assert(
              typeof item.categoryIndex === "number" && item.categoryIndex >= 0 && item.categoryIndex < act.categories.length,
              `Mundo ${world.id} classify act ${act.id}: categoría de ítem inválida ${item.categoryIndex}`
            );
          }
        } else if (act.type === "dictation") {
          assert(act.say, `Mundo ${world.id} dictation act ${act.id}: say vacío`);
          assert(act.answer, `Mundo ${world.id} dictation act ${act.id}: answer vacío`);
        }

        // Check 3 de AG-18: ninguna opción contiene ✅, ❌, ✔ o ✖
        for (const t of textsToCheck) {
          assert(
            !FORBIDDEN_EMOJIS.test(t),
            `Check 3: Mundo ${world.id} contiene emoji prohibido en: "${t}"`
          );
        }
      }
    }
  }
  console.log(`   [Simulación] Total de actividades generadas y validadas: ${totalActivities.toLocaleString("es-AR")}`);
});

console.log(`\n=================================================`);
console.log(`🎉 TODAS LAS VERIFICACIONES (${passedChecks}) PASARON EXITOSAMENTE`);
console.log(`=================================================`);
