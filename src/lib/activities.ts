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

function buildTableActivities(table: number): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  const multiplierPlan = [2, 3, 4, 5, 6, 7]; // primeras 6 actividades: multiplicaciones simples crecientes
  multiplierPlan.forEach((m, idx) => {
    acts.push(
      mcFromAnswer(
        `tabla-${table}-${idx}`,
        `Actividad ${idx + 1}`,
        `¿Cuánto es ${table} × ${m}?`,
        table * m,
        `Pista: sumá ${table} un total de ${m} veces.`
      )
    );
  });

  // Actividad 7: repaso completo y aleatorio de toda la tabla
  const facts = shuffle(
    Array.from({ length: 10 }, (_, i) => ({ a: table, b: i + 1 }))
  );
  acts.push({
    type: "full-table-review",
    id: `tabla-${table}-review`,
    title: "Actividad 7: repasá toda la tabla",
    table,
    facts,
    hint: `Pista: la tabla del ${table} va sumando ${table} cada vez (${table}, ${table * 2}, ${table * 3}...).`,
  });

  // Actividad 8: problema con la tabla
  const groups = randInt(3, 9);
  acts.push({
    type: "input",
    id: `tabla-${table}-problema`,
    title: "Actividad 8: situación problemática",
    prompt: `Hay ${groups} grupos con ${table} elementos cada uno. ¿Cuántos elementos hay en total?`,
    answer: groups * table,
    hint: `Pista: multiplicá ${groups} × ${table}.`,
  });

  // Actividad 9: contra el reloj (3 preguntas rápidas)
  const quick = shuffle(Array.from({ length: 10 }, (_, i) => i + 1)).slice(0, 3);
  acts.push({
    type: "timed",
    id: `tabla-${table}-reloj`,
    title: "Actividad 9: contra el reloj",
    seconds: 30,
    questions: quick.map((m) => {
      const correct = table * m;
      const choicesSet = new Set<number>([correct]);
      while (choicesSet.size < 3) {
        const c = correct + randInt(-4, 4);
        if (c >= 0 && c !== correct) choicesSet.add(c);
      }
      const choices = shuffle(Array.from(choicesSet));
      return {
        prompt: `${table} × ${m} = ?`,
        choices: choices.map(String),
        answerIndex: choices.indexOf(correct),
      };
    }),
    hint: `Pista: usá la tabla del ${table} que ya repasaste.`,
  });

  // Actividad 10: desafío final (multiplicador más grande / mezcla)
  const finalM = randInt(8, 10);
  acts.push(
    mcFromAnswer(
      `tabla-${table}-final`,
      "Actividad 10: desafío final",
      `Desafío final: ¿cuánto es ${table} × ${finalM}?`,
      table * finalM,
      `Pista: multiplicá ${table} × ${finalM}.`,
      8
    )
  );

  return acts;
}

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
    [18, 3],
    [20, 4],
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
  return acts;
}

function buildGeometriaActivities(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  const objetos: { nombre: string; shape: ShapeKind }[] = [
    { nombre: "una pelota", shape: "circulo" },
    { nombre: "una ventana cuadrada", shape: "cuadrado" },
    { nombre: "la puerta del aula", shape: "rectangulo" },
    { nombre: "una porción de pizza", shape: "triangulo" },
    { nombre: "un reloj de pared", shape: "circulo" },
    { nombre: "el pizarrón", shape: "rectangulo" },
    { nombre: "una baldosa cuadrada", shape: "cuadrado" },
    { nombre: "una bandera de triángulos", shape: "triangulo" },
    { nombre: "una rueda de bicicleta", shape: "circulo" },
    { nombre: "una hoja de carpeta", shape: "rectangulo" },
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
  return acts;
}

function buildProblemasActivities(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  const plantillas: ((n: number) => {
    prompt: string;
    answer: number;
    hint: string;
  })[] = [
    (n) => ({
      prompt: `En el aula hay ${n} varones y ${n + 3} mujeres. ¿Cuántos estudiantes hay en total?`,
      answer: n + (n + 3),
      hint: `Pista: sumá ${n} + ${n + 3}.`,
    }),
    (n) => ({
      prompt: `La maestra tenía ${n + 10} lápices y repartió ${n}. ¿Cuántos lápices le quedan?`,
      answer: 10,
      hint: `Pista: restá ${n + 10} - ${n}.`,
    }),
    (n) => ({
      prompt: `Cada mesa tiene ${n} sillas. Si hay 4 mesas, ¿cuántas sillas hay en total?`,
      answer: n * 4,
      hint: `Pista: multiplicá ${n} × 4.`,
    }),
    (n) => ({
      prompt: `Tenías ${n} figuritas, tu amigo te regaló ${n}. ¿Cuántas figuritas tenés ahora?`,
      answer: n * 2,
      hint: `Pista: sumá ${n} + ${n}.`,
    }),
    (n) => ({
      prompt: `En la huerta hay ${n + 5} tomates y se cosecharon ${n}. ¿Cuántos tomates quedan?`,
      answer: 5,
      hint: `Pista: restá ${n + 5} - ${n}.`,
    }),
  ];
  for (let idx = 0; idx < 10; idx++) {
    const n = randInt(3, 12);
    const plantilla = plantillas[idx % plantillas.length](n);
    acts.push({
      type: "input",
      id: `problema-${idx}`,
      title: `Actividad ${idx + 1}`,
      prompt: plantilla.prompt,
      answer: plantilla.answer,
      hint: plantilla.hint,
    });
  }
  return acts;
}

function buildNumerosGrandesActivities(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  for (let idx = 0; idx < 10; idx++) {
    const digits = idx < 5 ? 2 : 3; // primeras 5: dos cifras, siguientes: tres cifras
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
  return acts;
}

export function buildActivitiesForWorld(world: WorldDef): ActivitySpec[] {
  switch (world.category) {
    case "tabla":
      return buildTableActivities(world.table ?? 1);
    case "reparto":
      return buildRepartoActivities();
    case "geometria":
      return buildGeometriaActivities();
    case "problemas":
      return buildProblemasActivities();
    case "numeros-grandes":
      return buildNumerosGrandesActivities();
    default:
      return [];
  }
}
