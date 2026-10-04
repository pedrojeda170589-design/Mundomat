// scripts/test-cuentos.ts
// Validador integral de las preguntas de comprensión de 1.º, 2.º y 3.º grado.
import { ORDEN_G1, ORDEN_G2, ORDEN_G3, STORY_BASE, storyWorldId } from "../src/lib/cuentos/recorrido";
import { getCuento } from "../src/lib/cuentos/catalogo";
import { PREGUNTAS_G1 } from "../src/lib/cuentos/preguntas-g1";
import { PREGUNTAS_G2 } from "../src/lib/cuentos/preguntas-g2";
import { PREGUNTAS_G3 } from "../src/lib/cuentos/preguntas-g3";
import { buildStoryActivities } from "../src/lib/cuentos/actividades";
import type { CuentoQuestion, ComprehensionKind } from "../src/lib/cuentos/tipos";
import type { WorldDef } from "../src/types";

let errors = 0;

function err(msg: string) {
  console.error("❌ " + msg);
  errors++;
}

function checkQuestions(
  grade: number,
  storyId: string,
  qs: CuentoQuestion[],
  expectedTotal: number,
  ruleOpts: (q: CuentoQuestion) => boolean,
  minFourOpts: number,
  expectedKinds: Record<string, number>
) {
  if (!qs || qs.length !== expectedTotal) {
    err(`[G${grade}:${storyId}] Cantidad de preguntas incorrecta: hay ${qs?.length ?? 0}, se esperaban ${expectedTotal}`);
    return;
  }

  let fourOptCount = 0;
  const kindsCount: Record<string, number> = {};

  qs.forEach((q, i) => {
    const qid = `[G${grade}:${storyId}:P${i + 1}]`;

    // Hint
    if (!q.hint || !q.hint.startsWith("Pista: ")) {
      err(`${qid} 'hint' debe comenzar con 'Pista: ', vino: '${q.hint}'`);
    }

    // Options rule
    if (!ruleOpts(q)) {
      err(`${qid} Opciones inválidas (${q.options?.length}): no cumple la regla de cantidad para grado ${grade}`);
    }

    if (q.options.length === 4) {
      fourOptCount++;
    }

    // Answer range
    if (q.answer < 0 || q.answer >= q.options.length) {
      err(`${qid} 'answer' (${q.answer}) fuera de rango para ${q.options.length} opciones`);
    }

    // Unique options
    const labels = q.options.map(([_, lbl]) => lbl.trim().toLowerCase());
    const unique = new Set(labels);
    if (unique.size !== labels.length) {
      err(`${qid} Opciones repetidas en la misma pregunta: ${labels.join(" | ")}`);
    }

    // Kind counting
    kindsCount[q.kind] = (kindsCount[q.kind] ?? 0) + 1;
  });

  if (fourOptCount < minFourOpts) {
    err(`[G${grade}:${storyId}] Faltan preguntas con 4 opciones: hay ${fourOptCount}, mínimo ${minFourOpts}`);
  }

  // Kind distribution check
  for (const [k, exp] of Object.entries(expectedKinds)) {
    if (k === "critica") {
      // estructura o valoracion
      const got = (kindsCount["estructura"] ?? 0) + (kindsCount["valoracion"] ?? 0);
      if (got !== exp) {
        err(`[G${grade}:${storyId}] Distribución de 'estructura'/'valoracion': hay ${got}, se esperaban ${exp}`);
      }
    } else {
      const got = kindsCount[k] ?? 0;
      if (got !== exp) {
        err(`[G${grade}:${storyId}] Distribución de '${k}': hay ${got}, se esperaban ${exp}`);
      }
    }
  }
}

console.log("=== Validando Preguntas de 1.º Grado ===");
for (const sid of ORDEN_G1) {
  checkQuestions(
    1,
    sid,
    PREGUNTAS_G1[sid],
    7,
    (q) => q.options.length === 3,
    0,
    {} // G1 tiene 7 preguntas con 3 opciones
  );
}

console.log("=== Validando Preguntas de 2.º Grado ===");
for (const sid of ORDEN_G2) {
  checkQuestions(
    2,
    sid,
    PREGUNTAS_G2[sid],
    8,
    (q) => q.options.length === 3 || q.options.length === 4,
    3, // al menos 3 con 4 opciones
    {
      literal: 2,
      secuencia: 2,
      inferencial: 2,
      vocabulario: 1,
      critica: 1, // 1 estructura o valoracion
    }
  );
}

console.log("=== Validando Preguntas de 3.º Grado ===");
for (const sid of ORDEN_G3) {
  checkQuestions(
    3,
    sid,
    PREGUNTAS_G3[sid],
    10,
    (q) => q.options.length === 4, // estrictamente 4 opciones
    10,
    {
      literal: 2,
      secuencia: 2,
      inferencial: 3,
      vocabulario: 1,
      estructura: 1,
      valoracion: 1,
    }
  );
}

console.log("=== Validando balance de longitud de opciones (máximo 35% la más larga) ===");
function checkOptionLengths(grade: number, map: Record<string, CuentoQuestion[]>, maxRatio: number = 0.35) {
  let total = 0;
  let strictLongest = 0;
  for (const [, qs] of Object.entries(map)) {
    for (let i = 0; i < qs.length; i++) {
      const q = qs[i];
      total++;
      const ansLen = q.options[q.answer][1].trim().length;
      const otherLens = q.options
        .filter((_, idx) => idx !== q.answer)
        .map((opt) => opt[1].trim().length);
      const maxOther = Math.max(...otherLens);
      if (ansLen > maxOther) {
        strictLongest++;
      }
    }
  }
  const ratio = total > 0 ? strictLongest / total : 0;
  const pct = (ratio * 100).toFixed(1);
  console.log(`[G${grade}] Total: ${total} preguntas, la correcta es la más larga en: ${strictLongest} (${pct}%)`);
  if (ratio > maxRatio) {
    err(`[G${grade}] El porcentaje de preguntas donde la respuesta correcta es la más larga (${pct}%) supera el máximo permitido (${(maxRatio * 100).toFixed(0)}%)`);
  }
}

checkOptionLengths(1, PREGUNTAS_G1, 0.35);
checkOptionLengths(2, PREGUNTAS_G2, 0.35);
checkOptionLengths(3, PREGUNTAS_G3, 0.35);

console.log("=== Validando buildStoryActivities en Mundos de Cuentos ===");
const grades = [1, 2, 3] as const;
for (const g of grades) {
  const order = g === 1 ? ORDEN_G1 : g === 2 ? ORDEN_G2 : ORDEN_G3;
  const expQs = g === 1 ? 7 : g === 2 ? 8 : 10;
  order.forEach((sid, idx) => {
    const wid = STORY_BASE[g] + idx + 1;
    const c = getCuento(sid);
    if (!c) {
      err(`Cuento no encontrado: ${sid}`);
      return;
    }
    const world: WorldDef = {
      id: wid,
      name: `${c.genre}: ${c.title}`,
      emoji: c.emoji,
      subject: "lengua",
      category: "lectura-cuentos",
      description: c.description,
      colorFrom: "#fff",
      colorTo: "#000",
      difficulty: "basico",
      objective: "Comprensión",
      contents: [],
      skills: [],
      prerequisites: [],
      kind: "normal",
      activityCount: expQs,
      storyId: sid,
      grade: g === 3 ? undefined : g,
    };

    const acts = buildStoryActivities(world);
    if (acts.length !== expQs + 1) {
      err(`[G${g}:${wid}:${sid}] buildStoryActivities produjo ${acts.length} actividades, se esperaban ${expQs + 1}`);
      return;
    }

    if (acts[0].type !== "listen") {
      err(`[G${g}:${wid}:${sid}] Primera actividad debe ser 'listen', vino '${acts[0].type}'`);
    }

    for (let i = 1; i <= expQs; i++) {
      if (acts[i].type !== "pick") {
        err(`[G${g}:${wid}:${sid}] Actividad ${i + 1} debe ser 'pick', vino '${acts[i].type}'`);
      }
    }
  });
}

if (errors > 0) {
  console.error(`\n❌ Se encontraron ${errors} errores en la validación de cuentos.`);
  process.exit(1);
} else {
  console.log("\n✅ Todas las validaciones de cuentos pasaron perfectamente.");
}
