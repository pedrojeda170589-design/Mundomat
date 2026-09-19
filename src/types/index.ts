// Tipos compartidos de MundoMat

export type StudentType = "aula" | "agregado";

export interface Student {
  code: string;
  name: string;
  type: StudentType;
  createdAt: string;
}

export interface ActivityResult {
  worldId: number;
  activityIndex: number;
  correct: number;
  incorrect: number;
  timeSpentSeconds: number;
  finishedAt: string;
}

export interface StudentProgress {
  code: string;
  completedWorlds: number[]; // ids de mundos completados (todas las 10 actividades con buen puntaje)
  activityLog: ActivityResult[];
  lastPlayedAt?: string;
  coins: number; // moneda ganada por respuestas correctas / mundos completados
  // Personalización propia del alumno (no afecta el nombre real, que sigue
  // viviendo en Student.name y es el único que ve el docente).
  avatar?: string; // uno de AVATAR_OPTIONS
  nickname?: string; // apodo elegido por el alumno para verse en el juego
}

// Avatares que el alumno puede elegir para personalizar su perfil de juego.
export const AVATAR_OPTIONS: string[] = [
  "🦁",
  "🐯",
  "🐼",
  "🐸",
  "🐵",
  "🦊",
  "🐶",
  "🐱",
  "🐰",
  "🦄",
  "🐧",
  "🐢",
  "🦖",
  "🐬",
  "🚀",
  "⭐",
];

export const MAX_NICKNAME_LENGTH = 18;

export type MedalTier = "ninguna" | "bronce" | "plata" | "oro";

export interface WorldsConfig {
  enabledWorldIds: number[];
}

export type WorldCategory =
  // Matemática
  | "numeros" // lectura, escritura, orden y valor posicional
  | "sumas-restas" // sumas y restas en sus distintos sentidos
  | "calculo-mental" // conteo, sumas repetidas, conmutativa, estimación
  | "espacio" // ubicación, croquis, medición de longitud
  | "tabla" // tabla de multiplicar (agrupadas por dificultad)
  | "reparto" // division / reparto equitativo
  | "geometria" // figuras geometricas
  | "medidas" // capacidad y peso
  | "problemas" // situaciones problematicas con las 4 operaciones
  | "fracciones" // mitades y cuartos
  | "numeros-grandes" // sumas y restas 2-3 cifras, calculadora, estimación
  | "cuerpos-tiempo" // cuerpos geométricos y equivalencias de tiempo
  // Lengua
  | "oralidad-inicial" // rimas, adivinanzas, trabalenguas, narración sencilla
  | "lectura-cuentos" // cuentos, fábulas y poesías compartidas
  | "escritura-inicial" // textos cortos y ortografía básica
  | "clases-palabras" // sustantivo, adjetivo, verbo, sinónimos y antónimos
  | "lectura-narrativa" // leyendas, historietas, estructura narrativa
  | "lectura-informativa" // textos informativos y paratextos
  | "escritura-narrativa" // cartas, historietas propias, conectores
  | "formacion-palabras" // concordancia, prefijos, sílaba tónica, ortografía
  | "oralidad-debate" // debates y recursos expresivos
  | "lectura-autonoma" // información explícita/implícita, síntesis
  | "escritura-creativa" // cuentos propios, instructivos, planificación
  | "sentido-palabras" // connotación/denotación, ortografía avanzada
  // Ciencias Naturales
  | "seres-vivos-diversidad" // fauna y flora local, cuerpo humano, cuidado
  | "materiales-mezclas" // mezclas sencillas y registro de observaciones
  | "fenomenos-fisicos-basicos" // calor, frío, conducción, acciones mecánicas
  | "paisajes-orientacion" // paisajes locales/provinciales, puntos cardinales
  | "seres-vivos-interacciones" // cadenas alimentarias, higiene, agua potable
  | "materiales-cambios-estado" // cambios de estado y separación de mezclas
  | "sonido-vibracion" // sonido, vibración, conducción del calor
  | "cielo-fenomenos-atmosfericos" // paisajes y fenómenos atmosféricos, Sol y Luna
  | "seres-vivos-comparacion" // diversidad de seres vivos, cuerpo humano
  | "materiales-informes" // transformaciones complejas e informes sencillos
  | "fenomenos-fisicos-integracion" // luz, sonido y calor integrados
  | "tiempo-orientacion" // ciclos del cielo, tiempo atmosférico, puntos cardinales
  // Ciencias Sociales
  | "paisajes-urbano-rural" // paisajes urbanos/rurales, elementos naturales/sociales, croquis
  | "sociedad-colonial" // grupos sociales coloniales, vida cotidiana, nociones temporales
  | "autoridades-convivencia" // cabildo/autoridades locales, normas, conflictos y diálogo
  | "circuitos-productivos" // actores, componentes y etapas de un circuito productivo
  | "patrimonio-cambios" // cambios/continuidades, huellas del pasado, patrimonio
  | "gobierno-municipal" // Intendente, Concejo Deliberante, ordenanzas, deberes y derechos
  | "transporte-ambiente" // transporte, recursos naturales y problemáticas ambientales
  | "linea-tiempo-historica" // nociones temporales, procesos históricos, conmemoraciones
  | "diversidad-ciudadania"; // diversidad cultural, derechos, proyectos colectivos

export type WorldDifficulty = "basico" | "avanzado";

export type WorldSubject = "matematica" | "lengua" | "naturales" | "sociales";

export interface WorldDef {
  id: number;
  name: string;
  emoji: string;
  subject: WorldSubject;
  category: WorldCategory;
  // para mundos de tipo "tabla": qué tablas se practican en este mundo
  tables?: number[];
  description: string;
  colorFrom: string;
  colorTo: string;
  // "basico": lectura en voz alta gratis (pensado para grados más chicos).
  // "avanzado": la lectura en voz alta y las pistas cuestan monedas.
  difficulty: WorldDifficulty;
}

export const SUBJECT_INFO: Record<WorldSubject, { label: string; emoji: string }> = {
  matematica: { label: "Matemática", emoji: "🔢" },
  lengua: { label: "Lengua", emoji: "📚" },
  naturales: { label: "Ciencias Naturales", emoji: "🔬" },
  sociales: { label: "Ciencias Sociales", emoji: "🏛️" },
};

export const TOTAL_ACTIVITIES_PER_WORLD = 10;

// Economía de monedas
export const COINS_PER_CORRECT_ANSWER = 1;
export const COINS_BONUS_WORLD_COMPLETE = 5;
export const COST_HINT = 2;
export const COST_VOICE_AVANZADO = 1;
