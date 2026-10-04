// Actividades de Matemática de 4.º grado (26 mundos).
// Generadas con números al azar dentro del rango pedagógico del grado
// (números hasta el millón, números romanos, cálculo mental y estimación,
// organizaciones rectangulares, multiplicación por 2 cifras, división con resto,
// fracciones usuales y números mixtos, decimales en dinero y medida, geometría y perímetro).
import type { ActivitySpec } from "@/lib/activities";
import { WorldDef } from "@/types";
import {
  fromBank,
  makeInput,
  numberChoices,
  numbered,
  pickOne,
  q,
  qToPick,
  randInt,
  Q,
} from "./util";

// --------------------------------------------------------------------------
// Generadores específicos por mundo (1 a 26)
// --------------------------------------------------------------------------

// Mundo 1: Números hasta 10.000
function buildMundo1(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  const skills = ["m4-numeros-10000"];
  for (let i = 0; i < 8; i++) {
    if (i % 3 === 0) {
      const base = randInt(10, 89) * 100;
      const step = pickOne([100, 200, 500]);
      const missingIdx = randInt(1, 3);
      const seq = [base, base + step, base + step * 2, base + step * 3];
      const target = seq[missingIdx];
      const promptSeq = seq.map((v, idx) => (idx === missingIdx ? "___" : v.toLocaleString("es-AR"))).join(" — ");
      const choices = numberChoices(target, 3, 1000, 10000, step);
      acts.push(
        qToPick(
          q(
            `Completá la escala numérica ascendente:\n${promptSeq}`,
            choices.map((c) => ["🔢", c.toLocaleString("es-AR")]),
            choices.indexOf(target),
            `Pista: la escala avanza de ${step} en ${step}.`
          ),
          `m1-${i}`,
          "",
          skills
        )
      );
    } else if (i % 3 === 1) {
      const n = randInt(1001, 9998);
      const isPosterior = Math.random() > 0.5;
      const target = isPosterior ? n + 1 : n - 1;
      const choices = numberChoices(target, 3, 1000, 9999);
      acts.push(
        qToPick(
          q(
            `¿Cuál es el número ${isPosterior ? "posterior (el siguiente)" : "anterior"} de ${n.toLocaleString("es-AR")}?`,
            choices.map((c) => ["📍", c.toLocaleString("es-AR")]),
            choices.indexOf(target),
            `Pista: tenés que ${isPosterior ? "sumar 1" : "restar 1"}.`
          ),
          `m1-${i}`,
          "",
          skills
        )
      );
    } else {
      const m = randInt(1, 9);
      const c = randInt(0, 9);
      const d = randInt(0, 9);
      const u = randInt(0, 9);
      const target = m * 1000 + c * 100 + d * 10 + u;
      const choices = numberChoices(target, 3, 1000, 9999, 10);
      acts.push(
        qToPick(
          q(
            `¿Qué número se forma con ${m} unidades de mil, ${c} centenas, ${d} decenas y ${u} unidades?`,
            choices.map((x) => ["🏷️", x.toLocaleString("es-AR")]),
            choices.indexOf(target),
            "Pista: ubicá cada cifra en su orden de posición."
          ),
          `m1-${i}`,
          "",
          skills
        )
      );
    }
  }
  return numbered(acts);
}

// Mundo 2: La Familia de los 100.000
function buildMundo2(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  const skills = ["m4-numeros-100000"];
  for (let i = 0; i < 8; i++) {
    if (i % 2 === 0) {
      const target = randInt(12, 95) * 1000;
      const choices = numberChoices(target, 3, 10000, 99000, 1000);
      acts.push(
        qToPick(
          q(
            `Un camión que viaja por la Ruta 3 marcó ${target.toLocaleString("es-AR")} metros. ¿Cuál es ese valor?`,
            choices.map((c) => ["🛣️", `${c.toLocaleString("es-AR")} m`]),
            choices.indexOf(target),
            "Pista: prestá atención a la cifra de las decenas de mil."
          ),
          `m2-${i}`,
          "",
          skills
        )
      );
    } else {
      const a = randInt(20, 80) * 1000 + randInt(100, 900);
      const b = a + pickOne([-1000, 1000, -2000, 2000]);
      const mayor = Math.max(a, b);
      const choices = [a, b];
      acts.push(
        qToPick(
          q(
            `¿Cuál de estos dos números de cinco cifras es el mayor?`,
            choices.map((c) => ["📊", c.toLocaleString("es-AR")]),
            choices.indexOf(mayor),
            "Pista: compará primero las decenas de mil; si son iguales, mirá las unidades de mil."
          ),
          `m2-${i}`,
          "",
          skills
        )
      );
    }
  }
  return numbered(acts);
}

// Mundo 3: Números hasta el Millón
function buildMundo3(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  const skills = ["m4-numeros-millon"];
  const populations = [
    { city: "Río Gallegos", pop: 115000 },
    { city: "Caleta Olivia", pop: 65000 },
    { city: "Pico Truncado", pop: 25000 },
    { city: "El Calafate", pop: 28000 },
    { city: "Puerto Deseado", pop: 18000 },
    { city: "Toda la provincia de Santa Cruz", pop: 333000 },
  ];
  for (let i = 0; i < 8; i++) {
    if (i < 4) {
      const item = populations[i % populations.length];
      const choices = numberChoices(item.pop, 3, 10000, 500000, 5000);
      acts.push(
        qToPick(
          q(
            `En el censo, la población registrada de ${item.city} es de aproximadamente ${item.pop.toLocaleString("es-AR")} habitantes. Marcá la opción correcta.`,
            choices.map((c) => ["🏙️", `${c.toLocaleString("es-AR")} hab.`]),
            choices.indexOf(item.pop),
            "Pista: verificá la cantidad de ceros y el valor de las centenas de mil."
          ),
          `m3-${i}`,
          "",
          skills
        )
      );
    } else {
      const n = randInt(100, 899) * 1000;
      const choices = numberChoices(n, 3, 100000, 999000, 10000);
      acts.push(
        qToPick(
          q(
            `¿Qué número corresponde a ${Math.floor(n / 1000)} mil?`,
            choices.map((c) => ["🔢", c.toLocaleString("es-AR")]),
            choices.indexOf(n),
            "Pista: recordá que mil agrega tres ceros al número."
          ),
          `m3-${i}`,
          "",
          skills
        )
      );
    }
  }
  return numbered(acts);
}

// Mundo 4: Descomposición Aditiva y Multiplicativa
function buildMundo4(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  const skills = ["m4-descomposicion"];
  for (let i = 0; i < 8; i++) {
    const dm = randInt(2, 8);
    const um = randInt(1, 9);
    const c = randInt(1, 9);
    const d = randInt(1, 9);
    const u = randInt(1, 9);
    const num = dm * 10000 + um * 1000 + c * 100 + d * 10 + u;

    if (i % 2 === 0) {
      const correctExpr = `${dm * 10000} + ${um * 1000} + ${c * 100} + ${d * 10} + ${u}`;
      const wrong1 = `${dm * 1000} + ${um * 100} + ${c * 10} + ${d} + ${u}`;
      const wrong2 = `${dm * 10000} + ${um * 100} + ${c * 1000} + ${d * 10} + ${u}`;
      const options: [string, string][] = [
        ["🧮", correctExpr],
        ["📋", wrong1],
        ["🧩", wrong2],
      ];
      acts.push(
        qToPick(
          q(
            `¿Cuál es la descomposición aditiva del número ${num.toLocaleString("es-AR")}?`,
            options,
            0,
            "Pista: sumá el valor de cada cifra según su posición."
          ),
          `m4-${i}`,
          "",
          skills
        )
      );
    } else {
      const correctExpr = `${dm}×10.000 + ${um}×1.000 + ${c}×100 + ${d}×10 + ${u}`;
      const wrong1 = `${dm}×1.000 + ${um}×100 + ${c}×10 + ${d}×1 + ${u}`;
      const wrong2 = `${dm}×100.000 + ${um}×1.000 + ${c}×100 + ${d}×10 + ${u}`;
      const options: [string, string][] = [
        ["🧮", correctExpr],
        ["📋", wrong1],
        ["🧩", wrong2],
      ];
      acts.push(
        qToPick(
          q(
            `¿Con cuál de estos cálculos multiplicativos se forma el número ${num.toLocaleString("es-AR")}?`,
            options,
            0,
            "Pista: multiplicá cada cifra por 10.000, 1.000, 100 o 10 según su orden."
          ),
          `m4-${i}`,
          "",
          skills
        )
      );
    }
  }
  return numbered(acts);
}

// Mundo 5: Sistema Romano
function buildMundo5(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  const skills = ["m4-numeros-romanos"];
  const romanTable: [number, string][] = [
    [4, "IV"], [9, "IX"], [14, "XIV"], [19, "XIX"], [24, "XXIV"],
    [29, "XXIX"], [40, "XL"], [45, "XLV"], [50, "L"], [60, "LX"],
    [75, "LXXV"], [90, "XC"], [100, "C"], [150, "CL"], [200, "CC"],
    [400, "CD"], [500, "D"], [900, "CM"], [1000, "M"],
  ];
  for (let i = 0; i < 8; i++) {
    const item = romanTable[(i * 2 + randInt(0, 1)) % romanTable.length];
    if (i % 2 === 0) {
      // De arábigo a romano
      const wrong1 = item[1].length > 1 ? item[1].slice(1) + "I" : item[1] + "V";
      const wrong2 = "X" + item[1];
      const options: [string, string][] = [
        ["🏛️", item[1]],
        ["📜", wrong1],
        ["🏛️", wrong2],
      ];
      acts.push(
        qToPick(
          q(
            `¿Cómo se escribe el número ${item[0]} en numeración romana?`,
            options,
            0,
            "Pista: recordá los valores I=1, V=5, X=10, L=50, C=100, D=500, M=1.000."
          ),
          `m5-${i}`,
          "",
          skills
        )
      );
    } else {
      // De romano a arábigo
      const choices = numberChoices(item[0], 3, 1, 1500, 5);
      acts.push(
        qToPick(
          q(
            `El siglo o capítulo está escrito como «${item[1]}». ¿Qué número arábigo representa?`,
            choices.map((c) => ["🔢", String(c)]),
            choices.indexOf(item[0]),
            "Pista: sumá o restá los valores de los símbolos romanos."
          ),
          `m5-${i}`,
          "",
          skills
        )
      );
    }
  }
  return numbered(acts);
}

// Mundo 6: Cálculo Mental de Suma y Resta
function buildMundo6(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  const skills = ["m4-calculo-mental-sumaresta"];
  for (let i = 0; i < 8; i++) {
    if (i % 2 === 0) {
      const a = randInt(20, 70) * 100;
      const b = randInt(10, 40) * 100;
      const target = a + b;
      acts.push(
        makeInput(
          `m6-${i}`,
          `Calculá mentalmente la suma:\n${a.toLocaleString("es-AR")} + ${b.toLocaleString("es-AR")} =`,
          target,
          "Pista: sumá las centenas y agregá los ceros.",
          skills
        )
      );
    } else {
      const a = randInt(40, 90) * 100;
      const b = randInt(10, 30) * 100;
      const target = a - b;
      acts.push(
        makeInput(
          `m6-${i}`,
          `Calculá mentalmente la resta:\n${a.toLocaleString("es-AR")} - ${b.toLocaleString("es-AR")} =`,
          target,
          "Pista: restá las centenas y conservá los dos ceros.",
          skills
        )
      );
    }
  }
  return numbered(acts);
}

// Mundo 7: Estimación y Redondeo
function buildMundo7(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  const skills = ["m4-estimacion"];
  for (let i = 0; i < 8; i++) {
    const a = randInt(12, 48) * 100 + randInt(10, 90);
    const b = randInt(11, 39) * 100 + randInt(10, 90);
    const approxA = Math.round(a / 100) * 100;
    const approxB = Math.round(b / 100) * 100;
    const est = approxA + approxB;
    const choices = [est, est + 500, est - 400];
    acts.push(
      qToPick(
        q(
          `Si redondeamos a las centenas más cercanas para estimar una compra:\n${a.toLocaleString("es-AR")} ≈ ${approxA.toLocaleString("es-AR")}\n${b.toLocaleString("es-AR")} ≈ ${approxB.toLocaleString("es-AR")}\n¿Cuál es la estimación aproximada de ${a.toLocaleString("es-AR")} + ${b.toLocaleString("es-AR")}?`,
          choices.map((c) => ["🎯", `$${c.toLocaleString("es-AR")}`]),
          0,
          "Pista: sumá las centenas redondeadas."
        ),
        `m7-${i}`,
        "",
        skills
      )
    );
  }
  return numbered(acts);
}

// Mundo 8: Problemas de Varios Pasos
function buildMundo8(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  const skills = ["m4-problemas-pasos"];
  for (let i = 0; i < 8; i++) {
    const precioNafta = 850;
    const litros = randInt(20, 50);
    const gastoNafta = litros * precioNafta;
    const vianda = 3500;
    const totalGasto = gastoNafta + vianda;
    const billete = Math.ceil(totalGasto / 10000) * 10000 + 10000;
    const vuelto = billete - totalGasto;

    const choices = numberChoices(vuelto, 3, 500, 20000, 100);
    acts.push(
      qToPick(
        q(
          `Un viajero cargó ${litros} litros de combustible a $${precioNafta} cada litro y compró un almuerzo de $${vianda}. Si pagó con $${billete.toLocaleString("es-AR")}, ¿cuánto dinero le dieron de vuelto?`,
          choices.map((c) => ["💵", `$${c.toLocaleString("es-AR")}`]),
          choices.indexOf(vuelto),
          "Pista: primero calculá el gasto del combustible, sumale el almuerzo y restáselo al dinero entregado."
        ),
        `m8-${i}`,
        "",
        skills
      )
    );
  }
  return numbered(acts);
}

// Mundo 9: La Tabla Pitagórica y Propiedades
function buildMundo9(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  const skills = ["m4-tabla-pitagorica"];
  for (let i = 0; i < 8; i++) {
    const factor1 = randInt(4, 9);
    const factor2 = randInt(6, 9);
    const prod = factor1 * factor2;
    acts.push(
      makeInput(
        `m9-${i}`,
        `Calculá el producto usando la tabla pitagórica:\n${factor1} × ${factor2} =`,
        prod,
        "Pista: podés pensar en descomponer uno de los factores o usar dobles.",
        skills
      )
    );
  }
  return numbered(acts);
}

// Mundo 10: Organizaciones Rectangulares
function buildMundo10(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  const skills = ["m4-organizaciones-rectangulares"];
  for (let i = 0; i < 8; i++) {
    const filas = randInt(12, 25);
    const butacasPorFila = randInt(15, 30);
    const total = filas * butacasPorFila;
    if (i % 2 === 0) {
      acts.push(
        makeInput(
          `m10-${i}`,
          `En el salón del centro cultural de El Calafate hay ${filas} filas de sillas con ${butacasPorFila} asientos en cada fila. ¿Cuántas personas entran sentadas en total?`,
          total,
          "Pista: multiplicá la cantidad de filas por la cantidad de asientos de cada fila.",
          skills
        )
      );
    } else {
      acts.push(
        makeInput(
          `m10-${i}`,
          `En el gimnasio municipal colocaron ${total} baldosas distribuidas en ${filas} filas iguales. ¿Cuántas baldosas tiene cada fila?`,
          butacasPorFila,
          "Pista: dividí el total de baldosas por la cantidad de filas.",
          skills
        )
      );
    }
  }
  return numbered(acts);
}

// Mundo 11: Multiplicar por 10, 100 y 1.000
function buildMundo11(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  const skills = ["m4-multiplicacion-ceros"];
  for (let i = 0; i < 8; i++) {
    const n = randInt(15, 95);
    const mult = pickOne([10, 100, 1000]);
    const ans = n * mult;
    acts.push(
      makeInput(
        `m11-${i}`,
        `Multiplicá por la unidad seguida de ceros:\n${n} × ${mult.toLocaleString("es-AR")} =`,
        ans,
        `Pista: al multiplicar por ${mult}, agregás ${mult === 10 ? "un cero" : mult === 100 ? "dos ceros" : "tres ceros"} al final del número.`,
        skills
      )
    );
  }
  return numbered(acts);
}

// Mundo 12: Multiplicación por Dos Cifras
function buildMundo12(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  const skills = ["m4-multiplicacion-2cifras"];
  for (let i = 0; i < 8; i++) {
    const a = randInt(120, 350);
    const b = randInt(12, 28);
    const prod = a * b;
    const choices = numberChoices(prod, 3, 1000, 12000, a);
    acts.push(
      qToPick(
        q(
          `Una estancia patagónica empaquetó ${a} cajas de lana con ${b} ovillos cada una. ¿Cuántos ovillos hay en total?\n(${a} × ${b})`,
          choices.map((c) => ["📦", `${c.toLocaleString("es-AR")} ovillos`]),
          choices.indexOf(prod),
          "Pista: multiplicá primero por las unidades y luego por las decenas, y sumá ambos resultados."
        ),
        `m12-${i}`,
        "",
        skills
      )
    );
  }
  return numbered(acts);
}

// Mundo 13: División: Reparto y Partición
function buildMundo13(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  const skills = ["m4-division-reparto"];
  for (let i = 0; i < 8; i++) {
    const chicos = randInt(4, 8);
    const porChico = randInt(12, 35);
    const total = chicos * porChico;
    acts.push(
      makeInput(
        `m13-${i}`,
        `Se reparten ${total} libros de la biblioteca escolar entre ${chicos} aulas en partes iguales. ¿Cuántos libros recibe cada aula?`,
        porChico,
        "Pista: dividí el total de libros entre la cantidad de aulas.",
        skills
      )
    );
  }
  return numbered(acts);
}

// Mundo 14: División con Resto e Iteración
function buildMundo14(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  const skills = ["m4-division-resto-iteracion"];
  for (let i = 0; i < 8; i++) {
    const divisor = randInt(4, 9);
    const cociente = randInt(15, 30);
    const resto = randInt(1, divisor - 1);
    const dividendo = divisor * cociente + resto;

    if (i % 2 === 0) {
      acts.push(
        makeInput(
          `m14-${i}`,
          `Al dividir ${dividendo} entre ${divisor}:\n¿Cuál es el RESTO (lo que sobra)?`,
          resto,
          `Pista: calculá ${divisor} × ${cociente} = ${divisor * cociente} y fijate cuánto falta para llegar a ${dividendo}.`,
          skills
        )
      );
    } else {
      // Problema de iteración: transporte de personas
      const capacidadCombi = 8;
      const pasajeros = randInt(25, 45);
      const combisNecesarias = Math.ceil(pasajeros / capacidadCombi);
      acts.push(
        makeInput(
          `m14-${i}`,
          `Un grupo de ${pasajeros} turistas viaja al Glaciar Perito Moreno. Cada combi traslada hasta ${capacidadCombi} pasajeros. ¿Cuántas combis completas o con pasajeros se necesitan como mínimo para llevar a todos?`,
          combisNecesarias,
          "Pista: si sobran personas tras llenar las primeras combis, se necesita un vehículo más para que nadie quede afuera.",
          skills
        )
      );
    }
  }
  return numbered(acts);
}

// Mundo 15: División por 10, 100 y 1.000
function buildMundo15(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  const skills = ["m4-division-ceros"];
  for (let i = 0; i < 8; i++) {
    const cociente = randInt(12, 85);
    const div = pickOne([10, 100, 1000]);
    const num = cociente * div;
    acts.push(
      makeInput(
        `m15-${i}`,
        `Dividí por la unidad seguida de ceros:\n${num.toLocaleString("es-AR")} ÷ ${div.toLocaleString("es-AR")} =`,
        cociente,
        `Pista: quitá ${div === 10 ? "un cero" : div === 100 ? "dos ceros" : "tres ceros"} al dividendo.`,
        skills
      )
    );
  }
  return numbered(acts);
}

// Mundo 16: Fracciones Usuales: Mitades, Cuartos y Octavos
function buildMundo16(): ActivitySpec[] {
  const skills = ["m4-fracciones-usuales"];
  const questions: Q[] = [
    q("¿Cuántos vasos de 1/4 litro se necesitan para llenar una botella de 1 litro?", [["🥛", "4 vasos de 1/4 l"], ["🥛", "2 vasos de 1/4 l"], ["🥛", "8 vasos de 1/4 l"]], 0, "Pista: 4 cuartos forman un entero."),
    q("¿Cuántos paquetes de 1/2 kilo forman 1 kilo de yerba mate?", [["🧉", "2 paquetes de 1/2 kg"], ["🧉", "4 paquetes de 1/2 kg"], ["🧉", "1 paquete solo"]], 0, "Pista: dos mitades forman un kilo entero."),
    q("Si comí 2 porciones de una pizza cortada en 8 partes iguales, ¿qué fracción comí?", [["🍕", "2/8 (dos octavos)"], ["🍕", "1/4 de la pizza"], ["🍕", "1/2 de la pizza"]], 0, "Pista: el numerador indica las porciones comidas y el denominador el total de partes."),
    q("¿Cuántos cuartos (1/4) hay en medio litro (1/2)?", [["🥤", "2 cuartos"], ["🥤", "4 cuartos"], ["🥤", "1 cuarto"]], 0, "Pista: dos cuartos equivalen a una mitad."),
    q("Si tengo una tableta de chocolate de 4 barritas y como 3, ¿qué fracción comí?", [["🍫", "3/4 del chocolate"], ["🍫", "1/4 del chocolate"], ["🍫", "4/3 del chocolate"]], 0, "Pista: comiste 3 de las 4 partes."),
    q("¿Cuál fracción representa la mitad exacta de un entero?", [["⚖️", "1/2"], ["⚖️", "1/4"], ["⚖️", "1/8"]], 0, "Pista: uno sobre dos."),
    q("Si en una botella de 1 litro queda 1/4 litro, ¿cuánto se consumió?", [["💧", "3/4 litro"], ["💧", "1/2 litro"], ["💧", "1/4 litro"]], 0, "Pista: a 4/4 le restás 1/4."),
    q("¿Cuántos octavos (1/8) forman un cuarto (1/4)?", [["📏", "2 octavos"], ["📏", "4 octavos"], ["📏", "1 octavo"]], 0, "Pista: 2/8 = 1/4."),
  ];
  return fromBank(questions, 8, "m16", skills);
}

// Mundo 17: Fracciones Mayores que el Entero y Números Mixtos
function buildMundo17(): ActivitySpec[] {
  const skills = ["m4-fracciones-mixtas"];
  const questions: Q[] = [
    q("Si compré 5 paquetes de 1/4 kilo de café, ¿cuánto café tengo en total?", [["☕", "1 kilo y 1/4 (5/4 kg)"], ["☕", "2 kilos y medio"], ["☕", "3/4 de kilo"]], 0, "Pista: 4 cuartos hacen 1 kilo, y sobra 1 cuarto."),
    q("¿A qué número mixto equivale la fracción 3/2 de litro de leche?", [["🥛", "1 y 1/2 litro"], ["🥛", "2 y 1/2 litros"], ["🥛", "3 litros enteros"]], 0, "Pista: 2/2 es 1 entero, más 1/2."),
    q("En una receta usamos 6 cuartos de kilo de harina. ¿A cuántos kilos equivale?", [["🌾", "1 y 1/2 kilo (1 2/4)"], ["🌾", "2 kilos completos"], ["🌾", "3/4 de kilo"]], 0, "Pista: 6/4 es 1 entero y 2/4, que es medio kilo más."),
    q("¿Cuál de estas fracciones es MAYOR que 1 entero?", [["📈", "5/4"], ["📉", "3/4"], ["📉", "1/2"]], 0, "Pista: el numerador debe ser mayor que el denominador."),
    q("Si compramos 9 botellas de 1/2 litro de agua, ¿cuántos litros tenemos en total?", [["💧", "4 y 1/2 litros (9/2 l)"], ["💧", "5 litros justos"], ["💧", "3 y 1/2 litros"]], 0, "Pista: cada 2 botellas de 1/2 litro forman 1 litro."),
    q("¿Cómo se escribe 2 enteros y un cuarto en fracción impropia?", [["✍️", "9/4"], ["✍️", "7/4"], ["✍️", "5/4"]], 0, "Pista: 2 enteros son 8 cuartos, más 1 cuarto."),
    q("Si una jarra contiene 7/4 litros de jugo, ¿cuánto contiene?", [["🍹", "1 litro y 3/4"], ["🍹", "2 litros y 1/4"], ["🍹", "7 litros"]], 0, "Pista: 4/4 es un litro, más 3/4 sobrantes."),
    q("¿Cuál de las siguientes cantidades es menor que 1 entero?", [["📉", "2/4"], ["📈", "5/4"], ["📈", "3/2"]], 0, "Pista: su numerador es menor que su denominador."),
  ];
  return fromBank(questions, 8, "m17", skills);
}

// Mundo 18: Fracciones Equivalentes y Comparación
function buildMundo18(): ActivitySpec[] {
  const skills = ["m4-fracciones-equivalentes"];
  const questions: Q[] = [
    q("¿Qué fracción es equivalente a 1/2?", [["⚖️", "2/4"], ["⚖️", "1/4"], ["⚖️", "3/8"]], 0, "Pista: dos cuartos cubren la misma superficie que un medio."),
    q("¿Qué fracción es equivalente a 2/8?", [["⚖️", "1/4"], ["⚖️", "1/2"], ["⚖️", "3/4"]], 0, "Pista: simplificá dividiendo numerador y denominador por 2."),
    q("¿Cuál fracción es MAYOR: 3/4 o 1/2?", [["📊", "3/4 es mayor que 1/2"], ["📊", "1/2 es mayor que 3/4"], ["📊", "Son iguales"]], 0, "Pista: 1/2 equivale a 2/4; 3/4 tiene un cuarto más."),
    q("¿Qué fracción es equivalente a 4/8?", [["⚖️", "1/2"], ["⚖️", "1/4"], ["⚖️", "3/4"]], 0, "Pista: 4 es la mitad exacta de 8."),
    q("Si Lucas comió 2/4 de tarta y Ana comió 4/8 de la misma tarta, ¿quién comió más?", [["🍰", "Comieron exactamente lo mismo"], ["🍰", "Lucas comió más"], ["🍰", "Ana comió más"]], 0, "Pista: 2/4 y 4/8 son fracciones equivalentes a 1/2."),
    q("¿Cuál fracción es MENOR: 1/8 o 1/4?", [["🔍", "1/8 es menor"], ["🔍", "1/4 es menor"], ["🔍", "Son iguales"]], 0, "Pista: al dividir el entero en más partes (8), cada porción es más chica."),
    q("¿Cuántos octavos equivalen a 3/4?", [["📏", "6/8"], ["📏", "5/8"], ["📏", "4/8"]], 0, "Pista: multiplicá numerador y denominador de 3/4 por 2."),
    q("¿Es verdadero que 1/2 es igual a 5/10?", [["✅", "Verdadero: 5 es la mitad de 10"], ["❌", "Falso: 5/10 es mayor"], ["❌", "Falso: 1/2 es mayor"]], 0, "Pista: ambas representan la mitad del entero."),
  ];
  return fromBank(questions, 8, "m18", skills);
}

// Mundo 19: Suma y Resta Mental de Fracciones
function buildMundo19(): ActivitySpec[] {
  const skills = ["m4-calculo-fracciones"];
  const questions: Q[] = [
    q("Calculá mentalmente la suma:\n1/4 + 1/4 =", [["➕", "2/4 (o 1/2)"], ["➕", "2/8"], ["➕", "1/8"]], 0, "Pista: sumás los numeradores y mantenés el denominador 4."),
    q("Calculá mentalmente:\n1/2 + 1/4 =", [["➕", "3/4"], ["➕", "2/6"], ["➕", "1/4"]], 0, "Pista: pensá 1/2 como 2/4, y sumale 1/4."),
    q("A un kilo entero de helado le sacamos 1/4 kilo. ¿Cuánto queda?\n1 - 1/4 =", [["🍨", "3/4 kilo"], ["🍨", "1/2 kilo"], ["🍨", "2/4 kilo"]], 0, "Pista: 1 entero son 4/4; restale 1/4."),
    q("Calculá la suma:\n3/8 + 2/8 =", [["➕", "5/8"], ["➕", "5/16"], ["➕", "1/8"]], 0, "Pista: sumá 3 + 2 conservando el denominador 8."),
    q("Si sumamos 3/4 + 1/4, ¿qué obtenemos?", [["🏆", "4/4 (1 entero completo)"], ["🥈", "4/8"], ["🥉", "2/4"]], 0, "Pista: 3 cuartos más 1 cuarto forman los 4 cuartos del entero."),
    q("Calculá la resta:\n3/4 - 1/2 =", [["➖", "1/4"], ["➖", "2/2"], ["➖", "1/2"]], 0, "Pista: 1/2 equivale a 2/4; restá 3/4 - 2/4."),
    q("En una merienda se consumieron 2/8 de tarta y luego 3/8 más. ¿Cuánto se consumió en total?", [["🥧", "5/8 de la tarta"], ["🥧", "5/16 de la tarta"], ["🥧", "6/8 de la tarta"]], 0, "Pista: 2/8 + 3/8."),
    q("Si tenemos 1 entero y le sumamos 1/2, ¿cuánto tenemos?", [["🥛", "1 y 1/2 (o 3/2)"], ["🥛", "2 enteros"], ["🥛", "1/4"]], 0, "Pista: un entero más su mitad."),
  ];
  return fromBank(questions, 8, "m19", skills);
}

// Mundo 20: Decimales en Dinero y Medida
function buildMundo20(): ActivitySpec[] {
  const skills = ["m4-decimales-dinero"];
  const questions: Q[] = [
    q("¿Qué indica la cifra después de la coma en un precio como $15,50?", [["🪙", "50 centavos (la parte menor que un peso)"], ["💵", "50 pesos enteros"], ["🏷️", "El número de factura"]], 0, "Pista: los centavos van después de la coma."),
    q("Un listón de madera de lenga mide 1,75 m. ¿Qué significa ese valor?", [["📏", "1 metro y 75 centímetros"], ["📏", "175 metros de largo"], ["📏", "17 metros y medio"]], 0, "Pista: 1 metro tiene 100 centímetros."),
    q("¿Cómo se escribe con números decimales 'dos pesos con veinticinco centavos'?", [["💵", "$2,25"], ["💵", "$22,5"], ["💵", "$2,025"]], 0, "Pista: dos enteros y 25 centésimos."),
    q("Si un paquete de galletitas cuesta $85,00 y otro $85,50, ¿cuál es más caro?", [["🍪", "$85,50 es más caro por los 50 centavos"], ["🍪", "$85,00 es más caro"], ["🍪", "Cuestan lo mismo"]], 0, "Pista: 50 centavos es mayor que 0 centavos."),
    q("Un atleta en Santa Cruz corrió 2,5 km. ¿A cuántos metros equivale?", [["🏃", "2.500 metros"], ["🏃", "250 metros"], ["🏃", "25.000 metros"]], 0, "Pista: 1 km equivale a 1.000 m; 2,5 km son 2.500 m."),
    q("¿Cuántas monedas de 50 centavos ($0,50) se necesitan para juntar $1,00?", [["🪙", "2 monedas"], ["🪙", "4 monedas"], ["🪙", "10 monedas"]], 0, "Pista: 50 + 50 = 100 centavos = 1 peso."),
    q("¿Cómo se escribe 'cincuenta centavos' en pesos con coma?", [["💵", "$0,50"], ["💵", "$5,00"], ["💵", "$0,05"]], 0, "Pista: no llega a 1 peso, tiene cero enteros."),
    q("Una bolsa de manzanas pesa 1,5 kg. ¿A cuántos gramos equivale?", [["🍎", "1.500 gramos"], ["🍎", "150 gramos"], ["🍎", "15.000 gramos"]], 0, "Pista: 1 kg son 1.000 g; medio kilo son 500 g."),
  ];
  return fromBank(questions, 8, "m20", skills);
}

// Mundo 21: Décimos y Centésimos
function buildMundo21(): ActivitySpec[] {
  const skills = ["m4-decimos-centesimos"];
  const questions: Q[] = [
    q("¿A qué fracción decimal equivale 0,1?", [["🔢", "1/10 (un décimo)"], ["🔢", "1/100 (un centésimo)"], ["🔢", "1/1000"]], 0, "Pista: un décimo ocupa el primer lugar tras la coma."),
    q("¿A qué fracción decimal equivale 0,01?", [["🔢", "1/100 (un centésimo)"], ["🔢", "1/10 (un décimo)"], ["🔢", "1/2"]], 0, "Pista: el centésimo ocupa el segundo lugar tras la coma."),
    q("¿Cuántos décimos (0,1) forman una unidad entera (1)?", [["🔟", "10 décimos"], ["🔟", "100 décimos"], ["🔟", "2 décimos"]], 0, "Pista: 10 × 0,1 = 1."),
    q("¿Cuántos centésimos (0,01) forman una unidad entera (1)?", [["💯", "100 centésimos"], ["💯", "10 centésimos"], ["💯", "1.000 centésimos"]], 0, "Pista: 100 × 0,01 = 1."),
    q("¿Qué número decimal representa 3 décimos?", [["✍️", "0,3"], ["✍️", "0,03"], ["✍️", "3,0"]], 0, "Pista: 3 en el lugar de los décimos."),
    q("¿Qué número decimal representa 25 centésimos?", [["✍️", "0,25"], ["✍️", "2,5"], ["✍️", "0,025"]], 0, "Pista: 25 partes de 100."),
    q("¿Cuál es mayor: 0,3 o 0,08?", [["⚖️", "0,3 es mayor (son 30 centésimos frente a 8)"], ["⚖️", "0,08 es mayor"], ["⚖️", "Son iguales"]], 0, "Pista: compará la cifra de los décimos: 3 es mayor que 0."),
    q("¿Cuántos centavos hay en 4 décimos de peso ($0,40)?", [["🪙", "40 centavos"], ["🪙", "4 centavos"], ["🪙", "400 centavos"]], 0, "Pista: cada décimo de peso son 10 centavos."),
  ];
  return fromBank(questions, 8, "m21", skills);
}

// Mundo 22: Comparar y Sumar Decimales
function buildMundo22(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  const skills = ["m4-comparar-sumar-decimales"];
  for (let i = 0; i < 8; i++) {
    if (i % 2 === 0) {
      const enteroA = randInt(2, 8);
      const centA = pickOne([20, 50, 75]);
      const enteroB = randInt(1, 5);
      const centB = pickOne([25, 50]);
      const suma = (enteroA * 100 + centA + enteroB * 100 + centB) / 100;
      const sumaStr = suma.toFixed(2).replace(".", ",");
      const aStr = `${enteroA},${centA}`;
      const bStr = `${enteroB},${centB}`;
      const wrong1 = (suma + 1).toFixed(2).replace(".", ",");
      const wrong2 = (suma - 0.5).toFixed(2).replace(".", ",");
      const options: [string, string][] = [
        ["🛒", `$${sumaStr}`],
        ["🏷️", `$${wrong1}`],
        ["🧾", `$${wrong2}`],
      ];
      acts.push(
        qToPick(
          q(
            `En el almacén compramos dos productos:\n$${aStr} + $${bStr}\n¿Cuánto gastamos en total?`,
            options,
            0,
            "Pista: sumá los enteros y luego los centavos."
          ),
          `m22-${i}`,
          "",
          skills
        )
      );
    } else {
      const p1 = pickOne([4.8, 3.75, 6.5, 9.2]);
      const p2 = pickOne([4.08, 3.8, 6.05, 9.15]);
      const mayor = Math.max(p1, p2);
      const p1Str = p1.toFixed(2).replace(".", ",");
      const p2Str = p2.toFixed(2).replace(".", ",");
      const options: [string, string][] = [
        ["🏷️", `$${p1Str}`],
        ["🏷️", `$${p2Str}`],
      ];
      const ansIdx = mayor === p1 ? 0 : 1;
      acts.push(
        qToPick(
          q(
            `¿Cuál de estos dos precios es el MAYOR?\n$${p1Str} o $${p2Str}`,
            options,
            ansIdx,
            "Pista: compará primero los décimos si los enteros son iguales."
          ),
          `m22-${i}`,
          "",
          skills
        )
      );
    }
  }
  return numbered(acts);
}

// Mundo 23: Rectas Paralelas, Perpendiculares y Ángulos
function buildMundo23(): ActivitySpec[] {
  const skills = ["m4-rectas-angulos"];
  const questions: Q[] = [
    q("¿Cómo se llaman dos rectas que nunca se cruzan ni se tocan, por más que se prolonguen?", [["📏", "Rectas paralelas"], ["📐", "Rectas perpendiculares"], ["✂️", "Rectas secantes"]], 0, "Pista: van en la misma dirección como las vías del tren."),
    q("¿Cómo se llaman dos rectas que al cruzarse forman 4 ángulos rectos de 90°?", [["📐", "Rectas perpendiculares"], ["📏", "Rectas paralelas"], ["〰️", "Líneas curvas"]], 0, "Pista: forman una cruz perfecta o esquina de hoja."),
    q("¿Cuánto mide exactamente un ángulo recto?", [["📐", "90 grados (90°)"], ["📐", "180 grados (180°)"], ["📐", "45 grados (45°)"]], 0, "Pista: es el ángulo de la esquina de una hoja o de una escuadra."),
    q("¿Cómo se clasifica un ángulo que mide MENOS de 90°?", [["📐", "Ángulo agudo"], ["📐", "Ángulo obtuso"], ["📐", "Ángulo llano"]], 0, "Pista: es más cerrado que el ángulo recto."),
    q("¿Cómo se clasifica un ángulo que mide MÁS de 90° y menos de 180°?", [["📐", "Ángulo obtuso"], ["📐", "Ángulo agudo"], ["📐", "Ángulo recto"]], 0, "Pista: es más abierto que el ángulo recto."),
    q("¿Qué instrumento de geometría se usa para comprobar si un ángulo es recto?", [["📐", "La escuadra"], ["📏", "La regla común"], ["🧭", "El compás"]], 0, "Pista: sus dos catetos forman exactamente 90°."),
    q("¿Qué instrumento sirve para medir cuántos grados tiene cualquier ángulo?", [["🧭", "El transportador semicircular"], ["📏", "La cinta métrica"], ["⚖️", "La balanza"]], 0, "Pista: tiene una escala curva graduada de 0° a 180°."),
    q("Cuando el reloj marca las 3:00 en punto, ¿qué ángulo forman sus agujas?", [["🕒", "Un ángulo recto de 90°"], ["🕒", "Un ángulo agudo cerrado"], ["🕒", "Un ángulo obtuso muy abierto"]], 0, "Pista: la aguja horaria apunta al 3 y el minutero al 12."),
  ];
  return fromBank(questions, 8, "m23", skills);
}

// Mundo 24: Triángulos y Cuadriláteros
function buildMundo24(): ActivitySpec[] {
  const skills = ["m4-triangulos-cuadrilateros"];
  const questions: Q[] = [
    q("¿Cómo se llama el triángulo que tiene sus 3 LADOS de IGUAL longitud?", [["🔺", "Triángulo equilátero"], ["🔺", "Triángulo isósceles"], ["🔺", "Triángulo escaleno"]], 0, "Pista: equi significa igual."),
    q("¿Cómo se llama el triángulo que tiene 2 LADOS IGUALES y uno diferente?", [["🔺", "Triángulo isósceles"], ["🔺", "Triángulo equilátero"], ["🔺", "Triángulo escaleno"]], 0, "Pista: tiene dos lados gemelos."),
    q("¿Cómo se llama el triángulo que tiene sus 3 LADOS de DISTINTA longitud?", [["🔺", "Triángulo escaleno"], ["🔺", "Triángulo equilátero"], ["🔺", "Triángulo isósceles"]], 0, "Pista: ninguno de sus tres lados mide lo mismo."),
    q("¿Qué características definen a un CUADRADO?", [["🟦", "4 lados iguales y 4 ángulos rectos (90°)"], ["🟦", "Lados desiguales y ángulos agudos"], ["🟦", "3 lados rectos y 1 curvo"]], 0, "Pista: todos sus lados y sus ángulos son iguales."),
    q("¿En qué se diferencian un rectángulo y un cuadrado?", [["📐", "El rectángulo tiene lados opuestos iguales de a pares; el cuadrado tiene los 4 iguales"], ["📐", "El rectángulo no tiene ángulos rectos"], ["📐", "El cuadrado tiene 5 lados"]], 0, "Pista: en el rectángulo hay dos lados largos y dos lados cortos."),
    q("¿Cuántos vértices y lados tiene cualquier cuadrilátero?", [["🔷", "4 lados y 4 vértices"], ["🔷", "3 lados y 3 vértices"], ["🔷", "5 lados y 5 vértices"]], 0, "Pista: cuadri indica cuatro."),
    q("Si un triángulo tiene un ángulo recto de 90°, ¿cómo se llama según sus ángulos?", [["🔺", "Triángulo rectángulo"], ["🔺", "Triángulo acutángulo"], ["🔺", "Triángulo obtusángulo"]], 0, "Pista: contiene un ángulo recto."),
    q("¿Cuántos lados tiene un triángulo?", [["🔺", "3 lados"], ["🔺", "4 lados"], ["🔺", "2 lados"]], 0, "Pista: tri indica tres."),
  ];
  return fromBank(questions, 8, "m24", skills);
}

// Mundo 25: Circunferencia, Círculo y Cuerpos 3D
function buildMundo25(): ActivitySpec[] {
  const skills = ["m4-circunferencia-cuerpos"];
  const questions: Q[] = [
    q("¿Qué diferencia hay entre circunferencia y círculo?", [["⚪", "La circunferencia es solo el borde curvo; el círculo es el borde más toda la superficie interior"], ["⚪", "Son dos palabras para lo mismo"], ["⚪", "La circunferencia es un cuadrado"]], 0, "Pista: el círculo incluye el área rellena."),
    q("¿Cómo se llama el segmento que une el centro con cualquier punto del borde de la circunferencia?", [["📍", "El radio"], ["📏", "El diámetro"], ["📐", "La arista"]], 0, "Pista: el radio mide la mitad del diámetro."),
    q("¿Cómo se llama el segmento que cruza de lado a lado pasando por el centro?", [["📏", "El diámetro"], ["📍", "El radio"], ["🧱", "El vértice"]], 0, "Pista: equivale a dos radios juntos."),
    q("¿Qué instrumento se utiliza para trazar circunferencias perfectas?", [["🧭", "El compás"], ["📏", "La regla recta"], ["📐", "La escuadra"]], 0, "Pista: tiene una punta fija y una mina de grafito."),
    q("¿Cuántas caras, aristas y vértices tiene un CUBO?", [["🎲", "6 caras cuadradas, 12 aristas y 8 vértices"], ["🎲", "4 caras, 8 aristas y 6 vértices"], ["🎲", "8 caras y 12 vértices"]], 0, "Pista: pensá en un dado de juego."),
    q("¿Cómo son las caras laterales de un prisma de base rectangular?", [["📦", "Son rectángulos"], ["📦", "Son círculos"], ["📦", "Son triángulos"]], 0, "Pista: las paredes del prisma son rectangulares."),
    q("¿Qué son las ARISTAS de un cuerpo geométrico?", [["🧱", "Las líneas donde se unen dos caras"], ["🧱", "Las puntas o esquinas"], ["🧱", "Las caras planas"]], 0, "Pista: son los bordes que unen las caras."),
    q("¿Qué son los VÉRTICES de un cuerpo geométrico?", [["📍", "Los puntos de esquina donde se unen las aristas"], ["📍", "Las caras del fondo"], ["📍", "Las líneas rectas"]], 0, "Pista: son las esquinas puntudas del cuerpo."),
  ];
  return fromBank(questions, 8, "m25", skills);
}

// Mundo 26: Medidas y el Gran Desafío del Perímetro
function buildMundo26(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  const skills = ["m4-medidas-perimetro"];
  for (let i = 0; i < 8; i++) {
    if (i < 4) {
      // Perímetro de rectángulo o triángulo
      if (i % 2 === 0) {
        const largo = randInt(15, 40);
        const ancho = randInt(8, 20);
        const perimetro = 2 * (largo + ancho);
        acts.push(
          makeInput(
            `m26-${i}`,
            `Una cancha de fútbol escolar en Río Gallegos mide ${largo} m de largo por ${ancho} m de ancho. ¿Cuál es su PERÍMETRO (el contorno total)?`,
            perimetro,
            "Pista: sumá los cuatro lados: largo + ancho + largo + ancho.",
            skills
          )
        );
      } else {
        const lado = randInt(12, 30);
        const perimetro = lado * 4;
        acts.push(
          makeInput(
            `m26-${i}`,
            `Un cantero cuadrado de calafates en el jardín mide ${lado} m de lado. ¿Cuál es su perímetro total?`,
            perimetro,
            "Pista: como el cuadrado tiene 4 lados iguales, multiplicá el lado por 4.",
            skills
          )
        );
      }
    } else {
      // Equivalencias métricas
      const km = randInt(3, 15);
      const metros = km * 1000;
      acts.push(
        makeInput(
          `m26-${i}`,
          `Un sendero de montaña en El Chaltén tiene una distancia de ${km} kilómetros. ¿A cuántos METROS equivale?\n(${km} km = ___ m)`,
          metros,
          "Pista: 1 kilómetro equivale a 1.000 metros.",
          skills
        )
      );
    }
  }
  return numbered(acts);
}

// --------------------------------------------------------------------------
// Despachador principal de Matemática
// --------------------------------------------------------------------------
export function buildMatematicaActivities(world: WorldDef): ActivitySpec[] {
  const n = world.worldNumber ?? 1;
  switch (n) {
    case 1:
      return buildMundo1();
    case 2:
      return buildMundo2();
    case 3:
      return buildMundo3();
    case 4:
      return buildMundo4();
    case 5:
      return buildMundo5();
    case 6:
      return buildMundo6();
    case 7:
      return buildMundo7();
    case 8:
      return buildMundo8();
    case 9:
      return buildMundo9();
    case 10:
      return buildMundo10();
    case 11:
      return buildMundo11();
    case 12:
      return buildMundo12();
    case 13:
      return buildMundo13();
    case 14:
      return buildMundo14();
    case 15:
      return buildMundo15();
    case 16:
      return buildMundo16();
    case 17:
      return buildMundo17();
    case 18:
      return buildMundo18();
    case 19:
      return buildMundo19();
    case 20:
      return buildMundo20();
    case 21:
      return buildMundo21();
    case 22:
      return buildMundo22();
    case 23:
      return buildMundo23();
    case 24:
      return buildMundo24();
    case 25:
      return buildMundo25();
    case 26:
      return buildMundo26();
    default:
      return buildMundo1();
  }
}
