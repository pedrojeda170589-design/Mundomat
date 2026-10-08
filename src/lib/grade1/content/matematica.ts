// Actividades de Matemática de 1.º grado. Se generan con números al azar
// dentro del rango de cada mundo (variables pedagógicas: cantidad de
// elementos, rango numérico, opciones), así cada vuelta es distinta.
import type { ActivityCard, ActivitySpec } from "@/lib/activities";
import { WorldDef } from "@/types";
import { Q, fromBank, numberChoices, numberWord, numbered, pickOne, q, randInt, sample, shuffle } from "./util";

// Fila de 10 (la decena del número) para mirar la serie: «la fila del 10»,
// «la fila del 20»… En 1.º se muestra toda la secuencia (pedido de Pedro).
function filaDe(n: number, marcar: number[] = [n], ocultar: number[] = []) {
  const desde = Math.floor(n / 10) * 10;
  return { tipo: "fila" as const, desde, hasta: desde + 9, marcar, ocultar, titulo: `La fila del ${desde}` };
}

const OBJ = ["🍎", "⭐", "🐟", "🎈", "🧸", "🌸", "🚗", "🐑", "🍪", "⚽", "🐧", "🦙"];

function numCards(nums: number[], say = true): ActivityCard[] {
  return nums.map((n) => ({ id: String(n), big: String(n), say: say ? numberWord(n) : undefined }));
}

function countAct(id: string, max: number, min = 1, prompt = "¿Cuántos hay?"): ActivitySpec {
  const n = randInt(min, max);
  return {
    type: "count",
    id,
    title: "",
    prompt,
    emoji: pickOne(OBJ),
    groups: [n],
    answer: n,
    choices: numberChoices(n, 3, 1, Math.max(max + 1, 4)),
    hint: "Pista: tocá cada uno con el dedo mientras contás, sin saltear ninguno.",
    skills: ["m-conteo", "m-cantidades"],
  };
}

// Tocá el número que escuchás.
function hearNumber(id: string, max: number, min = 0): ActivitySpec {
  const n = randInt(min, max);
  return {
    type: "pick",
    id,
    title: "",
    prompt: "Escuchá y tocá el número.",
    say: `Tocá el ${numberWord(n)}.`,
    cards: numCards(numberChoices(n, 3, min, max), false),
    answerIds: [String(n)],
    hint: `Pista: tocá 🔊 para escuchar el número otra vez.`,
    skills: [max <= 10 ? "m-numeros-10" : "m-numeros-100"],
  };
}

// Número → cantidad (elegir la colección que tiene ese número).
function numberToSet(id: string, max: number): ActivitySpec {
  const n = randInt(1, max);
  const e = pickOne(OBJ);
  const opts = numberChoices(n, 3, 1, max);
  return {
    type: "pick",
    id,
    title: "",
    prompt: `¿Dónde hay ${n}?`,
    promptBig: String(n),
    say: `¿Dónde hay ${numberWord(n)}?`,
    cards: opts.map((k) => ({ id: String(k), big: e.repeat(k), say: numberWord(k) })),
    answerIds: [String(n)],
    hint: "Pista: contá los dibujos de cada tarjeta.",
    skills: ["m-numeros-10", "m-conteo"],
  };
}

function compareSets(id: string, max: number, which: "mas" | "menos"): ActivitySpec {
  let a = randInt(1, max);
  let b = randInt(1, max);
  while (b === a) b = randInt(1, max);
  const e = pickOne(OBJ);
  const target = which === "mas" ? Math.max(a, b) : Math.min(a, b);
  [a, b] = shuffle([a, b]) as [number, number];
  return {
    type: "pick",
    id,
    title: "",
    prompt: which === "mas" ? "¿Dónde hay más?" : "¿Dónde hay menos?",
    cards: [a, b].map((k) => ({ id: String(k), big: e.repeat(k) })),
    answerIds: [String(target)],
    hint: "Pista: contá cada grupo o uní de a uno: el que sobra tiene más.",
    skills: ["m-comparar"],
  };
}

function compareNumbers(id: string, max: number): ActivitySpec {
  const [a, b] = sample(Array.from({ length: max }, (_, i) => i + 1), 2);
  return {
    type: "pick",
    id,
    title: "",
    prompt: "¿Cuál es el número mayor?",
    cards: numCards([a, b]),
    apoyo: { tipo: "recta", desde: 0, hasta: max, marcar: [a, b], etiquetasCada: max > 10 ? 5 : 1 },
    answerIds: [String(Math.max(a, b))],
    hint: "Pista: el mayor está más lejos en la fila de números.",
    skills: ["m-comparar"],
  };
}

function afterBefore(id: string, max: number, kind: "despues" | "antes"): ActivitySpec {
  const n = randInt(kind === "antes" ? 1 : 0, kind === "antes" ? max : max - 1);
  const ans = kind === "despues" ? n + 1 : n - 1;
  return {
    type: "pick",
    id,
    title: "",
    prompt: kind === "despues" ? `¿Qué número viene después del ${n}?` : `¿Qué número viene antes del ${n}?`,
    cards: numCards(numberChoices(ans, 3, 0, max + 1)),
    apoyo:
      Math.floor(ans / 10) === Math.floor(n / 10)
        ? filaDe(n)
        : { tipo: "fila", desde: Math.max(0, Math.min(n, ans) - 4), hasta: Math.max(n, ans) + 4, marcar: [n] },
    answerIds: [String(ans)],
    hint: kind === "despues" ? "Pista: después es uno más." : "Pista: antes es uno menos.",
    skills: ["m-orden"],
  };
}

function missingInRow(id: string, max: number, step = 1): ActivitySpec {
  const start = randInt(0, Math.max(0, max - step * 4)) - (randInt(0, max) % step);
  const s0 = Math.max(0, start - (start % step));
  const row = [0, 1, 2, 3].map((k) => s0 + k * step);
  const hole = randInt(1, 3);
  const ans = row[hole];
  return {
    type: "pick",
    id,
    title: "",
    prompt: "¿Qué número falta?",
    cards: numCards(numberChoices(ans, 3, 0, max + step).map((x) => x)),
    apoyo: { tipo: "fila", desde: row[0], hasta: row[3], paso: step, ocultar: [ans], titulo: step === 1 ? "Contá de a uno" : `De ${step} en ${step}` },
    answerIds: [String(ans)],
    hint: step === 1 ? "Pista: contá de a uno desde el primero." : `Pista: van de ${step} en ${step}.`,
    skills: step === 1 ? ["m-orden"] : ["m-numeros-100", "m-patrones"],
  };
}

function orderNumbers(id: string, max: number): ActivitySpec {
  const nums = sample(Array.from({ length: max }, (_, i) => i + 1), 4);
  const items = shuffle(nums.map(String));
  const sorted = [...nums].sort((a, b) => a - b).map(String);
  return {
    type: "order",
    id,
    title: "",
    prompt: "Ordená de menor a mayor.",
    apoyo: { tipo: "recta", desde: 0, hasta: max, etiquetasCada: max > 10 ? 5 : 1, titulo: "Los números en la recta: el menor está más cerca del 0" },
    items,
    correctOrder: sorted.map((s) => items.indexOf(s)),
    hint: "Pista: buscá primero el más chico.",
    skills: ["m-orden"],
  };
}

function addStory(id: string, max: number): ActivitySpec {
  const a = randInt(1, Math.max(1, max - 1));
  const b = randInt(1, max - a);
  const e = pickOne(OBJ);
  const story = pickOne([
    `Tenía ${a} y me regalaron ${b}. ¿Cuántos tengo ahora?`,
    `En una caja hay ${a} y en otra ${b}. ¿Cuántos hay en total?`,
    `Juan juntó ${a} y Sofía ${b}. ¿Cuántos juntaron entre los dos?`,
  ]);
  return {
    type: "count",
    id,
    title: "",
    prompt: story,
    emoji: e,
    groups: [a, b],
    answer: a + b,
    choices: numberChoices(a + b, 3, 1, max + 2),
    hint: "Pista: juntá los dos grupos y contá todo.",
    skills: ["m-suma", "m-problemas"],
  };
}

function subStory(id: string, max: number): ActivitySpec {
  const a = randInt(3, max);
  const b = randInt(1, a - 1);
  const e = pickOne(OBJ);
  return {
    type: "count",
    id,
    title: "",
    prompt: pickOne([
      `Había ${a}. Se fueron ${b}. ¿Cuántos quedan?`,
      `Tenía ${a} y perdí ${b}. ¿Cuántos me quedan?`,
      `Hay ${a} en la mesa y comimos ${b}. ¿Cuántos quedan?`,
    ]),
    emoji: e,
    groups: [a],
    crossed: b,
    answer: a - b,
    choices: numberChoices(a - b, 3, 0, max),
    hint: "Pista: contá solo los que no están tachados.",
    skills: ["m-resta", "m-problemas"],
  };
}

function calcPick(id: string, a: number, op: "+" | "−", b: number, skill: string, hint: string): ActivitySpec {
  const ans = op === "+" ? a + b : a - b;
  return {
    type: "pick",
    id,
    title: "",
    prompt: "¿Cuánto da?",
    promptBig: `${a} ${op} ${b}`,
    say: `¿Cuánto es ${numberWord(a)} ${op === "+" ? "más" : "menos"} ${numberWord(b)}?`,
    apoyo:
      Math.max(a, ans) <= 20
        ? { tipo: "recta", desde: 0, hasta: Math.max(10, a, ans), marcar: [a], salto: { desde: a, cantidad: op === "+" ? b : -b } }
        : { tipo: "recta", desde: 0, hasta: Math.ceil(Math.max(a, ans) / 10) * 10, paso: 10, marcar: [a] },
    cards: numCards(numberChoices(ans, 3, 0, 100)),
    answerIds: [String(ans)],
    hint,
    skills: [skill],
  };
}

function composeTen(id: string, total = 10): ActivitySpec {
  const a = randInt(1, total - 1);
  return {
    type: "pick",
    id,
    title: "",
    prompt: `¿Cuántos faltan para llegar a ${total}?`,
    promptBig: `${"🔵".repeat(a)}${"⚪".repeat(total - a)}`,
    say: `Hay ${numberWord(a)}. ¿Cuántos faltan para ${numberWord(total)}?`,
    cards: numCards(numberChoices(total - a, 3, 0, total)),
    answerIds: [String(total - a)],
    hint: "Pista: contá los círculos blancos.",
    skills: ["m-composicion"],
  };
}

function tensAndOnes(id: string): ActivitySpec {
  const d = randInt(1, 6);
  const u = randInt(0, 9);
  const n = d * 10 + u;
  return {
    type: "pick",
    id,
    title: "",
    prompt: `Hay ${d} ${d === 1 ? "billete" : "billetes"} de $10 y ${u} ${u === 1 ? "moneda" : "monedas"} de $1. ¿Cuánta plata es?`,
    apoyo: { tipo: "dinero", piezas: [{ valor: 10, cantidad: d }, { valor: 1, cantidad: u }] },
    cards: numCards(
      shuffle([
        n,
        ...shuffle([...new Set([u * 10 + d, d + u, n + 10, n - 1])].filter((x) => x > 0 && x <= 99 && x !== n)).slice(0, 2),
      ])
    ),
    answerIds: [String(n)],
    hint: "Pista: contá de 10 en 10 los billetes y después sumá las monedas.",
    skills: ["m-numeros-100", "m-dinero", "m-composicion"],
  };
}

function hundredChart(id: string): ActivitySpec {
  const n = randInt(11, 89);
  const kind = pickOne(["abajo", "arriba", "derecha"] as const);
  const ans = kind === "abajo" ? n + 10 : kind === "arriba" ? n - 10 : n + 1;
  return {
    type: "pick",
    id,
    title: "",
    prompt: `En el cuadro de números, ¿qué número está ${kind === "derecha" ? "a la derecha" : kind} del ${n}?`,
    apoyo: { tipo: "cuadro", desde: Math.max(0, Math.floor(n / 10) * 10 - 10), hasta: Math.min(99, Math.floor(n / 10) * 10 + 19), marcar: [n], titulo: "El cuadro de números" },
    cards: numCards(shuffle([ans, kind === "derecha" ? n + 10 : n + 1, kind === "arriba" ? n + 10 : n - 1])),
    answerIds: [String(ans)],
    hint: "Pista: hacia abajo se suma 10, hacia arriba se resta 10, a la derecha se suma 1.",
    skills: ["m-numeros-100", "m-patrones"],
  };
}

function buildNumber(id: string, max: number): ActivitySpec {
  const n = randInt(10, max);
  const digits = String(n).split("");
  const extra = sample(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].filter((d) => !digits.includes(d)), 2);
  return {
    type: "build",
    id,
    title: "",
    prompt: `Escribí el número ${numberWord(n)}.`,
    say: `Escribí el número ${numberWord(n)}.`,
    target: digits,
    tiles: shuffle([...digits, ...extra]),
    apoyo: { tipo: "bloques", n },
    hint: `Pista: ${numberWord(n)} empieza con ${numberWord(Math.floor(n / 10) * 10)}.`,
    skills: ["m-numeros-100"],
  };
}

function groupsEqual(id: string): ActivitySpec {
  const g = randInt(2, 4);
  const k = randInt(2, 5);
  return {
    type: "count",
    id,
    title: "",
    prompt: `Hay ${g} platos con ${k} en cada uno. ¿Cuántos hay en total?`,
    emoji: pickOne(OBJ),
    groups: Array.from({ length: g }, () => k),
    answer: g * k,
    choices: numberChoices(g * k, 3, 1, 30),
    hint: `Pista: sumá ${Array.from({ length: g }, () => k).join(" + ")}.`,
    skills: ["m-suma", "m-problemas"],
  };
}

function shareAct(id: string): ActivitySpec {
  const kids = randInt(2, 3);
  const each = randInt(2, 4);
  const total = kids * each;
  return {
    type: "pick",
    id,
    title: "",
    prompt: `Hay ${total} caramelos para ${kids} chicos. Si todos reciben lo mismo, ¿cuántos le tocan a cada uno?`,
    promptBig: "🍬".repeat(total),
    cards: numCards(numberChoices(each, 3, 1, total)),
    answerIds: [String(each)],
    hint: `Pista: repartí de a uno: uno para cada chico, otra vuelta… hasta que no queden.`,
    skills: ["m-problemas"],
  };
}

function shopAct(id: string): ActivitySpec {
  const items: [string, string, number][] = [
    ["🧃", "un jugo", randInt(2, 6)],
    ["🍪", "una galletita", randInt(1, 5)],
    ["🍬", "un caramelo", randInt(1, 3)],
    ["🥖", "un pan", randInt(3, 8)],
  ];
  const [a, b] = sample(items, 2);
  const total = a[2] + b[2];
  return {
    type: "pick",
    id,
    title: "",
    prompt: `En el almacén: ${a[1]} cuesta $${a[2]} y ${b[1]}, $${b[2]}. ¿Cuánto pago por los dos?`,
    promptBig: `${a[0]} $${a[2]}   ${b[0]} $${b[2]}`,
    cards: numCards(numberChoices(total, 3, 1, 20)).map((c) => ({ ...c, big: `$${c.big}` })),
    answerIds: [String(total)],
    hint: "Pista: sumá los dos precios.",
    skills: ["m-dinero", "m-problemas"],
  };
}

function boardGame(id: string): ActivitySpec {
  const pos = randInt(2, 15);
  const d = randInt(1, 6);
  const fwd = Math.random() < 0.6;
  const ans = fwd ? pos + d : Math.max(0, pos - d);
  return {
    type: "pick",
    id,
    title: "",
    prompt: `Estoy en el casillero ${pos} y ${fwd ? "avanzo" : "retrocedo"} ${d}. ¿En qué casillero quedo?`,
    promptBig: `🎲 ${"⚀⚁⚂⚃⚄⚅"[d - 1]}`,
    apoyo: { tipo: "fila", desde: 0, hasta: 24, marcar: [pos], titulo: "El tablero" },
    cards: numCards(numberChoices(ans, 3, 0, 25)),
    answerIds: [String(ans)],
    hint: fwd ? "Pista: avanzar es contar hacia adelante." : "Pista: retroceder es contar hacia atrás.",
    skills: [fwd ? "m-suma" : "m-resta", "m-orden"],
  };
}

const SPACE_ITEMS: [string, string][] = [["🐱", "gato"], ["🐶", "perro"], ["⚽", "pelota"], ["🐦", "pájaro"]];
function positionAct(id: string): ActivitySpec {
  const [e, name] = pickOne(SPACE_ITEMS);
  const ref = pickOne(["📦", "🪑", "🌳"]);
  const refName = ref === "📦" ? "la caja" : ref === "🪑" ? "la silla" : "el árbol";
  const layouts: Record<string, string> = {
    arriba: `${e}\n${ref}`,
    abajo: `${ref}\n${e}`,
    "al lado": `${ref} ${e}`,
  };
  const target = pickOne(Object.keys(layouts));
  return {
    type: "pick",
    id,
    title: "",
    prompt: `¿En cuál está el ${name} ${target === "al lado" ? "al lado de" : target === "arriba" ? "arriba de" : "abajo de"} ${refName}?`,
    cards: shuffle(Object.entries(layouts).map(([k, v]) => ({ id: k, big: v }))),
    answerIds: [target],
    hint: "Pista: mirá dónde está el dibujo comparado con el otro.",
    skills: ["m-espacio"],
  };
}

const ESPACIO_BANK: Q[] = [
  q("Para ir de 🏠 a 🏫 doblo a la derecha. ¿Hacia dónde apunta la flecha?", [["➡️", "Derecha"], ["⬅️", "Izquierda"], ["⬆️", "Arriba"]], 0, "Pista: la derecha es la mano con la que muchos escriben."),
  q("En un plano, todo se dibuja visto…", [["⬇️", "Desde arriba"], ["↔️", "De costado"], ["🙃", "Al revés"]], 0, "Pista: como lo vería un pájaro volando."),
  q("Si camino hacia adelante y me doy vuelta, ¿qué queda adelante?", [["🔙", "Lo que estaba atrás"], ["⬆️", "El cielo"], ["🙈", "Nada"]], 0, "Pista: probalo en el aula."),
  q("¿Qué usamos para encontrar un lugar en el pueblo?", [["🗺️", "Un plano"], ["📖", "Un cuento"], ["🧮", "Un ábaco"]], 0, "Pista: tiene calles dibujadas."),
  q("La pelota está entre dos sillas. ¿Cuál lo muestra?", [["🪑⚽🪑", "Entre"], ["⚽🪑🪑", "Al costado"], ["🪑🪑⚽", "Al final"]], 0, "Pista: «entre» es en el medio."),
  q("Para llegar al tesoro: 2 pasos adelante y 1 a la derecha. ¿Cuántos pasos en total?", [["3️⃣", "3"], ["2️⃣", "2"], ["4️⃣", "4"]], 0, "Pista: sumá los pasos."),
];

const FIGURAS_BANK: Q[] = [
  q("¿Cuál tiene bordes curvos?", [["⚪", "Círculo"], ["🟥", "Cuadrado"], ["🔺", "Triángulo"]], 0, "Pista: no tiene puntas."),
  q("¿Cuál tiene 3 lados?", [["🔺", "Triángulo"], ["🟦", "Cuadrado"], ["⚪", "Círculo"]], 0, "Pista: contá las puntas."),
  q("¿Cuál tiene 4 lados iguales?", [["🟩", "Cuadrado"], ["🔺", "Triángulo"], ["⚪", "Círculo"]], 0, "Pista: todos sus lados miden lo mismo."),
  q("¿Qué figura tiene la forma de una ventana?", [["🟦", "Cuadrado"], ["⚪", "Círculo"], ["🔺", "Triángulo"]], 0, "Pista: mirá las ventanas del aula."),
  q("¿Qué figura tiene una rueda?", [["⚪", "Círculo"], ["🟥", "Cuadrado"], ["🔺", "Triángulo"]], 0, "Pista: las ruedas giran."),
  q("¿Cuántas puntas (vértices) tiene un triángulo?", [["3️⃣", "3"], ["4️⃣", "4"], ["0️⃣", "0"]], 0, "Pista: tri- quiere decir tres."),
  q("Tocá todas las figuras con lados rectos.", [["🟥", "Cuadrado"], ["🔺", "Triángulo"], ["⚪", "Círculo"]], [0, 1], "Pista: el círculo es curvo."),
  q("¿Qué figura tiene la porción de pizza?", [["🍕", "Triángulo"], ["⚪", "Círculo"], ["🟦", "Cuadrado"]], 0, "Pista: tiene tres lados."),
];

const CUERPOS_BANK: Q[] = [
  q("¿Cuál rueda?", [["⚽", "Pelota (esfera)"], ["🎲", "Dado (cubo)"], ["📦", "Caja (prisma)"]], 0, "Pista: no tiene caras planas."),
  q("¿Qué cuerpo tiene la forma de un dado?", [["🎲", "Cubo"], ["⚽", "Esfera"], ["🥫", "Cilindro"]], 0, "Pista: todas sus caras son cuadradas."),
  q("Una lata de tomates tiene forma de…", [["🥫", "Cilindro"], ["🎲", "Cubo"], ["⚽", "Esfera"]], 0, "Pista: tiene dos caras redondas."),
  q("¿Cuál se puede apilar fácil?", [["📦", "Caja"], ["⚽", "Pelota"], ["🥚", "Huevo"]], 0, "Pista: tiene caras planas."),
  q("¿Cuántas caras tiene un cubo?", [["6️⃣", "6"], ["4️⃣", "4"], ["3️⃣", "3"]], 0, "Pista: un dado tiene números del 1 al 6."),
  q("Tocá todos los que tienen alguna cara redonda.", [["🥫", "Lata"], ["⚽", "Pelota"], ["📦", "Caja"]], [0, 1], "Pista: la caja tiene todas sus caras planas."),
];

const MEDIDA_BANK: Q[] = [
  q("¿Cuál es más largo?", [["🐍", "Víbora"], ["🐛", "Gusano"]], 0, "Pista: imaginá los dos estirados uno al lado del otro."),
  q("¿Cuál pesa más?", [["🐘", "Elefante"], ["🐭", "Ratón"]], 0, "Pista: ¿cuál te costaría más levantar?"),
  q("¿Dónde entra más agua?", [["🪣", "Balde"], ["🥄", "Cuchara"]], 0, "Pista: ¿cuál es más grande por dentro?"),
  q("¿Con qué medimos el largo de la mesa sin regla?", [["✋", "Con cuartas de la mano"], ["👂", "Con la oreja"], ["👃", "Con la nariz"]], 0, "Pista: usamos partes del cuerpo como unidad."),
  q("¿Cuál es más alto?", [["🦒", "Jirafa"], ["🐕", "Perro"]], 0, "Pista: tiene el cuello muy largo."),
  q("¿Cuál es más liviano?", [["🪶", "Pluma"], ["🪨", "Piedra"]], 0, "Pista: el viento lo puede volar."),
  q("¿Qué usamos para pesar?", [["⚖️", "Balanza"], ["📏", "Regla"], ["⏰", "Reloj"]], 0, "Pista: en la verdulería la usan."),
  q("¿Qué usamos para saber la hora?", [["⏰", "Reloj"], ["⚖️", "Balanza"], ["📏", "Regla"]], 0, "Pista: hace tic tac."),
];

const DIAS = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];
const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

function calendarWorld(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  for (let k = 0; k < 3; k++) {
    const i = randInt(0, 6);
    const next = DIAS[(i + 1) % 7];
    acts.push({
      type: "pick",
      id: `dia-${k}`,
      title: "",
      prompt: `¿Qué día viene después del ${DIAS[i]}?`,
      cards: shuffle([next, DIAS[(i + 3) % 7], DIAS[(i + 6) % 7]]).map((d) => ({ id: d, label: d, say: d, emoji: "📅" })),
      answerIds: [next],
      hint: "Pista: decí los días de la semana en orden.",
      skills: ["m-medida", "m-orden"],
    });
  }
  const start = randInt(0, 3);
  const seq = DIAS.slice(start, start + 4);
  const items = shuffle(seq);
  acts.push({
    type: "order",
    id: "dias-orden",
    title: "",
    prompt: "Ordená los días de la semana.",
    items,
    correctOrder: seq.map((s) => items.indexOf(s)),
    hint: "Pista: la semana empieza el lunes.",
    skills: ["m-medida", "m-orden"],
  });
  const m = randInt(0, 10);
  acts.push({
    type: "pick",
    id: "mes",
    title: "",
    prompt: `¿Qué mes viene después de ${MESES[m]}?`,
    cards: shuffle([MESES[m + 1], MESES[(m + 4) % 12], MESES[(m + 8) % 12]]).map((d) => ({ id: d, label: d, say: d, emoji: "🗓️" })),
    answerIds: [MESES[m + 1]],
    hint: "Pista: el año empieza en enero.",
    skills: ["m-medida", "m-orden"],
  });
  acts.push(
    ...fromBank(
      [
        q("¿Cuántos días tiene una semana?", [["7️⃣", "7"], ["5️⃣", "5"], ["🔟", "10"]], 0, "Pista: contá de lunes a domingo."),
        q("¿Qué días no hay escuela?", [["🛌", "Sábado y domingo"], ["📚", "Lunes y martes"], ["🎒", "Jueves y viernes"]], 0, "Pista: es el fin de semana."),
        q("¿Cuántos meses tiene un año?", [["1️⃣2️⃣", "12"], ["7️⃣", "7"], ["3️⃣0️⃣", "30"]], 0, "Pista: de enero a diciembre."),
      ],
      3,
      "cal",
      ["m-medida"]
    )
  );
  return acts;
}

const PARA_QUE_BANK: Q[] = [
  q("¿Dónde miramos un número para saber la hora?", [["⏰", "Reloj"], ["🧦", "Media"], ["🍎", "Manzana"]], 0, "Pista: hace tic tac."),
  q("¿Qué número nos dice qué colectivo tomar?", [["🚌", "El del colectivo"], ["👟", "El de la zapatilla"], ["🌳", "El del árbol"]], 0, "Pista: está adelante del colectivo."),
  q("¿Dónde vemos el número de la fecha?", [["📅", "Calendario"], ["🪥", "Cepillo"], ["🧸", "Oso"]], 0, "Pista: tiene días y meses."),
  q("¿Para qué sirve el número de la casa?", [["🏠", "Para encontrarla"], ["🍰", "Para comerla"], ["🎵", "Para cantar"]], 0, "Pista: el cartero lo necesita."),
  q("¿Dónde vemos números que dicen cuánto cuesta algo?", [["🏷️", "Precio"], ["🎈", "Globo"], ["🌙", "Luna"]], 0, "Pista: está pegado en la mercadería."),
  q("¿Qué usamos para llamar a alguien?", [["📞", "Número de teléfono"], ["📏", "Regla"], ["🖍️", "Crayón"]], 0, "Pista: se marca en el celular."),
  q("¿Qué número dice cuántos años cumplís?", [["🎂", "El de las velitas"], ["🚗", "El de la patente"], ["⏰", "El del reloj"]], 0, "Pista: lo soplás en tu cumpleaños."),
  q("Tocá todos los que tienen números.", [["⏰", "Reloj"], ["📅", "Calendario"], ["🌸", "Flor"]], [0, 1], "Pista: hay dos."),
];

const CALC_REPERTORIO: [number, "+" | "−", number, string][] = [
  [2, "+", 2, "Pista: es un doble."], [3, "+", 3, "Pista: es un doble."], [4, "+", 4, "Pista: es un doble."], [5, "+", 5, "Pista: es un doble: 5 dedos y 5 dedos."],
  [6, "+", 1, "Pista: sumar 1 es el número que sigue."], [8, "+", 1, "Pista: sumar 1 es el número que sigue."], [9, "−", 1, "Pista: restar 1 es el número de antes."],
  [7, "+", 3, "Pista: 7 y 3 hacen 10."], [6, "+", 4, "Pista: 6 y 4 hacen 10."], [10, "+", 5, "Pista: diez y cinco: quince."], [10, "+", 3, "Pista: diez y tres: trece."],
  [20, "+", 10, "Pista: sumar 10 cambia solo los dieces."], [10, "−", 5, "Pista: la mitad de 10."],
];

// --------------------------------------------------------------------------

export function buildMatematicaActivities(world: WorldDef): ActivitySpec[] {
  const n = world.worldNumber ?? 0;
  const R = world.difficultyVars?.numberRange ?? 10;
  const acts: ActivitySpec[] = [];
  const rep = (k: number, f: (i: number) => ActivitySpec) => {
    for (let i = 0; i < k; i++) acts.push(f(i));
  };
  switch (n) {
    case 1: acts.push(...fromBank(PARA_QUE_BANK, 6, "pq", ["m-numeros-10"])); rep(2, (i) => hearNumber(`h-${i}`, 10)); break;
    case 2: rep(5, (i) => countAct(`c-${i}`, 5)); rep(3, (i) => compareSets(`cmp-${i}`, 5, i % 2 ? "menos" : "mas")); break;
    case 3: rep(6, (i) => countAct(`c-${i}`, 10, 3)); rep(2, (i) => numberToSet(`ns-${i}`, 10)); break;
    case 4: rep(3, (i) => hearNumber(`h-${i}`, 10)); rep(3, (i) => numberToSet(`ns-${i}`, 10)); rep(2, (i) => countAct(`c-${i}`, 10)); break;
    case 5: rep(3, (i) => compareSets(`cs-${i}`, 10, i % 2 ? "menos" : "mas")); rep(3, (i) => compareNumbers(`cn-${i}`, 10)); rep(2, (i) => compareNumbers(`cn2-${i}`, 20)); break;
    case 6: rep(4, (i) => afterBefore(`ab-${i}`, 20, i % 2 ? "antes" : "despues")); rep(2, (i) => orderNumbers(`o-${i}`, 20)); rep(2, (i) => missingInRow(`m-${i}`, 20)); break;
    case 7: rep(4, (i) => missingInRow(`m-${i}`, 20)); rep(2, (i) => orderNumbers(`o-${i}`, 20)); rep(2, (i) => hearNumber(`h-${i}`, 20)); break;
    case 8: rep(3, (i) => hearNumber(`h-${i}`, 30, 10)); rep(2, (i) => missingInRow(`m-${i}`, 30)); rep(2, (i) => buildNumber(`b-${i}`, 30)); acts.push(compareNumbers("cn", 30)); break;
    case 9: rep(3, (i) => hundredChart(`hc-${i}`)); rep(2, (i) => missingInRow(`m10-${i}`, 90, 10)); rep(2, (i) => buildNumber(`b-${i}`, 99)); acts.push(hearNumber("h", 99, 30)); break;
    case 10: rep(5, (i) => tensAndOnes(`to-${i}`)); rep(3, (i) => buildNumber(`b-${i}`, 69)); break;
    case 11: rep(6, (i) => composeTen(`ct-${i}`)); rep(2, (i) => composeTen(`c5-${i}`, 5)); break;
    case 12: rep(6, (i) => addStory(`as-${i}`, 10)); rep(2, (i) => calcPick(`ac-${i}`, randInt(1, 5), "+", randInt(1, 4), "m-suma", "Pista: contá para adelante desde el número más grande.")); break;
    case 13: rep(6, (i) => subStory(`ss-${i}`, 10)); rep(2, (i) => { const a = randInt(4, 10); return calcPick(`sc-${i}`, a, "−", randInt(1, a - 1), "m-resta", "Pista: contá para atrás."); }); break;
    case 14: rep(8, (i) => boardGame(`bg-${i}`)); break;
    case 15: for (const [a, op, b, h] of sample(CALC_REPERTORIO, 8)) acts.push(calcPick(`cr-${a}${op}${b}`, a, op, b, "m-calculo-mental", h)); break;
    case 16: rep(8, (i) => groupsEqual(`ge-${i}`)); break;
    case 17: rep(8, (i) => shareAct(`sh-${i}`)); break;
    case 18: rep(5, (i) => shopAct(`sp-${i}`)); rep(3, (i) => tensAndOnes(`to-${i}`)); break;
    case 19: rep(5, (i) => positionAct(`p-${i}`)); acts.push(...fromBank(ESPACIO_BANK, 3, "esp", ["m-espacio"])); break;
    case 20: acts.push(...fromBank(ESPACIO_BANK, 6, "esp", ["m-espacio"])); rep(2, (i) => positionAct(`p-${i}`)); break;
    case 21: {
      acts.push(...fromBank(FIGURAS_BANK, 6, "fig", ["m-geometria"]));
      for (const [kind, i] of [["triangulo", 0], ["cuadrado", 1]] as const) {
        const choices = shuffle(["circulo", "cuadrado", "triangulo"] as const);
        acts.push({ type: "shape-identify", id: `shp-${i}`, title: "", prompt: "¿Qué figura es?", shape: kind, choices: [...choices], answerIndex: choices.indexOf(kind), hint: "Pista: contá los lados.", skills: ["m-geometria"] });
      }
      break;
    }
    case 22: acts.push(...fromBank(CUERPOS_BANK, 6, "cue", ["m-geometria"])); acts.push(...fromBank(FIGURAS_BANK, 2, "fig", ["m-geometria"])); break;
    case 23: acts.push(...fromBank(MEDIDA_BANK, 8, "med", ["m-medida"])); break;
    case 24: acts.push(...calendarWorld()); break;
  }
  void R;
  return numbered(acts.slice(0, 10));
}
