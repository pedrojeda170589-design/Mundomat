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
      const dm = randInt(2, 9);
      const um = randInt(1, 9);
      const c = randInt(1, 9);
      const target = dm * 10000 + um * 1000 + c * 100;
      const choices = shuffle([
        target,
        dm * 10000 + c * 1000 + um * 100,
        um * 10000 + dm * 1000 + c * 100,
      ]);
      acts.push(
        qToPick(
          q(
            `¿Qué número se forma con ${dm} decenas de mil, ${um} unidades de mil y ${c} centenas?`,
            choices.map((num) => ["🧮", num.toLocaleString("es-AR")]),
            choices.indexOf(target),
            `Pista: ${dm} decenas de mil equivalen a ${(dm * 10000).toLocaleString("es-AR")}.`
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
      const dm = randInt(1, 9);
      const um = randInt(1, 9);
      const target = cm * 100000 + dm * 10000 + um * 1000;
      const fake1 = cm * 100000 + um * 10000 + dm * 1000;
      const fake2 = (cm + 1) * 100000 + dm * 10000;
      const choices = shuffle([target, fake1, fake2]);
      acts.push(
        qToPick(
          q(
            `Un cargamento de lana en el puerto pesa ${cm} centenas de mil, ${dm} decenas de mil y ${um} unidades de mil kilos. ¿A cuántos kilos equivale?`,
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

// Mundo 42003: Valor posicional y descomposición polinómica
function buildMundo42003(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  const skills = ["m4-posicional"];
  const ciudades = ["Río Gallegos", "Caleta Olivia", "Pico Truncado", "El Calafate", "Puerto Deseado", "Las Heras", "Gobernador Gregores"];
  for (let i = 0; i < 8; i++) {
    const ciudad = pickOne(ciudades);
    if (i % 2 === 0) {
      const d1 = randInt(2, 9);
      const d2 = randInt(1, 9);
      const d3 = randInt(1, 9);
      const d4 = randInt(1, 9);
      const n = d1 * 100000 + d2 * 10000 + d3 * 1000 + d4 * 100;
      const choices = shuffle([
        `${d1} × 100.000 + ${d2} × 10.000 + ${d3} × 1.000 + ${d4} × 100`,
        `${d1} × 10.000 + ${d2} × 1.000 + ${d3} × 100 + ${d4} × 10`,
        `${d2} × 100.000 + ${d1} × 10.000 + ${d3} × 1.000 + ${d4} × 100`,
      ]);
      const targetStr = `${d1} × 100.000 + ${d2} × 10.000 + ${d3} × 1.000 + ${d4} × 100`;
      acts.push(
        qToPick(
          q(
            `En el censo de ${ciudad} se registraron ${n.toLocaleString("es-AR")} habitantes. ¿Cuál es su descomposición multiplicativa correcta?`,
            choices.map((c) => ["🧮", c]),
            choices.indexOf(targetStr),
            "Pista: multiplicá cada cifra por el valor de su posición (100.000, 10.000, 1.000 o 100)."
          ),
          `m42003-${i}`,
          "",
          skills
        )
      );
    } else {
      const d1 = randInt(1, 8);
      const d2 = randInt(1, 9);
      const d3 = randInt(1, 9);
      const n = d1 * 100000 + d2 * 10000 + d3 * 1000;
      const targetVal = d2 * 10000;
      const choices = shuffle([
        targetVal.toLocaleString("es-AR"),
        (d2 * 1000).toLocaleString("es-AR"),
        (d2 * 100000).toLocaleString("es-AR"),
      ]);
      acts.push(
        qToPick(
          q(
            `En el número ${n.toLocaleString("es-AR")}, ¿cuál es el valor posicional de la cifra ${d2}?`,
            choices.map((c) => ["📍", c]),
            choices.indexOf(targetVal.toLocaleString("es-AR")),
            `Pista: la cifra ${d2} está en el lugar de las decenas de mil.`
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
  for (let i = 0; i < 8; i++) {
    if (i % 2 === 0) {
      const a = randInt(10, 80) * 10000;
      const b = a + 100000;
      const mid = a + randInt(2, 8) * 10000;
      const fake1 = a - 10000;
      const fake2 = b + 15000;
      const choices = shuffle([mid, fake1, fake2]);
      acts.push(
        qToPick(
          q(
            `¿Cuál de estos números se ubica entre ${a.toLocaleString("es-AR")} y ${b.toLocaleString("es-AR")} en la recta numérica?`,
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
      const n2 = n1 + randInt(50, 150) * 1000;
      const n3 = n2 + randInt(50, 150) * 1000;
      acts.push(
        makeOrder(
          `m42004-ord-${i}`,
          "Ordená estos números de MENOR a MAYOR:",
          [n1.toLocaleString("es-AR"), n2.toLocaleString("es-AR"), n3.toLocaleString("es-AR")],
          "Pista: mirá primero las centenas y decenas de mil.",
          skills
        )
      );
    }
  }
  return numbered(acts);
}

// Mundo 42005: Números romanos
function buildMundo42005(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  const skills = ["m4-romanos"];
  const romanos: [string, number][] = [
    ["XIV", 14], ["XIX", 19], ["XXIV", 24], ["XXIX", 29], ["XLV", 45],
    ["LVIII", 58], ["LXXII", 72], ["LXXXIX", 89], ["XCIV", 94], ["CXX", 120],
    ["CL", 150], ["CC", 200], ["CCCXL", 340], ["CDL", 450], ["DXV", 515],
    ["DCC", 700], ["CM", 900], ["MCML", 1950], ["MMXXIV", 2024], ["MCDXCII", 1492],
  ];
  for (let i = 0; i < 8; i++) {
    const pair = pickOne(romanos);
    const [rom, val] = pair;
    if (i % 2 === 0) {
      const choices = numberChoices(val, 3, 1, 3000);
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
    } else {
      const choices = shuffle([rom, rom.replace("X", "V"), rom + "I"]);
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
    }
  }
  return numbered(acts);
}

// Mundo 42006: Sumas y restas con números grandes
function buildMundo42006(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  const skills = ["m4-sumas-grandes"];
  for (let i = 0; i < 8; i++) {
    const a = randInt(15, 80) * 1000 + randInt(1, 9) * 100;
    const b = randInt(10, 50) * 1000 + randInt(1, 9) * 100;
    if (i % 2 === 0) {
      const total = a + b;
      acts.push(
        makeInput(
          `m42006-in-${i}`,
          `Un camión transporta ${a.toLocaleString("es-AR")} kg de carne ovina y ${b.toLocaleString("es-AR")} kg de pescado. ¿Cuántos kg transporta en total?`,
          total,
          `Pista: sumá primero los miles (${(Math.floor(a/1000) + Math.floor(b/1000)).toLocaleString("es-AR")}.000) y luego las centenas.`,
          skills
        )
      );
    } else {
      const mayor = Math.max(a, b);
      const menor = Math.min(a, b);
      const dif = mayor - menor;
      const choices = shuffle([dif, dif + 1000, Math.max(0, dif - 1000)]);
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
    const choices = shuffle([
      estimated.toLocaleString("es-AR"),
      (estimated + 10000).toLocaleString("es-AR"),
      Math.max(10000, estimated - 10000).toLocaleString("es-AR"),
    ]);
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
      const choices = shuffle([prod, prod * 10, Math.floor(prod / 10)]);
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
      const choices = shuffle([n, n * 10, Math.max(1, Math.floor(n / 10))]);
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

// Mundo 42009: Multiplicación por dos cifras
function buildMundo42009(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  const skills = ["m4-mult-2cifras"];
  for (let i = 0; i < 8; i++) {
    const a = randInt(120, 450);
    const b = randInt(12, 35);
    const prod = a * b;
    if (i % 2 === 0) {
      acts.push(
        makeInput(
          `m42009-in-${i}`,
          `Un colectivo de larga distancia recorre ${a} km por día. ¿Cuántos km recorrerá en ${b} días?`,
          prod,
          `Pista: calculá ${a} × ${b.toString()[0]}0 y sumale ${a} × ${b.toString()[1]}.`,
          skills
        )
      );
    } else {
      const choices = shuffle([prod, prod + 100, prod - 100]);
      acts.push(
        qToPick(
          q(
            `En un salón de actos escolar hay ${b} filas con ${a} sillas cada una. ¿Cuántas sillas hay en total?`,
            choices.map((c) => ["🪑", `${c.toLocaleString("es-AR")} sillas`]),
            choices.indexOf(prod),
            `Pista: multiplicá ${a} × ${b}.`
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
  for (let i = 0; i < 8; i++) {
    const a = randInt(12, 28);
    const b = pickOne([12, 15, 18, 22]);
    const tens = Math.floor(b / 10) * 10;
    const units = b % 10;
    const correctExpr = `${a} × ${tens} + ${a} × ${units}`;
    const fake1 = `${a} × ${tens} + ${units}`;
    const fake2 = `${a} + ${tens} × ${units}`;
    const choices = shuffle([correctExpr, fake1, fake2]);
    acts.push(
      qToPick(
        q(
          `¿Cuál de estos cálculos aplica correctamente la propiedad distributiva para resolver ${a} × ${b}?`,
          choices.map((c) => ["✏️", c]),
          choices.indexOf(correctExpr),
          `Pista: descomponé ${b} en ${tens} + ${units} y multiplicá ${a} por cada parte.`
        ),
        `m42010-${i}`,
        "",
        skills
      )
    );
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
      acts.push(
        makeInput(
          `m42011-in-${i}`,
          `El piso del patio de la escuela tiene ${filas} filas de baldosas y ${cols} baldosas en cada fila. ¿Cuántas baldosas tiene en total?`,
          total,
          `Pista: multiplicá filas por columnas (${filas} × ${cols}).`,
          skills
        )
      );
    } else {
      const panes = randInt(2, 4);
      const rellenos = randInt(3, 5);
      const comb = panes * rellenos;
      const choices = shuffle([comb, panes + rellenos, comb + 2]);
      acts.push(
        qToPick(
          q(
            `En el comedor escolar se ofrecen ${panes} tipos de pan y ${rellenos} opciones de relleno. ¿Cuántos sándwiches diferentes se pueden armar?`,
            choices.map((c) => ["🥪", `${c} combinaciones`]),
            choices.indexOf(comb),
            `Pista: multiplicá los tipos de pan por los rellenos (${panes} × ${rellenos}).`
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
  for (let i = 0; i < 8; i++) {
    const divisor = pickOne([4, 5, 6, 8, 12, 15, 20]);
    const cociente = randInt(25, 120);
    const dividendo = divisor * cociente;
    acts.push(
      makeInput(
        `m42012-in-${i}`,
        `Se reparten ${dividendo.toLocaleString("es-AR")} litros de leche en bidones de ${divisor} litros cada uno. ¿Cuántos bidones completos se llenan?`,
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
    const sobrantes = randInt(1, capacidad - 1);
    const totalPersonas = capacidad * viajes + sobrantes;
    const combisNecesarias = viajes + 1;
    if (i % 2 === 0) {
      const choices = shuffle([combisNecesarias, viajes, combisNecesarias + 1]);
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
      const choices = shuffle([sobrantes, capacidad - sobrantes, sobrantes + 1]);
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

// Mundo 42014: Proporcionalidad directa y tablas de valores
function buildMundo42014(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  const skills = ["m4-proporcionalidad"];
  for (let i = 0; i < 8; i++) {
    const precioKg = randInt(6, 15) * 100;
    const cantKg = pickOne([3, 4, 5, 6]);
    const targetPrecio = precioKg * cantKg;
    const choices = shuffle([targetPrecio, targetPrecio + precioKg, targetPrecio - precioKg]);
    acts.push(
      qToPick(
        q(
          `Si 1 kg de manzanas en la verdulería cuesta $${precioKg.toLocaleString("es-AR")}, ¿cuánto costarán ${cantKg} kg?`,
          choices.map((c) => ["🍎", `$${c.toLocaleString("es-AR")}`]),
          choices.indexOf(targetPrecio),
          `Pista: multiplicá el precio de un kilo ($${precioKg.toLocaleString("es-AR")}) por ${cantKg}.`
        ),
        `m42014-${i}`,
        "",
        skills
      )
    );
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
  for (let i = 0; i < 8; i++) {
    if (i % 2 === 0) {
      const entero = pickOne([1, 2, 3]);
      const cuartos = entero * 4;
      const choices = shuffle([cuartos, cuartos - 1, cuartos + 2]);
      acts.push(
        qToPick(
          q(
            `¿Cuántos paquetes de 1/4 kg de yerba mate se necesitan para completar ${entero} kg?`,
            choices.map((c) => ["🧉", `${c} paquetes`]),
            choices.indexOf(cuartos),
            "Pista: en cada kilo entran 4 paquetes de un cuarto."
          ),
          `m42015-${i}`,
          "",
          skills
        )
      );
    } else {
      // Evitar que el distractor sea equivalente (soluciona ~586)
      const porciones = pickOne([2, 3, 5]);
      const totalPorciones = 8;
      const choices = shuffle([`${porciones}/8`, `${porciones + 1}/8`, `${porciones + 2}/8`]);
      acts.push(
        qToPick(
          q(
            `Una pizza se cortó en ${totalPorciones} porciones iguales y Julieta comió ${porciones}. ¿Qué fracción de la pizza comió?`,
            choices.map((c) => ["🍕", `${c} de la pizza`]),
            choices.indexOf(`${porciones}/8`),
            `Pista: el numerador es la cantidad de porciones comidas (${porciones}) y el denominador el total (${totalPorciones}).`
          ),
          `m42015-${i}`,
          "",
          skills
        )
      );
    }
  }
  return numbered(acts);
}

// Mundo 42016: Fracciones de tercios, quintos y sextos en repartos
function buildMundo42016(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  const skills = ["m4-fracciones-reparto"];
  for (let i = 0; i < 8; i++) {
    const chicos = pickOne([3, 5, 6]);
    const alfajores = randInt(chicos + 1, chicos * 3);
    const fracStr = `${alfajores}/${chicos}`;
    const fake1 = `${alfajores + 1}/${chicos}`;
    const fake2 = `${alfajores}/${chicos + 1}`;
    const choices = shuffle([fracStr, fake1, fake2]);
    acts.push(
      qToPick(
        q(
          `Se reparten ${alfajores} alfajores santacruceños entre ${chicos} chicos en partes iguales sin que sobre nada. ¿Cuánto le corresponde a cada uno?`,
          choices.map((c) => ["🍫", `${c} de alfajor`]),
          choices.indexOf(fracStr),
          `Pista: el resultado del reparto equitativo es el número de alfajores sobre la cantidad de chicos (${alfajores}/${chicos}).`
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
  ];
  for (let i = 0; i < 8; i++) {
    const item = pickOne(equivalencias);
    const [base, equiv, fakes] = item;
    const choices = shuffle([equiv, fakes[0], fakes[1]]);
    acts.push(
      qToPick(
        q(
          `¿Cuál de las siguientes fracciones es EQUIVALENTE a ${base}?`,
          choices.map((c) => ["🍰", c]),
          choices.indexOf(equiv),
          "Pista: multiplicá el numerador y el denominador por el mismo número."
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
  ];
  for (let i = 0; i < 8; i++) {
    const [impropia, mixto, fakes] = pickOne(mixtos);
    const choices = shuffle([mixto, fakes[0], fakes[1]]);
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

// Mundo 42019: Fracciones en la recta numérica
function buildMundo42019(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  const skills = ["m4-frac-recta"];
  for (let i = 0; i < 8; i++) {
    acts.push(
      makeOrder(
        `m42019-${i}`,
        "Ordená estas fracciones de MENOR a MAYOR:",
        ["1/4", "1/2", "3/4", "5/4"],
        "Pista: 1/4 es menos que medio entero, 1/2 es medio, 3/4 es casi un entero y 5/4 supera la unidad.",
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
    const a = randInt(1, den - 2);
    const b = randInt(1, den - a);
    const sumNum = a + b;
    const choices = shuffle([`${sumNum}/${den}`, `${sumNum}/${den * 2}`, `${sumNum + 1}/${den}`]);
    acts.push(
      qToPick(
        q(
          `Martín pintó ${a}/${den} de un mural escolar por la mañana y ${b}/${den} por la tarde. ¿Qué fracción pintó en total?`,
          choices.map((c) => ["🎨", `${c} del mural`]),
          choices.indexOf(`${sumNum}/${den}`),
          "Pista: como tienen el mismo denominador, sumá solo los numeradores."
        ),
        `m42020-${i}`,
        "",
        skills
      )
    );
  }
  return numbered(acts);
}

// Mundo 42021: Números decimales: décimos, centésimos y milésimos
function buildMundo42021(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  const skills = ["m4-decimales-dinero"];
  for (let i = 0; i < 8; i++) {
    if (i % 2 === 0) {
      const centavos = pickOne([10, 25, 50, 75]);
      const pesos = randInt(5, 50);
      const target = `${pesos},${centavos < 10 ? "0" + centavos : centavos}`;
      const fake1 = `${pesos},${centavos * 2}`;
      const fake2 = `${pesos + 1},${centavos}`;
      const choices = shuffle([`$${target}`, `$${fake1}`, `$${fake2}`]);
      acts.push(
        qToPick(
          q(
            `En el almacén, un paquete de galletitas cuesta ${pesos} pesos con ${centavos} centavos. ¿Cómo se escribe en número decimal?`,
            choices.map((c) => ["🏷️", c]),
            choices.indexOf(`$${target}`),
            "Pista: los centavos van después de la coma."
          ),
          `m42021-${i}`,
          "",
          skills
        )
      );
    } else {
      const cm = randInt(15, 85);
      const m = randInt(1, 3);
      const decStr = `${m},${cm < 10 ? "0" + cm : cm} m`;
      const choices = shuffle([decStr, `${m * 10 + cm} m`, `${m},${cm * 2} m`]);
      acts.push(
        qToPick(
          q(
            `Una tabla de madera mide ${m} metros y ${cm} centímetros de largo. ¿Cuál es su medida expresada en metros con coma decimal?`,
            choices.map((c) => ["📏", c]),
            choices.indexOf(decStr),
            "Pista: 1 metro tiene 100 centímetros, por lo que cada centímetro es un centésimo de metro."
          ),
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
    const val = randInt(2, 9) + randInt(1, 9) / 10;
    const factor = pickOne([10, 100]);
    const res = Math.round(val * factor * 10) / 10;
    const choices = shuffle([String(res), String(res / 10), String(res * 10)]);
    acts.push(
      qToPick(
        q(
          `¿Cuánto da el cálculo ${val.toFixed(1).replace(".", ",")} × ${factor}?`,
          choices.map((c) => ["🧮", c.replace(".", ",")]),
          choices.indexOf(String(res)),
          `Pista: al multiplicar por ${factor}, la coma corre ${factor === 10 ? "un lugar" : "dos lugares"} a la derecha.`
        ),
        `m42022-${i}`,
        "",
        skills
      )
    );
  }
  return numbered(acts);
}

// Mundo 42023: Suma y resta de números decimales cotidianos
function buildMundo42023(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  const skills = ["m4-suma-resta-decimales"];
  for (let i = 0; i < 8; i++) {
    const p1 = randInt(120, 450) + 0.5;
    const p2 = randInt(80, 250) + 0.5;
    const total = p1 + p2;
    const choices = shuffle([`$${total.toFixed(2).replace(".", ",")}`, `$${(total + 10).toFixed(2).replace(".", ",")}`, `$${(total - 10).toFixed(2).replace(".", ",")}`]);
    acts.push(
      qToPick(
        q(
          `En la librería escolar, Lucía compró un cuaderno a $${p1.toFixed(2).replace(".", ",")} y una cartuchera a $${p2.toFixed(2).replace(".", ",")}. ¿Cuánto gastó en total?`,
          choices.map((c) => ["🧾", c]),
          choices.indexOf(`$${total.toFixed(2).replace(".", ",")}`),
          "Pista: sumá alineando las comas decimales."
        ),
        `m42023-${i}`,
        "",
        skills
      )
    );
  }
  return numbered(acts);
}

// ==========================================================================
// MÓDULO 4: GEOMETRÍA, MEDIDA Y ESTADÍSTICA (42024 - 42028)
// ==========================================================================

// Mundo 42024: Rectas paralelas, secantes y perpendiculares
function buildMundo42024(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  const skills = ["m4-rectas-angulos-rectos"];
  acts.push(
    makeClassify(
      "m42024-cla-1",
      "Clasificá las relaciones entre pares de rectas según su posición:",
      ["Paralelas (no se cortan)", "Perpendiculares (forman 90°)"],
      [
        { label: "Vías de un tren en un tramo recto", cat: 0 },
        { label: "Bordes opuestos de una regla", cat: 0 },
        { label: "Líneas de los renglones de una hoja", cat: 0 },
        { label: "Esquina donde se unen dos paredes", cat: 1 },
        { label: "Cruce de las calles San Martín y Roca en escuadra", cat: 1 },
        { label: "Los dos lados adyacentes de un marco de fotos", cat: 1 },
      ],
      "Pista: las perpendiculares forman una cruz con ángulos de 90°.",
      skills
    )
  );
  for (let i = 1; i < 8; i++) {
    const choices = shuffle([
      "Rectas perpendiculares",
      "Rectas paralelas",
      "Rectas secantes oblicuas",
    ]);
    acts.push(
      qToPick(
        q(
          "¿Cómo se llaman dos rectas que al cruzarse forman cuatro ángulos rectos de 90° exactos?",
          choices.map((c) => ["📐", c]),
          choices.indexOf("Rectas perpendiculares"),
          "Pista: se comprueban apoyando una escuadra en el punto de cruce."
        ),
        `m42024-${i}`,
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
  for (let i = 1; i < 8; i++) {
    const deg = pickOne([30, 45, 60, 90, 110, 120, 135, 150]);
    const name = deg === 90 ? "Ángulo recto" : deg < 90 ? "Ángulo agudo" : "Ángulo obtuso";
    const choices = shuffle(["Ángulo agudo", "Ángulo recto", "Ángulo obtuso"]);
    acts.push(
      qToPick(
        q(
          `Si al medir con el transportador la abertura de una figura encontramos exactamente ${deg}°, ¿qué clase de ángulo es?`,
          choices.map((c) => ["🧭", c]),
          choices.indexOf(name),
          "Pista: 90° es recto; menos de 90° es agudo; más de 90° es obtuso."
        ),
        `m42025-${i}`,
        "",
        skills
      )
    );
  }
  return numbered(acts);
}

// Mundo 42026: Triángulos: clasificación por lados y ángulos
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
      "Pista: equilátero tiene los tres lados de igual medida.",
      skills
    )
  );
  for (let i = 1; i < 8; i++) {
    const choices = shuffle([
      "Triángulo isósceles",
      "Triángulo equilátero",
      "Triángulo escaleno",
    ]);
    acts.push(
      qToPick(
        q(
          "Un banderín de campamento tiene dos lados de 25 cm y un lado de 15 cm. ¿Cómo se clasifica por sus lados?",
          choices.map((c) => ["🚩", c]),
          choices.indexOf("Triángulo isósceles"),
          "Pista: el triángulo que tiene exactamente dos lados de igual longitud es isósceles."
        ),
        `m42026-${i}`,
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
      "Clasificá estos cuerpos geométricos según su forma y bases:",
      ["Cubo (6 caras cuadradas iguales)", "Prisma rectangular (caja)"],
      [
        { label: "Dado tradicional de juegos de mesa", cat: 0 },
        { label: "Caja cúbica con todas sus aristas de 10 cm", cat: 0 },
        { label: "Caja de zapatos", cat: 1 },
        { label: "Ladrillo de construcción", cat: 1 },
        { label: "Caja de leche en polvo", cat: 1 },
      ],
      "Pista: el cubo tiene todas sus 6 caras cuadradas e idénticas.",
      skills
    )
  );
  for (let i = 1; i < 8; i++) {
    const choices = shuffle(["6 caras, 12 aristas y 8 vértices", "4 caras, 8 aristas y 4 vértices", "8 caras, 10 aristas y 6 vértices"]);
    acts.push(
      qToPick(
        q(
          "¿Cuántas caras, aristas y vértices tiene un cubo o un prisma rectangular?",
          choices.map((c) => ["🧊", c]),
          choices.indexOf("6 caras, 12 aristas y 8 vértices"),
          "Pista: tiene 6 caras planas (como las 6 caras de un dado) y 8 esquinas (vértices)."
        ),
        `m42027-${i}`,
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
  for (let i = 0; i < 8; i++) {
    if (i % 3 === 0) {
      const largo = randInt(15, 40);
      const ancho = randInt(10, 25);
      const perim = 2 * largo + 2 * ancho;
      acts.push(
        makeInput(
          `m42028-perim-${i}`,
          `Una huerta comunitaria rectangular mide ${largo} metros de largo por ${ancho} metros de ancho. ¿Cuántos metros de alambre se necesitan para dar una vuelta completa a su perímetro?`,
          perim,
          `Pista: sumá los 4 lados (${largo} + ${largo} + ${ancho} + ${ancho}).`,
          skills
        )
      );
    } else if (i % 3 === 1) {
      const kg = pickOne([2, 3, 5]);
      const g = kg * 1000;
      const choices = shuffle([`${g.toLocaleString("es-AR")} gramos`, `${(kg * 100).toLocaleString("es-AR")} gramos`, `${(kg * 10).toLocaleString("es-AR")} gramos`]);
      acts.push(
        qToPick(
          q(
            `Una bolsa de lana patagónica pesa ${kg} kilogramos. ¿A cuántos gramos equivale?`,
            choices.map((c) => ["⚖️", c]),
            choices.indexOf(`${g.toLocaleString("es-AR")} gramos`),
            "Pista: 1 kilogramo equivale exactamente a 1.000 gramos."
          ),
          `m42028-peso-${i}`,
          "",
          skills
        )
      );
    } else {
      const h = randInt(1, 3);
      const min = h * 60;
      const choices = shuffle([`${min} minutos`, `${min + 30} minutos`, `${min - 20} minutos`]);
      acts.push(
        qToPick(
          q(
            `Un viaje en micro desde Río Gallegos hasta Comandante Luis Piedra Buena dura ${h} horas. ¿Cuántos minutos dura el viaje?`,
            choices.map((c) => ["⏱️", c]),
            choices.indexOf(`${min} minutos`),
            "Pista: cada hora tiene 60 minutos."
          ),
          `m42028-tiempo-${i}`,
          "",
          skills
        )
      );
    }
  }
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

