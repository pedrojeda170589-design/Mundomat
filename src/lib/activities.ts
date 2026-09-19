import { WorldDef } from "@/types";

export type ShapeKind = "circulo" | "cuadrado" | "rectangulo" | "triangulo";

export const SHAPES: { kind: ShapeKind; label: string; sides: number }[] = [
  { kind: "circulo", label: "Círculo", sides: 0 },
  { kind: "cuadrado", label: "Cuadrado", sides: 4 },
  { kind: "rectangulo", label: "Rectángulo", sides: 4 },
  { kind: "triangulo", label: "Triángulo", sides: 3 },
];

export type ActivitySpec =
  | {
      type: "mc";
      id: string;
      title: string;
      prompt: string;
      choices: string[];
      answerIndex: number;
      hint: string;
    }
  | {
      type: "full-table-review";
      id: string;
      title: string;
      table: number;
      facts: { a: number; b: number }[];
      hint: string;
    }
  | {
      type: "input";
      id: string;
      title: string;
      prompt: string;
      answer: number;
      hint: string;
    }
  | {
      type: "shape-identify";
      id: string;
      title: string;
      prompt: string;
      shape: ShapeKind;
      choices: ShapeKind[];
      answerIndex: number;
      hint: string;
    }
  | {
      type: "timed";
      id: string;
      title: string;
      seconds: number;
      questions: { prompt: string; choices: string[]; answerIndex: number }[];
      hint: string;
    }
  | {
      type: "order";
      id: string;
      title: string;
      prompt: string;
      items: string[];
      correctOrder: number[];
      hint: string;
    }
  | {
      type: "match";
      id: string;
      title: string;
      prompt: string;
      pairs: { left: string; right: string }[];
      hint: string;
    }
  | {
      type: "classify";
      id: string;
      title: string;
      prompt: string;
      categories: string[];
      items: { label: string; categoryIndex: number }[];
      hint: string;
    }
  | {
      type: "true-false";
      id: string;
      title: string;
      statement: string;
      isTrue: boolean;
      justification?: { prompt: string; choices: string[]; answerIndex: number };
      hint: string;
    }
  | {
      type: "find-error";
      id: string;
      title: string;
      prompt: string;
      resolution: string;
      choices: string[];
      answerIndex: number;
      correctAnswer?: string;
      hint: string;
    };

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[randInt(0, arr.length - 1)];
}

function mcFromAnswer(
  id: string,
  title: string,
  prompt: string,
  correct: number,
  hint: string,
  spread = 5
): ActivitySpec {
  const choicesSet = new Set<number>([correct]);
  while (choicesSet.size < 4) {
    const delta = randInt(-spread, spread);
    const candidate = correct + delta;
    if (candidate >= 0 && candidate !== correct) choicesSet.add(candidate);
  }
  const choicesNums = shuffle(Array.from(choicesSet));
  const answerIndex = choicesNums.indexOf(correct);
  return {
    type: "mc",
    id,
    title,
    prompt,
    choices: choicesNums.map(String),
    answerIndex,
    hint,
  };
}

function buildOrderActivity(
  id: string,
  title: string,
  prompt: string,
  values: number[],
  hint: string
): ActivitySpec {
  const shuffled = shuffle(values.map((v, i) => ({ v, i })));
  const items = shuffled.map((x) => String(x.v));
  const correctOrder = items
    .map((_, i) => i)
    .sort((a, b) => Number(items[a]) - Number(items[b]));
  return { type: "order", id, title, prompt, items, correctOrder, hint };
}

// Variante genérica para ordenar textos (no números) según una secuencia
// correcta ya conocida (por ejemplo, los pasos de una historia).
function buildOrderFromSequence(
  id: string,
  title: string,
  prompt: string,
  correctSequence: string[],
  hint: string
): ActivitySpec {
  const n = correctSequence.length;
  const positions = shuffle(Array.from({ length: n }, (_, i) => i));
  const items = positions.map((origIdx) => correctSequence[origIdx]);
  const correctOrder = Array.from({ length: n }, (_, k) =>
    positions.indexOf(k)
  );
  return { type: "order", id, title, prompt, items, correctOrder, hint };
}

// ---------------------------------------------------------------------------
// Mundo 1: números — lectura, escritura, orden y valor posicional
// ---------------------------------------------------------------------------

const NUMEROS_EN_PALABRAS: [number, string][] = [
  [120, "ciento veinte"],
  [215, "doscientos quince"],
  [340, "trescientos cuarenta"],
  [456, "cuatrocientos cincuenta y seis"],
  [508, "quinientos ocho"],
  [671, "seiscientos setenta y uno"],
  [790, "setecientos noventa"],
  [815, "ochocientos quince"],
  [999, "novecientos noventa y nueve"],
  [1000, "mil"],
  [1250, "mil doscientos cincuenta"],
];

function buildNumerosActivities(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];

  // 1-2: reconocimiento — valor posicional
  for (let i = 0; i < 2; i++) {
    const n = randInt(100, 999);
    const digits = String(n).split("").map(Number);
    const posIdx = i === 0 ? 0 : 1; // centenas, luego decenas
    const posName = posIdx === 0 ? "centenas" : "decenas";
    acts.push(
      mcFromAnswer(
        `numeros-pos-${i}`,
        `Actividad ${i + 1}`,
        `En el número ${n}, ¿qué dígito está en el lugar de las ${posName}?`,
        digits[posIdx],
        `Pista: en ${n}, de izquierda a derecha están las centenas, las decenas y las unidades.`,
        3
      )
    );
  }

  // 3: práctica — ordenar de menor a mayor
  const toOrder = Array.from({ length: 5 }, () => randInt(100, 999));
  acts.push(
    buildOrderActivity(
      "numeros-orden",
      "Actividad 3",
      "Tocá los números en orden, del menor al mayor.",
      toOrder,
      "Pista: fijate primero en la cifra de las centenas de cada número."
    )
  );

  // 4: situación — en el kiosco de la escuela, separar lo que cuesta menos
  // de $500 de lo que cuesta $500 o más (aplica valor posicional a un caso
  // real: leer un precio y decidir en qué grupo va).
  const kioscoProductos = shuffle([
    "Alfajor",
    "Gaseosa chica",
    "Cuaderno",
    "Lápiz de colores",
    "Mochila",
    "Pelota",
    "Remera",
    "Figuritas",
  ]).slice(0, 6);
  const classifyNums = Array.from({ length: 6 }, () => randInt(100, 999));
  acts.push({
    type: "classify",
    id: "numeros-clasificar",
    title: "Actividad 4",
    prompt:
      "Estás ayudando en el kiosco de la escuela. Separá los productos según su precio.",
    categories: ["Cuesta menos de $500", "Cuesta $500 o más"],
    items: classifyNums.map((n, i) => ({
      label: `${kioscoProductos[i]} - $${n}`,
      categoryIndex: n < 500 ? 0 : 1,
    })),
    hint: "Pista: compará primero la cifra de las centenas del precio con el 5.",
  });

  // 5: práctica — palabras a cifras
  const [numA, wordsA] = pick(NUMEROS_EN_PALABRAS);
  const distractoresA = shuffle(
    NUMEROS_EN_PALABRAS.filter(([n]) => n !== numA)
  ).slice(0, 3);
  const choicesA = shuffle([numA, ...distractoresA.map(([n]) => n)]);
  acts.push({
    type: "mc",
    id: "numeros-palabras-1",
    title: "Actividad 5",
    prompt: `¿Cómo se escribe en cifras el número "${wordsA}"?`,
    choices: choicesA.map(String),
    answerIndex: choicesA.indexOf(numA),
    hint: "Pista: pensá primero cuántas centenas tiene.",
  });

  // 6: práctica — cifras a palabras
  let [numB, wordsB] = pick(NUMEROS_EN_PALABRAS);
  while (numB === numA) [numB, wordsB] = pick(NUMEROS_EN_PALABRAS);
  const distractoresB = shuffle(
    NUMEROS_EN_PALABRAS.filter(([n]) => n !== numB)
  ).slice(0, 3);
  const choicesB = shuffle([wordsB, ...distractoresB.map(([, w]) => w)]);
  acts.push({
    type: "mc",
    id: "numeros-palabras-2",
    title: "Actividad 6",
    prompt: `¿Cómo se dice el número ${numB}?`,
    choices: choicesB,
    answerIndex: choicesB.indexOf(wordsB),
    hint: "Pista: leélo en voz alta, de a una cifra por vez.",
  });

  // 7: aplicación — composición aditiva
  const c = randInt(1, 9);
  const d = randInt(0, 9);
  const u = randInt(0, 9);
  acts.push({
    type: "input",
    id: "numeros-composicion",
    title: "Actividad 7",
    prompt: `¿Qué número forman ${c * 100} + ${d * 10} + ${u}?`,
    answer: c * 100 + d * 10 + u,
    hint: `Pista: ${c * 100} tiene ${c} centenas, ${d * 10} tiene ${d} decenas, y quedan ${u} unidades sueltas.`,
  });

  // 8: aplicación — regularidades de la serie numérica
  const isNext = Math.random() < 0.5;
  const base = pick([99, 199, 299, 499, 699, 999]);
  acts.push({
    type: "input",
    id: "numeros-serie",
    title: "Actividad 8",
    prompt: isNext
      ? `¿Qué número va justo después de ${base}?`
      : `¿Qué número va justo antes de ${base + 1}?`,
    answer: isNext ? base + 1 : base,
    hint: "Pista: fijate qué pasa con las decenas y las centenas al pasar de un número redondo al siguiente.",
  });

  // 9: problema — detectar el error de valor posicional
  const errN = randInt(200, 999);
  const dCentenas = Math.floor(errN / 100);
  const dDecenas = Math.floor((errN % 100) / 10);
  acts.push({
    type: "find-error",
    id: "numeros-error",
    title: "Actividad 9",
    prompt: "Ana dijo esta frase sobre un número. Encontrá el error:",
    resolution: `"El número ${errN} tiene ${dCentenas} decenas."`,
    choices: [
      `Está mal: ${dCentenas} es la cantidad de centenas, no de decenas`,
      `Está mal: ${errN} no es un número real`,
      `Está mal: los números no tienen decenas`,
    ],
    answerIndex: 0,
    correctAnswer: `En ${errN}, la cifra de las decenas es ${dDecenas}.`,
    hint: "Pista: en un número de tres cifras, la del medio es la de las decenas.",
  });

  // 10: desafío final — comparar números de 4 cifras
  const bigA = randInt(1000, 1500);
  let bigB = randInt(1000, 1500);
  while (bigB === bigA) bigB = randInt(1000, 1500);
  const bigger = Math.max(bigA, bigB);
  const finalOpts = shuffle([bigA, bigB]);
  acts.push({
    type: "mc",
    id: "numeros-final",
    title: "Actividad 10: desafío final",
    prompt: `Desafío: ¿cuál de estos dos números es mayor, ${bigA} o ${bigB}?`,
    choices: finalOpts.map(String),
    answerIndex: finalOpts.indexOf(bigger),
    hint: "Pista: comparalos cifra por cifra, empezando por la de los miles.",
  });

  return acts;
}

// ---------------------------------------------------------------------------
// Mundo 2: sumas y restas — distintos sentidos (agregar, quitar, ganar, etc.)
// ---------------------------------------------------------------------------

function buildSumasRestasActivities(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];

  // 1-2: reconocimiento — qué operación corresponde
  acts.push({
    type: "mc",
    id: "sumasrestas-reconoce-1",
    title: "Actividad 1",
    prompt:
      "Tenías 8 figuritas y tu amiga te regaló 5 más. ¿Qué cálculo hacés para saber cuántas tenés ahora?",
    choices: ["8 + 5", "8 − 5"],
    answerIndex: 0,
    hint: "Pista: cuando ganás o te regalan algo, la cantidad aumenta.",
  });
  acts.push({
    type: "mc",
    id: "sumasrestas-reconoce-2",
    title: "Actividad 2",
    prompt:
      "Tenías 15 caramelos y le diste 6 a tu hermano. ¿Qué cálculo hacés para saber cuántos te quedan?",
    choices: ["15 + 6", "15 − 6"],
    answerIndex: 1,
    hint: "Pista: cuando das o perdés algo, la cantidad disminuye.",
  });

  // 3-4: práctica — cálculo directo
  const a1 = randInt(20, 79);
  const b1 = randInt(10, 20);
  acts.push({
    type: "input",
    id: "sumasrestas-practica-1",
    title: "Actividad 3",
    prompt: `${a1} + ${b1} = ?`,
    answer: a1 + b1,
    hint: "Pista: sumá primero las unidades y después las decenas.",
  });
  const a2 = randInt(40, 90);
  const b2 = randInt(10, a2 - 5);
  acts.push({
    type: "input",
    id: "sumasrestas-practica-2",
    title: "Actividad 4",
    prompt: `${a2} − ${b2} = ?`,
    answer: a2 - b2,
    hint: "Pista: restá primero las unidades y después las decenas.",
  });

  // 5: práctica — verdadero/falso
  acts.push({
    type: "true-false",
    id: "sumasrestas-vf",
    title: "Actividad 5",
    statement: "35 + 0 sigue siendo 35.",
    isTrue: true,
    justification: {
      prompt: "¿Por qué?",
      choices: [
        "Porque sumar 0 no cambia la cantidad",
        "Porque 0 es un número negativo",
      ],
      answerIndex: 0,
    },
    hint: "Pista: pensá qué pasa si a una torre de bloques no le agregás ni le sacás ninguno.",
  });

  // 6: aplicación — sentido "avanzar"
  const escalon = randInt(5, 20);
  const avanza = randInt(3, 10);
  acts.push({
    type: "input",
    id: "sumasrestas-avanzar",
    title: "Actividad 6",
    prompt: `Un caracol está en el escalón ${escalon} y avanza ${avanza} escalones más. ¿En qué escalón queda?`,
    answer: escalon + avanza,
    hint: `Pista: avanzar es sumar, hacé ${escalon} + ${avanza}.`,
  });

  // 7: aplicación — sentido "quitar"
  const tenia = randInt(30, 60);
  const regalo = randInt(10, 20);
  acts.push({
    type: "input",
    id: "sumasrestas-quitar",
    title: "Actividad 7",
    prompt: `Tenías ${tenia} caramelos y regalaste ${regalo}. ¿Cuántos te quedan?`,
    answer: tenia - regalo,
    hint: `Pista: regalar es quitar, hacé ${tenia} − ${regalo}.`,
  });

  // 8: problema — detectar el error
  const eA = randInt(20, 49);
  const eB = randInt(20, 49);
  const wrongResult = eA + eB + pick([-10, 10, 1, -1]);
  const rightResult = eA + eB;
  acts.push({
    type: "find-error",
    id: "sumasrestas-error",
    title: "Actividad 8",
    prompt: "Un compañero resolvió esta cuenta. Encontrá el error:",
    resolution: `${eA} + ${eB} = ${wrongResult}`,
    choices: [
      `Está mal sumado: el resultado correcto es ${rightResult}`,
      "Está mal planteado: debería ser una resta",
      "No hay ningún error",
    ],
    answerIndex: 0,
    correctAnswer: `${eA} + ${eB} = ${rightResult}`,
    hint: "Pista: volvé a sumar las unidades y las decenas por separado.",
  });

  // 9: problema — combina ganar y perder (dos sentidos en un problema)
  const tenia2 = randInt(30, 60);
  const gano = randInt(10, 30);
  const gasto = randInt(5, 20);
  acts.push({
    type: "input",
    id: "sumasrestas-combinado",
    title: "Actividad 9",
    prompt: `Marta tenía $${tenia2}. Ganó $${gano} vendiendo masitas y gastó $${gasto} en útiles. ¿Cuánto dinero tiene ahora?`,
    answer: tenia2 + gano - gasto,
    hint: "Pista: primero sumá lo que ganó, después restá lo que gastó.",
  });

  // 10: desafío final — contrarreloj
  const questions = Array.from({ length: 3 }, () => {
    const isAdd = Math.random() < 0.5;
    const x = randInt(15, 60);
    const y = randInt(10, isAdd ? 30 : x - 5);
    const correct = isAdd ? x + y : x - y;
    const choicesSet = new Set<number>([correct]);
    while (choicesSet.size < 3) {
      const cand = correct + randInt(-6, 6);
      if (cand >= 0 && cand !== correct) choicesSet.add(cand);
    }
    const choices = shuffle(Array.from(choicesSet));
    return {
      prompt: `${x} ${isAdd ? "+" : "−"} ${y} = ?`,
      choices: choices.map(String),
      answerIndex: choices.indexOf(correct),
    };
  });
  acts.push({
    type: "timed",
    id: "sumasrestas-final",
    title: "Actividad 10: contra el reloj",
    seconds: 30,
    questions,
    hint: "Pista: usá lo que ya practicaste en las actividades anteriores.",
  });

  return acts;
}

// ---------------------------------------------------------------------------
// Mundo 3: cálculo mental — sumas repetidas, conmutativa, estimación
// ---------------------------------------------------------------------------

function buildCalculoMentalActivities(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];

  // 1: reconocimiento — conmutativa
  const p = randInt(3, 9);
  const q = randInt(2, 8);
  const otros = shuffle([`${q}+${p}`, `${p}-${q}`, `${p}×${q}`]);
  acts.push({
    type: "mc",
    id: "calculo-conmutativa",
    title: "Actividad 1",
    prompt: `¿Cuál de estas cuentas da el mismo resultado que ${p} + ${q}?`,
    choices: otros,
    answerIndex: otros.indexOf(`${q}+${p}`),
    hint: "Pista: en una suma, el orden de los números no cambia el resultado.",
  });

  // 2: reconocimiento — suma repetida
  const rep = randInt(3, 6);
  const times = randInt(3, 4);
  acts.push({
    type: "input",
    id: "calculo-repetida-1",
    title: "Actividad 2",
    prompt: `${Array(times).fill(rep).join(" + ")} = ?`,
    answer: rep * times,
    hint: `Pista: es sumar ${rep} un total de ${times} veces.`,
  });

  // 3-4: práctica — secuencias y sumas repetidas
  const step = pick([2, 3, 5]);
  const startSeq = randInt(1, 5);
  const seq = Array.from({ length: 4 }, (_, i) => startSeq + i * step);
  acts.push({
    type: "input",
    id: "calculo-secuencia",
    title: "Actividad 3",
    prompt: `Completá la secuencia: ${seq.join(", ")}, ___`,
    answer: startSeq + 4 * step,
    hint: `Pista: cada número aumenta de a ${step}.`,
  });

  const rep2 = randInt(4, 8);
  const times2 = 5;
  acts.push({
    type: "input",
    id: "calculo-repetida-2",
    title: "Actividad 4",
    prompt: `Sumá ${rep2} un total de ${times2} veces. ¿Cuánto da?`,
    answer: rep2 * times2,
    hint: `Pista: ${rep2} + ${rep2} + ${rep2} + ${rep2} + ${rep2}.`,
  });

  // 5: práctica — clasificar
  const exprs = [
    { label: `4 + 4 + 4`, same: true },
    { label: `5 + 5 + 5 + 5`, same: true },
    { label: `3 + 6`, same: false },
    { label: `7 + 2 + 9`, same: false },
    { label: `2 + 2 + 2 + 2 + 2`, same: true },
    { label: `10 + 3`, same: false },
  ];
  acts.push({
    type: "classify",
    id: "calculo-clasificar",
    title: "Actividad 5",
    prompt: "Clasificá cada cuenta según corresponda.",
    categories: ["Suma de sumandos iguales", "Suma de sumandos distintos"],
    items: exprs.map((e) => ({
      label: e.label,
      categoryIndex: e.same ? 0 : 1,
    })),
    hint: "Pista: fijate si el mismo número se repite en toda la cuenta.",
  });

  // 6: situación — agrupar redondos para pagar en el kiosco (ejemplo de la
  // planificación, ahora con un caso real de compra).
  acts.push({
    type: "input",
    id: "calculo-redondos",
    title: "Actividad 6",
    prompt:
      "En el kiosco comprás una gaseosa a $30, un alfajor a $7, un cuaderno a $10 y un lápiz a $2. ¿Cuánto gastaste en total? (Pista: agrupá primero los números redondos)",
    answer: 49,
    hint: "Pista: 30 + 10 = 40, y 7 + 2 = 9. Después sumá 40 + 9.",
  });

  // 7: aplicación — estimación
  const eA = randInt(20, 39);
  const eB = randInt(20, 39);
  const exact = eA + eB;
  const estimates = [
    Math.round(exact / 10) * 10,
    Math.round(exact / 10) * 10 + 10,
    Math.round(exact / 10) * 10 - 10,
    Math.round(exact / 10) * 10 + 20,
  ];
  const uniqueEstimates = Array.from(new Set(estimates)).slice(0, 4);
  acts.push({
    type: "mc",
    id: "calculo-estimacion",
    title: "Actividad 7",
    prompt: `Sin calcular el resultado exacto, ¿cuál es la mejor estimación de ${eA} + ${eB}?`,
    choices: uniqueEstimates.map(String),
    answerIndex: uniqueEstimates.indexOf(Math.round(exact / 10) * 10),
    hint: "Pista: redondeá cada número a la decena más cercana antes de sumar.",
  });

  // 8: problema — verdadero/falso con justificación
  acts.push({
    type: "true-false",
    id: "calculo-vf",
    title: "Actividad 8",
    statement: "El orden de los sumandos no cambia el resultado de una suma.",
    isTrue: true,
    justification: {
      prompt: "¿Por qué?",
      choices: [
        "Porque la suma es conmutativa",
        "Porque todas las sumas dan 10",
      ],
      answerIndex: 0,
    },
    hint: "Pista: probá cambiando el orden en 3 + 5 y 5 + 3.",
  });

  // 9: problema — detectar el error en un cálculo mental
  const mErrA = pick([20, 30, 40, 50]);
  const mErrB = randInt(3, 9);
  const wrongMental = mErrA + mErrB + 10;
  acts.push({
    type: "find-error",
    id: "calculo-error",
    title: "Actividad 9",
    prompt: "Bruno calculó así. Encontrá el error:",
    resolution: `${mErrA} + ${mErrB} = ${wrongMental}`,
    choices: [
      `Está mal: ${mErrA} + ${mErrB} = ${mErrA + mErrB}`,
      "Está bien calculado",
    ],
    answerIndex: 0,
    correctAnswer: `${mErrA} + ${mErrB} = ${mErrA + mErrB}`,
    hint: "Pista: sumá solo las unidades de más y agregalas al número redondo.",
  });

  // 10: desafío — contrarreloj de cálculo mental con redondos
  const questions = Array.from({ length: 3 }, () => {
    const round = pick([10, 20, 30, 40, 50]);
    const extra = randInt(2, 9);
    const correct = round + extra;
    const choicesSet = new Set<number>([correct]);
    while (choicesSet.size < 3) {
      const cand = correct + randInt(-5, 5);
      if (cand >= 0 && cand !== correct) choicesSet.add(cand);
    }
    const choices = shuffle(Array.from(choicesSet));
    return {
      prompt: `${round} + ${extra} = ?`,
      choices: choices.map(String),
      answerIndex: choices.indexOf(correct),
    };
  });
  acts.push({
    type: "timed",
    id: "calculo-final",
    title: "Actividad 10: contra el reloj",
    seconds: 30,
    questions,
    hint: "Pista: sumá directamente el número suelto al número redondo.",
  });

  return acts;
}

// ---------------------------------------------------------------------------
// Mundo 4: espacio — ubicación, croquis y medición de longitud
// ---------------------------------------------------------------------------

function buildEspacioActivities(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];

  acts.push({
    type: "mc",
    id: "espacio-instrumento-1",
    title: "Actividad 1",
    prompt: "¿Qué instrumento usarías para medir el largo de tu banco?",
    choices: ["Una regla", "Una balanza", "Un reloj", "Un termómetro"],
    answerIndex: 0,
    hint: "Pista: pensá qué instrumento sirve para medir longitudes.",
  });

  acts.push({
    type: "mc",
    id: "espacio-equivalencia",
    title: "Actividad 2",
    prompt: "¿Cuántos centímetros tiene 1 metro?",
    choices: ["10", "100", "1.000", "1"],
    answerIndex: 1,
    hint: "Pista: un metro es una cinta larga dividida en 100 partes iguales.",
  });

  const metrosA = randInt(2, 6);
  acts.push({
    type: "input",
    id: "espacio-conversion",
    title: "Actividad 3",
    prompt: `Una soga mide ${metrosA} metros. ¿Cuántos centímetros mide?`,
    answer: metrosA * 100,
    hint: "Pista: cada metro son 100 centímetros.",
  });

  const largos = Array.from({ length: 5 }, () => randInt(10, 250));
  acts.push(
    buildOrderActivity(
      "espacio-orden",
      "Actividad 4",
      "Tocá las longitudes en orden, de la más corta a la más larga (en cm).",
      largos,
      "Pista: compará primero los números con más cifras."
    )
  );

  const objetosMedida = [
    { label: "Lápiz (15 cm)", short: true },
    { label: "Cuaderno (25 cm)", short: true },
    { label: "Pasillo de la escuela (800 cm)", short: false },
    { label: "Cancha de fútbol (10.000 cm)", short: false },
    { label: "Regla (20 cm)", short: true },
    { label: "Calle del barrio (5.000 cm)", short: false },
  ];
  acts.push({
    type: "classify",
    id: "espacio-clasificar",
    title: "Actividad 5",
    prompt: "Clasificá cada objeto según su longitud.",
    categories: ["Corto (se mide con regla)", "Largo (se mide con cinta métrica)"],
    items: objetosMedida.map((o) => ({
      label: o.label,
      categoryIndex: o.short ? 0 : 1,
    })),
    hint: "Pista: si es más largo que tu banco, probablemente sea 'largo'.",
  });

  const caminoTotal = randInt(120, 200);
  const caminado = randInt(40, caminoTotal - 20);
  acts.push({
    type: "input",
    id: "espacio-aplicacion-1",
    title: "Actividad 6",
    prompt: `Un camino mide ${caminoTotal} cm. Tu amigo ya caminó ${caminado} cm. ¿Cuántos cm le faltan para terminarlo?`,
    answer: caminoTotal - caminado,
    hint: `Pista: hacé ${caminoTotal} − ${caminado}.`,
  });

  const pasosFrente = randInt(2, 6);
  const pasosLado = randInt(2, 6);
  acts.push({
    type: "input",
    id: "espacio-aplicacion-2",
    title: "Actividad 7",
    prompt: `Partiendo de tu banco, caminás ${pasosFrente} pasos al frente y ${pasosLado} pasos hacia la derecha. ¿Cuántos pasos caminaste en total?`,
    answer: pasosFrente + pasosLado,
    hint: `Pista: sumá ${pasosFrente} + ${pasosLado}.`,
  });

  acts.push({
    type: "find-error",
    id: "espacio-error",
    title: "Actividad 8",
    prompt:
      "Tomás quiso medir el largo del patio de la escuela (muy largo) usando su regla de 20 cm. ¿Cuál es el problema?",
    resolution: '"Medí el patio con mi regla y me dio 4 reglas."',
    choices: [
      "Para distancias largas conviene usar una cinta métrica, no una regla chica",
      "No hay ningún problema, está bien medido",
      "El patio no se puede medir",
    ],
    answerIndex: 0,
    correctAnswer:
      "Para espacios grandes se usan instrumentos más largos, como la cinta métrica.",
    hint: "Pista: pensá cuántas veces tendrías que mover la regla para medir algo muy largo.",
  });

  acts.push({
    type: "true-false",
    id: "espacio-vf",
    title: "Actividad 9",
    statement: "Para medir la distancia entre dos ciudades usamos el centímetro.",
    isTrue: false,
    justification: {
      prompt: "¿Por qué?",
      choices: [
        "Porque para distancias muy largas se usa el kilómetro",
        "Porque las ciudades no se pueden medir",
      ],
      answerIndex: 0,
    },
    hint: "Pista: pensá qué tan chica es una unidad como el centímetro para una distancia tan grande.",
  });

  const metrosFinal = randInt(3, 9);
  acts.push({
    type: "input",
    id: "espacio-final",
    title: "Actividad 10: desafío final",
    prompt: `Desafío: un pasillo mide ${metrosFinal} metros. ¿Cuántos centímetros mide?`,
    answer: metrosFinal * 100,
    hint: "Pista: multiplicá la cantidad de metros por 100.",
  });

  return acts;
}

// ---------------------------------------------------------------------------
// Mundos 5-7: tablas de multiplicar agrupadas por dificultad
// ---------------------------------------------------------------------------

function buildTablaGroupActivities(tables: number[]): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  const [t1, t2, t3] = tables;

  // 1-3: reconocimiento/práctica, una por cada tabla del grupo
  [t1, t2, t3].forEach((t, idx) => {
    const m = randInt(2, 9);
    acts.push(
      mcFromAnswer(
        `tabla-${tables.join("-")}-${idx}`,
        `Actividad ${idx + 1}`,
        `¿Cuánto es ${t} × ${m}?`,
        t * m,
        `Pista: sumá ${t} un total de ${m} veces.`
      )
    );
  });

  // 4: práctica — relacionar multiplicaciones con resultados
  // (evitamos que dos productos den el mismo resultado, para que el
  // emparejamiento no sea ambiguo)
  let mA = 0,
    mB = 0,
    mC = 0,
    prodA = 0,
    prodB = 0,
    prodC = 0;
  do {
    mA = randInt(2, 6);
    mB = randInt(2, 6);
    mC = randInt(2, 6);
    prodA = t1 * mA;
    prodB = t2 * mB;
    prodC = t3 * mC;
  } while (
    prodA === prodB ||
    prodA === prodC ||
    prodB === prodC
  );
  acts.push({
    type: "match",
    id: `tabla-${tables.join("-")}-match`,
    title: "Actividad 4",
    prompt: "Uní cada multiplicación con su resultado.",
    pairs: [
      { left: `${t1} × ${mA}`, right: String(prodA) },
      { left: `${t2} × ${mB}`, right: String(prodB) },
      { left: `${t3} × ${mC}`, right: String(prodC) },
    ],
    hint: `Pista: calculá cada multiplicación por separado antes de unir.`,
  });

  // 5: situación — filas de sillas para un acto escolar (aplica la tabla a
  // un caso concreto en vez de "grupos con elementos").
  const gruposA = randInt(3, 8);
  acts.push({
    type: "input",
    id: `tabla-${tables.join("-")}-problema-1`,
    title: "Actividad 5",
    prompt: `Para el acto escolar armaron ${gruposA} filas de sillas, con ${t1} sillas cada fila. ¿Cuántas sillas hay en total?`,
    answer: gruposA * t1,
    hint: `Pista: multiplicá ${gruposA} × ${t1}.`,
  });

  // 6: situación de 2 pasos — comprar cajas y comer algunos, para que no
  // alcance con multiplicar y ya está.
  const gruposB = randInt(3, 8);
  const comidosTabla = randInt(2, Math.min(6, t2 - 1 || 1));
  acts.push({
    type: "input",
    id: `tabla-${tables.join("-")}-problema-2`,
    title: "Actividad 6",
    prompt: `Comprás ${gruposB} cajas de alfajores con ${t2} alfajores cada una, y en el recreo te comés ${comidosTabla}. ¿Cuántos alfajores te quedan?`,
    answer: gruposB * t2 - comidosTabla,
    hint: `Pista: primero multiplicá ${gruposB} × ${t2}, después restá ${comidosTabla}.`,
  });

  // 7: aplicación — clasificar resultados por tabla
  const mult1 = randInt(2, 9);
  const mult2 = randInt(2, 9);
  const mult3 = randInt(2, 9);
  const mult1b = randInt(2, 9);
  const mult2b = randInt(2, 9);
  const mult3b = randInt(2, 9);
  const clasifItems = [
    { label: `${t1} × ${mult1} = ${t1 * mult1}`, categoryIndex: 0 },
    { label: `${t2} × ${mult2} = ${t2 * mult2}`, categoryIndex: 1 },
    { label: `${t1} × ${mult1b} = ${t1 * mult1b}`, categoryIndex: 0 },
    { label: `${t2} × ${mult2b} = ${t2 * mult2b}`, categoryIndex: 1 },
    { label: `${t3} × ${mult3} = ${t3 * mult3}`, categoryIndex: 2 },
    { label: `${t3} × ${mult3b} = ${t3 * mult3b}`, categoryIndex: 2 },
  ];
  acts.push({
    type: "classify",
    id: `tabla-${tables.join("-")}-clasificar`,
    title: "Actividad 7",
    prompt: "Clasificá cada cuenta según a qué tabla pertenece.",
    categories: [`Tabla del ${t1}`, `Tabla del ${t2}`, `Tabla del ${t3}`],
    items: shuffle(clasifItems),
    hint: "Pista: fijate cuál de los dos números que se multiplican coincide con cada tabla.",
  });

  // 8: problema — detectar el error
  const errT = pick(tables);
  const errM = randInt(3, 8);
  const wrongResult = errT * errM + pick([-errT, errT, 1, -1]);
  acts.push({
    type: "find-error",
    id: `tabla-${tables.join("-")}-error`,
    title: "Actividad 8",
    prompt: "Un compañero resolvió así. Encontrá el error:",
    resolution: `${errT} × ${errM} = ${wrongResult}`,
    choices: [
      `Está mal: ${errT} × ${errM} = ${errT * errM}`,
      "Está bien calculado",
    ],
    answerIndex: 0,
    correctAnswer: `${errT} × ${errM} = ${errT * errM}`,
    hint: `Pista: sumá ${errT} un total de ${errM} veces para verificar.`,
  });

  // 9: desafío contrarreloj mezclando las 3 tablas
  const quickTables = shuffle([t1, t1, t2, t2, t3, t3]).slice(0, 4);
  const questions = quickTables.map((t) => {
    const m = randInt(2, 9);
    const correct = t * m;
    const choicesSet = new Set<number>([correct]);
    while (choicesSet.size < 3) {
      const c = correct + randInt(-t, t);
      if (c >= 0 && c !== correct) choicesSet.add(c);
    }
    const choices = shuffle(Array.from(choicesSet));
    return {
      prompt: `${t} × ${m} = ?`,
      choices: choices.map(String),
      answerIndex: choices.indexOf(correct),
    };
  });
  acts.push({
    type: "timed",
    id: `tabla-${tables.join("-")}-reloj`,
    title: "Actividad 9: contra el reloj",
    seconds: 35,
    questions,
    hint: `Pista: usá las tablas del ${t1}, del ${t2} y del ${t3} que ya practicaste.`,
  });

  // 10: desafío final — multiplicador más alto
  const finalT = pick(tables);
  const finalM = randInt(8, 10);
  acts.push(
    mcFromAnswer(
      `tabla-${tables.join("-")}-final`,
      "Actividad 10: desafío final",
      `Desafío final: ¿cuánto es ${finalT} × ${finalM}?`,
      finalT * finalM,
      `Pista: multiplicá ${finalT} × ${finalM}.`,
      finalT
    )
  );

  return acts;
}

// ---------------------------------------------------------------------------
// Mundo 8: reparto / división
// ---------------------------------------------------------------------------

function buildRepartoActivities(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  const plans: [number, number][] = [
    [6, 2],
    [8, 2],
    [9, 3],
    [10, 2],
    [12, 3],
    [12, 4],
    [15, 3],
    [16, 4],
  ];
  plans.forEach(([total, groups], idx) => {
    acts.push({
      type: "input",
      id: `reparto-${idx}`,
      title: `Actividad ${idx + 1}`,
      prompt: `Tenés ${total} caramelos para repartir en partes iguales entre ${groups} amigos. ¿Cuántos caramelos le tocan a cada uno?`,
      answer: total / groups,
      hint: `Pista: dividí ${total} entre ${groups}.`,
    });
  });

  // 9: problema — verdadero/falso sobre el resto
  acts.push({
    type: "true-false",
    id: "reparto-vf",
    title: "Actividad 9",
    statement:
      "Si reparto 10 caramelos entre 3 amigos en partes iguales, no sobra ninguno.",
    isTrue: false,
    justification: {
      prompt: "¿Por qué?",
      choices: [
        "Porque 10 no se puede dividir en partes iguales entre 3, sobra 1",
        "Porque 10 siempre se puede repartir exacto",
      ],
      answerIndex: 0,
    },
    hint: "Pista: probá repartir de a uno por vez y contá cuántos quedan sueltos al final.",
  });

  // 10: desafío final — detectar el error en un reparto
  acts.push({
    type: "find-error",
    id: "reparto-error",
    title: "Actividad 10: desafío final",
    prompt: "Julián repartió así. Encontrá el error:",
    resolution: "Repartió 20 figuritas entre 4 amigos y dijo que le tocaban 6 a cada uno.",
    choices: [
      "Está mal: le tocan 5 a cada uno (20 ÷ 4 = 5)",
      "Está bien, le tocan 6 a cada uno",
    ],
    answerIndex: 0,
    correctAnswer: "20 ÷ 4 = 5",
    hint: "Pista: repartí de a una figurita por vez entre los 4 amigos y contá.",
  });

  return acts;
}

// ---------------------------------------------------------------------------
// Mundo 9: figuras geométricas
// ---------------------------------------------------------------------------

function buildGeometriaActivities(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  const objetos: { nombre: string; shape: ShapeKind }[] = [
    { nombre: "una pelota", shape: "circulo" },
    { nombre: "una ventana cuadrada", shape: "cuadrado" },
    { nombre: "la puerta del aula", shape: "rectangulo" },
    { nombre: "una porción de pizza", shape: "triangulo" },
    { nombre: "un reloj de pared", shape: "circulo" },
  ];
  objetos.forEach((o, idx) => {
    const distractores = shuffle(
      SHAPES.map((s) => s.kind).filter((k) => k !== o.shape)
    ).slice(0, 3);
    const choices = shuffle([o.shape, ...distractores]);
    const sides = SHAPES.find((s) => s.kind === o.shape)?.sides ?? 0;
    acts.push({
      type: "shape-identify",
      id: `geo-${idx}`,
      title: `Actividad ${idx + 1}`,
      prompt: `¿Qué figura se parece más a ${o.nombre}?`,
      shape: o.shape,
      choices,
      answerIndex: choices.indexOf(o.shape),
      hint:
        sides === 0
          ? "Pista: pensá en una figura redonda, sin lados rectos."
          : `Pista: esa figura tiene ${sides} lados.`,
    });
  });

  acts.push({
    type: "mc",
    id: "geo-lados-triangulo",
    title: "Actividad 6",
    prompt: "¿Cuántos lados tiene un triángulo?",
    choices: ["3", "4", "5", "0"],
    answerIndex: 0,
    hint: "Pista: contá los lados de una porción de pizza.",
  });

  acts.push({
    type: "mc",
    id: "geo-vertices-cuadrado",
    title: "Actividad 7",
    prompt:
      "Estás armando un cartel para la feria de ciencias y necesitás pegar una figura con 4 lados iguales y 4 vértices (puntas). ¿Cuál elegís?",
    choices: ["Cuadrado", "Triángulo", "Círculo", "Rectángulo"],
    answerIndex: 0,
    hint: "Pista: contá las esquinas y compará el largo de los lados de cada figura.",
  });

  acts.push({
    type: "classify",
    id: "geo-clasificar",
    title: "Actividad 8",
    prompt: "Clasificá cada figura según sus bordes.",
    categories: ["Tiene lados rectos", "No tiene lados rectos (es curva)"],
    items: [
      { label: "Triángulo", categoryIndex: 0 },
      { label: "Círculo", categoryIndex: 1 },
      { label: "Cuadrado", categoryIndex: 0 },
      { label: "Rectángulo", categoryIndex: 0 },
    ],
    hint: "Pista: pensá si podés dibujar esa figura solo con una regla.",
  });

  acts.push({
    type: "match",
    id: "geo-match",
    title: "Actividad 9",
    prompt: "Uní cada figura con su característica.",
    pairs: [
      { left: "Triángulo", right: "3 lados" },
      { left: "Círculo", right: "0 lados, es curvo" },
      { left: "Cuadrado", right: "4 lados iguales" },
      { left: "Rectángulo", right: "4 lados, 2 largos y 2 cortos" },
    ],
    hint: "Pista: contá los lados de cada figura antes de unir.",
  });

  acts.push({
    type: "find-error",
    id: "geo-error",
    title: "Actividad 10: desafío final",
    prompt: "Julián dijo esta frase. Encontrá el error:",
    resolution: '"El círculo tiene 4 lados rectos."',
    choices: [
      "Está mal: el círculo no tiene lados rectos, es una figura curva",
      "Está bien, el círculo tiene 4 lados",
    ],
    answerIndex: 0,
    correctAnswer: "El círculo no tiene lados, es una figura curva.",
    hint: "Pista: intentá dibujar un círculo usando solo líneas rectas.",
  });

  return acts;
}

// ---------------------------------------------------------------------------
// Mundo 10: medidas — capacidad y peso
// ---------------------------------------------------------------------------

function buildMedidasActivities(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];

  acts.push({
    type: "mc",
    id: "medidas-instrumento-1",
    title: "Actividad 1",
    prompt: "¿Qué usarías para saber cuánto pesa una fruta?",
    choices: ["Una balanza", "Una regla", "Un reloj", "Un termómetro"],
    answerIndex: 0,
    hint: "Pista: pensá en el instrumento que se usa en las verdulerías.",
  });

  acts.push({
    type: "mc",
    id: "medidas-instrumento-2",
    title: "Actividad 2",
    prompt: "¿En qué se mide la cantidad de agua que entra en una botella?",
    choices: ["En litros", "En kilos", "En metros", "En horas"],
    answerIndex: 0,
    hint: "Pista: pensá en lo que dice la etiqueta de una botella de agua.",
  });

  acts.push({
    type: "input",
    id: "medidas-medios-kilo",
    title: "Actividad 3",
    prompt: "¿Cuántos medios kilos hacen 1 kilo entero?",
    answer: 2,
    hint: "Pista: un medio más otro medio forman un entero.",
  });

  acts.push({
    type: "input",
    id: "medidas-cuartos-litro",
    title: "Actividad 4",
    prompt: "¿Cuántos cuartos litros hacen 1 litro entero?",
    answer: 4,
    hint: "Pista: si partís una jarra en 4 partes iguales, cada parte es un cuarto.",
  });

  acts.push({
    type: "classify",
    id: "medidas-clasificar",
    title: "Actividad 5",
    prompt: "Clasificá cada producto según cómo se mide.",
    categories: ["Se mide en litros (líquido)", "Se mide en kilos (sólido)"],
    items: [
      { label: "Leche", categoryIndex: 0 },
      { label: "Arroz", categoryIndex: 1 },
      { label: "Agua", categoryIndex: 0 },
      { label: "Azúcar", categoryIndex: 1 },
      { label: "Jugo", categoryIndex: 0 },
      { label: "Harina", categoryIndex: 1 },
    ],
    hint: "Pista: pensá si el producto se sirve en vaso o se pesa en la balanza.",
  });

  const cuartosUsados = randInt(1, 3);
  acts.push({
    type: "input",
    id: "medidas-aplicacion-1",
    title: "Actividad 6",
    prompt: `Un litro entero son 4 cuartos. Tenés 1 litro de jugo y usás ${cuartosUsados} cuarto${cuartosUsados > 1 ? "s" : ""} para una jarra. ¿Cuántos cuartos de jugo te quedan?`,
    answer: 4 - cuartosUsados,
    hint: `Pista: hacé 4 − ${cuartosUsados}.`,
  });

  const kilosBolsa = randInt(2, 5);
  acts.push({
    type: "input",
    id: "medidas-aplicacion-2",
    title: "Actividad 7",
    prompt: `Una bolsa de papas pesa ${kilosBolsa} kilos enteros. ¿Cuántos medios kilos son?`,
    answer: kilosBolsa * 2,
    hint: `Pista: cada kilo entero tiene 2 medios, y son ${kilosBolsa} kilos.`,
  });

  acts.push({
    type: "true-false",
    id: "medidas-vf",
    title: "Actividad 8",
    statement: "Medio kilo pesa más que un kilo entero.",
    isTrue: false,
    justification: {
      prompt: "¿Por qué?",
      choices: [
        "Porque medio kilo es la mitad de un kilo entero",
        "Porque medio kilo es el doble de un kilo",
      ],
      answerIndex: 0,
    },
    hint: "Pista: pensá qué significa la palabra 'medio'.",
  });

  acts.push({
    type: "find-error",
    id: "medidas-error",
    title: "Actividad 9",
    prompt: "Sofía dijo esta frase. Encontrá el error:",
    resolution: '"Usé la regla para pesar mi mochila y me dio 3 kilos."',
    choices: [
      "Está mal: para pesar se usa una balanza, no una regla",
      "Está bien, la regla también sirve para pesar",
    ],
    answerIndex: 0,
    correctAnswer: "Para pesar objetos se usa una balanza.",
    hint: "Pista: pensá para qué sirve cada instrumento de medición.",
  });

  acts.push({
    type: "input",
    id: "medidas-final",
    title: "Actividad 10: desafío final",
    prompt:
      "Tenés 3 kilos y medio (3 kilos enteros más medio kilo). ¿Cuántos medios kilos son en total?",
    answer: 7,
    hint: "Pista: cada kilo entero son 2 medios, más el medio que ya tenías suelto.",
  });

  return acts;
}

// ---------------------------------------------------------------------------
// Mundo 11: problemas con las cuatro operaciones
// ---------------------------------------------------------------------------

function buildProblemasActivities(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];

  const n1 = randInt(5, 15);
  acts.push({
    type: "input",
    id: "problema-suma",
    title: "Actividad 1",
    prompt: `En el aula hay ${n1} varones y ${n1 + 3} mujeres. ¿Cuántos estudiantes hay en total?`,
    answer: n1 + (n1 + 3),
    hint: `Pista: sumá ${n1} + ${n1 + 3}.`,
  });

  const n2 = randInt(20, 40);
  const rest2 = randInt(5, 15);
  acts.push({
    type: "input",
    id: "problema-resta",
    title: "Actividad 2",
    prompt: `La maestra tenía ${n2} lápices y repartió ${rest2}. ¿Cuántos lápices le quedan?`,
    answer: n2 - rest2,
    hint: `Pista: restá ${n2} − ${rest2}.`,
  });

  const sillas = randInt(4, 8);
  const mesas = 4;
  acts.push({
    type: "input",
    id: "problema-multiplicacion",
    title: "Actividad 3",
    prompt: `Cada mesa tiene ${sillas} sillas. Si hay ${mesas} mesas, ¿cuántas sillas hay en total?`,
    answer: sillas * mesas,
    hint: `Pista: multiplicá ${sillas} × ${mesas}.`,
  });

  const totalFiguritas = randInt(12, 30);
  const amigosFiguritas = pick([2, 3]);
  acts.push({
    type: "input",
    id: "problema-division",
    title: "Actividad 4",
    prompt: `Tenés ${totalFiguritas * amigosFiguritas} figuritas repetidas y las repartís en partes iguales entre ${amigosFiguritas} amigos. ¿Cuántas le tocan a cada uno?`,
    answer: totalFiguritas,
    hint: `Pista: dividí ${totalFiguritas * amigosFiguritas} entre ${amigosFiguritas}.`,
  });

  // 5: problema de 2 pasos (multiplicación + resta)
  const paquetes = randInt(3, 5);
  const porPaquete = randInt(4, 8);
  const comidos = randInt(2, 6);
  acts.push({
    type: "input",
    id: "problema-doblepaso-1",
    title: "Actividad 5",
    prompt: `Comprás ${paquetes} paquetes de alfajores con ${porPaquete} alfajores cada uno, y te comés ${comidos}. ¿Cuántos alfajores te quedan?`,
    answer: paquetes * porPaquete - comidos,
    hint: `Pista: primero multiplicá ${paquetes} × ${porPaquete}, después restá ${comidos}.`,
  });

  // 6: problema de 2 pasos (suma + división) — elegimos el resultado del
  // reparto primero para garantizar que la división sea siempre exacta.
  const amigosReparto = pick([2, 3]);
  const porAmigoReparto = randInt(8, 15);
  const totalCajas = porAmigoReparto * amigosReparto;
  const cajaA = randInt(1, totalCajas - 1);
  const cajaB = totalCajas - cajaA;
  acts.push({
    type: "input",
    id: "problema-doblepaso-2",
    title: "Actividad 6",
    prompt: `Juntás ${cajaA} bolitas en una caja y ${cajaB} en otra. Después las repartís en partes iguales entre ${amigosReparto} amigos. ¿Cuántas bolitas le tocan a cada uno?`,
    answer: porAmigoReparto,
    hint: `Pista: primero sumá ${cajaA} + ${cajaB}, después dividí entre ${amigosReparto}.`,
  });

  // 7: clasificar según la operación necesaria
  acts.push({
    type: "classify",
    id: "problema-clasificar",
    title: "Actividad 7",
    prompt: "Clasificá cada situación según la operación que usarías para resolverla.",
    categories: ["Suma", "Resta", "Multiplicación", "División"],
    items: shuffle([
      { label: "Juntar dos grupos de estudiantes", categoryIndex: 0 },
      { label: "Repartir caramelos en partes iguales", categoryIndex: 3 },
      { label: "Saber cuántas sillas hay en varias mesas iguales", categoryIndex: 2 },
      { label: "Saber cuántos lápices quedan después de regalar algunos", categoryIndex: 1 },
    ]),
    hint: "Pista: pensá si la cantidad aumenta, disminuye, se agrupa o se reparte.",
  });

  // 8: detectar el error en un problema de 2 pasos
  const errPaq = randInt(2, 4);
  const errPorPaq = randInt(3, 6);
  const errComidos = randInt(1, 4);
  const wrongTotal = errPaq * errPorPaq - errComidos + 2;
  const rightTotal = errPaq * errPorPaq - errComidos;
  acts.push({
    type: "find-error",
    id: "problema-error",
    title: "Actividad 8",
    prompt: `Un compañero resolvió: "Compré ${errPaq} paquetes de ${errPorPaq} alfajores y comí ${errComidos}." y dijo que le quedaban ${wrongTotal}. Encontrá el error:`,
    resolution: `${errPaq} × ${errPorPaq} − ${errComidos} = ${wrongTotal}`,
    choices: [
      `Está mal: el resultado correcto es ${rightTotal}`,
      "Está bien calculado",
    ],
    answerIndex: 0,
    correctAnswer: `${errPaq} × ${errPorPaq} − ${errComidos} = ${rightTotal}`,
    hint: "Pista: resolvé primero la multiplicación y después la resta, por separado.",
  });

  // 9: verdadero/falso sobre elegir la operación
  acts.push({
    type: "true-false",
    id: "problema-vf",
    title: "Actividad 9",
    statement:
      "Si quiero repartir 18 figuritas en partes iguales entre 3 amigos, tengo que multiplicar 18 × 3.",
    isTrue: false,
    justification: {
      prompt: "¿Cuál es la operación correcta?",
      choices: ["Dividir: 18 ÷ 3", "Sumar: 18 + 3"],
      answerIndex: 0,
    },
    hint: "Pista: repartir en partes iguales es una división, no una multiplicación.",
  });

  // 10: desafío final — problema más largo de 2 pasos
  const cajones = randInt(4, 6);
  const porCajon = randInt(6, 10);
  const rotos = randInt(3, 8);
  acts.push({
    type: "input",
    id: "problema-final",
    title: "Actividad 10: desafío final",
    prompt: `Desafío: en el kiosco hay ${cajones} cajones con ${porCajon} huevos cada uno. Se rompieron ${rotos}. ¿Cuántos huevos quedan sin romper?`,
    answer: cajones * porCajon - rotos,
    hint: `Pista: primero multiplicá ${cajones} × ${porCajon}, después restá ${rotos}.`,
  });

  return acts;
}

// ---------------------------------------------------------------------------
// Mundo 12: fracciones — mitades y cuartos
// ---------------------------------------------------------------------------

function buildFraccionesActivities(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];

  acts.push({
    type: "mc",
    id: "fracciones-mitad",
    title: "Actividad 1",
    prompt: "¿Qué fracción representa 'la mitad' de algo?",
    choices: ["1/2", "1/4", "2/1", "1/3"],
    answerIndex: 0,
    hint: "Pista: la mitad es una de dos partes iguales.",
  });

  acts.push({
    type: "mc",
    id: "fracciones-cuarto",
    title: "Actividad 2",
    prompt: "¿Qué fracción representa 'un cuarto' de algo?",
    choices: ["1/4", "1/2", "4/1", "1/3"],
    answerIndex: 0,
    hint: "Pista: un cuarto es una de cuatro partes iguales.",
  });

  acts.push({
    type: "input",
    id: "fracciones-mitad-porciones",
    title: "Actividad 3",
    prompt: "Si dividís una pizza en partes iguales para compartirla entre 2 amigos, ¿cuántas porciones hay en total?",
    answer: 2,
    hint: "Pista: repartir entre 2 en partes iguales es hacer mitades.",
  });

  acts.push({
    type: "input",
    id: "fracciones-cuarto-porciones",
    title: "Actividad 4",
    prompt: "Si dividís una torta en partes iguales para compartirla entre 4 amigos, ¿cuántas porciones (cuartos) forman la torta completa?",
    answer: 4,
    hint: "Pista: repartir entre 4 en partes iguales es hacer cuartos.",
  });

  acts.push({
    type: "classify",
    id: "fracciones-clasificar",
    title: "Actividad 5",
    prompt: "Clasificá cada reparto según la fracción que corresponde.",
    categories: ["Es una mitad (1/2)", "Es un cuarto (1/4)"],
    items: shuffle([
      { label: "Repartir un chocolate entre 2 amigos", categoryIndex: 0 },
      { label: "Repartir una pizza entre 4 amigos", categoryIndex: 1 },
      { label: "Repartir una manzana entre 2 hermanos", categoryIndex: 0 },
      { label: "Repartir una torta entre 4 primos", categoryIndex: 1 },
    ]),
    hint: "Pista: fijate entre cuántas partes se reparte.",
  });

  const carA = randInt(4, 10) * 2;
  acts.push({
    type: "input",
    id: "fracciones-aplicacion-1",
    title: "Actividad 6",
    prompt: `Tenías ${carA} caramelos y le diste la mitad a tu hermano. ¿Cuántos le diste?`,
    answer: carA / 2,
    hint: `Pista: dividí ${carA} entre 2.`,
  });

  const figA = randInt(2, 6) * 4;
  acts.push({
    type: "input",
    id: "fracciones-aplicacion-2",
    title: "Actividad 7",
    prompt: `Tenías ${figA} figuritas y usaste un cuarto para regalar. ¿Cuántas regalaste?`,
    answer: figA / 4,
    hint: `Pista: dividí ${figA} entre 4.`,
  });

  acts.push({
    type: "true-false",
    id: "fracciones-vf",
    title: "Actividad 8",
    statement: "Un cuarto es más grande que una mitad.",
    isTrue: false,
    justification: {
      prompt: "¿Por qué?",
      choices: [
        "Porque cuando se reparte entre más partes, cada parte es más chica",
        "Porque un cuarto siempre es más grande que cualquier fracción",
      ],
      answerIndex: 0,
    },
    hint: "Pista: pensá qué porción te toca si un chocolate se reparte entre 4 en vez de entre 2.",
  });

  acts.push({
    type: "match",
    id: "fracciones-match",
    title: "Actividad 9",
    prompt: "Uní cada situación con la fracción que le corresponde.",
    pairs: [
      { left: "Repartir entre 2 amigos en partes iguales", right: "1/2" },
      { left: "Repartir entre 4 amigos en partes iguales", right: "1/4" },
      { left: "El entero completo, sin repartir", right: "4/4" },
    ],
    hint: "Pista: pensá entre cuántas partes se reparte cada vez.",
  });

  acts.push({
    type: "input",
    id: "fracciones-final",
    title: "Actividad 10: desafío final",
    prompt:
      "Desafío: tenías 16 alfajores. Regalaste la mitad y después te comiste un cuarto de los que te quedaban. ¿Cuántos alfajores te quedan?",
    answer: 6,
    hint: "Pista: primero calculá la mitad de 16 (te quedan 8), después un cuarto de 8 (comiste 2), y restá.",
  });

  return acts;
}

// ---------------------------------------------------------------------------
// Mundo 13: números grandes — 2 y 3 cifras, calculadora, estimación
// ---------------------------------------------------------------------------

function buildNumerosGrandesActivities(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  for (let idx = 0; idx < 6; idx++) {
    const digits = idx < 3 ? 2 : 3;
    const min = digits === 2 ? 10 : 100;
    const max = digits === 2 ? 99 : 999;
    const a = randInt(min, max);
    const b = randInt(min, Math.min(a, max));
    const op = idx % 2 === 0 ? "+" : "-";
    const answer = op === "+" ? a + b : a - b;
    acts.push({
      type: "input",
      id: `numgrande-${idx}`,
      title: `Actividad ${idx + 1}`,
      prompt: `${a} ${op} ${b} = ?`,
      answer,
      hint: `Pista: alineá unidades, decenas${digits === 3 ? " y centenas" : ""}, y ${op === "+" ? "sumá" : "restá"} columna por columna.`,
    });
  }

  // 7: situación — estimar una cantidad grande de un caso real (entradas a
  // un club en dos días), sin necesidad de calcular el resultado exacto.
  const estA = randInt(150, 300);
  const estB = randInt(150, 300);
  const estExact = estA + estB;
  const estRound = Math.round(estExact / 100) * 100;
  const estOptions = shuffle([
    estRound,
    estRound + 100,
    estRound - 100,
    estRound + 200,
  ]);
  acts.push({
    type: "mc",
    id: "numgrande-estimacion",
    title: "Actividad 7",
    prompt: `El sábado entraron ${estA} personas al club y el domingo ${estB}. Sin calcular el número exacto, ¿cuál es la mejor estimación de cuántas personas entraron en total?`,
    choices: estOptions.map(String),
    answerIndex: estOptions.indexOf(estRound),
    hint: "Pista: redondeá cada número a la centena más cercana antes de sumar.",
  });

  // 8: verdadero/falso sobre la calculadora
  acts.push({
    type: "true-false",
    id: "numgrande-vf",
    title: "Actividad 8",
    statement: "Podemos usar la calculadora para verificar un cálculo con números grandes.",
    isTrue: true,
    justification: {
      prompt: "¿Por qué?",
      choices: [
        "Porque nos ayuda a comprobar si el resultado que pensamos es correcto",
        "Porque la calculadora siempre se equivoca",
      ],
      answerIndex: 0,
    },
    hint: "Pista: pensá para qué usan la calculadora los adultos cuando hacen cuentas grandes.",
  });

  // 9: detectar el error en una cuenta de números grandes
  const errA = randInt(200, 500);
  const errB = randInt(100, 300);
  const wrongRes = errA + errB + 100;
  acts.push({
    type: "find-error",
    id: "numgrande-error",
    title: "Actividad 9",
    prompt: "Un compañero resolvió así. Encontrá el error:",
    resolution: `${errA} + ${errB} = ${wrongRes}`,
    choices: [
      `Está mal: el resultado correcto es ${errA + errB}`,
      "Está bien calculado",
    ],
    answerIndex: 0,
    correctAnswer: `${errA} + ${errB} = ${errA + errB}`,
    hint: "Pista: sumá primero las unidades, después las decenas y por último las centenas.",
  });

  // 10: desafío final
  const finA = randInt(400, 900);
  const finB = randInt(100, finA - 50);
  acts.push({
    type: "input",
    id: "numgrande-final",
    title: "Actividad 10: desafío final",
    prompt: `Desafío: ${finA} − ${finB} = ?`,
    answer: finA - finB,
    hint: "Pista: alineá unidades, decenas y centenas antes de restar.",
  });

  return acts;
}

// ---------------------------------------------------------------------------
// Mundo 14: cuerpos geométricos y tiempo
// ---------------------------------------------------------------------------

function buildCuerposTiempoActivities(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];

  acts.push({
    type: "mc",
    id: "cuerpos-reconoce",
    title: "Actividad 1",
    prompt: "¿Cuál de estos es un cuerpo geométrico (tiene volumen, no es plano)?",
    choices: ["Cubo", "Cuadrado", "Triángulo", "Círculo"],
    answerIndex: 0,
    hint: "Pista: un cuerpo geométrico lo podés agarrar, tiene 'adentro'.",
  });

  acts.push({
    type: "mc",
    id: "cuerpos-caras",
    title: "Actividad 2",
    prompt: "¿Cuántas caras tiene un cubo (como un dado)?",
    choices: ["6", "4", "8", "12"],
    answerIndex: 0,
    hint: "Pista: pensá en un dado y contá sus caras.",
  });

  acts.push({
    type: "classify",
    id: "cuerpos-clasificar",
    title: "Actividad 3",
    prompt: "Clasificá cada figura según sea un cuerpo (3D) o una figura plana (2D).",
    categories: ["Cuerpo geométrico (3D)", "Figura plana (2D)"],
    items: shuffle([
      { label: "Cubo", categoryIndex: 0 },
      { label: "Círculo", categoryIndex: 1 },
      { label: "Esfera", categoryIndex: 0 },
      { label: "Triángulo", categoryIndex: 1 },
      { label: "Cilindro", categoryIndex: 0 },
      { label: "Cuadrado", categoryIndex: 1 },
    ]),
    hint: "Pista: si lo podés apoyar y tiene volumen, es un cuerpo.",
  });

  acts.push({
    type: "match",
    id: "cuerpos-match",
    title: "Actividad 4",
    prompt: "Uní cada cuerpo geométrico con un objeto cotidiano parecido.",
    pairs: [
      { left: "Cubo", right: "Un dado" },
      { left: "Esfera", right: "Una pelota" },
      { left: "Cilindro", right: "Una lata de gaseosa" },
      { left: "Cono", right: "Un cucurucho de helado" },
    ],
    hint: "Pista: pensá en objetos que tengan esa misma forma.",
  });

  acts.push({
    type: "mc",
    id: "cuerpos-hora",
    title: "Actividad 5",
    prompt: "Si el reloj marca las 3 y media, ¿cómo se escribe esa hora?",
    choices: ["3:30", "3:15", "4:00", "2:30"],
    answerIndex: 0,
    hint: "Pista: 'y media' significa que pasaron 30 minutos de esa hora.",
  });

  acts.push({
    type: "input",
    id: "cuerpos-minutos-1",
    title: "Actividad 6",
    prompt: "¿Cuántos minutos son 1 hora y media?",
    answer: 90,
    hint: "Pista: 1 hora son 60 minutos, y media hora son 30 minutos más.",
  });

  acts.push({
    type: "input",
    id: "cuerpos-minutos-2",
    title: "Actividad 7",
    prompt: "¿Cuántos minutos son un cuarto de hora?",
    answer: 15,
    hint: "Pista: una hora entera (60 minutos) dividida en 4 partes iguales.",
  });

  // 8: situación — usar la duración del recreo para decidir si llegás a
  // tiempo a la siguiente clase (aplica la equivalencia de tiempo a un caso
  // real, en vez de solo calcular un minuto suelto).
  const pad2 = (n: number) => String(n).padStart(2, "0");
  const recreoInicio = pick([0, 10, 20, 30, 40]);
  const recreoFin = recreoInicio + 15;
  const escenario = pick(["justo", "tarde", "sobra"] as const);
  const claseMinuto =
    escenario === "justo"
      ? recreoFin
      : escenario === "tarde"
        ? recreoFin - randInt(3, 7)
        : recreoFin + randInt(3, 10);
  const cuerposOpciones = shuffle([
    "Llegás justo a tiempo",
    "Llegás tarde, la clase ya empezó",
    "Te sobra tiempo antes de que empiece",
  ]);
  const cuerposRespuesta =
    escenario === "justo"
      ? "Llegás justo a tiempo"
      : escenario === "tarde"
        ? "Llegás tarde, la clase ya empezó"
        : "Te sobra tiempo antes de que empiece";
  acts.push({
    type: "mc",
    id: "cuerpos-aplicacion",
    title: "Actividad 8",
    prompt: `El recreo empieza a las 10:${pad2(recreoInicio)} y dura 15 minutos. La clase de Lengua empieza a las 10:${pad2(claseMinuto)}. ¿Qué va a pasar?`,
    choices: cuerposOpciones,
    answerIndex: cuerposOpciones.indexOf(cuerposRespuesta),
    hint: `Pista: el recreo termina a las 10:${pad2(recreoFin)}. Compará esa hora con la de la clase.`,
  });

  acts.push({
    type: "true-false",
    id: "cuerpos-vf",
    title: "Actividad 9",
    statement: "Un cuarto de hora son 20 minutos.",
    isTrue: false,
    justification: {
      prompt: "¿Cuánto es en realidad?",
      choices: ["15 minutos", "30 minutos"],
      answerIndex: 0,
    },
    hint: "Pista: dividí los 60 minutos de la hora en 4 partes iguales.",
  });

  acts.push({
    type: "find-error",
    id: "cuerpos-final",
    title: "Actividad 10: desafío final",
    prompt: "Pedro dijo esta frase. Encontrá el error:",
    resolution: '"Una hora y media son 100 minutos."',
    choices: [
      "Está mal: una hora y media son 90 minutos (60 + 30)",
      "Está bien, son 100 minutos",
    ],
    answerIndex: 0,
    correctAnswer: "Una hora y media son 90 minutos.",
    hint: "Pista: sumá los 60 minutos de la hora completa más los 30 de la media hora.",
  });

  return acts;
}

// ---------------------------------------------------------------------------
// Mundo 15: oralidad inicial — rimas, adivinanzas, trabalenguas
// ---------------------------------------------------------------------------

function buildOralidadInicialActivities(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];

  acts.push({
    type: "mc",
    id: "oralidad-rima-1",
    title: "Actividad 1",
    prompt: "¿Cuál de estas palabras rima con 'gato'?",
    choices: ["Pato", "Mesa", "Libro", "Sol"],
    answerIndex: 0,
    hint: "Pista: fijate cómo termina cada palabra.",
  });

  acts.push({
    type: "mc",
    id: "oralidad-rima-2",
    title: "Actividad 2",
    prompt: "¿Cuál de estas palabras rima con 'flor'?",
    choices: ["Calor", "Mesa", "Perro", "Casa"],
    answerIndex: 0,
    hint: "Pista: fijate cómo termina cada palabra.",
  });

  // 3: situación — resolver una adivinanza de verdad (adivinar la
  // respuesta a partir de las pistas, en vez de unir pares ya emparejados).
  const adivinanzas = [
    {
      riddle:
        "Blanca por dentro, verde por fuera, si quieres que te lo diga, espera.",
      answer: "La pera",
    },
    {
      riddle: "Redondo como una pelota, alumbra de noche y de día no.",
      answer: "La Luna",
    },
    {
      riddle:
        "Tiene hojas y no es un árbol, tiene tapas y no es una olla.",
      answer: "El libro",
    },
  ];
  const adivinanzaElegida = pick(adivinanzas);
  const adivinanzaDistractores = shuffle(
    ["El sol", "La mesa", "El sapo", "La silla", "El árbol", "La pelota"].filter(
      (d) => d !== adivinanzaElegida.answer
    )
  ).slice(0, 3);
  const adivinanzaChoices = shuffle([
    adivinanzaElegida.answer,
    ...adivinanzaDistractores,
  ]);
  acts.push({
    type: "mc",
    id: "oralidad-adivinanzas",
    title: "Actividad 3",
    prompt: `Adivinanza: "${adivinanzaElegida.riddle}" ¿Qué es?`,
    choices: adivinanzaChoices,
    answerIndex: adivinanzaChoices.indexOf(adivinanzaElegida.answer),
    hint: "Pista: leé despacio y pensá en objetos o cosas de la naturaleza.",
  });

  acts.push({
    type: "classify",
    id: "oralidad-clasificar-rima",
    title: "Actividad 4",
    prompt: "Clasificá cada palabra según con qué rima.",
    categories: ["Rima con SOL", "Rima con PAN"],
    items: shuffle([
      { label: "Farol", categoryIndex: 0 },
      { label: "Caracol", categoryIndex: 0 },
      { label: "Tucán", categoryIndex: 1 },
      { label: "Volcán", categoryIndex: 1 },
    ]),
    hint: "Pista: fijate en las últimas letras de cada palabra.",
  });

  acts.push(
    buildOrderFromSequence(
      "oralidad-secuencia-cuento",
      "Actividad 5",
      "Ordená los pasos para contarle un cuento a un compañero.",
      [
        "Primero pensás de qué se va a tratar",
        "Después contás cómo empieza",
        "Luego contás qué problema aparece",
        "Por último contás cómo termina",
      ],
      "Pista: pensá en el orden en que contarías cualquier historia."
    )
  );

  acts.push({
    type: "mc",
    id: "oralidad-tipo-juego",
    title: "Actividad 6",
    prompt: "\"Tres tristes tigres tragaban trigo en un trigal\" es un ejemplo de...",
    choices: ["Trabalenguas", "Adivinanza", "Noticia", "Receta"],
    answerIndex: 0,
    hint: "Pista: pensá en lo difícil que es decirlo rápido sin trabarse.",
  });

  acts.push({
    type: "true-false",
    id: "oralidad-vf",
    title: "Actividad 7",
    statement: "Un trabalenguas es fácil de decir muy rápido, sin equivocarse.",
    isTrue: false,
    justification: {
      prompt: "¿Por qué?",
      choices: [
        "Porque tiene sonidos parecidos que se repiten y hacen trabar la lengua",
        "Porque siempre tiene rima",
      ],
      answerIndex: 0,
    },
    hint: "Pista: pensá qué pasa cuando intentás decir uno rápido.",
  });

  acts.push({
    type: "find-error",
    id: "oralidad-error",
    title: "Actividad 8",
    prompt: "Bruno dijo esta frase. Encontrá el error:",
    resolution: '"Una adivinanza es un juego de palabras que hay que decir muy rápido sin trabarse."',
    choices: [
      "Está mal: eso describe a un trabalenguas, no a una adivinanza",
      "Está bien, esa es la definición de adivinanza",
    ],
    answerIndex: 0,
    correctAnswer: "Una adivinanza es un acertijo que hay que adivinar, no algo para decir rápido.",
    hint: "Pista: pensá en qué se hace con una adivinanza: ¿se dice rápido o se adivina?",
  });

  acts.push({
    type: "classify",
    id: "oralidad-clasificar-tipo",
    title: "Actividad 9",
    prompt: "Clasificá cada ejemplo según el tipo de juego de palabras que es.",
    categories: ["Adivinanza", "Trabalenguas", "Rima"],
    items: shuffle([
      { label: "Oro no es, plata no es. ¿Qué es?", categoryIndex: 0 },
      { label: "Pablito clavó un clavito", categoryIndex: 1 },
      { label: "El sol brilla en el cielo azul", categoryIndex: 2 },
      { label: "El cielo tiene una estrella, la luna tiene una vela", categoryIndex: 2 },
    ]),
    hint: "Pista: una se adivina, otra se traba y otra suena parecido al final.",
  });

  acts.push({
    type: "mc",
    id: "oralidad-final",
    title: "Actividad 10: desafío final",
    prompt: "Desafío: ¿cuál de estas palabras rima con 'ratón'?",
    choices: ["Camión", "Mesa", "Perro", "Gato"],
    answerIndex: 0,
    hint: "Pista: fijate en el sonido final de cada palabra.",
  });

  return acts;
}

// ---------------------------------------------------------------------------
// Mundo 16: lectura de cuentos, fábulas y poesías
// ---------------------------------------------------------------------------

function buildLecturaCuentosActivities(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];

  acts.push({
    type: "mc",
    id: "cuentos-anticipar",
    title: "Actividad 1",
    prompt: "Si un cuento se llama 'El lobo y las siete cabritas', ¿de qué se va a tratar probablemente?",
    choices: [
      "De un lobo y unas cabritas",
      "De una fiesta de cumpleaños",
      "De un viaje en avión",
      "De una receta de cocina",
    ],
    answerIndex: 0,
    hint: "Pista: el título casi siempre adelanta los personajes de la historia.",
  });

  acts.push({
    type: "mc",
    id: "cuentos-tipo-texto",
    title: "Actividad 2",
    prompt: "Un texto breve con animales que hablan y que al final deja una enseñanza es...",
    choices: ["Una fábula", "Una noticia", "Una receta", "Una invitación"],
    answerIndex: 0,
    hint: "Pista: pensá en 'La liebre y la tortuga'.",
  });

  acts.push(
    buildOrderFromSequence(
      "cuentos-orden-caperucita",
      "Actividad 3",
      "Ordená los momentos de la historia de Caperucita Roja.",
      [
        "Caperucita sale de su casa hacia lo de su abuela",
        "En el camino se encuentra con el lobo",
        "El lobo se disfraza de abuela",
        "Llega el cazador y salva a Caperucita",
      ],
      "Pista: pensá en el orden en que pasan las cosas en esa historia."
    )
  );

  acts.push({
    type: "mc",
    id: "cuentos-consigna",
    title: "Actividad 4",
    prompt: "Si la consigna dice 'subrayá los sustantivos del texto', ¿qué tenés que hacer?",
    choices: [
      "Marcar con una línea los sustantivos que encuentres",
      "Escribir un cuento nuevo",
      "Dibujar los personajes",
      "Leer el texto en voz alta",
    ],
    answerIndex: 0,
    hint: "Pista: 'subrayar' significa marcar con una línea debajo.",
  });

  acts.push({
    type: "classify",
    id: "cuentos-clasificar-tipo",
    title: "Actividad 5",
    prompt: "Clasificá cada título según el tipo de texto que probablemente sea.",
    categories: ["Cuento", "Fábula", "Poesía"],
    items: shuffle([
      { label: "La princesa y el dragón", categoryIndex: 0 },
      { label: "El zorro y las uvas", categoryIndex: 1 },
      { label: "Canción a la lluvia de otoño", categoryIndex: 2 },
      { label: "La cigarra y la hormiga", categoryIndex: 1 },
    ]),
    hint: "Pista: las fábulas suelen tener animales que hablan y dejan una enseñanza.",
  });

  acts.push({
    type: "true-false",
    id: "cuentos-vf",
    title: "Actividad 6",
    statement: "Las fábulas siempre dejan una enseñanza o moraleja al final.",
    isTrue: true,
    justification: {
      prompt: "¿Por qué?",
      choices: [
        "Porque ese es justamente el objetivo de una fábula",
        "Porque todas las fábulas tienen dibujos",
      ],
      answerIndex: 0,
    },
    hint: "Pista: pensá para qué se escriben las fábulas.",
  });

  acts.push({
    type: "mc",
    id: "cuentos-moraleja",
    title: "Actividad 7",
    prompt: "En 'La liebre y la tortuga', la liebre pierde la carrera por confiada y dormirse en el camino. ¿Cuál es la moraleja?",
    choices: [
      "Hay que ser constante, no hay que confiarse demasiado",
      "Hay que dormir siestas largas",
      "Las tortugas son más rápidas que las liebres",
      "Nunca hay que hacer carreras",
    ],
    answerIndex: 0,
    hint: "Pista: pensá en lo que hizo mal la liebre.",
  });

  acts.push({
    type: "find-error",
    id: "cuentos-error",
    title: "Actividad 8",
    prompt: "Valen contó así el cuento de los Tres Chanchitos. Encontrá el error:",
    resolution: '"Los tres chanchitos construyeron sus casas y el lobo las ayudó a construirlas."',
    choices: [
      "Está mal: el lobo quería soplar y tirar abajo las casas, no ayudarlas a construir",
      "Está bien contado",
    ],
    answerIndex: 0,
    correctAnswer: "El lobo intenta soplar y derribar las casas de paja y de madera.",
    hint: "Pista: acordate qué papel cumple el lobo en esa historia.",
  });

  acts.push({
    type: "match",
    id: "cuentos-personajes",
    title: "Actividad 9",
    prompt: "Uní cada personaje con el cuento al que pertenece.",
    pairs: [
      { left: "Caperucita Roja", right: "Se encuentra con el lobo en el bosque" },
      { left: "Los tres chanchitos", right: "Construyen casas de paja, madera y ladrillo" },
      { left: "El patito feo", right: "Al crecer se convierte en un hermoso cisne" },
    ],
    hint: "Pista: pensá qué le pasa a cada personaje en su historia.",
  });

  acts.push(
    buildOrderFromSequence(
      "cuentos-final",
      "Actividad 10: desafío final",
      "Ordená los momentos de 'La liebre y la tortuga'.",
      [
        "La liebre y la tortuga empiezan la carrera",
        "La liebre se adelanta mucho y decide descansar",
        "La tortuga sigue caminando despacio, sin parar",
        "La tortuga llega primero a la meta",
      ],
      "Pista: pensá en el orden real de esa carrera tan conocida."
    )
  );

  return acts;
}

// ---------------------------------------------------------------------------
// Mundo 17: escritura inicial — textos cortos, mayúsculas, punto y coma
// ---------------------------------------------------------------------------

function buildEscrituraInicialActivities(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];

  acts.push({
    type: "mc",
    id: "escritura-mayuscula",
    title: "Actividad 1",
    prompt: "¿Cuál de estas oraciones está bien escrita?",
    choices: [
      "Hoy fui a la escuela.",
      "hoy fui a la escuela.",
      "hoy Fui a la escuela.",
      "HOY fui a LA escuela.",
    ],
    answerIndex: 0,
    hint: "Pista: toda oración empieza con mayúscula.",
  });

  acts.push({
    type: "mc",
    id: "escritura-punto",
    title: "Actividad 2",
    prompt: "¿Qué le falta a esta oración: \"Hoy fui a la escuela\"?",
    choices: ["Un punto al final", "Una coma al final", "Nada, está completa", "Un signo de pregunta"],
    answerIndex: 0,
    hint: "Pista: toda oración termina con un punto.",
  });

  acts.push({
    type: "classify",
    id: "escritura-clasificar-mayuscula",
    title: "Actividad 3",
    prompt: "Clasificá cada oración según esté bien escrita o no.",
    categories: ["Está bien escrita", "Le falta la mayúscula inicial"],
    items: shuffle([
      { label: "El perro juega en el patio.", categoryIndex: 0 },
      { label: "la maestra explicó la tarea.", categoryIndex: 1 },
      { label: "Mañana vamos de excursión.", categoryIndex: 0 },
      { label: "compramos pan en el kiosco.", categoryIndex: 1 },
    ]),
    hint: "Pista: fijate con qué letra empieza cada oración.",
  });

  acts.push({
    type: "classify",
    id: "escritura-clasificar-propio",
    title: "Actividad 4",
    prompt: "Clasificá cada palabra según cómo se escribe.",
    categories: ["Va con mayúscula (nombre propio)", "Va con minúscula (nombre común)"],
    items: shuffle([
      { label: "Juan", categoryIndex: 0 },
      { label: "perro", categoryIndex: 1 },
      { label: "Gregores", categoryIndex: 0 },
      { label: "mesa", categoryIndex: 1 },
    ]),
    hint: "Pista: los nombres de personas y lugares van con mayúscula.",
  });

  acts.push({
    type: "true-false",
    id: "escritura-vf-coma",
    title: "Actividad 5",
    statement: "En la oración 'Compré manzanas, peras y uvas' hay que separar los elementos con comas.",
    isTrue: true,
    justification: {
      prompt: "¿Por qué?",
      choices: [
        "Porque se usa la coma para separar elementos de una lista",
        "Porque las frutas siempre llevan coma",
      ],
      answerIndex: 0,
    },
    hint: "Pista: pensá cómo separarías esa lista si la dijeras hablando, con pausas.",
  });

  acts.push({
    type: "mc",
    id: "escritura-enumeracion",
    title: "Actividad 6",
    prompt: "¿Cuál de estas oraciones está bien puntuada?",
    choices: [
      "Traje lápices, gomas y colores.",
      "Traje lápices gomas y colores.",
      "Traje, lápices, gomas, y, colores.",
      "Traje lápices. gomas y colores.",
    ],
    answerIndex: 0,
    hint: "Pista: se separan con coma todos los elementos, menos el último (que lleva 'y').",
  });

  acts.push({
    type: "mc",
    id: "escritura-tipo-texto",
    title: "Actividad 7",
    prompt: "Si querés contar que se rompió un caño en la escuela y llegaron los bomberos, ¿qué tipo de texto conviene escribir?",
    choices: ["Una noticia", "Una invitación", "Un cuento de hadas", "Una poesía"],
    answerIndex: 0,
    hint: "Pista: pensá qué texto se usa para contar un hecho real que pasó.",
  });

  acts.push({
    type: "find-error",
    id: "escritura-error",
    title: "Actividad 8",
    prompt: "Mica escribió esta invitación. Encontrá el error:",
    resolution: '"Vení a mi cumpleaños." (sin decir el día, la hora ni el lugar)',
    choices: [
      "Está incompleta: le falta el día, la hora y el lugar",
      "Está perfecta, no le falta nada",
    ],
    answerIndex: 0,
    correctAnswer: "Una invitación necesita decir qué, cuándo y dónde va a pasar el evento.",
    hint: "Pista: pensá qué necesitarías saber vos para poder ir a ese cumpleaños.",
  });

  acts.push(
    buildOrderFromSequence(
      "escritura-orden-invitacion",
      "Actividad 9",
      "Ordená las partes de una invitación.",
      [
        "A quién va dirigida (por ejemplo: 'Querida Sofi')",
        "El motivo de la invitación (por ejemplo: 'Te invito a mi cumpleaños')",
        "La fecha y el lugar",
        "La despedida (por ejemplo: 'Te espero, un beso')",
      ],
      "Pista: pensá en cómo empezarías y terminarías una invitación."
    )
  );

  acts.push({
    type: "classify",
    id: "escritura-final",
    title: "Actividad 10: desafío final",
    prompt: "Clasificá cada oración según esté bien puntuada o le falte algo.",
    categories: ["Bien puntuada", "Le falta algo (mayúscula, punto o coma)"],
    items: shuffle([
      { label: "El sol brilla en el cielo.", categoryIndex: 0 },
      { label: "compré pan leche y queso", categoryIndex: 1 },
      { label: "Mañana iremos al zoológico.", categoryIndex: 0 },
      { label: "la biblioteca abre a las nueve", categoryIndex: 1 },
    ]),
    hint: "Pista: revisá la mayúscula inicial, el punto final y las comas de las listas.",
  });

  return acts;
}

// ---------------------------------------------------------------------------
// Mundo 18: clases de palabras — sustantivo, adjetivo, verbo, sinónimos
// ---------------------------------------------------------------------------

function buildClasesPalabrasActivities(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];

  acts.push({
    type: "mc",
    id: "clases-sustantivo",
    title: "Actividad 1",
    prompt: "¿Cuál es el sustantivo en la oración 'El perro corre rápido'?",
    choices: ["Perro", "Corre", "Rápido", "El"],
    answerIndex: 0,
    hint: "Pista: el sustantivo nombra a la persona, animal o cosa.",
  });

  acts.push({
    type: "mc",
    id: "clases-adjetivo",
    title: "Actividad 2",
    prompt: "¿Cuál es el adjetivo en la oración 'La casa grande es linda'?",
    choices: ["Grande", "Casa", "Es", "La"],
    answerIndex: 0,
    hint: "Pista: el adjetivo describe cómo es el sustantivo.",
  });

  acts.push({
    type: "mc",
    id: "clases-verbo",
    title: "Actividad 3",
    prompt: "¿Cuál es el verbo en la oración 'Los chicos juegan en la plaza'?",
    choices: ["Juegan", "Chicos", "Plaza", "Los"],
    answerIndex: 0,
    hint: "Pista: el verbo indica la acción que se hace.",
  });

  acts.push({
    type: "classify",
    id: "clases-clasificar",
    title: "Actividad 4",
    prompt: "Clasificá cada palabra según su clase.",
    categories: ["Sustantivo", "Adjetivo", "Verbo"],
    items: shuffle([
      { label: "Escuela", categoryIndex: 0 },
      { label: "Hermoso", categoryIndex: 1 },
      { label: "Saltar", categoryIndex: 2 },
      { label: "Rápido", categoryIndex: 1 },
      { label: "Perro", categoryIndex: 0 },
      { label: "Comer", categoryIndex: 2 },
    ]),
    hint: "Pista: pensá si nombra algo, lo describe, o es una acción.",
  });

  acts.push({
    type: "match",
    id: "clases-sinonimos",
    title: "Actividad 5",
    prompt: "Uní cada palabra con su sinónimo (significa lo mismo).",
    pairs: [
      { left: "Contento", right: "Feliz" },
      { left: "Veloz", right: "Rápido" },
      { left: "Lindo", right: "Hermoso" },
    ],
    hint: "Pista: los sinónimos son palabras que significan casi lo mismo.",
  });

  acts.push({
    type: "match",
    id: "clases-antonimos",
    title: "Actividad 6",
    prompt: "Uní cada palabra con su antónimo (significa lo contrario).",
    pairs: [
      { left: "Grande", right: "Chico" },
      { left: "Arriba", right: "Abajo" },
      { left: "Día", right: "Noche" },
    ],
    hint: "Pista: los antónimos son palabras que significan lo opuesto.",
  });

  acts.push({
    type: "mc",
    id: "clases-oracion",
    title: "Actividad 7",
    prompt: "¿Cuál de estas opciones es una oración completa (tiene sentido por sí sola)?",
    choices: [
      "El gato duerme en el sillón.",
      "El gato",
      "Duerme",
      "En el",
    ],
    answerIndex: 0,
    hint: "Pista: una oración completa tiene sentido por sí sola.",
  });

  acts.push({
    type: "true-false",
    id: "clases-vf",
    title: "Actividad 8",
    statement: "'Feliz' y 'contento' son sinónimos.",
    isTrue: true,
    justification: {
      prompt: "¿Por qué?",
      choices: [
        "Porque significan casi lo mismo",
        "Porque son antónimos",
      ],
      answerIndex: 0,
    },
    hint: "Pista: pensá si esas dos palabras se pueden usar para decir lo mismo.",
  });

  // 9: situación — usar las clases de palabras para revisar un cartel de
  // "Perdido" de verdad, en vez de clasificar una palabra suelta.
  acts.push({
    type: "find-error",
    id: "clases-error",
    title: "Actividad 9",
    prompt:
      "Estás armando un cartel de \"PERDIDO\" para encontrar a tu perro y escribiste: \"Mi perro Toby es marrón y ladra fuerte.\" Un amigo te dice que \"ladra\" es el adjetivo de esa descripción. Encontrá el error:",
    resolution: '"En esa oración, \'ladra\' es el adjetivo."',
    choices: [
      "Está mal: 'marrón' es el adjetivo (describe a Toby), 'ladra' es un verbo (una acción)",
      "Está bien, 'ladra' es el adjetivo",
    ],
    answerIndex: 0,
    correctAnswer:
      "'Marrón' es el adjetivo porque describe cómo es Toby; 'ladra' es un verbo porque es algo que hace.",
    hint: "Pista: pensá si esa palabra describe cómo es el perro o es algo que hace.",
  });

  acts.push({
    type: "classify",
    id: "clases-final",
    title: "Actividad 10: desafío final",
    prompt: "Clasificá cada palabra según su clase.",
    categories: ["Sustantivo", "Adjetivo", "Verbo"],
    items: shuffle([
      { label: "Biblioteca", categoryIndex: 0 },
      { label: "Curioso", categoryIndex: 1 },
      { label: "Investigar", categoryIndex: 2 },
      { label: "Enorme", categoryIndex: 1 },
      { label: "Montaña", categoryIndex: 0 },
      { label: "Descubrir", categoryIndex: 2 },
    ]),
    hint: "Pista: usá lo que ya practicaste en las actividades anteriores.",
  });

  return acts;
}

// ---------------------------------------------------------------------------
// Mundo 19: lectura narrativa — leyendas, historietas, estructura narrativa
// ---------------------------------------------------------------------------

function buildLecturaNarrativaActivities(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];

  acts.push({
    type: "mc",
    id: "narrativa-leyenda",
    title: "Actividad 1",
    prompt: "Una leyenda es un relato que...",
    choices: [
      "Explica de forma fantástica el origen de algo (un lugar, una planta, un animal)",
      "Cuenta una noticia del diario de hoy",
      "Da instrucciones para cocinar algo",
      "Es siempre una lista de compras",
    ],
    answerIndex: 0,
    hint: "Pista: pensá en historias que explican 'por qué' existe algo, de forma fantástica.",
  });

  acts.push({
    type: "mc",
    id: "narrativa-historieta",
    title: "Actividad 2",
    prompt: "En una historieta, ¿qué es el 'globo de diálogo'?",
    choices: [
      "El dibujo donde se escribe lo que dice un personaje",
      "El título de la historieta",
      "El nombre del autor",
      "El color del fondo",
    ],
    answerIndex: 0,
    hint: "Pista: pensá en esos dibujos redondeados con una colita que apunta a quien habla.",
  });

  acts.push({
    type: "classify",
    id: "narrativa-estructura",
    title: "Actividad 3",
    prompt: "Clasificá cada fragmento según la parte de la historia a la que pertenece.",
    categories: ["Inicio", "Complicación", "Resolución"],
    items: shuffle([
      { label: "Había una vez una niña que vivía en el bosque", categoryIndex: 0 },
      { label: "De repente apareció un lobo hambriento", categoryIndex: 1 },
      { label: "El cazador llegó y todos vivieron felices", categoryIndex: 2 },
    ]),
    hint: "Pista: el inicio presenta, la complicación trae un problema, la resolución lo soluciona.",
  });

  acts.push(
    buildOrderFromSequence(
      "narrativa-orden-estructura",
      "Actividad 4",
      "Ordená las partes de cualquier historia.",
      ["Inicio", "Complicación", "Resolución"],
      "Pista: primero se presenta la historia, después aparece un problema, y al final se resuelve."
    )
  );

  acts.push({
    type: "mc",
    id: "narrativa-caracteristica",
    title: "Actividad 5",
    prompt: "¿Qué diferencia principal tiene una leyenda de un cuento inventado libremente?",
    choices: [
      "La leyenda suele explicar el origen de algo real (un lugar, una costumbre)",
      "La leyenda nunca tiene personajes",
      "La leyenda siempre es muy corta",
      "No hay ninguna diferencia",
    ],
    answerIndex: 0,
    hint: "Pista: pensá en leyendas que expliquen por qué existe un río, una flor o una montaña.",
  });

  acts.push({
    type: "true-false",
    id: "narrativa-vf",
    title: "Actividad 6",
    statement: "Una historieta cuenta la historia solo con palabras, sin ningún dibujo.",
    isTrue: false,
    justification: {
      prompt: "¿Por qué?",
      choices: [
        "Porque una historieta combina dibujos (viñetas) con texto",
        "Porque una historieta no tiene personajes",
      ],
      answerIndex: 0,
    },
    hint: "Pista: pensá en cómo se ve una página de historieta.",
  });

  acts.push({
    type: "match",
    id: "narrativa-match",
    title: "Actividad 7",
    prompt: "Uní cada tipo de texto con su característica principal.",
    pairs: [
      { left: "Leyenda", right: "Explica el origen fantástico de algo" },
      { left: "Historieta", right: "Combina dibujos y texto en viñetas" },
      { left: "Poesía", right: "Tiene rima y ritmo" },
    ],
    hint: "Pista: pensá qué hace especial a cada tipo de texto.",
  });

  acts.push({
    type: "find-error",
    id: "narrativa-error",
    title: "Actividad 8",
    prompt: "Nico contó así una historia. Encontrá el error:",
    resolution: '"Primero se resolvió el problema, después apareció el problema, y al final se presentaron los personajes."',
    choices: [
      "Está en el orden incorrecto: primero va el inicio, después la complicación, y al final la resolución",
      "Está bien contado",
    ],
    answerIndex: 0,
    correctAnswer: "El orden correcto es: inicio, complicación y resolución.",
    hint: "Pista: pensá en qué orden pasan normalmente las cosas en una historia.",
  });

  acts.push({
    type: "mc",
    id: "narrativa-complicacion",
    title: "Actividad 9",
    prompt: "En una historia sobre un niño que se pierde en la feria y después lo encuentra su familia, ¿cuál es la complicación?",
    choices: [
      "Que el niño se pierde en la feria",
      "Que había una feria",
      "Que el niño tiene una familia",
      "Que la familia lo encuentra",
    ],
    answerIndex: 0,
    hint: "Pista: la complicación es el problema que aparece en la historia.",
  });

  acts.push(
    buildOrderFromSequence(
      "narrativa-final",
      "Actividad 10: desafío final",
      "Ordená las viñetas de esta historieta breve.",
      [
        "Un chico encuentra un cachorro perdido",
        "Pregunta en el barrio de quién es",
        "Encuentra a la dueña, muy preocupada",
        "Le devuelve el cachorro y ella le agradece",
      ],
      "Pista: pensá en el orden lógico de una historia de un animal perdido."
    )
  );

  return acts;
}

// ---------------------------------------------------------------------------
// Mundo 20: lectura informativa — textos informativos y paratextos
// ---------------------------------------------------------------------------

function buildLecturaInformativaActivities(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];

  acts.push({
    type: "mc",
    id: "informativa-tapa",
    title: "Actividad 1",
    prompt: "¿Qué es la tapa de un libro?",
    choices: [
      "La primera página, con el título y una imagen",
      "La última página en blanco",
      "El texto que está en el medio del libro",
      "La firma del autor",
    ],
    answerIndex: 0,
    hint: "Pista: es lo primero que ves cuando agarrás el libro.",
  });

  acts.push({
    type: "mc",
    id: "informativa-indice",
    title: "Actividad 2",
    prompt: "¿Para qué sirve el índice de un libro?",
    choices: [
      "Para saber en qué página está cada tema o capítulo",
      "Para dibujar los personajes",
      "Para escribir el nombre del autor",
      "Para pegar una foto",
    ],
    answerIndex: 0,
    hint: "Pista: pensá cuándo lo usás para buscar algo rápido.",
  });

  acts.push({
    type: "classify",
    id: "informativa-clasificar-partes",
    title: "Actividad 3",
    prompt: "Clasificá cada descripción según la parte del libro a la que corresponde.",
    categories: ["Tapa", "Índice", "Contratapa"],
    items: shuffle([
      { label: "Tiene el título y una ilustración grande", categoryIndex: 0 },
      { label: "Lista los capítulos con su número de página", categoryIndex: 1 },
      { label: "Está al final y suele resumir de qué trata el libro", categoryIndex: 2 },
    ]),
    hint: "Pista: pensá en qué parte del libro encontrarías cada cosa.",
  });

  acts.push({
    type: "mc",
    id: "informativa-tipo-texto",
    title: "Actividad 4",
    prompt: "¿Cuál de estos es un texto informativo?",
    choices: [
      "Un texto que explica cómo viven los pingüinos en la Antártida",
      "Un cuento de hadas con un dragón",
      "Una poesía sobre el mar",
      "Una historieta de superhéroes",
    ],
    answerIndex: 0,
    hint: "Pista: los textos informativos cuentan datos reales sobre un tema.",
  });

  acts.push({
    type: "true-false",
    id: "informativa-vf",
    title: "Actividad 5",
    statement: "Un texto informativo cuenta hechos reales, no cosas inventadas.",
    isTrue: true,
    justification: {
      prompt: "¿Por qué?",
      choices: [
        "Porque su objetivo es informar con datos verdaderos",
        "Porque siempre tiene rima",
      ],
      answerIndex: 0,
    },
    hint: "Pista: pensá en la diferencia con un cuento inventado.",
  });

  acts.push({
    type: "match",
    id: "informativa-vocabulario",
    title: "Actividad 6",
    prompt: "Uní cada palabra con su significado, según un texto sobre animales.",
    pairs: [
      { left: "Hábitat", right: "El lugar donde vive un animal" },
      { left: "Herbívoro", right: "Animal que se alimenta de plantas" },
      { left: "Carnívoro", right: "Animal que se alimenta de otros animales" },
    ],
    hint: "Pista: pensá en palabras que aparecen en textos sobre la naturaleza.",
  });

  acts.push({
    type: "mc",
    id: "informativa-comprension",
    title: "Actividad 7",
    prompt: "Texto: 'El guanaco es un animal de la Patagonia que vive en manada y puede correr muy rápido.' ¿Dónde vive el guanaco?",
    choices: ["En la Patagonia", "En el mar", "En la selva", "En el desierto del Sahara"],
    answerIndex: 0,
    hint: "Pista: la respuesta está escrita directamente en el texto.",
  });

  acts.push({
    type: "find-error",
    id: "informativa-error",
    title: "Actividad 8",
    prompt: "Sobre el mismo texto del guanaco, Vale dijo esta frase. Encontrá el error:",
    resolution: '"El guanaco vive en el mar y nada muy rápido."',
    choices: [
      "Está mal: el texto dice que vive en la Patagonia y corre rápido, no que nada",
      "Está bien, así lo dice el texto",
    ],
    answerIndex: 0,
    correctAnswer: "El guanaco vive en la Patagonia y corre muy rápido (no vive en el mar).",
    hint: "Pista: releé con atención lo que dice el texto original.",
  });

  acts.push({
    type: "classify",
    id: "informativa-clasificar-opinion",
    title: "Actividad 9",
    prompt: "Clasificá cada oración según sea un dato o una opinión.",
    categories: ["Dato (texto informativo)", "Opinión"],
    items: shuffle([
      { label: "El guanaco vive en la Patagonia.", categoryIndex: 0 },
      { label: "El guanaco es el animal más lindo del mundo.", categoryIndex: 1 },
      { label: "Los guanacos pueden correr muy rápido.", categoryIndex: 0 },
      { label: "Todos deberían tener un guanaco de mascota.", categoryIndex: 1 },
    ]),
    hint: "Pista: un dato se puede comprobar, una opinión es lo que alguien piensa o siente.",
  });

  acts.push({
    type: "mc",
    id: "informativa-final",
    title: "Actividad 10: desafío final",
    prompt: "Texto: 'El cóndor andino es una de las aves más grandes del mundo. Vuela muy alto gracias a sus enormes alas.' ¿Por qué puede volar tan alto el cóndor, según el texto?",
    choices: [
      "Porque tiene alas enormes",
      "Porque es muy chico",
      "Porque vive en el mar",
      "El texto no lo dice",
    ],
    answerIndex: 0,
    hint: "Pista: buscá la razón que da el propio texto.",
  });

  return acts;
}

// ---------------------------------------------------------------------------
// Mundo 21: escritura narrativa — cartas, historietas propias, conectores
// ---------------------------------------------------------------------------

function buildEscrituraNarrativaActivities(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];

  acts.push({
    type: "mc",
    id: "narrativa-escritura-partes",
    title: "Actividad 1",
    prompt: "A esta carta le falta una parte: '¡Hola, Sofi! Te escribo para contarte que...' (cuenta la novedad, y termina de golpe). ¿Qué le falta?",
    choices: ["La despedida", "El saludo", "El destinatario", "Nada, está completa"],
    answerIndex: 0,
    hint: "Pista: toda carta termina despidiéndose de alguna forma.",
  });

  acts.push({
    type: "classify",
    id: "narrativa-escritura-clasificar",
    title: "Actividad 2",
    prompt: "Clasificá cada frase según vaya en el saludo o en la despedida de una carta.",
    categories: ["Va en el saludo", "Va en la despedida"],
    items: shuffle([
      { label: "¡Hola, querido amigo!", categoryIndex: 0 },
      { label: "Un beso grande, nos vemos pronto.", categoryIndex: 1 },
      { label: "Querida abuela:", categoryIndex: 0 },
      { label: "Te quiero mucho, chau.", categoryIndex: 1 },
    ]),
    hint: "Pista: el saludo va al principio, la despedida al final.",
  });

  acts.push({
    type: "mc",
    id: "narrativa-conector-1",
    title: "Actividad 3",
    prompt: "Fui al parque ___ llovía mucho.",
    choices: ["pero", "y", "porque", "además"],
    answerIndex: 0,
    hint: "Pista: hay una idea que se opone a la otra (fui, a pesar de la lluvia).",
  });

  acts.push({
    type: "mc",
    id: "narrativa-conector-2",
    title: "Actividad 4",
    prompt: "No pude salir a jugar ___ estaba lloviendo.",
    choices: ["porque", "pero", "y", "sin embargo"],
    answerIndex: 0,
    hint: "Pista: buscás la causa de por qué no pudo salir.",
  });

  acts.push({
    type: "true-false",
    id: "narrativa-escritura-vf",
    title: "Actividad 5",
    statement: "Los conectores sirven para unir ideas dentro de un texto.",
    isTrue: true,
    justification: {
      prompt: "¿Por qué?",
      choices: [
        "Porque ayudan a relacionar una idea con otra",
        "Porque siempre van al final del texto",
      ],
      answerIndex: 0,
    },
    hint: "Pista: pensá para qué usamos palabras como 'y', 'pero' o 'porque'.",
  });

  acts.push({
    type: "classify",
    id: "narrativa-escritura-conectores",
    title: "Actividad 6",
    prompt: "Clasificá cada conector según lo que hace.",
    categories: ["Suma ideas", "Opone ideas"],
    items: shuffle([
      { label: "Y", categoryIndex: 0 },
      { label: "Además", categoryIndex: 0 },
      { label: "Pero", categoryIndex: 1 },
      { label: "Sin embargo", categoryIndex: 1 },
    ]),
    hint: "Pista: pensá si el conector agrega algo o muestra una diferencia.",
  });

  acts.push(
    buildOrderFromSequence(
      "narrativa-escritura-orden-carta",
      "Actividad 7",
      "Ordená las partes de una carta completa.",
      [
        "Encabezado (a quién va dirigida)",
        "Saludo",
        "Cuerpo (lo que querés contar)",
        "Despedida",
      ],
      "Pista: pensá en cómo empieza y cómo termina una carta."
    )
  );

  acts.push({
    type: "find-error",
    id: "narrativa-escritura-error",
    title: "Actividad 8",
    prompt: "Iara escribió esta carta. Encontrá el error:",
    resolution: '"Te cuento que el sábado es mi cumpleaños. Espero que puedas venir." (sin ningún saludo al principio)',
    choices: [
      "Le falta el saludo inicial (por ejemplo, '¡Hola!' o 'Querido amigo:')",
      "Está perfecta, no le falta nada",
    ],
    answerIndex: 0,
    correctAnswer: "Toda carta empieza con un saludo dirigido a quien la recibe.",
    hint: "Pista: fijate cómo empieza la carta de Iara.",
  });

  acts.push({
    type: "mc",
    id: "narrativa-escritura-tipo",
    title: "Actividad 9",
    prompt: "Si querés contar algo con dibujos y diálogos cortos en globitos, ¿qué tipo de texto conviene escribir?",
    choices: ["Una historieta", "Una carta", "Una receta", "Un índice"],
    answerIndex: 0,
    hint: "Pista: pensá en las viñetas con dibujos y globos de diálogo.",
  });

  acts.push(
    buildOrderFromSequence(
      "narrativa-escritura-final",
      "Actividad 10: desafío final",
      "Ordená los pasos para escribir una buena historieta.",
      [
        "Pensar la idea de la historia",
        "Dibujar las viñetas en orden",
        "Escribir los diálogos en los globitos",
        "Revisar y corregir antes de mostrarla",
      ],
      "Pista: pensá en el proceso completo, desde la idea hasta el final."
    )
  );

  return acts;
}

// ---------------------------------------------------------------------------
// Mundo 22: formación de palabras — concordancia, prefijos, sílaba tónica
// ---------------------------------------------------------------------------

function buildFormacionPalabrasActivities(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];

  acts.push({
    type: "mc",
    id: "formacion-concordancia-1",
    title: "Actividad 1",
    prompt: "La casa ___",
    choices: ["grande", "grandes", "grandotes"],
    answerIndex: 0,
    hint: "Pista: 'casa' es singular, el adjetivo tiene que concordar en número.",
  });

  acts.push({
    type: "mc",
    id: "formacion-concordancia-2",
    title: "Actividad 2",
    prompt: "Las casas ___",
    choices: ["grandes", "grande", "grando"],
    answerIndex: 0,
    hint: "Pista: 'casas' es plural, el adjetivo tiene que ir en plural también.",
  });

  acts.push({
    type: "classify",
    id: "formacion-clasificar-concordancia",
    title: "Actividad 3",
    prompt: "Clasificá cada pareja de palabras según concuerden bien o no.",
    categories: ["Concuerdan bien", "No concuerdan"],
    items: shuffle([
      { label: "Perro grande", categoryIndex: 0 },
      { label: "Perros grande", categoryIndex: 1 },
      { label: "Casas lindas", categoryIndex: 0 },
      { label: "Casa lindas", categoryIndex: 1 },
    ]),
    hint: "Pista: fijate si el sustantivo y el adjetivo están los dos en singular o los dos en plural.",
  });

  acts.push({
    type: "match",
    id: "formacion-prefijos",
    title: "Actividad 4",
    prompt: "Uní cada palabra con la palabra nueva que se forma agregando un prefijo.",
    pairs: [
      { left: "Feliz", right: "Infeliz" },
      { left: "Hacer", right: "Rehacer" },
      { left: "Orden", right: "Desorden" },
    ],
    hint: "Pista: un prefijo se agrega antes de la palabra y cambia su significado.",
  });

  acts.push({
    type: "mc",
    id: "formacion-silaba-tonica",
    title: "Actividad 5",
    prompt: "En la palabra 'mesa', ¿cuál es la sílaba que se pronuncia más fuerte?",
    choices: ["ME", "SA"],
    answerIndex: 0,
    hint: "Pista: decí la palabra en voz alta y fijate qué parte suena más fuerte.",
  });

  acts.push({
    type: "true-false",
    id: "formacion-vf-tonica",
    title: "Actividad 6",
    statement: "Todas las palabras tienen una sílaba que se pronuncia más fuerte que las demás.",
    isTrue: true,
    justification: {
      prompt: "¿Por qué?",
      choices: [
        "Porque esa es la sílaba tónica de la palabra",
        "Porque todas las palabras tienen solo una sílaba",
      ],
      answerIndex: 0,
    },
    hint: "Pista: probá decir cualquier palabra en voz alta.",
  });

  acts.push({
    type: "mc",
    id: "formacion-plural-z-1",
    title: "Actividad 7",
    prompt: "El plural de 'luz' es...",
    choices: ["Luces", "Luzes", "Luzs"],
    answerIndex: 0,
    hint: "Pista: las palabras terminadas en 'z' cambian la z por 'ces' en plural.",
  });

  acts.push({
    type: "mc",
    id: "formacion-plural-z-2",
    title: "Actividad 8",
    prompt: "El plural de 'nariz' es...",
    choices: ["Narices", "Narizes", "Narizs"],
    answerIndex: 0,
    hint: "Pista: recordá la regla: z → ces en plural.",
  });

  // 9: situación — corregir un cartel real antes de colgarlo, en vez de
  // clasificar la palabra suelta.
  acts.push({
    type: "find-error",
    id: "formacion-error",
    title: "Actividad 9",
    prompt:
      "Estás escribiendo el cartel para la feria de peces del club y pusiste: \"Hoy vendemos pezes de colores.\" Antes de colgarlo, encontrá el error:",
    resolution: '"Hoy vendemos pezes de colores."',
    choices: [
      "Está mal: el plural correcto es 'peces'",
      "Está bien escrito",
    ],
    answerIndex: 0,
    correctAnswer: "El plural de 'pez' es 'peces' (la z cambia por 'ces').",
    hint: "Pista: aplicá la regla z → ces.",
  });

  acts.push({
    type: "classify",
    id: "formacion-final",
    title: "Actividad 10: desafío final",
    prompt: "Clasificá cada palabra según termine en 'z' (y cambie a 'ces' en plural) o no.",
    categories: ["Cambia z por ces en plural", "No termina en z"],
    items: shuffle([
      { label: "Voz", categoryIndex: 0 },
      { label: "Mesa", categoryIndex: 1 },
      { label: "Lápiz", categoryIndex: 0 },
      { label: "Perro", categoryIndex: 1 },
    ]),
    hint: "Pista: fijate con qué letra termina cada palabra en singular.",
  });

  return acts;
}

// ---------------------------------------------------------------------------
// Mundo 23: oralidad — debates, argumentos, escucha respetuosa
// ---------------------------------------------------------------------------

function buildOralidadDebateActivities(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];

  acts.push({
    type: "mc",
    id: "debate-actitud",
    title: "Actividad 1",
    prompt: "¿Cuál es la mejor actitud para dar tu opinión en un debate?",
    choices: [
      "Hablar con respeto y esperar tu turno",
      "Gritar más fuerte que los demás",
      "No dejar hablar a nadie más",
      "Burlarte de la opinión de otros",
    ],
    answerIndex: 0,
    hint: "Pista: pensá en cómo te gustaría que te traten cuando vos hablás.",
  });

  acts.push({
    type: "true-false",
    id: "debate-vf-interrumpir",
    title: "Actividad 2",
    statement: "En un debate está bien interrumpir gritando para hablar primero.",
    isTrue: false,
    justification: {
      prompt: "¿Por qué?",
      choices: [
        "Porque hay que esperar el turno y respetar a quien está hablando",
        "Porque el que grita más fuerte siempre tiene razón",
      ],
      answerIndex: 0,
    },
    hint: "Pista: pensá en las reglas básicas de la buena convivencia.",
  });

  acts.push({
    type: "classify",
    id: "debate-clasificar-argumento",
    title: "Actividad 3",
    prompt: "Clasificá cada frase según sea un argumento (da una razón) o no.",
    categories: ["Es un argumento", "No es un argumento"],
    items: shuffle([
      { label: "Creo que hay que reciclar porque cuida el ambiente", categoryIndex: 0 },
      { label: "No me gusta y ya", categoryIndex: 1 },
      { label: "Prefiero el recreo largo porque descansamos mejor", categoryIndex: 0 },
      { label: "Porque sí", categoryIndex: 1 },
    ]),
    hint: "Pista: un argumento siempre da una razón, no solo una opinión sin explicar.",
  });

  acts.push({
    type: "mc",
    id: "debate-recurso",
    title: "Actividad 4",
    prompt: "Si estás contando la parte más emocionante de una historia, ¿qué conviene hacer con tu voz?",
    choices: [
      "Subir el volumen y el entusiasmo",
      "Hablar cada vez más bajito",
      "Quedarte en silencio",
      "Hablar muy rápido sin pausas",
    ],
    answerIndex: 0,
    hint: "Pista: pensá cómo contarías algo muy emocionante para captar la atención.",
  });

  acts.push({
    type: "match",
    id: "debate-match",
    title: "Actividad 5",
    prompt: "Uní cada situación con el recurso expresivo que conviene usar.",
    pairs: [
      { left: "Contar algo muy emocionante", right: "Subir el tono de voz" },
      { left: "Contar un secreto", right: "Bajar la voz" },
      { left: "Dar énfasis a algo importante", right: "Hacer una pausa antes de decirlo" },
    ],
    hint: "Pista: pensá cómo cambia tu forma de hablar según lo que querés transmitir.",
  });

  acts.push({
    type: "mc",
    id: "debate-mejor-opinion",
    title: "Actividad 6",
    prompt: "¿Cuál es la mejor manera de dar una opinión en un debate sobre si conviene tener mascotas en la escuela?",
    choices: [
      "Creo que no conviene, porque algunos compañeros pueden ser alérgicos",
      "No, porque no quiero y listo",
      "Sí, porque sí",
      "Me da igual, no me importa",
    ],
    answerIndex: 0,
    hint: "Pista: buscá la opción que da una razón clara.",
  });

  acts.push({
    type: "true-false",
    id: "debate-vf-escuchar",
    title: "Actividad 7",
    statement: "Escuchar la opinión de los demás también es parte de un buen debate.",
    isTrue: true,
    justification: {
      prompt: "¿Por qué?",
      choices: [
        "Porque un debate es un intercambio, no solo hablar",
        "Porque en un debate nadie tiene que hablar",
      ],
      answerIndex: 0,
    },
    hint: "Pista: pensá qué pasaría si nadie escuchara a nadie en un debate.",
  });

  acts.push({
    type: "find-error",
    id: "debate-error",
    title: "Actividad 8",
    prompt: "Fede dio esta opinión en un debate. Encontrá qué le falta:",
    resolution: '"Yo creo que no."',
    choices: [
      "Le falta dar una razón o argumento",
      "Está perfecta, no le falta nada",
    ],
    answerIndex: 0,
    correctAnswer: "Una buena opinión en un debate explica el porqué, con un argumento.",
    hint: "Pista: pensá si esa opinión explica alguna razón.",
  });

  acts.push({
    type: "classify",
    id: "debate-clasificar-comportamiento",
    title: "Actividad 9",
    prompt: "Clasificá cada comportamiento según ayude o no a un buen debate.",
    categories: ["Ayuda al debate", "No ayuda al debate"],
    items: shuffle([
      { label: "Escuchar con atención", categoryIndex: 0 },
      { label: "Respetar el turno para hablar", categoryIndex: 0 },
      { label: "Gritar para tapar a los demás", categoryIndex: 1 },
      { label: "Insultar a quien opina distinto", categoryIndex: 1 },
      { label: "Dar razones para tu opinión", categoryIndex: 0 },
      { label: "Interrumpir todo el tiempo", categoryIndex: 1 },
    ]),
    hint: "Pista: pensá qué actitudes ayudan a que todos puedan participar.",
  });

  acts.push({
    type: "mc",
    id: "debate-final",
    title: "Actividad 10: desafío final",
    prompt: "Desafío: ¿cuál de estos dos argumentos convence mejor para defender el reciclaje en la escuela?",
    choices: [
      "Reciclar reduce la basura y cuida el ambiente para todos",
      "Reciclar porque a mí me gusta",
    ],
    answerIndex: 0,
    hint: "Pista: el mejor argumento explica un beneficio claro, no solo un gusto personal.",
  });

  return acts;
}

// ---------------------------------------------------------------------------
// Mundo 24: lectura autónoma — explícito/implícito, síntesis
// ---------------------------------------------------------------------------

function buildLecturaAutonomaActivities(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];

  const texto =
    "Martín llegó tarde a la escuela, todo mojado, con el pelo chorreando y sin paraguas.";

  acts.push({
    type: "mc",
    id: "autonoma-literal",
    title: "Actividad 1",
    prompt: `Texto: "${texto}" ¿Cómo llegó Martín a la escuela?`,
    choices: ["Todo mojado", "Muy contento", "Con un paraguas nuevo", "Temprano"],
    answerIndex: 0,
    hint: "Pista: esta respuesta está escrita directamente en el texto.",
  });

  acts.push({
    type: "mc",
    id: "autonoma-inferencial",
    title: "Actividad 2",
    prompt: `Sobre el mismo texto de Martín: ¿qué se puede deducir que pasó, aunque el texto no lo diga directamente?`,
    choices: [
      "Probablemente estaba lloviendo y él no tenía paraguas",
      "Martín no fue a la escuela",
      "Era un día de mucho sol",
      "Martín llegó en auto",
    ],
    answerIndex: 0,
    hint: "Pista: pensá qué explicaría que llegue mojado y sin paraguas.",
  });

  acts.push({
    type: "classify",
    id: "autonoma-clasificar-preguntas",
    title: "Actividad 3",
    prompt: "Clasificá cada pregunta sobre el texto de Martín según su tipo.",
    categories: ["Se responde con el texto (explícita)", "Hay que deducirla (implícita)"],
    items: shuffle([
      { label: "¿Cómo llegó Martín, mojado o seco?", categoryIndex: 0 },
      { label: "¿Por qué estaría mojado?", categoryIndex: 1 },
      { label: "¿Llevaba paraguas?", categoryIndex: 0 },
      { label: "¿Cómo se sentiría Martín en ese momento?", categoryIndex: 1 },
    ]),
    hint: "Pista: lo explícito está escrito, lo implícito hay que pensarlo.",
  });

  acts.push({
    type: "mc",
    id: "autonoma-idea-principal",
    title: "Actividad 4",
    prompt: "Texto: 'Los guanacos viven en manada. Se cuidan entre ellos y avisan si hay peligro cerca.' ¿Cuál es la idea principal?",
    choices: [
      "Los guanacos viven en grupo y se cuidan entre sí",
      "Los guanacos son de color blanco",
      "Los guanacos viven solos",
      "Los guanacos no tienen enemigos",
    ],
    answerIndex: 0,
    hint: "Pista: la idea principal resume de qué se trata todo el texto.",
  });

  acts.push({
    type: "true-false",
    id: "autonoma-vf",
    title: "Actividad 5",
    statement: "Según el texto de los guanacos, ellos avisan a la manada si hay peligro cerca.",
    isTrue: true,
    justification: {
      prompt: "¿Cómo lo sabés?",
      choices: [
        "Porque el texto lo dice directamente",
        "Porque lo inventé yo",
      ],
      answerIndex: 0,
    },
    hint: "Pista: releé el texto sobre los guanacos.",
  });

  acts.push(
    buildOrderFromSequence(
      "autonoma-orden-hechos",
      "Actividad 6",
      "Ordená los hechos según sucedieron en esta historia: un chico planta una semilla, la riega todos los días, la semilla crece y se convierte en una planta, y finalmente florece.",
      [
        "Plantó una semilla",
        "La regó todos los días",
        "La semilla creció y se hizo una planta",
        "La planta finalmente floreció",
      ],
      "Pista: pensá en el proceso natural del crecimiento de una planta."
    )
  );

  acts.push({
    type: "mc",
    id: "autonoma-resumen",
    title: "Actividad 7",
    prompt: "Texto: 'Ana practicó todos los días y ganó la carrera del colegio.' ¿Cuál es el mejor resumen?",
    choices: [
      "Ana ganó la carrera gracias a su esfuerzo",
      "Ana perdió la carrera",
      "Ana no practicó nada",
      "Ana no fue a la carrera",
    ],
    answerIndex: 0,
    hint: "Pista: un buen resumen mantiene lo más importante del texto original.",
  });

  acts.push({
    type: "find-error",
    id: "autonoma-error",
    title: "Actividad 8",
    prompt: "Sobre el texto de Ana, Fran hizo este resumen. Encontrá el error:",
    resolution: '"Ana no practicó nunca y aun así ganó la carrera."',
    choices: [
      "Está mal: el texto dice que Ana practicó todos los días",
      "Está bien resumido",
    ],
    answerIndex: 0,
    correctAnswer: "El texto dice que Ana practicó todos los días antes de ganar.",
    hint: "Pista: comparalo con lo que dice el texto original.",
  });

  acts.push({
    type: "classify",
    id: "autonoma-clasificar-tipo",
    title: "Actividad 9",
    prompt: "Clasificá cada texto breve según su tipo, por sus características.",
    categories: ["Cuento", "Texto informativo", "Poesía"],
    items: shuffle([
      { label: "Había una vez un dragón que vivía en una cueva...", categoryIndex: 0 },
      { label: "El agua hierve a 100 grados a nivel del mar.", categoryIndex: 1 },
      { label: "El viento canta bajito entre las hojas doradas", categoryIndex: 2 },
    ]),
    hint: "Pista: pensá si narra algo inventado, si da datos, o si tiene ritmo y rima.",
  });

  acts.push({
    type: "mc",
    id: "autonoma-final",
    title: "Actividad 10: desafío final",
    prompt: "Texto: 'Sofía guardó su plata en una alcancía durante meses. Cuando la rompió, pudo comprarse la bicicleta que quería.' ¿Qué se puede deducir sobre Sofía?",
    choices: [
      "Que fue paciente y ahorró para lograr lo que quería",
      "Que no le gustan las bicicletas",
      "Que gastó toda la plata enseguida",
      "Que no ahorró nada",
    ],
    answerIndex: 0,
    hint: "Pista: pensá qué cualidad demuestra alguien que ahorra durante meses.",
  });

  return acts;
}

// ---------------------------------------------------------------------------
// Mundo 25: escritura creativa — cuentos propios, instructivos, planificación
// ---------------------------------------------------------------------------

function buildEscrituraCreativaActivities(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];

  acts.push({
    type: "mc",
    id: "creativa-partes-cuento",
    title: "Actividad 1",
    prompt: "En un cuento, ¿en qué parte se presentan los personajes y el lugar?",
    choices: ["En el inicio", "En el nudo", "En el desenlace", "En ninguna parte"],
    answerIndex: 0,
    hint: "Pista: pensá en cómo empieza cualquier cuento: 'Había una vez...'.",
  });

  acts.push({
    type: "classify",
    id: "creativa-clasificar-dialogo",
    title: "Actividad 2",
    prompt: "Clasificá cada oración de un cuento según sea descripción o diálogo.",
    categories: ["Descripción", "Diálogo"],
    items: shuffle([
      { label: "El bosque estaba oscuro y silencioso.", categoryIndex: 0 },
      { label: "—¡Vamos a llegar tarde! —gritó Juana.", categoryIndex: 1 },
      { label: "La princesa tenía el cabello dorado.", categoryIndex: 0 },
      { label: "—No tengas miedo —dijo el mago.", categoryIndex: 1 },
    ]),
    hint: "Pista: el diálogo es lo que dicen los personajes, casi siempre con raya (—).",
  });

  acts.push({
    type: "mc",
    id: "creativa-dialogo-puntuacion",
    title: "Actividad 3",
    prompt: "¿Cuál de estas opciones tiene el diálogo bien puntuado?",
    choices: [
      "—¡Hola! —dijo Martina.",
      "Hola dijo Martina",
      "\"Hola\" - dijo - Martina",
      "hola, dijo martina",
    ],
    answerIndex: 0,
    hint: "Pista: el diálogo se marca con una raya (—) antes de lo que dice el personaje.",
  });

  acts.push(
    buildOrderFromSequence(
      "creativa-orden-proceso",
      "Actividad 4",
      "Ordená los pasos para escribir un cuento.",
      [
        "Planificar la idea: quiénes son los personajes y qué les pasa",
        "Escribir un primer borrador",
        "Revisar y corregir lo que escribiste",
        "Pasarlo en limpio",
      ],
      "Pista: pensá en el proceso completo de escritura, no solo en escribirlo de una vez."
    )
  );

  acts.push({
    type: "true-false",
    id: "creativa-vf-planificar",
    title: "Actividad 5",
    statement: "Antes de escribir un cuento, conviene planificar qué va a pasar.",
    isTrue: true,
    justification: {
      prompt: "¿Por qué?",
      choices: [
        "Porque ayuda a organizar las ideas antes de escribir",
        "Porque así el cuento queda más corto",
      ],
      answerIndex: 0,
    },
    hint: "Pista: pensá si es más fácil escribir con un plan o sin ninguna idea.",
  });

  acts.push({
    type: "mc",
    id: "creativa-instructivo",
    title: "Actividad 6",
    prompt: "¿Qué es un instructivo?",
    choices: [
      "Un texto que da los pasos para hacer algo",
      "Un texto que cuenta una historia inventada",
      "Una lista de nombres",
      "Un poema con rima",
    ],
    answerIndex: 0,
    hint: "Pista: pensá en la receta de una torta, con pasos numerados.",
  });

  acts.push({
    type: "classify",
    id: "creativa-clasificar-instructivo",
    title: "Actividad 7",
    prompt: "Clasificá cada oración según vaya en un instructivo o en un cuento.",
    categories: ["Va en un instructivo (da un paso)", "Va en un cuento (narra algo)"],
    items: shuffle([
      { label: "Mezclá la harina con los huevos.", categoryIndex: 0 },
      { label: "Había una vez un dragón muy travieso.", categoryIndex: 1 },
      { label: "Cortá el papel por la línea punteada.", categoryIndex: 0 },
      { label: "El príncipe llegó al castillo al anochecer.", categoryIndex: 1 },
    ]),
    hint: "Pista: un instructivo da órdenes o pasos, un cuento narra hechos.",
  });

  acts.push({
    type: "find-error",
    id: "creativa-error",
    title: "Actividad 8",
    prompt: "Iván escribió este cuento. Encontrá qué le falta:",
    resolution: '"Había una vez un dragón que vivía solo en una cueva y estaba muy triste." (y ahí termina, de golpe)',
    choices: [
      "Le falta el desenlace: cómo se resuelve la historia del dragón",
      "Está completo, no le falta nada",
    ],
    answerIndex: 0,
    correctAnswer: "Todo cuento necesita un desenlace que cierre la historia.",
    hint: "Pista: pensá si esa historia queda resuelta o se corta de golpe.",
  });

  acts.push({
    type: "match",
    id: "creativa-match",
    title: "Actividad 9",
    prompt: "Uní cada parte del cuento con su función.",
    pairs: [
      { left: "Inicio", right: "Presenta a los personajes y el lugar" },
      { left: "Nudo", right: "Aparece el problema de la historia" },
      { left: "Desenlace", right: "Se resuelve el problema" },
    ],
    hint: "Pista: pensá en el orden en que se cuenta cualquier historia.",
  });

  acts.push(
    buildOrderFromSequence(
      "creativa-final",
      "Actividad 10: desafío final",
      "Ordená todo el proceso de escritura de un cuento, del principio al final.",
      [
        "Planificar la idea",
        "Escribir un primer borrador",
        "Revisar el borrador",
        "Corregir los errores encontrados",
        "Pasarlo en limpio",
      ],
      "Pista: pensá en los 5 pasos completos, uno por uno."
    )
  );

  return acts;
}

// ---------------------------------------------------------------------------
// Mundo 26: sentido de las palabras — connotación, ortografía avanzada
// ---------------------------------------------------------------------------

function buildSentidoPalabrasActivities(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];

  acts.push({
    type: "mc",
    id: "sentido-literal",
    title: "Actividad 1",
    prompt: "¿Cuál es el significado literal de la palabra 'piedra'?",
    choices: [
      "Un trozo de roca duro",
      "Una persona sin sentimientos",
      "Un problema difícil",
      "Algo aburrido",
    ],
    answerIndex: 0,
    hint: "Pista: el significado literal es el más directo, el del diccionario.",
  });

  acts.push({
    type: "mc",
    id: "sentido-figurado",
    title: "Actividad 2",
    prompt: "En la frase 'Tiene un corazón de piedra', ¿qué quiere decir realmente?",
    choices: [
      "Que es una persona fría, que no se conmueve fácilmente",
      "Que tiene un corazón hecho literalmente de roca",
      "Que le gustan mucho las piedras",
      "Que está enfermo del corazón",
    ],
    answerIndex: 0,
    hint: "Pista: esta expresión no se usa en su sentido literal, sino figurado.",
  });

  acts.push({
    type: "classify",
    id: "sentido-clasificar",
    title: "Actividad 3",
    prompt: "Clasificá cada frase según tenga sentido literal o figurado.",
    categories: ["Sentido literal", "Sentido figurado"],
    items: shuffle([
      { label: "El gato duerme en la alfombra.", categoryIndex: 0 },
      { label: "Está en las nubes, no presta atención.", categoryIndex: 1 },
      { label: "La niña comió una manzana.", categoryIndex: 0 },
      { label: "Se le hizo un nudo en la garganta.", categoryIndex: 1 },
    ]),
    hint: "Pista: el sentido figurado no se puede entender palabra por palabra.",
  });

  acts.push({
    type: "mc",
    id: "sentido-preterito-1",
    title: "Actividad 4",
    prompt: "Todos los días yo ___ en la plaza. (jugar)",
    choices: ["jugaba", "jugo", "jugará", "juego"],
    answerIndex: 0,
    hint: "Pista: se refiere a algo que pasaba en el pasado, de forma repetida.",
  });

  acts.push({
    type: "mc",
    id: "sentido-preterito-2",
    title: "Actividad 5",
    prompt: "Antes, mi abuela me ___ cuentos todas las noches. (contar)",
    choices: ["contaba", "cuenta", "contará", "cuento"],
    answerIndex: 0,
    hint: "Pista: es algo que pasaba antes, de manera habitual.",
  });

  acts.push({
    type: "true-false",
    id: "sentido-vf-preterito",
    title: "Actividad 6",
    statement: "Los verbos terminados en '-ar' en pretérito imperfecto suelen terminar en '-aba' (como 'jugaba', 'cantaba').",
    isTrue: true,
    justification: {
      prompt: "¿Por qué?",
      choices: [
        "Porque es la terminación típica de esa forma verbal",
        "Porque todos los verbos terminan igual siempre",
      ],
      answerIndex: 0,
    },
    hint: "Pista: pensá en varios verbos terminados en '-ar' en esa forma: jugaba, cantaba, saltaba.",
  });

  acts.push({
    type: "mc",
    id: "sentido-mb",
    title: "Actividad 7",
    prompt: "¿Cómo se escribe correctamente?",
    choices: ["Tambor", "Tanbor"],
    answerIndex: 0,
    hint: "Pista: antes de 'b' siempre se escribe 'm', nunca 'n'.",
  });

  acts.push({
    type: "mc",
    id: "sentido-nv",
    title: "Actividad 8",
    prompt: "¿Cómo se escribe correctamente?",
    choices: ["Invierno", "Imvierno"],
    answerIndex: 0,
    hint: "Pista: antes de 'v' siempre se escribe 'n', nunca 'm'.",
  });

  acts.push({
    type: "find-error",
    id: "sentido-error",
    title: "Actividad 9",
    prompt: "Bauti escribió esta palabra. Encontrá el error:",
    resolution: '"emredadera"',
    choices: [
      "Está mal: se escribe 'enredadera', con n antes de la r",
      "Está bien escrita",
    ],
    answerIndex: 0,
    correctAnswer: "Se escribe 'enredadera'.",
    hint: "Pista: pensá en la regla de 'n' antes de 'r' en ese grupo de letras.",
  });

  acts.push({
    type: "classify",
    id: "sentido-final",
    title: "Actividad 10: desafío final",
    prompt: "Clasificá cada palabra según lleve 'mb', 'nv' o 'nr' correctamente escrita.",
    categories: ["Lleva mb", "Lleva nv", "Lleva nr"],
    items: shuffle([
      { label: "Sombrero", categoryIndex: 0 },
      { label: "Invitación", categoryIndex: 1 },
      { label: "Enredo", categoryIndex: 2 },
      { label: "Cambio", categoryIndex: 0 },
      { label: "Envase", categoryIndex: 1 },
      { label: "Enramada", categoryIndex: 2 },
    ]),
    hint: "Pista: fijate qué letra va justo antes de la b, la v o la r en cada palabra.",
  });

  return acts;
}

// ---------------------------------------------------------------------------
// Mundo 27: seres vivos — fauna y flora local, cuerpo humano, cuidado
// ---------------------------------------------------------------------------

function buildSeresVivosDiversidadActivities(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];

  acts.push({
    type: "mc",
    id: "svdiv-fauna",
    title: "Actividad 1",
    prompt: "¿Cuál de estos animales vive en la estepa de Santa Cruz?",
    choices: ["Guanaco", "Mono", "Tucán", "Jaguar"],
    answerIndex: 0,
    hint: "Pista: pensá en los animales que se ven en los campos de la Patagonia.",
  });

  acts.push({
    type: "mc",
    id: "svdiv-flora",
    title: "Actividad 2",
    prompt: "¿Cuál de estas plantas es típica de la Patagonia?",
    choices: ["El calafate", "La palmera", "El cactus del desierto", "La orquídea"],
    answerIndex: 0,
    hint: "Pista: hay un dicho que dice 'el que come calafate, siempre vuelve'.",
  });

  acts.push({
    type: "classify",
    id: "svdiv-clasificar-region",
    title: "Actividad 3",
    prompt: "Clasificá cada ser vivo según dónde vive.",
    categories: ["Vive en Santa Cruz", "Vive en otras regiones más cálidas"],
    items: shuffle([
      { label: "Guanaco", categoryIndex: 0 },
      { label: "Ñandú", categoryIndex: 0 },
      { label: "Mono", categoryIndex: 1 },
      { label: "Tucán", categoryIndex: 1 },
    ]),
    hint: "Pista: pensá cuáles son animales de campo frío y cuáles de selva.",
  });

  acts.push({
    type: "classify",
    id: "svdiv-planta-animal",
    title: "Actividad 4",
    prompt: "Clasificá cada elemento según sea planta o animal.",
    categories: ["Planta", "Animal"],
    items: shuffle([
      { label: "Calafate", categoryIndex: 0 },
      { label: "Coirón", categoryIndex: 0 },
      { label: "Guanaco", categoryIndex: 1 },
      { label: "Zorro colorado", categoryIndex: 1 },
    ]),
    hint: "Pista: una se queda quieta en la tierra, el otro se mueve solo.",
  });

  acts.push({
    type: "match",
    id: "svdiv-organos",
    title: "Actividad 5",
    prompt: "Uní cada órgano con su función principal.",
    pairs: [
      { left: "Corazón", right: "Bombea la sangre" },
      { left: "Pulmones", right: "Nos ayudan a respirar" },
      { left: "Estómago", right: "Digiere los alimentos" },
      { left: "Cerebro", right: "Piensa y controla el cuerpo" },
    ],
    hint: "Pista: pensá qué hace cada parte de tu cuerpo todos los días.",
  });

  acts.push({
    type: "true-false",
    id: "svdiv-vf",
    title: "Actividad 6",
    statement: "Las plantas son seres vivos, igual que los animales.",
    isTrue: true,
    justification: {
      prompt: "¿Por qué?",
      choices: [
        "Porque nacen, crecen, se reproducen y mueren",
        "Porque tienen ojos y boca",
      ],
      answerIndex: 0,
    },
    hint: "Pista: pensá en las características que comparten todos los seres vivos.",
  });

  // 7: situación — plantaste una semilla y se está marchitando; para
  // encontrar qué paso te salteaste hay que repasar el orden completo del
  // cuidado, no solo memorizar la lista.
  acts.push(
    buildOrderFromSequence(
      "svdiv-cuidar-planta",
      "Actividad 7",
      "Plantaste una semilla y a los días la ves marchita. Ordená los pasos para cuidarla bien y descubrí cuál te salteaste.",
      [
        "Elegir una maceta con tierra",
        "Plantar la semilla",
        "Regarla con agua",
        "Ponerla donde le dé el sol",
      ],
      "Pista: pensá en el orden en que plantarías una semilla en tu casa."
    )
  );

  acts.push({
    type: "mc",
    id: "svdiv-higiene",
    title: "Actividad 8",
    prompt: "¿Qué debemos hacer antes de comer para cuidar nuestra salud?",
    choices: ["Lavarnos las manos", "Correr", "Dormir", "Cantar"],
    answerIndex: 0,
    hint: "Pista: pensá en los gérmenes que pueden estar en nuestras manos.",
  });

  acts.push({
    type: "find-error",
    id: "svdiv-error",
    title: "Actividad 9",
    prompt: "Camila dijo esta frase. Encontrá el error:",
    resolution: "\"El guanaco es un animal que solo vive en la selva tropical.\"",
    choices: [
      "Está mal: el guanaco vive en la estepa patagónica, no en la selva",
      "Está bien, esa es la definición correcta",
    ],
    answerIndex: 0,
    correctAnswer: "El guanaco vive en ambientes fríos y áridos como la estepa de la Patagonia.",
    hint: "Pista: pensá en el clima frío y seco de nuestra provincia.",
  });

  acts.push({
    type: "mc",
    id: "svdiv-final",
    title: "Actividad 10: desafío final",
    prompt: "Desafío: ¿cuál de estos NO es un órgano del cuerpo humano?",
    choices: ["Corazón", "Pulmón", "Mochila", "Estómago"],
    answerIndex: 2,
    hint: "Pista: pensá cuál de estas cosas no forma parte de tu cuerpo.",
  });

  return acts;
}

// ---------------------------------------------------------------------------
// Mundo 28: materiales — mezclas sencillas y registro de observaciones
// ---------------------------------------------------------------------------

function buildMaterialesMezclasActivities(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];

  acts.push({
    type: "mc",
    id: "matmez-arena",
    title: "Actividad 1",
    prompt: "¿Qué pasa si mezclás agua con arena?",
    choices: [
      "Se puede separar la arena del agua",
      "Desaparecen los dos",
      "Se convierten en otro material",
      "Se transforman en hielo",
    ],
    answerIndex: 0,
    hint: "Pista: pensá si la arena se disuelve o se puede ver y colar.",
  });

  // 2: situación — se derramó agua salada en la mesada de la cocina y hay
  // que decidir cómo recuperar la sal, aplicando que se disolvió y no
  // desapareció, en vez de solo describir qué pasa al mezclar.
  acts.push({
    type: "mc",
    id: "matmez-sal",
    title: "Actividad 2",
    prompt:
      "Se te derramó agua con sal en la mesada de la cocina y no querés desperdiciar la sal. ¿Qué podés hacer para recuperarla?",
    choices: [
      "Dejar que el agua se evapore y juntar la sal que queda",
      "Tirar todo, porque la sal desapareció para siempre",
      "Colarla con un colador de fideos",
      "Guardarla en el freezer para que se separe",
    ],
    answerIndex: 0,
    hint: "Pista: la sal no desaparece en el agua, solo se disuelve; el agua se puede evaporar.",
  });

  acts.push({
    type: "classify",
    id: "matmez-clasificar-visible",
    title: "Actividad 3",
    prompt: "Clasificá cada mezcla según se vean sus componentes o no.",
    categories: ["Se ven los componentes", "No se ven a simple vista"],
    items: shuffle([
      { label: "Agua con arena", categoryIndex: 0 },
      { label: "Agua con piedritas", categoryIndex: 0 },
      { label: "Agua con sal", categoryIndex: 1 },
      { label: "Agua con azúcar", categoryIndex: 1 },
    ]),
    hint: "Pista: pensá si al mirar el vaso podés distinguir cada material.",
  });

  acts.push({
    type: "match",
    id: "matmez-separar",
    title: "Actividad 4",
    prompt: "Uní cada mezcla con la forma de separarla.",
    pairs: [
      { left: "Agua y arena", right: "Dejar que la arena se asiente y colar" },
      { left: "Agua y sal", right: "Dejar que el agua se evapore" },
      { left: "Arroz y porotos", right: "Separarlos a mano o con un colador" },
    ],
    hint: "Pista: pensá qué método usarías en tu casa para cada caso.",
  });

  acts.push({
    type: "true-false",
    id: "matmez-vf",
    title: "Actividad 5",
    statement: "Una mezcla siempre forma un material completamente nuevo.",
    isTrue: false,
    justification: {
      prompt: "¿Por qué?",
      choices: [
        "Porque en una mezcla cada componente conserva sus propiedades",
        "Porque las mezclas nunca se pueden separar",
      ],
      answerIndex: 0,
    },
    hint: "Pista: pensá si la arena sigue siendo arena después de mezclarla con agua.",
  });

  acts.push(
    buildOrderFromSequence(
      "matmez-experimento",
      "Actividad 6",
      "Ordená los pasos para hacer una mezcla y observarla.",
      [
        "Elegir los materiales para mezclar",
        "Mezclarlos en un recipiente",
        "Observar y registrar lo que pasa",
        "Contar las conclusiones a los compañeros",
      ],
      "Pista: pensá en el orden de cualquier experimento simple."
    )
  );

  acts.push({
    type: "mc",
    id: "matmez-cocina",
    title: "Actividad 7",
    prompt: "¿Cuál de estos es un ejemplo de mezcla que podemos encontrar en la cocina?",
    choices: ["Agua con azúcar", "Un vaso vacío", "Una piedra sola", "El aire quieto"],
    answerIndex: 0,
    hint: "Pista: pensá en dos materiales juntos, no en uno solo.",
  });

  acts.push({
    type: "find-error",
    id: "matmez-error",
    title: "Actividad 8",
    prompt: "Tomás dijo esta frase. Encontrá el error:",
    resolution: "\"Cuando mezclo agua con sal, la sal desaparece para siempre y no se puede recuperar.\"",
    choices: [
      "Está mal: si dejamos que el agua se evapore, la sal vuelve a aparecer",
      "Está bien, la sal desaparece para siempre",
    ],
    answerIndex: 0,
    correctAnswer: "La sal no desaparece, se disuelve; si el agua se evapora, la sal queda.",
    hint: "Pista: pensá qué queda en el fondo de un plato cuando se seca el agua salada.",
  });

  acts.push({
    type: "classify",
    id: "matmez-clasificar-disuelve",
    title: "Actividad 9",
    prompt: "Clasificá según el resultado de mezclar estos materiales con agua.",
    categories: ["Se disuelve (no se ve)", "No se disuelve (se ve)"],
    items: shuffle([
      { label: "Azúcar en agua", categoryIndex: 0 },
      { label: "Sal en agua", categoryIndex: 0 },
      { label: "Arena en agua", categoryIndex: 1 },
      { label: "Piedritas en agua", categoryIndex: 1 },
    ]),
    hint: "Pista: pensá cuáles se vuelven invisibles en el agua.",
  });

  acts.push({
    type: "mc",
    id: "matmez-final",
    title: "Actividad 10: desafío final",
    prompt: "Desafío: ¿qué instrumento nos ayuda a registrar lo que observamos en un experimento?",
    choices: ["Un cuaderno de registro", "Una pelota", "Una bicicleta", "Un paraguas"],
    answerIndex: 0,
    hint: "Pista: pensá en algo donde se pueda escribir y dibujar.",
  });

  return acts;
}

// ---------------------------------------------------------------------------
// Mundo 29: fenómenos físicos básicos — calor, frío, acciones mecánicas
// ---------------------------------------------------------------------------

function buildFenomenosFisicosBasicosActivities(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];

  acts.push({
    type: "mc",
    id: "fenbas-metal-sol",
    title: "Actividad 1",
    prompt: "¿Cuál de estos materiales se calienta más rápido al sol?",
    choices: ["El metal", "La lana", "La madera", "La goma espuma"],
    answerIndex: 0,
    hint: "Pista: pensá en un tobogán de metal en un día de sol.",
  });

  acts.push({
    type: "classify",
    id: "fenbas-clasificar-accion",
    title: "Actividad 2",
    prompt: "Clasificá cada acción según el efecto que produce.",
    categories: ["Cambia de forma", "Cambia de lugar"],
    items: shuffle([
      { label: "Aplastar una masa", categoryIndex: 0 },
      { label: "Estirar un elástico", categoryIndex: 0 },
      { label: "Empujar un carrito", categoryIndex: 1 },
      { label: "Tirar de una soga", categoryIndex: 1 },
    ]),
    hint: "Pista: pensá si el objeto se deforma o si se mueve de lugar.",
  });

  acts.push({
    type: "mc",
    id: "fenbas-hielo",
    title: "Actividad 3",
    prompt: "¿Qué le pasa a un cubito de hielo si lo dejamos al sol?",
    choices: ["Se derrite por el calor", "Se pone más frío", "Se transforma en piedra", "No le pasa nada"],
    answerIndex: 0,
    hint: "Pista: pensá qué le pasa a un helado si lo dejás afuera.",
  });

  acts.push({
    type: "match",
    id: "fenbas-match",
    title: "Actividad 4",
    prompt: "Uní cada acción mecánica con su ejemplo.",
    pairs: [
      { left: "Empujar", right: "Correr un mueble" },
      { left: "Estirar", right: "Un elástico" },
      { left: "Aplastar", right: "Una masa de plastilina" },
    ],
    hint: "Pista: imaginate haciendo cada acción con las manos.",
  });

  acts.push({
    type: "true-false",
    id: "fenbas-vf",
    title: "Actividad 5",
    statement: "El metal conduce el calor mejor que la madera.",
    isTrue: true,
    justification: {
      prompt: "¿Por qué?",
      choices: [
        "Porque el metal se calienta y se enfría más rápido",
        "Porque el metal es más pesado",
      ],
      answerIndex: 0,
    },
    hint: "Pista: pensá en una cuchara de metal en agua caliente.",
  });

  acts.push(
    buildOrderFromSequence(
      "fenbas-experimento",
      "Actividad 6",
      "Ordená los pasos de este experimento con calor.",
      [
        "Poner una cucharita de metal y una de madera en agua caliente",
        "Esperar unos minutos",
        "Tocar con cuidado el mango de cada una",
        "Anotar cuál se calentó más rápido",
      ],
      "Pista: pensá en el orden lógico de cualquier experimento."
    )
  );

  acts.push({
    type: "mc",
    id: "fenbas-empujar",
    title: "Actividad 7",
    prompt: "¿Cuál de estas acciones es un ejemplo de empujar?",
    choices: ["Correr una silla hacia la pared", "Estirar una goma", "Aplastar una masa", "Escuchar música"],
    answerIndex: 0,
    hint: "Pista: pensá en mover algo haciendo fuerza hacia adelante.",
  });

  acts.push({
    type: "find-error",
    id: "fenbas-error",
    title: "Actividad 8",
    prompt: "Sofía dijo esta frase. Encontrá el error:",
    resolution: "\"Todos los materiales se calientan a la misma velocidad.\"",
    choices: [
      "Está mal: algunos materiales, como el metal, conducen mejor el calor que otros",
      "Está bien, todos son iguales",
    ],
    answerIndex: 0,
    correctAnswer: "Los materiales conducen el calor de forma distinta: el metal más rápido que la madera o la tela.",
    hint: "Pista: pensá en la cuchara de metal y la de madera en agua caliente.",
  });

  acts.push({
    type: "classify",
    id: "fenbas-clasificar-fuente",
    title: "Actividad 9",
    prompt: "Clasificá según sea una fuente de calor o de frío.",
    categories: ["Da calor", "Da frío"],
    items: shuffle([
      { label: "El sol", categoryIndex: 0 },
      { label: "Una estufa", categoryIndex: 0 },
      { label: "El hielo", categoryIndex: 1 },
      { label: "El freezer", categoryIndex: 1 },
    ]),
    hint: "Pista: pensá si te calentarías o te enfriarías cerca de cada uno.",
  });

  // 10: situación — hay que servir una sopa bien caliente y elegir con qué
  // cuchara hacerlo sin quemarse, aplicando la conducción del calor a una
  // decisión real en vez de comparar cucharas ya usadas.
  acts.push({
    type: "mc",
    id: "fenbas-final",
    title: "Actividad 10: desafío final",
    prompt:
      "Desafío: vas a servir una sopa bien caliente. ¿Con qué cuchara conviene revolverla para no quemarte la mano: la de metal o la de madera?",
    choices: [
      "Con la de madera, porque conduce menos el calor",
      "Con la de metal, porque es más resistente",
      "Da lo mismo cuál uses",
      "Con la de metal, porque se calienta más rápido y así se enfría antes la sopa",
    ],
    answerIndex: 0,
    hint: "Pista: pensá cuál cuchara se pone más caliente cuando la dejás en algo caliente.",
  });

  return acts;
}

// ---------------------------------------------------------------------------
// Mundo 30: paisajes locales/provinciales y orientación espacial
// ---------------------------------------------------------------------------

function buildPaisajesOrientacionActivities(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];

  acts.push({
    type: "mc",
    id: "paisaje-natural",
    title: "Actividad 1",
    prompt: "¿Cuál de estos es un elemento natural de un paisaje?",
    choices: ["Una montaña", "Una ruta", "Un puente", "Una casa"],
    answerIndex: 0,
    hint: "Pista: pensá en algo que existe sin que las personas lo construyan.",
  });

  acts.push({
    type: "mc",
    id: "paisaje-social",
    title: "Actividad 2",
    prompt: "¿Cuál de estos es un elemento hecho por las personas?",
    choices: ["Una ruta", "Un río", "Una montaña", "El cielo"],
    answerIndex: 0,
    hint: "Pista: pensá en algo que se construye para poder viajar.",
  });

  acts.push({
    type: "classify",
    id: "paisaje-clasificar",
    title: "Actividad 3",
    prompt: "Clasificá cada elemento del paisaje.",
    categories: ["Elemento natural", "Elemento social"],
    items: shuffle([
      { label: "Río", categoryIndex: 0 },
      { label: "Meseta", categoryIndex: 0 },
      { label: "Puente", categoryIndex: 1 },
      { label: "Casa", categoryIndex: 1 },
    ]),
    hint: "Pista: pensá si lo hizo la naturaleza o las personas.",
  });

  acts.push({
    type: "mc",
    id: "paisaje-santacruz",
    title: "Actividad 4",
    prompt: "En Santa Cruz, ¿qué tipo de paisaje es más común?",
    choices: ["Meseta y estepa patagónica", "Selva tropical", "Desierto de arena caliente", "Bosque tropical húmedo"],
    answerIndex: 0,
    hint: "Pista: pensá en el paisaje que ves cerca de tu escuela.",
  });

  acts.push({
    type: "match",
    id: "paisaje-cardinales",
    title: "Actividad 5",
    prompt: "Uní cada punto cardinal con su ubicación.",
    pairs: [
      { left: "Norte", right: "Arriba en un mapa" },
      { left: "Sur", right: "Abajo en un mapa" },
      { left: "Este", right: "Por donde sale el Sol" },
      { left: "Oeste", right: "Por donde se esconde el Sol" },
    ],
    hint: "Pista: pensá cómo se dibujan los mapas y por dónde sale el Sol.",
  });

  acts.push({
    type: "true-false",
    id: "paisaje-vf",
    title: "Actividad 6",
    statement: "El Sol siempre sale por el oeste.",
    isTrue: false,
    justification: {
      prompt: "¿Por qué?",
      choices: [
        "Porque el Sol sale por el este y se esconde por el oeste",
        "Porque el Sol nunca se mueve",
      ],
      answerIndex: 0,
    },
    hint: "Pista: pensá por dónde amanece cada mañana.",
  });

  // 7: situación — te perdiste en la estepa al atardecer y tenés que usar
  // la posición del Sol que se pone frente a vos para encontrar el Norte,
  // en vez de solo ordenar un procedimiento general.
  acts.push(
    buildOrderFromSequence(
      "paisaje-orientarse",
      "Actividad 7",
      "Te perdiste en la estepa y ves el Sol ponerse justo frente a vos. Ordená los pasos para saber hacia dónde caminar para ir al Norte.",
      [
        "Mirar hacia el Sol que se está escondiendo: ese lado es el Oeste",
        "Recordar que el Este queda del lado contrario, a tu espalda",
        "Quedarte mirando hacia el Oeste sin girar el cuerpo",
        "Caminar hacia tu mano derecha: ese lado es el Norte",
      ],
      "Pista: si el Sol se pone frente a vos, estás mirando al Oeste; el Norte queda a tu derecha."
    )
  );

  acts.push({
    type: "find-error",
    id: "paisaje-error",
    title: "Actividad 8",
    prompt: "Martín dijo esta frase. Encontrá el error:",
    resolution: "\"Los puntos cardinales son solamente el Norte y el Sur.\"",
    choices: [
      "Está mal: también existen el Este y el Oeste",
      "Está bien, son solo dos",
    ],
    answerIndex: 0,
    correctAnswer: "Los puntos cardinales son cuatro: Norte, Sur, Este y Oeste.",
    hint: "Pista: contá cuántas direcciones nombra el mapa.",
  });

  acts.push({
    type: "classify",
    id: "paisaje-clasificar-agua",
    title: "Actividad 9",
    prompt: "Clasificá cada paisaje según tenga más agua o sea tierra seca.",
    categories: ["Con mucha agua", "Tierra seca (estepa)"],
    items: shuffle([
      { label: "Un lago", categoryIndex: 0 },
      { label: "Un río", categoryIndex: 0 },
      { label: "La meseta patagónica", categoryIndex: 1 },
      { label: "Un campo seco", categoryIndex: 1 },
    ]),
    hint: "Pista: pensá si el lugar tiene agua visible o no.",
  });

  acts.push({
    type: "mc",
    id: "paisaje-final",
    title: "Actividad 10: desafío final",
    prompt: "Desafío: si el Sol sale por tu derecha y vos mirás hacia el Norte, ¿qué punto cardinal es tu derecha?",
    choices: ["El Este", "El Oeste", "El Sur", "El Norte"],
    answerIndex: 0,
    hint: "Pista: si mirás al Norte, el Este queda a tu mano derecha.",
  });

  return acts;
}

// ---------------------------------------------------------------------------
// Mundo 31: interacciones entre seres vivos, higiene y agua potable
// ---------------------------------------------------------------------------

function buildSeresVivosInteraccionesActivities(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];

  acts.push({
    type: "classify",
    id: "svint-clasificar-dieta",
    title: "Actividad 1",
    prompt: "Clasificá cada animal según qué come.",
    categories: ["Herbívoro", "Carnívoro", "Omnívoro"],
    items: shuffle([
      { label: "Guanaco", categoryIndex: 0 },
      { label: "Vaca", categoryIndex: 0 },
      { label: "Puma", categoryIndex: 1 },
      { label: "Cóndor", categoryIndex: 1 },
      { label: "Cerdo", categoryIndex: 2 },
    ]),
    hint: "Pista: pensá si come solo plantas, solo animales, o de todo un poco.",
  });

  acts.push({
    type: "mc",
    id: "svint-herbivoro",
    title: "Actividad 2",
    prompt: "¿Qué come un herbívoro?",
    choices: ["Solamente plantas", "Solamente carne", "Plantas y animales", "Nada, no necesita comer"],
    answerIndex: 0,
    hint: "Pista: pensá en el significado de 'hierba' dentro de la palabra.",
  });

  acts.push({
    type: "match",
    id: "svint-match",
    title: "Actividad 3",
    prompt: "Uní cada animal con lo que come.",
    pairs: [
      { left: "Guanaco", right: "Pastos y arbustos" },
      { left: "Puma", right: "Otros animales" },
      { left: "Zorro colorado", right: "Animales pequeños y frutos" },
    ],
    hint: "Pista: pensá en la dieta típica de cada animal patagónico.",
  });

  acts.push({
    type: "mc",
    id: "svint-manos",
    title: "Actividad 4",
    prompt: "¿Por qué es importante lavarse las manos antes de comer?",
    choices: [
      "Para evitar enfermedades por gérmenes",
      "Para que la comida tenga mejor sabor",
      "Para que la comida sea más grande",
      "No tiene ninguna razón",
    ],
    answerIndex: 0,
    hint: "Pista: pensá en lo que no se ve a simple vista en las manos sucias.",
  });

  acts.push({
    type: "true-false",
    id: "svint-vf",
    title: "Actividad 5",
    statement: "Tomar agua potable es importante para cuidar nuestra salud.",
    isTrue: true,
    justification: {
      prompt: "¿Por qué?",
      choices: [
        "Porque el agua no potable puede tener gérmenes que nos enferman",
        "Porque el agua potable tiene más color",
      ],
      answerIndex: 0,
    },
    hint: "Pista: pensá qué puede tener un agua que no está tratada.",
  });

  // 6: situación — volviste de comprar y se cortó la luz dos horas, hay que
  // decidir qué alimentos revisar primero según cuáles se echan a perder
  // más rápido, en vez de ordenar pasos generales de conservación.
  acts.push(
    buildOrderFromSequence(
      "svint-conservar",
      "Actividad 6",
      "Volviste de comprar y justo se cortó la luz durante dos horas. Ordená estos alimentos del que revisarías PRIMERO (se arruina más rápido) al que puede esperar más tiempo.",
      [
        "El helado (se derrite y no se puede recongelar bien)",
        "La carne picada (se descompone rápido sin frío)",
        "La leche (se corta si pasa mucho calor)",
        "Las papas (aguantan bastante tiempo fuera de la heladera)",
      ],
      "Pista: pensá qué alimentos se echan a perder más rápido si dejan de estar fríos."
    )
  );

  acts.push({
    type: "classify",
    id: "svint-clasificar-conservacion",
    title: "Actividad 7",
    prompt: "Clasificá cada acción según ayude o no a conservar los alimentos.",
    categories: ["Ayuda a conservarlos", "No ayuda"],
    items: shuffle([
      { label: "Guardarlos en la heladera", categoryIndex: 0 },
      { label: "Taparlos bien", categoryIndex: 0 },
      { label: "Dejarlos al sol muchas horas", categoryIndex: 1 },
      { label: "Dejarlos destapados", categoryIndex: 1 },
    ]),
    hint: "Pista: pensá qué harías para que la comida no se eche a perder.",
  });

  acts.push({
    type: "find-error",
    id: "svint-error",
    title: "Actividad 8",
    prompt: "Julieta dijo esta frase. Encontrá el error:",
    resolution: "\"El puma es un animal herbívoro porque vive en el campo.\"",
    choices: [
      "Está mal: el puma es carnívoro, caza otros animales para comer",
      "Está bien, todos los animales del campo son herbívoros",
    ],
    answerIndex: 0,
    correctAnswer: "El puma es carnívoro: se alimenta de otros animales, como guanacos y liebres.",
    hint: "Pista: pensá si el puma caza a otros animales o solo come pasto.",
  });

  acts.push({
    type: "mc",
    id: "svint-relacion",
    title: "Actividad 9",
    prompt: "¿Qué relación existe entre el guanaco y el puma en la naturaleza?",
    choices: [
      "El puma caza guanacos para alimentarse",
      "Son la misma especie",
      "El guanaco caza al puma",
      "No tienen ninguna relación",
    ],
    answerIndex: 0,
    hint: "Pista: pensá quién es el cazador y quién la presa.",
  });

  acts.push({
    type: "mc",
    id: "svint-final",
    title: "Actividad 10: desafío final",
    prompt: "Desafío: ¿cuál de estos animales es omnívoro (come plantas y animales)?",
    choices: ["El cerdo", "El guanaco", "El puma", "La vaca"],
    answerIndex: 0,
    hint: "Pista: pensá cuál de ellos come de todo un poco.",
  });

  return acts;
}

// ---------------------------------------------------------------------------
// Mundo 32: cambios de estado de los materiales y separación de mezclas
// ---------------------------------------------------------------------------

function buildMaterialesCambiosEstadoActivities(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];

  acts.push({
    type: "mc",
    id: "matcambio-congela",
    title: "Actividad 1",
    prompt: "¿En qué se convierte el agua cuando se congela?",
    choices: ["Hielo (estado sólido)", "Vapor (estado gaseoso)", "Arena", "Sal"],
    answerIndex: 0,
    hint: "Pista: pensá qué hay en el freezer.",
  });

  acts.push({
    type: "mc",
    id: "matcambio-hierve",
    title: "Actividad 2",
    prompt: "¿En qué se convierte el agua cuando hierve?",
    choices: ["Vapor (estado gaseoso)", "Hielo (estado sólido)", "Piedra", "Aceite"],
    answerIndex: 0,
    hint: "Pista: pensá en lo que sale de una pava cuando hierve el agua.",
  });

  acts.push({
    type: "classify",
    id: "matcambio-clasificar-estado",
    title: "Actividad 3",
    prompt: "Clasificá el agua según su estado.",
    categories: ["Sólido", "Líquido", "Gaseoso"],
    items: shuffle([
      { label: "Hielo", categoryIndex: 0 },
      { label: "Un témpano", categoryIndex: 0 },
      { label: "Agua de la canilla", categoryIndex: 1 },
      { label: "Vapor de la pava", categoryIndex: 2 },
    ]),
    hint: "Pista: pensá si se puede tocar y sostener, si se puede beber, o si es como una nube.",
  });

  acts.push({
    type: "match",
    id: "matcambio-match",
    title: "Actividad 4",
    prompt: "Uní cada cambio de estado con su nombre.",
    pairs: [
      { left: "De líquido a sólido", right: "Congelación" },
      { left: "De sólido a líquido", right: "Fusión (derretirse)" },
      { left: "De líquido a gaseoso", right: "Evaporación" },
    ],
    hint: "Pista: pensá en lo que le pasa al agua en el freezer, al sol y al hervir.",
  });

  acts.push({
    type: "true-false",
    id: "matcambio-vf",
    title: "Actividad 5",
    statement: "Cuando el agua se evapora, desaparece para siempre.",
    isTrue: false,
    justification: {
      prompt: "¿Por qué?",
      choices: [
        "Porque el agua se transforma en vapor, pero sigue existiendo",
        "Porque el agua se convierte en aire",
      ],
      answerIndex: 0,
    },
    hint: "Pista: pensá si el vapor de la pava es agua o es otra cosa.",
  });

  // 6: situación — se acabó la sal de mesa pero hay agua salada de mar
  // guardada, y hay que aplicar la separación por evaporación para
  // recuperar sal de verdad para cocinar, no solo describir el experimento.
  acts.push(
    buildOrderFromSequence(
      "matcambio-separar-sal",
      "Actividad 6",
      "Se te acabó la sal de mesa para cocinar, pero tenés un poco de agua salada de mar guardada. Ordená los pasos para recuperar la sal.",
      [
        "Poner el agua salada en un recipiente",
        "Dejarlo al sol o calentarlo",
        "Esperar a que el agua se evapore",
        "Juntar la sal que queda en el fondo para usar en la comida",
      ],
      "Pista: pensá qué le pasa al agua cuando se calienta y qué queda atrás."
    )
  );

  acts.push({
    type: "mc",
    id: "matcambio-transformacion",
    title: "Actividad 7",
    prompt: "¿Cuál de estos es un ejemplo de que un material se transforma en otro distinto?",
    choices: ["Quemar un papel y que se haga cenizas", "Congelar agua", "Derretir manteca", "Mezclar agua y arena"],
    answerIndex: 0,
    hint: "Pista: pensá cuál de estos cambios no se puede volver atrás.",
  });

  acts.push({
    type: "find-error",
    id: "matcambio-error",
    title: "Actividad 8",
    prompt: "Pedro dijo esta frase. Encontrá el error:",
    resolution: "\"El hielo y el vapor de agua son materiales completamente distintos, no tienen nada que ver.\"",
    choices: [
      "Está mal: los dos son agua, solo que en distinto estado",
      "Está bien, son materiales sin relación",
    ],
    answerIndex: 0,
    correctAnswer: "El hielo, el agua líquida y el vapor son el mismo material (agua) en distintos estados.",
    hint: "Pista: pensá de qué está hecho el hielo.",
  });

  acts.push({
    type: "classify",
    id: "matcambio-clasificar-separacion",
    title: "Actividad 9",
    prompt: "Clasificá cada método de separación según la mezcla a la que corresponde.",
    categories: ["Separar sólidos mezclados", "Separar un sólido disuelto"],
    items: shuffle([
      { label: "Separar arroz de porotos", categoryIndex: 0 },
      { label: "Separar piedritas de arena", categoryIndex: 0 },
      { label: "Separar la sal disuelta en agua", categoryIndex: 1 },
      { label: "Separar el azúcar disuelto en agua", categoryIndex: 1 },
    ]),
    hint: "Pista: pensá si los componentes se ven a simple vista o si hace falta evaporar el agua.",
  });

  acts.push({
    type: "mc",
    id: "matcambio-final",
    title: "Actividad 10: desafío final",
    prompt: "Desafío: ¿qué cambio de estado ocurre cuando ponemos agua líquida en el freezer?",
    choices: ["Se congela y pasa a sólido", "Se evapora", "Se transforma en otro material", "No le pasa nada"],
    answerIndex: 0,
    hint: "Pista: pensá en la temperatura del freezer.",
  });

  return acts;
}

// ---------------------------------------------------------------------------
// Mundo 33: sonido, vibración y conducción del calor
// ---------------------------------------------------------------------------

function buildSonidoVibracionActivities(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];

  acts.push({
    type: "mc",
    id: "sonido-guitarra",
    title: "Actividad 1",
    prompt: "¿Qué produce el sonido en una guitarra?",
    choices: ["La vibración de las cuerdas", "El color de la madera", "El tamaño de la guitarra", "El brillo del instrumento"],
    answerIndex: 0,
    hint: "Pista: mirá las cuerdas cuando alguien toca la guitarra.",
  });

  acts.push({
    type: "true-false",
    id: "sonido-vf",
    title: "Actividad 2",
    statement: "El sonido se produce por la vibración de un objeto.",
    isTrue: true,
    justification: {
      prompt: "¿Por qué?",
      choices: [
        "Porque al vibrar, el objeto mueve el aire y eso llega a nuestro oído",
        "Porque los objetos tienen colores distintos",
      ],
      answerIndex: 0,
    },
    hint: "Pista: pensá en un tambor cuando lo golpeás.",
  });

  // 3: situación — estás en un salón con mucho eco y no se entiende lo que
  // dicen, y hay que elegir qué materiales poner en las paredes para
  // mejorarlo, en vez de solo clasificar materiales sueltos.
  acts.push({
    type: "classify",
    id: "sonido-clasificar-material",
    title: "Actividad 3",
    prompt:
      "Estás en un salón con mucho eco y cuesta entender lo que dicen. Clasificá qué materiales conviene poner en las paredes para mejorarlo.",
    categories: ["Ayuda a evitar el eco", "Empeora el eco"],
    items: shuffle([
      { label: "Cortinas de tela gruesa", categoryIndex: 0 },
      { label: "Paneles de espuma", categoryIndex: 0 },
      { label: "Paredes de vidrio", categoryIndex: 1 },
      { label: "Azulejos de cerámica", categoryIndex: 1 },
    ]),
    hint: "Pista: pensá en los materiales blandos, que absorben el sonido en vez de hacerlo rebotar.",
  });

  acts.push({
    type: "match",
    id: "sonido-match",
    title: "Actividad 4",
    prompt: "Uní cada objeto con la forma en que produce sonido.",
    pairs: [
      { left: "Un tambor", right: "Vibra al golpearlo" },
      { left: "Una guitarra", right: "Vibra al tocar las cuerdas" },
      { left: "Una campana", right: "Vibra al golpearla" },
    ],
    hint: "Pista: pensá qué se mueve rápidamente en cada instrumento.",
  });

  acts.push({
    type: "mc",
    id: "sonido-conduccion",
    title: "Actividad 5",
    prompt: "¿Cuál de estos materiales conduce mejor el calor?",
    choices: ["El metal", "La madera", "La lana", "El corcho"],
    answerIndex: 0,
    hint: "Pista: pensá en una cuchara de metal en agua caliente.",
  });

  acts.push(
    buildOrderFromSequence(
      "sonido-experimento",
      "Actividad 6",
      "Ordená los pasos de este experimento con sonido.",
      [
        "Estirar un elástico entre dos dedos",
        "Hacerlo vibrar con el otro dedo",
        "Escuchar el sonido que produce",
        "Anotar qué pasa si lo estirás más o menos",
      ],
      "Pista: pensá en el orden lógico de este experimento simple."
    )
  );

  acts.push({
    type: "find-error",
    id: "sonido-error",
    title: "Actividad 7",
    prompt: "Lucía dijo esta frase. Encontrá el error:",
    resolution: "\"El sonido puede viajar igual de bien en cualquier material.\"",
    choices: [
      "Está mal: el sonido viaja distinto según el material",
      "Está bien, viaja igual en todos",
    ],
    answerIndex: 0,
    correctAnswer: "El sonido se propaga distinto según el material: se escucha más fuerte a través de un metal que de una tela gruesa.",
    hint: "Pista: pensá si escuchás mejor a través de una pared o de una cortina.",
  });

  acts.push({
    type: "classify",
    id: "sonido-clasificar-intensidad",
    title: "Actividad 8",
    prompt: "Clasificá cada situación según produzca sonido fuerte o suave.",
    categories: ["Sonido fuerte", "Sonido suave"],
    items: shuffle([
      { label: "Golpear un tambor con fuerza", categoryIndex: 0 },
      { label: "Un grito", categoryIndex: 0 },
      { label: "Un susurro", categoryIndex: 1 },
      { label: "Tocar una cuerda apenas", categoryIndex: 1 },
    ]),
    hint: "Pista: pensá cuánta fuerza se usa en cada caso.",
  });

  acts.push({
    type: "mc",
    id: "sonido-elastico",
    title: "Actividad 9",
    prompt: "¿Qué pasa con un elástico estirado cuando lo soltamos?",
    choices: ["Vibra y produce sonido", "Se rompe siempre", "No pasa nada", "Se congela"],
    answerIndex: 0,
    hint: "Pista: pensá en lo que se mueve rápido cuando lo soltás.",
  });

  acts.push({
    type: "mc",
    id: "sonido-final",
    title: "Actividad 10: desafío final",
    prompt: "Desafío: si tapás tus oídos con las manos, ¿qué le pasa al sonido que escuchás?",
    choices: ["Se escucha más bajo, porque se tapa el paso del sonido", "Se escucha más fuerte", "Desaparece por completo", "Se transforma en luz"],
    answerIndex: 0,
    hint: "Pista: probalo vos mismo y pensá qué notás.",
  });

  return acts;
}

// ---------------------------------------------------------------------------
// Mundo 34: cielo y fenómenos atmosféricos, movimientos del Sol y la Luna
// ---------------------------------------------------------------------------

function buildCieloFenomenosAtmosfericosActivities(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];

  acts.push({
    type: "mc",
    id: "cielo-sol",
    title: "Actividad 1",
    prompt: "¿Qué astro vemos de día que nos da luz y calor?",
    choices: ["El Sol", "La Luna", "Una estrella lejana", "Un cometa"],
    answerIndex: 0,
    hint: "Pista: no lo podés mirar directamente porque encandila.",
  });

  acts.push({
    type: "mc",
    id: "cielo-luna",
    title: "Actividad 2",
    prompt: "¿Qué astro vemos generalmente de noche y cambia de forma durante el mes?",
    choices: ["La Luna", "El Sol", "Las nubes", "El viento"],
    answerIndex: 0,
    hint: "Pista: a veces se ve como un círculo entero, a veces como una medialuna.",
  });

  acts.push({
    type: "classify",
    id: "cielo-clasificar-cambio",
    title: "Actividad 3",
    prompt: "Clasificá cada fenómeno según cambie el paisaje rápido o lento.",
    categories: ["Cambio rápido", "Cambio lento"],
    items: shuffle([
      { label: "Una tormenta de viento", categoryIndex: 0 },
      { label: "La lluvia de una tarde", categoryIndex: 0 },
      { label: "El desgaste de una piedra con los años", categoryIndex: 1 },
      { label: "La formación de una duna", categoryIndex: 1 },
    ]),
    hint: "Pista: pensá si el cambio se nota en un día o si hacen falta años.",
  });

  acts.push({
    type: "true-false",
    id: "cielo-vf",
    title: "Actividad 4",
    statement: "El Sol se mueve alrededor de la Tierra todos los días.",
    isTrue: false,
    justification: {
      prompt: "¿Por qué?",
      choices: [
        "Porque en realidad es la Tierra la que gira, pero desde acá parece que el Sol se mueve",
        "Porque el Sol está siempre quieto en el mismo lugar del cielo",
      ],
      answerIndex: 0,
    },
    hint: "Pista: pensá en lo que aprendiste sobre el movimiento de la Tierra.",
  });

  acts.push({
    type: "match",
    id: "cielo-match",
    title: "Actividad 5",
    prompt: "Uní cada momento del día con la posición del Sol.",
    pairs: [
      { left: "Amanecer", right: "El Sol aparece por el Este" },
      { left: "Mediodía", right: "El Sol está más alto en el cielo" },
      { left: "Atardecer", right: "El Sol se esconde por el Oeste" },
    ],
    hint: "Pista: pensá en cómo cambia la posición del Sol a lo largo del día.",
  });

  acts.push(
    buildOrderFromSequence(
      "cielo-observar",
      "Actividad 6",
      "Ordená los pasos para observar el cielo durante el día.",
      [
        "A la mañana, anotar dónde aparece el Sol",
        "Al mediodía, observar qué tan alto está",
        "A la tarde, anotar por dónde se esconde",
        "Comparar las tres observaciones",
      ],
      "Pista: seguí el orden de las horas del día."
    )
  );

  acts.push({
    type: "mc",
    id: "cielo-fenomeno",
    title: "Actividad 7",
    prompt: "¿Cuál de estos es un fenómeno atmosférico?",
    choices: ["El viento", "Una montaña", "Un río", "Una piedra"],
    answerIndex: 0,
    hint: "Pista: pensá en algo relacionado con el clima, no con el paisaje fijo.",
  });

  // 8: situación — querés sacarle una foto a la Luna llena esta semana y
  // hay que reconocer cuándo se va a ver así, aplicando el cambio de fases
  // a una decisión real en vez de solo corregir una afirmación general.
  acts.push({
    type: "find-error",
    id: "cielo-error",
    title: "Actividad 8",
    prompt:
      "Querés sacarle una foto a la Luna llena esta semana y Bruno te dice esta frase. Encontrá el error:",
    resolution:
      "\"La Luna se ve igual todas las noches, así que la podés fotografiar cualquier día.\"",
    choices: [
      "Está mal: la Luna cambia de forma (fases), hay que esperar a que se vea como un círculo completo",
      "Está bien, se ve igual siempre",
    ],
    answerIndex: 0,
    correctAnswer:
      "Hay que fijarse cuando la Luna se ve como un círculo completo y bien iluminado: eso pasa solo unos días del mes (luna llena).",
    hint: "Pista: pensá si alguna vez viste la Luna con forma de medialuna.",
  });

  acts.push({
    type: "classify",
    id: "cielo-clasificar-dianoche",
    title: "Actividad 9",
    prompt: "Clasificá según se vea de día o de noche generalmente.",
    categories: ["Se ve de día", "Se ve de noche"],
    items: shuffle([
      { label: "El Sol", categoryIndex: 0 },
      { label: "Nubes iluminadas", categoryIndex: 0 },
      { label: "La Luna", categoryIndex: 1 },
      { label: "Las estrellas", categoryIndex: 1 },
    ]),
    hint: "Pista: pensá cuándo mirás el cielo y ves cada uno.",
  });

  acts.push({
    type: "mc",
    id: "cielo-final",
    title: "Actividad 10: desafío final",
    prompt: "Desafío: si una tormenta de viento levanta mucha tierra en la estepa, ¿qué le puede pasar al paisaje con el tiempo?",
    choices: ["Puede cambiar de forma poco a poco", "Se queda exactamente igual para siempre", "Desaparece de inmediato", "Se convierte en agua"],
    answerIndex: 0,
    hint: "Pista: pensá en la erosión que producen el viento y el agua con los años.",
  });

  return acts;
}

// ---------------------------------------------------------------------------
// Mundo 35: comparación de la diversidad de seres vivos y el cuerpo humano
// ---------------------------------------------------------------------------

function buildSeresVivosComparacionActivities(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];

  acts.push({
    type: "mc",
    id: "svcomp-jaguar",
    title: "Actividad 1",
    prompt: "¿Cuál de estos animales es típico de la selva y no de la Patagonia?",
    choices: ["El jaguar", "El guanaco", "El ñandú", "El zorro colorado"],
    answerIndex: 0,
    hint: "Pista: pensá en un animal de clima cálido y húmedo.",
  });

  acts.push({
    type: "classify",
    id: "svcomp-clasificar-region",
    title: "Actividad 2",
    prompt: "Clasificá cada animal según la región donde vive principalmente.",
    categories: ["Patagonia", "Selva o zonas cálidas"],
    items: shuffle([
      { label: "Guanaco", categoryIndex: 0 },
      { label: "Cóndor", categoryIndex: 0 },
      { label: "Mono", categoryIndex: 1 },
      { label: "Jaguar", categoryIndex: 1 },
    ]),
    hint: "Pista: pensá en el clima frío y seco de la Patagonia frente al calor húmedo de la selva.",
  });

  acts.push({
    type: "mc",
    id: "svcomp-comun",
    title: "Actividad 3",
    prompt: "¿Qué tienen en común todos los seres vivos, sin importar dónde vivan?",
    choices: ["Nacen, crecen, se reproducen y mueren", "Tienen el mismo color", "Viven en el mismo lugar", "Comen exactamente lo mismo"],
    answerIndex: 0,
    hint: "Pista: pensá en el ciclo de vida que comparten todos.",
  });

  acts.push({
    type: "match",
    id: "svcomp-match",
    title: "Actividad 4",
    prompt: "Uní cada grupo de seres vivos con una semejanza que comparten.",
    pairs: [
      { left: "Las personas", right: "También necesitan respirar y alimentarse" },
      { left: "Las plantas", right: "También nacen, crecen y se reproducen" },
      { left: "Los animales", right: "También necesitan cuidado y protección" },
    ],
    hint: "Pista: pensá en necesidades básicas que comparten todos los seres vivos.",
  });

  acts.push({
    type: "true-false",
    id: "svcomp-vf",
    title: "Actividad 5",
    statement: "Todas las personas tienen los mismos órganos principales por dentro.",
    isTrue: true,
    justification: {
      prompt: "¿Por qué?",
      choices: [
        "Porque todas las personas tenemos corazón, pulmones, estómago y cerebro",
        "Porque todas las personas somos exactamente iguales por fuera",
      ],
      answerIndex: 0,
    },
    hint: "Pista: pensá en lo que tenemos en común por dentro, más allá de cómo nos veamos por fuera.",
  });

  acts.push(
    buildOrderFromSequence(
      "svcomp-comparar",
      "Actividad 6",
      "Ordená los pasos para comparar dos ambientes distintos.",
      [
        "Elegir dos ambientes, por ejemplo la estepa y la selva",
        "Observar qué animales y plantas hay en cada uno",
        "Anotar las diferencias de clima",
        "Sacar conclusiones sobre por qué viven ahí",
      ],
      "Pista: pensá en el orden de cualquier investigación comparativa."
    )
  );

  // 7: situación — un amigo quiere traer un mono de mascota a Santa Cruz y
  // hay que explicarle por qué no sobreviviría, aplicando la adaptación al
  // ambiente a un caso concreto en vez de corregir una frase abstracta.
  acts.push({
    type: "find-error",
    id: "svcomp-error",
    title: "Actividad 7",
    prompt:
      "Tu amigo Fede quiere traer un mono de mascota a Santa Cruz y te dice esta frase. Encontrá el error para explicarle por qué no sobreviviría:",
    resolution:
      "\"Un mono de la selva podría vivir perfectamente en Santa Cruz sin ningún problema.\"",
    choices: [
      "Está mal: el mono está adaptado al calor y la humedad de la selva, no al frío de la Patagonia",
      "Está bien, cualquier animal puede vivir en cualquier clima",
    ],
    answerIndex: 0,
    correctAnswer:
      "El mono está adaptado al clima cálido y húmedo de la selva; en el frío y seco de Santa Cruz no sobreviviría.",
    hint: "Pista: pensá si un mono tiene el pelaje y las costumbres para aguantar el frío patagónico.",
  });

  acts.push({
    type: "classify",
    id: "svcomp-clasificar-funcion",
    title: "Actividad 8",
    prompt: "Clasificá cada parte del cuerpo humano según su función.",
    categories: ["Sirve para moverse", "Sirve para pensar o sentir"],
    items: shuffle([
      { label: "Las piernas", categoryIndex: 0 },
      { label: "Los brazos", categoryIndex: 0 },
      { label: "El cerebro", categoryIndex: 1 },
      { label: "Los sentidos (ver, oír)", categoryIndex: 1 },
    ]),
    hint: "Pista: pensá si esa parte te ayuda a desplazarte o a percibir el mundo.",
  });

  acts.push({
    type: "mc",
    id: "svcomp-cuidar",
    title: "Actividad 9",
    prompt: "¿Por qué es importante cuidar y respetar a todos los seres vivos, no solo a los de nuestra zona?",
    choices: [
      "Porque todos forman parte de la naturaleza y merecen cuidado",
      "Porque solo importan los animales de la Patagonia",
      "Porque los animales de otras zonas no son importantes",
      "No es importante cuidarlos",
    ],
    answerIndex: 0,
    hint: "Pista: pensá en el valor de la naturaleza en su conjunto.",
  });

  acts.push({
    type: "mc",
    id: "svcomp-final",
    title: "Actividad 10: desafío final",
    prompt: "Desafío: ¿cuál de estas es una semejanza entre el ser humano y el guanaco?",
    choices: ["Los dos son seres vivos que necesitan respirar y alimentarse", "Los dos tienen plumas", "Los dos viven bajo el agua", "Los dos son plantas"],
    answerIndex: 0,
    hint: "Pista: pensá en las necesidades básicas de cualquier ser vivo.",
  });

  return acts;
}

// ---------------------------------------------------------------------------
// Mundo 36: transformaciones de materiales e informes de investigación
// ---------------------------------------------------------------------------

function buildMaterialesInformesActivities(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];

  acts.push({
    type: "mc",
    id: "matinforme-quemar",
    title: "Actividad 1",
    prompt: "¿Qué le pasa al papel cuando se quema?",
    choices: ["Se transforma en cenizas, un material distinto", "Se congela", "Se convierte en agua", "No le pasa nada"],
    answerIndex: 0,
    hint: "Pista: pensá si después se puede volver a tener el papel original.",
  });

  acts.push({
    type: "mc",
    id: "matinforme-registro",
    title: "Actividad 2",
    prompt: "¿Qué parte de un informe de investigación cuenta lo que observamos?",
    choices: ["El registro de observaciones", "El título nada más", "La tapa del cuaderno", "El nombre del alumno"],
    answerIndex: 0,
    hint: "Pista: pensá en la parte donde se anota lo que vimos durante el experimento.",
  });

  acts.push(
    buildOrderFromSequence(
      "matinforme-pasos",
      "Actividad 3",
      "Ordená los pasos para hacer un informe sencillo de investigación.",
      [
        "Anotar qué queremos investigar",
        "Anotar qué pensamos que va a pasar",
        "Hacer la experiencia y observar",
        "Escribir la conclusión con lo que aprendimos",
      ],
      "Pista: pensá en el orden de cualquier investigación científica escolar."
    )
  );

  // 4: situación — horneaste un bizcochuelo y te arrepentís, y hay que
  // decidir si se puede volver a tener la harina, el huevo y el azúcar por
  // separado, aplicando reversible/no reversible a un caso real de cocina.
  acts.push({
    type: "classify",
    id: "matinforme-clasificar-reversible",
    title: "Actividad 4",
    prompt:
      "Horneaste un bizcochuelo pero te arrepentís y querés recuperar la harina, el huevo y el azúcar por separado. Clasificá si estos cambios se pueden deshacer o no.",
    categories: ["Reversible", "No reversible"],
    items: shuffle([
      { label: "Volver a enfriar la manteca derretida", categoryIndex: 0 },
      { label: "Descongelar hielo y volver a congelarlo", categoryIndex: 0 },
      { label: "Hornear el bizcochuelo", categoryIndex: 1 },
      { label: "Tostar el pan hasta quemarlo", categoryIndex: 1 },
    ]),
    hint: "Pista: pensá si después de hornear se puede separar la harina, el huevo y el azúcar como estaban antes.",
  });

  acts.push({
    type: "match",
    id: "matinforme-match",
    title: "Actividad 5",
    prompt: "Uní cada instrumento con para qué se usa en una investigación.",
    pairs: [
      { left: "El cuaderno de registro", right: "Anotar lo que observamos" },
      { left: "La lupa", right: "Ver los detalles más de cerca" },
      { left: "El termómetro", right: "Medir la temperatura" },
    ],
    hint: "Pista: pensá para qué usarías cada uno en un experimento.",
  });

  acts.push({
    type: "true-false",
    id: "matinforme-vf",
    title: "Actividad 6",
    statement: "Si un resultado no era el esperado, significa que hicimos todo mal.",
    isTrue: false,
    justification: {
      prompt: "¿Por qué?",
      choices: [
        "Porque el error también nos ayuda a aprender y a corregir nuestras ideas",
        "Porque siempre hay que obtener el resultado que uno imaginó",
      ],
      answerIndex: 0,
    },
    hint: "Pista: pensá en cómo aprenden los científicos de sus experimentos.",
  });

  acts.push({
    type: "find-error",
    id: "matinforme-error",
    title: "Actividad 7",
    prompt: "Nico dijo esta frase. Encontrá el error:",
    resolution: "\"No hace falta anotar nada durante un experimento, alcanza con recordarlo de memoria.\"",
    choices: [
      "Está mal: registrar los datos ayuda a no olvidarlos y a compartirlos con otros",
      "Está bien, no hace falta anotar nada",
    ],
    answerIndex: 0,
    correctAnswer: "Registrar las observaciones por escrito permite recordarlas bien y comunicarlas a los demás.",
    hint: "Pista: pensá si te acordarías de todos los detalles varios días después.",
  });

  acts.push({
    type: "mc",
    id: "matinforme-transformacion",
    title: "Actividad 8",
    prompt: "¿Cuál de estos es un ejemplo de transformación de un material en otro distinto?",
    choices: ["Cocinar un huevo", "Romper un papel en pedacitos", "Estirar una goma", "Mover una silla"],
    answerIndex: 0,
    hint: "Pista: pensá cuál de estos cambios no se puede deshacer.",
  });

  acts.push({
    type: "classify",
    id: "matinforme-clasificar-etapa",
    title: "Actividad 9",
    prompt: "Clasificá cada acción según corresponda a anticipar, observar o concluir.",
    categories: ["Anticipar", "Observar", "Concluir"],
    items: shuffle([
      { label: "Pensar qué va a pasar antes del experimento", categoryIndex: 0 },
      { label: "Mirar con atención mientras ocurre", categoryIndex: 1 },
      { label: "Escribir lo que aprendimos al final", categoryIndex: 2 },
    ]),
    hint: "Pista: pensá si es algo que se hace antes, durante o después del experimento.",
  });

  acts.push({
    type: "mc",
    id: "matinforme-final",
    title: "Actividad 10: desafío final",
    prompt: "Desafío: si mezclamos harina, agua y calor para hacer pan, ¿qué tipo de cambio ocurrió?",
    choices: ["Una transformación: se formó un material nuevo", "No cambió nada", "Un cambio de estado nada más", "Una mezcla que se puede separar fácilmente"],
    answerIndex: 0,
    hint: "Pista: pensá si se puede volver a separar la harina, el agua y obtener lo de antes.",
  });

  return acts;
}

// ---------------------------------------------------------------------------
// Mundo 37: integración de fenómenos de luz, sonido y calor
// ---------------------------------------------------------------------------

function buildFenomenosFisicosIntegracionActivities(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];

  acts.push({
    type: "mc",
    id: "fenint-luz",
    title: "Actividad 1",
    prompt: "¿Cuál de estos es un ejemplo de fuente de luz?",
    choices: ["El Sol", "Una piedra", "Un vaso de agua", "Una silla"],
    answerIndex: 0,
    hint: "Pista: pensá en algo que emite luz propia.",
  });

  acts.push({
    type: "classify",
    id: "fenint-clasificar-transparencia",
    title: "Actividad 2",
    prompt: "Clasificá cada objeto según deje pasar la luz o no.",
    categories: ["Deja pasar la luz", "No deja pasar la luz"],
    items: shuffle([
      { label: "Un vidrio", categoryIndex: 0 },
      { label: "El agua limpia", categoryIndex: 0 },
      { label: "Una pared", categoryIndex: 1 },
      { label: "Una piedra", categoryIndex: 1 },
    ]),
    hint: "Pista: pensá si podés ver a través de cada uno.",
  });

  acts.push({
    type: "mc",
    id: "fenint-sombra",
    title: "Actividad 3",
    prompt: "¿Qué se forma cuando un objeto opaco bloquea la luz del Sol?",
    choices: ["Una sombra", "Un arcoíris", "Un eco", "Un imán"],
    answerIndex: 0,
    hint: "Pista: pensá en lo que ves debajo de un árbol en un día soleado.",
  });

  acts.push({
    type: "true-false",
    id: "fenint-vf",
    title: "Actividad 4",
    statement: "El sonido, la luz y el calor se comportan siempre exactamente igual frente a cualquier material.",
    isTrue: false,
    justification: {
      prompt: "¿Por qué?",
      choices: [
        "Porque cada material deja pasar o no el sonido, la luz y el calor de forma distinta",
        "Porque todos los materiales son transparentes al sonido, la luz y el calor",
      ],
      answerIndex: 0,
    },
    hint: "Pista: pensá en un vidrio (deja pasar la luz) comparado con una pared (no la deja pasar).",
  });

  acts.push({
    type: "match",
    id: "fenint-match",
    title: "Actividad 5",
    prompt: "Uní cada fenómeno con un ejemplo cotidiano.",
    pairs: [
      { left: "Luz", right: "La sombra que se forma bajo un árbol" },
      { left: "Sonido", right: "El eco en una habitación vacía" },
      { left: "Calor", right: "Una taza que se enfría con el tiempo" },
    ],
    hint: "Pista: pensá en situaciones de todos los días relacionadas con cada fenómeno.",
  });

  acts.push(
    buildOrderFromSequence(
      "fenint-experimento",
      "Actividad 6",
      "Ordená los pasos de este experimento con luz y sombra.",
      [
        "Poner un objeto frente a una linterna encendida",
        "Observar la sombra que se forma en la pared",
        "Acercar y alejar el objeto de la luz",
        "Anotar cómo cambia el tamaño de la sombra",
      ],
      "Pista: pensá en el orden lógico de este experimento."
    )
  );

  acts.push({
    type: "classify",
    id: "fenint-clasificar-mecanica",
    title: "Actividad 7",
    prompt: "Clasificá cada acción mecánica según el cambio que provoca.",
    categories: ["Cambia la forma del objeto", "Cambia el movimiento del objeto"],
    items: shuffle([
      { label: "Aplastar una pelota de plastilina", categoryIndex: 0 },
      { label: "Estirar una masa", categoryIndex: 0 },
      { label: "Empujar un carrito", categoryIndex: 1 },
      { label: "Frenar una bicicleta", categoryIndex: 1 },
    ]),
    hint: "Pista: pensá si el objeto se deforma o si cambia de posición o velocidad.",
  });

  // 8: situación — querés hacer sombras chinescas más grandes en la pared
  // y hay que decidir si acercar o alejar la linterna, aplicando cómo
  // cambia el tamaño de la sombra en vez de solo corregir una frase.
  acts.push({
    type: "find-error",
    id: "fenint-error",
    title: "Actividad 8",
    prompt:
      "Valentina está haciendo sombras chinescas con una linterna y quiere que se vean más grandes en la pared. Dice esta frase. Encontrá el error:",
    resolution:
      "\"Para que la sombra se vea más grande, tengo que alejar la linterna del objeto.\"",
    choices: [
      "Está mal: hay que acercar la linterna al objeto para que la sombra se vea más grande",
      "Está bien, alejando la linterna la sombra crece",
    ],
    answerIndex: 0,
    correctAnswer:
      "Cuanto más cerca está la luz del objeto, más grande se ve la sombra en la pared.",
    hint: "Pista: acercá y alejá una linterna de tu mano y fijate qué pasa con la sombra.",
  });

  acts.push({
    type: "mc",
    id: "fenint-conduccion",
    title: "Actividad 9",
    prompt: "¿Cuál de estos materiales conduce mejor el sonido y el calor: el metal o la lana?",
    choices: ["El metal", "La lana", "Los dos igual", "Ninguno de los dos"],
    answerIndex: 0,
    hint: "Pista: pensá en lo que aprendiste sobre el metal en otros mundos.",
  });

  acts.push({
    type: "mc",
    id: "fenint-final",
    title: "Actividad 10: desafío final",
    prompt: "Desafío: si aplaudís fuerte cerca de una pared de piedra, ¿qué fenómeno podés escuchar?",
    choices: ["El eco, porque el sonido rebota", "La sombra del aplauso", "El calor del aplauso", "Nada, no pasa nada"],
    answerIndex: 0,
    hint: "Pista: pensá en lo que pasa cuando gritás dentro de una habitación vacía.",
  });

  return acts;
}

// ---------------------------------------------------------------------------
// Mundo 38: ciclos del cielo, tiempo atmosférico y puntos cardinales
// ---------------------------------------------------------------------------

function buildTiempoOrientacionActivities(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];

  acts.push({
    type: "mc",
    id: "tiempo-ciclo-diario",
    title: "Actividad 1",
    prompt: "¿Cuál de estos es un ciclo que se repite todos los días?",
    choices: ["El día y la noche", "Un cumpleaños", "Las vacaciones de verano", "Un feriado"],
    answerIndex: 0,
    hint: "Pista: pensá en algo que pasa siempre, cada 24 horas.",
  });

  acts.push({
    type: "classify",
    id: "tiempo-clasificar-ciclo",
    title: "Actividad 2",
    prompt: "Clasificá cada fenómeno según su ciclo.",
    categories: ["Ciclo diario", "Ciclo anual"],
    items: shuffle([
      { label: "El amanecer y el atardecer", categoryIndex: 0 },
      { label: "Salir el Sol", categoryIndex: 0 },
      { label: "Las cuatro estaciones", categoryIndex: 1 },
      { label: "El verano y el invierno", categoryIndex: 1 },
    ]),
    hint: "Pista: pensá si el ciclo dura un día o un año completo.",
  });

  acts.push({
    type: "mc",
    id: "tiempo-pronostico",
    title: "Actividad 3",
    prompt: "¿Qué usamos para saber si va a hacer calor, frío o si va a llover?",
    choices: ["El pronóstico del tiempo", "Una regla", "Un mapa de países", "Una calculadora"],
    answerIndex: 0,
    hint: "Pista: lo suelen mostrar en las noticias.",
  });

  acts.push({
    type: "true-false",
    id: "tiempo-vf",
    title: "Actividad 4",
    statement: "El tiempo atmosférico es siempre igual todos los días del año.",
    isTrue: false,
    justification: {
      prompt: "¿Por qué?",
      choices: [
        "Porque el tiempo atmosférico cambia según la estación y el día",
        "Porque siempre hace la misma temperatura",
      ],
      answerIndex: 0,
    },
    hint: "Pista: pensá si hace la misma temperatura en verano y en invierno.",
  });

  acts.push({
    type: "match",
    id: "tiempo-match",
    title: "Actividad 5",
    prompt: "Uní cada punto cardinal con una pista para encontrarlo.",
    pairs: [
      { left: "Este", right: "Por ahí sale el Sol a la mañana" },
      { left: "Oeste", right: "Por ahí se esconde el Sol a la tarde" },
      { left: "Norte", right: "Suele dibujarse arriba en los mapas" },
      { left: "Sur", right: "Suele dibujarse abajo en los mapas" },
    ],
    hint: "Pista: pensá en los mapas y en el recorrido del Sol durante el día.",
  });

  // 6: situación — te olvidaste la brújula en un campamento y hay que
  // armar una con un palito y el Sol, aplicando el movimiento de la
  // sombra a un problema real en vez de solo ordenar un procedimiento.
  acts.push(
    buildOrderFromSequence(
      "tiempo-brujula",
      "Actividad 6",
      "Te fuiste de campamento y te olvidaste la brújula. Ordená los pasos para armar una con un palito y la sombra del Sol.",
      [
        "Clavar un palito derecho en la tierra a la mañana",
        "Marcar dónde cae la punta de la sombra",
        "Esperar unas horas y marcar la nueva posición de la sombra",
        "Unir las dos marcas: esa línea indica el Este y el Oeste",
      ],
      "Pista: pensá en cómo se mueve la sombra a lo largo del día."
    )
  );

  acts.push({
    type: "classify",
    id: "tiempo-clasificar-clima",
    title: "Actividad 7",
    prompt: "Clasificá cada situación según corresponda a un día soleado o a un día de tormenta.",
    categories: ["Día soleado", "Día de tormenta"],
    items: shuffle([
      { label: "Cielo despejado y calor", categoryIndex: 0 },
      { label: "Buena sombra bajo los árboles", categoryIndex: 0 },
      { label: "Viento fuerte y nubes oscuras", categoryIndex: 1 },
      { label: "Lluvia y truenos", categoryIndex: 1 },
    ]),
    hint: "Pista: pensá cómo está el cielo en cada situación.",
  });

  acts.push({
    type: "find-error",
    id: "tiempo-error",
    title: "Actividad 8",
    prompt: "Iván dijo esta frase. Encontrá el error:",
    resolution: "\"Los puntos cardinales cambian de lugar según el país en el que estemos.\"",
    choices: [
      "Está mal: el Norte, Sur, Este y Oeste son siempre los mismos en cualquier lugar del mundo",
      "Está bien, cambian según el país",
    ],
    answerIndex: 0,
    correctAnswer: "Los puntos cardinales son siempre los mismos: el Sol sale por el Este y se esconde por el Oeste en cualquier lugar del mundo.",
    hint: "Pista: pensá si el Sol sale por un lado distinto según el país.",
  });

  acts.push({
    type: "mc",
    id: "tiempo-anual",
    title: "Actividad 9",
    prompt: "¿Cuál de estos ciclos dura aproximadamente un año completo?",
    choices: ["El paso de las cuatro estaciones", "El día y la noche", "Una semana", "Una hora"],
    answerIndex: 0,
    hint: "Pista: pensá en primavera, verano, otoño e invierno.",
  });

  acts.push({
    type: "mc",
    id: "tiempo-final",
    title: "Actividad 10: desafío final",
    prompt: "Desafío: si el Sol se está escondiendo frente a vos, ¿hacia qué punto cardinal estás mirando?",
    choices: ["Hacia el Oeste", "Hacia el Este", "Hacia el Norte", "Hacia el Sur"],
    answerIndex: 0,
    hint: "Pista: pensá por dónde se esconde el Sol al atardecer.",
  });

  return acts;
}

// ---------------------------------------------------------------------------
// Mundo 39: paisajes urbanos y rurales, elementos naturales/sociales, croquis
// ---------------------------------------------------------------------------

function buildPaisajesUrbanoRuralActivities(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];

  acts.push({
    type: "mc",
    id: "pur-rural",
    title: "Actividad 1",
    prompt: "¿Cuál de estos es un paisaje rural?",
    choices: [
      "Un campo con animales y pocas casas",
      "Un centro con muchos edificios y semáforos",
      "Una estación de subte",
      "Un shopping",
    ],
    answerIndex: 0,
    hint: "Pista: pensá en el campo, lejos de la ciudad.",
  });

  acts.push({
    type: "mc",
    id: "pur-urbano",
    title: "Actividad 2",
    prompt: "¿Cuál de estos es un paisaje urbano?",
    choices: ["Una ciudad con edificios y muchas calles", "Un campo con ovejas", "Una estancia patagónica", "Un bosque sin casas"],
    answerIndex: 0,
    hint: "Pista: pensá en un lugar con muchos edificios y calles.",
  });

  acts.push({
    type: "classify",
    id: "pur-clasificar-natural",
    title: "Actividad 3",
    prompt: "Clasificá cada elemento según sea natural o construido por la sociedad.",
    categories: ["Elemento natural", "Elemento construido"],
    items: shuffle([
      { label: "Un río", categoryIndex: 0 },
      { label: "Una montaña", categoryIndex: 0 },
      { label: "Un puente", categoryIndex: 1 },
      { label: "Una plaza con juegos", categoryIndex: 1 },
    ]),
    hint: "Pista: pensá si lo hizo la naturaleza o las personas.",
  });

  acts.push({
    type: "classify",
    id: "pur-clasificar-trabajo",
    title: "Actividad 4",
    prompt: "Clasificá cada trabajo según sea típico del campo o de la ciudad.",
    categories: ["Típico del campo", "Típico de la ciudad"],
    items: shuffle([
      { label: "Criar ovejas", categoryIndex: 0 },
      { label: "Trabajar en una estancia", categoryIndex: 0 },
      { label: "Trabajar en una oficina", categoryIndex: 1 },
      { label: "Manejar un colectivo urbano", categoryIndex: 1 },
    ]),
    hint: "Pista: pensá dónde se hace cada trabajo normalmente.",
  });

  // 5: situación — estás dibujando el croquis de tu propio barrio para
  // mostrárselo a un compañero, y tenés que elegir qué símbolo usar para
  // cada elemento, incluida la plaza con árboles.
  acts.push({
    type: "match",
    id: "pur-croquis",
    title: "Actividad 5",
    prompt: "Estás dibujando el croquis de tu barrio para mostrárselo a un compañero. Uní cada símbolo con lo que representa.",
    pairs: [
      { left: "Una línea", right: "Una calle de tu barrio" },
      { left: "Un cuadrado", right: "Tu casa u otro edificio" },
      { left: "Un árbol dibujado", right: "La plaza con árboles" },
    ],
    hint: "Pista: pensá en los símbolos sencillos que usarías para representar tu barrio.",
  });

  acts.push({
    type: "true-false",
    id: "pur-vf",
    title: "Actividad 6",
    statement: "En un paisaje rural siempre hay más casas juntas que en uno urbano.",
    isTrue: false,
    justification: {
      prompt: "¿Por qué?",
      choices: [
        "Porque en la ciudad las casas están más juntas y en el campo más separadas",
        "Porque en el campo las casas siempre están pegadas",
      ],
      answerIndex: 0,
    },
    hint: "Pista: pensá en la distancia entre las casas de una estancia y las de un barrio.",
  });

  acts.push(
    buildOrderFromSequence(
      "pur-croquis-pasos",
      "Actividad 7",
      "Ordená los pasos para representar un espacio en un croquis.",
      [
        "Observar el lugar que querés dibujar",
        "Elegir símbolos sencillos para cada elemento",
        "Dibujar el croquis con esos símbolos",
        "Agregar una referencia que explique cada símbolo",
      ],
      "Pista: pensá en el orden lógico para armar un croquis."
    )
  );

  acts.push({
    type: "find-error",
    id: "pur-error",
    title: "Actividad 8",
    prompt: "Bautista dijo esta frase. Encontrá el error:",
    resolution: "\"En la ciudad no existen elementos naturales, todo es construido por las personas.\"",
    choices: [
      "Está mal: en la ciudad también hay elementos naturales, como plazas con árboles o ríos",
      "Está bien, en la ciudad todo es construido",
    ],
    answerIndex: 0,
    correctAnswer: "En la ciudad también hay elementos naturales, como árboles, plazas o ríos, junto a los construidos.",
    hint: "Pista: pensá en los árboles y plazas de una ciudad.",
  });

  acts.push({
    type: "mc",
    id: "pur-condiciones",
    title: "Actividad 9",
    prompt: "¿Qué condición de vida es más común en una zona rural alejada?",
    choices: ["Menos servicios cercanos, como hospitales grandes", "Muchos semáforos", "Muchos edificios altos", "Subtes y trenes"],
    answerIndex: 0,
    hint: "Pista: pensá en lo que es difícil de encontrar lejos de una ciudad grande.",
  });

  acts.push({
    type: "mc",
    id: "pur-final",
    title: "Actividad 10: desafío final",
    prompt: "Desafío: ¿cuál de estos elementos podríamos encontrar tanto en un paisaje urbano como en uno rural?",
    choices: ["El cielo y el sol", "Un rascacielos", "Una estancia con ovejas", "Un subte"],
    answerIndex: 0,
    hint: "Pista: pensá en algo que está en todos lados, no solo en un tipo de paisaje.",
  });

  return acts;
}

// ---------------------------------------------------------------------------
// Mundo 40: grupos sociales coloniales y su vida cotidiana
// ---------------------------------------------------------------------------

function buildSociedadColonialActivities(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];

  acts.push({
    type: "mc",
    id: "soccol-indigenas",
    title: "Actividad 1",
    prompt: "¿Cuál de estos grupos vivía en América antes de la llegada de los españoles?",
    choices: ["Los pueblos indígenas", "Los españoles", "Los mestizos", "Los criollos"],
    answerIndex: 0,
    hint: "Pista: pensá en quiénes habitaban estas tierras originalmente.",
  });

  acts.push({
    type: "match",
    id: "soccol-grupos",
    title: "Actividad 2",
    prompt: "Uní cada grupo social colonial con una característica de su vida cotidiana.",
    pairs: [
      { left: "Los indígenas", right: "Conocían profundamente la tierra y sus recursos" },
      { left: "Los españoles", right: "Tenían el poder político y económico" },
      { left: "Los esclavos", right: "Eran obligados a trabajar sin libertad" },
      { left: "Los mestizos", right: "Eran hijos de españoles e indígenas" },
    ],
    hint: "Pista: pensá en la situación de cada grupo dentro de la sociedad colonial.",
  });

  acts.push({
    type: "classify",
    id: "soccol-clasificar",
    title: "Actividad 3",
    prompt: "Clasificá cada descripción según a qué grupo social colonial corresponde.",
    categories: ["Mestizo", "Esclavo"],
    items: shuffle([
      { label: "Hijo de español e indígena", categoryIndex: 0 },
      { label: "Persona traída de África sin libertad", categoryIndex: 1 },
    ]),
    hint: "Pista: pensá en el origen de cada grupo.",
  });

  acts.push({
    type: "mc",
    id: "soccol-costumbres",
    title: "Actividad 4",
    prompt: "¿Qué significa que un grupo social tenga 'costumbres' propias?",
    choices: [
      "Formas de vivir, vestirse y celebrar que se repiten en el tiempo",
      "Un tipo de comida únicamente",
      "Un edificio antiguo",
      "Una ley del gobierno",
    ],
    answerIndex: 0,
    hint: "Pista: pensá en las cosas que una familia repite generación tras generación.",
  });

  acts.push({
    type: "true-false",
    id: "soccol-vf",
    title: "Actividad 5",
    statement: "Todos los grupos sociales de la época colonial vivían exactamente de la misma manera.",
    isTrue: false,
    justification: {
      prompt: "¿Por qué?",
      choices: [
        "Porque cada grupo tenía trabajos, costumbres y condiciones de vida diferentes",
        "Porque todos tenían las mismas comodidades y el mismo trabajo",
      ],
      answerIndex: 0,
    },
    hint: "Pista: pensá si un español y un esclavo vivían de la misma forma.",
  });

  // 6: situación — sos un chico o una chica mestiza en 1750 y tenés que
  // contar cómo sería tu día, ordenando los momentos según lo que se sabe
  // de la vida cotidiana de los distintos grupos sociales coloniales.
  acts.push(
    buildOrderFromSequence(
      "soccol-dia-campesino",
      "Actividad 6",
      "Sos un chico o una chica mestiza en 1750. Ordená cómo sería tu día, de la mañana a la noche.",
      [
        "Levantarse temprano para trabajar la tierra",
        "Cocinar con lo que se cultivaba o criaba",
        "Fabricar tu propia ropa o herramientas",
        "Reunirte con tu familia para festejar en ocasiones especiales",
      ],
      "Pista: pensá en el orden de un día de trabajo y descanso de una familia mestiza."
    )
  );

  acts.push({
    type: "mc",
    id: "soccol-nocion",
    title: "Actividad 7",
    prompt: "¿Cuál de estas es una noción temporal que usamos para ordenar hechos históricos?",
    choices: ["Antes y después", "Arriba y abajo", "Grande y chico", "Rápido y lento"],
    answerIndex: 0,
    hint: "Pista: pensá en palabras que ordenan hechos en el tiempo.",
  });

  acts.push({
    type: "find-error",
    id: "soccol-error",
    title: "Actividad 8",
    prompt: "Delfina dijo esta frase. Encontrá el error:",
    resolution: "\"En la época colonial todas las personas tenían los mismos derechos y libertades.\"",
    choices: [
      "Está mal: los esclavos y los indígenas no tenían los mismos derechos que los españoles",
      "Está bien, todos tenían los mismos derechos",
    ],
    answerIndex: 0,
    correctAnswer: "En la sociedad colonial existían grandes desigualdades: los esclavos y muchos indígenas no tenían libertad ni los mismos derechos que los españoles.",
    hint: "Pista: pensá en la libertad que tenía cada grupo social.",
  });

  acts.push({
    type: "classify",
    id: "soccol-clasificar-epoca",
    title: "Actividad 9",
    prompt: "Clasificá cada actividad según corresponda más al pasado colonial o al presente.",
    categories: ["Época colonial", "Presente"],
    items: shuffle([
      { label: "Viajar a caballo o en carreta", categoryIndex: 0 },
      { label: "Usar teléfono celular", categoryIndex: 1 },
      { label: "Cultivar la tierra a mano", categoryIndex: 0 },
      { label: "Viajar en avión", categoryIndex: 1 },
    ]),
    hint: "Pista: pensá qué tecnologías existían en cada época.",
  });

  acts.push({
    type: "mc",
    id: "soccol-final",
    title: "Actividad 10: desafío final",
    prompt: "Desafío: ¿por qué es importante conocer la vida de distintos grupos sociales del pasado?",
    choices: [
      "Para entender cómo cambiaron y se parecen a la sociedad actual",
      "Porque no tiene ninguna utilidad",
      "Para copiar exactamente sus costumbres",
      "Porque todos vivían igual",
    ],
    answerIndex: 0,
    hint: "Pista: pensá en lo que aprendemos al comparar pasado y presente.",
  });

  return acts;
}

// ---------------------------------------------------------------------------
// Mundo 41: autoridades locales, normas de convivencia y resolución de conflictos
// ---------------------------------------------------------------------------

function buildAutoridadesConvivenciaActivities(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];

  acts.push({
    type: "mc",
    id: "autcon-cabildo",
    title: "Actividad 1",
    prompt: "¿Qué era el Cabildo en la época colonial?",
    choices: ["Un lugar de gobierno de la ciudad", "Una escuela", "Un mercado", "Una iglesia solamente"],
    answerIndex: 0,
    hint: "Pista: pensá en dónde se tomaban las decisiones de la ciudad.",
  });

  acts.push({
    type: "mc",
    id: "autcon-heredero",
    title: "Actividad 2",
    prompt: "¿Qué autoridad de hoy es heredera de las funciones del antiguo Cabildo?",
    choices: ["El gobierno municipal", "El rey de España", "Un club deportivo", "Una empresa privada"],
    answerIndex: 0,
    hint: "Pista: pensá en quién gobierna hoy una ciudad o pueblo.",
  });

  acts.push({
    type: "match",
    id: "autcon-funciones",
    title: "Actividad 3",
    prompt: "Uní cada autoridad con su función.",
    pairs: [
      { left: "El Intendente", right: "Gobierna la ciudad o el pueblo" },
      { left: "El Concejo Deliberante", right: "Crea las ordenanzas municipales" },
      { left: "El Tribunal de Faltas", right: "Controla que se cumplan las normas" },
    ],
    hint: "Pista: pensá en el rol de cada organismo del municipio.",
  });

  acts.push({
    type: "true-false",
    id: "autcon-vf",
    title: "Actividad 4",
    statement: "Las personas que gobiernan son elegidas por los ciudadanos mediante el voto.",
    isTrue: true,
    justification: {
      prompt: "¿Por qué?",
      choices: [
        "Porque en una democracia las autoridades son representantes elegidos por el pueblo",
        "Porque los gobernantes se eligen a sí mismos sin votación",
      ],
      answerIndex: 0,
    },
    hint: "Pista: pensá en cómo se elige a un Intendente en democracia.",
  });

  acts.push({
    type: "classify",
    id: "autcon-clasificar-normas",
    title: "Actividad 5",
    prompt: "Clasificá cada norma según a qué tipo de control corresponda.",
    categories: ["Norma vial", "Norma de control alimentario"],
    items: shuffle([
      { label: "Respetar el semáforo", categoryIndex: 0 },
      { label: "Usar cinturón de seguridad", categoryIndex: 0 },
      { label: "Revisar la fecha de vencimiento de los alimentos", categoryIndex: 1 },
      { label: "Controlar la limpieza de un comedor", categoryIndex: 1 },
    ]),
    hint: "Pista: pensá si la norma se relaciona con el tránsito o con la comida.",
  });

  acts.push({
    type: "mc",
    id: "autcon-conflicto",
    title: "Actividad 6",
    prompt: "¿Qué podemos hacer cuando surge un conflicto en la vida en sociedad?",
    choices: ["Dialogar y buscar una solución democrática", "Pelear sin hablar", "Ignorar siempre el problema", "Hacer solo lo que uno quiere"],
    answerIndex: 0,
    hint: "Pista: pensá en la mejor forma de resolver un problema entre personas.",
  });

  // 7: situación — dos compañeros se pelean por la pelota en el recreo y
  // hay que resolver ese conflicto real siguiendo los pasos democráticos,
  // en vez de solo ordenar un procedimiento abstracto.
  acts.push(
    buildOrderFromSequence(
      "autcon-resolver",
      "Actividad 7",
      "Dos compañeros se pelean por la pelota en el recreo. Ordená los pasos para resolver ese conflicto de forma democrática.",
      [
        "Escuchar los distintos puntos de vista",
        "Dialogar sobre el problema",
        "Buscar una solución que beneficie a todos",
        "Respetar el acuerdo al que se llegó",
      ],
      "Pista: pensá qué hacés primero cuando dos compañeros no se ponen de acuerdo."
    )
  );

  acts.push({
    type: "find-error",
    id: "autcon-error",
    title: "Actividad 8",
    prompt: "Ramiro dijo esta frase. Encontrá el error:",
    resolution: "\"Las normas de convivencia solo sirven para la escuela, no para la vida en sociedad.\"",
    choices: [
      "Está mal: las normas de convivencia sirven en la escuela, la casa y toda la comunidad",
      "Está bien, solo sirven en la escuela",
    ],
    answerIndex: 0,
    correctAnswer: "Las normas de convivencia son importantes en todos los ámbitos: la familia, la escuela y la comunidad.",
    hint: "Pista: pensá si en tu casa también hay normas de convivencia.",
  });

  acts.push({
    type: "classify",
    id: "autcon-clasificar-contexto",
    title: "Actividad 9",
    prompt: "Clasificá cada deber según el contexto donde se aplica.",
    categories: ["Contexto escolar", "Contexto familiar"],
    items: shuffle([
      { label: "Respetar a los compañeros", categoryIndex: 0 },
      { label: "Cuidar los materiales de la escuela", categoryIndex: 0 },
      { label: "Colaborar en las tareas del hogar", categoryIndex: 1 },
      { label: "Respetar a los hermanos", categoryIndex: 1 },
    ]),
    hint: "Pista: pensá si el deber se cumple en la escuela o en la casa.",
  });

  acts.push({
    type: "mc",
    id: "autcon-final",
    title: "Actividad 10: desafío final",
    prompt: "Desafío: ¿por qué es importante respetar las normas que regulan la vida en sociedad?",
    choices: [
      "Porque ayudan a que todos podamos convivir mejor",
      "Porque las normas no sirven para nada",
      "Porque solo benefician a algunas personas",
      "Porque hay que obedecer sin entender por qué",
    ],
    answerIndex: 0,
    hint: "Pista: pensá en lo que pasaría si nadie respetara ninguna norma.",
  });

  return acts;
}

// ---------------------------------------------------------------------------
// Mundo 42: circuitos productivos — actores, componentes y etapas
// ---------------------------------------------------------------------------

function buildCircuitosProductivosActivities(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];

  acts.push({
    type: "mc",
    id: "circprod-definicion",
    title: "Actividad 1",
    prompt: "¿Qué es un circuito productivo?",
    choices: [
      "El camino que recorre un producto desde que se produce hasta que llega al consumidor",
      "Un tipo de transporte solamente",
      "Una fiesta popular",
      "Un edificio de gobierno",
    ],
    answerIndex: 0,
    hint: "Pista: pensá en todo el recorrido de un producto, desde su origen.",
  });

  // 2: situación — el camión que llevaba la lana se rompió antes de llegar
  // a la fábrica; para saber qué etapa del circuito queda frenada primero
  // hay que tener claro el orden completo de las etapas.
  acts.push(
    buildOrderFromSequence(
      "circprod-lana",
      "Actividad 2",
      "El camión que trasladaba la lana se rompió antes de llegar a la fábrica. Para entender qué etapa del circuito se frena, ordená primero las etapas del circuito productivo de la lana.",
      [
        "Esquilar la lana de las ovejas",
        "Lavar y procesar la lana en una fábrica",
        "Transportar la lana o los tejidos a distintos lugares",
        "Vender los productos de lana en los comercios",
      ],
      "Pista: si el camión se rompe antes de llegar a la fábrica, la etapa siguiente es la que queda frenada."
    )
  );

  acts.push({
    type: "classify",
    id: "circprod-clasificar-actividad",
    title: "Actividad 3",
    prompt: "Clasificá cada actividad según sea agraria, industrial o comercial.",
    categories: ["Agraria", "Industrial", "Comercial"],
    items: shuffle([
      { label: "Criar ovejas", categoryIndex: 0 },
      { label: "Cultivar trigo", categoryIndex: 0 },
      { label: "Fabricar telas en una fábrica", categoryIndex: 1 },
      { label: "Vender ropa en un local", categoryIndex: 2 },
    ]),
    hint: "Pista: pensá si la actividad produce la materia prima, la transforma o la vende.",
  });

  acts.push({
    type: "match",
    id: "circprod-actores",
    title: "Actividad 4",
    prompt: "Uní cada actor social con su rol en un circuito productivo.",
    pairs: [
      { left: "El productor rural", right: "Cría animales o cultiva la tierra" },
      { left: "El transportista", right: "Traslada los productos de un lugar a otro" },
      { left: "El comerciante", right: "Vende el producto final al consumidor" },
    ],
    hint: "Pista: pensá qué hace cada persona en la cadena de un producto.",
  });

  acts.push({
    type: "mc",
    id: "circprod-transporte",
    title: "Actividad 5",
    prompt: "¿Por qué son importantes los medios de transporte en un circuito productivo?",
    choices: [
      "Porque permiten trasladar los productos entre distintos lugares",
      "Porque no cumplen ninguna función",
      "Porque solo sirven para pasear",
      "Porque encarecen todo sin ningún beneficio",
    ],
    answerIndex: 0,
    hint: "Pista: pensá cómo llega un producto desde donde se hace hasta donde se vende.",
  });

  acts.push({
    type: "true-false",
    id: "circprod-vf",
    title: "Actividad 6",
    statement: "En una ciudad grande y en una zona rural se usan siempre los mismos medios de transporte de la misma manera.",
    isTrue: false,
    justification: {
      prompt: "¿Por qué?",
      choices: [
        "Porque en la ciudad se usan más el colectivo o el subte, y en el campo más la camioneta o el caballo",
        "Porque en todos lados se usa siempre el mismo medio de transporte",
      ],
      answerIndex: 0,
    },
    hint: "Pista: pensá qué medio de transporte usarías en el campo y cuál en una ciudad grande.",
  });

  acts.push({
    type: "find-error",
    id: "circprod-error",
    title: "Actividad 7",
    prompt: "Camila dijo esta frase. Encontrá el error:",
    resolution: "\"Un circuito productivo solo incluye a la fábrica, nada más.\"",
    choices: [
      "Está mal: también incluye la producción de la materia prima, el transporte y la venta",
      "Está bien, solo incluye a la fábrica",
    ],
    answerIndex: 0,
    correctAnswer: "Un circuito productivo incluye varias etapas: producción de la materia prima, transformación, transporte y comercialización.",
    hint: "Pista: pensá en todas las etapas antes y después de la fábrica.",
  });

  acts.push({
    type: "classify",
    id: "circprod-clasificar-componente",
    title: "Actividad 8",
    prompt: "Clasificá cada componente de un circuito productivo.",
    categories: ["Insumos y materia prima", "Transporte y comercialización"],
    items: shuffle([
      { label: "La lana de oveja", categoryIndex: 0 },
      { label: "El trigo cosechado", categoryIndex: 0 },
      { label: "El camión que traslada la mercadería", categoryIndex: 1 },
      { label: "El local donde se vende el producto", categoryIndex: 1 },
    ]),
    hint: "Pista: pensá si es lo que se produce al principio o lo que pasa después.",
  });

  acts.push({
    type: "mc",
    id: "circprod-relacion",
    title: "Actividad 9",
    prompt: "¿Qué relación existe entre el campo y la ciudad en un circuito productivo?",
    choices: [
      "El campo produce materias primas y la ciudad las transforma o las vende",
      "No tienen ninguna relación",
      "Solo la ciudad produce todo",
      "Solo el campo consume todo",
    ],
    answerIndex: 0,
    hint: "Pista: pensá de dónde viene la lana y adónde va a parar.",
  });

  acts.push({
    type: "mc",
    id: "circprod-final",
    title: "Actividad 10: desafío final",
    prompt: "Desafío: en el circuito productivo de la lana patagónica, ¿cuál es el primer paso?",
    choices: ["Esquilar la lana de las ovejas", "Vender la ropa en el local", "Transportar la tela a la fábrica", "Lavar la lana"],
    answerIndex: 0,
    hint: "Pista: pensá qué se hace antes de poder procesar la lana.",
  });

  return acts;
}

// ---------------------------------------------------------------------------
// Mundo 43: cambios y continuidades, huellas del pasado y patrimonio
// ---------------------------------------------------------------------------

function buildPatrimonioCambiosActivities(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];

  acts.push({
    type: "mc",
    id: "patrim-definicion",
    title: "Actividad 1",
    prompt: "¿Qué es un bien patrimonial?",
    choices: [
      "Un objeto, edificio o lugar valioso para la memoria de una comunidad",
      "Un juguete cualquiera",
      "Una moneda actual",
      "Un plato de comida del día",
    ],
    answerIndex: 0,
    hint: "Pista: pensá en algo antiguo e importante que se cuida y se conserva.",
  });

  acts.push({
    type: "classify",
    id: "patrim-clasificar-cambio",
    title: "Actividad 2",
    prompt: "Clasificá cada elemento según sea un cambio o una continuidad respecto del pasado.",
    categories: ["Cambió con el tiempo", "Se mantiene igual (continuidad)"],
    items: shuffle([
      { label: "Viajar en avión en vez de carreta", categoryIndex: 0 },
      { label: "Festejar el cumpleaños con la familia", categoryIndex: 1 },
      { label: "Comunicarse por celular en vez de carta", categoryIndex: 0 },
      { label: "Compartir comidas en reuniones familiares", categoryIndex: 1 },
    ]),
    hint: "Pista: pensá si esa costumbre cambió mucho o se sigue haciendo igual.",
  });

  acts.push({
    type: "mc",
    id: "patrim-huella",
    title: "Actividad 3",
    prompt: "¿Cuál de estos es un ejemplo de huella material del pasado que podemos encontrar hoy?",
    choices: ["Un edificio histórico", "Un teléfono celular nuevo", "Una app de internet", "Un auto moderno"],
    answerIndex: 0,
    hint: "Pista: pensá en algo antiguo que todavía se puede ver en una ciudad.",
  });

  acts.push({
    type: "match",
    id: "patrim-avances",
    title: "Actividad 4",
    prompt: "Uní cada avance tecnológico con lo que reemplazó o mejoró.",
    pairs: [
      { left: "La heladera", right: "Reemplazó las formas antiguas de conservar alimentos" },
      { left: "El auto", right: "Reemplazó a la carreta para viajar" },
      { left: "El teléfono", right: "Reemplazó a la carta para comunicarse" },
    ],
    hint: "Pista: pensá en cómo se hacían antes esas mismas tareas.",
  });

  acts.push({
    type: "true-false",
    id: "patrim-vf",
    title: "Actividad 5",
    statement: "Las sociedades del pasado y del presente no tienen ninguna semejanza entre sí.",
    isTrue: false,
    justification: {
      prompt: "¿Por qué?",
      choices: [
        "Porque comparten necesidades como alimentarse, vestirse y comunicarse, aunque de formas distintas",
        "Porque las sociedades actuales no necesitan nada de lo que necesitaban antes",
      ],
      answerIndex: 0,
    },
    hint: "Pista: pensá en necesidades básicas que tenemos todos, en cualquier época.",
  });

  acts.push(
    buildOrderFromSequence(
      "patrim-investigar",
      "Actividad 6",
      "Ordená los pasos para investigar un bien patrimonial de la zona.",
      [
        "Elegir un edificio o lugar histórico de la localidad",
        "Buscar información sobre su historia",
        "Entrevistar a alguien que conozca su historia",
        "Compartir lo aprendido con la clase",
      ],
      "Pista: pensá en el orden lógico de una pequeña investigación escolar."
    )
  );

  // 7: situación — el municipio quiere demoler un edificio de 100 años
  // del centro para hacer un estacionamiento, y hay que decidir qué
  // responderle usando la idea de patrimonio.
  acts.push({
    type: "find-error",
    id: "patrim-error",
    title: "Actividad 7",
    prompt: "El municipio quiere demoler un edificio de 100 años para hacer un estacionamiento. Franco dice esta frase sobre la idea. Encontrá el error:",
    resolution: "\"Los edificios antiguos no sirven para nada hoy en día, hay que demolerlos siempre que haga falta un estacionamiento o algo nuevo.\"",
    choices: [
      "Está mal: aunque haga falta espacio, un edificio patrimonial se puede conservar porque forma parte de la memoria e identidad de la comunidad",
      "Está bien, siempre conviene demolerlo para tener más lugar",
    ],
    answerIndex: 0,
    correctAnswer: "Antes de demoler un edificio de 100 años conviene evaluar su valor patrimonial: se lo puede cuidar y darle otro uso, porque forma parte de la historia e identidad de la comunidad.",
    hint: "Pista: pensá qué le dirías al municipio para que no pierda un edificio con historia.",
  });

  acts.push({
    type: "classify",
    id: "patrim-clasificar-conservar",
    title: "Actividad 8",
    prompt: "Clasificá cada forma de conservar alimentos según sea más del pasado o del presente.",
    categories: ["Más típico del pasado", "Más típico del presente"],
    items: shuffle([
      { label: "Salar la carne para conservarla", categoryIndex: 0 },
      { label: "Guardar en la heladera", categoryIndex: 1 },
      { label: "Ahumar los alimentos", categoryIndex: 0 },
      { label: "Congelar en el freezer", categoryIndex: 1 },
    ]),
    hint: "Pista: pensá qué método existía antes de que hubiera heladeras eléctricas.",
  });

  acts.push({
    type: "mc",
    id: "patrim-importancia",
    title: "Actividad 9",
    prompt: "¿Por qué es importante conocer los cambios y continuidades entre el pasado y el presente?",
    choices: [
      "Para entender mejor cómo llegamos a vivir como vivimos hoy",
      "Porque no sirve de nada conocer el pasado",
      "Para copiar exactamente las costumbres antiguas",
      "Porque el pasado y el presente son iguales",
    ],
    answerIndex: 0,
    hint: "Pista: pensá en lo que aprendemos al comparar cómo se vivía antes y ahora.",
  });

  acts.push({
    type: "mc",
    id: "patrim-final",
    title: "Actividad 10: desafío final",
    prompt: "Desafío: ¿cuál de estos es un ejemplo de continuidad entre el pasado y el presente?",
    choices: ["Celebrar fiestas familiares", "Viajar en carreta", "Escribir cartas en papel para comunicarse todos los días", "Iluminarse con velas todas las noches"],
    answerIndex: 0,
    hint: "Pista: pensá en algo que se sigue haciendo igual desde hace mucho tiempo.",
  });

  return acts;
}

// ---------------------------------------------------------------------------
// Mundo 44: gobierno municipal — Intendente, Concejo Deliberante, ordenanzas
// ---------------------------------------------------------------------------

function buildGobiernoMunicipalActivities(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];

  acts.push({
    type: "mc",
    id: "gobmun-intendente",
    title: "Actividad 1",
    prompt: "¿Quién es la máxima autoridad de un municipio?",
    choices: ["El Intendente", "El Presidente", "El Rey", "El Director de la escuela"],
    answerIndex: 0,
    hint: "Pista: pensá en quién gobierna una ciudad o pueblo.",
  });

  acts.push({
    type: "match",
    id: "gobmun-organismos",
    title: "Actividad 2",
    prompt: "Uní cada organismo municipal con su función principal.",
    pairs: [
      { left: "El Intendente", right: "Gobierna y administra el municipio" },
      { left: "El Concejo Deliberante", right: "Elabora y aprueba las ordenanzas" },
      { left: "El Tribunal de Faltas", right: "Controla que se cumplan las normas municipales" },
    ],
    hint: "Pista: pensá en el rol de cada organismo dentro del gobierno local.",
  });

  acts.push({
    type: "classify",
    id: "gobmun-clasificar-normas",
    title: "Actividad 3",
    prompt: "Clasificá cada norma según el ámbito que regula.",
    categories: ["Normas viales", "Normas ambientales"],
    items: shuffle([
      { label: "Respetar los semáforos", categoryIndex: 0 },
      { label: "Usar el cinturón de seguridad", categoryIndex: 0 },
      { label: "No tirar basura en la calle", categoryIndex: 1 },
      { label: "Cuidar las plazas y espacios verdes", categoryIndex: 1 },
    ]),
    hint: "Pista: pensá si la norma se relaciona con el tránsito o con el cuidado del ambiente.",
  });

  acts.push({
    type: "true-false",
    id: "gobmun-vf",
    title: "Actividad 4",
    statement: "Las ordenanzas municipales son creadas y controladas por el Concejo Deliberante.",
    isTrue: true,
    justification: {
      prompt: "¿Por qué?",
      choices: [
        "Porque es su función elaborar, disponer y controlar el cumplimiento de las normas locales",
        "Porque las ordenanzas las crea cualquier vecino sin autoridad",
      ],
      answerIndex: 0,
    },
    hint: "Pista: pensá en qué organismo tiene esa función específica.",
  });

  acts.push({
    type: "mc",
    id: "gobmun-deber",
    title: "Actividad 5",
    prompt: "¿Cuál de estos es un deber que tenemos en el contexto escolar?",
    choices: ["Respetar a los compañeros y cuidar los materiales", "Faltar sin avisar", "No respetar las normas de convivencia", "Hacer lo que uno quiera sin pensar en los demás"],
    answerIndex: 0,
    hint: "Pista: pensá en lo que se espera de un buen compañero en la escuela.",
  });

  // 6: situación — hace varios días no pasa el camión de basura por tu
  // calle, y hay que armar el reclamo municipal paso a paso en vez de
  // solo enumerar los pasos de forma abstracta.
  acts.push(
    buildOrderFromSequence(
      "gobmun-reclamo",
      "Actividad 6",
      "Hace varios días no pasa el camión recolector de basura por tu calle. Ordená los pasos para hacer el reclamo ante el municipio de forma democrática.",
      [
        "Identificar el problema: no pasa el camión de basura hace varios días",
        "Juntar información y, si es posible, firmas de los vecinos afectados",
        "Presentar el reclamo ante el organismo municipal correspondiente",
        "Esperar y hacer seguimiento de la respuesta del municipio",
      ],
      "Pista: pensá en el orden lógico para plantear un reclamo formal por un problema del barrio."
    )
  );

  acts.push({
    type: "find-error",
    id: "gobmun-error",
    title: "Actividad 7",
    prompt: "Milagros dijo esta frase. Encontrá el error:",
    resolution: "\"El Intendente puede hacer lo que quiera sin que nadie lo controle.\"",
    choices: [
      "Está mal: el Intendente es controlado por el Concejo Deliberante y por las leyes",
      "Está bien, no tiene ningún control",
    ],
    answerIndex: 0,
    correctAnswer: "En una democracia, las autoridades como el Intendente son controladas por otros organismos, como el Concejo Deliberante.",
    hint: "Pista: pensá si una sola persona puede decidir todo sin ningún control en democracia.",
  });

  acts.push({
    type: "classify",
    id: "gobmun-clasificar-derecho",
    title: "Actividad 8",
    prompt: "Clasificá cada situación según se trate de un derecho o un deber en la comunidad.",
    categories: ["Derecho", "Deber"],
    items: shuffle([
      { label: "Recibir educación", categoryIndex: 0 },
      { label: "Respetar las normas de convivencia", categoryIndex: 1 },
      { label: "Vivir en un ambiente sano", categoryIndex: 0 },
      { label: "Cuidar los espacios públicos", categoryIndex: 1 },
    ]),
    hint: "Pista: pensá si es algo que recibimos o algo que tenemos que cumplir.",
  });

  acts.push({
    type: "mc",
    id: "gobmun-importancia",
    title: "Actividad 9",
    prompt: "¿Por qué son importantes las normas que regulan la vida social, como las de tránsito?",
    choices: ["Porque ayudan a cuidar la seguridad de todos", "Porque no tienen ninguna utilidad", "Porque solo sirven para complicar la vida", "Porque las inventan sin ningún motivo"],
    answerIndex: 0,
    hint: "Pista: pensá qué pasaría si nadie respetara el semáforo.",
  });

  acts.push({
    type: "mc",
    id: "gobmun-final",
    title: "Actividad 10: desafío final",
    prompt: "Desafío: si un vecino tiene un problema con la basura de su calle, ¿a qué autoridad podría recurrir?",
    choices: ["Al municipio, a través de sus organismos correspondientes", "Al Presidente de la Nación directamente", "A un país vecino", "A ningún lado, no se puede resolver"],
    answerIndex: 0,
    hint: "Pista: pensá en qué nivel de gobierno se ocupa de los problemas de la ciudad o el pueblo.",
  });

  return acts;
}

// ---------------------------------------------------------------------------
// Mundo 45: transporte, recursos naturales y problemáticas ambientales
// ---------------------------------------------------------------------------

function buildTransporteAmbienteActivities(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];

  acts.push({
    type: "mc",
    id: "transamb-relacion",
    title: "Actividad 1",
    prompt: "¿Cuál de estos es un ejemplo de cómo el transporte relaciona a distintos espacios?",
    choices: ["Un camión que lleva productos de un pueblo a una ciudad", "Una plaza sin caminos", "Un lago sin conexión con otros lugares", "Una montaña sin caminos"],
    answerIndex: 0,
    hint: "Pista: pensá en algo que traslada cosas entre dos lugares distintos.",
  });

  acts.push({
    type: "classify",
    id: "transamb-clasificar-actividad",
    title: "Actividad 2",
    prompt: "Clasificá cada elemento según la actividad económica principal que lo aprovecha.",
    categories: ["Actividad ganadera", "Actividad pesquera"],
    items: shuffle([
      { label: "Ovejas y vacas", categoryIndex: 0 },
      { label: "Pastos para animales", categoryIndex: 0 },
      { label: "Peces del mar", categoryIndex: 1 },
      { label: "Puertos pesqueros", categoryIndex: 1 },
    ]),
    hint: "Pista: pensá si el recurso está relacionado con animales de campo o con el mar.",
  });

  // 3: situación — en tu pueblo se pescó demasiado este año y ahora hay
  // muchos menos peces; hay que decidir qué proponerle al municipio en
  // vez de solo nombrar el problema ambiental en abstracto.
  acts.push({
    type: "mc",
    id: "transamb-problema",
    title: "Actividad 3",
    prompt: "En tu pueblo se pescó demasiado este año y ahora hay muchos menos peces que antes. ¿Qué le propondrías al municipio?",
    choices: [
      "Poner una temporada o una cantidad límite de pesca para que el recurso se recupere",
      "Pescar todavía más rápido antes de que se terminen",
      "No hacer nada, el problema se soluciona solo",
      "Prohibir pescar para siempre, aunque los pescadores necesiten trabajar",
    ],
    answerIndex: 0,
    hint: "Pista: pensá en una medida que permita seguir pescando sin agotar el recurso.",
  });

  acts.push({
    type: "match",
    id: "transamb-recursos",
    title: "Actividad 4",
    prompt: "Uní cada actividad económica con el recurso natural que aprovecha principalmente.",
    pairs: [
      { left: "La actividad ganadera", right: "Los pastizales y el ganado" },
      { left: "La actividad pesquera", right: "Los peces del mar" },
      { left: "La actividad minera", right: "Los minerales de la tierra" },
    ],
    hint: "Pista: pensá qué recurso natural usa cada actividad para producir.",
  });

  acts.push({
    type: "true-false",
    id: "transamb-vf",
    title: "Actividad 5",
    statement: "Cuidar el ambiente y aprovechar los recursos naturales para trabajar son cosas totalmente opuestas que no se pueden combinar.",
    isTrue: false,
    justification: {
      prompt: "¿Por qué?",
      choices: [
        "Porque se pueden aprovechar los recursos de forma responsable, cuidando que no se agoten",
        "Porque siempre hay que elegir entre trabajar o cuidar el ambiente",
      ],
      answerIndex: 0,
    },
    hint: "Pista: pensá si se puede pescar o criar animales cuidando el ambiente al mismo tiempo.",
  });

  acts.push(
    buildOrderFromSequence(
      "transamb-analizar",
      "Actividad 6",
      "Ordená los pasos para analizar una problemática ambiental de la zona.",
      [
        "Identificar el problema ambiental",
        "Investigar sus causas",
        "Pensar en las consecuencias para la comunidad",
        "Proponer una posible solución",
      ],
      "Pista: pensá en el orden lógico para estudiar cualquier problema."
    )
  );

  acts.push({
    type: "find-error",
    id: "transamb-error",
    title: "Actividad 7",
    prompt: "Agustina dijo esta frase. Encontrá el error:",
    resolution: "\"Los mapas y planos no sirven para localizar espacios provinciales o nacionales.\"",
    choices: [
      "Está mal: los mapas y planos sirven justamente para localizar y representar espacios de distintas escalas",
      "Está bien, no sirven para eso",
    ],
    answerIndex: 0,
    correctAnswer: "Los mapas y planos son herramientas que permiten localizar y representar espacios locales, provinciales y nacionales.",
    hint: "Pista: pensá para qué se usa un mapa de la provincia o del país.",
  });

  acts.push({
    type: "classify",
    id: "transamb-clasificar-escala",
    title: "Actividad 8",
    prompt: "Clasificá cada elemento según se represente mejor en un plano o en un mapa.",
    categories: ["Más propio de un plano", "Más propio de un mapa"],
    items: shuffle([
      { label: "Las calles de un barrio", categoryIndex: 0 },
      { label: "La distribución de una escuela", categoryIndex: 0 },
      { label: "Los límites de una provincia", categoryIndex: 1 },
      { label: "El territorio de un país", categoryIndex: 1 },
    ]),
    hint: "Pista: pensá si es un espacio chico y detallado, o uno muy grande.",
  });

  acts.push({
    type: "mc",
    id: "transamb-comunicacion",
    title: "Actividad 9",
    prompt: "¿Cuál de estas es una forma de comunicación entre distintos espacios locales?",
    choices: ["El correo y las telecomunicaciones", "Una montaña sin caminos", "Un lago sin barcos", "Un desierto sin rutas"],
    answerIndex: 0,
    hint: "Pista: pensá en cómo se envían cartas o mensajes entre lugares distintos.",
  });

  acts.push({
    type: "mc",
    id: "transamb-final",
    title: "Actividad 10: desafío final",
    prompt: "Desafío: ¿qué relación existe entre el uso de los recursos naturales y el cuidado del ambiente?",
    choices: ["Hay que aprovecharlos de forma responsable para que no se agoten", "No hay ninguna relación entre ambas cosas", "Hay que usarlos sin ningún límite", "Hay que dejar de usarlos por completo siempre"],
    answerIndex: 0,
    hint: "Pista: pensá en un uso responsable, ni excesivo ni nulo.",
  });

  return acts;
}

// ---------------------------------------------------------------------------
// Mundo 46: nociones temporales, procesos históricos y conmemoraciones
// ---------------------------------------------------------------------------

function buildLineaTiempoHistoricaActivities(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];

  acts.push({
    type: "mc",
    id: "lineatime-simultaneidad",
    title: "Actividad 1",
    prompt: "¿Qué noción temporal indica que dos hechos ocurren al mismo tiempo?",
    choices: ["Simultaneidad", "Secuencia", "Duración", "Cambio"],
    answerIndex: 0,
    hint: "Pista: pensá en la palabra 'simultáneo'.",
  });

  acts.push({
    type: "mc",
    id: "lineatime-duracion",
    title: "Actividad 2",
    prompt: "¿Qué noción temporal se refiere a cuánto tiempo dura un hecho o proceso?",
    choices: ["Duración", "Simultaneidad", "Antes", "Después"],
    answerIndex: 0,
    hint: "Pista: pensá en cuánto tiempo dura algo, no en cuándo empieza.",
  });

  acts.push({
    type: "match",
    id: "lineatime-nociones",
    title: "Actividad 3",
    prompt: "Uní cada noción temporal con su significado.",
    pairs: [
      { left: "Secuencia", right: "El orden en que ocurren los hechos" },
      { left: "Cambio", right: "Algo que es distinto de cómo era antes" },
      { left: "Continuidad", right: "Algo que se mantiene igual en el tiempo" },
    ],
    hint: "Pista: pensá en el significado de cada palabra por separado.",
  });

  // 4: situación — armar la línea de tiempo de tu propia familia
  // (abuelos → papás → vos), aplicando antes/después/duración a hechos
  // reales en vez de solo ordenar procesos históricos generales.
  acts.push(
    buildOrderFromSequence(
      "lineatime-hechos",
      "Actividad 4",
      "Armá la línea de tiempo de tu propia familia. Ordená estos momentos del más antiguo al más reciente.",
      [
        "Cuando tus abuelos eran chicos",
        "El nacimiento de tus papás",
        "Tu nacimiento",
        "Tu vida en la escuela hoy",
      ],
      "Pista: pensá quién nació primero: tus abuelos, tus papás o vos."
    )
  );

  acts.push({
    type: "classify",
    id: "lineatime-clasificar-conmemoracion",
    title: "Actividad 5",
    prompt: "Clasificá cada conmemoración según a quién recuerda principalmente.",
    categories: ["Conmemoración escolar o comunitaria", "Conmemoración nacional"],
    items: shuffle([
      { label: "El aniversario de la escuela", categoryIndex: 0 },
      { label: "Una fiesta del pueblo", categoryIndex: 0 },
      { label: "El Día de la Independencia", categoryIndex: 1 },
      { label: "El Día de la Bandera", categoryIndex: 1 },
    ]),
    hint: "Pista: pensá si la conmemoración es de tu escuela o de todo el país.",
  });

  acts.push({
    type: "true-false",
    id: "lineatime-vf",
    title: "Actividad 6",
    statement: "Elaborar una línea de tiempo ayuda a entender el orden y la duración de los hechos históricos.",
    isTrue: true,
    justification: {
      prompt: "¿Por qué?",
      choices: [
        "Porque permite visualizar cuándo ocurrió cada hecho y cuánto duró un proceso",
        "Porque las líneas de tiempo no tienen relación con la historia",
      ],
      answerIndex: 0,
    },
    hint: "Pista: pensá para qué sirve dibujar los hechos en una línea ordenada.",
  });

  acts.push({
    type: "mc",
    id: "lineatime-participar",
    title: "Actividad 7",
    prompt: "¿Por qué participamos en celebraciones y conmemoraciones históricas?",
    choices: ["Para recordar acontecimientos importantes para la comunidad y la nación", "Porque son solamente un día de descanso", "Porque no tienen ningún significado", "Porque lo dice el calendario sin motivo"],
    answerIndex: 0,
    hint: "Pista: pensá qué se recuerda en un acto escolar del 25 de mayo o el 9 de julio.",
  });

  acts.push({
    type: "find-error",
    id: "lineatime-error",
    title: "Actividad 8",
    prompt: "Thiago dijo esta frase. Encontrá el error:",
    resolution: "\"La historia siempre se puede explicar con una sola causa y una sola opinión.\"",
    choices: [
      "Está mal: los hechos históricos tienen múltiples causas y se pueden interpretar desde distintos puntos de vista",
      "Está bien, siempre hay una sola causa y explicación",
    ],
    answerIndex: 0,
    correctAnswer: "Los procesos históricos son multicausales y pueden analizarse desde diferentes perspectivas.",
    hint: "Pista: pensá si un hecho histórico importante tiene una sola causa posible.",
  });

  acts.push({
    type: "classify",
    id: "lineatime-clasificar-tiempo",
    title: "Actividad 9",
    prompt: "Clasificá cada hecho según corresponda al pasado histórico o al presente.",
    categories: ["Pasado histórico", "Presente"],
    items: shuffle([
      { label: "La organización de la sociedad colonial", categoryIndex: 0 },
      { label: "El funcionamiento actual del municipio", categoryIndex: 1 },
      { label: "Los procesos de independencia", categoryIndex: 0 },
      { label: "La vida escolar de hoy", categoryIndex: 1 },
    ]),
    hint: "Pista: pensá si el hecho ocurrió hace mucho tiempo o está pasando ahora.",
  });

  acts.push({
    type: "mc",
    id: "lineatime-final",
    title: "Actividad 10: desafío final",
    prompt: "Desafío: si un hecho ocurrió 'antes' que otro, ¿qué noción temporal estamos usando?",
    choices: ["Secuencia", "Simultaneidad", "Duración", "Continuidad"],
    answerIndex: 0,
    hint: "Pista: pensá en el orden en que ocurren los hechos.",
  });

  return acts;
}

// ---------------------------------------------------------------------------
// Mundo 47: diversidad cultural, derechos y proyectos colectivos
// ---------------------------------------------------------------------------

function buildDiversidadCiudadaniaActivities(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];

  acts.push({
    type: "mc",
    id: "diverciud-valorar",
    title: "Actividad 1",
    prompt: "¿Qué significa valorar la diversidad cultural?",
    choices: [
      "Respetar las distintas costumbres, creencias y tradiciones de las personas",
      "Pensar que una sola cultura es mejor que las demás",
      "Ignorar las costumbres de los demás",
      "No permitir que existan diferencias entre las personas",
    ],
    answerIndex: 0,
    hint: "Pista: pensá en lo que significa 'respetar' a alguien distinto.",
  });

  acts.push({
    type: "classify",
    id: "diverciud-clasificar-cultura",
    title: "Actividad 2",
    prompt: "Clasificá cada elemento cultural según a qué aspecto corresponde.",
    categories: ["Costumbre o tradición", "Creencia o religión"],
    items: shuffle([
      { label: "Festejar una fiesta popular", categoryIndex: 0 },
      { label: "Una comida típica", categoryIndex: 0 },
      { label: "Una religión que profesa una familia", categoryIndex: 1 },
      { label: "Un culto o creencia espiritual", categoryIndex: 1 },
    ]),
    hint: "Pista: pensá si se relaciona con festejos y comidas, o con creencias espirituales.",
  });

  acts.push({
    type: "mc",
    id: "diverciud-politica",
    title: "Actividad 3",
    prompt: "¿Qué política del Estado puede afectar la organización social de un territorio?",
    choices: ["La construcción de rutas, escuelas u hospitales", "El color de las casas", "El tipo de mascotas que tiene la gente", "La cantidad de árboles de un jardín"],
    answerIndex: 0,
    hint: "Pista: pensá en obras públicas que cambian la vida de una comunidad.",
  });

  acts.push({
    type: "true-false",
    id: "diverciud-vf",
    title: "Actividad 4",
    statement: "Todas las comunidades del país tienen exactamente las mismas condiciones de vida.",
    isTrue: false,
    justification: {
      prompt: "¿Por qué?",
      choices: [
        "Porque existen comunidades con más o menos acceso a servicios, recursos y oportunidades",
        "Porque todas las comunidades tienen siempre los mismos recursos",
      ],
      answerIndex: 0,
    },
    hint: "Pista: pensá si todos los pueblos y ciudades tienen el mismo acceso a hospitales o escuelas.",
  });

  acts.push({
    type: "match",
    id: "diverciud-derechos",
    title: "Actividad 5",
    prompt: "Uní cada situación con el derecho relacionado.",
    pairs: [
      { left: "Ir a la escuela", right: "Derecho a la educación" },
      { left: "Recibir atención médica", right: "Derecho a la salud" },
      { left: "Tener una vivienda digna", right: "Derecho a la vivienda" },
    ],
    hint: "Pista: pensá qué derecho básico corresponde a cada situación.",
  });

  acts.push(
    buildOrderFromSequence(
      "diverciud-proyecto",
      "Actividad 6",
      "Ordená los pasos para participar en un proyecto colectivo solidario en la escuela.",
      [
        "Identificar una necesidad de la comunidad escolar",
        "Proponer ideas entre todos para ayudar",
        "Organizar las tareas entre los participantes",
        "Llevar adelante el proyecto y compartir los resultados",
      ],
      "Pista: pensá en el orden lógico para organizar un proyecto solidario entre compañeros."
    )
  );

  // 7: situación — un compañero nuevo de otra provincia no consigue
  // amigos porque tiene costumbres distintas, y hay que decidir cómo
  // responder aplicando la idea de valorar la diversidad cultural.
  acts.push({
    type: "find-error",
    id: "diverciud-error",
    title: "Actividad 7",
    prompt: "Llega un compañero nuevo de otra provincia y le cuesta hacer amigos porque tiene costumbres distintas a las tuyas. Zoe dice esta frase sobre la situación. Encontrá el error:",
    resolution: "\"Como tiene costumbres distintas, mejor no juntarse con él hasta que las cambie y sea como los demás.\"",
    choices: [
      "Está mal: hay que valorar y respetar sus costumbres distintas, e incluirlo tal como es, no pedirle que cambie",
      "Está bien, primero tiene que dejar sus costumbres para poder integrarse",
    ],
    answerIndex: 0,
    correctAnswer: "Valorar la diversidad cultural significa respetar las costumbres distintas de los demás e incluir a un compañero nuevo tal como es, sin pedirle que cambie.",
    hint: "Pista: pensá cómo te gustaría que te traten si vos fueras el nuevo o la nueva en otro lugar.",
  });

  acts.push({
    type: "classify",
    id: "diverciud-clasificar-convivencia",
    title: "Actividad 8",
    prompt: "Clasificá cada acción según fomente o no la convivencia democrática.",
    categories: ["Fomenta la convivencia democrática", "No la fomenta"],
    items: shuffle([
      { label: "Escuchar distintas opiniones", categoryIndex: 0 },
      { label: "Resolver conflictos dialogando", categoryIndex: 0 },
      { label: "Imponer una idea sin escuchar a nadie", categoryIndex: 1 },
      { label: "Discriminar a alguien por ser diferente", categoryIndex: 1 },
    ]),
    hint: "Pista: pensá si la acción respeta o no a los demás.",
  });

  acts.push({
    type: "mc",
    id: "diverciud-importancia",
    title: "Actividad 9",
    prompt: "¿Por qué es importante participar en proyectos colectivos en la escuela o la comunidad?",
    choices: ["Porque fortalecen la solidaridad y la convivencia democrática", "Porque no tienen ningún valor", "Porque solo benefician a unos pocos", "Porque no involucran a nadie más"],
    answerIndex: 0,
    hint: "Pista: pensá en lo que se gana al trabajar juntos por un objetivo común.",
  });

  acts.push({
    type: "mc",
    id: "diverciud-final",
    title: "Actividad 10: desafío final",
    prompt: "Desafío: ¿cuál de estas actitudes ayuda a construir una ciudadanía responsable y solidaria?",
    choices: ["Participar activamente y respetar a los demás", "Ignorar los problemas de la comunidad", "Pensar solo en uno mismo", "No respetar las normas de convivencia"],
    answerIndex: 0,
    hint: "Pista: pensá en la actitud opuesta al individualismo.",
  });

  return acts;
}

// ---------------------------------------------------------------------------
// Dispatch
// ---------------------------------------------------------------------------

export function buildActivitiesForWorld(world: WorldDef): ActivitySpec[] {
  switch (world.category) {
    case "numeros":
      return buildNumerosActivities();
    case "sumas-restas":
      return buildSumasRestasActivities();
    case "calculo-mental":
      return buildCalculoMentalActivities();
    case "espacio":
      return buildEspacioActivities();
    case "tabla":
      return buildTablaGroupActivities(world.tables ?? [2, 5, 10]);
    case "reparto":
      return buildRepartoActivities();
    case "geometria":
      return buildGeometriaActivities();
    case "medidas":
      return buildMedidasActivities();
    case "problemas":
      return buildProblemasActivities();
    case "fracciones":
      return buildFraccionesActivities();
    case "numeros-grandes":
      return buildNumerosGrandesActivities();
    case "cuerpos-tiempo":
      return buildCuerposTiempoActivities();
    case "oralidad-inicial":
      return buildOralidadInicialActivities();
    case "lectura-cuentos":
      return buildLecturaCuentosActivities();
    case "escritura-inicial":
      return buildEscrituraInicialActivities();
    case "clases-palabras":
      return buildClasesPalabrasActivities();
    case "lectura-narrativa":
      return buildLecturaNarrativaActivities();
    case "lectura-informativa":
      return buildLecturaInformativaActivities();
    case "escritura-narrativa":
      return buildEscrituraNarrativaActivities();
    case "formacion-palabras":
      return buildFormacionPalabrasActivities();
    case "oralidad-debate":
      return buildOralidadDebateActivities();
    case "lectura-autonoma":
      return buildLecturaAutonomaActivities();
    case "escritura-creativa":
      return buildEscrituraCreativaActivities();
    case "sentido-palabras":
      return buildSentidoPalabrasActivities();
    case "seres-vivos-diversidad":
      return buildSeresVivosDiversidadActivities();
    case "materiales-mezclas":
      return buildMaterialesMezclasActivities();
    case "fenomenos-fisicos-basicos":
      return buildFenomenosFisicosBasicosActivities();
    case "paisajes-orientacion":
      return buildPaisajesOrientacionActivities();
    case "seres-vivos-interacciones":
      return buildSeresVivosInteraccionesActivities();
    case "materiales-cambios-estado":
      return buildMaterialesCambiosEstadoActivities();
    case "sonido-vibracion":
      return buildSonidoVibracionActivities();
    case "cielo-fenomenos-atmosfericos":
      return buildCieloFenomenosAtmosfericosActivities();
    case "seres-vivos-comparacion":
      return buildSeresVivosComparacionActivities();
    case "materiales-informes":
      return buildMaterialesInformesActivities();
    case "fenomenos-fisicos-integracion":
      return buildFenomenosFisicosIntegracionActivities();
    case "tiempo-orientacion":
      return buildTiempoOrientacionActivities();
    case "paisajes-urbano-rural":
      return buildPaisajesUrbanoRuralActivities();
    case "sociedad-colonial":
      return buildSociedadColonialActivities();
    case "autoridades-convivencia":
      return buildAutoridadesConvivenciaActivities();
    case "circuitos-productivos":
      return buildCircuitosProductivosActivities();
    case "patrimonio-cambios":
      return buildPatrimonioCambiosActivities();
    case "gobierno-municipal":
      return buildGobiernoMunicipalActivities();
    case "transporte-ambiente":
      return buildTransporteAmbienteActivities();
    case "linea-tiempo-historica":
      return buildLineaTiempoHistoricaActivities();
    case "diversidad-ciudadania":
      return buildDiversidadCiudadaniaActivities();
    default:
      return [];
  }
}
