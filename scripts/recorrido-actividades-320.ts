import { chromium, Page } from "playwright";
import path from "node:path";
import fs from "node:fs";
import { getProgress, saveProgress, getStudents, addStudent } from "../src/lib/data";
import { buildActivitiesForWorld, ActivitySpec } from "../src/lib/activities";
import { GRADES } from "../src/lib/grades";
import { detectarProblemasCelular, ProblemaCelular } from "./detector-celular";

const BASE_URL = "http://localhost:3000";
const CAPTURAS_DIR = path.join(process.cwd(), "docs", "equipo", "capturas", "ag34");

interface ActivityCandidate {
  grade: number;
  worldId: number;
  worldName: string;
  activityId: string;
  activityType: string;
  prompt: string;
  maxOptionText: string;
  totalLength: number;
  activity: ActivitySpec;
}

function getTextLength(act: ActivitySpec): { prompt: string; maxOptionText: string; totalLength: number } {
  const prompt = (act as { prompt?: string }).prompt || (act as { statement?: string }).statement || "";
  let maxOption = "";

  if ("choices" in act && Array.isArray(act.choices)) {
    for (const c of act.choices) {
      if (typeof c === "string" && c.length > maxOption.length) maxOption = c;
    }
  } else if ("cards" in act && Array.isArray(act.cards)) {
    for (const c of act.cards) {
      const txt = c.label || c.big || "";
      if (txt.length > maxOption.length) maxOption = txt;
    }
  } else if ("items" in act && Array.isArray(act.items)) {
    for (const it of act.items) {
      const txt = typeof it === "string" ? it : (it as { label?: string }).label || "";
      if (txt.length > maxOption.length) maxOption = txt;
    }
  } else if ("pairs" in act && Array.isArray(act.pairs)) {
    for (const p of act.pairs) {
      const txt = `${p.left} - ${p.right}`;
      if (txt.length > maxOption.length) maxOption = txt;
    }
  } else if ("scenes" in act && Array.isArray(act.scenes)) {
    for (const sc of act.scenes) {
      if (sc.text && sc.text.length > maxOption.length) maxOption = sc.text;
    }
  } else if ("categories" in act && Array.isArray(act.categories)) {
    for (const cat of act.categories) {
      if (cat.length > maxOption.length) maxOption = cat;
    }
  }

  const totalLength = prompt.length + maxOption.length;
  return { prompt, maxOptionText: maxOption, totalLength };
}

export function findLongestActivitiesByGrade(): Record<number, Record<string, ActivityCandidate>> {
  const longestByGradeAndType: Record<number, Record<string, ActivityCandidate>> = {
    1: {},
    2: {},
    3: {},
    4: {},
  };

  for (const gradeDef of GRADES) {
    const grade = gradeDef.grade;
    for (const world of gradeDef.worlds) {
      let activities: ActivitySpec[] = [];
      try {
        activities = buildActivitiesForWorld(world);
      } catch (err) {
        console.error(`Error al construir actividades para mundo ${world.id}:`, err);
      }

      for (const act of activities) {
        const type = act.type;
        const { prompt, maxOptionText, totalLength } = getTextLength(act);
        const currentBest = longestByGradeAndType[grade][type];

        if (!currentBest || totalLength > currentBest.totalLength) {
          longestByGradeAndType[grade][type] = {
            grade,
            worldId: world.id,
            worldName: world.name,
            activityId: act.id,
            activityType: type,
            prompt,
            maxOptionText,
            totalLength,
            activity: act,
          };
        }
      }
    }
  }
  return longestByGradeAndType;
}

async function ensureStudents(): Promise<Record<number, string>> {
  const students = await getStudents();
  const studentCodes: Record<number, string> = {};

  for (const grade of [1, 2, 3, 4]) {
    let s = students.find((st) => (st.grade ?? 3) === grade);
    if (!s) {
      s = await addStudent(`Alumno Prueba ${grade}to`, "aula", grade);
    }
    studentCodes[grade] = s.code;
  }
  return studentCodes;
}

export async function triggerWrongAnswer(page: Page, act: ActivitySpec): Promise<void> {
  try {
    switch (act.type) {
      case "input": {
        const input = page.locator("input[type='number'], input[type='text']").first();
        if (await input.isVisible()) {
          await input.fill("99999");
          const btn = page.locator("button:has-text('Responder'), button[type='submit']").first();
          if (await btn.isVisible()) await btn.click({ timeout: 2000 }).catch(() => {});
        }
        break;
      }
      case "mc": {
        const choices = page.locator(".grid button");
        const count = await choices.count();
        const wrongIdx = act.answerIndex === 0 ? Math.min(1, count - 1) : 0;
        await choices.nth(wrongIdx).click({ timeout: 2000 }).catch(() => {});
        break;
      }
      case "pick": {
        const wrongCard = act.cards.find((c) => !act.answerIds.includes(c.id)) ?? act.cards[0];
        const cardBtn = page.locator(`button:has-text("${wrongCard.label ?? wrongCard.big ?? wrongCard.id}")`).first();
        if (await cardBtn.isVisible()) {
          await cardBtn.click({ timeout: 2000 }).catch(() => {});
        } else {
          await page.locator(".grid button").first().click({ timeout: 2000 }).catch(() => {});
        }
        const listo = page.locator("button:has-text('¡Listo!')").first();
        if (await listo.isVisible()) {
          await listo.click({ timeout: 1000 }).catch(() => {});
        }
        break;
      }
      case "true-false": {
        const wrongText = act.isTrue ? "Falso" : "Verdadero";
        const btn = page.locator(`button:has-text("${wrongText}")`).first();
        if (await btn.isVisible()) await btn.click({ timeout: 2000 }).catch(() => {});
        break;
      }
      case "dictation": {
        const input = page.locator("input[type='text']").first();
        if (await input.isVisible()) {
          await input.fill("errorortografico");
          const btn = page.locator("button:has-text('Comprobar'), button[type='submit']").first();
          if (await btn.isVisible()) await btn.click({ timeout: 2000 }).catch(() => {});
        }
        break;
      }
      case "shape-identify": {
        const choices = page.locator(".grid button");
        const count = await choices.count();
        const wrongIdx = act.answerIndex === 0 ? Math.min(1, count - 1) : 0;
        await choices.nth(wrongIdx).click({ timeout: 2000 }).catch(() => {});
        break;
      }
      case "find-error": {
        const choices = page.locator(".flex-col button");
        const count = await choices.count();
        const wrongIdx = act.answerIndex === 0 ? Math.min(1, count - 1) : 0;
        await choices.nth(wrongIdx).click({ timeout: 2000 }).catch(() => {});
        break;
      }
      case "count": {
        const choices = page.locator(".flex-wrap button, .grid button");
        const count = await choices.count();
        for (let i = 0; i < count; i++) {
          const txt = (await choices.nth(i).textContent())?.trim();
          if (txt && Number(txt) !== act.answer) {
            await choices.nth(i).click({ timeout: 2000 }).catch(() => {});
            break;
          }
        }
        break;
      }
      case "order": {
        const remainingBtns = page.locator("div.flex-col button, div.grid-cols-3 button");
        const count = await remainingBtns.count();
        for (let i = count - 1; i >= 0; i--) {
          await remainingBtns.nth(i).click({ timeout: 1500 }).catch(() => {});
          await page.waitForTimeout(100);
        }
        break;
      }
      case "classify": {
        const itemButtons = page.locator("button.rounded-lg.border-2");
        const categoryButtons = page.locator("div.grid.grid-cols-2 button");
        const itemCount = await itemButtons.count();
        for (let i = 0; i < itemCount; i++) {
          await itemButtons.nth(i).click({ timeout: 1500 }).catch(() => {});
          await page.waitForTimeout(60);
          await categoryButtons.first().click({ timeout: 1500 }).catch(() => {});
          await page.waitForTimeout(60);
        }
        const listo = page.locator("button:has-text('Listo')").first();
        if (await listo.isVisible()) {
          await listo.click({ timeout: 1500 }).catch(() => {});
        }
        break;
      }
      case "build": {
        const tiles = page.locator("button.min-w-\\[3\\.5rem\\]");
        const count = await tiles.count();
        for (let i = 0; i < count; i++) {
          const t = tiles.nth(i);
          if (await t.isVisible() && await t.isEnabled()) {
            await t.click({ timeout: 1500 }).catch(() => {});
            await page.waitForTimeout(100);
          }
        }
        const checkBtn = page.locator("button:has-text('¡Listo!')");
        if (await checkBtn.isVisible()) {
          await checkBtn.click({ timeout: 1500 }).catch(() => {});
        }
        break;
      }
      case "match": {
        const leftButtons = page.locator(".grid > div:first-child button");
        const rightButtons = page.locator(".grid > div:last-child button");
        if ((await leftButtons.count()) > 0 && (await rightButtons.count()) > 1) {
          await leftButtons.first().click({ timeout: 1500 }).catch(() => {});
          await page.waitForTimeout(100);
          await rightButtons.nth(1).click({ timeout: 1500 }).catch(() => {});
        }
        break;
      }
      case "pitagorica": {
        const cells = page.locator("button.p-0");
        const count = await cells.count();
        if (count > 5) {
          await cells.nth(5).click({ timeout: 1500 }).catch(() => {});
        }
        break;
      }
      case "reparto": {
        const inputCociente = page.locator("input[inputmode='numeric']").first();
        if (await inputCociente.isVisible()) {
          await inputCociente.fill("999");
          const inputResto = page.locator("input[inputmode='numeric']").nth(1);
          if (await inputResto.isVisible()) await inputResto.fill("999");
          const btn = page.locator("button[type='submit']").first();
          if (await btn.isVisible()) await btn.click({ timeout: 1500 }).catch(() => {});
        }
        break;
      }
      case "timed": {
        const choices = page.locator(".grid button");
        const count = await choices.count();
        const wrongIdx = act.questions[0].answerIndex === 0 ? Math.min(1, count - 1) : 0;
        await choices.nth(wrongIdx).click({ timeout: 1500 }).catch(() => {});
        break;
      }
      case "trace": {
        const canvas = page.locator("canvas").nth(1);
        if (await canvas.isVisible()) {
          const box = await canvas.boundingBox();
          if (box) {
            await page.mouse.move(box.x + 20, box.y + 20);
            await page.mouse.down();
            await page.mouse.move(box.x + 30, box.y + 30);
            await page.mouse.up();
            await page.waitForTimeout(100);
          }
        }
        const checkBtn = page.locator("button:has-text('¡Listo!')");
        if (await checkBtn.isVisible()) {
          await checkBtn.click({ timeout: 1500 }).catch(() => {});
        }
        break;
      }
      case "listen": {
        const nextBtn = page.locator("button:has-text('→'), button:has-text('Siguiente')").first();
        if (await nextBtn.isVisible()) await nextBtn.click({ timeout: 1500 }).catch(() => {});
        break;
      }
    }
  } catch (err) {
    console.error(`Error triggering wrong answer for ${act.type}:`, err);
  }
}

async function main() {
  if (!fs.existsSync(CAPTURAS_DIR)) {
    fs.mkdirSync(CAPTURAS_DIR, { recursive: true });
  }

  console.log("=== INICIANDO RECORRIDO COMPLETO DE ACTIVIDADES A 320 PX (AG-34) ===\n");
  const studentCodes = await ensureStudents();
  const longestByGrade = findLongestActivitiesByGrade();

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 320, height: 640 } });
  const page = await context.newPage();

  const activityIssues: Array<{ grade: number; type: string; phase: "base" | "error"; issues: ProblemaCelular[] }> = [];

  for (const grade of [1, 2, 3, 4]) {
    const code = studentCodes[grade];
    const types = Object.keys(longestByGrade[grade]).sort();
    console.log(`\n📘 Grado ${grade} (${types.length} tipos de actividades):`);

    for (const type of types) {
      const candidate = longestByGrade[grade][type];
      const worldId = candidate.worldId;
      const targetAct = candidate.activity;

      // Inyectar ronda en progreso
      const prog = await getProgress(code);
      const dummyAct = { ...targetAct, id: "dummy-first-act" };
      prog.roundsInProgress = {
        [worldId]: {
          id: `test-round-g${grade}-${type}`,
          startedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          index: 1,
          correctCount: 0,
          activities: [dummyAct, targetAct] as unknown as ActivitySpec[],
        },
      };
      await saveProgress(prog);

      // Setup session
      await page.goto(`${BASE_URL}/student`);
      await page.evaluate(
        ({ c, g }) => {
          sessionStorage.setItem("mundomat_code", c);
          sessionStorage.setItem("mundomat_name", `Alumno Prueba ${g}to`);
          sessionStorage.setItem("mundomat_grade", String(g));
          localStorage.setItem(`mt26-video-bienvenida-${c}`, String(Date.now()));
        },
        { c: code, g: grade }
      );

      // Open world
      await page.goto(`${BASE_URL}/student/play?mundo=${worldId}`);
      await page.waitForSelector(".parchment-panel, button:has-text('Salir')", { timeout: 10000 });
      await page.waitForTimeout(500);

      // 1. Base screenshot
      const baseShot = `g${grade}-${type}.png`;
      const baseShotPath = path.join(CAPTURAS_DIR, baseShot);
      await page.screenshot({ path: baseShotPath });

      const baseProbs = await detectarProblemasCelular(page, {
        ignorarTipos: ["boton-chico", "letra-chica"],
      });
      if (baseProbs.length > 0) {
        activityIssues.push({ grade, type, phase: "base", issues: baseProbs });
      }
      console.log(`  [g${grade}-${type}] Base: ${baseProbs.length === 0 ? "✅ OK" : `⚠️ ${baseProbs.length} problemas`}`);

      // 2. Trigger wrong answer
      await triggerWrongAnswer(page, targetAct);
      await page.waitForTimeout(400);

      const errorShot = `g${grade}-${type}-error.png`;
      const errorShotPath = path.join(CAPTURAS_DIR, errorShot);
      await page.screenshot({ path: errorShotPath });

      const errorProbs = await detectarProblemasCelular(page, {
        ignorarTipos: ["boton-chico", "letra-chica"],
      });
      if (errorProbs.length > 0) {
        activityIssues.push({ grade, type, phase: "error", issues: errorProbs });
      }
      console.log(`  [g${grade}-${type}-error] Error: ${errorProbs.length === 0 ? "✅ OK" : `⚠️ ${errorProbs.length} problemas`}`);
    }
  }

  // ------------------------------------------------------------------
  // PANTALLAS ADICIONALES A 320 PX
  // ------------------------------------------------------------------
  console.log("\n--- Capturando pantallas adicionales a 320 px ---");
  const codeG3 = studentCodes[3];

  // NewsBoard
  await page.goto(`${BASE_URL}/student`);
  await page.evaluate(({ c }) => {
    sessionStorage.setItem("mundomat_code", c);
    sessionStorage.setItem("mundomat_name", "Alumno Prueba 3ro");
    sessionStorage.setItem("mundomat_grade", "3");
    localStorage.setItem(`mt26-video-bienvenida-${c}`, String(Date.now()));
  }, { c: codeG3 });

  await page.goto(`${BASE_URL}/student/play`);
  await page.waitForSelector(".wood-panel-light", { timeout: 10000 });
  await page.waitForTimeout(600);

  const newsBoard = page.locator("section:has-text('Pizarrón de novedades')").first();
  if (await newsBoard.isVisible()) {
    await newsBoard.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(CAPTURAS_DIR, "newsboard-320.png") });
    console.log("  ✅ newsboard-320.png capturado");
  }

  // Fichas button on map
  const btnFicha = page.locator("a[title*='Fichas'], a[aria-label*='Fichas']").first();
  if (await btnFicha.isVisible()) {
    await btnFicha.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(CAPTURAS_DIR, "fichas-boton-320.png") });
    console.log("  ✅ fichas-boton-320.png capturado");
  }

  // Fichas download page (/familias)
  await page.goto(`${BASE_URL}/familias`);
  await page.waitForSelector(".wood-panel-light, h1:has-text('Fichas')", { timeout: 10000 });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(CAPTURAS_DIR, "fichas-descarga-320.png") });
  console.log("  ✅ fichas-descarga-320.png capturado");

  // Docente login (/docente)
  await page.goto(`${BASE_URL}/docente`);
  await page.waitForSelector("form, button[type='submit'], h1, h2", { timeout: 10000 });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(CAPTURAS_DIR, "docente-login-320.png") });
  console.log("  ✅ docente-login-320.png capturado");

  // Admin login (/admin)
  await page.goto(`${BASE_URL}/admin`);
  await page.waitForSelector("form, input[type='password']", { timeout: 10000 });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(CAPTURAS_DIR, "admin-login-320.png") });
  console.log("  ✅ admin-login-320.png capturado");

  await browser.close();

  console.log("\n=== RESUMEN DE PROBLEMAS DETECTADOS EN ACTIVIDADES ===");
  if (activityIssues.length === 0) {
    console.log("🎉 ¡0 problemas de layout detectados en las 38 actividades en 320 px!");
  } else {
    for (const item of activityIssues) {
      console.log(`⚠️ Grado ${item.grade} [${item.type}] (${item.phase}):`);
      for (const p of item.issues) {
        console.log(`   - [${p.tipo}] ${p.texto}: ${p.detalle}`);
      }
    }
  }
}

main().catch(console.error);
