// Actividades de Matemática de 2.º grado (28 mundos).
// Se generan de forma procedimental con números al azar dentro del rango pedagógico
// de cada mundo (hasta 1000, dobles/mitades, sumas y restas con/sin dificultad,
// tablas 2, 5, 10, reparto, geometría 2D y 3D, medidas y reloj).
import type { ActivityCard, ActivitySpec } from "@/lib/activities";
import { WorldDef } from "@/types";
import {
  numberChoices,
  numberWord,
  numbered,
  pickOne,
  q,
  randInt,
  sample,
  shuffle,
  Q,
} from "./util";

function numCards(nums: number[], say = true): ActivityCard[] {
  return nums.map((n) => ({
    id: String(n),
    big: String(n),
    say: say ? numberWord(n) : undefined,
  }));
}

// --------------------------------------------------------------------------
// Generadores específicos por mundo (1 a 28)
// --------------------------------------------------------------------------

// Mundo 1: El Cuadro del 1 al 100
function buildMundo1(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  for (let i = 0; i < 8; i++) {
    const target = randInt(10, 99);
    const d = Math.floor(target / 10) * 10;
    const u = target % 10;
    const choices = numberChoices(target, 3, 10, 99);
    acts.push({
      type: "pick",
      id: `m1-${i}`,
      title: "",
      prompt: `¿Qué número está en la fila de los ${d} y en la columna de los que terminan en ${u}?`,
      say: `Buscá el número de la fila de los ${d} que termina en ${u}.`,
      cards: numCards(choices),
      answerIds: [String(target)],
      hint: `Pista: buscá en la fila del ${d} y avanzá hasta la columna del ${u}.`,
      skills: ["m2-numeros-100"],
    });
  }
  return acts;
}

// Mundo 2: Vecinos en el Cuadro (+1, -1, +10, -10)
function buildMundo2(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  const kinds: ("mas1" | "menos1" | "mas10" | "menos10")[] = ["mas1", "menos1", "mas10", "menos10"];
  for (let i = 0; i < 8; i++) {
    const kind = kinds[i % kinds.length];
    const n = randInt(15, 85);
    let ans = n;
    let label = "";
    if (kind === "mas1") {
      ans = n + 1;
      label = `¿Quién es el vecino de la derecha de ${n} (+1)?`;
    } else if (kind === "menos1") {
      ans = n - 1;
      label = `¿Quién es el vecino de la izquierda de ${n} (-1)?`;
    } else if (kind === "mas10") {
      ans = n + 10;
      label = `¿Quién vive abajo de ${n} en el cuadro (+10)?`;
    } else {
      ans = n - 10;
      label = `¿Quién vive arriba de ${n} en el cuadro (-10)?`;
    }
    const choices = numberChoices(ans, 3, 1, 100);
    acts.push({
      type: "pick",
      id: `m2-${i}`,
      title: "",
      prompt: label,
      promptBig: String(n),
      say: label,
      cards: numCards(choices),
      answerIds: [String(ans)],
      hint: `Pista: fijate cómo cambian los dieces o los unos al moverte en el cuadro.`,
      skills: ["m2-numeros-100", "m2-calculo-mental"],
    });
  }
  return acts;
}

// Mundo 3: ¡Llegan los Cienes! (100, 200, 300... 900)
function buildMundo3(): ActivitySpec[] {
  const hundreds = [100, 200, 300, 400, 500, 600, 700, 800, 900];
  const acts: ActivitySpec[] = [];
  for (let i = 0; i < 8; i++) {
    const target = pickOne(hundreds);
    const choices = shuffle([target, ...sample(hundreds.filter((h) => h !== target), 2)]);
    acts.push({
      type: "pick",
      id: `m3-${i}`,
      title: "",
      prompt: `Escuchá y tocá el número: ${numberWord(target)}.`,
      say: `Tocá el ${numberWord(target)}.`,
      cards: numCards(choices),
      answerIds: [String(target)],
      hint: `Pista: el número tiene 3 cifras y termina con dos ceros.`,
      skills: ["m2-numeros-1000"],
    });
  }
  return acts;
}

// Mundo 4: Explorando hasta 500
function buildMundo4(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  for (let i = 0; i < 8; i++) {
    if (i % 2 === 0) {
      const n = randInt(101, 499);
      const isNext = Math.random() > 0.5;
      const ans = isNext ? n + 1 : n - 1;
      const prompt = isNext ? `¿Qué número sigue después de ${n}?` : `¿Qué número está justo antes de ${n}?`;
      const choices = numberChoices(ans, 3, 100, 500);
      acts.push({
        type: "pick",
        id: `m4-${i}`,
        title: "",
        prompt,
        promptBig: String(n),
        say: prompt,
        cards: numCards(choices),
        answerIds: [String(ans)],
        hint: `Pista: sumá o restá 1 a la última cifra.`,
        skills: ["m2-numeros-1000", "m2-comparar-ordenar"],
      });
    } else {
      const a = randInt(100, 499);
      const b = randInt(100, 499);
      const ans = Math.max(a, b);
      acts.push({
        type: "pick",
        id: `m4-${i}`,
        title: "",
        prompt: `¿Cuál de estos dos números es el mayor?`,
        cards: numCards([a, b]),
        answerIds: [String(ans)],
        hint: `Pista: mirá primero la cifra de los cienes; si son iguales, mirá los dieces.`,
        skills: ["m2-comparar-ordenar"],
      });
    }
  }
  return acts;
}

// Mundo 5: Rumbo al 1000
function buildMundo5(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  for (let i = 0; i < 8; i++) {
    const base = randInt(500, 950);
    const target = randInt(base, Math.min(base + 40, 999));
    const choices = numberChoices(target, 3, 500, 1000);
    acts.push({
      type: "pick",
      id: `m5-${i}`,
      title: "",
      prompt: `¿Cómo se escribe en números el ${numberWord(target)}?`,
      say: `Buscá el ${numberWord(target)}.`,
      cards: numCards(choices),
      answerIds: [String(target)],
      hint: `Pista: escuchá el nombre: empieza con los cienes y sigue con los dieces y unos.`,
      skills: ["m2-numeros-1000", "m2-comparar-ordenar"],
    });
  }
  return acts;
}

// Mundo 6: Cienes, Dieces y Unos (Valor posicional)
function buildMundo6(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  for (let i = 0; i < 8; i++) {
    const c = randInt(1, 9);
    const d = randInt(1, 9);
    const u = randInt(1, 9);
    const num = c * 100 + d * 10 + u;
    const kind = i % 3;
    if (kind === 0) {
      acts.push({
        type: "pick",
        id: `m6-${i}`,
        title: "",
        prompt: `En el número ${num}, ¿cuánto vale la cifra ${c}?`,
        promptBig: String(num),
        cards: numCards([c * 100, c * 10, c]),
        answerIds: [String(c * 100)],
        hint: `Pista: está en el lugar de los cienes, así que vale ${c * 100}.`,
        skills: ["m2-valor-posicional"],
      });
    } else if (kind === 1) {
      acts.push({
        type: "pick",
        id: `m6-${i}`,
        title: "",
        prompt: `En el número ${num}, ¿cuánto vale la cifra ${d}?`,
        promptBig: String(num),
        cards: numCards([d * 10, d * 100, d]),
        answerIds: [String(d * 10)],
        hint: `Pista: está en el lugar de los dieces, así que vale ${d * 10}.`,
        skills: ["m2-valor-posicional"],
      });
    } else {
      const correct = `${c * 100} + ${d * 10} + ${u}`;
      const wrong1 = `${c * 10} + ${d * 10} + ${u}`;
      const wrong2 = `${c * 100} + ${d} + ${u * 10}`;
      const opts = shuffle([correct, wrong1, wrong2]);
      acts.push({
        type: "pick",
        id: `m6-${i}`,
        title: "",
        prompt: `¿Cuál es el desarme correcto de ${num}?`,
        cards: opts.map((o) => ({ id: o, big: o })),
        answerIds: [correct],
        hint: `Pista: ${c} cienes son ${c * 100}, ${d} dieces son ${d * 10} y ${u} unos son ${u}.`,
        skills: ["m2-valor-posicional"],
      });
    }
  }
  return acts;
}

// Mundo 7: El Banco del Bosque (Dinero: $100, $10, $1)
function buildMundo7(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  for (let i = 0; i < 8; i++) {
    const c = randInt(1, 8);
    const d = randInt(1, 9);
    const u = randInt(1, 9);
    const total = c * 100 + d * 10 + u;
    const prompt = `Para pagar justo $${total}, ¿cuántos billetes de $100, de $10 y monedas de $1 necesitás?`;
    const correct = `${c} de $100, ${d} de $10 y ${u} de $1`;
    const w1 = `${c + 1} de $100, ${d} de $10 y ${u} de $1`;
    const w2 = `${c} de $100, ${d + 1} de $10 y ${u} de $1`;
    const opts = shuffle([correct, w1, w2]);
    acts.push({
      type: "pick",
      id: `m7-${i}`,
      title: "",
      prompt,
      cards: opts.map((o) => ({ id: o, label: o })),
      answerIds: [correct],
      hint: `Pista: mirá los cienes para los billetes de $100, los dieces para los de $10 y los unos para las monedas.`,
      skills: ["m2-dinero", "m2-valor-posicional"],
    });
  }
  return acts;
}

// Mundo 8: La Recta Numérica
function buildMundo8(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  for (let i = 0; i < 8; i++) {
    const step = pickOne([10, 50, 100]);
    const start = randInt(1, 5) * step;
    const seq = [start, start + step, start + 2 * step, start + 3 * step];
    const missingIdx = randInt(1, 2);
    const ans = seq[missingIdx];
    const shown = seq.map((v, idx) => (idx === missingIdx ? "___" : String(v))).join(" - ");
    const choices = numberChoices(ans, 3, 0, 1000);
    acts.push({
      type: "pick",
      id: `m8-${i}`,
      title: "",
      prompt: `¿Qué número falta en la escala que va de ${step} en ${step}?`,
      promptBig: shown,
      cards: numCards(choices),
      answerIds: [String(ans)],
      hint: `Pista: sumale ${step} al número anterior.`,
      skills: ["m2-comparar-ordenar"],
    });
  }
  return acts;
}

// Mundo 9: Dobles y Mitades
function buildMundo9(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  for (let i = 0; i < 8; i++) {
    if (i % 2 === 0) {
      const base = randInt(5, 45);
      const ans = base * 2;
      const choices = numberChoices(ans, 3, 10, 100);
      acts.push({
        type: "pick",
        id: `m9-${i}`,
        title: "",
        prompt: `¿Cuál es el doble de ${base}?`,
        say: `¿Cuál es el doble de ${base}?`,
        cards: numCards(choices),
        answerIds: [String(ans)],
        hint: `Pista: el doble es sumar dos veces el mismo número: ${base} + ${base}.`,
        skills: ["m2-calculo-mental"],
      });
    } else {
      const base = randInt(2, 20) * 2;
      const ans = base / 2;
      const choices = numberChoices(ans, 3, 1, 50);
      acts.push({
        type: "pick",
        id: `m9-${i}`,
        title: "",
        prompt: `¿Cuál es la mitad de ${base}?`,
        say: `¿Cuál es la mitad de ${base}?`,
        cards: numCards(choices),
        answerIds: [String(ans)],
        hint: `Pista: repartí ${base} en dos partes exactamente iguales.`,
        skills: ["m2-calculo-mental"],
      });
    }
  }
  return acts;
}

// Mundo 10: Amigos del 100 (Complementos a 100)
function buildMundo10(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  const roundTens = [10, 20, 30, 40, 50, 60, 70, 80, 90];
  for (let i = 0; i < 8; i++) {
    const a = roundTens[i % roundTens.length];
    const ans = 100 - a;
    const choices = numberChoices(ans, 3, 10, 90);
    acts.push({
      type: "pick",
      id: `m10-${i}`,
      title: "",
      prompt: `¿Cuánto le falta a ${a} para llegar a 100?`,
      promptBig: `${a} + ___ = 100`,
      say: `¿Cuánto le falta a ${a} para completar 100?`,
      cards: numCards(choices),
      answerIds: [String(ans)],
      hint: `Pista: pensá cuánto le falta a ${Math.floor(a / 10)} para llegar a 10, y agregale un cero.`,
      skills: ["m2-calculo-mental"],
    });
  }
  return acts;
}

// Mundo 11: Sumas Rápidas con Redondos
function buildMundo11(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  for (let i = 0; i < 8; i++) {
    const a = randInt(1, 5) * 100;
    const b = randInt(1, 4) * 100;
    const ans = a + b;
    const choices = numberChoices(ans, 3, 100, 1000);
    acts.push({
      type: "pick",
      id: `m11-${i}`,
      title: "",
      prompt: `Resolvé mentalmente: ${a} + ${b}`,
      promptBig: `${a} + ${b} = ?`,
      cards: numCards(choices),
      answerIds: [String(ans)],
      hint: `Pista: sumá los primeros números (${Math.floor(a / 100)} + ${Math.floor(b / 100)}) y agregale los dos ceros.`,
      skills: ["m2-calculo-mental"],
    });
  }
  return acts;
}

// Mundo 12: Sumas en el Cuaderno (Sin dificultad)
function buildMundo12(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  for (let i = 0; i < 8; i++) {
    const u1 = randInt(1, 4);
    const u2 = randInt(1, 5);
    const d1 = randInt(1, 4);
    const d2 = randInt(1, 5);
    const c1 = randInt(1, 4);
    const c2 = randInt(1, 4);
    const a = c1 * 100 + d1 * 10 + u1;
    const b = c2 * 100 + d2 * 10 + u2;
    const ans = a + b;
    const choices = numberChoices(ans, 3, 100, 999);
    acts.push({
      type: "pick",
      id: `m12-${i}`,
      title: "",
      prompt: `Sumá desarmando en cienes, dieces y unos: ${a} + ${b}`,
      promptBig: `${a} + ${b} = ?`,
      cards: numCards(choices),
      answerIds: [String(ans)],
      hint: `Pista: sumá unos con unos (${u1}+${u2}), dieces con dieces (${d1*10}+${d2*10}) y cienes con cienes.`,
      skills: ["m2-suma-algoritmos"],
    });
  }
  return acts;
}

// Mundo 13: Sumas que Llevan Dieces (Con dificultad)
function buildMundo13(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  for (let i = 0; i < 8; i++) {
    // Generar suma con reagrupación en unidades (u1 + u2 >= 10)
    const u1 = randInt(6, 9);
    const u2 = randInt(5, 9);
    const d1 = randInt(1, 4);
    const d2 = randInt(1, 3);
    const a = d1 * 10 + u1;
    const b = d2 * 10 + u2;
    const ans = a + b;
    const choices = numberChoices(ans, 3, 20, 150);
    acts.push({
      type: "pick",
      id: `m13-${i}`,
      title: "",
      prompt: `Sumá pasando el diez: ${a} + ${b}`,
      promptBig: `${a} + ${b} = ?`,
      cards: numCards(choices),
      answerIds: [String(ans)],
      hint: `Pista: los unos suman ${u1 + u2}, que es 1 diez y ${ (u1 + u2) % 10 } unos. ¡Sumale ese diez a los dieces!`,
      skills: ["m2-suma-algoritmos"],
    });
  }
  return acts;
}

// Mundo 14: Restas Desarmando Números (Sin dificultad)
function buildMundo14(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  for (let i = 0; i < 8; i++) {
    const u1 = randInt(5, 9);
    const u2 = randInt(1, 4);
    const d1 = randInt(5, 9);
    const d2 = randInt(1, 4);
    const a = d1 * 10 + u1;
    const b = d2 * 10 + u2;
    const ans = a - b;
    const choices = numberChoices(ans, 3, 10, 90);
    acts.push({
      type: "pick",
      id: `m14-${i}`,
      title: "",
      prompt: `Restá restando dieces y unos: ${a} − ${b}`,
      promptBig: `${a} − ${b} = ?`,
      cards: numCards(choices),
      answerIds: [String(ans)],
      hint: `Pista: a los dieces sacale dieces (${d1*10} - ${d2*10}) y a los unos sacale unos (${u1} - ${u2}).`,
      skills: ["m2-resta-algoritmos"],
    });
  }
  return acts;
}

// Mundo 15: Restas que Piden Ayuda (Con dificultad)
function buildMundo15(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  for (let i = 0; i < 8; i++) {
    // Generar resta donde u1 < u2, obligando a desarmar un diez
    const u1 = randInt(1, 4);
    const u2 = randInt(5, 9);
    const d1 = randInt(4, 8);
    const d2 = randInt(1, 3);
    const a = d1 * 10 + u1;
    const b = d2 * 10 + u2;
    const ans = a - b;
    const choices = numberChoices(ans, 3, 5, 80);
    acts.push({
      type: "pick",
      id: `m15-${i}`,
      title: "",
      prompt: `Desarmá un diez para restar: ${a} − ${b}`,
      promptBig: `${a} − ${b} = ?`,
      cards: numCards(choices),
      answerIds: [String(ans)],
      hint: `Pista: como a ${u1} no le podés sacar ${u2}, desarmá un diez de ${d1 * 10}. Quedan ${u1 + 10} unos.`,
      skills: ["m2-resta-algoritmos"],
    });
  }
  return acts;
}

// Mundo 16: Problemas de Sumar y Restar
function buildMundo16(): ActivitySpec[] {
  const problems = [
    {
      q: "En una estancia había 140 ovejas y nacieron 35 corderitos. ¿Cuántos animales hay en total?",
      ans: 175,
      hint: "Pista: como nacieron más, tenés que sumar: 140 + 35.",
    },
    {
      q: "Tomás tenía $250 y gastó $120 en un cuaderno. ¿Cuánto dinero le quedó?",
      ans: 130,
      hint: "Pista: como gastó plata, tenés que restar: 250 - 120.",
    },
    {
      q: "En el refugio de montaña había 85 leños y quemaron 30 para calentarse. ¿Cuántos leños quedan?",
      ans: 55,
      hint: "Pista: como se quemaron, quedan menos leños: 85 - 30.",
    },
    {
      q: "Julieta juntó 45 piñas de lenga y su hermano juntó 55. ¿Cuántas piñas juntaron entre los dos?",
      ans: 100,
      hint: "Pista: tenés que juntar las dos cantidades: 45 + 55.",
    },
    {
      q: "Un álbum de fotos tiene lugar para 200 fotos. Si ya pegaron 150, ¿cuántas fotos faltan para completarlo?",
      ans: 50,
      hint: "Pista: calculá la diferencia entre 200 y 150.",
    },
    {
      q: "En la biblioteca de la escuela había 320 libros y llegaron 80 libros nuevos donados. ¿Cuántos libros hay ahora?",
      ans: 400,
      hint: "Pista: sumá los libros que llegaron a los que ya estaban: 320 + 80.",
    },
    {
      q: "Un micro escolar salió con 42 alumnos. En la primera parada bajaron 12. ¿Cuántos alumnos quedaron en el micro?",
      ans: 30,
      hint: "Pista: restá los que bajaron: 42 - 12.",
    },
    {
      q: "Para hacer una torta se necesitan 250 gramos de harina. Si en el frasco hay 100 gramos, ¿cuánto falta agregar?",
      ans: 150,
      hint: "Pista: restá lo que hay a lo que necesitás: 250 - 100.",
    },
  ];
  return problems.map((p, i) => ({
    type: "pick",
    id: `m16-${i}`,
    title: "",
    prompt: p.q,
    cards: numCards(numberChoices(p.ans, 3, 10, 500)),
    answerIds: [String(p.ans)],
    hint: p.hint,
    skills: ["m2-problemas-aditivos"],
  }));
}

// Mundo 17: Pasos que se Repiten (Sumas sucesivas)
function buildMundo17(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  for (let i = 0; i < 8; i++) {
    const n = randInt(2, 5);
    const times = randInt(3, 5);
    const ans = n * times;
    const sumStr = Array(times).fill(n).join(" + ");
    const choices = numberChoices(ans, 3, 5, 30);
    acts.push({
      type: "pick",
      id: `m17-${i}`,
      title: "",
      prompt: `¿Cuánto es ${times} veces ${n}?`,
      promptBig: `${sumStr} = ?`,
      cards: numCards(choices),
      answerIds: [String(ans)],
      hint: `Pista: sumá ${n} de forma repetida ${times} veces.`,
      skills: ["m2-multiplicacion-inicio"],
    });
  }
  return acts;
}

// Mundo 18: Filas y Columnas (Organizaciones rectangulares)
function buildMundo18(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  for (let i = 0; i < 8; i++) {
    const rows = randInt(2, 5);
    const cols = randInt(2, 6);
    const ans = rows * cols;
    const choices = numberChoices(ans, 3, 4, 35);
    acts.push({
      type: "pick",
      id: `m18-${i}`,
      title: "",
      prompt: `Una barra de chocolate tiene ${rows} filas de ${cols} cuadraditos cada una. ¿Cuántos cuadraditos tiene en total?`,
      say: `Calculá cuántos cuadraditos hay en ${rows} filas de ${cols}.`,
      cards: numCards(choices),
      answerIds: [String(ans)],
      hint: `Pista: podés multiplicar filas por columnas: ${rows} × ${cols}.`,
      skills: ["m2-multiplicacion-inicio"],
    });
  }
  return acts;
}

// Mundo 19: La Tabla del 2
function buildMundo19(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  for (let i = 1; i <= 8; i++) {
    const factor = i + 1; // 2 a 9
    const ans = 2 * factor;
    const choices = numberChoices(ans, 3, 2, 20);
    acts.push({
      type: "pick",
      id: `m19-${i}`,
      title: "",
      prompt: `¿Cuánto es 2 × ${factor}?`,
      promptBig: `2 × ${factor} = ?`,
      cards: numCards(choices),
      answerIds: [String(ans)],
      hint: `Pista: es el doble de ${factor}: ${factor} + ${factor}.`,
      skills: ["m2-tablas"],
    });
  }
  return acts;
}

// Mundo 20: La Tabla del 5
function buildMundo20(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  for (let i = 1; i <= 8; i++) {
    const factor = i + 1; // 2 a 9
    const ans = 5 * factor;
    const choices = numberChoices(ans, 3, 5, 50);
    acts.push({
      type: "pick",
      id: `m20-${i}`,
      title: "",
      prompt: `¿Cuánto es 5 × ${factor}?`,
      promptBig: `5 × ${factor} = ?`,
      cards: numCards(choices),
      answerIds: [String(ans)],
      hint: `Pista: contá de 5 en 5: todos los resultados de la tabla del 5 terminan en 0 o en 5.`,
      skills: ["m2-tablas"],
    });
  }
  return acts;
}

// Mundo 21: La Tabla del 10
function buildMundo21(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  for (let i = 1; i <= 8; i++) {
    const factor = i + 1; // 2 a 9
    const ans = 10 * factor;
    const choices = numberChoices(ans, 3, 10, 100);
    acts.push({
      type: "pick",
      id: `m21-${i}`,
      title: "",
      prompt: `¿Cuánto es 10 × ${factor}?`,
      promptBig: `10 × ${factor} = ?`,
      cards: numCards(choices),
      answerIds: [String(ans)],
      hint: `Pista: para multiplicar por 10, agregale un cero al ${factor}.`,
      skills: ["m2-tablas"],
    });
  }
  return acts;
}

// Mundo 22: Reparto en Partes Iguales
function buildMundo22(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  for (let i = 0; i < 8; i++) {
    const parts = pickOne([2, 3, 4, 5]);
    const perPart = randInt(2, 6);
    const total = parts * perPart;
    const choices = numberChoices(perPart, 3, 1, 10);
    acts.push({
      type: "pick",
      id: `m22-${i}`,
      title: "",
      prompt: `Si repartimos ${total} alfajores entre ${parts} amigos en partes iguales, ¿cuántos recibe cada uno?`,
      cards: numCards(choices),
      answerIds: [String(perPart)],
      hint: `Pista: pensá qué número multiplicado por ${parts} da ${total}.`,
      skills: ["m2-reparto"],
    });
  }
  return acts;
}

// Mundo 23: Lados y Vértices (Figuras 2D)
function buildMundo23(): ActivitySpec[] {
  const questions: Q[] = [
    q("¿Cuántos lados rectos tiene un triángulo?", [["3️⃣", "3 lados"], ["4️⃣", "4 lados"], ["5️⃣", "5 lados"]], 0, "Pista: 'tri' significa tres."),
    q("¿Cuántos vértices (esquinas) tiene un cuadrado?", [["4️⃣", "4 vértices"], ["3️⃣", "3 vértices"], ["0️⃣", "Ninguno"]], 0, "Pista: tiene cuatro esquinas donde se juntan sus lados."),
    q("¿Qué figura geométrica no tiene lados rectos ni vértices y su borde es curvo?", [["⭕", "El círculo"], ["🔺", "El triángulo"], ["⬛", "El cuadrado"]], 0, "Pista: es redondo como una moneda."),
    q("¿En qué se diferencian un cuadrado y un rectángulo?", [["📐", "El cuadrado tiene los 4 lados iguales; el rectángulo tiene 2 pares de lados iguales"], ["🔺", "El rectángulo tiene 3 lados"], ["⭕", "El cuadrado es curvo"]], 0, "Pista: los dos tienen 4 vértices, pero el rectángulo es más alargado."),
    q("¿Cuántos lados tiene un rectángulo?", [["4️⃣", "4 lados"], ["2️⃣", "2 lados"], ["6️⃣", "6 lados"]], 0, "Pista: tiene dos lados largos y dos cortos."),
    q("¿Cómo se llama el punto donde se unen dos lados de una figura?", [["📍", "Vértice"], ["📏", "Línea"], ["🎨", "Pintura"]], 0, "Pista: es la esquina de la figura."),
    q("Si juntamos dos triángulos iguales por un lado, ¿qué figura de cuatro lados podemos formar?", [["⬛", "Un cuadrado o rombo"], ["⭕", "Un círculo"], ["🌟", "Una estrella"]], 0, "Pista: cuatro lados rectos se unen."),
    q("¿Cuál de estas figuras tiene 3 vértices?", [["🔺", "El triángulo"], ["⬛", "El cuadrado"], ["⭕", "El círculo"]], 0, "Pista: tiene tres esquinas."),
  ];
  return questions.map((item, i) => ({
    type: "pick",
    id: `m23-${i}`,
    title: "",
    prompt: item.prompt,
    cards: shuffle(item.options.map(([emoji, label], idx) => ({ id: `o${idx}`, emoji, label }))),
    answerIds: [`o${item.answer}`],
    hint: item.hint ?? "Pista: contá los lados y esquinas.",
    skills: ["m2-geometria-2d"],
  }));
}

// Mundo 24: Cuerpos con Caras (Geometría 3D)
function buildMundo24(): ActivitySpec[] {
  const questions: Q[] = [
    q("¿Cuántas caras cuadradas iguales tiene un cubo?", [["6️⃣", "6 caras"], ["4️⃣", "4 caras"], ["8️⃣", "8 caras"]], 0, "Pista: pensá en un dado de jugar: tiene números del 1 al 6."),
    q("¿Qué cuerpo geométrico puede rodar porque tiene una superficie curva?", [["🛢️", "El cilindro y la esfera"], ["🧊", "El cubo"], ["🧱", "La pirámide de base cuadrada"]], 0, "Pista: los cuerpos redondos ruedan sobre la mesa."),
    q("¿Qué forma tienen las caras laterales de una pirámide?", [["🔺", "Triángulos"], ["⭕", "Círculos"], ["⬛", "Cuadrados"]], 0, "Pista: suben en punta hacia la cúspide."),
    q("¿Qué cuerpo geométrico tiene la forma de una pelota de fútbol?", [["⚽", "La esfera"], ["🧊", "El cubo"], ["📐", "El cono"]], 0, "Pista: es completamente redondo en todas direcciones."),
    q("¿Qué cuerpo geométrico tiene la forma de una caja de zapatos?", [["📦", "El prisma rectangular"], ["🧊", "La esfera"], ["🔺", "El cono"]], 0, "Pista: tiene 6 caras rectangulares."),
    q("¿Cómo se llaman las líneas donde se juntan dos caras de un cuerpo?", [["📏", "Aristas"], ["📍", "Círculos"], ["💧", "Gotas"]], 0, "Pista: son los bordes rectos del cuerpo."),
    q("¿Cuántos vértices (puntas) tiene un cubo?", [["8️⃣", "8 vértices"], ["6️⃣", "6 vértices"], ["1️⃣", "1 vértice"]], 0, "Pista: tiene 4 vértices arriba y 4 abajo."),
    q("¿Qué cuerpo tiene dos bases circulares planas y una cara curva como una lata de conserva?", [["🥫", "El cilindro"], ["🧊", "El cubo"], ["🔺", "La pirámide"]], 0, "Pista: tiene forma de tubo con tapa y fondo redondos."),
  ];
  return questions.map((item, i) => ({
    type: "pick",
    id: `m24-${i}`,
    title: "",
    prompt: item.prompt,
    cards: shuffle(item.options.map(([emoji, label], idx) => ({ id: `o${idx}`, emoji, label }))),
    answerIds: [`o${item.answer}`],
    hint: item.hint ?? "Pista: mirá las caras y esquinas del cuerpo.",
    skills: ["m2-geometria-3d"],
  }));
}

// Mundo 25: El Plano del Refugio (Croquis y espacio)
function buildMundo25(): ActivitySpec[] {
  const questions: Q[] = [
    q("En el plano de un refugio, ¿desde qué punto de vista vemos las habitaciones y muebles?", [["🗺️", "Desde arriba (vista aérea)"], ["🚗", "Desde abajo de la tierra"], ["🪟", "Solo desde la ventana"]], 0, "Pista: los planos muestran el espacio como si no tuviera techo."),
    q("Si en el plano la puerta está adelante y la estufa a tu derecha, ¿hacia dónde tenés que caminar para calentarte?", [["👉", "Hacia la derecha"], ["👈", "Hacia la izquierda"], ["⬆️", "Hacia atrás"]], 0, "Pista: la estufa está ubicada al lado derecho."),
    q("¿Para qué sirve la referencia o dibujo de la brújula (Norte, Sur, Este, Oeste) en un mapa?", [["🧭", "Para orientar las direcciones del lugar"], ["🎨", "Solo para decorar"], ["⏱️", "Para saber la hora"]], 0, "Pista: nos dice hacia dónde queda cada punto cardinal."),
    q("En el croquis del aula, si el pizarrón está al frente, ¿dónde suelen estar las mochilas?", [["🎒", "Atrás o al costado de los bancos"], ["☁️", "Colgadas del techo"], ["🚪", "Afuera en la calle"]], 0, "Pista: están cerca de los alumnos pero sin tapar el paso."),
    q("¿Cómo se representa una pared en un plano simple?", [["🧱", "Con una línea gruesa"], ["⭕", "Con un círculo rojo"], ["🌊", "Con ondas de agua"]], 0, "Pista: las líneas marcan los límites de cada habitación."),
    q("Si caminás 3 pasos hacia adelante y 2 hacia la izquierda, ¿dónde quedás respecto de tu inicio?", [["📍", "Adelante y a la izquierda"], ["👉", "A la derecha"], ["⬇️", "Atrás"]], 0, "Pista: combinás los dos movimientos en el espacio."),
    q("¿Qué objeto de un plano nos ayuda a interpretar los símbolos usados?", [["📋", "La leyenda o cuadro de referencias"], ["🪞", "El espejo"], ["📏", "El borrador"]], 0, "Pista: explica qué significa cada dibujo o color del plano."),
    q("¿Por qué es útil tener el plano de evacuación de la escuela?", [["🚪", "Para saber por dónde salir rápido y seguros en una emergencia"], ["🎮", "Para jugar a las escondidas"], ["🎨", "Para pintar con témpera"]], 0, "Pista: muestra las salidas de emergencia más cercanas."),
  ];
  return questions.map((item, i) => ({
    type: "pick",
    id: `m25-${i}`,
    title: "",
    prompt: item.prompt,
    cards: shuffle(item.options.map(([emoji, label], idx) => ({ id: `o${idx}`, emoji, label }))),
    answerIds: [`o${item.answer}`],
    hint: item.hint ?? "Pista: orientate usando derecha, izquierda, adelante y atrás.",
    skills: ["m2-espacio-planos"],
  }));
}

// Mundo 26: Metros y Centímetros (Medición de longitud)
function buildMundo26(): ActivitySpec[] {
  const qList: Q[] = [
    q("¿Cuántos centímetros (cm) equivalen a 1 metro (m)?", [["1️⃣0️⃣0️⃣", "100 cm"], ["1️⃣0️⃣", "10 cm"], ["1️⃣0️⃣0️⃣0️⃣", "1000 cm"]], 0, "Pista: 'centi' viene de cien: en 1 metro entran 100 centímetros."),
    q("¿Con qué unidad conviene medir el largo de un lápiz?", [["📏", "En centímetros (cm)"], ["🛣️", "En kilómetros (km)"], ["⚖️", "En kilos (kg)"]], 0, "Pista: un lápiz mide unos 15 centímetros."),
    q("¿Con qué unidad conviene medir el ancho del aula o la altura de un árbol?", [["🌲", "En metros (m)"], ["💧", "En litros (l)"], ["⏱️", "En segundos"]], 0, "Pista: los espacios grandes se miden en metros."),
    q("Si una tabla mide 1 metro y le cortamos 30 centímetros, ¿cuántos centímetros quedan?", [["7️⃣0️⃣", "70 cm"], ["5️⃣0️⃣", "50 cm"], ["3️⃣0️⃣", "30 cm"]], 0, "Pista: 1 metro son 100 cm; restá: 100 - 30 = 70."),
    q("¿Qué instrumento usa la modista o el carpintero para medir longitudes?", [["📏", "La cinta métrica y la regla"], ["⚖️", "La balanza"], ["🌡️", "El termómetro"]], 0, "Pista: tiene números marcados en centímetros."),
    q("¿Cuánto mide medio metro?", [["5️⃣0️⃣", "50 cm"], ["2️⃣5️⃣", "25 cm"], ["1️⃣0️⃣", "10 cm"]], 0, "Pista: la mitad de 100 centímetros es 50."),
    q("Si un camino de piedras mide 2 metros, ¿cuántos centímetros son?", [["2️⃣0️⃣0️⃣", "200 cm"], ["2️⃣0️⃣", "20 cm"], ["2️⃣0️⃣0️⃣0️⃣", "2000 cm"]], 0, "Pista: si 1 m son 100 cm, 2 m son el doble: 200 cm."),
    q("¿Cuál de estas cosas mide aproximadamente 1 centímetro?", [["🐜", "El ancho de una uña o un bichito chico"], ["🚪", "La altura de una puerta"], ["🚗", "El largo de un auto"]], 0, "Pista: 1 centímetro es una medida chiquita en la regla."),
  ];
  return qList.map((item, i) => ({
    type: "pick",
    id: `m26-${i}`,
    title: "",
    prompt: item.prompt,
    cards: shuffle(item.options.map(([emoji, label], idx) => ({ id: `o${idx}`, emoji, label }))),
    answerIds: [`o${item.answer}`],
    hint: item.hint ?? "Pista: recordá que 1 metro = 100 centímetros.",
    skills: ["m2-medidas-longitud"],
  }));
}

// Mundo 27: Kilos y Litros (Capacidad y peso)
function buildMundo27(): ActivitySpec[] {
  const qList: Q[] = [
    q("¿Qué instrumento usamos para saber cuánto pesa una bolsa de manzanas?", [["⚖️", "La balanza"], ["📏", "La regla de plástico"], ["⏱️", "El reloj"]], 0, "Pista: marca los gramos y kilos en el visor."),
    q("¿En qué unidad se mide el agua, la leche y los jugos?", [["🥛", "En litros (l)"], ["📏", "En metros (m)"], ["⌛", "En horas"]], 0, "Pista: los líquidos ocupan capacidad y se miden en litros."),
    q("Si una jarra tiene 1 litro de jugo, ¿cuántos vasos de un cuarto de litro podemos llenar?", [["4️⃣", "4 vasos"], ["2️⃣", "2 vasos"], ["1️⃣0️⃣", "10 vasos"]], 0, "Pista: 4 cuartos forman 1 entero."),
    q("¿Cuánto pesan dos paquetes de medio kilo de yerba juntos?", [["1️⃣", "1 kilo"], ["2️⃣", "2 kilos"], ["5️⃣0️⃣0️⃣", "500 gramos"]], 0, "Pista: medio kilo + medio kilo = 1 kilo entero."),
    q("¿Qué pesa más: 1 kilo de plumas o 1 kilo de piedras?", [["⚖️", "Pesan exactamente lo mismo (1 kilo)"], ["🪨", "El kilo de piedras"], ["🪶", "El kilo de plumas"]], 0, "Pista: los dos pesan 1 kilo; la diferencia es que las plumas ocupan más espacio."),
    q("¿Para qué sirve un vaso medidor en la cocina?", [["🧁", "Para medir litros y mililitros de líquidos o harina"], ["🔨", "Para golpear clavos"], ["🧼", "Para lavar platos"]], 0, "Pista: tiene marcas transparentes con las cantidades exactas."),
    q("Si en un bidón entran 5 litros de agua y ya pusimos 3 litros, ¿cuántos litros faltan?", [["2️⃣", "2 litros"], ["3️⃣", "3 litros"], ["8️⃣", "8 litros"]], 0, "Pista: restá: 5 - 3 = 2."),
    q("¿Cuál de estos recipientes tiene mayor capacidad?", [["🛢️", "Un balde de 10 litros"], ["🥛", "Un vaso de 250 ml"], ["☕", "Una taza de té"]], 0, "Pista: en 10 litros entran muchísimos vasos."),
  ];
  return qList.map((item, i) => ({
    type: "pick",
    id: `m27-${i}`,
    title: "",
    prompt: item.prompt,
    cards: shuffle(item.options.map(([emoji, label], idx) => ({ id: `o${idx}`, emoji, label }))),
    answerIds: [`o${item.answer}`],
    hint: item.hint ?? "Pista: los pesos se miden en kilos y los líquidos en litros.",
    skills: ["m2-medidas-capacidad-peso"],
  }));
}

// Mundo 28: La Hora y el Calendario
function buildMundo28(): ActivitySpec[] {
  const qList: Q[] = [
    q("En un reloj de agujas, ¿qué aguja marca las horas?", [["🕐", "La aguja corta (horaria)"], ["⏳", "La aguja larga (minutero)"], ["🔴", "La aguja del segundero"]], 0, "Pista: la aguja cortita avanza despacio de hora en hora."),
    q("Si la aguja corta apunta al 4 y la aguja larga apunta al 12, ¿qué hora es?", [["4️⃣", "Las 4 en punto"], ["1️⃣2️⃣", "Las 12 y cuatro"], ["6️⃣", "Las 4 y media"]], 0, "Pista: cuando el minutero está en el 12, es la hora en punto."),
    q("Si la aguja corta está entre el 2 y el 3, y la aguja larga apunta al 6, ¿qué hora es?", [["🕝", "Las 2 y media (2:30)"], ["2️⃣", "Las 2 en punto"], ["3️⃣", "Las 3 en punto"]], 0, "Pista: cuando el minutero apunta al 6, pasaron 30 minutos (media hora)."),
    q("¿Cuántos minutos tiene 1 hora entera?", [["6️⃣0️⃣", "60 minutos"], ["1️⃣0️⃣0️⃣", "100 minutos"], ["2️⃣4️⃣", "24 minutos"]], 0, "Pista: la aguja larga da una vuelta completa de 60 minutos."),
    q("¿Cuántos días tiene una semana?", [["7️⃣", "7 días"], ["5️⃣", "5 días"], ["1️⃣0️⃣", "10 días"]], 0, "Pista: lunes, martes, miércoles, jueves, viernes, sábado y domingo."),
    q("¿Cuántos meses tiene un año completo?", [["1️⃣2️⃣", "12 meses"], ["1️⃣0️⃣", "10 meses"], ["2️⃣4️⃣", "24 meses"]], 0, "Pista: empieza en enero y termina en diciembre."),
    q("Si hoy es martes, ¿qué día fue ayer?", [["📅", "Lunes"], ["📅", "Miércoles"], ["📅", "Jueves"]], 0, "Pista: el día anterior al martes es el primer día de la semana escolar."),
    q("¿Qué mes del año tiene solo 28 o 29 días?", [["❄️", "Febrero"], ["☀️", "Enero"], ["🍂", "Marzo"]], 0, "Pista: es el mes más corto del año."),
  ];
  return qList.map((item, i) => ({
    type: "pick",
    id: `m28-${i}`,
    title: "",
    prompt: item.prompt,
    cards: shuffle(item.options.map(([emoji, label], idx) => ({ id: `o${idx}`, emoji, label }))),
    answerIds: [`o${item.answer}`],
    hint: item.hint ?? "Pista: recordá cómo leemos el reloj y los días en el calendario.",
    skills: ["m2-tiempo-reloj"],
  }));
}

// Despachador principal de actividades de Matemática de 2.º grado
export function buildMatematicaActivities(world: WorldDef): ActivitySpec[] {
  const n = world.worldNumber ?? 1;
  let acts: ActivitySpec[] = [];

  switch (n) {
    case 1:
      acts = buildMundo1();
      break;
    case 2:
      acts = buildMundo2();
      break;
    case 3:
      acts = buildMundo3();
      break;
    case 4:
      acts = buildMundo4();
      break;
    case 5:
      acts = buildMundo5();
      break;
    case 6:
      acts = buildMundo6();
      break;
    case 7:
      acts = buildMundo7();
      break;
    case 8:
      acts = buildMundo8();
      break;
    case 9:
      acts = buildMundo9();
      break;
    case 10:
      acts = buildMundo10();
      break;
    case 11:
      acts = buildMundo11();
      break;
    case 12:
      acts = buildMundo12();
      break;
    case 13:
      acts = buildMundo13();
      break;
    case 14:
      acts = buildMundo14();
      break;
    case 15:
      acts = buildMundo15();
      break;
    case 16:
      acts = buildMundo16();
      break;
    case 17:
      acts = buildMundo17();
      break;
    case 18:
      acts = buildMundo18();
      break;
    case 19:
      acts = buildMundo19();
      break;
    case 20:
      acts = buildMundo20();
      break;
    case 21:
      acts = buildMundo21();
      break;
    case 22:
      acts = buildMundo22();
      break;
    case 23:
      acts = buildMundo23();
      break;
    case 24:
      acts = buildMundo24();
      break;
    case 25:
      acts = buildMundo25();
      break;
    case 26:
      acts = buildMundo26();
      break;
    case 27:
      acts = buildMundo27();
      break;
    case 28:
      acts = buildMundo28();
      break;
    default:
      acts = buildMundo1();
      break;
  }

  const count = world.activityCount ?? 8;
  return numbered(acts.slice(0, count));
}
