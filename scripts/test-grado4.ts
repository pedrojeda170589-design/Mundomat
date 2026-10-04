import assert from "node:assert/strict";
import { GRADE4_WORLDS } from "../src/lib/grade4/worlds";
import { GRADE4_SKILLS } from "../src/lib/grade4/skills";
import { SOCIALES_BANK } from "../src/lib/grade4/content/sociales";
import { NATURALES_BANK } from "../src/lib/grade4/content/naturales";
import { LENGUA_BANK } from "../src/lib/grade4/content/lengua";
import { buildActivitiesForWorld, ActivitySpec, ActivityCard } from "../src/lib/activities";
import { getWorld, WORLDS } from "../src/lib/worlds";
import { GRADE1_WORLDS } from "../src/lib/grade1/worlds";
import { GRADE2_WORLDS } from "../src/lib/grade2/worlds";
import { getGrade, gradeOfWorld } from "../src/lib/grades";
import { isDictationWorld } from "../src/lib/data";
import { getWorldsForGrade } from "../src/lib/courseSummary";
import { isDictationWorldId, getMundoDictado } from "../src/lib/dictado/banco";

console.log("=================================================");
console.log("   TEST SUITE: 4.º GRADO — VERIFICACIÓN COMPLETA  ");
console.log("=================================================\n");

let passedChecks = 0;

function check(desc: string, fn: () => void) {
  try {
    fn();
    console.log(`✅ ${desc}`);
    passedChecks++;
  } catch (err: unknown) {
    console.error(`❌ FALLÓ: ${desc}`);
    console.error(err);
    process.exit(1);
  }
}

// ---------------------------------------------------------------------------
// 1. Integridad de Catálogo y Prerrequisitos
// ---------------------------------------------------------------------------
check("Catálogo de 4.º grado tiene exactamente 92 mundos", () => {
  assert.equal(GRADE4_WORLDS.length, 92, `Se esperaban 92 mundos, se encontraron ${GRADE4_WORLDS.length}`);
  const bySubject = {
    lengua: GRADE4_WORLDS.filter((w) => w.subject === "lengua"),
    matematica: GRADE4_WORLDS.filter((w) => w.subject === "matematica"),
    sociales: GRADE4_WORLDS.filter((w) => w.subject === "sociales"),
    naturales: GRADE4_WORLDS.filter((w) => w.subject === "naturales"),
  };
  assert.equal(bySubject.lengua.length, 26, "Deben haber 26 mundos de Lengua");
  assert.equal(bySubject.matematica.length, 26, "Deben haber 26 mundos de Matemática");
  assert.equal(bySubject.sociales.length, 20, "Deben haber 20 mundos de Sociales");
  assert.equal(bySubject.naturales.length, 20, "Deben haber 20 mundos de Naturales");
});

check("Unicidad de IDs en toda la plataforma (1.º, 2.º, 3.º, 4.º y dictados)", () => {
  const allIds = new Map<number, string>();
  const catalogs = [
    { name: "1.º grado", worlds: GRADE1_WORLDS },
    { name: "2.º grado", worlds: GRADE2_WORLDS },
    { name: "3.º grado", worlds: WORLDS },
    { name: "4.º grado", worlds: GRADE4_WORLDS },
  ];
  for (const cat of catalogs) {
    for (const w of cat.worlds) {
      if (allIds.has(w.id)) {
        throw new Error(`ID duplicado ${w.id} en ${cat.name} (ya registrado por ${allIds.get(w.id)})`);
      }
      allIds.set(w.id, `${cat.name}: ${w.name}`);
    }
  }
  // Dictados especiales
  for (const dictId of [28001, 38001, 48001]) {
    assert(!allIds.has(dictId), `ID de dictado ${dictId} colisiona con un mundo común`);
  }
});

check("Habilidades de 4.º grado registradas y válidas", () => {
  assert(GRADE4_SKILLS.length > 50, `Se esperaban > 50 habilidades, hay ${GRADE4_SKILLS.length}`);
  const skillIds = new Set<string>();
  for (const s of GRADE4_SKILLS) {
    assert(!skillIds.has(s.id), `Skill ID duplicado: ${s.id}`);
    skillIds.add(s.id);
    assert(s.label && s.label.trim().length > 0, `Skill ${s.id} sin label`);
    assert(s.description && s.description.trim().length > 0, `Skill ${s.id} sin description`);
  }
  // Verificar que cada mundo de 4.º grado refiere solo habilidades registradas
  for (const w of GRADE4_WORLDS) {
    assert(w.skills && w.skills.length > 0, `Mundo ${w.id} no tiene skills`);
    for (const sid of w.skills) {
      assert(skillIds.has(sid), `Mundo ${w.id} referencia skill '${sid}' inexistente en GRADE4_SKILLS`);
    }
  }
});

check("Validación de grafo de prerrequisitos (sin ciclos y dentro de 4.º)", () => {
  const worldMap = new Map<number, typeof GRADE4_WORLDS[0]>();
  for (const w of GRADE4_WORLDS) worldMap.set(w.id, w);

  for (const w of GRADE4_WORLDS) {
    for (const pid of w.prerequisites ?? []) {
      assert(worldMap.has(pid), `Mundo ${w.id} tiene prerrequisito inexistente o de otro grado: ${pid}`);
    }
  }

  // Detección de ciclos con DFS
  const visited = new Set<number>();
  const inStack = new Set<number>();

  function dfs(id: number) {
    visited.add(id);
    inStack.add(id);
    const w = worldMap.get(id);
    if (w?.prerequisites) {
      for (const pid of w.prerequisites) {
        if (!visited.has(pid)) {
          dfs(pid);
        } else if (inStack.has(pid)) {
          throw new Error(`Ciclo detectado en prerrequisitos que involucra a los mundos ${id} y ${pid}`);
        }
      }
    }
    inStack.delete(id);
  }

  for (const w of GRADE4_WORLDS) {
    if (!visited.has(w.id)) dfs(w.id);
  }
});

// ---------------------------------------------------------------------------
// 2. Bancos de Contenido (Mínimo 15 preguntas en Sociales y Naturales)
// ---------------------------------------------------------------------------
check("Bancos de Ciencias Sociales tienen >= 15 preguntas en cada uno de los 20 mundos", () => {
  for (let n = 1; n <= 20; n++) {
    const bank = SOCIALES_BANK[n];
    assert(bank, `Falta banco SOCIALES_BANK para el mundo ${n}`);
    assert(bank.length >= 15, `Mundo Sociales ${n} tiene ${bank.length} preguntas (mínimo requerido: 15)`);
  }
});

check("Bancos de Ciencias Naturales tienen >= 15 preguntas en cada uno de los 20 mundos", () => {
  for (let n = 1; n <= 20; n++) {
    const bank = NATURALES_BANK[n];
    assert(bank, `Falta banco NATURALES_BANK para el mundo ${n}`);
    assert(bank.length >= 15, `Mundo Naturales ${n} tiene ${bank.length} preguntas (mínimo requerido: 15)`);
  }
});

check("Banco de Lengua tiene preguntas para los 26 mundos", () => {
  for (let n = 1; n <= 26; n++) {
    const bank = LENGUA_BANK[n];
    assert(bank, `Falta banco LENGUA_BANK para el mundo ${n}`);
    assert(bank.length >= 8, `Mundo Lengua ${n} tiene ${bank.length} preguntas (mínimo esperado: 8)`);
  }
});

// ---------------------------------------------------------------------------
// 3. Regla de Balance de Longitud de Opciones (Longest <= 25%)
// ---------------------------------------------------------------------------
check("Balance de longitud de opciones: la respuesta correcta es la más larga en <= 25% de las preguntas", () => {
  let totalMCQuestions = 0;
  let correctStrictlyLongest = 0;

  interface McBankItem {
    options?: [string, string][];
    answer?: number | number[];
  }

  function evaluateQ(q: McBankItem) {
    if (!q || !Array.isArray(q.options) || typeof q.answer !== "number") return;
    totalMCQuestions++;
    const lengths = q.options.map((c: [string, string]) => c[1].trim().length);
    const correctLen = lengths[q.answer];
    const isStrictlyLongest = lengths.every((len: number, idx: number) => idx === q.answer || len < correctLen);
    if (isStrictlyLongest) {
      correctStrictlyLongest++;
    }
  }

  // Lengua
  for (let n = 1; n <= 26; n++) {
    for (const q of LENGUA_BANK[n] ?? []) evaluateQ(q);
  }
  // Sociales
  for (let n = 1; n <= 20; n++) {
    for (const q of SOCIALES_BANK[n] ?? []) evaluateQ(q);
  }
  // Naturales
  for (let n = 1; n <= 20; n++) {
    for (const q of NATURALES_BANK[n] ?? []) evaluateQ(q);
  }

  const pct = (correctStrictlyLongest / totalMCQuestions) * 100;
  console.log(`   [Balance de Opciones] Total preguntas evaluadas: ${totalMCQuestions}`);
  console.log(`   [Balance de Opciones] Respuestas correctas estrictamente más largas: ${correctStrictlyLongest} (${pct.toFixed(2)}%)`);
  assert(
    pct <= 25.0,
    `La respuesta correcta es estrictamente la más larga en ${pct.toFixed(2)}% de las preguntas (límite máximo permitido: 25%)`
  );
});

// ---------------------------------------------------------------------------
// 4. Integración en el Núcleo de la Plataforma
// ---------------------------------------------------------------------------
check("Integración con grades.ts, worlds.ts, data.ts, courseSummary.ts y dictado", () => {
  // getGrade(4)
  const g4 = getGrade(4);
  assert.equal(g4.grade, 4, "getGrade(4) debe retornar registro de grado 4");
  assert.equal(g4.masteryPct, 90, "masteryPct debe ser 90%");
  assert.equal(g4.unlockPct, 60, "unlockPct debe ser 60%");
  assert.equal(g4.worlds.length, 92, "g4.worlds debe contener los 92 mundos");

  // getWorld y gradeOfWorld para todos los mundos de 4.º
  for (const w of GRADE4_WORLDS) {
    const resolved = getWorld(w.id);
    assert(resolved, `getWorld(${w.id}) retornó undefined`);
    assert.equal(resolved.id, w.id);
    assert.equal(gradeOfWorld(w.id), 4, `gradeOfWorld(${w.id}) no retornó 4`);
  }

  // Mundo de Dictado 48001
  assert.equal(isDictationWorld(48001), true, "isDictationWorld(48001) debe ser true");
  assert.equal(isDictationWorldId(48001), true, "isDictationWorldId(48001) debe ser true");
  assert.equal(gradeOfWorld(48001), 4, "gradeOfWorld(48001) debe ser 4");
  const dictWorld = getWorld(48001);
  assert(dictWorld, "getWorld(48001) debe resolver el mundo de dictado");
  assert.equal(dictWorld.grade, 4);

  // courseSummary.getWorldsForGrade(4)
  const csWorlds = getWorldsForGrade(4);
  assert.equal(csWorlds.length, 92, "getWorldsForGrade(4) debe retornar 92 mundos");
});

// ---------------------------------------------------------------------------
// 5. Simulación Exhaustiva de Actividades (200 iteraciones por mundo)
// ---------------------------------------------------------------------------
check("Simulación de 200 iteraciones por cada uno de los 92 mundos de 4.º grado + Dictado", () => {
  const g4SkillCodes = new Set(GRADE4_SKILLS.map((s) => s.id));
  const RUNS = 200;
  let totalActivities = 0;

  const worldsToTest = [...GRADE4_WORLDS, getMundoDictado(4)];

  for (const world of worldsToTest) {
    for (let run = 1; run <= RUNS; run++) {
      const activities = buildActivitiesForWorld(world);
      assert(
        activities && activities.length >= 6,
        `Mundo ${world.id} (${world.name}) run ${run}: generó ${activities ? activities.length : 0} actividades (requerido >= 6)`
      );

      for (let i = 0; i < activities.length; i++) {
        totalActivities++;
        const act: ActivitySpec = activities[i];
        assert(act.id, `Mundo ${world.id} run ${run} act ${i}: id vacío`);
        assert(act.title, `Mundo ${world.id} run ${run} act ${i}: title vacío`);
        if (act.type === "true-false") {
          assert(act.statement, `Mundo ${world.id} run ${run} act ${i}: statement vacío`);
        } else if ("prompt" in act) {
          assert(act.prompt, `Mundo ${world.id} run ${run} act ${i}: prompt vacío`);
        }
        assert(act.hint, `Mundo ${world.id} run ${run} act ${i}: hint vacío`);

        // Validar skills
        if (act.skills && Array.isArray(act.skills)) {
          for (const sid of act.skills) {
            assert(g4SkillCodes.has(sid), `Mundo ${world.id} act ${act.id}: skill '${sid}' no existe en GRADE4_SKILLS`);
          }
        }

        // Validar según tipo de actividad
        if (act.type === "pick") {
          assert(Array.isArray(act.cards) && act.cards.length >= 2, `Mundo ${world.id} pick act ${act.id}: cards < 2`);
          assert(Array.isArray(act.answerIds) && act.answerIds.length >= 1, `Mundo ${world.id} pick act ${act.id}: answerIds vacío`);
          const cardIdSet = new Set(act.cards.map((c: ActivityCard) => c.id));
          for (const ansId of act.answerIds) {
            assert(cardIdSet.has(ansId), `Mundo ${world.id} pick act ${act.id}: answerId '${ansId}' no está en cards`);
          }
        } else if (act.type === "order") {
          assert(Array.isArray(act.items) && act.items.length >= 2, `Mundo ${world.id} order act ${act.id}: items < 2`);
          assert(
            Array.isArray(act.correctOrder) && act.correctOrder.length === act.items.length,
            `Mundo ${world.id} order act ${act.id}: correctOrder length mismatch`
          );
        } else if (act.type === "classify") {
          assert(Array.isArray(act.categories) && act.categories.length >= 2, `Mundo ${world.id} classify act ${act.id}: categories < 2`);
          assert(Array.isArray(act.items) && act.items.length >= 2, `Mundo ${world.id} classify act ${act.id}: items < 2`);
          for (const item of act.items) {
            assert(
              typeof item.categoryIndex === "number" && item.categoryIndex >= 0 && item.categoryIndex < act.categories.length,
              `Mundo ${world.id} classify act ${act.id}: categoría de ítem inválida ${item.categoryIndex}`
            );
          }
        } else if (act.type === "dictation") {
          assert(act.say, `Mundo ${world.id} dictation act ${act.id}: say vacío`);
          assert(act.answer, `Mundo ${world.id} dictation act ${act.id}: answer vacío`);
        }
      }
    }
  }
  console.log(`   [Simulación] Total de actividades generadas y validadas: ${totalActivities.toLocaleString("es-AR")}`);
});

console.log(`\n=================================================`);
console.log(`🎉 TODAS LAS VERIFICACIONES (${passedChecks}) PASARON EXITOSAMENTE`);
console.log(`=================================================`);
