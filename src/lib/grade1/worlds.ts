// Catálogo de mundos de 1.º grado. La cantidad de mundos surge de los
// contenidos de 1.º del Diseño Curricular de Santa Cruz (Lengua,
// Matemática, Ciencias Sociales y Ciencias Naturales) y de su progresión:
// no hay un número fijo. Para agregar un mundo, se suma una entrada acá y su
// contenido en src/lib/grade1/content/<materia>.ts.
//
// Ids: 1 + materia + número → Lengua 11001…, Matemática 12001…,
// Sociales 13001…, Naturales 14001… (cada materia admite hasta 999 mundos).
import { WorldDef, WorldDifficultyVars, WorldSubject } from "@/types";

const SUBJECT_BASE: Record<WorldSubject, number> = {
  lengua: 11000,
  matematica: 12000,
  sociales: 13000,
  naturales: 14000,
};

const PALETTES: Record<WorldSubject, [string, string][]> = {
  lengua: [["#fde68a", "#f59e0b"], ["#fbcfe8", "#ec4899"], ["#ddd6fe", "#8b5cf6"], ["#fed7aa", "#f97316"]],
  matematica: [["#bfdbfe", "#3b82f6"], ["#bbf7d0", "#22c55e"], ["#fecaca", "#ef4444"], ["#c7d2fe", "#6366f1"]],
  sociales: [["#bae6fd", "#0284c7"], ["#fde68a", "#ca8a04"], ["#fecdd3", "#e11d48"], ["#d9f99d", "#65a30d"]],
  naturales: [["#bbf7d0", "#16a34a"], ["#a5f3fc", "#0891b2"], ["#fef08a", "#eab308"], ["#e9d5ff", "#9333ea"]],
};

interface Spec {
  n: number; // número de mundo dentro de la materia
  name: string;
  emoji: string;
  description: string; // para el chico (corto)
  objective: string; // para el docente
  contents: string[]; // contenidos del Diseño Curricular
  skills: string[];
  after?: number[]; // prerrequisitos (números de mundo de la misma materia)
  vars?: WorldDifficultyVars;
  kind?: WorldDef["kind"];
  activityCount?: number;
}

function build(subject: WorldSubject, specs: Spec[]): WorldDef[] {
  return specs.map((s) => {
    const pal = PALETTES[subject][(s.n - 1) % PALETTES[subject].length];
    return {
      id: SUBJECT_BASE[subject] + s.n,
      grade: 1,
      worldNumber: s.n,
      name: s.name,
      emoji: s.emoji,
      subject,
      category: "oralidad-inicial", // no se usa en 1.º (el contenido sale de content/)
      description: s.description,
      objective: s.objective,
      contents: s.contents,
      skills: s.skills,
      prerequisites: (s.after ?? (s.n > 1 ? [s.n - 1] : [])).map((x) => SUBJECT_BASE[subject] + x),
      difficultyVars: s.vars,
      kind: s.kind ?? "normal",
      activityCount: s.activityCount ?? 8,
      colorFrom: pal[0],
      colorTo: pal[1],
      difficulty: "basico", // en 1.º escuchar la consigna es siempre gratis
      assessment:
        "Logrado con 80% o más en una vuelta y una vuelta de repaso. Con 60% se abre el mundo siguiente.",
    };
  });
}

// ------------------------------------------------------------------
// LENGUA — ruta de alfabetización inicial
// ------------------------------------------------------------------
const VOC = { language: "letra", imageSupport: true, audioSupport: true, options: 3, autonomy: "guiado" } as const;
const CONS = { language: "silaba", imageSupport: true, audioSupport: true, options: 3, autonomy: "guiado" } as const;

export const GRADE1_LENGUA: WorldDef[] = build("lengua", [
  // Oralidad y escucha
  { n: 1, name: "La Ronda de la Conversación", emoji: "🗣️", description: "Saludar, pedir, agradecer y esperar tu turno.", objective: "Reconocer pautas de los intercambios orales: turnos, saludo, pedido y agradecimiento.", contents: ["Participación en conversaciones respetando turnos de habla", "Fórmulas de saludo, pedido y agradecimiento"], skills: ["l-oralidad"], after: [], vars: { language: "imagen", imageSupport: true, audioSupport: true, options: 3, autonomy: "acompañado" } },
  { n: 2, name: "El Bosque de los Sonidos", emoji: "👂", description: "Escuchá con atención: ¿qué suena?", objective: "Escuchar con atención y discriminar sonidos y palabras.", contents: ["Escucha atenta", "Juegos sonoros y del lenguaje"], skills: ["l-escucha"], after: [1], vars: { language: "sonido", audioSupport: true, imageSupport: true, options: 3, memory: false } },
  { n: 3, name: "La Ruta de las Consignas", emoji: "🧭", description: "¿Qué hay que hacer? Escuchá y seguí las pistas.", objective: "Comprender consignas orales: qué hay que hacer, en qué orden y qué se necesita.", contents: ["Escucha comprensiva de consignas de tarea escolar"], skills: ["l-escucha", "l-comprension-oral"], after: [2], vars: { language: "sonido", steps: 2, memory: true, options: 3 } },
  // Conciencia fonológica
  { n: 4, name: "Palabras Largas y Cortas", emoji: "📏", description: "Aplaudí las partes de cada palabra.", objective: "Segmentar oralmente palabras en sílabas y comparar su longitud.", contents: ["Juegos con el lenguaje: segmentación oral"], skills: ["l-segmentacion"], after: [2], vars: { language: "sonido", imageSupport: true, audioSupport: true, options: 3 } },
  { n: 5, name: "La Isla de las Rimas", emoji: "🎵", description: "¿Qué palabras terminan igual?", objective: "Reconocer palabras que riman y jugar con rimas.", contents: ["Exploración de rimas en situaciones lúdicas"], skills: ["l-rimas"], after: [4] },
  { n: 6, name: "El Tren de la Sílaba Inicial", emoji: "🚂", description: "Palabras que empiezan igual.", objective: "Identificar la sílaba inicial de palabras.", contents: ["Segmentación y comparación de sílabas"], skills: ["l-silaba-inicial"], after: [4] },
  { n: 7, name: "El Tren de la Sílaba Final", emoji: "🚃", description: "Palabras que terminan con la misma parte.", objective: "Identificar la sílaba final de palabras.", contents: ["Segmentación y comparación de sílabas"], skills: ["l-silaba-inicial", "l-rimas"], after: [6] },
  { n: 8, name: "El Primer Sonido", emoji: "🔊", description: "¿Con qué sonido empieza?", objective: "Reconocer el sonido inicial (fonema) de las palabras.", contents: ["Correspondencia fonema-grafema (inicio)"], skills: ["l-sonido-inicial"], after: [6] },
  // Mi nombre y las vocales
  { n: 9, name: "Mi Nombre y los Nombres", emoji: "🏷️", description: "Los nombres se escriben con letras.", objective: "Reconocer que los nombres se escriben con letras; inicial y cantidad de letras.", contents: ["Escritura de nombres", "Listas de nombres"], skills: ["l-letra-nombre", "l-sonido-inicial"], after: [8], vars: { language: "letra", imageSupport: true, options: 3 } },
  { n: 10, name: "La Casa de la A y la E", emoji: "🅰️", description: "Conocé la A y la E.", objective: "Reconocer las vocales A y E: forma, nombre y sonido.", contents: ["Relación grafema-fonema: vocales"], skills: ["l-vocales", "l-grafema-fonema"], after: [8], vars: VOC },
  { n: 11, name: "La Casa de la I, la O y la U", emoji: "⭕", description: "Conocé la I, la O y la U.", objective: "Reconocer las vocales I, O y U.", contents: ["Relación grafema-fonema: vocales"], skills: ["l-vocales", "l-grafema-fonema"], after: [10], vars: VOC },
  { n: 12, name: "Todas las Vocales", emoji: "🌈", description: "¡Las cinco vocales juntas!", objective: "Discriminar las cinco vocales en palabras.", contents: ["Relación grafema-fonema: vocales"], skills: ["l-vocales", "l-sonido-inicial"], after: [11], vars: { ...VOC, options: 4 } },
  // Consonantes (orden de enseñanza)
  { n: 13, name: "La M de Mamá", emoji: "👩", description: "M con las vocales: ma, me, mi, mo, mu.", objective: "Relacionar M con /m/, leer sílabas y palabras con M y vocales.", contents: ["Correspondencia fonema-grafema", "Lectura de sílabas y palabras"], skills: ["l-grafema-fonema", "l-silabas", "l-lectura-palabras"], after: [12], vars: CONS },
  { n: 14, name: "La P de Papá", emoji: "👨", description: "pa, pe, pi, po, pu.", objective: "Relacionar P con /p/; leer palabras con M y P.", contents: ["Correspondencia fonema-grafema", "Lectura de palabras"], skills: ["l-grafema-fonema", "l-silabas", "l-lectura-palabras"], after: [13], vars: CONS },
  { n: 15, name: "La L de Luna", emoji: "🌙", description: "la, le, li, lo, lu.", objective: "Relacionar L con /l/; leer palabras con M, P y L.", contents: ["Correspondencia fonema-grafema", "Lectura de palabras"], skills: ["l-grafema-fonema", "l-silabas", "l-lectura-palabras"], after: [14], vars: CONS },
  { n: 16, name: "La S de Sol", emoji: "☀️", description: "sa, se, si, so, su.", objective: "Relacionar S con /s/; leer palabras con las letras trabajadas.", contents: ["Correspondencia fonema-grafema", "Lectura de palabras"], skills: ["l-grafema-fonema", "l-silabas", "l-lectura-palabras"], after: [15], vars: CONS },
  { n: 17, name: "Leo con M, P, L y S", emoji: "📖", description: "¡Ya podés leer muchas palabras!", objective: "Integrar M, P, L, S: leer y armar palabras decodificables.", contents: ["Lectura de palabras", "Escritura de palabras con letras móviles"], skills: ["l-lectura-palabras", "l-escritura", "l-silabas"], after: [16], kind: "integracion", vars: { language: "palabra", imageSupport: true, options: 3 } },
  { n: 18, name: "La T de Tomate", emoji: "🍅", description: "ta, te, ti, to, tu.", objective: "Relacionar T con /t/.", contents: ["Correspondencia fonema-grafema"], skills: ["l-grafema-fonema", "l-silabas", "l-lectura-palabras"], after: [17], vars: CONS },
  { n: 19, name: "La N de Nube", emoji: "☁️", description: "na, ne, ni, no, nu.", objective: "Relacionar N con /n/.", contents: ["Correspondencia fonema-grafema"], skills: ["l-grafema-fonema", "l-silabas", "l-lectura-palabras"], after: [18], vars: CONS },
  { n: 20, name: "La D de Dado", emoji: "🎲", description: "da, de, di, do, du.", objective: "Relacionar D con /d/.", contents: ["Correspondencia fonema-grafema"], skills: ["l-grafema-fonema", "l-silabas", "l-lectura-palabras"], after: [19], vars: CONS },
  { n: 21, name: "La R de Ratón", emoji: "🐭", description: "ra, re, ri, ro, ru… ¡y la rr!", objective: "Relacionar R con su sonido (suave y fuerte).", contents: ["Correspondencia fonema-grafema"], skills: ["l-grafema-fonema", "l-silabas", "l-lectura-palabras"], after: [20], vars: CONS },
  { n: 22, name: "La C de Casa", emoji: "🏠", description: "ca, co, cu.", objective: "Relacionar C con /k/ en ca, co, cu.", contents: ["Correspondencia fonema-grafema"], skills: ["l-grafema-fonema", "l-silabas", "l-lectura-palabras"], after: [21], vars: CONS },
  { n: 23, name: "La F de Foca", emoji: "🦭", description: "fa, fe, fi, fo, fu.", objective: "Relacionar F con /f/.", contents: ["Correspondencia fonema-grafema"], skills: ["l-grafema-fonema", "l-silabas", "l-lectura-palabras"], after: [22], vars: CONS },
  { n: 24, name: "La B y la V", emoji: "🐄", description: "Suenan igual: bote y vaca.", objective: "Reconocer B y V (mismo sonido, distinta letra).", contents: ["Correspondencia fonema-grafema", "Duda ortográfica inicial"], skills: ["l-grafema-fonema", "l-lectura-palabras"], after: [23], vars: CONS },
  { n: 25, name: "La G de Gato", emoji: "🐱", description: "ga, go, gu.", objective: "Relacionar G con /g/ en ga, go, gu.", contents: ["Correspondencia fonema-grafema"], skills: ["l-grafema-fonema", "l-silabas", "l-lectura-palabras"], after: [24], vars: CONS },
  { n: 26, name: "La Ñ, la J y la LL", emoji: "🐦", description: "Ñandú, jirafa y llave.", objective: "Reconocer Ñ, J y LL.", contents: ["Correspondencia fonema-grafema"], skills: ["l-grafema-fonema", "l-lectura-palabras"], after: [25], vars: CONS },
  { n: 27, name: "Exploramos el Abecedario", emoji: "🔤", description: "Todas las letras y sus nombres.", objective: "Conocer el nombre de todas las letras y el abecedario como orden (exploratorio).", contents: ["Empleo del abecedario", "Nombre de las letras"], skills: ["l-letra-nombre"], after: [26], kind: "integracion", vars: { language: "letra", options: 4, autonomy: "guiado" } },
  // Lectura
  { n: 28, name: "Armo Palabras", emoji: "🧩", description: "Juntá sílabas y formá palabras.", objective: "Formar palabras combinando sílabas.", contents: ["Lectura y escritura asidua de palabras"], skills: ["l-silabas", "l-lectura-palabras", "l-escritura"], after: [17], vars: { language: "palabra", imageSupport: true, steps: 2 } },
  { n: 29, name: "Separo Palabras", emoji: "✂️", description: "Las palabras van separadas en la oración.", objective: "Reconocer la palabra como unidad y la separación entre palabras; la oración empieza con mayúscula y termina con punto.", contents: ["La palabra como unidad", "La oración: mayúscula y punto", "Direccionalidad de la escritura"], skills: ["l-lectura-oraciones", "l-escritura"], after: [28], vars: { language: "oracion", imageSupport: true } },
  { n: 30, name: "Leo Oraciones", emoji: "📜", description: "Leé y encontrá el dibujo.", objective: "Leer oraciones breves con apoyo de ilustraciones.", contents: ["Lectura de palabras y oraciones con abundantes ilustraciones"], skills: ["l-lectura-oraciones", "l-comprension-lectora"], after: [29], vars: { language: "oracion", imageSupport: true, options: 3 } },
  { n: 31, name: "Leo Textos Breves", emoji: "📰", description: "Pequeños textos para leer y entender.", objective: "Leer textos breves y localizar información.", contents: ["Lectura exploratoria y localización de información"], skills: ["l-comprension-lectora"], after: [30], vars: { language: "texto", imageSupport: true, options: 3, autonomy: "guiado" } },
  // Literatura
  { n: 32, name: "La Biblioteca de Cuentos", emoji: "📚", description: "Escuchá el cuento y contá qué pasó.", objective: "Comprender cuentos leídos: personajes, lugar, inicio, problema y final.", contents: ["Comprensión de narraciones con estructura canónica", "Situación inicial, conflicto y resolución"], skills: ["l-comprension-oral", "l-literatura"], after: [3], vars: { language: "texto", audioSupport: true, imageSupport: true, memory: true } },
  { n: 33, name: "Poemas, Coplas y Rondas", emoji: "🎶", description: "Jugá con poemas, coplas y canciones.", objective: "Disfrutar y explorar rimas, repeticiones y juegos en poemas, coplas y rondas.", contents: ["Escucha y disfrute de poesías, coplas, canciones y rondas", "Exploración de rimas y repeticiones"], skills: ["l-literatura", "l-rimas"], after: [5] },
  { n: 34, name: "Adivinanzas y Trabalenguas", emoji: "🤔", description: "¿Qué será, qué será?", objective: "Resolver adivinanzas y jugar con trabalenguas y disparates.", contents: ["Memorización y recitación de adivinanzas", "Juegos con el lenguaje"], skills: ["l-literatura", "l-comprension-oral"], after: [33] },
  { n: 35, name: "Reconstruyo la Historia", emoji: "🎞️", description: "Ordená lo que pasó primero, después y al final.", objective: "Renarrar ordenando acciones en el tiempo.", contents: ["Renarración de cuentos", "Ordenamiento cronológico de las acciones"], skills: ["l-comprension-oral", "l-literatura"], after: [32], vars: { steps: 3, memory: true } },
  // Escritura
  { n: 36, name: "Trazos y Letras", emoji: "✍️", description: "Repasá letras con el dedo.", objective: "Trazar letras respetando dirección y orientación.", contents: ["Direccionalidad y orientación de las letras"], skills: ["l-trazos"], after: [10] },
  { n: 37, name: "Escribo Palabras", emoji: "🔡", description: "Escribí palabras con letras móviles.", objective: "Escribir palabras con las letras trabajadas (letras móviles).", contents: ["Escritura asidua de palabras", "Correspondencia fonema-grafema en el orden correcto"], skills: ["l-escritura", "l-grafema-fonema"], after: [17] },
  { n: 38, name: "Listas, Títulos y Epígrafes", emoji: "📝", description: "¿Qué título le pondrías?", objective: "Reconocer y producir listas, títulos y epígrafes con acompañamiento.", contents: ["Listas de personajes, nombres y elementos", "Títulos posibles para un cuento", "Epígrafes para una ilustración"], skills: ["l-textos-breves", "l-escritura"], after: [37] },
  { n: 39, name: "Mensajes e Invitaciones", emoji: "💌", description: "Armá un mensaje o una invitación.", objective: "Reconocer partes y propósito de mensajes e invitaciones; completarlos.", contents: ["Mensajes", "Invitaciones para eventos escolares", "Respuestas a preguntas sobre temas conocidos"], skills: ["l-textos-breves", "l-escritura"], after: [38] },
]);

// ------------------------------------------------------------------
// MATEMÁTICA
// ------------------------------------------------------------------
export const GRADE1_MATEMATICA: WorldDef[] = build("matematica", [
  { n: 1, name: "¿Para Qué Sirven los Números?", emoji: "🔢", description: "Números en la calle, en la casa y en la escuela.", objective: "Explorar contextos y funciones de los números en el uso social.", contents: ["Exploración de diferentes contextos y funciones de los números"], skills: ["m-numeros-10"], after: [], vars: { imageSupport: true, numberRange: 10, options: 3 } },
  { n: 2, name: "¿Cuántos Hay?", emoji: "🍎", description: "Mirá y decí cuántos hay.", objective: "Reconocer cantidades pequeñas (hasta 5) y comparar colecciones.", contents: ["Resolución de situaciones de conteo de colecciones"], skills: ["m-cantidades", "m-conteo"], after: [1], vars: { elements: 5, numberRange: 5, options: 3, imageSupport: true } },
  { n: 3, name: "Contamos hasta 10", emoji: "🧸", description: "Contá cada uno una sola vez.", objective: "Contar colecciones hasta 10 con correspondencia uno a uno.", contents: ["Conteo de colecciones de objetos"], skills: ["m-conteo"], after: [2], vars: { elements: 10, numberRange: 10, options: 3 } },
  { n: 4, name: "Los Números hasta 10", emoji: "🔟", description: "Leé, escribí y uní números con cantidades.", objective: "Leer, escribir y asociar números hasta 10 con cantidades.", contents: ["Designación oral y representación escrita de números"], skills: ["m-numeros-10"], after: [3] },
  { n: 5, name: "Más, Menos o Igual", emoji: "⚖️", description: "¿Dónde hay más?", objective: "Comparar cantidades y números hasta 10.", contents: ["Comparar cantidades y posiciones"], skills: ["m-comparar"], after: [4] },
  { n: 6, name: "Antes y Después", emoji: "👣", description: "¿Qué número viene antes? ¿Y después?", objective: "Ordenar números y encontrar anterior y posterior hasta 20.", contents: ["Orden de la serie numérica"], skills: ["m-orden"], after: [5], vars: { numberRange: 20 } },
  { n: 7, name: "La Fila de los Números", emoji: "📏", description: "Saltá por la recta numérica.", objective: "Ubicar números en la recta numérica hasta 20.", contents: ["Regularidades de la serie numérica"], skills: ["m-orden", "m-numeros-10"], after: [6], vars: { numberRange: 20 } },
  { n: 8, name: "Hasta el 30", emoji: "📅", description: "Los números del calendario.", objective: "Leer, escribir y ordenar números hasta 30 usando regularidades.", contents: ["Regularidades en la serie (del 10 al 30)"], skills: ["m-numeros-100", "m-orden"], after: [7], vars: { numberRange: 30 } },
  { n: 9, name: "El Cuadro de los Números", emoji: "🔲", description: "Del 1 al 100: ¡descubrí los secretos!", objective: "Usar regularidades del cuadro de números hasta 100 (de 1 en 1 y de 10 en 10).", contents: ["Regularidades en la serie numérica hasta 100", "Uso de números redondos para leer y escribir otros"], skills: ["m-numeros-100", "m-patrones"], after: [8], vars: { numberRange: 100 } },
  { n: 10, name: "Dieces y Unos", emoji: "💵", description: "Billetes de $10 y monedas de $1.", objective: "Analizar el valor de la cifra según su posición (dieces y unos) con dinero.", contents: ["Valor posicional en términos de unos y dieces", "Escrituras aditivas con billetes de $10 y monedas de $1"], skills: ["m-numeros-100", "m-dinero", "m-composicion"], after: [9] },
  { n: 11, name: "Formo el 10", emoji: "🔟", description: "5 y 5, 6 y 4… ¡muchas formas!", objective: "Componer y descomponer aditivamente números (especialmente el 10).", contents: ["Composiciones y descomposiciones aditivas"], skills: ["m-composicion", "m-calculo-mental"], after: [4] },
  { n: 12, name: "Agrego y Junto", emoji: "➕", description: "Problemas de juntar y agregar.", objective: "Resolver problemas de unir y agregar con dibujos, marcas o cálculos.", contents: ["Problemas de suma: unir, agregar, ganar"], skills: ["m-suma", "m-problemas"], after: [11] },
  { n: 13, name: "Saco y Pierdo", emoji: "➖", description: "Problemas de quitar y perder.", objective: "Resolver problemas de quitar y perder.", contents: ["Problemas de resta: quitar, perder"], skills: ["m-resta", "m-problemas"], after: [12] },
  { n: 14, name: "Avanzo y Retrocedo", emoji: "🎲", description: "Juegos de dados y casilleros.", objective: "Resolver situaciones de avanzar y retroceder en recorridos numerados.", contents: ["Problemas de avanzar y retroceder"], skills: ["m-suma", "m-resta", "m-orden"], after: [13] },
  { n: 15, name: "Cálculos que Ya Sé", emoji: "🧠", description: "Dobles, +1, +10… ¡en la cabeza!", objective: "Construir un repertorio de cálculos memorizados (dobles, +1, −1, +10, sumas que dan 10).", contents: ["Repertorio memorizado de sumas y restas", "Cómo cambia un número al sumar o restar 1 o 10"], skills: ["m-calculo-mental"], after: [12] },
  { n: 16, name: "Grupos Iguales", emoji: "🧺", description: "¿Cuántos hay en total?", objective: "Determinar la cantidad de una colección formada por grupos iguales.", contents: ["Problemas con grupos de igual cantidad (sumas repetidas)"], skills: ["m-suma", "m-problemas"], after: [15] },
  { n: 17, name: "Repartimos", emoji: "🍬", description: "Repartir para que todos tengan igual.", objective: "Explorar problemas de reparto con dibujos, marcas y sumas.", contents: ["Exploración de problemas de reparto"], skills: ["m-problemas"], after: [16] },
  { n: 18, name: "El Almacén", emoji: "🏪", description: "Comprar, pagar y dar el vuelto.", objective: "Resolver problemas con dinero y elaborar preguntas a partir de información.", contents: ["Problemas en el contexto del dinero", "Elaboración de preguntas a partir de información"], skills: ["m-dinero", "m-problemas"], after: [10, 13] },
  { n: 19, name: "¿Dónde Está?", emoji: "📍", description: "Arriba, abajo, adelante, al lado…", objective: "Comunicar oralmente la ubicación de personas y objetos.", contents: ["Comunicación oral de la ubicación en el espacio"], skills: ["m-espacio"], after: [], vars: { imageSupport: true, options: 3 } },
  { n: 20, name: "Caminos y Planos", emoji: "🗺️", description: "Seguí el camino y leé el plano.", objective: "Interpretar recorridos y planos sencillos de espacios conocidos.", contents: ["Desplazamientos y trayectos", "Interpretación de planos de espacios conocidos"], skills: ["m-espacio"], after: [19] },
  { n: 21, name: "Figuras", emoji: "🔺", description: "Lados rectos, bordes curvos, vértices.", objective: "Reconocer figuras por sus bordes, lados y vértices.", contents: ["Características de figuras planas: bordes curvos o rectos, lados y vértices"], skills: ["m-geometria"], after: [19] },
  { n: 22, name: "Cuerpos", emoji: "🧊", description: "Cubos, prismas, esferas y cilindros.", objective: "Explorar características de cuerpos geométricos.", contents: ["Exploración de cubos y prismas"], skills: ["m-geometria"], after: [21] },
  { n: 23, name: "Más Largo, Más Pesado", emoji: "📐", description: "Comparar largos, pesos y capacidades.", objective: "Comparar longitudes, pesos y capacidades de forma directa e indirecta.", contents: ["Comparación directa e indirecta de longitudes, pesos y capacidades", "Unidades no convencionales"], skills: ["m-medida"], after: [21] },
  { n: 24, name: "Días, Semanas y Meses", emoji: "🗓️", description: "Usamos el calendario.", objective: "Conocer los días de la semana, los meses y usar el calendario.", contents: ["Distribución de días en la semana y meses en el año", "Uso del calendario para ubicar fechas"], skills: ["m-medida", "m-orden"], after: [8] },
]);

// ------------------------------------------------------------------
// CIENCIAS SOCIALES
// ------------------------------------------------------------------
export const GRADE1_SOCIALES: WorldDef[] = build("sociales", [
  { n: 1, name: "Mi Historia", emoji: "👶", description: "Cuando eras bebé y ahora.", objective: "Reconocer la historia personal y familiar como iniciación en la temporalidad.", contents: ["Historia personal y familiar"], skills: ["s-identidad", "s-tiempo"], after: [] },
  { n: 2, name: "Mi Familia y mis Amigos", emoji: "👨‍👩‍👧", description: "Hay muchas formas de familia.", objective: "Identificar grupos sociales primarios (familia, amigos), sus miembros y roles.", contents: ["Grupos sociales primarios: miembros y roles"], skills: ["s-identidad"], after: [1] },
  { n: 3, name: "Lo que Necesitamos", emoji: "🏡", description: "Comida, casa, salud, escuela…", objective: "Reconocer necesidades sociales y formas de satisfacerlas, en el pasado y el presente.", contents: ["Necesidades educativas, habitacionales, alimentarias, sanitarias"], skills: ["s-convivencia", "s-trabajos"], after: [2] },
  { n: 4, name: "Las Instituciones de mi Pueblo", emoji: "🏥", description: "Escuela, hospital, club…", objective: "Conocer instituciones que dan respuesta a necesidades de la vida en sociedad.", contents: ["Escuelas, hospitales, clubes, cooperativas, centros culturales"], skills: ["s-trabajos", "s-espacios"], after: [3] },
  { n: 5, name: "Normas y Acuerdos", emoji: "🤝", description: "Reglas para convivir mejor.", objective: "Conocer funciones de las normas y formas de resolver conflictos.", contents: ["Normas y resolución de conflictos"], skills: ["s-convivencia"], after: [2] },
  { n: 6, name: "Derechos y Deberes", emoji: "⚖️", description: "Lo que tenemos derecho y lo que nos toca hacer.", objective: "Identificar derechos y deberes en la familia y la escuela; participación y cooperación.", contents: ["Deberes y derechos en contextos familiar y escolar", "Participación, cooperación y solidaridad"], skills: ["s-convivencia"], after: [5] },
  { n: 7, name: "Campo y Ciudad", emoji: "🏘️", description: "¿Cómo es el lugar donde vivo?", objective: "Identificar características del espacio cercano (urbano/rural) y compararlo con espacios lejanos.", contents: ["Espacio cercano urbano/rural y espacios lejanos"], skills: ["s-espacios"], after: [] },
  { n: 8, name: "Naturaleza y Construcciones", emoji: "🌳", description: "¿Lo hizo la naturaleza o las personas?", objective: "Reconocer elementos de la naturaleza y construidos por la sociedad.", contents: ["Elementos naturales y construidos"], skills: ["s-espacios"], after: [7] },
  { n: 9, name: "Del Campo a la Mesa", emoji: "🐑", description: "Lana, leche, verduras: ¿cómo se producen?", objective: "Identificar actores, herramientas, trabajos y transformaciones en la producción de un bien primario.", contents: ["Producción de un bien primario", "Uso de la tierra: agricultura, ganadería, horticultura, minería"], skills: ["s-trabajos", "s-espacios"], after: [8] },
  { n: 10, name: "Servicios de mi Localidad", emoji: "💡", description: "Agua, luz, transporte…", objective: "Conocer servicios urbanos que mejoran la calidad de vida y dificultades por su falta.", contents: ["Servicios: agua corriente, alumbrado, transporte", "Falta de acceso a servicios"], skills: ["s-espacios", "s-trabajos"], after: [7] },
  { n: 11, name: "Los Transportes", emoji: "🚌", description: "¿Cómo viajan personas y cosas?", objective: "Reconocer usos y características de medios de transporte urbanos y rurales.", contents: ["Medios de transporte en espacios urbanos y rurales"], skills: ["s-espacios"], after: [10] },
  { n: 12, name: "Mapas, Planos y Croquis", emoji: "🗺️", description: "Dibujar lugares vistos desde arriba.", objective: "Observar representaciones del espacio y aproximarse a croquis sencillos.", contents: ["Croquis, planos, mapas", "Representación gráfica mediante dibujos y croquis"], skills: ["s-espacios"], after: [8] },
  { n: 13, name: "Antes y Ahora", emoji: "🕰️", description: "Cómo se vivía antes y cómo vivimos hoy.", objective: "Comparar aspectos de la vida cotidiana del pasado y el presente (vivienda, cocina, vestido, escritura).", contents: ["Cambios y continuidades en la vida cotidiana"], skills: ["s-tiempo"], after: [1] },
  { n: 14, name: "Cómo se Hacía Antes", emoji: "🧶", description: "Pan, telar, velas… y máquinas.", objective: "Comparar formas de producción del pasado y actuales y sus tecnologías.", contents: ["Producción del pasado y actual: pan, tejido, tracción a sangre, iluminación"], skills: ["s-tiempo", "s-trabajos"], after: [13] },
  { n: 15, name: "Comprar y Vender", emoji: "🛍️", description: "Dinero, precios e intercambio.", objective: "Relacionar compra-venta, ganancia e intercambio con ejemplos de consumo infantil.", contents: ["Compra-venta, ganancia e intercambio"], skills: ["s-trabajos"], after: [9] },
  { n: 16, name: "Los Pueblos Originarios", emoji: "🪶", description: "Cómo vivían los aonikenk (tehuelches).", objective: "Aproximarse a actividades, trabajos y costumbres de sociedades indígenas.", contents: ["Vida cotidiana de sociedades indígenas"], skills: ["s-cultura", "s-tiempo"], after: [13] },
  { n: 17, name: "Huellas del Pasado", emoji: "🏺", description: "Objetos y construcciones que cuentan historias.", objective: "Conocer objetos y huellas materiales del pasado.", contents: ["Objetos, construcciones y huellas del pasado"], skills: ["s-tiempo", "s-cultura"], after: [16] },
  { n: 18, name: "Fiestas y Fechas Patrias", emoji: "🇦🇷", description: "Celebramos y recordamos juntos.", objective: "Conocer y participar de celebraciones y conmemoraciones.", contents: ["Celebraciones y conmemoraciones"], skills: ["s-cultura"], after: [] },
]);

// ------------------------------------------------------------------
// CIENCIAS NATURALES
// ------------------------------------------------------------------
export const GRADE1_NATURALES: WorldDef[] = build("naturales", [
  { n: 1, name: "Un Mundo Lleno de Vida", emoji: "🌱", description: "Plantas, animales y personas.", objective: "Reconocer la diversidad de seres vivos y distinguirlos de lo no vivo.", contents: ["Diversidad de seres vivos: vegetales, animales y personas"], skills: ["n-seres-vivos"], after: [] },
  { n: 2, name: "Plantas y Animales de mi Lugar", emoji: "🦙", description: "Los que viven cerca de casa.", objective: "Identificar plantas y animales del entorno inmediato (Patagonia).", contents: ["Plantas y animales del entorno inmediato"], skills: ["n-animales", "n-plantas"], after: [1] },
  { n: 3, name: "¿Cómo Son los Animales?", emoji: "🐾", description: "Plumas, pelos, escamas, patas…", objective: "Describir características distintivas de animales por observación.", contents: ["Características propias de los animales"], skills: ["n-animales"], after: [2] },
  { n: 4, name: "¿Cómo Son las Plantas?", emoji: "🌻", description: "Raíz, tallo, hojas, flores y frutos.", objective: "Describir características y partes de las plantas.", contents: ["Características propias de las plantas"], skills: ["n-plantas"], after: [2] },
  { n: 5, name: "Todos Crecemos", emoji: "🍼", description: "Comer, respirar, crecer…", objective: "Comparar funciones vitales de las personas con los demás seres vivos.", contents: ["Funciones vitales de las personas y otros seres vivos"], skills: ["n-seres-vivos"], after: [3, 4] },
  { n: 6, name: "Mi Cuerpo", emoji: "🧍", description: "Partes del cuerpo y los sentidos.", objective: "Ubicar y describir características externas del cuerpo humano.", contents: ["Características externas del cuerpo humano"], skills: ["n-cuerpo"], after: [] },
  { n: 7, name: "Me Cuido y te Cuido", emoji: "🧼", description: "Hábitos saludables y respeto.", objective: "Conocer hábitos saludables, el cuidado del cuerpo y el respeto por el propio cuerpo y el ajeno.", contents: ["Hábitos saludables", "Cuidado y respeto del cuerpo"], skills: ["n-cuerpo"], after: [6] },
  { n: 8, name: "¿De Qué Está Hecho?", emoji: "🪵", description: "Madera, metal, plástico, tela…", objective: "Reconocer materiales, sus características y usos.", contents: ["Materiales: características comunes, distintivas y usos"], skills: ["n-materiales"], after: [] },
  { n: 9, name: "Lo Descubro con mis Sentidos", emoji: "👃", description: "Duro, blando, liso, áspero…", objective: "Identificar propiedades de materiales perceptibles por los sentidos.", contents: ["Propiedades de los materiales percibidas por los sentidos"], skills: ["n-materiales"], after: [8] },
  { n: 10, name: "Sólidos y Líquidos", emoji: "💧", description: "¿Se derrama o mantiene su forma?", objective: "Describir diferencias observables entre materiales sólidos y líquidos.", contents: ["Diferencias entre líquidos y sólidos"], skills: ["n-materiales"], after: [9] },
  { n: 11, name: "Aplastar, Estirar, Empujar", emoji: "🫸", description: "¿Qué le pasa a las cosas?", objective: "Observar cómo acciones mecánicas producen cambios en los cuerpos.", contents: ["Acciones mecánicas y sus efectos"], skills: ["n-materiales", "n-fenomenos"], after: [9] },
  { n: 12, name: "Luz y Sombra", emoji: "🔦", description: "Jugamos con la luz.", objective: "Reconocer la luz como fenómeno natural mediante sombras y oscuridad.", contents: ["La luz: sombra y oscuridad"], skills: ["n-fenomenos"], after: [] },
  { n: 13, name: "Los Paisajes", emoji: "🏞️", description: "Agua, aire, tierra, cielo y seres vivos.", objective: "Aproximarse al concepto de paisaje como conjunto de elementos observables.", contents: ["El paisaje como conjunto de elementos observables"], skills: ["n-fenomenos", "n-ambiente"], after: [2] },
  { n: 14, name: "Paisajes que Cambian", emoji: "🍂", description: "Estaciones, lluvia y personas.", objective: "Reconocer la diversidad de paisajes, sus cambios, causas y usos; cuidar el ambiente.", contents: ["Diversidad de paisajes, cambios y usos"], skills: ["n-fenomenos", "n-ambiente"], after: [13] },
  { n: 15, name: "El Cielo de Día y de Noche", emoji: "🌙", description: "Sol, Luna, nubes y estrellas.", objective: "Identificar cuerpos del cielo de día y de noche.", contents: ["Cuerpos que conforman el cielo de día y de noche"], skills: ["n-fenomenos"], after: [12] },
]);

export const GRADE1_WORLDS: WorldDef[] = [
  ...GRADE1_LENGUA,
  ...GRADE1_MATEMATICA,
  ...GRADE1_SOCIALES,
  ...GRADE1_NATURALES,
];
