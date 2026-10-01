// Herramientas comunes para armar las actividades de 1.º grado.
import type { ActivityCard, ActivitySpec } from "@/lib/activities";
import { WordDef } from "@/lib/grade1/words";

export function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function sample<T>(arr: readonly T[], n: number): T[] {
  return shuffle(arr).slice(0, n);
}

export function pickOne<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function randInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

// Sin tildes, en minúscula (para comparar sílabas y sonidos).
export function plain(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-̂̄-ͯ]/g, "")
    .normalize("NFC");
}

export function wordCard(w: WordDef, showText = false): ActivityCard {
  return { id: w.word, emoji: w.emoji, label: showText ? w.word : undefined, say: w.word };
}

// Números en palabras (hasta 100), para la voz y las consignas.
const UNITS = ["cero", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez", "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve", "veinte", "veintiuno", "veintidós", "veintitrés", "veinticuatro", "veinticinco", "veintiséis", "veintisiete", "veintiocho", "veintinueve"];
const TENS = ["", "", "", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa"];
export function numberWord(n: number): string {
  if (n < 30) return UNITS[n];
  if (n === 100) return "cien";
  const t = Math.floor(n / 10);
  const u = n % 10;
  return u === 0 ? TENS[t] : `${TENS[t]} y ${UNITS[u]}`;
}

// Opciones numéricas cercanas a la respuesta (sin repetir, dentro del rango).
export function numberChoices(answer: number, count = 3, min = 0, max = 100): number[] {
  const set = new Set<number>([answer]);
  let spread = 1;
  while (set.size < count && spread < 50) {
    for (const d of shuffle([-spread, spread])) {
      const v = answer + d;
      if (v >= min && v <= max && set.size < count) set.add(v);
    }
    spread++;
  }
  return shuffle([...set]);
}

// --- Preguntas simples de "elegir" (formato compacto) ---------------------
//
// Formato usado por los contenidos escritos a mano (Sociales, Naturales y
// partes de Lengua/Matemática):
//
//   q("¿Qué necesita una planta para vivir?", [["💧", "Agua"], ["🧸", "Juguetes"], ["📺", "Tele"]], 0, "Pista…")
//
// - opciones: [emoji, texto] (el texto se muestra chico y se lee al tocar 🔊)
// - respuesta: índice de la correcta, o lista de índices si hay varias
// - las opciones se mezclan solas
export type Opt = [emoji: string, label: string];
export interface Q {
  prompt: string;
  options: Opt[];
  answer: number | number[];
  hint?: string;
  promptEmoji?: string;
  story?: { title: string; text: string };
  skills?: string[];
}

export function q(
  prompt: string,
  options: Opt[],
  answer: number | number[],
  hint?: string,
  extra?: Partial<Pick<Q, "promptEmoji" | "story" | "skills">>
): Q {
  return { prompt, options, answer, hint, ...extra };
}

export function qToPick(item: Q, id: string, title: string, defaultSkills: string[]): ActivitySpec {
  const answers = Array.isArray(item.answer) ? item.answer : [item.answer];
  const cards: ActivityCard[] = item.options.map(([emoji, label], i) => ({
    id: `o${i}`,
    emoji,
    label,
    say: label,
  }));
  return {
    type: "pick",
    id,
    title,
    prompt: item.prompt,
    promptEmoji: item.promptEmoji,
    story: item.story,
    cards: shuffle(cards),
    answerIds: answers.map((i) => `o${i}`),
    hint:
      item.hint ??
      (answers.length > 1 ? "Pista: hay más de una respuesta correcta." : "Pista: escuchá otra vez la pregunta y mirá bien los dibujos."),
    skills: item.skills ?? defaultSkills,
  };
}

// Toma hasta `n` preguntas al azar de un banco y las convierte en actividades.
export function fromBank(bank: Q[], n: number, prefix: string, skills: string[]): ActivitySpec[] {
  return sample(bank, Math.min(n, bank.length)).map((item, i) =>
    qToPick(item, `${prefix}-${i}`, `Actividad ${i + 1}`, skills)
  );
}

// Numera los títulos ("Actividad 1", "Actividad 2"…) al final.
export function numbered(acts: ActivitySpec[]): ActivitySpec[] {
  return acts.map((a, i) => ({ ...a, title: `Actividad ${i + 1}` }));
}
