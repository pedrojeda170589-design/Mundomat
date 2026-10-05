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
check("Catálogo de 4.º grado tiene exactamente 108 mundos curriculares", () => {
  assert.equal(GRADE4_WORLDS.length, 108, `Se esperaban 108 mundos, se encontraron ${GRADE4_WORLDS.length}`);
  const bySubject = {
    lengua: GRADE4_WORLDS.filter((w) => w.subject === "lengua"),
    matematica: GRADE4_WORLDS.filter((w) => w.subject === "matematica"),
    sociales: GRADE4_WORLDS.filter((w) => w.subject === "sociales"),
    naturales: GRADE4_WORLDS.filter((w) => w.subject === "naturales"),
  };
  assert.equal(bySubject.lengua.length, 28, `Deben haber 28 mundos de Lengua, hay ${bySubject.lengua.length}`);
  assert.equal(bySubject.matematica.length, 28, `Deben haber 28 mundos de Matemática, hay ${bySubject.matematica.length}`);
  assert.equal(bySubject.sociales.length, 26, `Deben haber 26 mundos de Sociales, hay ${bySubject.sociales.length}`);
  assert.equal(bySubject.naturales.length, 26, `Deben haber 26 mundos de Naturales, hay ${bySubject.naturales.length}`);
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
// 2. Bancos de Contenido (Mínimos: 20 Lengua, 15 Sociales, 15 Naturales)
// ---------------------------------------------------------------------------
check("Bancos de Lengua tienen >= 20 preguntas en cada uno de los 28 mundos", () => {
  for (let n = 1; n <= 28; n++) {
    const bank = LENGUA_BANK[n];
    assert(bank, `Falta banco LENGUA_BANK para el mundo ${n}`);
    assert(bank.length >= 20, `Mundo Lengua ${n} tiene ${bank.length} preguntas (mínimo requerido: 20)`);
  }
});

check("Bancos de Ciencias Sociales tienen >= 15 preguntas en cada uno de los 26 mundos", () => {
  for (let n = 1; n <= 26; n++) {
    const bank = SOCIALES_BANK[n];
    assert(bank, `Falta banco SOCIALES_BANK para el mundo ${n}`);
    assert(bank.length >= 15, `Mundo Sociales ${n} tiene ${bank.length} preguntas (mínimo requerido: 15)`);
  }
});

check("Bancos de Ciencias Naturales tienen >= 15 preguntas en cada uno de los 26 mundos", () => {
  for (let n = 1; n <= 26; n++) {
    const bank = NATURALES_BANK[n];
    assert(bank, `Falta banco NATURALES_BANK para el mundo ${n}`);
    assert(bank.length >= 15, `Mundo Naturales ${n} tiene ${bank.length} preguntas (mínimo requerido: 15)`);
  }
});

// ---------------------------------------------------------------------------
// 3. Reglas de Balance de Longitud de Opciones (Longest <= 25%, Shortest <= 30%)
// ---------------------------------------------------------------------------
interface McBankItem {
  prompt?: string;
  options?: [string, string][];
  answer?: number | number[];
  hint?: string;
}

check("Balance de longitud de opciones: estrictamente más larga <= 25% y estrictamente más corta <= 30%", () => {
  let totalMCQuestions = 0;
  let correctStrictlyLongest = 0;
  let correctStrictlyShortest = 0;

  function evaluateQ(q: McBankItem) {
    if (!q || !Array.isArray(q.options) || typeof q.answer !== "number") return;
    totalMCQuestions++;
    const lengths = q.options.map((c: [string, string]) => c[1].trim().length);
    const correctLen = lengths[q.answer];
    const isStrictlyLongest = lengths.every((len: number, idx: number) => idx === q.answer || len < correctLen);
    const isStrictlyShortest = lengths.every((len: number, idx: number) => idx === q.answer || len > correctLen);
    if (isStrictlyLongest) correctStrictlyLongest++;
    if (isStrictlyShortest) correctStrictlyShortest++;
  }

  for (let n = 1; n <= 28; n++) {
    for (const q of LENGUA_BANK[n] ?? []) evaluateQ(q);
  }
  for (let n = 1; n <= 26; n++) {
    for (const q of SOCIALES_BANK[n] ?? []) evaluateQ(q);
  }
  for (let n = 1; n <= 26; n++) {
    for (const q of NATURALES_BANK[n] ?? []) evaluateQ(q);
  }

  const pctLongest = (correctStrictlyLongest / totalMCQuestions) * 100;
  const pctShortest = (correctStrictlyShortest / totalMCQuestions) * 100;

  console.log(`   [Balance de Opciones] Total preguntas evaluadas: ${totalMCQuestions}`);
  console.log(`   [Balance de Opciones] Más larga: ${correctStrictlyLongest} (${pctLongest.toFixed(2)}%) [límite <= 25%]`);
  console.log(`   [Balance de Opciones] Más corta: ${correctStrictlyShortest} (${pctShortest.toFixed(2)}%) [límite <= 30%]`);

  assert(
    pctLongest <= 25.0,
    `La respuesta correcta es estrictamente la más larga en ${pctLongest.toFixed(2)}% (límite máximo permitido: 25%)`
  );
  assert(
    pctShortest <= 30.0,
    `La respuesta correcta es estrictamente la más corta en ${pctShortest.toFixed(2)}% (límite máximo permitido: 30%)`
  );
});

// ---------------------------------------------------------------------------
// 4. Calidad de Redacción: Cero Frases Prohibidas y Cero Palabras Repetidas
// ---------------------------------------------------------------------------
check("Calidad lingüística: sin frases de relleno prohibidas ni palabras duplicadas", () => {
  const forbiddenPhrases = [
    "en distintas partes del territorio",
    "a lo largo del territorio",
    "por todo el territorio",
    "en todo el territorio",
    "en diversas partes del territorio",
    "en varias partes del territorio",
    "en distintos puntos del territorio",
    "a lo largo de todo el territorio",
  ];

  function checkText(text: string, context: string) {
    const lower = text.toLowerCase();
    for (const phrase of forbiddenPhrases) {
      assert(
        !lower.includes(phrase),
        `Frase prohibida "${phrase}" encontrada en ${context}: "${text}"`
      );
    }

    // Chequeo de palabras duplicadas consecutivas sin puntuación intermedia ("el el", "los los", etc.)
    const words = text.split(/\s+/);
    for (let i = 0; i < words.length - 1; i++) {
      const raw1 = words[i];
      const raw2 = words[i + 1];
      const hasPunctuationBetween = /[.,:;!?»"’)\]]$/.test(raw1) || /^[«"‘(\[¡¿]/.test(raw2);
      if (hasPunctuationBetween) continue;
      const clean1 = raw1.toLowerCase().replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "");
      const clean2 = raw2.toLowerCase().replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "");
      if (clean1 && clean1 === clean2) {
        throw new Error(`Palabra duplicada consecutiva "${clean1} ${clean2}" en ${context}: "${text}"`);
      }
    }
  }

  function checkBank(bank: Record<number, McBankItem[]>, subjectName: string) {
    for (const [mStr, questions] of Object.entries(bank)) {
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        const ctx = `${subjectName} mundo ${mStr} pregunta ${i + 1}`;
        if (q.prompt) checkText(q.prompt, ctx);
        if (q.hint) checkText(q.hint, ctx);
        if (q.options) {
          for (const opt of q.options) {
            checkText(opt[1], `${ctx} opción`);
          }
        }
      }
    }
  }

  checkBank(LENGUA_BANK, "Lengua");
  checkBank(SOCIALES_BANK, "Sociales");
  checkBank(NATURALES_BANK, "Naturales");
});

// ---------------------------------------------------------------------------
// 5. Integración en el Núcleo de la Plataforma
// ---------------------------------------------------------------------------
check("Integración con grades.ts, worlds.ts, data.ts, courseSummary.ts y dictado", () => {
  // getGrade(4)
  const g4 = getGrade(4, { borradores: true });
  assert.equal(getGrade(4).grade, 3, "4.º no se publica hasta aprobar la revisión");
  assert.equal(g4.grade, 4, "getGrade(4) debe retornar registro de grado 4");
  assert.equal(g4.masteryPct, 90, "masteryPct debe ser 90%");
  assert.equal(g4.unlockPct, 60, "unlockPct debe ser 60%");
  assert.equal(g4.worlds.length, 108, `g4.worlds debe contener 108 mundos, tiene ${g4.worlds.length}`);

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
  assert.equal(csWorlds.length, 108, `getWorldsForGrade(4) debe retornar 108 mundos, tiene ${csWorlds.length}`);
});

// ---------------------------------------------------------------------------
// 6. Simulación Exhaustiva de Actividades (200 iteraciones por mundo)
// ---------------------------------------------------------------------------
check("Simulación de 200 iteraciones por cada uno de los 108 mundos de 4.º grado + Dictado", () => {
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

      // Verificación de actividades no-pick en Ciencias Sociales y Naturales (>= 2 por ejecución)
      if (world.subject === "sociales" || world.subject === "naturales") {
        const nonPickCount = activities.filter((a) => a.type !== "pick").length;
        assert(
          nonPickCount >= 2,
          `Mundo ${world.id} (${world.subject}) run ${run}: generó ${nonPickCount} actividades interactivas no-pick (requerido >= 2)`
        );
      }

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
