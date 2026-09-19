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
}

export type MedalTier = "ninguna" | "bronce" | "plata" | "oro";

export interface WorldsConfig {
  enabledWorldIds: number[];
}

export type WorldCategory =
  | "tabla" // tabla de multiplicar
  | "reparto" // division / reparto equitativo
  | "geometria" // figuras geometricas
  | "problemas" // situaciones problematicas
  | "numeros-grandes"; // sumas y restas 2-3 cifras

export type WorldDifficulty = "basico" | "avanzado";

export interface WorldDef {
  id: number;
  name: string;
  emoji: string;
  category: WorldCategory;
  // para mundos de tipo "tabla"
  table?: number;
  description: string;
  colorFrom: string;
  colorTo: string;
  // "basico": lectura en voz alta gratis (pensado para grados más chicos).
  // "avanzado": la lectura en voz alta y las pistas cuestan monedas.
  difficulty: WorldDifficulty;
}

export const TOTAL_ACTIVITIES_PER_WORLD = 10;

// Economía de monedas
export const COINS_PER_CORRECT_ANSWER = 1;
export const COINS_BONUS_WORLD_COMPLETE = 5;
export const COST_HINT = 2;
export const COST_VOICE_AVANZADO = 1;
