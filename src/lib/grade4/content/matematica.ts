// Actividades de Matemática de 4.º grado (28 mundos).
// Generadas con números al azar dentro del rango pedagógico del segundo ciclo
// (números hasta el millón, números romanos, cálculo mental y estimación,
// organizaciones rectangulares, proporcionalidad directa, multiplicación por 2 cifras,
// división con resto, fracciones usuales y mixtos, decimales, geometría, medida y estadística).
import type { ActivitySpec } from "@/lib/activities";
import { WorldDef } from "@/types";
import {
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
  for (let i = 0; i < 8; i++) {
    if (i % 3 === 0) {
      const step = pickOne([1000, 2000, 5000]);
      const base = randInt(10, 70) * 1000;
      const seq = [base, base + step, base + step * 2, base + step * 3];
      const missingIdx = randInt(1, 2);
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
      const n = randInt(10001, 99998);
      const isPosterior = Math.random() > 0.5;
      const target = isPosterior ? n + 1 : n - 1;
      const choices = numberChoices(target, 3, 10000, 99999);
      acts.push(
        qToPick(
          q(
            `¿Cuál es el número ${isPosterior ? "posterior (el siguiente)" : "anterior"} de ${n.toLocaleString("es-AR")}?`,
            choices.map((c) => ["📍", c.toLocaleString("es-AR")]),
            choices.indexOf(target),
            `Pista: restale 1 para el anterior o sumale 1 para el posterior.`
          ),
          `m42001-${i}`,
          "",
          skills
        )
      );
    } else {
      // Garantizar cifras distintas para que jamás se dupliquen las opciones
      const dm = randInt(2, 9);
      let um = randInt(1, 9);
      while (um === dm) um = randInt(1, 9);
      let c = randInt(1, 9);
      while (c === dm || c === um) c = randInt(1, 9);

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
  for (let i = 0; i < 8; i++) {
    if (i % 2 === 0) {
      const cm = randInt(1, 8);
      let dm = randInt(1, 9);
      while (dm === cm) dm = randInt(1, 9);
      let um = randInt(1, 9);
      while (um === cm || um === dm) um = randInt(1, 9);

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
            `Pista: una centena de mil equivale a 100.000 unidades.`
          ),
          `m42002-${i}`,
          "",
          skills
        )
      );
    } else {
      const base = randInt(100, 800) * 1000;
      const step = pickOne([10000, 50000]);
      const missingIdx = randInt(1, 3);
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

  for (let i = 0; i < 8; i++) {
    const ciu = ciudadesRealistas[i % ciudadesRealistas.length];
    if (i % 3 === 0) {
      // Descomposición polinómica multiplicativa
      // Generar 5 dígitos estrictamente distintos
      const digits: number[] = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4);
      const [d1, d2, d3, d4] = digits;
      const n = d1 * 10000 + d2 * 1000 + d3 * 100 + d4 * 10;
      const targetStr = `${d1} × 10.000 + ${d2} × 1.000 + ${d3} × 100 + ${d4} × 10`;
      const fake1 = `${d1} × 1.000 + ${d2} × 100 + ${d3} × 10 + ${d4} × 1`;
      const fake2 = `${d2} × 10.000 + ${d1} × 1.000 + ${d3} × 100 + ${d4} × 10`;
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
      const digits: number[] = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 5);
      const [dm, um, c, d, u] = digits;
      const n = dm * 10000 + um * 1000 + c * 100 + d * 10 + u;

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
      const digits: number[] = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4);
      const [d1, d2, d3, d4] = digits;
      const n = d1 * 10000 + d2 * 1000 + d3 * 100 + d4;
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

  // Lista variada de valores para números romanos
  const valores = [
    14, 19, 24, 29, 44, 48, 59, 74, 88, 94, 124, 150, 240, 350, 450, 520, 680, 950, 1492, 1810, 1950, 2024,
  ];

  for (let i = 0; i < 8; i++) {
    const val = valores[(i * 3 + 1) % valores.length];
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
      // Comparación de números romanos
      const a = pickOne([40, 90, 400, 900, 15, 60, 110]);
      const b = a + pickOne([10, 50, 100]);
      const romA = toRoman(a);
      const romB = toRoman(b);
      const correctText = `${romA} < ${romB} (${a} es menor que ${b})`;
      const fake1 = `${romA} > ${romB} (${a} es mayor que ${b})`;
      const fake2 = `${romA} = ${romB} (son iguales)`;
      const choices = distinctChoices(correctText, [fake1, fake2], 3);

      acts.push(
        qToPick(
          q(
            `¿Cuál de las siguientes relaciones de comparación entre números romanos es CORRECTA?`,
            choices.map((c) => ["⚖️", c]),
            choices.indexOf(correctText),
            `Pista: convertí cada número romano a decimal: ${romA} = ${a} y ${romB} = ${b}.`
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
  for (let i = 0; i < 8; i++) {
    const n = randInt(15, 85);
    const factor = pickOne([10, 100, 1000]);
    if (i % 2 === 0) {
      const prod = n * factor;
      const choices = distinctChoices(prod, [prod * 10, Math.max(1, Math.floor(prod / 10)), prod + 100], 3);
      acts.push(
        qToPick(
          q(
            `Una distribuidora de combustible vende ${n} bidones de lubricante a $${factor.toLocaleString("es-AR")} cada uno. ¿Cuánto cobra en total?`,
            choices.map((c) => ["⛽", `$${c.toLocaleString("es-AR")}`]),
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
      acts.push(
        qToPick(
          q(
            `Se reparten $${total.toLocaleString("es-AR")} en partes iguales entre ${factor} estudiantes. ¿Cuánto recibe cada uno?`,
            choices.map((c) => ["🪙", `$${c.toLocaleString("es-AR")}`]),
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
  for (let i = 0; i < 8; i++) {
    if (i % 3 === 0) {
      // Multiplicación por 2 cifras con input numérico
      const a = randInt(120, 350);
      // Decena entre 1 y 3, unidad entre 2 y 9 para que NUNCA sea 0 (evita pista "sumale a x 0")
      const decenas = randInt(1, 3);
      const unidades = randInt(2, 9);
      const b = decenas * 10 + unidades;
      const prod = a * b;
      acts.push(
        makeInput(
          `m42009-in-${i}`,
          `Un colectivo de larga distancia recorre ${a} km por día en las rutas de Santa Cruz. ¿Cuántos km recorrerá en ${b} días?`,
          prod,
          `Pista: calculá ${a} × ${decenas * 10} (${a * decenas * 10}) y sumale ${a} × ${unidades} (${a * unidades}).`,
          skills
        )
      );
    } else if (i % 3 === 1) {
      // Problema con opciones
      const filas = randInt(15, 30);
      const asientos = randInt(12, 25);
      const total = filas * asientos;
      const choices = distinctChoices(total, [total + 100, Math.max(50, total - 100), total + 50], 3);
      acts.push(
        qToPick(
          q(
            `En el cine teatro de Río Gallegos hay ${filas} filas con ${asientos} butacas cada una. ¿Cuántas butacas hay en total?`,
            choices.map((c) => ["🪑", `${c.toLocaleString("es-AR")} butacas`]),
            choices.indexOf(total),
            `Pista: multiplicá la cantidad de filas por la cantidad de butacas (${filas} × ${asientos}).`
          ),
          `m42009-${i}`,
          "",
          skills
        )
      );
    } else {
      // Repertorio de cálculo mental
      const baseA = pickOne([15, 25, 30, 45, 50]);
      const baseB = pickOne([4, 6, 8]);
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
  for (let i = 0; i < 8; i++) {
    const capacidad = pickOne([15, 18, 20, 24]);
    const viajes = randInt(4, 9);
    // Asegurar sobrantes > 1 y < capacidad - 1 para que sobrantes, sobrantes+1, capacidad-sobrantes no choquen
    const sobrantes = randInt(2, capacidad - 2);
    const totalPersonas = capacidad * viajes + sobrantes;
    const combisNecesarias = viajes + 1;

    if (i % 2 === 0) {
      const choices = distinctChoices(combisNecesarias, [viajes, combisNecesarias + 1, viajes - 1], 3);
      acts.push(
        qToPick(
          q(
            `Para una excursión escolar van ${totalPersonas} alumnos en combis donde entran ${capacidad} personas sentadas.\n¿Cuántas combis se necesitan como mínimo para que todos viajen sentados?`,
            choices.map((c) => ["🚐", `${c} combis`]),
            choices.indexOf(combisNecesarias),
            `Pista: ${totalPersonas} ÷ ${capacidad} da ${viajes} y sobran ${sobrantes} alumnos. ¿Hace falta otra combi para los que sobran?`
          ),
          `m42013-${i}`,
          "",
          skills
        )
      );
    } else {
      const choices = distinctChoices(sobrantes, [capacidad - sobrantes, sobrantes + 1, sobrantes + 3], 3);
      acts.push(
        qToPick(
          q(
            `Se reparten ${totalPersonas} lápices en cajas de a ${capacidad} en partes iguales.\n¿Cuántos lápices quedan sin guardar en cajas completas?`,
            choices.map((c) => ["✏️", `${c} lápices`]),
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
  for (let i = 0; i < 8; i++) {
    if (i % 3 === 0) {
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
      const pEsc = propEscenarios[Math.floor(i / 3) % propEscenarios.length];
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
    } else if (i % 3 === 1) {
      // Tabla de valores: constante de proporcionalidad
      const cantCajas = pickOne([4, 6, 8]);
      const alfajoresPorCaja = pickOne([6, 12]);
      const totalAlfajores = cantCajas * alfajoresPorCaja;
      const choices = distinctChoices(alfajoresPorCaja, [alfajoresPorCaja + 2, Math.max(2, alfajoresPorCaja - 2), alfajoresPorCaja * 2], 3);
      const tablaEscenarios = [
        {
          pregunta: `Una tabla indica que ${cantCajas} cajas idénticas contienen en total ${totalAlfajores} alfajores. ¿Cuántos alfajores hay en CADA caja?`,
          icono: "📦",
          item: "alfajores por caja",
          pista: `Pista: dividí el total de alfajores por la cantidad de cajas (${totalAlfajores} ÷ ${cantCajas}).`,
        },
        {
          pregunta: `En un depósito, ${cantCajas} cajones iguales guardan en total ${totalAlfajores} botellas de jugo. ¿Cuántas botellas contiene CADA cajón?`,
          icono: "🧃",
          item: "botellas por cajón",
          pista: `Pista: dividí el total de botellas por la cantidad de cajones (${totalAlfajores} ÷ ${cantCajas}).`,
        },
        {
          pregunta: `En la panadería, ${cantCajas} bandejas iguales contienen en total ${totalAlfajores} medialunas. ¿Cuántas medialunas hay en CADA bandeja?`,
          icono: "🥐",
          item: "medialunas por bandeja",
          pista: `Pista: dividí el total de medialunas por la cantidad de bandejas (${totalAlfajores} ÷ ${cantCajas}).`,
        },
      ];
      const tEsc = tablaEscenarios[Math.floor(i / 3) % tablaEscenarios.length];
      acts.push(
        qToPick(
          q(
            tEsc.pregunta,
            choices.map((c) => [tEsc.icono, `${c} ${tEsc.item}`]),
            choices.indexOf(alfajoresPorCaja),
            tEsc.pista
          ),
          `m42014-${i}`,
          "",
          skills
        )
      );
    } else {
      // Múltiplos y divisores
      const base = pickOne([6, 8, 9, 12]);
      const factor = pickOne([4, 5, 7]);
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
            `Pista: un múltiplo de ${base} se obtiene multiplicando ${base} por un número natural (en este caso, ${base} × ${factor} = ${mult}).`
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
  const preguntas = [
    {
      p: "¿Cuántos paquetes de 1/4 kg de yerba mate se necesitan para completar 1 kg?",
      opts: ["4 paquetes", "2 paquetes", "8 paquetes"],
      ans: "4 paquetes",
      hint: "En 1 kilo entran 4 cuartos (1/4 + 1/4 + 1/4 + 1/4 = 1).",
    },
    {
      p: "¿Cuántos vasos de 1/2 litro de agua se necesitan para llenar una botella de 2 litros?",
      opts: ["4 vasos", "2 vasos", "8 vasos"],
      ans: "4 vasos",
      hint: "En cada litro entran 2 medios litros. En 2 litros entran 2 × 2 = 4.",
    },
    {
      p: "Una pizza se cortó en 8 porciones iguales y Tomás comió 3 porciones. ¿Qué fracción de la pizza comió?",
      opts: ["3/8 de la pizza", "5/8 de la pizza", "3/4 de la pizza"],
      ans: "3/8 de la pizza",
      hint: "El numerador es la cantidad de porciones comidas (3) y el denominador el total (8).",
    },
    {
      p: "Si comprás dos paquetes de 1/4 kg de café y un paquete de 1/2 kg, ¿cuánto café compraste en total?",
      opts: ["1 kg de café", "3/4 kg de café", "1 1/2 kg de café"],
      ans: "1 kg de café",
      hint: "Dos paquetes de 1/4 kg suman 1/2 kg. Sumado a otro 1/2 kg forman 1 kg entero.",
    },
    {
      p: "¿Cuántos octavos (1/8) forman medio kilo (1/2)?",
      opts: ["4 octavos", "2 octavos", "8 octavos"],
      ans: "4 octavos",
      hint: "Un medio equivale a 4 octavos (4/8 = 1/2).",
    },
    {
      p: "En una receta de cocina se piden 3/4 kg de harina. Si tenemos paquetes de 1/4 kg, ¿cuántos paquetes debemos usar?",
      opts: ["3 paquetes", "4 paquetes", "2 paquetes"],
      ans: "3 paquetes",
      hint: "3/4 son exactamente tres partes de 1/4.",
    },
    {
      p: "Si de una torta entera cortada en 4 porciones iguales queda solo 1 porción, ¿qué fracción se comió?",
      opts: ["3/4 de la torta", "1/4 de la torta", "2/4 de la torta"],
      ans: "3/4 de la torta",
      hint: "Si queda 1 de 4, se comieron las otras 3: 3/4.",
    },
    {
      p: "¿Cuál de las siguientes fracciones representa la MITAD exacta de una unidad?",
      opts: ["1/2", "1/4", "3/4"],
      ans: "1/2",
      hint: "1/2 significa una parte de dos iguales: la mitad.",
    },
  ];

  for (let i = 0; i < 8; i++) {
    const item = preguntas[i];
    const choices = shuffle([...item.opts]);
    acts.push(
      qToPick(
        q(
          item.p,
          choices.map((c) => ["🧉", c]),
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

  // Casos donde alfajores % chicos !== 0 (¡NUNCA 6/3 de alfajor!)
  const casosReparto = [
    { alfajores: 4, chicos: 3, frac: "4/3", mixto: "1 y 1/3" },
    { alfajores: 5, chicos: 3, frac: "5/3", mixto: "1 y 2/3" },
    { alfajores: 7, chicos: 5, frac: "7/5", mixto: "1 y 2/5" },
    { alfajores: 8, chicos: 5, frac: "8/5", mixto: "1 y 3/5" },
    { alfajores: 7, chicos: 6, frac: "7/6", mixto: "1 y 1/6" },
    { alfajores: 11, chicos: 6, frac: "11/6", mixto: "1 y 5/6" },
    { alfajores: 8, chicos: 3, frac: "8/3", mixto: "2 y 2/3" },
    { alfajores: 9, chicos: 5, frac: "9/5", mixto: "1 y 4/5" },
  ];

  for (let i = 0; i < 8; i++) {
    const { alfajores, chicos, frac } = casosReparto[i];
    const choices = distinctChoices(
      `${frac} de alfajor`,
      [`${alfajores + 1}/${chicos} de alfajor`, `${alfajores}/${chicos + 1} de alfajor`, `${chicos}/${alfajores} de alfajor`],
      3
    );
    acts.push(
      qToPick(
        q(
          `Se reparten ${alfajores} alfajores santacruceños entre ${chicos} chicos en partes iguales sin que sobre nada. ¿Cuánto le corresponde a cada uno?`,
          choices.map((c) => ["🍫", c]),
          choices.indexOf(`${frac} de alfajor`),
          `Pista: el resultado del reparto equitativo es la cantidad de alfajores sobre la cantidad de chicos (${frac}).`
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
  const equivalencias: [string, string, string[]][] = [
    ["1/2", "2/4", ["3/5", "1/3"]],
    ["1/2", "4/8", ["3/8", "5/8"]],
    ["2/3", "4/6", ["3/6", "5/6"]],
    ["3/4", "6/8", ["5/8", "7/8"]],
    ["1/3", "2/6", ["3/8", "1/4"]],
    ["2/5", "4/10", ["3/10", "5/10"]],
    ["3/5", "6/10", ["5/10", "7/10"]],
    ["1/4", "2/8", ["3/8", "1/6"]],
    ["4/5", "8/10", ["7/10", "9/10"]],
    ["1/5", "2/10", ["3/10", "1/8"]],
  ];

  const shuffledPairs = shuffle([...equivalencias]);
  for (let i = 0; i < 8; i++) {
    const [base, equiv, fakes] = shuffledPairs[i];
    const choices = distinctChoices(equiv, fakes, 3);
    acts.push(
      qToPick(
        q(
          `¿Cuál de las siguientes fracciones es EQUIVALENTE a ${base}?`,
          choices.map((c) => ["🍰", c]),
          choices.indexOf(equiv),
          "Pista: multiplicá o dividí el numerador y el denominador por el mismo número."
        ),
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
  ];

  const shuffledList = shuffle([...mixtos]);
  for (let i = 0; i < 8; i++) {
    const [impropia, mixto, fakes] = shuffledList[i];
    const choices = distinctChoices(mixto, fakes, 3);
    acts.push(
      qToPick(
        q(
          `Para cocinar tortas fritas se usaron ${impropia} kg de harina. ¿Cómo se expresa esa cantidad como número mixto?`,
          choices.map((c) => ["🥖", `${c} kg`]),
          choices.indexOf(mixto),
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

  // Variedad de actividades de ordenar y de selección sobre la recta
  const ordenes = [
    {
      id: "ord-1",
      prompt: "Ordená estas fracciones con denominador 4 de MENOR a MAYOR:",
      items: ["1/4", "1/2", "3/4", "5/4"],
      hint: "1/4 es un cuarto, 1/2 son dos cuartos, 3/4 son tres cuartos y 5/4 supera la unidad.",
    },
    {
      id: "ord-2",
      prompt: "Ordená estas fracciones de MENOR a MAYOR:",
      items: ["1/8", "1/4", "1/2", "1"],
      hint: "Un octavo es la parte más chica, luego un cuarto, luego medio y finalmente el entero.",
    },
    {
      id: "ord-3",
      prompt: "Ordená estas fracciones con tercios de MENOR a MAYOR:",
      items: ["1/3", "2/3", "1", "4/3"],
      hint: "1/3 es menor que 2/3; 3/3 es 1 entero; 4/3 es mayor que 1.",
    },
  ];

  const preguntasRecta = [
    {
      p: "¿Qué fracción se ubica exactamente a mitad de camino entre 0 y 1 en la recta numérica?",
      opts: ["1/2", "1/4", "3/4"],
      ans: "1/2",
      hint: "La mitad justa entre 0 y 1 es 1/2.",
    },
    {
      p: "¿Cuál de las siguientes fracciones se ubica a la DERECHA del 1 (es mayor que 1) en la recta numérica?",
      opts: ["5/4", "3/4", "2/4"],
      ans: "5/4",
      hint: "Cuando el numerador es mayor que el denominador, la fracción es mayor que 1.",
    },
    {
      p: "¿Entre qué dos números enteros se ubica la fracción 7/4 en la recta numérica?",
      opts: ["Entre 1 y 2", "Entre 0 y 1", "Entre 2 y 3"],
      ans: "Entre 1 y 2",
      hint: "7/4 equivale a 1 entero y 3/4 (1 3/4), por lo que está entre 1 y 2.",
    },
    {
      p: "¿Cuál de estas fracciones está más CERCA del 0 en la recta numérica?",
      opts: ["1/8", "1/4", "1/2"],
      ans: "1/8",
      hint: "Al dividir el entero en 8 partes, cada parte (1/8) es más pequeña y está más cerca del 0.",
    },
    {
      p: "¿Qué fracción se encuentra ubicada entre 1/2 y 1 en la recta numérica?",
      opts: ["3/4", "1/4", "5/4"],
      ans: "3/4",
      hint: "3/4 es mayor que 1/2 (2/4) y menor que 1 (4/4).",
    },
  ];

  // Armar 8 actividades variadas sin repetir
  acts.push(makeOrder(`m42019-${ordenes[0].id}`, ordenes[0].prompt, ordenes[0].items, ordenes[0].hint, skills));
  acts.push(makeOrder(`m42019-${ordenes[1].id}`, ordenes[1].prompt, ordenes[1].items, ordenes[1].hint, skills));
  acts.push(makeOrder(`m42019-${ordenes[2].id}`, ordenes[2].prompt, ordenes[2].items, ordenes[2].hint, skills));

  for (let i = 0; i < 5; i++) {
    const item = preguntasRecta[i];
    const choices = shuffle([...item.opts]);
    acts.push(
      qToPick(
        q(
          item.p,
          choices.map((c) => ["📍", c]),
          choices.indexOf(item.ans),
          item.hint
        ),
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
  for (let i = 0; i < 8; i++) {
    if (i % 3 === 0) {
      // Dinero cotidiano con centavos en formato argentino ($12,50, $25,75)
      const pesos = randInt(5, 50);
      const centavos = pickOne([10, 25, 50, 75]);
      const centStr = centavos < 10 ? "0" + centavos : String(centavos);
      const target = `$${pesos},${centStr}`;
      const fake1 = `$${pesos + 1},${centStr}`;
      const fake2 = `$${pesos},${(centavos + 20) % 100 || 80}`;
      const choices = distinctChoices(target, [fake1, fake2, `$${pesos + 2},${centStr}`], 3);
      const dinEscenarios = [
        `En el almacén de barrio, un alfajor cuesta ${pesos} pesos con ${centavos} centavos. ¿Cómo se escribe en número decimal?`,
        `En la librería escolar, un cuaderno cuesta ${pesos} pesos con ${centavos} centavos. ¿Cómo se escribe su precio decimal?`,
        `En la panadería artesanal, un pan casero cuesta ${pesos} pesos con ${centavos} centavos. ¿Cuál es su expresión decimal?`,
      ];
      const prText = dinEscenarios[Math.floor(i / 3) % dinEscenarios.length];
      acts.push(
        qToPick(
          q(
            prText,
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
      // Longitud en metros y centímetros (1,25 m, 2,50 m)
      const m = randInt(1, 3);
      const cm = pickOne([15, 25, 40, 50, 75, 80]);
      const decStr = `${m},${cm < 10 ? "0" + cm : cm} m`;
      const fake1 = `${m + 1},${cm < 10 ? "0" + cm : cm} m`;
      const fake2 = `${m},${(cm + 20) % 100 || 60} m`;
      const choices = distinctChoices(decStr, [fake1, fake2, `${m * 10 + cm} m`], 3);
      const longEscenarios = [
        `Una tabla de lenga fueguina mide ${m} metros y ${cm} centímetros de largo. ¿Cuál es su medida expresada en metros con coma decimal?`,
        `Un rollo de alambre de campo mide ${m} metros y ${cm} centímetros. ¿Cómo se escribe esa longitud en metros con coma?`,
        `Una soga para trekking mide ${m} metros y ${cm} centímetros de extensión. ¿Cuál es su medida expresada en metros decimales?`,
      ];
      const prText = longEscenarios[Math.floor(i / 3) % longEscenarios.length];
      acts.push(
        qToPick(
          q(
            prText,
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
      // Milésimos
      const milesimosPreguntas = [
        {
          p: "¿Cómo se escribe 'cinco milésimos' en número decimal?",
          ans: "0,005",
          fakes: ["0,05", "0,5", "0,0005"],
          hint: "Los milésimos ocupan el tercer lugar después de la coma.",
        },
        {
          p: "¿Cuántos milésimos se necesitan para formar 1 centésimo (0,01)?",
          ans: "10 milésimos",
          fakes: ["100 milésimos", "5 milésimos", "1000 milésimos"],
          hint: "Cada posición decimal es 10 veces mayor que la que tiene a la derecha.",
        },
        {
          p: "En el número decimal 3,487, ¿qué cifra ocupa el lugar de los MILÉSIMOS?",
          ans: "La cifra 7",
          fakes: ["La cifra 8", "La cifra 4", "La cifra 3"],
          hint: "El primer lugar tras la coma es décimos (4), el segundo centésimos (8) y el tercero milésimos (7).",
        },
      ];
      const item = milesimosPreguntas[i % milesimosPreguntas.length];
      const choices = distinctChoices(item.ans, item.fakes, 3);
      acts.push(
        qToPick(
          q(
            item.p,
            choices.map((c) => ["🔬", c]),
            choices.indexOf(item.ans),
            item.hint
          ),
          `m42021-mil-${i}`,
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
      const resStr = String(res).replace(".", ",");
      const fake1 = String(res / 10).replace(".", ",");
      const fake2 = String(res * 10).replace(".", ",");
      const choices = distinctChoices(resStr, [fake1, fake2, String(res + 5).replace(".", ",")], 3);
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
      const resStr = String(res).replace(".", ",");
      const fake1 = String(res * 10).replace(".", ",");
      const fake2 = String(res / 10).replace(".", ",");
      const choices = distinctChoices(resStr, [fake1, fake2, String(res + 1).replace(".", ",")], 3);
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
  for (let i = 0; i < 8; i++) {
    if (i % 2 === 0) {
      // Suma de decimales
      const p1 = randInt(120, 350) + 0.5;
      const p2 = randInt(80, 200) + 0.5;
      const total = p1 + p2;
      const totalStr = `$${total.toFixed(2).replace(".", ",")}`;
      const fake1 = `$${(total + 10).toFixed(2).replace(".", ",")}`;
      const fake2 = `$${(total - 10).toFixed(2).replace(".", ",")}`;
      const choices = distinctChoices(totalStr, [fake1, fake2, `$${(total + 5).toFixed(2).replace(".", ",")}`], 3);

      acts.push(
        qToPick(
          q(
            `En la librería escolar, Lucía compró un cuaderno a $${p1.toFixed(2).replace(".", ",")} y una cartuchera a $${p2.toFixed(2).replace(".", ",")}. ¿Cuánto gastó en total?`,
            choices.map((c) => ["🧾", c]),
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
      const billete = 500;
      const gasto = randInt(210, 380) + 0.5;
      const vuelto = billete - gasto;
      const vueltoStr = `$${vuelto.toFixed(2).replace(".", ",")}`;
      const fake1 = `$${(vuelto + 10).toFixed(2).replace(".", ",")}`;
      const fake2 = `$${(vuelto - 10).toFixed(2).replace(".", ",")}`;
      const choices = distinctChoices(vueltoStr, [fake1, fake2, `$${(vuelto + 5).toFixed(2).replace(".", ",")}`], 3);

      acts.push(
        qToPick(
          q(
            `En el quiosco, Joaquín hizo una compra por $${gasto.toFixed(2).replace(".", ",")} y pagó con un billete de $${billete}. ¿Cuánto dinero le dieron de vuelto?`,
            choices.map((c) => ["💵", c]),
            choices.indexOf(vueltoStr),
            `Pista: restá el gasto al billete ($${billete},00 - $${gasto.toFixed(2).replace(".", ",")}).`
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

  acts.push(
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
    )
  );

  const preguntas = [
    {
      p: "¿Cómo se llaman dos rectas que, por más que se prolonguen en el plano, nunca se cruzan ni se tocan?",
      ans: "Rectas paralelas",
      fakes: ["Rectas perpendiculares", "Rectas secantes oblicuas"],
      hint: "Tienen siempre la misma distancia entre sí, como los rieles de un tren.",
    },
    {
      p: "¿Cómo se llaman dos rectas que al cruzarse forman cuatro ángulos rectos de 90° exactos?",
      ans: "Rectas perpendiculares",
      fakes: ["Rectas paralelas", "Rectas secantes oblicuas"],
      hint: "Forman una cruz perfecta que se comprueba con la escuadra.",
    },
    {
      p: "¿Cómo se llaman dos rectas que se cortan en un punto pero NO forman ángulos rectos de 90°?",
      ans: "Rectas secantes oblicuas",
      fakes: ["Rectas perpendiculares", "Rectas paralelas"],
      hint: "Se cortan de manera inclinada, formando dos ángulos agudos y dos obtusos.",
    },
    {
      p: "¿Qué instrumento de geometría es el más adecuado para trazar y verificar ángulos rectos entre rectas perpendiculares?",
      ans: "La escuadra",
      fakes: ["El compás", "La cinta métrica"],
      hint: "La escuadra tiene un ángulo recto de 90° que coincide con la esquina.",
    },
    {
      p: "Los bordes opuestos de una ventana rectangular son un ejemplo de:",
      ans: "Líneas paralelas",
      fakes: ["Líneas perpendiculares", "Líneas curvas"],
      hint: "Mantienen la misma distancia a lo largo de todo su recorrido.",
    },
    {
      p: "El marco de un cuadro en la unión de su lado superior con el lado lateral forma:",
      ans: "Ángulo recto de 90°",
      fakes: ["Ángulo agudo de 45°", "Ángulo obtuso de 135°"],
      hint: "Los dos lados adyacentes de un rectángulo son perpendiculares.",
    },
    {
      p: "Si dos rectas en un mapa se cortan formando una 'X' inclinada, ¿qué tipo de rectas son?",
      ans: "Secantes oblicuas",
      fakes: ["Paralelas", "Perpendiculares"],
      hint: "Se cortan pero sus ángulos no son de 90°.",
    },
  ];

  for (let i = 0; i < 7; i++) {
    const item = preguntas[i];
    const choices = distinctChoices(item.ans, item.fakes, 3);
    acts.push(
      qToPick(
        q(
          item.p,
          choices.map((c) => ["📐", c]),
          choices.indexOf(item.ans),
          item.hint
        ),
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

  acts.push(
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
    )
  );

  const angulos = [
    { deg: 90, tipo: "Ángulo recto", hint: "Mide exactamente 90°, como la esquina de una hoja." },
    { deg: 45, tipo: "Ángulo agudo", hint: "Mide menos de 90°." },
    { deg: 120, tipo: "Ángulo obtuso", hint: "Mide más de 90° y menos de 180°." },
    { deg: 180, tipo: "Ángulo llano", hint: "Mide exactamente 180°, equivalente a dos rectos." },
    { deg: 60, tipo: "Ángulo agudo", hint: "Mide menos de 90°." },
    { deg: 135, tipo: "Ángulo obtuso", hint: "Mide más de 90°." },
    { deg: 25, tipo: "Ángulo agudo", hint: "Es muy cerrado, mide menos de 90°." },
  ];

  for (let i = 0; i < 7; i++) {
    const item = angulos[i];
    const choices = distinctChoices(item.tipo, ["Ángulo agudo", "Ángulo recto", "Ángulo obtuso", "Ángulo llano"], 3);
    acts.push(
      qToPick(
        q(
          `Si al medir con el transportador la abertura de una figura encontramos exactamente ${item.deg}°, ¿qué clase de ángulo es?`,
          choices.map((c) => ["🧭", c]),
          choices.indexOf(item.tipo),
          item.hint
        ),
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

  acts.push(
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
    )
  );

  const preguntasTriangulos = [
    {
      p: "Un banderín de campamento tiene dos lados de 25 cm y un lado de 15 cm. ¿Cómo se clasifica por sus LADOS?",
      ans: "Triángulo isósceles",
      fakes: ["Triángulo equilátero", "Triángulo escaleno"],
      hint: "El triángulo que tiene exactamente dos lados de igual longitud es isósceles.",
    },
    {
      p: "Una señal de tránsito triangular de 'Ceda el paso' tiene sus tres lados de 60 cm cada uno. ¿Cómo se clasifica por sus LADOS?",
      ans: "Triángulo equilátero",
      fakes: ["Triángulo isósceles", "Triángulo escaleno"],
      hint: "Cuando los tres lados miden lo mismo, es equilátero.",
    },
    {
      p: "Un triángulo tiene un ángulo recto de 90°. ¿Cómo se clasifica según sus ÁNGULOS?",
      ans: "Triángulo rectángulo",
      fakes: ["Triángulo acutángulo", "Triángulo obtusángulo"],
      hint: "El triángulo que posee un ángulo recto se llama rectángulo.",
    },
    {
      p: "Si los tres ángulos interiores de un triángulo son menores a 90° (agudos), ¿cómo se clasifica según sus ÁNGULOS?",
      ans: "Triángulo acutángulo",
      fakes: ["Triángulo rectángulo", "Triángulo obtusángulo"],
      hint: "Acutángulo viene de agudo: sus tres ángulos son agudos.",
    },
    {
      p: "Un triángulo tiene un ángulo de 120° (obtuso). ¿Cómo se clasifica según sus ÁNGULOS?",
      ans: "Triángulo obtusángulo",
      fakes: ["Triángulo rectángulo", "Triángulo acutángulo"],
      hint: "Si tiene un ángulo mayor a 90°, es un triángulo obtusángulo.",
    },
    {
      p: "¿Cuánto suman SIEMPRE los tres ángulos interiores de cualquier triángulo?",
      ans: "180°",
      fakes: ["90°", "360°"],
      hint: "En cualquier triángulo, la suma de sus tres ángulos interiores siempre es igual a dos ángulos rectos: 180°.",
    },
    {
      p: "Un cantero de flores tiene forma triangular con lados de 2 m, 3 m y 4 m. ¿Cómo se clasifica por sus LADOS?",
      ans: "Triángulo escaleno",
      fakes: ["Triángulo isósceles", "Triángulo equilátero"],
      hint: "Sus tres lados tienen longitudes distintas: es escaleno.",
    },
  ];

  for (let i = 0; i < 7; i++) {
    const item = preguntasTriangulos[i];
    const choices = distinctChoices(item.ans, item.fakes, 3);
    acts.push(
      qToPick(
        q(
          item.p,
          choices.map((c) => ["📐", c]),
          choices.indexOf(item.ans),
          item.hint
        ),
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

  acts.push(
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
    )
  );

  const preguntasGeo = [
    {
      p: "¿Cuántas caras, aristas y vértices tiene un cubo?",
      ans: "6 caras, 12 aristas y 8 vértices",
      fakes: ["4 caras, 8 aristas y 4 vértices", "8 caras, 12 aristas y 6 vértices"],
      hint: "Tiene 6 caras planas cuadradas, 12 bordes (aristas) y 8 esquinas (vértices).",
    },
    {
      p: "¿Qué cuadrilátero tiene sus cuatro lados iguales y sus cuatro ángulos rectos de 90°?",
      ans: "El cuadrado",
      fakes: ["El rectángulo", "El rombo"],
      hint: "El cuadrado reúne los cuatro lados iguales y cuatro ángulos rectos.",
    },
    {
      p: "¿En qué se diferencian un rectángulo y un cuadrado?",
      ans: "El rectángulo tiene lados opuestos iguales, no los cuatro iguales",
      fakes: ["El rectángulo no tiene ángulos rectos", "El cuadrado tiene 5 lados"],
      hint: "Ambos tienen 4 ángulos rectos, pero en el rectángulo los lados consecutivos no miden lo mismo.",
    },
    {
      p: "¿Cómo se llama el cuadrilátero que tiene solo UN par de lados opuestos paralelos?",
      ans: "Trapecio",
      fakes: ["Paralelogramo", "Trapezoide"],
      hint: "El trapecio tiene dos bases paralelas y otros dos lados no paralelos.",
    },
    {
      p: "¿Cómo se llama la línea donde se unen dos caras de un cuerpo geométrico?",
      ans: "Arista",
      fakes: ["Vértice", "Diagonal"],
      hint: "La arista es el borde común donde se juntan dos caras.",
    },
    {
      p: "¿Cómo se llama el punto de encuentro donde coinciden tres o más aristas de un prisma?",
      ans: "Vértice",
      fakes: ["Cara", "Base"],
      hint: "El vértice es la 'esquina' del cuerpo geométrico.",
    },
    {
      p: "¿Qué forma tienen las 6 caras de un prisma rectangular recto (caja de zapatos)?",
      ans: "Rectángulos",
      fakes: ["Círculos", "Triángulos"],
      hint: "Sus caras laterales y bases son figuras rectangulares.",
    },
  ];

  for (let i = 0; i < 7; i++) {
    const item = preguntasGeo[i];
    const choices = distinctChoices(item.ans, item.fakes, 3);
    acts.push(
      qToPick(
        q(
          item.p,
          choices.map((c) => ["🧊", c]),
          choices.indexOf(item.ans),
          item.hint
        ),
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

  // Perímetro
  const largo = randInt(15, 35);
  const ancho = randInt(8, 20);
  const perim = 2 * largo + 2 * ancho;
  acts.push(
    makeInput(
      "m42028-perim",
      `Una huerta comunitaria en Los Antiguos mide ${largo} metros de largo por ${ancho} metros de ancho. ¿Cuántos metros de alambre se necesitan para dar una vuelta completa a su perímetro?`,
      perim,
      `Pista: sumá los cuatro lados (${largo} + ${largo} + ${ancho} + ${ancho}).`,
      skills
    )
  );

  // Superficie / Área
  const baseArea = randInt(6, 12);
  const altArea = randInt(4, 8);
  const area = baseArea * altArea;
  acts.push(
    makeInput(
      "m42028-area",
      `El piso de una carpa de investigación en El Chaltén tiene ${baseArea} metros de largo por ${altArea} metros de ancho. ¿Cuál es su superficie en metros cuadrados (m²)?`,
      area,
      `Pista: multiplicá el largo por el ancho (${baseArea} × ${altArea}).`,
      skills
    )
  );

  // Peso / Masa
  const kg = pickOne([2, 3, 5]);
  const g = kg * 1000;
  const choicesPeso = distinctChoices(`${g.toLocaleString("es-AR")} gramos`, [`${(kg * 100).toLocaleString("es-AR")} gramos`, `${(kg * 10).toLocaleString("es-AR")} gramos`], 3);
  acts.push(
    qToPick(
      q(
        `Una bolsa de lana esquilada en una estancia de Santa Cruz pesa ${kg} kilogramos. ¿A cuántos gramos equivale?`,
        choicesPeso.map((c) => ["⚖️", c]),
        choicesPeso.indexOf(`${g.toLocaleString("es-AR")} gramos`),
        "Pista: 1 kilogramo equivale exactamente a 1.000 gramos."
      ),
      "m42028-peso",
      "",
      skills
    )
  );

  // Capacidad
  const litros = pickOne([2, 3, 4]);
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

  // Tiempo realista en Santa Cruz (Río Gallegos a Comandante Luis Piedra Buena: ~235 km, ~3 horas)
  const horasViaje = 3;
  const minutosViaje = horasViaje * 60;
  const choicesTiempo = distinctChoices(`${minutosViaje} minutos`, [`${minutosViaje - 30} minutos`, `${minutosViaje + 60} minutos`], 3);
  acts.push(
    qToPick(
      q(
        `El viaje en colectivo de larga distancia desde Río Gallegos hasta Comandante Luis Piedra Buena (235 km por Ruta 3) demora aproximadamente ${horasViaje} horas. ¿A cuántos minutos equivale ese viaje?`,
        choicesTiempo.map((c) => ["⏱️", c]),
        choicesTiempo.indexOf(`${minutosViaje} minutos`),
        `Pista: cada hora tiene 60 minutos. Multiplicá ${horasViaje} × 60.`
      ),
      "m42028-tiempo",
      "",
      skills
    )
  );

  // Minutos a segundos
  const min = pickOne([2, 3, 5]);
  const seg = min * 60;
  const choicesSeg = distinctChoices(`${seg} segundos`, [`${seg - 20} segundos`, `${seg + 30} segundos`], 3);
  acts.push(
    qToPick(
      q(
        `Durante un recreo escolar pasaron ${min} minutos. ¿Cuántos segundos duró ese tiempo?`,
        choicesSeg.map((c) => ["⏳", c]),
        choicesSeg.indexOf(`${seg} segundos`),
        `Pista: cada minuto tiene 60 segundos. Multiplicá ${min} × 60.`
      ),
      "m42028-seg",
      "",
      skills
    )
  );

  // Capacidad fraccionaria (medio litro y cuarto litro)
  const choicesVasos = distinctChoices("4 vasos", ["2 vasos", "8 vasos"], 3);
  acts.push(
    qToPick(
      q(
        `Si un vaso tiene una capacidad de 250 ml (1/4 de litro), ¿cuántos vasos se pueden llenar con una jarra de 1 litro?`,
        choicesVasos.map((c) => ["🥛", c]),
        choicesVasos.indexOf("4 vasos"),
        "Pista: 1.000 ml ÷ 250 ml = 4 vasos."
      ),
      "m42028-vasos",
      "",
      skills
    )
  );

  // Estadística: lectura de tabla o gráfico
  const diaMax = "Jueves (18 °C)";
  const choicesEst = distinctChoices(diaMax, ["Martes (15 °C)", "Viernes (14 °C)"], 3);
  acts.push(
    qToPick(
      q(
        `En una tabla de temperaturas máximas en Río Gallegos se anotó:\nLunes: 12 °C — Martes: 15 °C — Miércoles: 10 °C — Jueves: 18 °C — Viernes: 14 °C.\n¿Qué día se registró la temperatura MÁS ALTA?`,
        choicesEst.map((c) => ["📊", c]),
        choicesEst.indexOf(diaMax),
        "Pista: compará los números de la tabla y buscá el valor mayor."
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
