// Herramientas comunes para armar las actividades de 4.º grado.
import type { ActivityCard, ActivitySpec } from "@/lib/activities";
import { numeroEnLetras } from "@/lib/dictado/numero-letras";

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

// Sin tildes, en minúscula (para comparar cadenas).
export function plain(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-̂̄-ͯ]/g, "")
    .normalize("NFC");
}

export function numberWord(n: number): string {
  try {
    if (n >= 0 && n <= 99999) {
      return numeroEnLetras(n);
    }
  } catch {
    // fallback
  }
  return String(n);
}

// Opciones numéricas cercanas a la respuesta (sin repetir, dentro del rango).
export function numberChoices(answer: number, count = 3, min = 0, max = 1000000, step = 1): number[] {
  const set = new Set<number>([answer]);
  let spread = 1;
  while (set.size < count && spread < 500) {
    for (const d of shuffle([-spread * step, spread * step])) {
      const v = answer + d;
      if (v >= min && v <= max && set.size < count) set.add(v);
    }
    spread++;
  }
  return shuffle([...set]);
}

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
      (answers.length > 1
        ? "Pista: hay más de una opción correcta."
        : "Pista: leé bien todas las opciones antes de elegir."),
    skills: item.skills ?? defaultSkills,
  };
}

export function fromBank(bank: Q[], n: number, prefix: string, skills: string[]): ActivitySpec[] {
  return sample(bank, Math.min(n, bank.length)).map((item, i) =>
    qToPick(item, `${prefix}-${i}`, `Actividad ${i + 1}`, skills)
  );
}

export function numbered(acts: ActivitySpec[]): ActivitySpec[] {
  return acts.map((a, i) => ({ ...a, title: `Actividad ${i + 1}` }));
}

export function makeOrder(
  id: string,
  prompt: string,
  sequence: string[],
  hint: string,
  skills: string[]
): ActivitySpec {
  const cleanSeq = sequence.map((it) => it.replace(/^\d{1,2}[.)]\s+/, "").trim());
  const n = cleanSeq.length;
  let perm: number[] = Array.from({ length: n }, (_, i) => i);
  let isIdentical = true;
  for (let attempt = 0; attempt < 50; attempt++) {
    perm = shuffle(Array.from({ length: n }, (_, i) => i));
    if (!perm.every((v, idx) => v === idx)) {
      isIdentical = false;
      break;
    }
  }
  if (isIdentical && n > 1) {
    perm = [perm[1], perm[0], ...perm.slice(2)];
  }
  const items = perm.map((idx) => cleanSeq[idx]);
  const correctOrder = Array.from({ length: n }, (_, k) => perm.indexOf(k));
  return {
    type: "order",
    id,
    title: "Actividad",
    prompt,
    items,
    correctOrder,
    hint: hint.startsWith("Pista:") ? hint : `Pista: ${hint}`,
    skills,
  };
}

// Formateo decimal en español rioplatense (con coma y sin ruido flotante).
export function decimalAR(n: number, cifras = 2): string {
  const factor = Math.pow(10, cifras);
  const rounded = Math.round((n + Number.EPSILON) * factor) / factor;
  const s = rounded.toFixed(cifras);
  // Quitar ceros decimales innecesarios (ej. 7,20 -> 7,2)
  return s.replace(/\.?0+$/, "").replace(".", ",");
}

export function makeClassify(
  id: string,
  prompt: string,
  categories: string[],
  items: { label: string; cat: number }[],
  hint: string,
  skills: string[]
): ActivitySpec {
  const mapped = items.map((it) => ({ label: it.label, categoryIndex: it.cat }));
  let shuffled = shuffle(mapped);
  if (shuffled.length >= 3 && categories.length >= 2) {
    const isAlternating = (arr: typeof mapped) => {
      const c0 = arr[0].categoryIndex;
      const c1 = arr[1].categoryIndex;
      if (c0 === c1) return false;
      return arr.every((it, idx) => it.categoryIndex === (idx % 2 === 0 ? c0 : c1));
    };
    for (let attempt = 0; attempt < 20; attempt++) {
      if (!isAlternating(shuffled)) break;
      shuffled = shuffle(mapped);
    }
    if (isAlternating(shuffled) && shuffled.length >= 4) {
      const temp = shuffled[1];
      shuffled[1] = shuffled[2];
      shuffled[2] = temp;
    }
  }
  return {
    type: "classify",
    id,
    title: "Actividad",
    prompt,
    categories,
    items: shuffled,
    hint: hint.startsWith("Pista:") ? hint : `Pista: ${hint}`,
    skills,
  };
}

export function makeStoryPick(
  id: string,
  story: { title: string; text: string },
  prompt: string,
  options: Opt[],
  answerIndex: number,
  hint: string,
  skills: string[]
): ActivitySpec {
  return qToPick(
    q(prompt, options, answerIndex, hint.startsWith("Pista:") ? hint : `Pista: ${hint}`, { story, skills }),
    id,
    "Actividad",
    skills
  );
}

export function makeMultiPick(
  id: string,
  prompt: string,
  options: Opt[],
  answers: number[],
  hint: string,
  skills: string[]
): ActivitySpec {
  return qToPick(
    q(prompt, options, answers, hint.startsWith("Pista:") ? hint : `Pista: ${hint}`, { skills }),
    id,
    "Actividad",
    skills
  );
}

export function makeTrueFalse(
  id: string,
  statement: string,
  isTrue: boolean,
  hint: string,
  skills?: string[]
): ActivitySpec {
  return {
    type: "true-false",
    id,
    title: "Actividad",
    statement,
    isTrue,
    hint: hint.startsWith("Pista:") ? hint : `Pista: ${hint}`,
    skills,
  };
}

export function makeInput(
  id: string,
  prompt: string,
  answer: number,
  hint: string,
  skills?: string[]
): ActivitySpec {
  return {
    type: "input",
    id,
    title: "Actividad",
    prompt,
    answer,
    hint: hint.startsWith("Pista:") ? hint : `Pista: ${hint}`,
    skills,
  };
}

export function makeMatch(
  id: string,
  prompt: string,
  pairs: { left: string; right: string }[],
  hint: string,
  skills?: string[]
): ActivitySpec {
  return {
    type: "match",
    id,
    title: "Actividad",
    prompt,
    pairs,
    hint: hint.startsWith("Pista:") ? hint : `Pista: ${hint}`,
    skills,
  };
}


// Verdadero/falso al azar con la clave CORRECTA: elige la afirmación
// verdadera o la falsa y marca isTrue en consecuencia (revisión de Claude,
// 9/10/2026: antes la afirmación y la respuesta se sorteaban por separado).
export function makeVF(id: string, verdadera: string, falsa: string, hint: string, skills?: string[]): ActivitySpec {
  const v = Math.random() < 0.5;
  return makeTrueFalse(id, v ? verdadera : falsa, v, hint, skills);
}

// Pesos en formato argentino: «$1.157,50», «$2.000», «$842,50».
export function pesosAR(n: number): string {
  const r = Math.round((n + Number.EPSILON) * 100) / 100;
  const [ent, dec] = r.toFixed(2).split(".");
  const miles = ent.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return dec === "00" ? miles : `${miles},${dec}`;
}
