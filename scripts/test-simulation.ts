import { buildActivitiesForWorld } from "../src/lib/activities";
import { GRADE2_WORLDS } from "../src/lib/grade2/worlds";
import { GRADE2_SKILLS } from "../src/lib/grade2/skills";
import { GRADE1_WORLDS } from "../src/lib/grade1/worlds";
import { WORLDS } from "../src/lib/worlds";
import { practiceZonesFor } from "../src/lib/grade1/practice";


console.log("=== INICIANDO SIMULACIÓN DE ACTIVIDADES DE 2.º GRADO ===");

const g2SkillCodes = new Set(GRADE2_SKILLS.map((s) => s.id));
let totalG2ActivitiesTested = 0;
let totalWorldsTested = 0;
const errors: string[] = [];
const missingSkills = new Set<string>();

// 1. Simulación de los 100 mundos de 2.º grado, 40 vueltas cada uno
const RUNS_PER_WORLD = 40;
console.log(`Simulando 100 mundos de 2.º grado (${RUNS_PER_WORLD} iteraciones cada uno)...`);

for (const world of GRADE2_WORLDS) {
  totalWorldsTested++;
  for (let run = 1; run <= RUNS_PER_WORLD; run++) {
    try {
      const activities = buildActivitiesForWorld(world);
      if (!activities || activities.length < 6) {
        errors.push(
          `Mundo ${world.id} (${world.name}) iteración ${run}: generó ${activities ? activities.length : 0} actividades (mínimo 6 requerido).`
        );
        continue;
      }

      for (let i = 0; i < activities.length; i++) {
        totalG2ActivitiesTested++;
        const act = activities[i] as any;
        if (!act.id) {
          errors.push(`Mundo ${world.id} iteración ${run} act ${i}: id vacío.`);
        }

        // Validación según tipo
        if (act.type === "pick") {
          if (!Array.isArray(act.cards) || act.cards.length < 2) {
            errors.push(`Mundo ${world.id} iteración ${run} act ${i} (pick): cards vacías o < 2.`);
          }
          if (!Array.isArray(act.answerIds) || act.answerIds.length === 0) {
            errors.push(`Mundo ${world.id} iteración ${run} act ${i} (pick): answerIds vacío.`);
          } else {
            const cardIds = new Set(act.cards.map((c: any) => c.id));
            for (const ansId of act.answerIds) {
              if (!cardIds.has(ansId)) {
                errors.push(
                  `Mundo ${world.id} iteración ${run} act ${i} (pick): answerId '${ansId}' no está en cards.`
                );
              }
            }
          }
        } else if (act.type === "multiple-choice") {
          if (!Array.isArray(act.choices) || act.choices.length < 2) {
            errors.push(`Mundo ${world.id} iteración ${run} act ${i} (multiple-choice): choices vacías o < 2.`);
          }
          if (!act.answerId) {
            errors.push(`Mundo ${world.id} iteración ${run} act ${i} (multiple-choice): answerId vacío.`);
          } else {
            const choiceIds = new Set(act.choices.map((c: any) => c.id));
            if (!choiceIds.has(act.answerId)) {
              errors.push(
                `Mundo ${world.id} iteración ${run} act ${i} (multiple-choice): answerId '${act.answerId}' no está en choices.`
              );
            }
          }
        } else if (act.type === "order") {
          if (!Array.isArray(act.items) || act.items.length < 2) {
            errors.push(`Mundo ${world.id} iteración ${run} act ${i} (order): items vacíos o < 2.`);
          }
          if (!Array.isArray(act.correctOrder) || act.correctOrder.length !== act.items.length) {
            errors.push(`Mundo ${world.id} iteración ${run} act ${i} (order): correctOrder inválido.`);
          }
        } else if (act.type === "classify") {
          if (!Array.isArray(act.categories) || act.categories.length < 2) {
            errors.push(`Mundo ${world.id} iteración ${run} act ${i} (classify): categories < 2.`);
          }
          if (!Array.isArray(act.items) || act.items.length < 2) {
            errors.push(`Mundo ${world.id} iteración ${run} act ${i} (classify): items < 2.`);
          }
        }

        // Validación de skills
        if (act.skills && Array.isArray(act.skills)) {
          for (const s of act.skills) {
            if (!g2SkillCodes.has(s)) {
              missingSkills.add(`Mundo ${world.id}: skill '${s}' no está en GRADE2_SKILLS.`);
            }
          }
        }
      }
    } catch (err: any) {
      errors.push(`Mundo ${world.id} (${world.name}) iteración ${run} lanzó excepción: ${err.message}`);
    }
  }
}

console.log(`Mundos 2.º probados: ${totalWorldsTested}`);
console.log(`Actividades 2.º probadas: ${totalG2ActivitiesTested}`);

// 2. Simulación de zonas de práctica de 2.º grado
console.log("\nSimulando zonas de práctica de 2.º grado...");
const mockProgress = {
  code: "TEST2",
  completedWorlds: [21001, 21002, 22001, 22002, 23001, 24001],
  activityLog: [],
  coins: 50,
  skillStats: {
    "l2-trabadas": { c: 3, i: 5, recent: [0, 1, 0, 0, 1, 0] },
    "m2-grilla-100": { c: 3, i: 5, recent: [0, 1, 0, 0, 1, 0] },
  },
};
for (const subj of ["lengua", "matematica", "sociales", "naturales"] as const) {
  const pzs2 = practiceZonesFor(mockProgress as any, subj, 2);
  for (const pz of pzs2) {
    for (let run = 1; run <= 10; run++) {
      try {
        const acts = buildActivitiesForWorld(pz);
        if (!acts || acts.length === 0) {
          errors.push(`Zona de práctica ${pz.id} (${pz.name}): no generó actividades.`);
        }
      } catch (err: any) {
        errors.push(`Zona de práctica ${pz.id} lanzó excepción: ${err.message}`);
      }
    }
  }
}

// 3. Regresión: comprobación de 1.º y 3.º grado
console.log("\nComprobando ausencia de regresiones en 1.º y 3.º grado...");
for (const w of GRADE1_WORLDS) {
  try {
    const acts = buildActivitiesForWorld(w);
    if (!acts || acts.length < 6) {
      errors.push(`Regresión 1.º Mundo ${w.id}: generó < 6 actividades.`);
    }
  } catch (err: any) {
    errors.push(`Regresión 1.º Mundo ${w.id} lanzó excepción: ${err.message}`);
  }
}

for (const w of WORLDS) {
  try {
    const acts = buildActivitiesForWorld(w);
    if (!acts || acts.length < 6) {
      errors.push(`Regresión 3.º Mundo ${w.id}: generó < 6 actividades.`);
    }
  } catch (err: any) {
    errors.push(`Regresión 3.º Mundo ${w.id} lanzó excepción: ${err.message}`);
  }
}

console.log("\n=== RESULTADOS DE LA SIMULACIÓN ===");
if (missingSkills.size > 0) {
  console.error(`Habilidades faltantes en catálogo (${missingSkills.size}):`);
  for (const ms of missingSkills) {
    console.error(` - ${ms}`);
  }
}
if (errors.length === 0 && missingSkills.size === 0) {
  console.log("¡ÉXITO TOTAL! Cero errores en todas las iteraciones.");
} else {
  if (errors.length > 0) {
    console.error(`Se encontraron ${errors.length} errores funcionales:`);
    for (const err of errors.slice(0, 25)) {
      console.error(` - ${err}`);
    }
  }
  process.exit(1);
}
