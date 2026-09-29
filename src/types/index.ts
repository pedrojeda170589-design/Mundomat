// Tipos compartidos de MundoMat

export type StudentType = "aula" | "agregado";

export interface Student {
  code: string;
  name: string;
  type: StudentType;
  createdAt: string;
  // Fecha de nacimiento "AAAA-MM-DD" (los cargados antes: "MM-DD", sin año).
  // La carga el docente. El día del cumple el
  // avatar del alumno aparece festejando (corona, fondo y torta) y se gana
  // la corona y el fondo de cumpleaños para siempre.
  birthday?: string;
  // Aula actual en la plataforma (Supabase). Sin valor = aula piloto de
  // siempre. Sirve para separar compañeros, mundos y novedades por aula.
  classroomId?: string;
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
  // Resumen de las actividades más viejas (para que el registro no crezca
  // sin fin y la app siga rápida): totales por mundo.
  activitySummary?: Record<number, { correct: number; incorrect: number; timeSpentSeconds: number }>;
  lastPlayedAt?: string;
  coins: number; // moneda ganada por respuestas correctas / mundos completados
  // Personalización propia del alumno (no afecta el nombre real, que sigue
  // viviendo en Student.name y es el único que ve el docente).
  avatar?: string; // personaje base elegido, uno de AVATAR_OPTIONS
  // Accesorios equipados (gorro, lentes, remera, etc.), uno por casillero
  // (AccessorySlot). Se desbloquean progresivamente completando mundos: ver
  // ACCESSORY_CATALOG y getUnlockedAccessoryIds().
  avatarAccessories?: AvatarAccessories;
  // Fondo detrás del avatar (los personajes son PNG con fondo transparente):
  // AUTO_BACKGROUND (el de la estación/festividad del momento), uno de los
  // fondos de siempre, o uno de temporada ya ganado. Ver BACKGROUND_OPTIONS.
  avatarBackground?: string;
  // Colección de premios de temporada ya ganados (ids de accesorios de
  // ACCESSORY_CATALOG_TEMPORADA y de fondos de temporada). Se ganan jugando
  // al menos una actividad mientras esa estación o festividad está activa, y
  // quedan para siempre. Ver src/lib/seasons.ts.
  seasonalCollection?: string[];
  nickname?: string; // apodo elegido por el alumno para verse en el juego
  // Desafío Especial de fin de semana (memorama con recompensa extra): fecha
  // "YYYY-MM-DD" de la última vez que lo jugó, para permitir uno por día.
  lastSpecialChallengeAt?: string;
  // Racha de fines de semana consecutivos jugando el Desafío Especial, y la
  // clave del último fin de semana en el que lo jugó (el sábado de ese fin
  // de semana), para saber si la racha sigue viva o se cortó.
  specialChallengeStreak?: number;
  lastSpecialChallengeWeekendKey?: string;
  // Aventura de fin de semana (Memoria Numérica): avance del día actual
  // (se reinicia cuando cambia el día) y cantidad de días completados.
  weekend?: WeekendRecord;
  weekendDaysCompleted?: number;
  // Sistema de refuerzo por mundo (umbral de dominio del 90%): un mundo
  // recién se marca "completado" cuando el alumno llega al 90% o más en una
  // vuelta y después repite el mundo una vez más (con cualquier puntaje).
  // - worldsPendingReinforcementRetry: ya llegó al 90%+, le falta esa
  //   repetición de refuerzo para quedar completado.
  // - worldsNeedingTeacherReview: su último intento no llegó al 90%; se
  //   muestra al docente en el Panel Docente y al alumno con un símbolo de
  //   "a fortalecer" hasta que llegue al 90% en un intento posterior.
  worldsPendingReinforcementRetry?: number[];
  worldsNeedingTeacherReview?: number[];
  // Último puntaje (0-100) del intento más reciente de cada mundo, para
  // mostrarlo en el Panel Docente.
  lastWorldAttemptScore?: Record<number, number>;
}

export interface WeekendRecord {
  dayKey: string; // "AAAA-MM-DD" (Argentina)
  completed: number; // actividades resueltas hoy (0..10), en orden
  points: number; // puntos del día
  finished: boolean;
  // Recompensa del cofre al completar las 10 del día.
  reward?: { coins: number; accessoryId?: string };
}

// Avatares (personajes base) que el alumno puede elegir para su perfil de
// juego. Cada uno es una ilustración propia (mismo estilo "Expedición
// Patagonia" que el resto de la app) en public/theme/avatars/<id>.jpg. Antes
// estos eran emojis sueltos; el id se mantiene como string simple para no
// romper la validación existente en lib/data.ts (AVATAR_OPTIONS.includes(...)).
// Son 14 personajes en total: los 4 animales patagónicos ya ilustrados, más
// 10 personajes de estudiante (variados: nenes y nenas, distintos tonos de
// piel y pelo) para que el avatar también pueda ser "una foto de perfil" de
// tipo chico/a.
export const AVATAR_OPTIONS: string[] = [
  "zorro",
  "guanaco",
  "condor",
  "pinguino",
  "explorador",
  "exploradora",
  "aventurero",
  "aventurera",
  "viajero",
  "viajera",
  "montanes",
  "montanesa",
  "curioso",
  "curiosa",
  "estandar-nena",
  "estandar-nino",
];

// Nombre y emoji decorativo de cada avatar, para el texto alternativo y como
// respaldo si la imagen no llegara a cargar.
export const AVATAR_INFO: Record<string, { label: string; emoji: string }> = {
  zorro: { label: "Zorro", emoji: "🦊" },
  guanaco: { label: "Guanaco", emoji: "🦙" },
  condor: { label: "Cóndor", emoji: "🦅" },
  pinguino: { label: "Pingüino", emoji: "🐧" },
  explorador: { label: "Explorador", emoji: "🧑" },
  exploradora: { label: "Exploradora", emoji: "👧" },
  aventurero: { label: "Aventurero", emoji: "👦" },
  aventurera: { label: "Aventurera", emoji: "🧒" },
  viajero: { label: "Viajero", emoji: "🙂" },
  viajera: { label: "Viajera", emoji: "😊" },
  montanes: { label: "Montañés", emoji: "🏔️" },
  montanesa: { label: "Montañesa", emoji: "🏔️" },
  curioso: { label: "Curioso", emoji: "🔎" },
  curiosa: { label: "Curiosa", emoji: "🔍" },
  "estandar-nena": { label: "Exploradora Estándar", emoji: "👧" },
  "estandar-nino": { label: "Explorador Estándar", emoji: "👦" },
};

// Los dos avatares "estándar" tienen un guardarropa mucho más amplio (ver
// ACCESSORY_CATALOG_ESTANDAR): gorros, camperas, mochilas y pañuelos de
// varios colores, en vez de los accesorios simples del resto de los
// personajes. getAccessoryCatalogForAvatar() decide cuál catálogo usar.
export const STANDARD_AVATAR_IDS: string[] = ["estandar-nena", "estandar-nino"];

export function isStandardAvatar(avatar?: string): boolean {
  return !!avatar && STANDARD_AVATAR_IDS.includes(avatar);
}

// Devuelve la ruta de imagen del avatar, con respaldo al primero de la lista
// si el valor guardado es viejo (emoji de antes de este cambio) o inválido.
// Los retratos son PNG con fondo transparente, para poder ponerles detrás el
// fondo que corresponda (ver BACKGROUND_OPTIONS y AvatarDisplay).
export function getAvatarSrc(avatar?: string): string {
  const id = avatar && AVATAR_OPTIONS.includes(avatar) ? avatar : AVATAR_OPTIONS[0];
  return `/theme/avatars/${id}.png`;
}

// Casillero de accesorio: cada personaje puede tener, como mucho, un
// accesorio equipado por casillero a la vez. "backpack" y "pendant" solo los
// usan los avatares "estándar" (mochila, y binoculares/collar respectivamente).
export type AccessorySlot =
  | "headwear"
  | "eyewear"
  | "face"
  | "torso"
  | "backpack"
  | "pendant";

export type AvatarAccessories = Partial<Record<AccessorySlot, string>>;

export type AccessoryGroup = "legacy" | "estandar" | "temporada";

export interface AccessoryDef {
  id: string;
  slot: AccessorySlot;
  label: string;
  emoji: string;
  // A qué guardarropa pertenece: "legacy" (personajes de siempre, ícono
  // simple), "estandar" (los dos avatares estándar, guardarropa realista) o
  // "temporada" (premios de estaciones y festividades, para todos).
  group: AccessoryGroup;
  // Solo para "temporada": la estación o festividad que lo entrega (ver
  // SEASONAL_EVENTS en src/lib/seasons.ts).
  eventId?: string;
}

// Catálogo "de siempre": accesorios simples (íconos planos) para los 14
// personajes originales (4 animales + 10 de estudiante). Desbloqueo
// "progresivo simple": cada mundo completado (sin importar la materia)
// desbloquea el siguiente accesorio de esta lista, en este orden fijo — ver
// getUnlockedAccessoryIds(). Cuando completa más mundos que accesorios hay
// en el catálogo, ya tiene todos desbloqueados (las medallas y monedas
// siguen sumando igual).
export const ACCESSORY_CATALOG: AccessoryDef[] = [
  { id: "gorro", slot: "headwear", label: "Gorro de lana", emoji: "🧶", group: "legacy" },
  { id: "gafas-sol", slot: "eyewear", label: "Gafas de sol", emoji: "🕶️", group: "legacy" },
  { id: "bufanda", slot: "face", label: "Bufanda", emoji: "🧣", group: "legacy" },
  { id: "gorra", slot: "headwear", label: "Gorra", emoji: "🧢", group: "legacy" },
  { id: "lentes", slot: "eyewear", label: "Lentes", emoji: "👓", group: "legacy" },
  { id: "mono", slot: "face", label: "Moño", emoji: "🎀", group: "legacy" },
  { id: "sombrero", slot: "headwear", label: "Sombrero explorador", emoji: "👒", group: "legacy" },
  { id: "medalla", slot: "pendant", label: "Medalla", emoji: "🏅", group: "legacy" },
  { id: "barbijo", slot: "face", label: "Barbijo", emoji: "😷", group: "legacy" },
  { id: "corona", slot: "headwear", label: "Corona", emoji: "👑", group: "legacy" },
];

// Guardarropa "estándar": mucho más amplio y realista, solo para
// "estandar-nena" / "estandar-nino". Mismo desbloqueo progresivo simple,
// pero sobre esta lista (28 objetos en total).
export const ACCESSORY_CATALOG_ESTANDAR: AccessoryDef[] = [
  { id: "gorra-rosa", slot: "headwear", label: "Gorra rosa", emoji: "🧢", group: "estandar" },
  { id: "campera-azul", slot: "torso", label: "Campera azul", emoji: "🧥", group: "estandar" },
  { id: "mochila-azul", slot: "backpack", label: "Mochila azul", emoji: "🎒", group: "estandar" },
  { id: "panuelo-azul", slot: "face", label: "Pañuelo azul", emoji: "🧣", group: "estandar" },
  { id: "gorro-pompon-azul", slot: "headwear", label: "Gorro de lana azul", emoji: "🧶", group: "estandar" },
  { id: "campera-roja", slot: "torso", label: "Campera roja", emoji: "🧥", group: "estandar" },
  { id: "mochila-naranja", slot: "backpack", label: "Mochila naranja", emoji: "🎒", group: "estandar" },
  { id: "panuelo-rosa", slot: "face", label: "Pañuelo rosa", emoji: "🧣", group: "estandar" },
  { id: "sombrero-safari", slot: "headwear", label: "Sombrero explorador", emoji: "👒", group: "estandar" },
  { id: "campera-verde", slot: "torso", label: "Campera verde", emoji: "🧥", group: "estandar" },
  { id: "mochila-verde", slot: "backpack", label: "Mochila verde", emoji: "🎒", group: "estandar" },
  { id: "panuelo-verde", slot: "face", label: "Pañuelo verde", emoji: "🧣", group: "estandar" },
  { id: "vincha-verde", slot: "headwear", label: "Vincha pañuelo", emoji: "🎀", group: "estandar" },
  { id: "lentes-sol", slot: "eyewear", label: "Lentes de sol", emoji: "🕶️", group: "estandar" },
  { id: "campera-amarilla", slot: "torso", label: "Campera amarilla", emoji: "🧥", group: "estandar" },
  { id: "mochila-violeta", slot: "backpack", label: "Mochila violeta", emoji: "🎒", group: "estandar" },
  { id: "panuelo-amarillo", slot: "face", label: "Pañuelo amarillo", emoji: "🧣", group: "estandar" },
  { id: "gorra-violeta", slot: "headwear", label: "Gorra violeta", emoji: "🧢", group: "estandar" },
  { id: "campera-violeta", slot: "torso", label: "Campera violeta", emoji: "🧥", group: "estandar" },
  { id: "mochila-rosa", slot: "backpack", label: "Mochila rosa", emoji: "🎒", group: "estandar" },
  { id: "binoculares", slot: "pendant", label: "Binoculares", emoji: "🔭", group: "estandar" },
  { id: "gorro-crema", slot: "headwear", label: "Gorro de lana crema", emoji: "🧶", group: "estandar" },
  { id: "mochila-marron", slot: "backpack", label: "Mochila marrón", emoji: "🎒", group: "estandar" },
  { id: "campera-rosa", slot: "torso", label: "Campera rosa", emoji: "🧥", group: "estandar" },
  { id: "antiparras-esqui", slot: "headwear", label: "Antiparras de esquí", emoji: "🥽", group: "estandar" },
  { id: "auriculares-rosa", slot: "headwear", label: "Auriculares rosas", emoji: "🎧", group: "estandar" },
  { id: "collar-brujula", slot: "pendant", label: "Collar con brújula", emoji: "🧭", group: "estandar" },
  { id: "auriculares-azul", slot: "headwear", label: "Auriculares azules", emoji: "🎧", group: "estandar" },
];

// Accesorios de temporada: no se desbloquean por mundos completados sino
// jugando durante una estación o festividad (ver src/lib/seasons.ts). Una
// vez ganados quedan en la colección del alumno para siempre y se pueden
// usar con cualquier personaje. Solo usan casilleros que todos los
// personajes tienen ubicados (cabeza, ojos, cuello, colgante).
export const ACCESSORY_CATALOG_TEMPORADA: AccessoryDef[] = [
  { id: "sombrero-paja", slot: "headwear", label: "Sombrero de paja", emoji: "👒", group: "temporada", eventId: "verano" },
  { id: "lentes-verano", slot: "eyewear", label: "Lentes de verano", emoji: "🕶️", group: "temporada", eventId: "verano" },
  { id: "boina-otono", slot: "headwear", label: "Boina de otoño", emoji: "🍂", group: "temporada", eventId: "otono" },
  { id: "gorro-orejeras", slot: "headwear", label: "Gorro con orejeras", emoji: "❄️", group: "temporada", eventId: "invierno" },
  { id: "bufanda-rayas", slot: "face", label: "Bufanda a rayas", emoji: "🧣", group: "temporada", eventId: "invierno" },
  { id: "corona-flores", slot: "headwear", label: "Corona de flores", emoji: "🌸", group: "temporada", eventId: "primavera" },
  { id: "flor-solapa", slot: "pendant", label: "Flor de solapa", emoji: "🌼", group: "temporada", eventId: "primavera" },
  { id: "antifaz-carnaval", slot: "eyewear", label: "Antifaz de carnaval", emoji: "🎭", group: "temporada", eventId: "carnaval" },
  { id: "orejas-conejo", slot: "headwear", label: "Orejas de conejo", emoji: "🐰", group: "temporada", eventId: "pascuas" },
  { id: "pin-malvinas", slot: "pendant", label: "Pin de Malvinas", emoji: "🇦🇷", group: "temporada", eventId: "malvinas" },
  { id: "escarapela", slot: "pendant", label: "Escarapela", emoji: "🎗️", group: "temporada", eventId: "semana-mayo" },
  { id: "vincha-argentina", slot: "headwear", label: "Vincha celeste y blanca", emoji: "🇦🇷", group: "temporada", eventId: "patria" },
  { id: "gorrito-fiesta", slot: "headwear", label: "Gorrito de fiesta", emoji: "🥳", group: "temporada", eventId: "infancias" },
  { id: "boina-gaucha", slot: "headwear", label: "Boina gaucha", emoji: "🐴", group: "temporada", eventId: "tradicion" },
  { id: "panuelo-gaucho", slot: "face", label: "Pañuelo gaucho", emoji: "🧣", group: "temporada", eventId: "tradicion" },
  { id: "gorro-navidad", slot: "headwear", label: "Gorro navideño", emoji: "🎅", group: "temporada", eventId: "navidad" },
  { id: "corona-cumple", slot: "headwear", label: "Corona de cumpleaños", emoji: "🎂", group: "temporada", eventId: "cumple" },
  // Premios del cofre de la Aventura de fin de semana (uno por cada día
  // completado, en este orden, hasta tenerlos todos).
  { id: "sombrero-mago", slot: "headwear", label: "Sombrero de mago de los números", emoji: "🧙", group: "temporada", eventId: "fin-de-semana" },
  { id: "lentes-estrella", slot: "eyewear", label: "Lentes de estrella", emoji: "⭐", group: "temporada", eventId: "fin-de-semana" },
  { id: "vincha-antenas", slot: "headwear", label: "Vincha de antenas", emoji: "🧠", group: "temporada", eventId: "fin-de-semana" },
  { id: "medalla-estrella", slot: "pendant", label: "Medalla de la memoria", emoji: "🏅", group: "temporada", eventId: "fin-de-semana" },
];

export const WEEKEND_REWARD_IDS = ACCESSORY_CATALOG_TEMPORADA.filter(
  (a) => a.eventId === "fin-de-semana"
).map((a) => a.id);

export const ALL_ACCESSORIES: AccessoryDef[] = [
  ...ACCESSORY_CATALOG,
  ...ACCESSORY_CATALOG_ESTANDAR,
  ...ACCESSORY_CATALOG_TEMPORADA,
];

// Qué catálogo de accesorios corresponde según el personaje elegido.
export function getAccessoryCatalogForAvatar(avatar?: string): AccessoryDef[] {
  return isStandardAvatar(avatar) ? ACCESSORY_CATALOG_ESTANDAR : ACCESSORY_CATALOG;
}

// Ids de accesorios ya desbloqueados según la cantidad de mundos completados
// (sistema "progresivo simple": el mundo N desbloquea el accesorio N de la
// lista de su catálogo, en orden fijo), para el catálogo que corresponde al
// personaje elegido.
export function getUnlockedAccessoryIds(
  completedWorldsCount: number,
  avatar?: string
): string[] {
  const catalog = getAccessoryCatalogForAvatar(avatar);
  return catalog
    .slice(0, Math.min(completedWorldsCount, catalog.length))
    .map((a) => a.id);
}

// Todos los accesorios que este personaje puede tener equipados en
// principio (su catálogo + los de temporada), sin mirar si ya los ganó.
export function getValidAccessoryIdsForAvatar(avatar?: string): Set<string> {
  return new Set([
    ...getAccessoryCatalogForAvatar(avatar).map((a) => a.id),
    ...ACCESSORY_CATALOG_TEMPORADA.map((a) => a.id),
  ]);
}

// Lo que el alumno puede equipar ahora mismo: lo desbloqueado de su
// catálogo por mundos completados + los premios de temporada ya ganados.
export function getEquippableAccessoryIds(
  completedWorldsCount: number,
  avatar: string | undefined,
  seasonalCollection: string[] = []
): Set<string> {
  const earned = new Set(seasonalCollection);
  return new Set([
    ...getUnlockedAccessoryIds(completedWorldsCount, avatar),
    ...ACCESSORY_CATALOG_TEMPORADA.filter((a) => earned.has(a.id)).map((a) => a.id),
  ]);
}

export function getAccessoryById(id: string): AccessoryDef | undefined {
  return ALL_ACCESSORIES.find((a) => a.id === id);
}

const ACCESSORY_FOLDER: Record<AccessoryGroup, string> = {
  legacy: "accessories",
  estandar: "accessories-estandar",
  temporada: "accessories-temporada",
};

export function getAccessorySrc(id: string): string {
  const def = getAccessoryById(id);
  return `/theme/${ACCESSORY_FOLDER[def?.group ?? "legacy"]}/${id}.png`;
}

// --- Fondos del avatar ---
//
// Como los personajes tienen fondo transparente, detrás se dibuja un fondo:
// - AUTO_BACKGROUND: el de la festividad activa, o si no hay, el de la
//   estación (ver getAutoBackgroundId en src/lib/seasons.ts). Es el valor
//   por defecto, así el avatar "se viste" de la época solo.
// - fondos "de siempre" (paisajes patagónicos y colores lisos), siempre
//   disponibles para elegir;
// - fondos de temporada (con eventId), que se ganan igual que los
//   accesorios de temporada y después se pueden elegir cuando se quiera.
export const AUTO_BACKGROUND = "auto";

export interface BackgroundDef {
  id: string;
  label: string;
  emoji: string;
  // CSS de fondo: una imagen en public/theme/backgrounds/ o un degradé.
  css: string;
  eventId?: string;
}

const bgImage = (id: string) => `center / cover no-repeat url(/theme/backgrounds/${id}.jpg)`;

export const BACKGROUND_OPTIONS: BackgroundDef[] = [
  { id: "patagonia", label: "Cordillera", emoji: "🏔️", css: bgImage("patagonia") },
  { id: "glaciar", label: "Glaciar", emoji: "🧊", css: bgImage("glaciar") },
  { id: "bosque", label: "Bosque", emoji: "🌳", css: bgImage("bosque") },
  { id: "noche-estrellada", label: "Noche estrellada", emoji: "🌙", css: bgImage("noche-estrellada") },
  { id: "color-celeste", label: "Celeste", emoji: "🔵", css: "linear-gradient(160deg, #bfe6ff, #5bb3ea)" },
  { id: "color-atardecer", label: "Atardecer", emoji: "🌅", css: "linear-gradient(160deg, #ffd89b, #f5857a)" },
  { id: "color-menta", label: "Menta", emoji: "🟢", css: "linear-gradient(160deg, #d4f7e3, #6fcf97)" },
  { id: "color-lavanda", label: "Lavanda", emoji: "🟣", css: "linear-gradient(160deg, #eadcff, #a78bfa)" },
  { id: "verano", label: "Verano", emoji: "☀️", css: bgImage("verano"), eventId: "verano" },
  { id: "otono", label: "Otoño", emoji: "🍁", css: bgImage("otono"), eventId: "otono" },
  { id: "invierno", label: "Invierno", emoji: "❄️", css: bgImage("invierno"), eventId: "invierno" },
  { id: "primavera", label: "Primavera", emoji: "🌷", css: bgImage("primavera"), eventId: "primavera" },
  { id: "carnaval", label: "Carnaval", emoji: "🎉", css: bgImage("carnaval"), eventId: "carnaval" },
  { id: "pascuas", label: "Pascuas", emoji: "🥚", css: bgImage("pascuas"), eventId: "pascuas" },
  { id: "malvinas", label: "Malvinas", emoji: "🌊", css: bgImage("malvinas"), eventId: "malvinas" },
  { id: "semana-mayo", label: "Semana de Mayo", emoji: "🏛️", css: bgImage("semana-mayo"), eventId: "semana-mayo" },
  { id: "patria", label: "Fiestas patrias", emoji: "🇦🇷", css: bgImage("patria"), eventId: "patria" },
  { id: "infancias", label: "Día de las Infancias", emoji: "🎈", css: bgImage("infancias"), eventId: "infancias" },
  { id: "tradicion", label: "Día de la Tradición", emoji: "🐎", css: bgImage("tradicion"), eventId: "tradicion" },
  { id: "navidad", label: "Navidad", emoji: "🎄", css: bgImage("navidad"), eventId: "navidad" },
  { id: "cumple", label: "Mi cumpleaños", emoji: "🎂", css: bgImage("cumple"), eventId: "cumple" },
];

export function getBackgroundById(id?: string): BackgroundDef | undefined {
  return BACKGROUND_OPTIONS.find((b) => b.id === id);
}

// ¿Puede el alumno elegir este fondo? "auto" y los de siempre, sí; los de
// temporada, solo si ya los ganó.
export function isBackgroundSelectable(id: string, seasonalCollection: string[] = []): boolean {
  if (id === AUTO_BACKGROUND) return true;
  const def = getBackgroundById(id);
  if (!def) return false;
  return !def.eventId || seasonalCollection.includes(`fondo:${def.id}`);
}

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

// Umbral de dominio para el sistema de refuerzo: porcentaje de aciertos que
// hay que alcanzar EN UNA VUELTA del mundo (no acumulado) para empezar a
// contar como dominado.
export const WORLD_MASTERY_THRESHOLD_PCT = 90;

// Economía de monedas
export const COINS_PER_CORRECT_ANSWER = 1;
export const COINS_BONUS_WORLD_COMPLETE = 5;
export const COST_HINT = 2;
export const COST_VOICE_AVANZADO = 1;
// Recompensa base del Desafío Especial de fin de semana (memorama): bastante
// más que una respuesta correcta (1) o completar un mundo (5), porque es un
// extra de una vez por día y solo disponible sábado y domingo.
export const COINS_SPECIAL_CHALLENGE = 12;
// Bonus por racha: cada fin de semana consecutivo jugando el Desafío
// Especial suma monedas extra por sobre la base, hasta un tope.
export const COINS_SPECIAL_CHALLENGE_STREAK_STEP = 2;
export const COINS_SPECIAL_CHALLENGE_STREAK_MAX_BONUS = 20;
