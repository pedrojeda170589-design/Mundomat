// Actividades de Matemática de 4.º grado (28 mundos).
// Generadas con números al azar dentro del rango pedagógico del segundo ciclo
// (números hasta el millón, números romanos, cálculo mental y estimación,
// organizaciones rectangulares, proporcionalidad directa, multiplicación por 2 cifras,
// división con resto, fracciones usuales y mixtos, decimales, geometría, medida y estadística).
import type { ActivitySpec } from "@/lib/activities";
import { WorldDef } from "@/types";
import {
  decimalAR,
  pesosAR,
  makeClassify,
  makeInput,
  makeOrder,
  numberChoices,
  numbered,
  pickOne,
  q,
  qToPick,
  randInt,
  shuffle,
} from "./util";

// ==========================================================================
// HELPERS COMUNES
// ==========================================================================

export function toRoman(n: number): string {
  const vals: [number, string][] = [
    [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
    [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
    [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
  ];
  let res = "";
  let rem = n;
  for (const [v, s] of vals) {
    while (rem >= v) {
      res += s;
      rem -= v;
    }
  }
  return res;
}

function pluralize(n: number, singular: string, plural: string): string {
  return `${n} ${n === 1 ? singular : plural}`;
}

function pickDistinctPreguntas<T extends { p: string }>(items: T[], count: number): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const it of shuffle(items)) {
    if (!seen.has(it.p)) {
      seen.add(it.p);
      out.push(it);
      if (out.length >= count) break;
    }
  }
  return out;
}

const mathRecentByWorld = new Map<number, Set<string>>();
const mathRecentClassify = new Map<number, number>();

function pickDistinctPreguntasForWorld<T extends { p: string }>(worldId: number, items: T[], count: number): T[] {
  let recent = mathRecentByWorld.get(worldId);
  if (!recent) {
    recent = new Set<string>();
    mathRecentByWorld.set(worldId, recent);
  }

  const fresh = items.filter((it) => !recent!.has(it.p));
  const pool = fresh.length >= count ? fresh : items;
  if (pool === items) {
    recent.clear();
  }

  const picked = pickDistinctPreguntas(pool, count);
  recent.clear();
  for (const it of picked) {
    recent.add(it.p);
  }
  return picked;
}

function rotatePickOne<T>(worldId: number, items: T[]): T {
  if (items.length <= 1) return items[0];
  const lastIdx = mathRecentClassify.get(worldId) ?? -1;
  const nextIdx = (lastIdx + 1) % items.length;
  mathRecentClassify.set(worldId, nextIdx);
  return items[nextIdx];
}

function distinctChoices<T>(correct: T, candidates: T[], count = 3): T[] {
  const set = new Set<T>([correct]);
  for (const c of shuffle(candidates)) {
    if (c !== correct && !set.has(c)) {
      set.add(c);
      if (set.size === count) break;
    }
  }
  return shuffle([...set]);
}

// ==========================================================================
// MÓDULO 1: NÚMEROS GRANDES Y CÁLCULO MENTAL (42001 - 42007)
// ==========================================================================

// Mundo 42001: Números hasta el 100.000
function buildMundo42001(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  const skills = ["m4-num-100k"];
  const usedScales = new Set<string>();
  const usedFormados = new Set<string>();
  const usedAnterior = new Set<number>();

  for (let i = 0; i < 8; i++) {
    if (i % 3 === 0) {
      let step = pickOne([1000, 2000, 5000]);
      let base = randInt(10, 70) * 1000;
      let missingIdx = randInt(1, 2);
      while (usedScales.has(`${step}-${base}-${missingIdx}`)) {
        step = pickOne([1000, 2000, 5000]);
        base = randInt(10, 70) * 1000;
        missingIdx = randInt(1, 2);
      }
      usedScales.add(`${step}-${base}-${missingIdx}`);
      const seq = [base, base + step, base + step * 2, base + step * 3];
      const target = seq[missingIdx];
      const promptSeq = seq.map((v, idx) => (idx === missingIdx ? "___" : v.toLocaleString("es-AR"))).join(" — ");
      const choices = numberChoices(target, 3, 10000, 99999, step);
      acts.push(
        qToPick(
          q(
            `Completá la escala numérica que avanza de ${step.toLocaleString("es-AR")} en ${step.toLocaleString("es-AR")}:\n${promptSeq}`,
            choices.map((c) => ["🔢", c.toLocaleString("es-AR")]),
            choices.indexOf(target),
            `Pista: sumale ${step.toLocaleString("es-AR")} al número anterior.`
          ),
          `m42001-${i}`,
          "",
          skills
        )
      );
    } else if (i % 3 === 1) {
      let n = randInt(10001, 99998);
      while (usedAnterior.has(n)) n = randInt(10001, 99998);
      usedAnterior.add(n);
      const isPosterior = Math.random() > 0.5;
      const target = isPosterior ? n + 1 : n - 1;
      const choices = numberChoices(target, 3, 10000, 99999);
      acts.push(
        qToPick(
          q(
            `¿Cuál es el número ${isPosterior ? "posterior (el siguiente)" : "anterior"} de ${n.toLocaleString("es-AR")}?`,
            choices.map((c) => ["📍", c.toLocaleString("es-AR")]),
            choices.indexOf(target),
            "Pista: restale 1 para el anterior o sumale 1 para el posterior."
          ),
          `m42001-${i}`,
          "",
          skills
        )
      );
    } else {
      let dm = randInt(2, 9);
      let um = randInt(1, 9);
      while (um === dm) um = randInt(1, 9);
      let c = randInt(1, 9);
      while (c === dm || c === um) c = randInt(1, 9);
      while (usedFormados.has(`${dm}-${um}-${c}`)) {
        dm = randInt(2, 9);
        um = randInt(1, 9);
        while (um === dm) um = randInt(1, 9);
        c = randInt(1, 9);
        while (c === dm || c === um) c = randInt(1, 9);
      }
      usedFormados.add(`${dm}-${um}-${c}`);

      const target = dm * 10000 + um * 1000 + c * 100;
      const fake1 = dm * 10000 + c * 1000 + um * 100;
      const fake2 = um * 10000 + dm * 1000 + c * 100;
      const choices = distinctChoices(target, [fake1, fake2, c * 10000 + dm * 1000 + um * 100], 3);

      const dmStr = pluralize(dm, "decena de mil", "decenas de mil");
      const umStr = pluralize(um, "unidad de mil", "unidades de mil");
      const cStr = pluralize(c, "centena", "centenas");

      acts.push(
        qToPick(
          q(
            `¿Qué número se forma con ${dmStr}, ${umStr} y ${cStr}?`,
            choices.map((num) => ["🧮", num.toLocaleString("es-AR")]),
            choices.indexOf(target),
            `Pista: ${dmStr} equivalen a ${(dm * 10000).toLocaleString("es-AR")}.`
          ),
          `m42001-${i}`,
          "",
          skills
        )
      );
    }
  }
  return numbered(acts);
}

// Mundo 42002: Números hasta el 1.000.000
function buildMundo42002(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  const skills = ["m4-num-1m"];
  const usedLana = new Set<string>();
  const usedSeries = new Set<string>();

  for (let i = 0; i < 8; i++) {
    if (i % 2 === 0) {
      let cm = randInt(1, 8);
      let dm = randInt(1, 9);
      while (dm === cm) dm = randInt(1, 9);
      let um = randInt(1, 9);
      while (um === cm || um === dm) um = randInt(1, 9);
      while (usedLana.has(`${cm}-${dm}-${um}`)) {
        cm = randInt(1, 8);
        dm = randInt(1, 9);
        while (dm === cm) dm = randInt(1, 9);
        um = randInt(1, 9);
        while (um === cm || um === dm) um = randInt(1, 9);
      }
      usedLana.add(`${cm}-${dm}-${um}`);

      const target = cm * 100000 + dm * 10000 + um * 1000;
      const fake1 = cm * 100000 + um * 10000 + dm * 1000;
      const fake2 = (cm + 1) * 100000 + dm * 10000 + um * 1000;
      const fake3 = dm * 100000 + cm * 10000 + um * 1000;
      const choices = distinctChoices(target, [fake1, fake2, fake3], 3);

      const cmStr = pluralize(cm, "centena de mil", "centenas de mil");
      const dmStr = pluralize(dm, "decena de mil", "decenas de mil");
      const umStr = pluralize(um, "unidad de mil", "unidades de mil");

      acts.push(
        qToPick(
          q(
            `Un cargamento de lana en el puerto pesa ${cmStr}, ${dmStr} y ${umStr} kilos. ¿A cuántos kilos equivale?`,
            choices.map((c) => ["⚖️", `${c.toLocaleString("es-AR")} kg`]),
            choices.indexOf(target),
            "Pista: una centena de mil equivale a 100.000 unidades."
          ),
          `m42002-${i}`,
          "",
          skills
        )
      );
    } else {
      let base = randInt(100, 800) * 1000;
      let step = pickOne([10000, 50000]);
      let missingIdx = randInt(1, 3);
      while (usedSeries.has(`${base}-${step}-${missingIdx}`)) {
        base = randInt(100, 800) * 1000;
        step = pickOne([10000, 50000]);
        missingIdx = randInt(1, 3);
      }
      usedSeries.add(`${base}-${step}-${missingIdx}`);

      const seq = [base, base + step, base + step * 2, base + step * 3];
      const target = seq[missingIdx];
      const promptSeq = seq.map((v, idx) => (idx === missingIdx ? "___" : v.toLocaleString("es-AR"))).join(" — ");
      const choices = numberChoices(target, 3, 100000, 999999, step);
      acts.push(
        qToPick(
          q(
            `Completá la serie numérica hasta el millón:\n${promptSeq}`,
            choices.map((c) => ["🔢", c.toLocaleString("es-AR")]),
            choices.indexOf(target),
            `Pista: la serie avanza sumando ${step.toLocaleString("es-AR")}.`
          ),
          `m42002-${i}`,
          "",
          skills
        )
      );
    }
  }
  return numbered(acts);
}

// Mundo 42003: Valor posicional y descomposición polinómica y aditiva
function buildMundo42003(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  const skills = ["m4-posicional"];

  // Poblaciones reales aproximadas de Santa Cruz (censo 2022)
  const ciudadesRealistas = [
    { nombre: "Río Gallegos", min: 110000, max: 118000 },
    { nombre: "Caleta Olivia", min: 54000, max: 58000 },
    { nombre: "Pico Truncado", min: 23000, max: 26000 },
    { nombre: "Las Heras", min: 22000, max: 25000 },
    { nombre: "El Calafate", min: 21000, max: 24000 },
    { nombre: "Puerto Deseado", min: 15000, max: 17000 },
    { nombre: "Gobernador Gregores", min: 5500, max: 6200 },
    { nombre: "Puerto San Julián", min: 10500, max: 12000 },
  ];

  const usedNumbers = new Set<number>();
  for (let i = 0; i < 8; i++) {
    const ciu = ciudadesRealistas[i % ciudadesRealistas.length];
    if (i % 3 === 0) {
      // Descomposición polinómica multiplicativa
      // Usar población realista dentro del rango [ciu.min, ciu.max]
      let n = randInt(Math.floor(ciu.min / 10), Math.floor(ciu.max / 10)) * 10;
      while (usedNumbers.has(n)) {
        n = randInt(Math.floor(ciu.min / 10), Math.floor(ciu.max / 10)) * 10;
      }
      usedNumbers.add(n);
      const strN = String(n);
      const terms: { d: number; f: number; s: string }[] = [];
      for (let pos = 0; pos < strN.length; pos++) {
        const d = parseInt(strN[pos], 10);
        const f = Math.pow(10, strN.length - 1 - pos);
        if (d > 0) {
          terms.push({ d, f, s: `${d} × ${f.toLocaleString("es-AR")}` });
        }
      }
      const targetStr = terms.map((t) => t.s).join(" + ");
      const fake1 = terms.map((t) => `${t.d} × ${Math.max(1, Math.floor(t.f / 10)).toLocaleString("es-AR")}`).join(" + ");
      const fake2 = terms.map((t, idx) => idx === 0 ? `${(t.d % 9) + 1} × ${t.f.toLocaleString("es-AR")}` : t.s).join(" + ");
      const choices = distinctChoices(targetStr, [fake1, fake2], 3);

      acts.push(
        qToPick(
          q(
            `En el censo de ${ciu.nombre} se registraron ${n.toLocaleString("es-AR")} habitantes. ¿Cuál es su descomposición polinómica correcta?`,
            choices.map((c) => ["🧮", c]),
            choices.indexOf(targetStr),
            "Pista: multiplicá cada cifra por el valor de su posición (10.000, 1.000, 100 o 10)."
          ),
          `m42003-${i}`,
          "",
          skills
        )
      );
    } else if (i % 3 === 1) {
      // Valor posicional con cifras ÚNICAS (sin ambigüedades)
      let digits: number[] = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 5);
      let [dm, um, c, d, u] = digits;
      let n = dm * 10000 + um * 1000 + c * 100 + d * 10 + u;
      while (usedNumbers.has(n)) {
        digits = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 5);
        [dm, um, c, d, u] = digits;
        n = dm * 10000 + um * 1000 + c * 100 + d * 10 + u;
      }
      usedNumbers.add(n);

      // Preguntar por dm o um
      const askDm = i % 2 === 1;
      const cifra = askDm ? dm : um;
      const valor = askDm ? dm * 10000 : um * 1000;
      const posName = askDm ? "decenas de mil" : "unidades de mil";

      const fake1 = askDm ? dm * 1000 : um * 10000;
      const fake2 = askDm ? dm * 100 : um * 100;
      const choices = distinctChoices(valor.toLocaleString("es-AR"), [fake1.toLocaleString("es-AR"), fake2.toLocaleString("es-AR")], 3);

      acts.push(
        qToPick(
          q(
            `En el número ${n.toLocaleString("es-AR")}, ¿cuál es el valor posicional de la cifra ${cifra}?`,
            choices.map((ch) => ["📍", ch]),
            choices.indexOf(valor.toLocaleString("es-AR")),
            `Pista: la cifra ${cifra} está en el lugar de las ${posName}.`
          ),
          `m42003-${i}`,
          "",
          skills
        )
      );
    } else {
      // Descomposición aditiva
      let digits: number[] = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4);
      let [d1, d2, d3, d4] = digits;
      let n = d1 * 10000 + d2 * 1000 + d3 * 100 + d4;
      while (usedNumbers.has(n)) {
        digits = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4);
        [d1, d2, d3, d4] = digits;
        n = d1 * 10000 + d2 * 1000 + d3 * 100 + d4;
      }
      usedNumbers.add(n);
      const targetStr = `${(d1 * 10000).toLocaleString("es-AR")} + ${(d2 * 1000).toLocaleString("es-AR")} + ${(d3 * 100).toLocaleString("es-AR")} + ${d4}`;
      const fake1 = `${(d1 * 1000).toLocaleString("es-AR")} + ${(d2 * 100).toLocaleString("es-AR")} + ${(d3 * 10).toLocaleString("es-AR")} + ${d4}`;
      const fake2 = `${(d2 * 10000).toLocaleString("es-AR")} + ${(d1 * 1000).toLocaleString("es-AR")} + ${(d3 * 100).toLocaleString("es-AR")} + ${d4}`;
      const choices = distinctChoices(targetStr, [fake1, fake2], 3);

      acts.push(
        qToPick(
          q(
            `¿Cuál es la descomposición aditiva correcta del número ${n.toLocaleString("es-AR")}?`,
            choices.map((c) => ["➕", c]),
            choices.indexOf(targetStr),
            "Pista: sumá el valor de cada cifra según su posición."
          ),
          `m42003-${i}`,
          "",
          skills
        )
      );
    }
  }
  return numbered(acts);
}

// Mundo 42004: Comparación y recta numérica hasta el millón
function buildMundo42004(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  const skills = ["m4-recta-numerica"];
  const orderPrompts = [
    "Ordená estos números de MENOR a MAYOR:",
    "Ubicá estos tres valores en orden CRECIENTE:",
    "Organizá los siguientes números de MENOR a MAYOR:",
    "Disponé los números en orden ascendente (de menor a mayor):",
  ];
  const pickPrompts = [
    (a: string, b: string) => `¿Cuál de estos números se ubica entre ${a} y ${b} en la recta numérica?`,
    (a: string, b: string) => `En la recta numérica, ¿qué valor se encuentra comprendido entre ${a} y ${b}?`,
    (a: string, b: string) => `Identificá qué número está situado entre ${a} y ${b}:`,
    (a: string, b: string) => `¿Qué número se ubica en el intervalo entre ${a} y ${b}?`,
  ];
  for (let i = 0; i < 8; i++) {
    if (i % 2 === 0) {
      const a = randInt(10, 80) * 10000;
      const b = a + 100000;
      const mid = a + randInt(2, 8) * 10000;
      const fake1 = a - 10000;
      const fake2 = b + 15000;
      const choices = distinctChoices(mid, [fake1, fake2, a + 120000], 3);
      const prText = pickPrompts[Math.floor(i / 2) % pickPrompts.length](a.toLocaleString("es-AR"), b.toLocaleString("es-AR"));
      acts.push(
        qToPick(
          q(
            prText,
            choices.map((c) => ["📏", c.toLocaleString("es-AR")]),
            choices.indexOf(mid),
            `Pista: debe ser mayor que ${a.toLocaleString("es-AR")} y menor que ${b.toLocaleString("es-AR")}.`
          ),
          `m42004-${i}`,
          "",
          skills
        )
      );
    } else {
      const n1 = randInt(100, 250) * 1000;
      const n2 = n1 + randInt(20, 80) * 1000;
      const n3 = n2 + randInt(20, 80) * 1000;
      acts.push(
        makeOrder(
          `m42004-ord-${i}`,
          orderPrompts[Math.floor(i / 2)],
          [n1.toString(), n2.toString(), n3.toString()],
          "Pista: mirá primero las centenas y decenas de mil.",
          skills
        )
      );
    }
  }
  return numbered(acts);
}

// Mundo 42005: Números romanos y comparación
function buildMundo42005(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  const skills = ["m4-romanos"];
  const usedCompPairs = new Set<string>();

  // Gran variedad de valores para números romanos (más de 25 opciones)
  const valores = [
    9, 14, 19, 24, 29, 39, 44, 48, 59, 74, 88, 94, 99, 124, 150, 189,
    240, 350, 420, 450, 520, 680, 890, 950, 1050, 1250, 1492, 1810, 1950, 2024,
  ];
  const selectedVals = shuffle(valores).slice(0, 8);

  for (let i = 0; i < 8; i++) {
    const val = selectedVals[i];
    const rom = toRoman(val);

    if (i % 3 === 0) {
      // Romano a decimal
      const choices = numberChoices(val, 3, 1, 3000, 5);
      acts.push(
        qToPick(
          q(
            `¿A qué número decimal equivale el número romano ${rom}?`,
            choices.map((c) => ["🏛️", String(c)]),
            choices.indexOf(val),
            "Pista: recordá que I=1, V=5, X=10, L=50, C=100, D=500 y M=1.000."
          ),
          `m42005-${i}`,
          "",
          skills
        )
      );
    } else if (i % 3 === 1) {
      // Decimal a romano (usando toRoman para todos los distractores: ¡siempre válidos!)
      const offset1 = pickOne([1, 2, 5, 10]);
      const offset2 = pickOne([-1, -2, -5, -10]);
      const val1 = Math.max(1, val + offset1);
      const val2 = Math.max(1, val + offset2);
      const fake1 = toRoman(val1);
      const fake2 = toRoman(val2);
      const choices = distinctChoices(rom, [fake1, fake2, toRoman(val + 20)], 3);

      acts.push(
        qToPick(
          q(
            `¿Cómo se escribe el número ${val} en numeración romana?`,
            choices.map((c) => ["📜", c]),
            choices.indexOf(rom),
            "Pista: una letra menor a la izquierda de otra mayor resta su valor."
          ),
          `m42005-${i}`,
          "",
          skills
        )
      );
    } else {
      // Comparación de números romanos sin duplicar en la misma vuelta
      const pairType = pickOne(["menor", "mayor"]);
      let a = pickOne([15, 40, 60, 90, 110, 140, 250, 400, 600, 900]);
      let b = a + pickOne([10, 25, 50, 100]);
      while (usedCompPairs.has(`${Math.min(a, b)}-${Math.max(a, b)}`)) {
        a = pickOne([15, 40, 60, 90, 110, 140, 250, 400, 600, 900]);
        b = a + pickOne([10, 25, 50, 100]);
      }
      usedCompPairs.add(`${Math.min(a, b)}-${Math.max(a, b)}`);

      if (pairType === "mayor") {
        const temp = a;
        a = b;
        b = temp;
      }
      const romA = toRoman(a);
      const romB = toRoman(b);
      const correctText = pairType === "menor" ? `${romA} < ${romB}` : `${romA} > ${romB}`;
      const fake1 = pairType === "menor" ? `${romA} > ${romB}` : `${romA} < ${romB}`;
      const fake2 = `${romA} = ${romB}`;
      const choices = distinctChoices(correctText, [fake1, fake2], 3);

      acts.push(
        qToPick(
          q(
            `Al comparar los números romanos ${romA} y ${romB}, ¿cuál de las siguientes relaciones es la CORRECTA?`,
            choices.map((c) => ["⚖️", c]),
            choices.indexOf(correctText),
            "Pista: convertí mentalmente cada número romano a decimal para comparar cuál es mayor o menor."
          ),
          `m42005-${i}`,
          "",
          skills
        )
      );
    }
  }
  return numbered(acts);
}

// Mundo 42006: Sumas y restas con números grandes
function buildMundo42006(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  const skills = ["m4-sumas-grandes"];
  for (let i = 0; i < 8; i++) {
    const a = randInt(15, 75) * 1000 + randInt(1, 9) * 100;
    const b = randInt(10, 45) * 1000 + randInt(1, 9) * 100;
    if (i % 2 === 0) {
      const total = a + b;
      acts.push(
        makeInput(
          `m42006-in-${i}`,
          `Un camión transporta ${a.toLocaleString("es-AR")} kg de carne ovina y ${b.toLocaleString("es-AR")} kg de pescado. ¿Cuántos kg transporta en total?`,
          total,
          `Pista: sumá primero los miles (${(Math.floor(a / 1000) + Math.floor(b / 1000)).toLocaleString("es-AR")}.000) y luego las centenas.`,
          skills
        )
      );
    } else {
      const mayor = Math.max(a, b);
      const menor = Math.min(a, b);
      const dif = mayor - menor;
      const choices = numberChoices(dif, 3, 1000, 100000, 1000);
      acts.push(
        qToPick(
          q(
            `En Río Gallegos se recolectaron ${mayor.toLocaleString("es-AR")} envases para reciclar y en El Calafate ${menor.toLocaleString("es-AR")}. ¿Cuál es la diferencia?`,
            choices.map((c) => ["📦", `${c.toLocaleString("es-AR")} envases`]),
            choices.indexOf(dif),
            "Pista: restá la cantidad menor a la mayor."
          ),
          `m42006-${i}`,
          "",
          skills
        )
      );
    }
  }
  return numbered(acts);
}

// Mundo 42007: Estrategias de cálculo mental y estimación
function buildMundo42007(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  const skills = ["m4-calculo-mental"];
  for (let i = 0; i < 8; i++) {
    const a = randInt(12, 45) * 1000 + randInt(120, 890);
    const b = randInt(11, 35) * 1000 + randInt(120, 890);
    const roundA = Math.round(a / 1000) * 1000;
    const roundB = Math.round(b / 1000) * 1000;
    const estimated = roundA + roundB;
    const choices = distinctChoices(
      estimated.toLocaleString("es-AR"),
      [(estimated + 10000).toLocaleString("es-AR"), Math.max(10000, estimated - 10000).toLocaleString("es-AR"), (estimated + 5000).toLocaleString("es-AR")],
      3
    );
    acts.push(
      qToPick(
        q(
          `Una escuela de Santa Cruz compró materiales por $${a.toLocaleString("es-AR")} y libros por $${b.toLocaleString("es-AR")}.\nRedondeando cada monto al millar más cercano, ¿cuál es la mejor estimación del gasto total?`,
          choices.map((c) => ["🏷️", `$${c}`]),
          choices.indexOf(estimated.toLocaleString("es-AR")),
          `Pista: ${a.toLocaleString("es-AR")} se redondea a ${roundA.toLocaleString("es-AR")} y ${b.toLocaleString("es-AR")} a ${roundB.toLocaleString("es-AR")}.`
        ),
        `m42007-${i}`,
        "",
        skills
      )
    );
  }
  return numbered(acts);
}

// ==========================================================================
// MÓDULO 2: MULTIPLICACIÓN, DIVISIÓN Y PROPORCIONES (42008 - 42014)
// ==========================================================================

// Mundo 42008: Multiplicación y división por la unidad seguida de ceros
function buildMundo42008(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  const skills = ["m4-mult-unidad-ceros"];
  const nPool = shuffle(Array.from({ length: 70 }, (_, idx) => idx + 15)).slice(0, 8);

  const multScenarios = [
    (n: number, factor: number) => ({
      txt: `Una distribuidora de combustible vende ${n} bidones de lubricante a $${factor.toLocaleString("es-AR")} cada uno. ¿Cuánto cobra en total?`,
      ico: "⛽",
    }),
    (n: number, factor: number) => ({
      txt: `Una ferretería industrial compró ${n} cajas de clavos a $${factor.toLocaleString("es-AR")} cada una. ¿Cuál es el costo total?`,
      ico: "🔩",
    }),
    (n: number, factor: number) => ({
      txt: `Una cooperativa textil empaquetó ${n} buzos de abrigo a $${factor.toLocaleString("es-AR")} cada uno. ¿Cuánto recaudó por la venta?`,
      ico: "🧥",
    }),
    (n: number, factor: number) => ({
      txt: `Un vivero de Santa Cruz preparó ${n} plantines de lenga a $${factor.toLocaleString("es-AR")} cada uno. ¿Cuánto valen en total?`,
      ico: "🌱",
    }),
  ];

  const divScenarios = [
    (total: number, factor: number) => ({
      txt: `Se reparten $${total.toLocaleString("es-AR")} en partes iguales entre ${factor} estudiantes para una excursión. ¿Cuánto recibe cada uno?`,
      ico: "🪙",
    }),
    (total: number, factor: number) => ({
      txt: `Un depósito distribuye ${total.toLocaleString("es-AR")} litros de agua potable en ${factor} tanques idénticos. ¿Cuántos litros van en cada tanque?`,
      ico: "🚰",
    }),
    (total: number, factor: number) => ({
      txt: `Un club deportivo reparte $${total.toLocaleString("es-AR")} en ${factor} premios iguales para un torneo juvenil. ¿De cuánto es cada premio?`,
      ico: "🏆",
    }),
    (total: number, factor: number) => ({
      txt: `Una fábrica envasa ${total.toLocaleString("es-AR")} gramos de té en ${factor} frascos iguales. ¿Cuántos gramos contiene cada frasco?`,
      ico: "🍵",
    }),
  ];

  for (let i = 0; i < 8; i++) {
    const n = nPool[i];
    const factor = pickOne([10, 100, 1000]);
    if (i % 2 === 0) {
      const prod = n * factor;
      const choices = distinctChoices(prod, [prod * 10, Math.max(1, Math.floor(prod / 10)), prod + 100], 3);
      const sc = multScenarios[Math.floor(i / 2) % multScenarios.length](n, factor);
      acts.push(
        qToPick(
          q(
            sc.txt,
            choices.map((c) => [sc.ico, `$${c.toLocaleString("es-AR")}`]),
            choices.indexOf(prod),
            `Pista: multiplicar por ${factor} agrega ${factor === 10 ? "1 cero" : factor === 100 ? "2 ceros" : "3 ceros"}.`
          ),
          `m42008-${i}`,
          "",
          skills
        )
      );
    } else {
      const total = n * factor;
      const choices = distinctChoices(n, [n * 10, Math.max(1, Math.floor(n / 10)), n + 10], 3);
      const sc = divScenarios[Math.floor(i / 2) % divScenarios.length](total, factor);
      acts.push(
        qToPick(
          q(
            sc.txt,
            choices.map((c) => [sc.ico, `$${c.toLocaleString("es-AR")}`]),
            choices.indexOf(n),
            `Pista: dividir por ${factor} quita ${factor === 10 ? "1 cero" : factor === 100 ? "2 ceros" : "3 ceros"}.`
          ),
          `m42008-${i}`,
          "",
          skills
        )
      );
    }
  }
  return numbered(acts);
}

// Mundo 42009: Multiplicación por dos cifras y repertorio
function buildMundo42009(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  const skills = ["m4-mult-2cifras"];
  const usedMental = new Set<string>();
  const usedKM = new Set<number>();
  const usedCine = new Set<number>();

  for (let i = 0; i < 8; i++) {
    if (i % 3 === 0) {
      let a = randInt(120, 350);
      while (usedKM.has(a)) a = randInt(120, 350);
      usedKM.add(a);
      const decenas = randInt(1, 3);
      const unidades = randInt(2, 9);
      const b = decenas * 10 + unidades;
      const prod = a * b;
      const transportes = ["colectivo de larga distancia", "camión de reparto de encomiendas", "vehículo de mantenimiento vial"];
      const tr = transportes[i % transportes.length];
      acts.push(
        makeInput(
          `m42009-in-${i}`,
          `Un ${tr} recorre ${a} km por día en las rutas de Santa Cruz. ¿Cuántos km recorrerá en ${b} días?`,
          prod,
          `Pista: calculá ${a} × ${decenas * 10} (${a * decenas * 10}) y sumale ${a} × ${unidades} (${a * unidades}).`,
          skills
        )
      );
    } else if (i % 3 === 1) {
      let filas = randInt(14, 32);
      let asientos = randInt(12, 28);
      while (usedCine.has(filas * asientos)) {
        filas = randInt(14, 32);
        asientos = randInt(12, 28);
      }
      usedCine.add(filas * asientos);
      const total = filas * asientos;
      const choices = distinctChoices(total, [total + 100, Math.max(50, total - 100), total + 50], 3);
      const recintos = [
        `En el cine teatro de Río Gallegos hay ${filas} filas con ${asientos} butacas cada una. ¿Cuántas butacas hay en total?`,
        `En el polideportivo de Caleta Olivia instalaron ${filas} hileras con ${asientos} sillas para un acto. ¿Cuántas sillas hay en total?`,
        `En el centro cultural de El Calafate colocaron ${filas} filas de ${asientos} asientos para un festival. ¿Cuántas localidades hay en total?`,
      ];
      acts.push(
        qToPick(
          q(
            recintos[Math.floor(i / 3) % recintos.length],
            choices.map((c) => ["🪑", `${c.toLocaleString("es-AR")} asientos`]),
            choices.indexOf(total),
            `Pista: multiplicá la cantidad de filas por la cantidad de asientos (${filas} × ${asientos}).`
          ),
          `m42009-${i}`,
          "",
          skills
        )
      );
    } else {
      let baseA: number, baseB: number;
      do {
        baseA = pickOne([12, 14, 15, 16, 18, 20, 24, 25, 30, 32, 35, 40, 45, 50, 60]);
        baseB = pickOne([3, 4, 5, 6, 7, 8, 9]);
      } while (usedMental.has(`${baseA}x${baseB}`));
      usedMental.add(`${baseA}x${baseB}`);
      const prodBase = baseA * baseB;
      const mult10 = prodBase * 10;
      const choices = distinctChoices(mult10, [prodBase * 100, prodBase + 10, prodBase * 2], 3);
      acts.push(
        qToPick(
          q(
            `Sabiendo que ${baseA} × ${baseB} = ${prodBase}, ¿cuánto es ${baseA} × ${baseB * 10}?`,
            choices.map((c) => ["🧠", c.toLocaleString("es-AR")]),
            choices.indexOf(mult10),
            `Pista: como el segundo factor se multiplicó por 10 (${baseB} × 10 = ${baseB * 10}), el resultado también se multiplica por 10.`
          ),
          `m42009-${i}`,
          "",
          skills
        )
      );
    }
  }
  return numbered(acts);
}

// Mundo 42010: Propiedades de la multiplicación
function buildMundo42010(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  const skills = ["m4-propiedades-mult"];
  const distPrompts = [
    (a: number, b: number) => `¿Cuál de estos cálculos aplica correctamente la propiedad distributiva para resolver ${a} × ${b}?`,
    (a: number, b: number) => `Para calcular mentalmente ${a} × ${b}, ¿qué descomposición distributiva es la correcta?`,
    (a: number, b: number, tens: number, units: number) => `Al desarmar ${b} en (${tens} + ${units}), ¿cómo se resuelve ${a} × (${tens} + ${units})?`,
    (a: number, b: number) => `¿Qué expresión muestra el uso correcto de la propiedad distributiva para ${a} × ${b}?`,
  ];
  for (let i = 0; i < 8; i++) {
    if (i % 2 === 0) {
      const a = randInt(12, 28);
      const tens = randInt(1, 3) * 10;
      const units = randInt(2, 9);
      const b = tens + units;
      const correctExpr = `${a} × ${tens} + ${a} × ${units}`;
      const fake1 = `${a} × ${tens} + ${units}`;
      const fake2 = `${a} + ${tens} × ${units}`;
      const choices = distinctChoices(correctExpr, [fake1, fake2], 3);
      const pr = distPrompts[Math.floor(i / 2) % distPrompts.length](a, b, tens, units);
      acts.push(
        qToPick(
          q(
            pr,
            choices.map((c) => ["✏️", c]),
            choices.indexOf(correctExpr),
            `Pista: descomponé ${b} en ${tens} + ${units} y multiplicá ${a} por cada parte.`
          ),
          `m42010-${i}`,
          "",
          skills
        )
      );
    } else {
      const a = randInt(4, 9);
      const b = randInt(12, 25);
      const correctStr = `${b} × ${a} = ${a * b}`;
      const fake1 = `${b} + ${a} = ${b + a}`;
      const fake2 = `${b} × 10 = ${b * 10}`;
      const choices = distinctChoices(correctStr, [fake1, fake2], 3);
      const conmutPrompts = [
        `La propiedad conmutativa indica que el orden de los factores no altera el producto. ¿Qué igualdad muestra esta propiedad para ${a} × ${b}?`,
        `¿Qué igualdad demuestra la propiedad conmutativa al alterar el orden de los factores en ${a} × ${b}?`,
        `Según la propiedad conmutativa, el cálculo ${a} × ${b} da exactamente el mismo resultado que:`,
        `¿Cuál de las siguientes igualdades ejemplifica la propiedad conmutativa para ${a} × ${b}?`,
      ];
      const pr = conmutPrompts[Math.floor(i / 2) % conmutPrompts.length];
      acts.push(
        qToPick(
          q(
            pr,
            choices.map((c) => ["🔄", c]),
            choices.indexOf(correctStr),
            `Pista: conmutar significa cambiar el orden: ${a} × ${b} es igual a ${b} × ${a}.`
          ),
          `m42010-${i}`,
          "",
          skills
        )
      );
    }
  }
  return numbered(acts);
}

// Mundo 42011: Organizaciones rectangulares y combinatoria
function buildMundo42011(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  const skills = ["m4-organizaciones-rectangulares"];
  for (let i = 0; i < 8; i++) {
    if (i % 2 === 0) {
      const filas = randInt(12, 25);
      const cols = randInt(8, 16);
      const total = filas * cols;
      const orgEscenarios = [
        `El patio de la escuela tiene ${filas} filas de baldosas y ${cols} baldosas en cada fila. ¿Cuántas baldosas tiene en total?`,
        `En la huerta comunitaria plantaron ${filas} surcos con ${cols} plantines en cada surco. ¿Cuántos plantines hay en total?`,
        `En el salón de actos se ubicaron ${filas} filas de sillas con ${cols} asientos por fila. ¿Cuál es la cantidad total de asientos?`,
        `Un estacionamiento tiene ${filas} hileras con espacio para ${cols} autos en cada hilera. ¿Cuántos vehículos entran en total?`,
      ];
      const promptText = orgEscenarios[Math.floor(i / 2) % orgEscenarios.length];
      acts.push(
        makeInput(
          `m42011-in-${i}`,
          promptText,
          total,
          `Pista: multiplicá filas por columnas (${filas} × ${cols}).`,
          skills
        )
      );
    } else {
      const panes = randInt(2, 4);
      const rellenos = randInt(3, 5);
      const comb = panes * rellenos;
      const choices = distinctChoices(comb, [panes + rellenos, comb + 2, comb + 4], 3);
      const escenarios = [
        {
          pregunta: `En el comedor escolar se ofrecen ${panes} tipos de pan y ${rellenos} opciones de relleno. ¿Cuántos sándwiches diferentes se pueden armar combinando 1 pan y 1 relleno?`,
          icono: "🥪",
          item: "sándwiches",
        },
        {
          pregunta: `Para el uniforme deportivo hay ${panes} colores de remeras y ${rellenos} de pantalones. ¿Cuántos conjuntos distintos se pueden formar?`,
          icono: "👕",
          item: "conjuntos",
        },
        {
          pregunta: `En una heladería podés elegir entre ${panes} tipos de cucurucho y ${rellenos} gustos de helado. ¿Cuántas combinaciones de 1 cucurucho y 1 gusto hay?`,
          icono: "🍦",
          item: "combinaciones",
        },
        {
          pregunta: `Para armar un afiche escolar se ofrecen ${panes} colores de cartulina y ${rellenos} tipos de marcadores. ¿Cuántas opciones distintas de afiche se pueden armar?`,
          icono: "🎨",
          item: "opciones",
        },
      ];
      const esc = escenarios[Math.floor(i / 2) % escenarios.length];
      acts.push(
        qToPick(
          q(
            esc.pregunta,
            choices.map((c) => [esc.icono, `${c} ${esc.item}`]),
            choices.indexOf(comb),
            `Pista: multiplicá las opciones (${panes} × ${rellenos}).`
          ),
          `m42011-${i}`,
          "",
          skills
        )
      );
    }
  }
  return numbered(acts);
}

// Mundo 42012: División por una y dos cifras
function buildMundo42012(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  const skills = ["m4-division-algoritmo"];
  const divEscenarios = [
    (div: string, d: number) => `Se reparten ${div} litros de agua mineral en bidones de ${d} litros cada uno. ¿Cuántos bidones completos se llenan?`,
    (div: string, d: number) => `En una fábrica se empaquetan ${div} alfajores en cajas de ${d} unidades cada una. ¿Cuántas cajas completas se obtienen?`,
    (div: string, d: number) => `Un productor santacruceño envasa ${div} frascos de dulce en cajas de ${d} frascos. ¿Cuántas cajas necesita?`,
    (div: string, d: number) => `En la biblioteca escolar se guardan ${div} libros en estantes donde entran ${d} libros en cada uno. ¿Cuántos estantes completos se llenan?`,
    (div: string, d: number) => `Para una excursión escolar de ${div} alumnos se contratan combis con capacidad para ${d} pasajeros. ¿Cuántas combis completas viajan?`,
    (div: string, d: number) => `Se distribuyen ${div} lápices de colores en cartucheras con ${d} lápices cada una. ¿Cuántas cartucheras completas se arman?`,
    (div: string, d: number) => `Una panadería hornea ${div} panes y los coloca en bolsas de a ${d} panes. ¿Cuántas bolsas completas se preparan?`,
    (div: string, d: number) => `Se reparten ${div} figuritas entre álbumes donde entran ${d} figuritas en cada uno. ¿Cuántos álbumes se completan?`,
  ];
  for (let i = 0; i < 8; i++) {
    const divisor = pickOne([4, 5, 6, 8, 12, 15, 20]);
    const cociente = randInt(25, 120);
    const dividendo = divisor * cociente;
    const prText = divEscenarios[i % divEscenarios.length](dividendo.toLocaleString("es-AR"), divisor);
    acts.push(
      makeInput(
        `m42012-in-${i}`,
        prText,
        cociente,
        `Pista: dividí ${dividendo.toLocaleString("es-AR")} por ${divisor}.`,
        skills
      )
    );
  }
  return numbered(acts);
}

// Mundo 42013: Análisis del resto en la división
function buildMundo42013(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  const skills = ["m4-div-resto"];

  const combiScenarios = [
    (tot: number, cap: number) => `Para una excursión escolar van ${tot} alumnos en combis donde entran ${cap} personas sentadas.\n¿Cuántas combis se necesitan como mínimo para que todos viajen sentados?`,
    (tot: number, cap: number) => `En un club deportivo, ${tot} atletas viajan a un torneo en minibuses con capacidad para ${cap} pasajeros cada uno.\n¿Cuántos minibuses se necesitan como mínimo para trasladar a todos?`,
    (tot: number, cap: number) => `Un centro comunitario organiza una visita con ${tot} personas en vehículos de ${cap} asientos.\n¿Cuántos vehículos se precisan contratar como mínimo para que nadie quede afuera?`,
    (tot: number, cap: number) => `Para recorrer el Parque Nacional Monte León, ${tot} turistas se trasladan en camionetas de ${cap} lugares.\n¿Cuántas camionetas se necesitan para transportar al contingente completo?`,
  ];

  const restoScenarios = [
    (tot: number, cap: number) => `Se reparten ${tot} lápices en cajas de a ${cap} en partes iguales.\n¿Cuántos lápices quedan sin guardar en cajas completas?`,
    (tot: number, cap: number) => `En un taller de artesanías se acomodan ${tot} platos en repisas de ${cap} unidades cada una.\n¿Cuántos platos quedan sin completar una repisa?`,
    (tot: number, cap: number) => `Una cooperativa envasa ${tot} manzanas en cajones de ${cap} frutas en partes iguales.\n¿Cuántas manzanas sobran sin completar un cajón?`,
    (tot: number, cap: number) => `En la biblioteca se ordenan ${tot} libros en estantes de ${cap} ejemplares cada uno.\n¿Cuántos libros sobran fuera de los estantes completos?`,
  ];

  const usedTotals = new Set<number>();

  for (let i = 0; i < 8; i++) {
    let capacidad = pickOne([12, 15, 18, 20, 24, 25]);
    let viajes = randInt(4, 9);
    let sobrantes = randInt(2, capacidad - 2);
    let totalPersonas = capacidad * viajes + sobrantes;

    while (usedTotals.has(totalPersonas)) {
      capacidad = pickOne([12, 15, 18, 20, 24, 25]);
      viajes = randInt(4, 9);
      sobrantes = randInt(2, capacidad - 2);
      totalPersonas = capacidad * viajes + sobrantes;
    }
    usedTotals.add(totalPersonas);

    const combisNecesarias = viajes + 1;

    if (i % 2 === 0) {
      const choices = distinctChoices(combisNecesarias, [viajes, combisNecesarias + 1, viajes - 1], 3);
      const prText = combiScenarios[Math.floor(i / 2) % combiScenarios.length](totalPersonas, capacidad);
      acts.push(
        qToPick(
          q(
            prText,
            choices.map((c) => ["🚐", `${c} vehículos`]),
            choices.indexOf(combisNecesarias),
            `Pista: ${totalPersonas} ÷ ${capacidad} da ${viajes} y sobran ${sobrantes} personas. ¿Hace falta otro transporte para los que sobran?`
          ),
          `m42013-${i}`,
          "",
          skills
        )
      );
    } else {
      const choices = distinctChoices(sobrantes, [capacidad - sobrantes, sobrantes + 1, sobrantes + 3], 3);
      const prText = restoScenarios[Math.floor(i / 2) % restoScenarios.length](totalPersonas, capacidad);
      acts.push(
        qToPick(
          q(
            prText,
            choices.map((c) => ["📦", `${c} sobrantes`]),
            choices.indexOf(sobrantes),
            `Pista: calculá el resto de dividir ${totalPersonas} por ${capacidad}.`
          ),
          `m42013-${i}`,
          "",
          skills
        )
      );
    }
  }
  return numbered(acts);
}

// Mundo 42014: Proporcionalidad directa, tablas de valores y múltiplos/divisores
function buildMundo42014(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  const skills = ["m4-proporcionalidad", "m4-multiplos-divisores"];
  const usedBases = new Set<number>();
  const usedDivNums = new Set<number>();
  const tablaShuffled = shuffle([0, 1, 2]);
  let tablaIdx = 0;

  for (let i = 0; i < 8; i++) {
    const mod = i % 4;
    if (mod === 0) {
      // Proporcionalidad directa
      const precioKg = randInt(6, 15) * 100;
      const cantKg = pickOne([3, 4, 5, 6]);
      const targetPrecio = precioKg * cantKg;
      const choices = distinctChoices(targetPrecio, [targetPrecio + precioKg, targetPrecio - precioKg, targetPrecio + precioKg * 2], 3);
      const propEscenarios = [
        {
          pregunta: `Si 1 kg de manzanas en la verdulería cuesta $${precioKg.toLocaleString("es-AR")}, ¿cuánto costarán ${cantKg} kg?`,
          icono: "🍎",
          pista: `Pista: multiplicá el precio de un kilo ($${precioKg.toLocaleString("es-AR")}) por ${cantKg}.`,
        },
        {
          pregunta: `Si 1 kg de cerezas de Los Antiguos cuesta $${precioKg.toLocaleString("es-AR")}, ¿cuánto costarán ${cantKg} kg?`,
          icono: "🍒",
          pista: `Pista: multiplicá el precio de un kilo ($${precioKg.toLocaleString("es-AR")}) por ${cantKg}.`,
        },
        {
          pregunta: `Si 1 paquete de yerba mate cuesta $${precioKg.toLocaleString("es-AR")}, ¿cuánto costarán ${cantKg} paquetes?`,
          icono: "🧉",
          pista: `Pista: multiplicá el precio unitario ($${precioKg.toLocaleString("es-AR")}) por ${cantKg}.`,
        },
      ];
      const pEsc = propEscenarios[Math.floor(i / 4) % propEscenarios.length];
      acts.push(
        qToPick(
          q(
            pEsc.pregunta,
            choices.map((c) => [pEsc.icono, `$${c.toLocaleString("es-AR")}`]),
            choices.indexOf(targetPrecio),
            pEsc.pista
          ),
          `m42014-${i}`,
          "",
          skills
        )
      );
    } else if (mod === 1) {
      // Tabla de valores: constante de proporcionalidad directa formateada como tabla real
      const cantCajas = pickOne([4, 6, 8]);
      const unitario = pickOne([6, 8, 12]);
      const total2 = unitario * 2;
      const totalCajas = cantCajas * unitario;
      const choices = distinctChoices(unitario, [unitario + 2, Math.max(2, unitario - 2), unitario * 2], 3);
      const tablaEscenarios = [
        {
          pregunta: "Mirá la tabla de proporcionalidad directa. ¿Cuántos alfajores contiene 1 caja?",
          columnas: ["Cajas", "Alfajores"],
          icono: "📦",
          item: "alfajores por caja",
          pista: `Pista: calculá el valor de una caja dividiendo ${total2} ÷ 2 o ${totalCajas} ÷ ${cantCajas}.`,
        },
        {
          pregunta: "Mirá la tabla de proporcionalidad directa. ¿Cuántas botellas contiene 1 cajón?",
          columnas: ["Cajones", "Botellas de jugo"],
          icono: "🧃",
          item: "botellas por cajón",
          pista: `Pista: dividí las botellas entre los cajones para encontrar cuántas van en 1 solo (${total2} ÷ 2).`,
        },
        {
          pregunta: "Mirá la tabla de proporcionalidad directa. ¿Cuántas medialunas hay en 1 bandeja?",
          columnas: ["Bandejas", "Medialunas"],
          icono: "🥐",
          item: "medialunas por bandeja",
          pista: `Pista: dividí la cantidad total por el número de bandejas para hallar la unidad (${total2} ÷ 2).`,
        },
      ];
      const tEsc = tablaEscenarios[tablaShuffled[tablaIdx++]];
      acts.push({
        ...qToPick(
          q(
            tEsc.pregunta,
            choices.map((c) => [tEsc.icono, `${c} ${tEsc.item}`]),
            choices.indexOf(unitario),
            tEsc.pista
          ),
          `m42014-${i}`,
          "",
          skills
        ),
        apoyo: { tipo: "tabla", columnas: tEsc.columnas, filas: [[1, "?"], [2, total2], [cantCajas, totalCajas]] },
      });
    } else if (mod === 2) {
      // Múltiplos
      let base: number;
      do {
        base = pickOne([6, 7, 8, 9, 12, 15, 14, 18, 20]);
      } while (usedBases.has(base));
      usedBases.add(base);
      const factor = pickOne([4, 5, 6, 7, 8]);
      const mult = base * factor;
      const nonMult1 = mult + 1;
      const nonMult2 = mult - 2;
      const choices = distinctChoices(mult, [nonMult1, nonMult2, mult + 3], 3);

      acts.push(
        qToPick(
          q(
            `¿Cuál de los siguientes números es MÚLTIPLO de ${base}?`,
            choices.map((c) => ["🔢", String(c)]),
            choices.indexOf(mult),
            `Pista: un múltiplo de ${base} se obtiene multiplicando ${base} por un número natural (debe dar resto cero al dividir).`
          ),
          `m42014-${i}`,
          "",
          skills
        )
      );
    } else {
      // Divisores
      let num: number;
      do {
        num = pickOne([24, 30, 36, 40, 48, 60, 42, 54, 72]);
      } while (usedDivNums.has(num));
      usedDivNums.add(num);
      const allDivs = [2, 3, 4, 5, 6, 8, 10, 12].filter((d) => num % d === 0);
      const allNonDivs = [7, 9, 11, 13, 14, 17, 19].filter((d) => num % d !== 0);
      const divCorrect = pickOne(allDivs);
      const nonDivs = shuffle(allNonDivs).slice(0, 2);
      const choices = distinctChoices(divCorrect, nonDivs, 3);

      acts.push(
        qToPick(
          q(
            `¿Cuál de los siguientes números es DIVISOR de ${num}?`,
            choices.map((c) => ["➗", String(c)]),
            choices.indexOf(divCorrect),
            `Pista: un divisor de ${num} divide al número de forma exacta, sin dejar resto.`
          ),
          `m42014-${i}`,
          "",
          skills
        )
      );
    }
  }
  return numbered(acts);
}

// ==========================================================================
// MÓDULO 3: FRACCIONES Y DECIMALES (42015 - 42023)
// ==========================================================================

// Mundo 42015: Fracciones de uso social: 1/2, 1/4, 3/4, 1/8
function buildMundo42015(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  const skills = ["m4-frac-parte"];
  const staticPreguntas = [
    
    
    { p: "Una pizza se cortó en 8 porciones iguales y Tomás comió 3 porciones. ¿Qué fracción de la pizza comió?", opts: ["3/8 de la pizza", "5/8 de la pizza", "3/4 de la pizza"], ans: "3/8 de la pizza", hint: "Pista: el numerador indica las porciones tomadas y el denominador el total." },
    { p: "Si comprás dos paquetes de 1/4 kg de café y un paquete de 1/2 kg, ¿cuánto café compraste en total?", opts: ["1 kg de café", "3/4 kg de café", "1 1/2 kg de café"], ans: "1 kg de café", hint: "Pista: sumá primero los dos paquetes chicos para formar medio kilo." },
    { p: "¿Cuántos octavos (1/8) forman medio kilo (1/2)?", opts: ["4 octavos", "2 octavos", "8 octavos"], ans: "4 octavos", hint: "Pista: buscá la fracción con denominador 8 que sea equivalente a la mitad." },
    { p: "En una receta de cocina se piden 3/4 kg de harina. Si tenemos paquetes de 1/4 kg, ¿cuántos paquetes debemos usar?", opts: ["3 paquetes", "4 paquetes", "2 paquetes"], ans: "3 paquetes", hint: "Pista: fijate cuántas unidades de un cuarto se necesitan para reunir tres cuartos." },
    { p: "Si de una torta entera cortada en 4 porciones iguales queda solo 1 porción, ¿qué fracción se comió?", opts: ["3/4 de la torta", "1/4 de la torta", "2/4 de la torta"], ans: "3/4 de la torta", hint: "Pista: restale al total de cuatro partes la única porción que sobró." },
    { p: "¿Cuál de las siguientes fracciones representa la MITAD exacta de una unidad?", opts: ["1/2", "1/4", "3/4"], ans: "1/2", hint: "Pista: buscá la expresión donde el numerador sea la mitad del denominador." },
    { p: "¿Cuántos potes de 1/4 kg de dulce de leche se necesitan para reunir 1 1/2 kg?", opts: ["6 potes", "4 potes", "8 potes"], ans: "6 potes", hint: "Pista: calculá los cuartos del entero y sumale los cuartos del medio kilo restante." },
    { p: "Si una jarra contiene 3/4 litro de jugo y se consume 1/4 litro, ¿cuánto jugo queda?", opts: ["1/2 litro", "1/4 litro", "3/4 litro"], ans: "1/2 litro", hint: "Pista: restá los numeradores manteniendo el mismo denominador y simplificá." },
    { p: "Para preparar masa de pan casero se mezclan 1/2 kg de harina leudante y 1/4 kg de harina integral. ¿Cuánto pesa la mezcla?", opts: ["3/4 kg", "1 kg", "2/4 kg"], ans: "3/4 kg", hint: "Pista: expresá el medio kilo en cuartos y sumá el cuarto restante." },
    { p: "Una tableta de chocolate tiene 8 barritas iguales. Si Ana come 4 barritas, ¿qué fracción comió?", opts: ["1/2 de la tableta", "1/4 de la tableta", "3/8 de la tableta"], ans: "1/2 de la tableta", hint: "Pista: compará la cantidad comida con la mitad del total de barritas." },
    { p: "¿Cuántos cuartos (1/4) forman 2 unidades enteras?", opts: ["8 cuartos", "4 cuartos", "6 cuartos"], ans: "8 cuartos", hint: "Pista: si cada entero tiene cuatro cuartos, multiplicá por dos." },
    { p: "Si en una jarra de 1 litro agregamos 1/4 litro de leche y 1/2 litro de café, ¿cuánto líquido hay?", opts: ["3/4 litro", "1 litro", "1/2 litro"], ans: "3/4 litro", hint: "Pista: convertí el medio litro a dos cuartos para sumar fracciones homogéneas." },
    { p: "Un bidón contiene 3 litros de agua mineral. ¿Cuántas botellitas de 1/2 litro se pueden llenar?", opts: ["6 botellitas", "3 botellitas", "8 botellitas"], ans: "6 botellitas", hint: "Pista: cada litro rinde dos botellitas de esa medida." },
    { p: "¿Cuántos paquetes de 1/8 kg de levadura se precisan para reunir 1/2 kg?", opts: ["4 paquetes", "2 paquetes", "8 paquetes"], ans: "4 paquetes", hint: "Pista: calculá la mitad de las ocho partes que integran el entero." },
    { p: "Si una bolsa de manzanas pesa 2 1/4 kg, ¿cuántos cuartos de kilo (1/4 kg) contiene?", opts: ["9 cuartos", "8 cuartos", "7 cuartos"], ans: "9 cuartos", hint: "Pista: calculá cuántos cuartos hay en dos enteros y agregá el cuarto suelto." },
    { p: "Una horma de queso se dividió en 8 trozos iguales y se vendieron 6. ¿Qué fracción quedó sin vender?", opts: ["2/8 de la horma", "6/8 de la horma", "1/4 de la horma"], ans: "2/8 de la horma", hint: "Pista: restá los trozos vendidos del total inicial de porciones." },
    { p: "Para hornear galletitas se usan 1/4 kg de manteca y 3/4 kg de azúcar. ¿Cuánto pesan ambos ingredientes juntos?", opts: ["1 kg", "1 1/2 kg", "2/4 kg"], ans: "1 kg", hint: "Pista: sumá los cuartos indicados para verificar si completan la unidad entera." },
    { p: "¿Cuántos medios litros (1/2 L) hay en 5 litros de agua?", opts: ["10 medios litros", "5 medios litros", "15 medios litros"], ans: "10 medios litros", hint: "Pista: duplicá la cantidad de litros para obtener los medios litros equivalentes." },
    { p: "Si cortamos una cinta de 1 metro en 8 pedacitos iguales, ¿cuánto mide cada pedacito?", opts: ["1/8 de metro", "1/4 de metro", "1/2 de metro"], ans: "1/8 de metro", hint: "Pista: cuando se fracciona en ocho partes iguales, cada sección recibe ese nombre." },
    { p: "En una fiesta se consumieron 2 botellas y media de gaseosa. ¿Cuántos medios litros son?", opts: ["5 medios litros", "4 medios litros", "6 medios litros"], ans: "5 medios litros", hint: "Pista: pasá las dos botellas enteras a medios litros y sumá la fracción restante." },
    { p: "Si tenemos 3 paquetes de 1/4 kg de fideos y compramos 1 paquete más de 1/4 kg, ¿cuánto reunimos?", opts: ["1 kg de fideos", "3/4 kg de fideos", "1 1/4 kg de fideos"], ans: "1 kg de fideos", hint: "Pista: reuní los cuatro paquetes de un cuarto para ver qué unidad forman." },
    { p: "¿Qué fracción representa MENOS que medio kilo (1/2 kg)?", opts: ["1/4 kg", "3/4 kg", "1 kg"], ans: "1/4 kg", hint: "Pista: buscá la opción cuya porción sea inferior a la mitad del entero." },
    { p: "¿Qué fracción representa MÁS que medio kilo (1/2 kg)?", opts: ["3/4 kg", "1/4 kg", "1/8 kg"], ans: "3/4 kg", hint: "Pista: buscá la alternativa que supere la mitad de la unidad de medida." },
    { p: "Si de una barra de pan de 1 metro se corta 1/2 metro y luego 1/4 metro, ¿cuánto se cortó en total?", opts: ["3/4 de metro", "1/4 de metro", "1 metro"], ans: "3/4 de metro", hint: "Pista: sumá medio metro y un cuarto de metro unificando denominadores." },
    { p: "¿Cuántos octavos (1/8) se necesitan para formar 1 unidad entera?", opts: ["8 octavos", "4 octavos", "16 octavos"], ans: "8 octavos", hint: "Pista: el propio denominador te señala la cantidad necesaria para completar el entero." },
    { p: "Un paquete de té pesa 1/8 kg. ¿Cuánto pesan 2 paquetes juntos?", opts: ["1/4 kg", "1/2 kg", "1/8 kg"], ans: "1/4 kg", hint: "Pista: sumá los dos octavos y simplificá la fracción resultante." },
    { p: "Si de una pizza de 8 porciones quedan 4 porciones, ¿qué fracción de pizza queda?", opts: ["1/2 de la pizza", "1/4 de la pizza", "3/4 de la pizza"], ans: "1/2 de la pizza", hint: "Pista: observá qué proporción representan cuatro porciones respecto de ocho." },
    { p: "¿Cuántos vasos de 1/4 litro se pueden llenar con una jarra de 1 litro de jugo?", opts: ["4 vasos", "2 vasos", "8 vasos"], ans: "4 vasos", hint: "Pista: pensá en cuántas medidas de un cuarto completan un litro entero." },
    { p: "Si una receta pide 1 1/4 kg de papas, ¿cuántos paquetes de 1/4 kg debemos comprar?", opts: ["5 paquetes", "4 paquetes", "6 paquetes"], ans: "5 paquetes", hint: "Pista: transformá el kilo entero a cuartos y agregá el cuarto suelto." },
    { p: "En un taller de costura quedan 6 octavos (6/8) de metro de tela. ¿A cuántos cuartos equivale?", opts: ["3/4 de metro", "2/4 de metro", "4/4 de metro"], ans: "3/4 de metro", hint: "Pista: dividí numerador y denominador por dos para hallar la fracción equivalente." },
    { p: "¿Cuántos cuartos de kilo (1/4 kg) equivalen a 3 kilos enteros?", opts: ["12 cuartos", "6 cuartos", "8 cuartos"], ans: "12 cuartos", hint: "Pista: multiplicá la cantidad de enteros por los cuatro cuartos que tiene cada uno." },
    { p: "Si se juntan 4 paquetes de 1/2 kg de azúcar, ¿cuántos kilos se obtienen?", opts: ["2 kg de azúcar", "1 kg de azúcar", "3 kg de azúcar"], ans: "2 kg de azúcar", hint: "Pista: agrupá de a dos paquetes para formar kilos enteros." },
    { p: "¿Qué fracción es equivalente a 2 cuartos (2/4)?", opts: ["1/2", "1/4", "3/4"], ans: "1/2", hint: "Pista: simplificá la fracción dividiendo ambos términos por dos." },
    { p: "Una caminata de 1 km se divide en 4 tramos iguales. ¿Qué fracción del camino es cada tramo?", opts: ["1/4 del camino", "1/2 del camino", "1/8 del camino"], ans: "1/4 del camino", hint: "Pista: dividir el recorrido en cuatro partes iguales genera esa fracción." }
  ];

  const dynGenerators = [
    () => {
      const k = randInt(1, 6);
      const ans = `${k * 4} paquetes`;
      return { p: `¿Cuántos paquetes de 1/4 kg de yerba mate se necesitan para completar ${k} kg?`, ans, opts: [ans, `${k * 2} paquetes`, `${k * 8} paquetes`], hint: `Pista: cada kilo requiere 4 cuartos; calculá ${k} × 4.` };
    },
    () => {
      const L = randInt(2, 7);
      const ans = `${L * 2} vasos`;
      return { p: `¿Cuántos vasos de 1/2 litro de agua se necesitan para llenar una botella de ${L} litros?`, ans, opts: [ans, `${L} vasos`, `${L * 4} vasos`], hint: `Pista: en cada litro entran 2 medios litros; calculá ${L} × 2.` };
    },
    () => {
      const tot = pickOne([6, 8, 10, 12]);
      const com = randInt(2, tot - 1);
      const ans = `${com}/${tot} de la tarta`;
      return { p: `Una tarta se cortó en ${tot} porciones iguales y se consumieron ${com} porciones. ¿Qué fracción se consumió?`, ans, opts: [ans, `${tot - com}/${tot} de la tarta`, `1/${tot} de la tarta`], hint: "Pista: el numerador indica las porciones consumidas y el denominador el total." };
    },
    () => {
      const potes = randInt(2, 8) * 2;
      const kg = potes / 2;
      const ans = `${kg} kg`;
      return { p: `Si se juntan ${potes} potes de 1/2 kg de dulce de leche, ¿cuántos kilos se obtienen en total?`, ans, opts: [ans, `${potes} kg`, `${kg + 2} kg`], hint: `Pista: cada 2 potes de medio kilo forman 1 kilo entero (${potes} ÷ 2).` };
    },
    () => {
      const L = randInt(2, 6);
      const ans = `${L * 4} vasos`;
      return { p: `¿Cuántos vasos de 1/4 litro se pueden llenar con un bidón de ${L} litros de jugo?`, ans, opts: [ans, `${L * 2} vasos`, `${L * 8} vasos`], hint: `Pista: cada litro equivale a 4 vasos de un cuarto; calculá ${L} × 4.` };
    }
  ];

  const dynItems = dynGenerators.map((gen) => gen());
  const allPreguntas = [...dynItems, ...staticPreguntas];
  const seleccionadas = pickDistinctPreguntasForWorld(42015, allPreguntas, 8);
  for (let i = 0; i < 8; i++) {
    const item = seleccionadas[i];
    const choices = distinctChoices(item.ans, item.opts.filter(o => o !== item.ans), 3);
    acts.push(
      qToPick(
        q(
          item.p,
          choices.map((c) => ["🥧", c]),
          choices.indexOf(item.ans),
          item.hint
        ),
        `m42015-${i}`,
        "",
        skills
      )
    );
  }
  return numbered(acts);
}

// Mundo 42016: Fracciones de tercios, quintos y sextos en repartos
function buildMundo42016(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  const skills = ["m4-fracciones-reparto"];

  const casosReparto = [
    { item: "alfajores santacruceños", cant: 4, chicos: 3, frac: "4/3", ico: "🍫" },
    { item: "alfajores santacruceños", cant: 5, chicos: 3, frac: "5/3", ico: "🍫" },
    { item: "barras de cereal", cant: 7, chicos: 3, frac: "7/3", ico: "🌾" },
    { item: "barras de cereal", cant: 8, chicos: 3, frac: "8/3", ico: "🌾" },
    { item: "turrones de maní", cant: 5, chicos: 4, frac: "5/4", ico: "🥜" },
    { item: "turrones de maní", cant: 7, chicos: 4, frac: "7/4", ico: "🥜" },
    { item: "tabletas de chocolate", cant: 9, chicos: 4, frac: "9/4", ico: "🍫" },
    { item: "chocolatines", cant: 6, chicos: 5, frac: "6/5", ico: "🍫" },
    { item: "alfajores santacruceños", cant: 7, chicos: 5, frac: "7/5", ico: "🍫" },
    { item: "alfajores santacruceños", cant: 8, chicos: 5, frac: "8/5", ico: "🍫" },
    { item: "alfajores de calafate", cant: 9, chicos: 5, frac: "9/5", ico: "🫐" },
    { item: "alfajores de calafate", cant: 11, chicos: 5, frac: "11/5", ico: "🫐" },
    { item: "barras de cereal", cant: 12, chicos: 5, frac: "12/5", ico: "🌾" },
    { item: "tabletas de chocolate", cant: 7, chicos: 6, frac: "7/6", ico: "🍫" },
    { item: "tabletas de chocolate", cant: 11, chicos: 6, frac: "11/6", ico: "🍫" },
    { item: "tortas individuales", cant: 13, chicos: 6, frac: "13/6", ico: "🍰" },
    { item: "turrones artesanales", cant: 9, chicos: 8, frac: "9/8", ico: "🥜" },
    { item: "alfajores de dulce de leche", cant: 11, chicos: 8, frac: "11/8", ico: "🍫" },
    { item: "bizcochuelos caseros", cant: 2, chicos: 3, frac: "2/3", ico: "🥧" },
    { item: "tartas de manzana", cant: 4, chicos: 5, frac: "4/5", ico: "🍎" },
    { item: "pizzetas caseras", cant: 5, chicos: 6, frac: "5/6", ico: "🍕" },
    { item: "budines de limón", cant: 7, chicos: 8, frac: "7/8", ico: "🍋" },
    { item: "paquetes de galletitas", cant: 10, chicos: 3, frac: "10/3", ico: "🍪" },
    { item: "paquetes de galletitas", cant: 11, chicos: 3, frac: "11/3", ico: "🍪" },
    { item: "chocolates con almendras", cant: 13, chicos: 4, frac: "13/4", ico: "🍫" },
    { item: "chocolates con almendras", cant: 15, chicos: 4, frac: "15/4", ico: "🍫" },
    { item: "alfajores de maicena", cant: 13, chicos: 5, frac: "13/5", ico: "🧁" },
    { item: "alfajores de maicena", cant: 14, chicos: 5, frac: "14/5", ico: "🧁" },
    { item: "barras energéticas", cant: 17, chicos: 6, frac: "17/6", ico: "⚡" },
    { item: "barras energéticas", cant: 19, chicos: 6, frac: "19/6", ico: "⚡" },
    { item: "obleas rellenas", cant: 13, chicos: 8, frac: "13/8", ico: "🧇" },
    { item: "obleas rellenas", cant: 15, chicos: 8, frac: "15/8", ico: "🧇" },
    { item: "tortas fritas", cant: 5, chicos: 3, frac: "5/3", ico: "🫓" },
    { item: "pastafrolas caseras", cant: 7, chicos: 5, frac: "7/5", ico: "🥧" },
    { item: "panes caseros", cant: 8, chicos: 6, frac: "8/6", ico: "🍞" },
    { item: "chocolates calientes en barra", cant: 11, chicos: 4, frac: "11/4", ico: "🍫" },
  ];

  const seleccionados = shuffle(casosReparto).slice(0, 8);
  for (let i = 0; i < 8; i++) {
    const { item, cant, chicos, frac, ico } = seleccionados[i];
    const choices = distinctChoices(
      `${frac} de ${item.split(" ")[0]}`,
      [
        `${chicos}/${cant} de ${item.split(" ")[0]}`,
        `${cant}/${chicos + 1} de ${item.split(" ")[0]}`,
        `${cant + 1}/${chicos} de ${item.split(" ")[0]}`,
      ],
      3
    );
    acts.push(
      qToPick(
        q(
          `Se reparten ${cant} ${item} entre ${chicos} chicos en partes iguales sin que sobre nada. ¿Cuánto recibe cada uno?`,
          choices.map((c) => [ico, c]),
          choices.indexOf(`${frac} de ${item.split(" ")[0]}`),
          `Pista: la cantidad a repartir (${cant}) es el numerador y la cantidad de chicos (${chicos}) es el denominador.`
        ),
        `m42016-${i}`,
        "",
        skills
      )
    );
  }
  return numbered(acts);
}

// Mundo 42017: Fracciones equivalentes y representaciones
function buildMundo42017(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  const skills = ["m4-frac-equivalentes"];

  // 1. ¿Cuál es mayor?
  const compararGens = [
    () => {
      const [, , ans, fakes] = pickOne([
        [3, 4, "3/4", ["1/4", "2/8", "1/6"]],
        [2, 3, "2/3", ["1/3", "1/6", "2/8"]],
        [4, 5, "4/5", ["2/5", "1/5", "3/10"]],
        [5, 8, "5/8", ["3/8", "2/8", "1/8"]],
      ]);
      return {
        p: `¿Cuál de las siguientes fracciones es MAYOR que 1/2?`,
        ans,
        fakes,
        hint: "Pista: compará con la mitad del denominador (en 4 la mitad es 2; en 8 es 4).",
        ico: "⚖️"
      };
    },
    () => {
      const den = pickOne([5, 6, 8, 10]);
      const maxN = randInt(3, den - 1);
      const ans = `${maxN}/${den}`;
      const fakes = [`${maxN - 1}/${den}`, `${Math.max(1, maxN - 2)}/${den}`];
      return {
        p: `Entre estas fracciones de igual denominador, ¿cuál representa la MAYOR cantidad?`,
        ans,
        fakes,
        hint: "Pista: a igual denominador, la fracción mayor es la que tiene mayor numerador.",
        ico: "📈"
      };
    },
    () => {
      const ans = "1/2";
      const fakes = ["1/4", "1/8"];
      return {
        p: `¿Cuál de las siguientes fracciones unitarias es la MAYOR?`,
        ans,
        fakes,
        hint: "Pista: si dividís una torta en menos partes, cada porción es más grande.",
        ico: "🍰"
      };
    }
  ];

  // 2. Ubicar en la recta numérica
  const rectaGens = [
    () => {
      return {
        p: "¿Qué fracción se ubica exactamente en el punto medio entre 0 y 1 en la recta numérica?",
        ans: "1/2",
        fakes: ["1/4", "3/4"],
        hint: "Pista: buscá la fracción que divide el tramo unitario en dos partes iguales.",
        ico: "📍"
      };
    },
    () => {
      const [impropia, enteros, fakes] = pickOne([
        ["5/4", "Entre 1 y 2", ["Entre 0 y 1", "Entre 2 y 3"]],
        ["7/4", "Entre 1 y 2", ["Entre 0 y 1", "Entre 2 y 3"]],
        ["5/2", "Entre 2 y 3", ["Entre 1 y 2", "Entre 3 y 4"]],
        ["7/3", "Entre 2 y 3", ["Entre 1 y 2", "Entre 3 y 4"]],
      ]);
      return {
        p: `¿Entre qué dos números enteros se ubica la fracción ${impropia} en la recta numérica?`,
        ans: enteros,
        fakes,
        hint: "Pista: como el numerador es mayor que el denominador, la fracción es mayor que 1.",
        ico: "📏"
      };
    },
    () => {
      const d = pickOne([4, 8]);
      const n = d / 2;
      return {
        p: `En una recta numérica dividida en ${d} partes iguales, ¿qué fracción coincide con la posición de 1/2?`,
        ans: `${n}/${d}`,
        fakes: [`${n - 1}/${d}`, `${n + 1}/${d}`],
        hint: "Pista: calculá la mitad exacta del denominador.",
        ico: "🎯"
      };
    }
  ];

  // 3. Completar el numerador / denominador equivalente
  const completarGens = [
    () => {
      const mult = pickOne([2, 3, 4]);
      const [n, d] = pickOne([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [2, 5]]);
      const targetN = n * mult;
      const targetD = d * mult;
      return {
        p: `Para que la fracción sea EQUIVALENTE a ${n}/${d}, ¿qué número completa el numerador: ___/${targetD}?`,
        ans: `${targetN}`,
        fakes: [`${targetN + 1}`, `${Math.max(1, targetN - 1)}`],
        hint: `Pista: el denominador se multiplicó por ${mult}, así que hacé ${n} × ${mult}.`,
        ico: "✏️"
      };
    },
    () => {
      const mult = pickOne([2, 4]);
      const baseD = 2;
      const targetD = baseD * mult;
      return {
        p: `¿Qué fracción con denominador ${targetD} es EQUIVALENTE a 1/2?`,
        ans: `${mult}/${targetD}`,
        fakes: [`${mult - 1}/${targetD}`, `${mult + 1}/${targetD}`],
        hint: `Pista: multiplicá numerador y denominador por ${mult}.`,
        ico: "🔢"
      };
    },
    () => {
      const [n, d, mult] = pickOne([[1, 3, 3], [2, 5, 2], [3, 4, 2], [1, 5, 2]]);
      return {
        p: `Si multiplicamos numerador y denominador de ${n}/${d} por ${mult}, ¿qué fracción equivalente obtenemos?`,
        ans: `${n * mult}/${d * mult}`,
        fakes: [`${n * mult + 1}/${d * mult}`, `${n}/${d * mult}`],
        hint: `Pista: calculá ${n} × ${mult} y ${d} × ${mult}.`,
        ico: "✨"
      };
    }
  ];

  // 4. Fracción de un dibujo / representación gráfica
  const dibujoGens = [
    () => {
      const [tot, pintadas, equiv] = pickOne([
        [8, 4, "1/2"],
        [6, 3, "1/2"],
        [4, 2, "1/2"],
        [6, 2, "1/3"],
        [8, 2, "1/4"],
        [8, 6, "3/4"],
      ]);
      return {
        p: `Un chocolate rectangular tiene ${tot} barritas iguales y comimos ${pintadas}. ¿A qué fracción irreducible equivale lo consumido?`,
        ans: equiv,
        fakes: [`1/${tot}`, `${tot - pintadas}/${tot}`],
        hint: `Pista: ${pintadas} de ${tot} barritas se puede simplificar dividiendo ambos números.`,
        ico: "🍫"
      };
    },
    () => {
      const [tot, pintadas, fracDirecta] = pickOne([
        [4, 2, "2/4"],
        [8, 4, "4/8"],
        [6, 3, "3/6"],
        [10, 5, "5/10"]
      ]);
      return {
        p: `Una pizza se corta en ${tot} porciones iguales y se comen ${pintadas}. ¿Cuál de estas fracciones EQUIVALENTES a 1/2 representa lo comido?`,
        ans: fracDirecta,
        fakes: [`1/${tot}`, `${pintadas + 1}/${tot}`],
        hint: "Pista: buscá la fracción cuyo numerador sea exactamente la mitad del denominador.",
        ico: "🍕"
      };
    },
    () => {
      const [, cant, frac] = pickOne([
        [12, 6, "1/2 de la docena"],
        [12, 4, "1/3 de la docena"],
        [12, 3, "1/4 de la docena"]
      ]);
      return {
        p: `En una caja de 12 alfajores santacruceños quedan ${cant}. ¿Qué fracción de la docena representa?`,
        ans: frac,
        fakes: ["2/3 de la docena", "1/6 de la docena"],
        hint: `Pista: pensá qué parte de 12 representa el número ${cant}.`,
        ico: "📦"
      };
    }
  ];

  const pool = [
    ...compararGens.map(g => g()),
    ...rectaGens.map(g => g()),
    ...completarGens.map(g => g()),
    ...dibujoGens.map(g => g()),
  ];

  const items = pickDistinctPreguntasForWorld(42017, pool, 8);
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const choices = distinctChoices(item.ans, item.fakes, 3);
    acts.push(
      qToPick(
        q(item.p, choices.map((c) => [item.ico, c]), choices.indexOf(item.ans), item.hint),
        `m42017-${i}`,
        "",
        skills
      )
    );
  }
  return numbered(acts);
}

// Mundo 42018: Números mixtos y fracciones mayores que 1
function buildMundo42018(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  const skills = ["m4-numeros-mixtos"];
  const mixtos: [string, string, string[]][] = [
    ["5/2", "2 1/2", ["1 1/2", "3 1/2"]],
    ["7/4", "1 3/4", ["2 1/4", "1 1/4"]],
    ["9/4", "2 1/4", ["1 3/4", "2 3/4"]],
    ["8/3", "2 2/3", ["2 1/3", "3 1/3"]],
    ["7/2", "3 1/2", ["2 1/2", "4 1/2"]],
    ["11/4", "2 3/4", ["2 1/4", "3 1/4"]],
    ["10/3", "3 1/3", ["3 2/3", "2 1/3"]],
    ["13/4", "3 1/4", ["3 3/4", "2 3/4"]],
    ["7/3", "2 1/3", ["1 2/3", "3 1/3"]],
    ["11/3", "3 2/3", ["2 2/3", "4 1/3"]],
    ["14/3", "4 2/3", ["3 2/3", "5 1/3"]],
    ["15/4", "3 3/4", ["2 3/4", "4 1/4"]],
    ["9/2", "4 1/2", ["3 1/2", "5 1/2"]],
    ["11/2", "5 1/2", ["4 1/2", "6 1/2"]],
    ["17/4", "4 1/4", ["3 3/4", "5 1/4"]],
    ["19/4", "4 3/4", ["3 3/4", "5 1/4"]],
    ["13/3", "4 1/3", ["3 2/3", "5 1/3"]],
    ["17/5", "3 2/5", ["2 2/5", "4 1/5"]],
    ["9/5", "1 4/5", ["1 2/5", "2 1/5"]],
    ["11/5", "2 1/5", ["2 3/5", "1 4/5"]],
    ["13/5", "2 3/5", ["2 1/5", "3 1/5"]],
    ["16/5", "3 1/5", ["2 4/5", "3 3/5"]],
    ["13/6", "2 1/6", ["1 5/6", "2 5/6"]],
    ["17/6", "2 5/6", ["2 1/6", "3 1/6"]],
  ];

  const recetas = [
    (f: string) => `Para cocinar tortas fritas se usaron ${f} kg de harina. ¿Cómo se expresa esa cantidad como número mixto?`,
    (f: string) => `En una panadería de Río Gallegos se compraron ${f} kg de manteca. ¿Cuál es su expresión como número mixto?`,
    (f: string) => `Para preparar dulce de calafate se necesitan ${f} kg de azúcar. ¿Cómo se anota esa cantidad en número mixto?`,
    (f: string) => `En la estancia se repartieron ${f} kg de queso de campo. ¿Cuál es su expresión mixta equivalente?`,
    (f: string) => `Para hornear pan casero se utilizaron ${f} kg de harina leudante. ¿Cuál es su valor en número mixto?`,
  ];

  const allItems = mixtos.map(([impropia, mixto, fakes], idx) => ({
    p: recetas[idx % recetas.length](impropia),
    ans: mixto,
    fakes,
  }));

  const seleccionados = pickDistinctPreguntasForWorld(42018, allItems, 8);
  for (let i = 0; i < 8; i++) {
    const item = seleccionados[i];
    const choices = distinctChoices(item.ans, item.fakes, 3);
    acts.push(
      qToPick(
        q(
          item.p,
          choices.map((c) => ["🥖", `${c} kg`]),
          choices.indexOf(item.ans),
          "Pista: dividí el numerador por el denominador para obtener los enteros y la fracción restante."
        ),
        `m42018-${i}`,
        "",
        skills
      )
    );
  }
  return numbered(acts);
}

// Mundo 42019: Fracciones en la recta numérica (VARIEDAD: NUNCA EL MISMO ÍTEM 8 VECES)
function buildMundo42019(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  const skills = ["m4-frac-recta"];

  const ordenes = [
    { id: "ord-1", prompt: "Ordená estas fracciones con denominador 4 de MENOR a MAYOR:", items: ["1/4", "1/2", "3/4", "5/4"], hint: "Pista: ordená de acuerdo al avance progresivo sobre la recta numérica." },
    { id: "ord-2", prompt: "Ordená estas fracciones de MENOR a MAYOR:", items: ["1/8", "1/4", "1/2", "1"], hint: "Pista: pensá qué porción es más pequeña al dividir el entero en más partes." },
    { id: "ord-3", prompt: "Ordená estas fracciones con tercios de MENOR a MAYOR:", items: ["1/3", "2/3", "1", "4/3"], hint: "Pista: compará cuáles quedan antes de la unidad y cuál la supera." },
    { id: "ord-4", prompt: "Ordená estas fracciones de MENOR a MAYOR:", items: ["1/6", "1/3", "1/2", "2/3"], hint: "Pista: llevá mentalmente cada fracción a un denominador común." },
    { id: "ord-5", prompt: "Ordená estas fracciones con quintos de MENOR a MAYOR:", items: ["1/5", "2/5", "4/5", "6/5"], hint: "Pista: a igual denominador, el orden depende del valor del numerador." },
    { id: "ord-6", prompt: "Ordená estas fracciones respecto a la unidad de MENOR a MAYOR:", items: ["1/10", "1/2", "3/4", "1"], hint: "Pista: ordená desde la fracción más cercana al cero hasta el entero." },
    { id: "ord-7", prompt: "Ordená estas fracciones menores y mayores que 1 de MENOR a MAYOR:", items: ["1/2", "3/4", "1", "3/2"], hint: "Pista: ubicá primero las fracciones propias y luego la fracción impropia." },
    { id: "ord-8", prompt: "Ordená estas fracciones de menor a mayor en la recta:", items: ["1/8", "3/8", "5/8", "7/8"], hint: "Pista: ordená directamente según el numerador creciente." },
    { id: "ord-9", prompt: "Ordená estas fracciones con décimos de MENOR a MAYOR:", items: ["2/10", "5/10", "8/10", "10/10"], hint: "Pista: observá el avance de los décimos hacia la unidad completa." },
    { id: "ord-10", prompt: "Ordená estas fracciones de uso cotidiano de MENOR a MAYOR:", items: ["1/4", "1/2", "1", "5/4"], hint: "Pista: compará las distancias de cada número respecto del origen cero." },
    { id: "ord-11", prompt: "Ordená estas fracciones mayores que 1 de MENOR a MAYOR:", items: ["1", "5/4", "3/2", "2"], hint: "Pista: analizá cuántos enteros y partes contiene cada número mixto." },
    { id: "ord-12", prompt: "Ordená estas fracciones con sextos de MENOR a MAYOR:", items: ["1/6", "2/6", "4/6", "5/6"], hint: "Pista: ordená las porciones según crecen los numeradores." }
  ];

  const staticPreguntas = [
    { p: "¿Qué fracción se ubica exactamente a mitad de camino entre 0 y 1 en la recta numérica?", opts: ["1/2", "1/4", "3/4"], ans: "1/2", hint: "Pista: buscá la fracción que divide al intervalo unitario en dos partes iguales." },
    { p: "¿Cuál de las siguientes fracciones se ubica a la DERECHA del 1 (es mayor que 1) en la recta numérica?", opts: ["5/4", "3/4", "2/4"], ans: "5/4", hint: "Pista: observá qué fracción tiene el numerador superior a su denominador." },
    
    { p: "¿Cuál de estas fracciones está más CERCA del 0 en la recta numérica?", opts: ["1/8", "1/4", "1/2"], ans: "1/8", hint: "Pista: mayor denominador en fracciones unitarias indica menor distancia al origen." },
    { p: "¿Qué fracción se encuentra ubicada entre 1/2 y 1 en la recta numérica?", opts: ["3/4", "1/4", "5/4"], ans: "3/4", hint: "Pista: buscá el valor intermedio que supere la mitad sin llegar al entero." },
    { p: "¿Cuál de estas fracciones se encuentra más CERCA del 1 en la recta numérica?", opts: ["7/8", "1/2", "1/4"], ans: "7/8", hint: "Pista: calculá cuál está a menor diferencia de completar la unidad entera." },
    
    { p: "Si dividimos el tramo de 0 a 1 en 4 partes iguales, ¿en qué marca queda la primera división?", opts: ["1/4", "1/2", "3/4"], ans: "1/4", hint: "Pista: la primera marca de un reparto en cuatro indica un cuarto." },
    { p: "Si dividimos el tramo de 0 a 1 en 4 partes iguales, ¿en qué marca queda la segunda división?", opts: ["2/4 (1/2)", "1/4", "3/4"], ans: "2/4 (1/2)", hint: "Pista: dos divisiones de cuatro equivalen al punto medio del recorrido." },
    { p: "Si dividimos el tramo de 0 a 1 en 4 partes iguales, ¿en qué marca queda la tercera división?", opts: ["3/4", "2/4", "4/4"], ans: "3/4", hint: "Pista: contá tres divisiones unitarias desde el punto de inicio." },
    { p: "¿Qué punto de la recta numérica representa la fracción 4/4?", opts: ["El número 1", "El número 0", "El número 2"], ans: "El número 1", hint: "Pista: cuando numerador y denominador coinciden, señalan la unidad entera." },
    { p: "¿Entre qué enteros se ubica la fracción 5/2 en la recta numérica?", opts: ["Entre 2 y 3", "Entre 1 y 2", "Entre 3 y 4"], ans: "Entre 2 y 3", hint: "Pista: calculá cuántas veces entra el dos en el cinco." },
    { p: "¿Qué fracción con denominador 8 se ubica exactamente en la misma posición que 1/2 en la recta?", opts: ["4/8", "2/8", "6/8"], ans: "4/8", hint: "Pista: buscá la fracción reducible que coincida con la mitad." },
    { p: "¿Cuál de estas fracciones se ubica a la IZQUIERDA de 1/2 en la recta numérica?", opts: ["1/4", "3/4", "5/8"], ans: "1/4", hint: "Pista: identificá qué número representa una porción menor que la mitad." },
    { p: "¿Cuál de estas fracciones se ubica a la DERECHA de 1/2 en la recta numérica?", opts: ["3/4", "1/4", "1/8"], ans: "3/4", hint: "Pista: elegí la opción que se posicione más próxima a la unidad." },
    { p: "¿Qué fracción representa el punto medio entre 0 y 1/2 en la recta numérica?", opts: ["1/4", "1/8", "3/8"], ans: "1/4", hint: "Pista: calculá la mitad exacta de medio entero." },
    { p: "¿Entre qué enteros se ubica 11/4 en la recta numérica?", opts: ["Entre 2 y 3", "Entre 1 y 2", "Entre 3 y 4"], ans: "Entre 2 y 3", hint: "Pista: pensá cuántos cuartos hacen dos enteros y cuántos sobran." },
    { p: "¿Cuál de las siguientes fracciones es MENOR que 1?", opts: ["5/6", "7/6", "6/5"], ans: "5/6", hint: "Pista: si el numerador es menor al denominador, no alcanza la unidad." },
    { p: "¿Cuál de las siguientes fracciones es MAYOR que 1?", opts: ["8/5", "4/5", "5/8"], ans: "8/5", hint: "Pista: una fracción impropia se sitúa a la derecha del número uno." },
    { p: "¿Qué número entero equivale a la fracción 8/4 en la recta numérica?", opts: ["2", "1", "4"], ans: "2", hint: "Pista: resolvé la división entre numerador y denominador." },
    { p: "¿Qué número entero equivale a la fracción 6/2 en la recta numérica?", opts: ["3", "2", "4"], ans: "3", hint: "Pista: calculá el cociente exacto de la fracción aparente." },
    { p: "En la recta de 0 a 1 dividida en 8 partes, ¿cuántas partes avanzamos para marcar 3/8?", opts: ["3 partes", "4 partes", "5 partes"], ans: "3 partes", hint: "Pista: observá el número superior de la fracción." },
    { p: "En la recta de 0 a 1 dividida en 8 partes, ¿cuántas partes avanzamos para marcar 5/8?", opts: ["5 partes", "3 partes", "6 partes"], ans: "5 partes", hint: "Pista: el numerador indica la cantidad de saltos unitarios a recorrer." },
    { p: "¿Qué fracción está ubicada más lejos del 0: 2/3 o 1/3?", opts: ["2/3", "1/3", "Están igual"], ans: "2/3", hint: "Pista: a denominadores iguales, mayor numerador implica mayor distancia." },
    { p: "¿Qué fracción está ubicada más cerca del 1: 5/6 o 1/6?", opts: ["5/6", "1/6", "Están igual"], ans: "5/6", hint: "Pista: evaluá cuál le falta solo una porción para llegar a la unidad." },
    { p: "¿Entre qué enteros se ubica 7/3 en la recta numérica?", opts: ["Entre 2 y 3", "Entre 1 y 2", "Entre 3 y 4"], ans: "Entre 2 y 3", hint: "Pista: estimá cuántas veces entra el tres en siete." },
    { p: "¿Qué fracción se ubica exactamente en el mismo punto que 1 entero?", opts: ["5/5", "4/5", "6/5"], ans: "5/5", hint: "Pista: numerador y denominador deben ser idénticos." },
    { p: "¿Cuál de estas fracciones es más cercana a 1/2 en la recta numérica?", opts: ["4/10", "1/10", "9/10"], ans: "4/10", hint: "Pista: pensá qué decimal se aproxima más a cinco décimos." }
  ];

  const dynGenerators = [
    () => {
      const entero = randInt(1, 6);
      const r = randInt(1, 3);
      const num = entero * 4 + r;
      const ans = `Entre ${entero} y ${entero + 1}`;
      return { p: `¿Entre qué dos números enteros se ubica la fracción ${num}/4 en la recta numérica?`, ans, opts: [ans, `Entre ${entero - 1} y ${entero}`, `Entre ${entero + 1} y ${entero + 2}`], hint: `Pista: ${num}/4 equivale a ${entero} enteros y ${r}/4.` };
    },
    () => {
      const d = pickOne([2, 3, 4, 5]);
      const k = randInt(2, 7);
      const ans = `${k}`;
      return { p: `¿Qué número entero equivale exactamente a la fracción ${k * d}/${d} en la recta numérica?`, ans, opts: [ans, `${k - 1}`, `${k + 1}`], hint: `Pista: dividí el numerador ${k * d} por el denominador ${d}.` };
    },
    () => {
      const d = pickOne([5, 6, 8, 10]);
      const n = randInt(2, d - 1);
      const ans = `${n} partes`;
      return { p: `En una recta numérica de 0 a 1 dividida en ${d} partes iguales, ¿cuántas partes avanzamos desde el 0 para marcar ${n}/${d}?`, ans, opts: [ans, `${d - n} partes`, `${n + 1} partes`], hint: "Pista: el numerador indica la cantidad de divisiones que se avanzan." };
    },
    () => {
      const n = randInt(3, 9);
      const d = n + randInt(1, 4);
      const ans = "A la izquierda del 1 (es menor)";
      return { p: `¿La fracción ${n}/${d} se ubica a la izquierda o a la derecha del 1 en la recta numérica?`, ans, opts: [ans, "A la derecha del 1 (es mayor)", "Exactamente sobre el 1"], hint: "Pista: como el numerador es menor que el denominador, es menor a 1." };
    },
    () => {
      const d = randInt(2, 6);
      const n = d + randInt(1, 5);
      const ans = "A la derecha del 1 (es mayor)";
      return { p: `¿La fracción ${n}/${d} se ubica a la izquierda o a la derecha del 1 en la recta numérica?`, ans, opts: [ans, "A la izquierda del 1 (es menor)", "Exactamente sobre el 1"], hint: "Pista: como el numerador es mayor que el denominador, supera a la unidad." };
    }
  ];

  const ordItem = rotatePickOne(42019, ordenes);
  acts.push(makeOrder(`m42019-${ordItem.id}`, ordItem.prompt, ordItem.items, ordItem.hint, skills));

  const dynItems = dynGenerators.map((gen) => gen());
  const allPreguntas = [...dynItems, ...staticPreguntas];
  const seleccionadas = pickDistinctPreguntasForWorld(42019, allPreguntas, 7);
  for (let i = 0; i < 7; i++) {
    const item = seleccionadas[i];
    const choices = distinctChoices(item.ans, item.opts.filter(o => o !== item.ans), 3);
    acts.push(
      qToPick(
        q(item.p, choices.map((c) => ["📍", c]), choices.indexOf(item.ans), item.hint),
        `m42019-q-${i}`,
        "",
        skills
      )
    );
  }
  return numbered(acts);
}

// Mundo 42020: Suma y resta de fracciones de igual denominador
function buildMundo42020(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  const skills = ["m4-suma-resta-fracciones"];
  for (let i = 0; i < 8; i++) {
    const den = pickOne([4, 6, 8]);
    if (i % 2 === 0) {
      // Suma de fracciones donde la suma NO supere el entero (den - 1 como máximo)
      const a = randInt(1, Math.max(1, Math.floor(den / 2) - 1));
      const b = randInt(1, den - a - 1);
      const sumNum = a + b;
      const choices = distinctChoices(`${sumNum}/${den}`, [`${sumNum}/${den * 2}`, `${sumNum + 1}/${den}`, `${Math.max(1, sumNum - 1)}/${den}`], 3);
      const sumaEscenarios = [
        {
          pregunta: `Martín pintó ${a}/${den} de un mural escolar por la mañana y ${b}/${den} por la tarde. ¿Qué fracción del mural pintó en total?`,
          icono: "🎨",
          item: "del mural",
        },
        {
          pregunta: `En una receta se mezclan ${a}/${den} kg de harina leudante y ${b}/${den} kg de harina común. ¿Qué fracción de kilo de harina se usa en total?`,
          icono: "🥖",
          item: "de kilo",
        },
        {
          pregunta: `Lucía recorrió ${a}/${den} del sendero del bosque antes del descanso y ${b}/${den} después. ¿Qué fracción del recorrido completó?`,
          icono: "🌲",
          item: "del sendero",
        },
        {
          pregunta: `Tomás leyó ${a}/${den} de un libro el lunes y ${b}/${den} el martes. ¿Qué fracción del libro avanzó en los dos días?`,
          icono: "📖",
          item: "del libro",
        },
      ];
      const sEsc = sumaEscenarios[Math.floor(i / 2) % sumaEscenarios.length];
      acts.push(
        qToPick(
          q(
            sEsc.pregunta,
            choices.map((c) => [sEsc.icono, `${c} ${sEsc.item}`]),
            choices.indexOf(`${sumNum}/${den}`),
            "Pista: como tienen el mismo denominador, sumá solo los numeradores y mantené el denominador."
          ),
          `m42020-${i}`,
          "",
          skills
        )
      );
    } else {
      // Resta de fracciones de igual denominador
      const a = randInt(3, den - 1);
      const b = randInt(1, a - 1);
      const resNum = a - b;
      const choices = distinctChoices(`${resNum}/${den}`, [`${resNum + 1}/${den}`, `${Math.max(1, resNum - 1)}/${den}`, `${a + b}/${den}`], 3);
      const restaEscenarios = [
        {
          pregunta: `En una jarra había ${a}/${den} de litro de jugo y Sofía sirvió ${b}/${den} de litro. ¿Qué fracción de jugo quedó en la jarra?`,
          icono: "🧃",
          item: "de litro",
        },
        {
          pregunta: `Un bidón contenía ${a}/${den} de litro de agua mineral y se consumieron ${b}/${den} de litro. ¿Cuánto líquido quedó en el bidón?`,
          icono: "💧",
          item: "de litro",
        },
        {
          pregunta: `De una cinta de tela que medía ${a}/${den} de metro se cortaron ${b}/${den} de metro. ¿Qué fracción de metro de cinta sobró?`,
          icono: "✂️",
          item: "de metro",
        },
        {
          pregunta: `En una bandeja quedaban ${a}/${den} de una tarta y los amigos comieron ${b}/${den}. ¿Qué fracción de tarta quedó sin comer?`,
          icono: "🥧",
          item: "de la tarta",
        },
      ];
      const rEsc = restaEscenarios[Math.floor(i / 2) % restaEscenarios.length];
      acts.push(
        qToPick(
          q(
            rEsc.pregunta,
            choices.map((c) => [rEsc.icono, `${c} ${rEsc.item}`]),
            choices.indexOf(`${resNum}/${den}`),
            "Pista: como tienen el mismo denominador, restá los numeradores y mantené el denominador."
          ),
          `m42020-${i}`,
          "",
          skills
        )
      );
    }
  }
  return numbered(acts);
}

// Mundo 42021: Números decimales: décimos, centésimos y milésimos
function buildMundo42021(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  const skills = ["m4-decimales-dinero"];
  const usedDinero = new Set<string>();
  const usedLong = new Set<string>();

  const milesimosPreguntas = [
    { p: "¿Cómo se escribe 'cinco milésimos' en número decimal?", ans: "0,005", fakes: ["0,05", "0,5", "0,500"], hint: "Pista: los milésimos ocupan el tercer lugar después de la coma." },
    { p: "¿Cuántos milésimos se necesitan para formar 1 centésimo (0,01)?", ans: "10 milésimos", fakes: ["100 milésimos", "5 milésimos", "1000 milésimos"], hint: "Pista: cada posición decimal inmediata a la izquierda es diez veces mayor." },
    { p: "En el número decimal 3,487, ¿qué cifra ocupa el lugar de los MILÉSIMOS?", ans: "La cifra 7", fakes: ["La cifra 8", "La cifra 4", "La cifra 3"], hint: "Pista: buscá la cifra en la tercera posición a la derecha de la coma." },
    { p: "¿Cómo se escribe 'doce milésimos' en notación decimal?", ans: "0,012", fakes: ["0,12", "0,120", "1,2"], hint: "Pista: se necesitan tres posiciones decimales tras la coma." },
    { p: "¿Cuántos milésimos equivalen a 1 unidad entera?", ans: "1.000 milésimos", fakes: ["100 milésimos", "10 milésimos", "10.000 milésimos"], hint: "Pista: pensá en cuántas partes de una milésima integran la unidad completa." },
    { p: "En el número decimal 5,209, ¿qué valor posicional tiene la cifra 9?", ans: "Milésimos", fakes: ["Centésimos", "Décimos", "Unidades"], hint: "Pista: observá qué lugar ocupa contando desde la coma hacia la derecha." },
    { p: "¿Cómo se escribe 'veinticinco milésimos' en número decimal?", ans: "0,025", fakes: ["0,25", "0,250", "2,5"], hint: "Pista: los milésimos abarcan tres cifras después de la coma." },
    { p: "En el número decimal 6,158, ¿qué cifra representa los centésimos?", ans: "La cifra 5", fakes: ["La cifra 1", "La cifra 8", "La cifra 6"], hint: "Pista: buscá la segunda posición a la derecha de la coma decimal." },
    { p: "¿Qué número decimal es mayor: 0,4 o 0,395?", ans: "0,4 (equivale a 0,400)", fakes: ["0,395", "Son exactamente iguales"], hint: "Pista: compará en primer lugar los décimos de cada número." },
    { p: "¿Cuántos milésimos hay en 0,08?", ans: "80 milésimos", fakes: ["8 milésimos", "800 milésimos", "8.000 milésimos"], hint: "Pista: agregá un cero al final para expresar en milésimos equivalentes." },
    { p: "¿Cómo se lee el número decimal 0,007?", ans: "Siete milésimos", fakes: ["Siete centésimos", "Siete décimos", "Siete enteros"], hint: "Pista: la cifra se ubica en el tercer lugar decimal." },
    { p: "Si a 0,009 le sumamos 0,001, ¿qué número decimal obtenemos?", ans: "0,010 (1 centésimo)", fakes: ["0,001", "0,100", "0,019"], hint: "Pista: diez milésimos se agrupan formando un centésimo completo." }
  ];
  const milPool = shuffle([...milesimosPreguntas]);
  let milIdx = 0;

  for (let i = 0; i < 8; i++) {
    if (i % 3 === 0) {
      let pesos = randInt(5, 80);
      let centavos = pickOne([10, 20, 25, 40, 50, 60, 75, 80]);
      while (usedDinero.has(`${pesos},${centavos}`)) {
        pesos = randInt(5, 80);
        centavos = pickOne([10, 20, 25, 40, 50, 60, 75, 80]);
      }
      usedDinero.add(`${pesos},${centavos}`);
      const centStr = centavos < 10 ? "0" + centavos : String(centavos);
      const target = `$${pesos},${centStr}`;
      const fake1 = `$${pesos + 1},${centStr}`;
      const fake2 = `$${pesos},${(centavos + 20) % 100 || 80}`;
      const choices = distinctChoices(target, [fake1, fake2, `$${pesos + 2},${centStr}`], 3);
      const dinEscenarios = [
        `En el almacén de barrio, un alfajor cuesta ${pesos} pesos con ${centavos} centavos. ¿Cómo se escribe en número decimal?`,
        `En la librería escolar, un cuaderno cuesta ${pesos} pesos con ${centavos} centavos. ¿Cómo se escribe su precio decimal?`,
        `En la panadería artesanal, un pan casero cuesta ${pesos} pesos con ${centavos} centavos. ¿Cuál es su expresión decimal?`,
        `En la verdulería local, un kilo de manzanas cuesta ${pesos} pesos con ${centavos} centavos. ¿Cómo se anota en el ticket?`,
      ];
      acts.push(
        qToPick(
          q(
            dinEscenarios[i % dinEscenarios.length],
            choices.map((c) => ["🏷️", c]),
            choices.indexOf(target),
            "Pista: los centavos van después de la coma decimal como centésimos."
          ),
          `m42021-${i}`,
          "",
          skills
        )
      );
    } else if (i % 3 === 1) {
      let m = randInt(1, 5);
      let cm = pickOne([15, 20, 25, 30, 40, 50, 60, 75, 80]);
      while (usedLong.has(`${m},${cm}`)) {
        m = randInt(1, 5);
        cm = pickOne([15, 20, 25, 30, 40, 50, 60, 75, 80]);
      }
      usedLong.add(`${m},${cm}`);
      const decStr = `${m},${cm < 10 ? "0" + cm : cm} m`;
      const fake1 = `${m + 1},${cm < 10 ? "0" + cm : cm} m`;
      const fake2 = `${m},${(cm + 20) % 100 || 60} m`;
      const fake3 = `${m},0${Math.floor(cm / 10)} m`;
      const choices = distinctChoices(decStr, [fake1, fake2, fake3], 3);
      const longEscenarios = [
        `Una tabla de lenga fueguina mide ${m} metros y ${cm} centímetros de largo. ¿Cuál es su medida expresada en metros con coma decimal?`,
        `Un rollo de alambre de campo mide ${m} metros y ${cm} centímetros. ¿Cómo se escribe esa longitud en metros con coma?`,
        `Una soga para trekking mide ${m} metros y ${cm} centímetros de extensión. ¿Cuál es su medida expresada en metros decimales?`,
        `Una varilla de madera para maqueta mide ${m} metros y ${cm} centímetros. ¿Cómo se anota en metros decimales?`,
      ];
      acts.push(
        qToPick(
          q(
            longEscenarios[i % longEscenarios.length],
            choices.map((c) => ["📏", c]),
            choices.indexOf(decStr),
            "Pista: 1 metro tiene 100 centímetros, por lo que cada centímetro representa un centésimo de metro."
          ),
          `m42021-${i}`,
          "",
          skills
        )
      );
    } else {
      const milItem = milPool[milIdx++];
      const choices = distinctChoices(milItem.ans, milItem.fakes, 3);
      acts.push(
        qToPick(
          q(milItem.p, choices.map((c) => ["🔬", c]), choices.indexOf(milItem.ans), milItem.hint),
          `m42021-${i}`,
          "",
          skills
        )
      );
    }
  }
  return numbered(acts);
}

// Mundo 42022: Decimales multiplicados y divididos por 10, 100 y 1.000
function buildMundo42022(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  const skills = ["m4-decimales-mult-div"];
  for (let i = 0; i < 8; i++) {
    if (i % 3 === 0) {
      // Multiplicación por 10 o 100
      const entero = randInt(2, 8);
      const dec = randInt(1, 9);
      const factor = pickOne([10, 100]);
      const valStr = `${entero},${dec}`;
      const numVal = entero + dec / 10;
      const res = Math.round(numVal * factor * 10) / 10;
      const resStr = decimalAR(res, 2);
      const fake1 = decimalAR(res / 10, 2);
      const fake2 = decimalAR(res * 10, 2);
      const choices = distinctChoices(resStr, [fake1, fake2, decimalAR(res + 5, 2)], 3);
      const multPrompts = [
        `¿Cuánto da el cálculo ${valStr} × ${factor}?`,
        `Al multiplicar ${valStr} por ${factor}, ¿cuál es el resultado?`,
        `¿Qué valor resulta de la multiplicación ${valStr} × ${factor}?`,
      ];
      const prText = multPrompts[Math.floor(i / 3) % multPrompts.length];
      acts.push(
        qToPick(
          q(
            prText,
            choices.map((c) => ["🧮", c]),
            choices.indexOf(resStr),
            `Pista: al multiplicar por ${factor}, la coma corre ${factor === 10 ? "un lugar" : "dos lugares"} hacia la derecha.`
          ),
          `m42022-${i}`,
          "",
          skills
        )
      );
    } else if (i % 3 === 1) {
      // Multiplicación por 1.000
      const entero = randInt(1, 5);
      const dec = randInt(1, 9);
      const valStr = `${entero},${dec}`;
      const numVal = entero + dec / 10;
      const res = Math.round(numVal * 1000);
      const resStr = res.toLocaleString("es-AR");
      const fake1 = (res / 10).toLocaleString("es-AR");
      const fake2 = (res * 10).toLocaleString("es-AR");
      const choices = distinctChoices(resStr, [fake1, fake2, (res + 100).toLocaleString("es-AR")], 3);
      const milPrompts = [
        `¿Cuánto da el cálculo ${valStr} × 1.000?`,
        `Al resolver ${valStr} × 1.000, ¿cuál es el resultado obtenido?`,
        `¿Qué número se obtiene al multiplicar ${valStr} por 1.000?`,
      ];
      const prText = milPrompts[Math.floor(i / 3) % milPrompts.length];
      acts.push(
        qToPick(
          q(
            prText,
            choices.map((c) => ["🔢", c]),
            choices.indexOf(resStr),
            "Pista: al multiplicar por 1.000, la coma corre tres lugares a la derecha (agregando ceros si hace falta)."
          ),
          `m42022-${i}`,
          "",
          skills
        )
      );
    } else {
      // División por 10 o 100
      const dividendo = pickOne([35, 48, 72, 125, 250]);
      const factor = pickOne([10, 100]);
      const res = dividendo / factor;
      const resStr = decimalAR(res, 2);
      const fake1 = decimalAR(res * 10, 2);
      const fake2 = decimalAR(res / 10, 3);
      const choices = distinctChoices(resStr, [fake1, fake2, decimalAR(res + 1, 2)], 3);
      const divPrompts = [
        `Si se divide ${dividendo} por ${factor}, ¿cuál es el resultado decimal?`,
        `Al dividir ${dividendo} entre ${factor}, ¿qué cociente decimal se obtiene?`,
      ];
      const prText = divPrompts[Math.floor(i / 3) % divPrompts.length];
      acts.push(
        qToPick(
          q(
            prText,
            choices.map((c) => ["➗", c]),
            choices.indexOf(resStr),
            `Pista: al dividir por ${factor}, la coma corre ${factor === 10 ? "un lugar" : "dos lugares"} hacia la izquierda.`
          ),
          `m42022-${i}`,
          "",
          skills
        )
      );
    }
  }
  return numbered(acts);
}

// Mundo 42023: Suma y resta de números decimales cotidianos
function buildMundo42023(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  const skills = ["m4-suma-resta-decimales"];

  const sumaEscenarios = [
    (p1: number, p2: number) => ({
      txt: `En la librería escolar, Lucía compró un cuaderno a $${pesosAR(p1)} y una cartuchera a $${pesosAR(p2)}. ¿Cuánto gastó en total?`,
      ico: "🧾",
    }),
    (p1: number, p2: number) => ({
      txt: `En la panadería del barrio, Martín compró pan por $${pesosAR(p1)} y medialunas por $${pesosAR(p2)}. ¿Cuánto pagó en total?`,
      ico: "🥖",
    }),
    (p1: number, p2: number) => ({
      txt: `En la verdulería, Sofía compró papas a $${pesosAR(p1)} y manzanas a $${pesosAR(p2)}. ¿Cuál fue el gasto total?`,
      ico: "🍎",
    }),
    (p1: number, p2: number) => ({
      txt: `En la farmacia, Julián compró alcohol en gel a $${pesosAR(p1)} y apósitos a $${pesosAR(p2)}. ¿Cuánto abonó en total?`,
      ico: "🩹",
    }),
  ];

  const restaEscenarios = [
    (gasto: number, billete: number) => ({
      txt: `En el quiosco, Joaquín hizo una compra por $${pesosAR(gasto)} y pagó con un billete de $${pesosAR(billete)}. ¿Cuánto dinero le dieron de vuelto?`,
      ico: "💵",
    }),
    (gasto: number, billete: number) => ({
      txt: `En la fiambrería, Camila pagó una compra de $${pesosAR(gasto)} con un billete de $${pesosAR(billete)}. ¿Cuánto recibió de cambio?`,
      ico: "🧀",
    }),
    (gasto: number, billete: number) => ({
      txt: `En la feria de artesanos, Mateo compró un recuerdo por $${pesosAR(gasto)} y entregó un billete de $${pesosAR(billete)}. ¿Cuánto le devolvieron?`,
      ico: "🏺",
    }),
    (gasto: number, billete: number) => ({
      txt: `En el supermercado, Valentina gastó $${pesosAR(gasto)} y abonó con un billete de $${pesosAR(billete)}. ¿Cuál es el vuelto correcto?`,
      ico: "🛒",
    }),
  ];

  const usedValues = new Set<number>();

  for (let i = 0; i < 8; i++) {
    if (i % 2 === 0) {
      // Suma de decimales
      let p1 = randInt(12, 35) * 10 + pickOne([5, 2.5, 7.5]);
      let p2 = randInt(8, 20) * 10 + pickOne([5, 2.5, 7.5]);
      while (usedValues.has(p1) || usedValues.has(p2)) {
        p1 = randInt(12, 35) * 10 + pickOne([5, 2.5, 7.5]);
        p2 = randInt(8, 20) * 10 + pickOne([5, 2.5, 7.5]);
      }
      usedValues.add(p1);
      usedValues.add(p2);

      const total = p1 + p2;
      const totalStr = `$${pesosAR(total)}`;
      const fake1 = `$${pesosAR(total + 10)}`;
      const fake2 = `$${pesosAR(total - 10)}`;
      const choices = distinctChoices(totalStr, [fake1, fake2, `$${pesosAR(total + 5)}`], 3);
      const sc = sumaEscenarios[Math.floor(i / 2) % sumaEscenarios.length](p1, p2);

      acts.push(
        qToPick(
          q(
            sc.txt,
            choices.map((c) => [sc.ico, c]),
            choices.indexOf(totalStr),
            "Pista: sumá alineando las comas decimales."
          ),
          `m42023-${i}`,
          "",
          skills
        )
      );
    } else {
      // Resta de decimales (vuelto cotidiano)
      const billete = pickOne([500, 1000, 2000]);
      let gasto = randInt(Math.floor(billete * 0.3 / 10), Math.floor(billete * 0.8 / 10)) * 10 + pickOne([5, 2.5, 7.5]);
      while (usedValues.has(gasto)) {
        gasto = randInt(Math.floor(billete * 0.3 / 10), Math.floor(billete * 0.8 / 10)) * 10 + pickOne([5, 2.5, 7.5]);
      }
      usedValues.add(gasto);

      const vuelto = billete - gasto;
      const vueltoStr = `$${decimalAR(vuelto, 2)}`;
      const fake1 = `$${decimalAR(vuelto + 10, 2)}`;
      const fake2 = `$${decimalAR(vuelto - 10, 2)}`;
      const choices = distinctChoices(vueltoStr, [fake1, fake2, `$${decimalAR(vuelto + 5, 2)}`], 3);
      const sc = restaEscenarios[Math.floor(i / 2) % restaEscenarios.length](gasto, billete);

      acts.push(
        qToPick(
          q(
            sc.txt,
            choices.map((c) => [sc.ico, c]),
            choices.indexOf(vueltoStr),
            `Pista: restá el gasto al billete ($${pesosAR(billete)},00 - $${pesosAR(gasto)}).`
          ),
          `m42023-${i}`,
          "",
          skills
        )
      );
    }
  }
  return numbered(acts);
}

// ==========================================================================
// MÓDULO 4: GEOMETRÍA, MEDIDA Y ESTADÍSTICA (42024 - 42028)
// ==========================================================================

// Mundo 42024: Rectas paralelas, secantes y perpendiculares (VARIEDAD: NUNCA LA MISMA PREGUNTA REPETIDA)
function buildMundo42024(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  const skills = ["m4-rectas-angulos-rectos"];

  const clasificaciones = [
    makeClassify(
      "m42024-cla-1",
      "Clasificá las relaciones entre pares de rectas según su posición:",
      ["Paralelas (no se cortan)", "Perpendiculares (se cortan en 90°)"],
      [
        { label: "Vías de un tren en un tramo recto", cat: 0 },
        { label: "Bordes opuestos de una regla", cat: 0 },
        { label: "Líneas de los renglones de una hoja", cat: 0 },
        { label: "Esquina donde se unen dos paredes", cat: 1 },
        { label: "Cruce de calles en ángulo recto", cat: 1 },
        { label: "Dos lados consecutivos de una hoja de papel", cat: 1 },
      ],
      "Pista: las perpendiculares forman cuatro ángulos rectos de 90°.",
      skills
    ),
    makeClassify(
      "m42024-cla-2",
      "Clasificá los tipos de rectas secantes:",
      ["Secantes perpendiculares", "Secantes oblicuas"],
      [
        { label: "Cruce en cruz perfecta con cuatro ángulos rectos", cat: 0 },
        { label: "Lados adyacentes de un marco de ventana", cat: 0 },
        { label: "Cruce en X inclinada con ángulos desiguales", cat: 1 },
        { label: "Tijera abierta formando ángulos agudos y obtusos", cat: 1 },
      ],
      "Pista: las perpendiculares forman 90°, las oblicuas no.",
      skills
    ),
    makeClassify(
      "m42024-cla-3",
      "Clasificá los elementos cotidianos según el tipo de líneas que muestran:",
      ["Líneas paralelas", "Líneas perpendiculares"],
      [
        { label: "Peldaños sucesivos de una escalera", cat: 0 },
        { label: "Cables paralelos del tendido eléctrico", cat: 0 },
        { label: "Marco superior y lateral de una puerta", cat: 1 },
        { label: "Poste de luz clavado recto sobre la vereda", cat: 1 },
      ],
      "Pista: las paralelas mantienen siempre la misma distancia.",
      skills
    )
  ];

  const staticPreguntas = [
    { p: "¿Cómo se llaman dos rectas que, por más que se prolonguen en el plano, nunca se cruzan ni se tocan?", ans: "Rectas paralelas", fakes: ["Rectas perpendiculares", "Rectas secantes oblicuas"], hint: "Pista: mantienen una distancia constante sin intersectarse." },
    { p: "¿Cómo se llaman dos rectas que al cruzarse forman cuatro ángulos rectos de 90° exactos?", ans: "Rectas perpendiculares", fakes: ["Rectas paralelas", "Rectas secantes oblicuas"], hint: "Pista: generan una intersección en cruz perfecta de escuadra." },
    { p: "¿Cómo se llaman dos rectas que se cortan en un punto pero NO forman ángulos rectos de 90°?", ans: "Rectas secantes oblicuas", fakes: ["Rectas perpendiculares", "Rectas paralelas"], hint: "Pista: se intersecan de modo inclinado con ángulos no rectos." },
    { p: "¿Qué instrumento de geometría es el más adecuado para trazar y verificar ángulos rectos entre rectas perpendiculares?", ans: "La escuadra", fakes: ["El compás", "La cinta métrica"], hint: "Pista: esta herramienta posee un vértice recto de referencia." },
    { p: "Los bordes opuestos de una ventana rectangular son un ejemplo de:", ans: "Líneas paralelas", fakes: ["Líneas perpendiculares", "Líneas curvas"], hint: "Pista: corren a la misma distancia sin llegar a tocarse." },
    { p: "El marco de un cuadro en la unión de su lado superior con el lado lateral forma:", ans: "Ángulo recto de 90°", fakes: ["Ángulo agudo de 45°", "Ángulo obtuso de 135°"], hint: "Pista: dos lados contiguos de un rectángulo se unen en esa abertura." },
    { p: "Si dos rectas en un mapa se cortan formando una 'X' inclinada, ¿qué tipo de rectas son?", ans: "Secantes oblicuas", fakes: ["Paralelas", "Perpendiculares"], hint: "Pista: se cruzan pero ninguna de sus aberturas mide noventa grados." },
    { p: "Los dos rieles de una vía de tren en una recta son un ejemplo claro de:", ans: "Rectas paralelas", fakes: ["Rectas perpendiculares", "Rectas secantes"], hint: "Pista: avanzan en el mismo sentido sin juntarse jamás." },
    { p: "La línea del zócalo y la línea del techo en una misma pared representan:", ans: "Rectas paralelas", fakes: ["Rectas perpendiculares", "Rectas oblicuas"], hint: "Pista: son trazos horizontales que no tienen puntos en común." },
    { p: "En una hoja cuadriculada, una línea vertical y una línea horizontal que se cruzan forman:", ans: "Rectas perpendiculares", fakes: ["Rectas paralelas", "Rectas secantes oblicuas"], hint: "Pista: la cuadrícula se estructura con esquinas de noventa grados." },
    { p: "Si dos rectas se cortan en un único punto, se dice que son:", ans: "Rectas secantes", fakes: ["Rectas paralelas", "Rectas curvas"], hint: "Pista: comparten un punto de intersección en el plano." },
    { p: "¿Cuántos ángulos rectos se forman cuando dos rectas son perpendiculares?", ans: "4 ángulos rectos", fakes: ["2 ángulos rectos", "1 ángulo recto"], hint: "Pista: pensá en las cuatro regiones creadas por la cruz." },
    { p: "Las líneas de las rayas de un paso de peatones (senda peatonal) son entre sí:", ans: "Paralelas", fakes: ["Perpendiculares", "Secantes oblicuas"], hint: "Pista: todas conservan la misma orientación sin tocarse." },
    { p: "Los lados opuestos de un rectángulo son siempre:", ans: "Paralelos e iguales", fakes: ["Perpendiculares", "Secantes oblicuos"], hint: "Pista: están enfrentados y conservan idéntica separación." },
    { p: "Los lados adyacentes de un cuadrado forman entre sí:", ans: "Rectas perpendiculares", fakes: ["Rectas paralelas", "Rectas oblicuas"], hint: "Pista: en cada vértice del polígono regular se produce una esquina de noventa." },
    { p: "Si dos rectas tienen distinta inclinación y no son paralelas, en el plano:", ans: "Se cortan en un punto", fakes: ["Nunca se cruzan", "Se vuelven curvas"], hint: "Pista: al prolongarse en la superficie plana se van a cruzar." },
    { p: "Para trazar dos rectas paralelas prolijas con regla y escuadra se suele:", ans: "Deslizar la escuadra sobre el borde de la regla", fakes: ["Usar únicamente el compás con punta seca", "Girar la regla en círculos"], hint: "Pista: se fija un instrumento de apoyo y se traslada el otro." },
    { p: "¿Qué clase de ángulo mide MENOS de 90°?", ans: "Ángulo agudo", fakes: ["Ángulo obtuso", "Ángulo recto"], hint: "Pista: es una abertura más cerrada que la de una escuadra." },
    { p: "¿Qué clase de ángulo mide MÁS de 90° y menos de 180°?", ans: "Ángulo obtuso", fakes: ["Ángulo agudo", "Ángulo recto"], hint: "Pista: es una abertura más abierta que la esquina recta." },
    { p: "Dos rectas paralelas se prolongan infinitamente en ambas direcciones. ¿Cuántos puntos de cruce tienen?", ans: "0 puntos", fakes: ["1 punto", "Infinitos puntos"], hint: "Pista: por definición geométrica nunca llegan a intersectarse." },
    { p: "Los renglones sucesivos de un cuaderno de caligrafía son ejemplos de:", ans: "Líneas paralelas", fakes: ["Líneas perpendiculares", "Líneas secantes"], hint: "Pista: guardan una distancia constante para permitir la escritura prolija." },
    { p: "La intersección de la pared y el piso en una habitación forma:", ans: "Una recta perpendicular al zócalo", fakes: ["Una línea paralela al techo", "Una línea curva"], hint: "Pista: el plano vertical y el horizontal se encuentran en ángulo recto." },
    { p: "Las dos diagonales de un cuadrado se cruzan en el centro formando:", ans: "Ángulos rectos de 90°", fakes: ["Ángulos de 45° únicamente", "Ángulos llanos de 180°"], hint: "Pista: en esa figura regular el cruce central es perfectamente perpendicular." },
    { p: "¿Qué figura tiene cuatro lados perpendiculares dos a dos formando cuatro esquinas de 90°?", ans: "El rectángulo", fakes: ["El triángulo escaleno", "El círculo"], hint: "Pista: sus cuatro esquinas interiores son de noventa grados." },
    { p: "Si doblamos una hoja de papel por la mitad y luego otra vez por la mitad cruzada, los dos pliegues son:", ans: "Perpendiculares", fakes: ["Paralelos", "Oblicuos"], hint: "Pista: los dos dobleces se cruzan en el centro formando una cruz exacta." },
    { p: "La trayectoria de dos autos que van por carriles contiguos en una avenida recta es:", ans: "Paralela", fakes: ["Perpendicular", "Secante"], hint: "Pista: circulan en la misma dirección sin cruzarse en el trayecto." }
  ];

  const dynGenerators = [
    () => {
      const hora = pickOne([3, 9]);
      const ans = "Rectas perpendiculares (90°)";
      return { p: `La aguja horaria y el minutero de un reloj a las ${hora}:00 en punto forman:`, ans, fakes: ["Rectas paralelas", "Rectas secantes oblicuas"], hint: "Pista: forman una esquina en escuadra recta." };
    },
    () => {
      const hora = pickOne([1, 2, 10, 11]);
      const ans = "Ángulo agudo (menor a 90°)";
      return { p: `Las agujas del reloj a las ${hora}:00 marcan una abertura que corresponde a:`, ans, fakes: ["Ángulo obtuso (mayor a 90°)", "Ángulo recto de 90°"], hint: "Pista: la abertura es menor a un cuarto de vuelta." };
    },
    () => {
      const hora = pickOne([4, 5, 7, 8]);
      const ans = "Ángulo obtuso (mayor a 90°)";
      return { p: `Las agujas del reloj a las ${hora}:00 marcan una abertura que corresponde a:`, ans, fakes: ["Ángulo agudo (menor a 90°)", "Ángulo recto de 90°"], hint: "Pista: la abertura es más abierta que una escuadra." };
    },
    () => {
      const hora = 6;
      const ans = "Rectas que forman un ángulo llano (180°)";
      return { p: `Las agujas del reloj exactamente a las ${hora}:00 en punto forman:`, ans, fakes: ["Rectas perpendiculares (90°)", "Rectas paralelas"], hint: "Pista: quedan completamente alineadas en línea recta opuesta." };
    },
    () => {
      const calle1 = pickOne(["San Martín", "Roca", "Mitre", "Belgrano"]);
      const calle2 = pickOne(["Rivadavia", "Moreno", "Sarmiento", "Urquiza"]);
      const ans = "Perpendiculares entre sí";
      return { p: `En el trazado en damero de una ciudad, la calle ${calle1} y la calle transversal ${calle2} se cruzan en ángulo recto. Son rectas:`, ans, fakes: ["Paralelas entre sí", "Secantes oblicuas"], hint: "Pista: el cruce en ángulo recto define esa relación." };
    }
  ];

  acts.push(rotatePickOne(42024, clasificaciones));
  const dynItems = dynGenerators.map((gen) => gen());
  const allPreguntas = [...dynItems, ...staticPreguntas];
  const seleccionadas = pickDistinctPreguntasForWorld(42024, allPreguntas, 7);
  for (let i = 0; i < 7; i++) {
    const item = seleccionadas[i];
    const choices = distinctChoices(item.ans, item.fakes, 3);
    acts.push(
      qToPick(
        q(item.p, choices.map((c) => ["📐", c]), choices.indexOf(item.ans), item.hint),
        `m42024-q-${i}`,
        "",
        skills
      )
    );
  }
  return numbered(acts);
}

// Mundo 42025: Ángulos y uso del transportador
function buildMundo42025(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  const skills = ["m4-angulos-transportador"];

  const clasificaciones = [
    makeClassify(
      "m42025-cla-1",
      "Clasificá los ángulos según su abertura respecto al ángulo recto (90°):",
      ["Agudos (menores a 90°)", "Obtusos (mayores a 90°)"],
      [
        { label: "Ángulo de 30°", cat: 0 },
        { label: "Ángulo de 45°", cat: 0 },
        { label: "Ángulo de 70°", cat: 0 },
        { label: "Ángulo de 110°", cat: 1 },
        { label: "Ángulo de 135°", cat: 1 },
        { label: "Ángulo de 160°", cat: 1 },
      ],
      "Pista: agudo es más cerrado que una escuadra, obtuso es más abierto.",
      skills
    ),
    makeClassify(
      "m42025-cla-2",
      "Clasificá estos ángulos especiales según su medida exacta:",
      ["Ángulos rectos (90°)", "Ángulos llanos (180°)"],
      [
        { label: "Esquina cuadrada de un libro", cat: 0 },
        { label: "Agujas del reloj a las 3:00 en punto", cat: 0 },
        { label: "Cruce perpendicular de dos ejes", cat: 0 },
        { label: "Línea recta continua abierta", cat: 1 },
        { label: "Agujas del reloj a las 6:00 en punto", cat: 1 },
        { label: "Media vuelta completa de un compás", cat: 1 },
      ],
      "Pista: el recto forma una L perfecta y el llano una línea continua.",
      skills
    ),
    makeClassify(
      "m42025-cla-3",
      "Clasificá los ángulos según su grado de abertura:",
      ["Menores a 90°", "Mayores a 90°"],
      [
        { label: "Ángulo de 15°", cat: 0 },
        { label: "Ángulo de 60°", cat: 0 },
        { label: "Ángulo de 80°", cat: 0 },
        { label: "Ángulo de 105°", cat: 1 },
        { label: "Ángulo de 125°", cat: 1 },
        { label: "Ángulo de 170°", cat: 1 },
      ],
      "Pista: compará cada número con el valor de referencia noventa.",
      skills
    ),
    makeClassify(
      "m42025-cla-4",
      "Clasificá los ángulos según correspondan a esquina recta o inclinada:",
      ["Ángulo recto de 90°", "Ángulo agudo menor a 90°"],
      [
        { label: "Esquina de una mesa rectangular", cat: 0 },
        { label: "Cruce de un poste y el piso nivelado", cat: 0 },
        { label: "Punta afilada de una porción de pizza", cat: 1 },
        { label: "Abertura cerrada de una tijera", cat: 1 },
      ],
      "Pista: el ángulo recto mide exactamente noventa.",
      skills
    ),
    makeClassify(
      "m42025-cla-5",
      "Clasificá las aberturas observadas en la vida cotidiana:",
      ["Ángulo obtuso (abierto)", "Ángulo agudo (cerrado)"],
      [
        { label: "Techo a dos aguas muy extendido", cat: 0 },
        { label: "Puerta entreabierta más allá de 90°", cat: 0 },
        { label: "Punta de un lápiz recién afilado", cat: 1 },
        { label: "Rampa empinada con el suelo", cat: 1 },
      ],
      "Pista: observá si la abertura es más amplia o más cerrada que la escuadra.",
      skills
    ),
    makeClassify(
      "m42025-cla-6",
      "Clasificá los ángulos según su medida en grados:",
      ["Ángulos agudos", "Ángulos llanos (180°)"],
      [
        { label: "Ángulo de 20°", cat: 0 },
        { label: "Ángulo de 55°", cat: 0 },
        { label: "Línea del horizonte plano", cat: 1 },
        { label: "Regla extendida de 180°", cat: 1 },
      ],
      "Pista: el ángulo llano mide ciento ochenta grados.",
      skills
    )
  ];

  const angulos = [
    { p: "Si al medir con el transportador la abertura de una figura encontramos exactamente 90°, ¿qué clase de ángulo es?", ans: "Ángulo recto", fakes: ["Ángulo agudo", "Ángulo obtuso"], hint: "Pista: corresponde a la esquina cuadrada exacta de una escuadra." },
    { p: "Si al medir con el transportador encontramos 45°, ¿qué clase de ángulo es?", ans: "Ángulo agudo", fakes: ["Ángulo recto", "Ángulo obtuso"], hint: "Pista: su abertura es menor al valor de noventa grados." },
    { p: "Si al medir con el transportador encontramos 120°, ¿qué clase de ángulo es?", ans: "Ángulo obtuso", fakes: ["Ángulo agudo", "Ángulo recto"], hint: "Pista: su abertura supera el ángulo de una esquina recta." },
    { p: "Si al medir con el transportador encontramos exactamente 180°, ¿qué clase de ángulo es?", ans: "Ángulo llano", fakes: ["Ángulo recto", "Ángulo agudo"], hint: "Pista: equivale a dos ángulos rectos alineados en línea recta." },
    { p: "Si al medir con el transportador encontramos 60°, ¿qué clase de ángulo es?", ans: "Ángulo agudo", fakes: ["Ángulo obtuso", "Ángulo llano"], hint: "Pista: mide menos de noventa grados." },
    { p: "Si al medir con el transportador encontramos 135°, ¿qué clase de ángulo es?", ans: "Ángulo obtuso", fakes: ["Ángulo agudo", "Ángulo recto"], hint: "Pista: es más abierto que la esquina recta." },
    { p: "Si al medir con el transportador encontramos 25°, ¿qué clase de ángulo es?", ans: "Ángulo agudo", fakes: ["Ángulo obtuso", "Ángulo recto"], hint: "Pista: es una abertura muy cerrada menor a noventa." },
    { p: "Si al medir con el transportador encontramos 110°, ¿qué clase de ángulo es?", ans: "Ángulo obtuso", fakes: ["Ángulo agudo", "Ángulo llano"], hint: "Pista: sobrepasa la amplitud de una escuadra recta." },
    { p: "Si al medir con el transportador encontramos 15°, ¿qué clase de ángulo es?", ans: "Ángulo agudo", fakes: ["Ángulo obtuso", "Ángulo recto"], hint: "Pista: su medida está bastante por debajo de noventa grados." },
    { p: "Si al medir con el transportador encontramos 150°, ¿qué clase de ángulo es?", ans: "Ángulo obtuso", fakes: ["Ángulo agudo", "Ángulo recto"], hint: "Pista: su medida se encuentra entre noventa y ciento ochenta grados." },
    { p: "Si al medir con el transportador encontramos 75°, ¿qué clase de ángulo es?", ans: "Ángulo agudo", fakes: ["Ángulo obtuso", "Ángulo llano"], hint: "Pista: no alcanza los noventa grados." },
    { p: "Si al medir con el transportador encontramos 100°, ¿qué clase de ángulo es?", ans: "Ángulo obtuso", fakes: ["Ángulo agudo", "Ángulo recto"], hint: "Pista: supera apenas los noventa grados de referencia." },
    { p: "Si al medir con el transportador encontramos 30°, ¿qué clase de ángulo es?", ans: "Ángulo agudo", fakes: ["Ángulo obtuso", "Ángulo recto"], hint: "Pista: mide un tercio del ángulo de noventa grados." },
    { p: "Si al medir con el transportador encontramos 165°, ¿qué clase de ángulo es?", ans: "Ángulo obtuso", fakes: ["Ángulo agudo", "Ángulo recto"], hint: "Pista: está muy abierto, cerca del ángulo de línea continua." },
    { p: "Si al medir con el transportador encontramos 85°, ¿qué clase de ángulo es?", ans: "Ángulo agudo", fakes: ["Ángulo obtuso", "Ángulo recto"], hint: "Pista: está apenas por debajo del ángulo recto." },
    { p: "Si al medir con el transportador encontramos 95°, ¿qué clase de ángulo es?", ans: "Ángulo obtuso", fakes: ["Ángulo agudo", "Ángulo recto"], hint: "Pista: apenas supera el ángulo recto." },
    { p: "¿Qué instrumento de geometría se utiliza para medir la amplitud de los ángulos en grados?", ans: "El transportador", fakes: ["El compás", "La cinta métrica"], hint: "Pista: tiene forma semicircular con una escala numerada de cero a ciento ochenta." },
    { p: "El ángulo que mide exactamente 90° se denomina:", ans: "Ángulo recto", fakes: ["Ángulo agudo", "Ángulo llano"], hint: "Pista: es la referencia fundamental de las esquinas perpendiculares." },
    { p: "Un ángulo llano equivale exactamente a la suma de:", ans: "Dos ángulos rectos (180°)", fakes: ["Tres ángulos rectos", "Un ángulo agudo y uno recto"], hint: "Pista: calculá la suma de noventa más noventa." },
    { p: "La mitad exacta de un ángulo recto de 90° mide:", ans: "45°", fakes: ["30°", "60°"], hint: "Pista: dividí noventa por dos." },
    { p: "Al abrir una tijera formando una abertura más chica que una escuadra, se obtiene un:", ans: "Ángulo agudo", fakes: ["Ángulo obtuso", "Ángulo llano"], hint: "Pista: su amplitud no llega a noventa grados." },
    { p: "Una esquina prolija de una hoja doblada al medio y vuelta a doblar forma un ángulo de:", ans: "90°", fakes: ["45°", "180°"], hint: "Pista: el doblez en cruz genera cuadrantes rectos." },
    { p: "¿Cuántos grados mide un giro o vuelta completa alrededor de un punto?", ans: "360°", fakes: ["180°", "90°"], hint: "Pista: es el doble del recorrido de un ángulo llano." },
    { p: "¿Cómo se llama el punto donde se unen las dos semirrectas que forman un ángulo?", ans: "Vértice", fakes: ["Arista", "Centro"], hint: "Pista: es la esquina de unión de los lados del ángulo." },
    { p: "Las dos semirrectas que delimitan y forman un ángulo se denominan:", ans: "Lados del ángulo", fakes: ["Bases", "Alturas"], hint: "Pista: son las líneas que parten desde el punto común." },
    { p: "¿En qué unidad de medida se expresa convencionalmente la amplitud de un ángulo?", ans: "En grados (°)", fakes: ["En centímetros", "En gramos"], hint: "Pista: se indica con un pequeño círculo como superíndice." },
    { p: "Si sumamos dos ángulos de 45°, ¿qué clase de ángulo se forma?", ans: "Un ángulo recto de 90°", fakes: ["Un ángulo obtuso", "Un ángulo llano"], hint: "Pista: sumá cuarenta y cinco más cuarenta y cinco." },
    { p: "Si sumamos dos ángulos rectos de 90°, ¿qué figura angular obtenemos?", ans: "Un ángulo llano de 180°", fakes: ["Un ángulo de 360°", "Un ángulo agudo"], hint: "Pista: forman una línea recta continua." },
    { p: "¿Qué clase de ángulo forman las agujas de un reloj exactamente a las 6:00?", ans: "Ángulo llano de 180°", fakes: ["Ángulo recto", "Ángulo agudo"], hint: "Pista: la aguja apunta al doce y la otra hacia abajo al seis." },
    { p: "¿Qué clase de ángulo forman las agujas de un reloj exactamente a las 3:00?", ans: "Ángulo recto de 90°", fakes: ["Ángulo obtuso", "Ángulo llano"], hint: "Pista: el doce y el tres forman una esquina en escuadra." },
    { p: "¿Qué clase de ángulo forman las agujas de un reloj a las 2:00?", ans: "Ángulo agudo", fakes: ["Ángulo obtuso", "Ángulo recto"], hint: "Pista: su separación es menor a la de las tres en punto." },
    { p: "¿Qué clase de ángulo forman las agujas de un reloj a las 5:00?", ans: "Ángulo obtuso", fakes: ["Ángulo agudo", "Ángulo recto"], hint: "Pista: su separación supera la de una esquina recta." }
  ];

  acts.push(rotatePickOne(42025, clasificaciones));
  const seleccionados = pickDistinctPreguntasForWorld(42025, angulos, 7);
  for (let i = 0; i < 7; i++) {
    const item = seleccionados[i];
    const choices = distinctChoices(item.ans, item.fakes, 3);
    acts.push(
      qToPick(
        q(item.p, choices.map((c) => ["🧭", c]), choices.indexOf(item.ans), item.hint),
        `m42025-q-${i}`,
        "",
        skills
      )
    );
  }
  return numbered(acts);
}

// Mundo 42026: Triángulos: clasificación por lados y ángulos (VARIEDAD: NUNCA EL MISMO BANDERÍN REPETIDO)
function buildMundo42026(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  const skills = ["m4-triangulos"];

  const clasificaciones = [
    makeClassify(
      "m42026-cla-1",
      "Clasificá los triángulos según la longitud de sus tres lados:",
      ["Equilátero (3 lados iguales)", "Escaleno (3 lados distintos)"],
      [
        { label: "Triángulo con lados de 6 cm, 6 cm y 6 cm", cat: 0 },
        { label: "Triángulo con lados de 10 cm, 10 cm y 10 cm", cat: 0 },
        { label: "Triángulo con lados de 4 cm, 5 cm y 6 cm", cat: 1 },
        { label: "Triángulo con lados de 3 cm, 7 cm y 9 cm", cat: 1 },
      ],
      "Pista: equilátero tiene los tres lados de igual medida; escaleno tiene los tres lados distintos.",
      skills
    ),
    makeClassify(
      "m42026-cla-2",
      "Clasificá los triángulos según sus ángulos interiores:",
      ["Triángulo rectángulo (un ángulo recto)", "Triángulo acutángulo (tres agudos)"],
      [
        { label: "Triángulo con un ángulo de 90° y dos de 45°", cat: 0 },
        { label: "Escuadra clásica con esquina en escuadra", cat: 0 },
        { label: "Triángulo con tres ángulos de 60°", cat: 1 },
        { label: "Triángulo con ángulos de 50°, 60° y 70°", cat: 1 },
      ],
      "Pista: el rectángulo tiene una esquina de 90°, el acutángulo tiene todos menores a 90°.",
      skills
    ),
    makeClassify(
      "m42026-cla-3",
      "Clasificá los triángulos según la cantidad de lados iguales:",
      ["Isósceles (al menos 2 lados iguales)", "Escaleno (ningún lado igual)"],
      [
        { label: "Banderín con dos lados de 20 cm y uno de 10 cm", cat: 0 },
        { label: "Triángulo con lados de 8 cm, 8 cm y 12 cm", cat: 0 },
        { label: "Triángulo con lados de 5 cm, 7 cm y 9 cm", cat: 1 },
        { label: "Triángulo con lados de 6 cm, 10 cm y 14 cm", cat: 1 },
      ],
      "Pista: isósceles tiene un par de lados de igual longitud.",
      skills
    )
  ];

  const staticPreguntas = [
    { p: "Un banderín de campamento tiene dos lados de 25 cm y un lado de 15 cm. ¿Cómo se clasifica por sus LADOS?", ans: "Triángulo isósceles", fakes: ["Triángulo equilátero", "Triángulo escaleno"], hint: "Pista: fijate que posee exactamente dos lados con idéntica medida." },
    { p: "Una señal de tránsito triangular de 'Ceda el paso' tiene sus tres lados de 60 cm cada uno. ¿Cómo se clasifica por sus LADOS?", ans: "Triángulo equilátero", fakes: ["Triángulo isósceles", "Triángulo escaleno"], hint: "Pista: observá que las tres dimensiones son idénticas." },
    { p: "Un triángulo tiene un ángulo recto de 90°. ¿Cómo se clasifica según sus ÁNGULOS?", ans: "Triángulo rectángulo", fakes: ["Triángulo acutángulo", "Triángulo obtusángulo"], hint: "Pista: su denominación proviene de la presencia del ángulo de esquina recta." },
    { p: "Si los tres ángulos interiores de un triángulo son menores a 90° (agudos), ¿cómo se clasifica según sus ÁNGULOS?", ans: "Triángulo acutángulo", fakes: ["Triángulo rectángulo", "Triángulo obtusángulo"], hint: "Pista: el prefijo alude a que todas sus aberturas son agudas." },
    { p: "Un triángulo tiene un ángulo de 120° (obtuso). ¿Cómo se clasifica según sus ÁNGULOS?", ans: "Triángulo obtusángulo", fakes: ["Triángulo rectángulo", "Triángulo acutángulo"], hint: "Pista: la presencia de una abertura superior a noventa determina su clase." },
    { p: "¿Cuánto suman SIEMPRE los tres ángulos interiores de cualquier triángulo?", ans: "180°", fakes: ["90°", "360°"], hint: "Pista: en el plano, la suma angular equivale a dos rectos." },
    { p: "Un cantero de flores tiene forma triangular con lados de 2 m, 3 m y 4 m. ¿Cómo se clasifica por sus LADOS?", ans: "Triángulo escaleno", fakes: ["Triángulo isósceles", "Triángulo equilátero"], hint: "Pista: sus tres longitudes presentan valores desiguales." },
    { p: "Si un triángulo tiene dos ángulos de 45° y un ángulo de 90°, ¿qué tipo de triángulo es por sus ángulos?", ans: "Triángulo rectángulo", fakes: ["Triángulo obtusángulo", "Triángulo acutángulo"], hint: "Pista: alcanza con la presencia de un ángulo recto para clasificarlo." },
    { p: "Un triángulo equilátero tiene sus tres lados iguales. ¿Cómo son sus tres ángulos interiores?", ans: "Iguales (cada uno mide 60°)", fakes: ["Distintos entre sí", "Todos de 90°"], hint: "Pista: la regularidad de sus lados se traslada a la igualdad de sus aberturas." },
    { p: "Un triángulo con lados de 7 cm, 7 cm y 7 cm es:", ans: "Equilátero", fakes: ["Isósceles", "Escaleno"], hint: "Pista: los tres segmentos tienen idéntica longitud." },
    { p: "Si un triángulo tiene un ángulo obtuso de 110°, ¿cómo se clasifica por sus ángulos?", ans: "Triángulo obtusángulo", fakes: ["Triángulo acutángulo", "Triángulo rectángulo"], hint: "Pista: la abertura de más de noventa grados define su nombre." },
    { p: "Un triángulo con lados de 5 cm, 5 cm y 8 cm se clasifica como:", ans: "Isósceles", fakes: ["Equilátero", "Escaleno"], hint: "Pista: cuenta con dos lados iguales y uno diferente." },
    { p: "¿Puede existir un triángulo con DOS ángulos rectos de 90° en el plano?", ans: "No, porque dos rectos ya suman 180° sin dejar lugar a un tercer ángulo", fakes: ["Sí, si es un triángulo grande", "Sí, si sus lados son curvos"], hint: "Pista: la suma total de las tres aberturas no puede exceder el límite." },
    { p: "Una escuadra de dibujo de 45° es un triángulo rectángulo y a la vez:", ans: "Isósceles", fakes: ["Equilátero", "Escaleno"], hint: "Pista: sus dos lados perpendiculares poseen la misma extensión." },
    { p: "Un triángulo cuyos tres lados miden 8 cm, 11 cm y 14 cm es:", ans: "Escaleno", fakes: ["Isósceles", "Equilátero"], hint: "Pista: ninguna de las tres medidas coincide." },
    { p: "Si dos ángulos de un triángulo miden 50° y 60°, ¿cuánto mide el tercer ángulo sabiendo que suman 180°?", ans: "70°", fakes: ["80°", "60°"], hint: "Pista: calculá la diferencia restante para alcanzar la suma total." },
    { p: "Un triángulo con lados de 12 cm, 12 cm y 15 cm recibe el nombre de:", ans: "Isósceles", fakes: ["Equilátero", "Escaleno"], hint: "Pista: posee un par de lados congruentes." },
    { p: "Si un triángulo tiene lados de 9 cm, 12 cm y 15 cm y un ángulo de 90°, por sus lados es:", ans: "Escaleno", fakes: ["Isósceles", "Equilátero"], hint: "Pista: fijate si alguna de sus tres medidas se repite." },
    { p: "El triángulo que tiene sus tres lados desiguales se denomina:", ans: "Triángulo escaleno", fakes: ["Triángulo isósceles", "Triángulo equilátero"], hint: "Pista: cada lado tiene una extensión diferente." },
    { p: "¿Qué clase de triángulo posee tres ángulos interiores agudos menores a 90°?", ans: "Acutángulo", fakes: ["Rectángulo", "Obtusángulo"], hint: "Pista: ninguna de sus aberturas alcanza los noventa grados." },
    { p: "Si un triángulo tiene dos ángulos de 70° cada uno, ¿cuánto mide el tercer ángulo?", ans: "40°", fakes: ["50°", "60°"], hint: "Pista: sumá los dos conocidos y restá de ciento ochenta." },
    { p: "En un triángulo rectángulo, los dos ángulos que no son el recto deben ser siempre:", ans: "Agudos (suman 90°)", fakes: ["Obtusos", "Rectos"], hint: "Pista: entre los dos completan los noventa grados que faltan." },
    { p: "¿Cuántos vértices y cuántos lados tiene cualquier triángulo?", ans: "3 lados y 3 vértices", fakes: ["4 lados y 3 vértices", "3 lados y 4 vértices"], hint: "Pista: el prefijo 'tri' indica tres elementos." },
    { p: "¿Puede un triángulo equilátero ser también rectángulo?", ans: "No, porque sus ángulos siempre miden 60° cada uno", fakes: ["Sí, en algunos casos especiales", "Sí, si sus lados son muy largos"], hint: "Pista: en el equilátero los ángulos son obligatoriamente agudos." },
    { p: "Si un triángulo tiene un ángulo de 100°, los otros dos ángulos deben ser necesariamente:", ans: "Agudos", fakes: ["Rectos", "Obtusos"], hint: "Pista: no pueden superar los ochenta grados en conjunto." },
    { p: "¿Cómo se llama el lado opuesto al ángulo recto en un triángulo rectángulo?", ans: "Hipotenusa", fakes: ["Cateto", "Base menor"], hint: "Pista: es el segmento de mayor longitud en esa figura." },
    { p: "Los dos lados que forman el ángulo recto en un triángulo rectángulo se denominan:", ans: "Catetos", fakes: ["Diagonales", "Radios"], hint: "Pista: son las dos ramas que se cortan perpendicularmente." },
    { p: "Si en un triángulo dos lados miden 10 cm y el tercero 10 cm, es:", ans: "Equilátero", fakes: ["Isósceles", "Escaleno"], hint: "Pista: los tres lados tienen exactamente la misma medida." },
    { p: "Si los ángulos interiores de un triángulo miden 30°, 60° y 90°, se clasifica como:", ans: "Rectángulo", fakes: ["Acutángulo", "Obtusángulo"], hint: "Pista: tiene una abertura de noventa grados." },
    { p: "Si un triángulo tiene ángulos de 20°, 40° y 120°, se clasifica como:", ans: "Obtusángulo", fakes: ["Acutángulo", "Rectángulo"], hint: "Pista: una de sus aberturas supera los noventa grados." },
    { p: "La altura de un triángulo es un segmento que cae perpendicular sobre:", ans: "La base o su prolongación", fakes: ["El vértice opuesto únicamente", "El punto medio exterior"], hint: "Pista: forma un ángulo recto con la línea de apoyo." },
    { p: "¿Cuál es el perímetro de un triángulo equilátero de 5 cm de lado?", ans: "15 cm", fakes: ["10 cm", "20 cm"], hint: "Pista: sumá tres veces la longitud del lado." }
  ];

  const dynGenerators = [
    () => {
      const a = randInt(25, 75);
      const b = randInt(25, 140 - a);
      const c = 180 - a - b;
      const ans = `${c}°`;
      return { p: `Si dos ángulos de un triángulo miden ${a}° y ${b}°, ¿cuánto mide el tercer ángulo sabiendo que suman 180°?`, ans, fakes: [`${c + 10}°`, `${Math.max(10, c - 10)}°`], hint: `Pista: restá ${a} y ${b} de 180° (180 - ${a + b} = ${c}).` };
    },
    () => {
      const lado = randInt(4, 25);
      const ans = `${lado * 3} cm`;
      return { p: `¿Cuál es el perímetro de un triángulo equilátero cuyos lados miden ${lado} cm cada uno?`, ans, fakes: [`${lado * 2} cm`, `${lado * 4} cm`], hint: `Pista: sumá los tres lados iguales (${lado} × 3 = ${lado * 3}).` };
    },
    () => {
      const igual = randInt(10, 35);
      const base = igual + pickOne([-4, -2, 3, 5]);
      return { p: `Un banderín escolar tiene lados de ${igual} cm, ${igual} cm y ${base} cm. ¿Cómo se clasifica según sus LADOS?`, ans: "Triángulo isósceles", fakes: ["Triángulo equilátero", "Triángulo escaleno"], hint: "Pista: fijate que tiene dos lados de igual medida y uno distinto." };
    },
    () => {
      const l1 = randInt(5, 15);
      const l2 = l1 + randInt(2, 5);
      const l3 = l2 + randInt(2, 5);
      return { p: `Un cantero triangular tiene lados de ${l1} m, ${l2} m y ${l3} m. ¿Cómo se clasifica según sus LADOS?`, ans: "Triángulo escaleno", fakes: ["Triángulo isósceles", "Triángulo equilátero"], hint: "Pista: sus tres lados tienen medidas diferentes." };
    },
    () => {
      const a1 = pickOne([30, 45, 60, 35, 55, 40, 50]);
      const a2 = 90 - a1;
      return { p: `Un triángulo tiene ángulos interiores de 90°, ${a1}° y ${a2}°. ¿Cómo se clasifica según sus ÁNGULOS?`, ans: "Triángulo rectángulo", fakes: ["Triángulo acutángulo", "Triángulo obtusángulo"], hint: "Pista: tiene un ángulo recto de 90°." };
    },
    () => {
      const obt = pickOne([100, 110, 120, 130, 140]);
      const rem = 180 - obt;
      const a1 = Math.floor(rem / 2);
      const a2 = rem - a1;
      return { p: `Un triángulo tiene ángulos interiores de ${obt}°, ${a1}° y ${a2}°. ¿Cómo se clasifica según sus ÁNGULOS?`, ans: "Triángulo obtusángulo", fakes: ["Triángulo acutángulo", "Triángulo rectángulo"], hint: "Pista: tiene un ángulo mayor a 90°." };
    }
  ];

  acts.push(rotatePickOne(42026, clasificaciones));
  const dynItems = dynGenerators.map((gen) => gen());
  const allPreguntas = [...dynItems, ...staticPreguntas];
  const seleccionadas = pickDistinctPreguntasForWorld(42026, allPreguntas, 7);
  for (let i = 0; i < 7; i++) {
    const item = seleccionadas[i];
    const choices = distinctChoices(item.ans, item.fakes, 3);
    acts.push(
      qToPick(
        q(item.p, choices.map((c) => ["📐", c]), choices.indexOf(item.ans), item.hint),
        `m42026-q-${i}`,
        "",
        skills
      )
    );
  }
  return numbered(acts);
}

// Mundo 42027: Cuadriláteros y cuerpos geométricos (cubos y prismas)
function buildMundo42027(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  const skills = ["m4-cuadrilateros", "m4-planos"];

  const clasificaciones = [
    makeClassify(
      "m42027-cla-1",
      "Clasificá estos cuerpos geométricos según su forma y caras:",
      ["Cubo (6 caras cuadradas iguales)", "Prisma rectangular (caras rectangulares)"],
      [
        { label: "Dado tradicional de juegos de mesa", cat: 0 },
        { label: "Caja cúbica con aristas de 10 cm", cat: 0 },
        { label: "Caja de zapatos", cat: 1 },
        { label: "Ladrillo de construcción", cat: 1 },
        { label: "Caja de leche larga vida", cat: 1 },
      ],
      "Pista: el cubo tiene todas sus 6 caras cuadradas e idénticas.",
      skills
    ),
    makeClassify(
      "m42027-cla-2",
      "Clasificá las figuras cuadriláteras según sus lados paralelos:",
      ["Paralelogramos (2 pares de lados paralelos)", "No paralelogramos (trapecios o trapezoides)"],
      [
        { label: "Cuadrado de 4 lados iguales", cat: 0 },
        { label: "Rectángulo de lados opuestos iguales", cat: 0 },
        { label: "Rombo con lados paralelos dos a dos", cat: 0 },
        { label: "Trapecio con un solo par de bases paralelas", cat: 1 },
        { label: "Trapezoide sin lados paralelos", cat: 1 },
      ],
      "Pista: los paralelogramos tienen ambos pares de lados opuestos paralelos.",
      skills
    ),
    makeClassify(
      "m42027-cla-3",
      "Clasificá los cuadriláteros según la igualdad de sus cuatro lados:",
      ["4 lados iguales", "Lados consecutivos desiguales"],
      [
        { label: "Cuadrado regular", cat: 0 },
        { label: "Rombo tradicional", cat: 0 },
        { label: "Rectángulo con largo y ancho distintos", cat: 1 },
        { label: "Trapecio isósceles", cat: 1 },
      ],
      "Pista: el cuadrado y el rombo comparten la propiedad de tener cuatro lados iguales.",
      skills
    ),
    makeClassify(
      "m42027-cla-4",
      "Clasificá los cuadriláteros según la presencia de ángulos rectos:",
      ["Con 4 ángulos rectos de 90°", "Sin ángulos rectos obligatorios"],
      [
        { label: "Cuadrado", cat: 0 },
        { label: "Rectángulo", cat: 0 },
        { label: "Rombo oblicuo", cat: 1 },
        { label: "Trapezoide irregular", cat: 1 },
      ],
      "Pista: cuadrado y rectángulo poseen cuatro esquinas rectas.",
      skills
    ),
    makeClassify(
      "m42027-cla-5",
      "Clasificá entre figuras del plano y cuerpos del espacio:",
      ["Figuras planas 2D", "Cuerpos con volumen 3D"],
      [
        { label: "Cuadrado dibujado en papel", cat: 0 },
        { label: "Rectángulo trazado con regla", cat: 0 },
        { label: "Cubo de madera maciza", cat: 1 },
        { label: "Prisma de cartón para encomiendas", cat: 1 },
      ],
      "Pista: los cuerpos ocupan un lugar tridimensional en el espacio.",
      skills
    ),
    makeClassify(
      "m42027-cla-6",
      "Clasificá las partes constitutivas de un poliedro:",
      ["Caras (superficies planas)", "Aristas (filos de unión)"],
      [
        { label: "Lado cuadrado frontal de un cubo", cat: 0 },
        { label: "Base rectangular de una caja", cat: 0 },
        { label: "Borde donde se juntan dos caras", cat: 1 },
        { label: "Línea de unión entre pared y piso de la caja", cat: 1 },
      ],
      "Pista: las caras son superficies y las aristas son segmentos.",
      skills
    )
  ];

  const preguntasGeo = [
    { p: "¿Qué cuadrilátero tiene sus cuatro lados iguales y sus cuatro ángulos rectos de 90°?", ans: "El cuadrado", fakes: ["El rectángulo", "El rombo"], hint: "Pista: reúne lados congruentes y cuatro esquinas perpendiculares." },
    { p: "¿En qué se diferencian un rectángulo y un cuadrado?", ans: "El rectángulo tiene lados opuestos iguales, no los cuatro iguales", fakes: ["El rectángulo no tiene ángulos rectos", "El cuadrado tiene lados de distinta medida"], hint: "Pista: compará la longitud de lados consecutivos en ambas figuras." },
    { p: "¿Cómo se llama el cuadrilátero que tiene solo UN par de lados opuestos paralelos?", ans: "Trapecio", fakes: ["Paralelogramo", "Trapezoide"], hint: "Pista: posee una base mayor y una base menor paralelas entre sí." },
    { p: "¿Qué cuadrilátero tiene sus cuatro lados de igual longitud pero sus ángulos NO son necesariamente rectos?", ans: "El rombo", fakes: ["El trapecio", "El rectángulo"], hint: "Pista: todos sus bordes miden lo mismo aunque sus esquinas sean oblicuas." },
    { p: "¿Cómo se llama la familia de cuadriláteros que tienen DOS pares de lados opuestos paralelos?", ans: "Paralelogramos", fakes: ["Trapecios", "Triángulos"], hint: "Pista: este grupo engloba al cuadrado, rectángulo y rombo." },
    { p: "¿Cuánto suman SIEMPRE los cuatro ángulos interiores de cualquier cuadrilátero plano?", ans: "360°", fakes: ["180°", "270°"], hint: "Pista: cualquier polígono de cuatro lados se divide en dos triángulos." },
    { p: "¿Cómo se llama el segmento recto que une dos vértices no consecutivos dentro de un cuadrilátero?", ans: "Diagonal", fakes: ["Arista", "Radio"], hint: "Pista: cruza la figura de una esquina a la opuesta." },
    { p: "¿Cuántos lados, vértices y ángulos tiene toda figura cuadrilátera?", ans: "4 lados, 4 vértices y 4 ángulos", fakes: ["3 lados, 3 vértices y 3 ángulos", "5 lados, 5 vértices y 5 ángulos"], hint: "Pista: el prefijo de su nombre determina el número de elementos." },
    { p: "Si un cuadrilátero tiene sus lados opuestos paralelos e iguales y sus 4 ángulos son rectos, es un:", ans: "Rectángulo", fakes: ["Trapecio", "Rombo"], hint: "Pista: posee esquinas perpendiculares y caras opuestas congruentes." },
    { p: "¿Cuál de las siguientes figuras es un cuadrilátero sin ningún lado paralelo?", ans: "Trapezoide", fakes: ["Trapecio", "Rombo"], hint: "Pista: no presenta ningún paralelismo entre sus bordes." },
    { p: "¿Cuántas caras, aristas y vértices tiene un cubo?", ans: "6 caras, 12 aristas y 8 vértices", fakes: ["4 caras, 8 aristas y 4 vértices", "8 caras, 12 aristas y 6 vértices"], hint: "Pista: pensá en las seis caras cuadradas de un dado común." },
    { p: "¿Cómo se llama la línea donde se unen dos caras de un cuerpo geométrico?", ans: "Arista", fakes: ["Vértice", "Diagonal"], hint: "Pista: es el borde o filo de unión entre dos superficies planas." },
    { p: "¿Cómo se llama el punto de encuentro donde coinciden tres o más aristas de un prisma?", ans: "Vértice", fakes: ["Cara", "Base"], hint: "Pista: representa cada una de las esquinas del cuerpo." },
    { p: "¿Qué forma tienen las 6 caras de un prisma rectangular recto (caja de zapatos)?", ans: "Rectángulos", fakes: ["Círculos", "Triángulos"], hint: "Pista: cada una de sus superficies exteriores es un cuadrilátero recto." },
    { p: "¿Cuántas bases paralelas tiene un prisma rectangular recto?", ans: "2 bases", fakes: ["1 base", "4 bases"], hint: "Pista: tiene una superficie de apoyo inferior y otra idéntica superior." },
    { p: "¿Qué cuerpo geométrico tiene todas sus caras idénticas con forma de cuadrado?", ans: "El cubo", fakes: ["El prisma triangular", "El cono"], hint: "Pista: sus seis caras son polígonos regulares de cuatro lados." },
    { p: "¿Cuántas diagonales se pueden trazar en total en cualquier cuadrilátero convexo?", ans: "2 diagonales", fakes: ["4 diagonales", "1 diagonal"], hint: "Pista: se unen los pares de vértices no consecutivos opuestos." },
    { p: "Un romboide se caracteriza por tener:", ans: "Dos pares de lados consecutivos iguales", fakes: ["Cuatro lados iguales", "Ningún lado igual"], hint: "Pista: se asemeja a la silueta tradicional de un barrilete." },
    { p: "¿Qué figura plana se obtiene al desplegar las caras de un cubo sobre la mesa?", ans: "Un desarrollo plano de 6 cuadrados", fakes: ["4 rectángulos y 2 círculos", "6 triángulos"], hint: "Pista: el cuerpo tridimensional está formado exclusivamente por caras cuadradas." },
    { p: "¿Cuántas aristas concurren en cada vértice de un cubo?", ans: "3 aristas", fakes: ["2 aristas", "4 aristas"], hint: "Pista: en cada esquina se unen el largo, el ancho y el alto." },
    { p: "Si una caja tiene 6 caras pero no todas son cuadradas, sino rectangulares, es un:", ans: "Prisma rectangular", fakes: ["Cubo", "Pirámide"], hint: "Pista: sus superficies laterales presentan forma de rectángulo." },
    { p: "¿Cómo son entre sí las caras opuestas de un prisma rectangular?", ans: "Paralelas e iguales", fakes: ["Perpendiculares", "Triangulares"], hint: "Pista: mantienen la misma orientación y superficie." },
    { p: "Un cuadrilátero con un ángulo recto, ¿puede ser un trapecio?", ans: "Sí, es un trapecio rectángulo", fakes: ["No, nunca", "Solo si es un cuadrado"], hint: "Pista: conserva dos bases paralelas y un lado perpendicular a ellas." },
    { p: "¿Qué relación guardan las dos diagonales de un cuadrado?", ans: "Son iguales y perpendiculares", fakes: ["Son de distinta medida", "Nunca se cortan"], hint: "Pista: se intersectan en el centro formando ángulos rectos de igual extensión." },
    { p: "¿Cuántos vértices tiene un prisma rectangular recto?", ans: "8 vértices", fakes: ["6 vértices", "12 vértices"], hint: "Pista: cuenta con cuatro esquinas en la base inferior y cuatro en la superior." },
    { p: "¿Cuántas aristas tiene un prisma rectangular recto?", ans: "12 aristas", fakes: ["8 aristas", "6 aristas"], hint: "Pista: sumá las cuatro aristas de abajo, cuatro de arriba y cuatro verticales." },
    { p: "¿Qué figura forma la base de una pirámide de base cuadrada?", ans: "Un cuadrado", fakes: ["Un triángulo", "Un círculo"], hint: "Pista: el nombre de la pirámide señala el polígono de apoyo." },
    { p: "En un paralelogramo, los ángulos opuestos son:", ans: "Iguales", fakes: ["Complementarios", "Desiguales"], hint: "Pista: conservan la misma amplitud angular." },
    { p: "¿Cuántas caras laterales tiene un prisma de base rectangular?", ans: "4 caras laterales", fakes: ["2 caras laterales", "6 caras laterales"], hint: "Pista: descartá las dos bases superior e inferior." },
    { p: "Si un cuerpo geométrico puede rodar sobre una mesa, ¿puede ser un cubo?", ans: "No, porque todas sus caras son planas", fakes: ["Sí, si tiene vértices redondeados", "Sí, siempre"], hint: "Pista: los cuerpos poliedros carecen de superficies curvas." }
  ];

  acts.push(rotatePickOne(42027, clasificaciones));
  const dynGenerators = [
    () => {
      const lado = randInt(4, 25);
      const ans = `${lado * 4} cm`;
      return { p: `El perímetro de un cuadrado de ${lado} cm de lado es:`, ans, fakes: [`${lado * 2} cm`, `${lado * 3} cm`], hint: "Pista: sumá la longitud de sus cuatro lados iguales." };
    },
    () => {
      const largo = randInt(8, 20);
      const ancho = randInt(3, 7);
      const perim = 2 * (largo + ancho);
      const ans = `${perim} cm`;
      return { p: `El perímetro de un rectángulo de ${largo} cm de largo y ${ancho} cm de ancho es:`, ans, fakes: [`${largo * ancho} cm`, `${perim + 4} cm`], hint: "Pista: sumá dos veces el largo y dos veces el ancho." };
    },
    () => {
      const k = randInt(2, 5);
      const ans = `${k * 12} aristas`;
      return { p: `¿Cuántas aristas reúnen en conjunto ${k} cubos separados?`, ans, fakes: [`${k * 6} aristas`, `${k * 8} aristas`], hint: "Pista: cada cubo tiene doce aristas." };
    },
    () => {
      const k = randInt(2, 5);
      const ans = `${k * 8} vértices`;
      return { p: `¿Cuántos vértices reúnen en conjunto ${k} prismas rectangulares?`, ans, fakes: [`${k * 6} vértices`, `${k * 12} vértices`], hint: "Pista: cada prisma posee ocho vértices." };
    }
  ];

  const dynItems = dynGenerators.map((gen) => gen());
  const allPreguntas = [...dynItems, ...preguntasGeo];
  const seleccionadas = pickDistinctPreguntasForWorld(42027, allPreguntas, 7);
  for (let i = 0; i < 7; i++) {
    const item = seleccionadas[i];
    const choices = distinctChoices(item.ans, item.fakes, 3);
    acts.push(
      qToPick(
        q(item.p, choices.map((c) => ["🧊", c]), choices.indexOf(item.ans), item.hint),
        `m42027-q-${i}`,
        "",
        skills
      )
    );
  }
  return numbered(acts);
}

// Mundo 42028: Medición: peso, capacidad, tiempo, superficies y perímetro
function buildMundo42028(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  const skills = ["m4-medidas-peso-cap", "m4-tiempo", "m4-superficies", "m4-perimetro", "m4-estadistica"];

  // Perímetro variado
  const perimLugares = [
    { lugar: "Una huerta comunitaria en Los Antiguos", largo: randInt(15, 45), ancho: randInt(8, 25) },
    { lugar: "Un patio de recreo en una escuela de Río Gallegos", largo: randInt(20, 50), ancho: randInt(10, 30) },
    { lugar: "Una cancha de vóley en el polideportivo de Caleta Olivia", largo: randInt(16, 36), ancho: randInt(9, 22) },
    { lugar: "Un cantero de flores en la costanera de El Calafate", largo: randInt(12, 30), ancho: randInt(6, 18) }
  ];
  const pLugar = rotatePickOne(420281, perimLugares);
  const perimVal = 2 * pLugar.largo + 2 * pLugar.ancho;
  acts.push(
    makeInput(
      "m42028-perim",
      `${pLugar.lugar} mide ${pLugar.largo} metros de largo por ${pLugar.ancho} metros de ancho. ¿Cuántos metros de cerca se necesitan para rodear todo su perímetro?`,
      perimVal,
      `Pista: calculá la suma de los cuatro lados (${pLugar.largo} + ${pLugar.largo} + ${pLugar.ancho} + ${pLugar.ancho}).`,
      skills
    )
  );

  // Superficie / Área variado
  const areaLugares = [
    { lugar: "El piso de una carpa de investigación en El Chaltén", base: randInt(5, 14), alt: randInt(4, 9) },
    { lugar: "Una sala de lectura en la biblioteca de Puerto Deseado", base: randInt(6, 15), alt: randInt(5, 10) },
    { lugar: "Un taller artesanal en Gobernador Gregores", base: randInt(7, 16), alt: randInt(4, 8) },
    { lugar: "Un invernadero municipal en Río Turbio", base: randInt(8, 18), alt: randInt(5, 11) }
  ];
  const aLugar = rotatePickOne(420282, areaLugares);
  const areaVal = aLugar.base * aLugar.alt;
  acts.push(
    makeInput(
      "m42028-area",
      `${aLugar.lugar} tiene ${aLugar.base} metros de largo por ${aLugar.alt} metros de ancho. ¿Cuál es su superficie en metros cuadrados (m²)?`,
      areaVal,
      `Pista: multiplicá la longitud del largo por la del ancho (${aLugar.base} × ${aLugar.alt}).`,
      skills
    )
  );

  // Peso / Masa variado
  const kg = rotatePickOne(420285, [2, 3, 4, 5, 6, 8, 10]);
  const g = kg * 1000;
  const choicesPeso = distinctChoices(`${g.toLocaleString("es-AR")} gramos`, [`${(kg * 100).toLocaleString("es-AR")} gramos`, `${(kg * 10).toLocaleString("es-AR")} gramos`], 3);
  acts.push(
    qToPick(
      q(
        `Una bolsa de lana esquilada en una estancia de Santa Cruz pesa ${kg} kilogramos. ¿A cuántos gramos equivale ese peso?`,
        choicesPeso.map((c) => ["⚖️", c]),
        choicesPeso.indexOf(`${g.toLocaleString("es-AR")} gramos`),
        "Pista: 1 kilogramo equivale exactamente a 1.000 gramos."
      ),
      "m42028-peso",
      "",
      skills
    )
  );

  // Capacidad variado
  const litros = rotatePickOne(420286, [2, 3, 4, 5, 6, 8]);
  const ml = litros * 1000;
  const choicesCap = distinctChoices(`${ml.toLocaleString("es-AR")} ml`, [`${(litros * 100).toLocaleString("es-AR")} ml`, `${(litros * 500).toLocaleString("es-AR")} ml`], 3);
  acts.push(
    qToPick(
      q(
        `Un bidón térmico contiene ${litros} litros de agua potable. ¿A cuántos mililitros (ml) equivale esa capacidad?`,
        choicesCap.map((c) => ["💧", c]),
        choicesCap.indexOf(`${ml.toLocaleString("es-AR")} ml`),
        "Pista: 1 litro equivale exactamente a 1.000 mililitros."
      ),
      "m42028-cap",
      "",
      skills
    )
  );

  // Tiempo: Horas a minutos variado
  const horasViaje = rotatePickOne(420287, [2, 3, 4, 5, 6]);
  const minutosViaje = horasViaje * 60;
  const choicesTiempo = distinctChoices(`${minutosViaje} minutos`, [`${minutosViaje - 30} minutos`, `${minutosViaje + 60} minutos`], 3);
  acts.push(
    qToPick(
      q(
        `El viaje en colectivo de larga distancia por las rutas santacruceñas demora aproximadamente ${horasViaje} horas. ¿A cuántos minutos equivale ese viaje?`,
        choicesTiempo.map((c) => ["⏱️", c]),
        choicesTiempo.indexOf(`${minutosViaje} minutos`),
        `Pista: cada hora tiene 60 minutos. Multiplicá ${horasViaje} × 60.`
      ),
      "m42028-tiempo",
      "",
      skills
    )
  );

  // Tiempo: Minutos a segundos variado
  const min = rotatePickOne(420288, [2, 3, 4, 5, 8]);
  const seg = min * 60;
  const choicesSeg = distinctChoices(`${seg} segundos`, [`${seg - 20} segundos`, `${seg + 30} segundos`], 3);
  acts.push(
    qToPick(
      q(
        `Durante una actividad escolar cronometrada pasaron ${min} minutos. ¿Cuántos segundos duró ese intervalo?`,
        choicesSeg.map((c) => ["⏳", c]),
        choicesSeg.indexOf(`${seg} segundos`),
        `Pista: cada minuto tiene 60 segundos. Multiplicá ${min} × 60.`
      ),
      "m42028-seg",
      "",
      skills
    )
  );

  // Capacidad fraccionaria variada (pool de preguntas)
  const vasosPool = [
    { p: "Si un vaso tiene una capacidad de 250 ml (1/4 de litro), ¿cuántos vasos se pueden llenar con una jarra de 1 litro?", ans: "4 vasos", fakes: ["2 vasos", "8 vasos"], hint: "Pista: pensá cuántas partes de 250 ml suman 1.000 ml." },
    { p: "Si una taza tiene una capacidad de 500 ml (1/2 litro), ¿cuántas tazas se pueden llenar con un termo de 2 litros?", ans: "4 tazas", fakes: ["2 tazas", "6 tazas"], hint: "Pista: en cada litro entran dos medios litros." },
    { p: "¿Cuántos vasitos de 125 ml (1/8 de litro) se llenan con 1 litro entero de jugo?", ans: "8 vasitos", fakes: ["4 vasitos", "16 vasitos"], hint: "Pista: ocho partes de 125 ml completan 1.000 ml." },
    { p: "Si una botella contiene 1 1/2 litro de agua, ¿a cuántos mililitros equivale?", ans: "1.500 ml", fakes: ["1.250 ml", "1.750 ml"], hint: "Pista: sumá los mililitros de un litro entero más los de medio litro." },
    { p: "¿Cuántos vasos de 250 ml se pueden llenar con una botella de 2 litros de agua mineral?", ans: "8 vasos", fakes: ["4 vasos", "6 vasos"], hint: "Pista: cada litro rinde cuatro vasos de un cuarto." },
    { p: "Si tenemos un bidón de 3 litros de jugo, ¿cuántos recipientes de 500 ml podemos llenar?", ans: "6 recipientes", fakes: ["3 recipientes", "8 recipientes"], hint: "Pista: duplicá la cantidad de litros para obtener los medios litros." }
  ];
  const vItem = rotatePickOne(420283, vasosPool);
  const choicesV = distinctChoices(vItem.ans, vItem.fakes, 3);
  acts.push(
    qToPick(
      q(vItem.p, choicesV.map((c) => ["🥛", c]), choicesV.indexOf(vItem.ans), vItem.hint),
      "m42028-vasos",
      "",
      skills
    )
  );

  // Estadística variada
  const estadisticaEscenarios = [
    () => {
      const target = "Jueves (18 °C)";
      const choices = distinctChoices(target, ["Martes (15 °C)", "Viernes (14 °C)"], 3);
      return {
        prompt: "En una tabla de temperaturas máximas en Río Gallegos se anotó:\nLunes: 12 °C — Martes: 15 °C — Miércoles: 10 °C — Jueves: 18 °C — Viernes: 14 °C.\n¿Qué día se registró la temperatura MÁS ALTA?",
        target,
        choices,
        pista: "Pista: compará los números de la tabla y buscá el valor mayor.",
      };
    },
    () => {
      const target = "Miércoles (9 °C)";
      const choices = distinctChoices(target, ["Lunes: 12 °C", "Viernes: 14 °C"], 3);
      return {
        prompt: "En un registro semanal del clima en El Calafate se anotaron estas temperaturas mínimas:\nLunes: 12 °C — Martes: 15 °C — Miércoles: 9 °C — Jueves: 18 °C — Viernes: 14 °C.\n¿Qué día se registró la temperatura MÁS BAJA?",
        target,
        choices,
        pista: "Pista: buscá en la lista el día con el número menor de grados.",
      };
    },
    () => {
      const target = "5 días";
      const choices = distinctChoices(target, ["3 días", "4 días"], 3);
      return {
        prompt: "Durante la semana se registraron las horas de sol en Puerto San Julián:\nLun: 6 h — Mar: 8 h — Mié: 5 h — Jue: 7 h — Vie: 9 h.\n¿Cuántos días de la semana tuvieron 5 o más horas de sol?",
        target,
        choices,
        pista: "Pista: contá los días cuyos valores sean iguales o mayores a 5.",
      };
    },
    () => {
      const target = "Sábado (120 personas)";
      const choices = distinctChoices(target, ["Viernes (95 personas)", "Domingo (110 personas)"], 3);
      return {
        prompt: "Un museo histórico de Santa Cruz registró visitantes:\nJueves: 45 — Viernes: 95 — Sábado: 120 — Domingo: 110.\n¿Qué día asistió la MAYOR cantidad de personas?",
        target,
        choices,
        pista: "Pista: buscá el número más alto en el conteo de visitas.",
      };
    },
    () => {
      const target = "Viernes (2 mm)";
      const choices = distinctChoices(target, ["Martes (15 mm)", "Miércoles (8 mm)"], 3);
      return {
        prompt: "En una estación meteorológica se midieron precipitaciones:\nLunes: 10 mm — Martes: 15 mm — Miércoles: 8 mm — Jueves: 12 mm — Viernes: 2 mm.\n¿Qué día llovió MENOS?",
        target,
        choices,
        pista: "Pista: buscá el valor numérico más bajo del registro de lluvias.",
      };
    },
    () => {
      const target = "Grado C (32 alumnos)";
      const choices = distinctChoices(target, ["Grado A (25 alumnos)", "Grado B (28 alumnos)"], 3);
      return {
        prompt: "En un gráfico de barras sobre cantidad de estudiantes se observa:\nGrado A: 25 — Grado B: 28 — Grado C: 32 — Grado D: 26.\n¿Qué grado tiene la barra MÁS ALTA?",
        target,
        choices,
        pista: "Pista: relacioná la altura de la barra con la mayor cantidad de alumnos.",
      };
    }
  ];

  const estCase = rotatePickOne(420284, estadisticaEscenarios)();
  acts.push(
    qToPick(
      q(
        estCase.prompt,
        estCase.choices.map((c) => ["📊", c]),
        estCase.choices.indexOf(estCase.target),
        estCase.pista
      ),
      "m42028-est",
      "",
      skills
    )
  );

  return numbered(acts);
}

// --------------------------------------------------------------------------
// Despachador de Matemática de 4.º grado
// --------------------------------------------------------------------------
export function buildMatematicaWorldActivities(world: WorldDef): ActivitySpec[] {
  switch (world.id) {
    case 42001: return buildMundo42001();
    case 42002: return buildMundo42002();
    case 42003: return buildMundo42003();
    case 42004: return buildMundo42004();
    case 42005: return buildMundo42005();
    case 42006: return buildMundo42006();
    case 42007: return buildMundo42007();
    case 42008: return buildMundo42008();
    case 42009: return buildMundo42009();
    case 42010: return buildMundo42010();
    case 42011: return buildMundo42011();
    case 42012: return buildMundo42012();
    case 42013: return buildMundo42013();
    case 42014: return buildMundo42014();
    case 42015: return buildMundo42015();
    case 42016: return buildMundo42016();
    case 42017: return buildMundo42017();
    case 42018: return buildMundo42018();
    case 42019: return buildMundo42019();
    case 42020: return buildMundo42020();
    case 42021: return buildMundo42021();
    case 42022: return buildMundo42022();
    case 42023: return buildMundo42023();
    case 42024: return buildMundo42024();
    case 42025: return buildMundo42025();
    case 42026: return buildMundo42026();
    case 42027: return buildMundo42027();
    case 42028: return buildMundo42028();
    default:
      return buildMundo42001();
  }
}

export const buildMatematicaActivities = buildMatematicaWorldActivities;
