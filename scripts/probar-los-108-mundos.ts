import { chromium, Page, Locator, ConsoleMessage } from "playwright";
import path from "node:path";
import fs from "node:fs";
import { getProgress, saveProgress } from "../src/lib/data";
import { GRADE4_WORLDS } from "../src/lib/grade4/worlds";
import { METAS } from "../src/lib/coleccion/metasDatos";
import { RoundInProgress } from "../src/types";

const BASE_URL = "http://localhost:3000";
const CAPTURAS_DIR = path.join(process.cwd(), "docs", "equipo", "capturas", "ag31");
const ALL_META_IDS = METAS.map((m) => m.id);

interface TestCard {
  id: string;
  label?: string;
  big?: string;
}

interface TestItem {
  id?: string;
  label?: string;
  text?: string;
  order?: number;
  categoryIndex?: number;
}

interface TestActivity {
  type: string;
  prompt?: string;
  cards?: TestCard[];
  answerIds?: string[];
  isTrue?: boolean;
  justification?: {
    answerIndex: number;
    choices: string[];
  };
  answer?: string | number;
  items?: (string | TestItem)[];
  correctOrder?: number[];
  sequence?: Array<{ label: string }>;
  pairs?: Array<{ left: string; right: string }>;
  target?: number;
  current?: number;
  options?: number[];
  fila?: number;
  columna?: number;
  modo?: string;
  answerIndex?: number;
  [key: string]: unknown;
}

export interface WorldResult {
  worldId: number;
  subject: string;
  name: string;
  mode: "desktop" | "celular";
  status: "OK" | "ERROR";
  activitiesCount: number;
  hasVisualAid?: boolean;
  issues: string[];
  error?: string;
  screenshot?: string;
}

export interface ProblemReport {
  worldId: number;
  worldName: string;
  screen: "compu" | "celu";
  issue: string;
  screenshot: string;
  fixedOrClaude: "Arreglado" | "Para Claude";
}

const problems: ProblemReport[] = [];

async function dismissModalsIfNeeded(page: Page) {
  try {
    const dialogBtn = page.locator('div[role="dialog"] button, button:has-text("¡Genial!"), button:has-text("Aceptar"), button:has-text("Cerrar")');
    if (await dialogBtn.first().isVisible({ timeout: 400 })) {
      await dialogBtn.first().click();
      await page.waitForTimeout(250);
    }
  } catch {}
}

async function safeClick(page: Page, locator: Locator, timeout = 5000) {
  try {
    await locator.click({ timeout });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    if (errorMsg.includes("intercepts pointer events") || errorMsg.includes("Timeout")) {
      await page.keyboard.press("Escape");
      await page.waitForTimeout(200);
      await dismissModalsIfNeeded(page);
      await locator.click({ timeout: 6000 });
    } else {
      throw err;
    }
  }
}

export async function playOneWorld(
  page: Page,
  studentCode: string,
  worldId: number,
  mode: "desktop" | "celular" = "desktop",
  saveMobileShot = false
): Promise<WorldResult> {
  const world = GRADE4_WORLDS.find((w) => w.id === worldId);
  if (!world) throw new Error(`Mundo ${worldId} no encontrado`);

  const issues: string[] = [];
  const consoleErrors: string[] = [];

  const onConsole = (msg: ConsoleMessage) => {
    if (msg.type() === "error") {
      const text = msg.text();
      if (!text.includes("favicon") && !text.includes("audio") && !text.includes("404")) {
        consoleErrors.push(text);
      }
    }
  };
  const onPageError = (err: Error) => {
    consoleErrors.push(err.message);
  };

  page.on("console", onConsole);
  page.on("pageerror", onPageError);

  try {
    // 1. Preparar progreso en el backend
    const prog = await getProgress(studentCode);
    prog.roundsInProgress = {};
    prog.coins = 500;
    const prereqs = world.prerequisites ?? [];
    prog.completedWorlds = Array.from(new Set([...(prog.completedWorlds ?? []), ...prereqs]));
    prog.completedWorlds = prog.completedWorlds.filter((id) => id !== worldId);
    prog.worldsPendingReinforcementRetry = [worldId];
    // Asegurar que las metas figuren ya reclamadas para que el servidor no active alertas
    prog.metasReclamadas = Array.from(new Set([...(prog.metasReclamadas ?? []), ...ALL_META_IDS]));
    await saveProgress(prog);

    // 2. Navegar a /student/play asegurando estado
    const subjectLabels: Record<string, string> = {
      matematica: "Matemática",
      lengua: "Lengua",
      sociales: "Ciencias Sociales",
      naturales: "Ciencias Naturales",
    };
    const subLabel = subjectLabels[world.subject];

    if (!page.url().includes("/student/play")) {
      await page.goto(`${BASE_URL}/student`);
      await page.fill("input", studentCode);
      await page.click('button:has-text("Entrar")');
      await page.waitForURL("**/student/play");
      await page.waitForSelector('button:has-text("Matemática")', { timeout: 8000 });
      await dismissModalsIfNeeded(page);
      await safeClick(page, page.locator(`button:has-text("${subLabel}")`));
      await page.waitForTimeout(250);
    } else {
      await dismissModalsIfNeeded(page);
      await safeClick(page, page.locator(`button:has-text("${subLabel}")`));
      await page.waitForTimeout(150);
    }

    // Suprimir modales automáticos de metas en localStorage
    await page.evaluate((metaIds) => {
      try {
        localStorage.setItem("mm-metas-vistas-H5CKT", JSON.stringify(metaIds));
        for (const k of Object.keys(localStorage)) {
          if (k.startsWith("mm-metas-vistas-")) {
            localStorage.setItem(k, JSON.stringify(metaIds));
          }
        }
      } catch {}
    }, ALL_META_IDS);

    await dismissModalsIfNeeded(page);

    let islaBtn = page.locator(`button[aria-label*="${world.name}"]`).first();
    if (!(await islaBtn.isVisible()) || (await islaBtn.isDisabled())) {
      await page.reload();
      await page.waitForSelector('button:has-text("Matemática")', { timeout: 8000 });
      await dismissModalsIfNeeded(page);
      await safeClick(page, page.locator(`button:has-text("${subLabel}")`));
      await page.waitForTimeout(200);
      islaBtn = page.locator(`button[aria-label*="${world.name}"]`).first();
    }

    await islaBtn.scrollIntoViewIfNeeded();
    await dismissModalsIfNeeded(page);
    await safeClick(page, islaBtn);

    // Esperar a que monte ActivityRunner
    await page.locator(".parchment-panel, p.text-lg, p.text-xl, div.grid").first().waitFor({ state: "visible", timeout: 8000 });

    // 5. Leer ronda del servidor (con reintentos breves mientras la API guarda)
    let round: (RoundInProgress & { activities: TestActivity[] }) | null = null;
    for (let attempt = 0; attempt < 12; attempt++) {
      const progAfter = await getProgress(studentCode);
      const r = progAfter.roundsInProgress?.[worldId];
      if (r && Array.isArray(r.activities) && r.activities.length > 0) {
        round = r as RoundInProgress & { activities: TestActivity[] };
        break;
      }
      await page.waitForTimeout(300);
    }
    if (!round) {
      throw new Error(`No se inició ronda para el mundo ${worldId}`);
    }
    const activities = round.activities;
    let hasVisualAid = false;

    // 6. Jugar actividades
    for (let idx = 0; idx < activities.length; idx++) {
      const act = activities[idx];
      await page.waitForTimeout(150);

      // Consigna
      const promptEl = page.locator("p.text-lg, p.text-xl, p.text-base.font-bold").first();
      const promptText = (await promptEl.textContent())?.trim();
      if (!promptText || promptText.length < 5) {
        const shot = `problema-${worldId}-act${idx + 1}-consigna.png`;
        await page.screenshot({ path: path.join(CAPTURAS_DIR, shot) });
        issues.push(`Consigna cortada o vacía en act ${idx + 1}: "${promptText}"`);
        problems.push({
          worldId,
          worldName: world.name,
          screen: mode === "celular" ? "celu" : "compu",
          issue: `Consigna corta o cortada en act ${idx + 1}`,
          screenshot: shot,
          fixedOrClaude: "Para Claude",
        });
      }

      // Apoyo visual en Matemática
      if (world.subject === "matematica") {
        const aidEl = page.locator("div:has(> svg), div:has(> table), div.rounded-2xl.bg-white\\/90, div.rounded-2xl.bg-white\\/85").first();
        if (await aidEl.isVisible()) {
          hasVisualAid = true;
        }
      }

      // Botón Pista (usamos "💡 Pista" o .last() para no confundir con opciones como "autopista")
      const btnPista = page.locator('button:has-text("💡 Pista"), button:has-text("Pista")').last();
      if ((await btnPista.isVisible()) && !(await btnPista.isDisabled())) {
        await btnPista.click();
        await page.waitForTimeout(100);
      }

      // Si es celular y se pidió captura representativa (en act 1)
      if (saveMobileShot && idx === 1) {
        const mobileShotFile = `celular-${world.subject}-${worldId}.png`;
        await page.screenshot({ path: path.join(CAPTURAS_DIR, mobileShotFile) });
      }

      // Verificar imágenes rotas
      const brokenImgs = await page.evaluate(() => {
        return Array.from(document.querySelectorAll("img"))
          .filter((img) => img.complete && img.naturalWidth === 0)
          .map((img) => img.src);
      });
      if (brokenImgs.length > 0) {
        const shot = `problema-${worldId}-act${idx + 1}-imagen.png`;
        await page.screenshot({ path: path.join(CAPTURAS_DIR, shot) });
        issues.push(`Imagen rota: ${brokenImgs.join(", ")}`);
        problems.push({
          worldId,
          worldName: world.name,
          screen: mode === "celular" ? "celu" : "compu",
          issue: `Imagen rota en act ${idx + 1}`,
          screenshot: shot,
          fixedOrClaude: "Para Claude",
        });
      }

      // Equivocación deliberada en actividad 0
      const deliberateError = idx === 0;

      if (act.type === "pick") {
        const cardBtns = page.locator("div.grid div.relative > button:first-child");
        if (deliberateError) {
          const wrongIdx = (act.cards ?? []).findIndex((c) => !(act.answerIds ?? []).includes(c.id));
          await cardBtns.nth(wrongIdx >= 0 ? wrongIdx : 1).click();
        } else {
          const correctIdx = (act.cards ?? []).findIndex((c) => (act.answerIds ?? []).includes(c.id));
          await cardBtns.nth(correctIdx >= 0 ? correctIdx : 0).click();
        }
      } else if (act.type === "true-false") {
        const wrongBtn = act.isTrue ? page.locator('button:has-text("Falso")') : page.locator('button:has-text("Verdadero")');
        const correctBtn = act.isTrue ? page.locator('button:has-text("Verdadero")') : page.locator('button:has-text("Falso")');
        await (deliberateError ? wrongBtn : correctBtn).click();

        if (act.justification) {
          await page.waitForTimeout(300);
          const justBtns = page.locator("div.flex.flex-col.gap-2 button");
          const targetJust = deliberateError
            ? (act.justification.answerIndex + 1) % act.justification.choices.length
            : act.justification.answerIndex;
          await justBtns.nth(targetJust).click();
        }
      } else if (act.type === "input") {
        const val = deliberateError ? "999999" : String(act.answer);
        await page.locator('input[type="number"], input[type="text"]').fill(val);
        await page.click('button:has-text("Responder")');
      } else if (act.type === "order") {
        if (deliberateError) {
          const count = act.items?.length ?? 0;
          for (let s = 0; s < count; s++) {
            const btns = page.locator("div.grid.grid-cols-3 button:not([disabled])");
            await btns.last().click();
            await page.waitForTimeout(100);
          }
        } else {
          for (const orderIdx of act.correctOrder ?? []) {
            const targetItem = act.items?.[orderIdx];
            const itemText = typeof targetItem === "string" ? targetItem : (targetItem?.text ?? targetItem?.label ?? "");
            const btn = page.locator("div.grid.grid-cols-3 button:not([disabled])", { hasText: itemText }).first();
            await btn.click();
            await page.waitForTimeout(100);
          }
        }
      } else if (act.type === "classify") {
        const itemBtns = page.locator("div.flex.flex-wrap.gap-2.justify-center button");
        const catBtns = page.locator("div.grid.grid-cols-2 button");
        const itemsList = act.items ?? [];
        if (deliberateError) {
          for (let i = 0; i < itemsList.length; i++) {
            await itemBtns.nth(i).click();
            await page.waitForTimeout(80);
            await catBtns.first().click();
            await page.waitForTimeout(80);
          }
        } else {
          for (let i = 0; i < itemsList.length; i++) {
            const it = itemsList[i];
            const catIdx = typeof it === "object" && it !== null && "categoryIndex" in it && typeof it.categoryIndex === "number" ? it.categoryIndex : 0;
            await itemBtns.nth(i).click();
            await page.waitForTimeout(80);
            await catBtns.nth(catIdx).click();
            await page.waitForTimeout(80);
          }
        }
        await page.click('button:has-text("Listo")');
      } else if (act.type === "pitagorica") {
        const gridBtns = page.locator('div[role="grid"] button');
        const fila = act.fila ?? 0;
        const columna = act.columna ?? 0;
        if (deliberateError) {
          const wrongBtnIdx = (fila + 1) * 12 + (((columna + 2) % 10) + 1);
          await gridBtns.nth(wrongBtnIdx).click();
        } else {
          if (act.modo === "cruce") {
            const btnIdx = (fila + 1) * 12 + (columna + 1);
            await gridBtns.nth(btnIdx).click();
          } else {
            const btnIdx = (columna + 1) * 12 + (fila + 1);
            await gridBtns.nth(btnIdx).click();
            await page.waitForTimeout(300);
            const rowHeaderIdx = (columna + 1) * 12 + 0;
            await gridBtns.nth(rowHeaderIdx).click();
          }
        }
      } else if (act.type === "mc") {
        const btns = page.locator("div.grid button");
        const targetIdx = deliberateError ? ((act.answerIndex ?? 0) + 1) % 4 : (act.answerIndex ?? 0);
        await btns.nth(targetIdx).click();
      }

      // Esperar feedback y botón siguiente
      const nextBtn = page.locator('button:has-text("Siguiente actividad"), button:has-text("Ver resultado")');
      await nextBtn.waitFor({ state: "visible", timeout: 9000 });
      await nextBtn.click();
    }

    // 7. Resultado
    const btnVolver = page.locator('button:has-text("Volver al mapa")');
    await btnVolver.waitFor({ state: "visible", timeout: 12000 });
    const doneTitle = (await page.locator("h2").textContent())?.trim();
    await safeClick(page, btnVolver);
    await page.waitForTimeout(300);
    await dismissModalsIfNeeded(page);

    // 8. Superado en mapa
    await dismissModalsIfNeeded(page);
    await page.waitForSelector(`button[aria-label*="${world.name}"]`, { timeout: 8000 });
    await dismissModalsIfNeeded(page);
    const progFinal = await getProgress(studentCode);
    const isCompleted = progFinal.completedWorlds?.includes(worldId);

    // Revisar errores de consola acumulados
    if (consoleErrors.length > 0) {
      const shot = `problema-${worldId}-consola.png`;
      await page.screenshot({ path: path.join(CAPTURAS_DIR, shot) });
      issues.push(`Error en consola: ${consoleErrors.join("; ")}`);
      problems.push({
        worldId,
        worldName: world.name,
        screen: mode === "celular" ? "celu" : "compu",
        issue: `Error en consola: ${consoleErrors[0].slice(0, 80)}`,
        screenshot: shot,
        fixedOrClaude: "Para Claude",
      });
    }

    return {
      worldId,
      subject: world.subject,
      name: world.name,
      mode,
      status: isCompleted ? "OK" : "ERROR",
      activitiesCount: activities.length,
      hasVisualAid,
      issues,
      error: isCompleted ? undefined : `No quedó marcado como completado: ${doneTitle}`,
    };
  } finally {
    page.off("console", onConsole);
    page.off("pageerror", onPageError);
  }
}

async function main() {
  fs.mkdirSync(CAPTURAS_DIR, { recursive: true });

  const subjectArg = process.argv[2]; // e.g. "lengua", "matematica", "sociales", "naturales", "all", o un id específico
  const worldsToRun = GRADE4_WORLDS.filter(
    (w) => !subjectArg || subjectArg === "all" || w.subject === subjectArg || String(w.id) === subjectArg
  );

  console.log(`🚀 Iniciando prueba completa de 4.º grado en el navegador...`);
  console.log(`Mundos a ejecutar: ${worldsToRun.length} (filtro: ${subjectArg || "todos los 108"})`);

  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });

  // Inyectar metas conocidas en localStorage antes de que cualquier script se ejecute
  await context.addInitScript((metaIds) => {
    try {
      localStorage.setItem("mm-metas-vistas-H5CKT", JSON.stringify(metaIds));
      for (const k of Object.keys(localStorage)) {
        if (k.startsWith("mm-metas-vistas-")) {
          localStorage.setItem(k, JSON.stringify(metaIds));
        }
      }
    } catch {}
  }, ALL_META_IDS);

  const page = await context.newPage();

  const resStudents = await page.request.get(`${BASE_URL}/api/students?adminPassword=docente2026`);
  const { students } = await resStudents.json();
  const testStudent = students.find((s: { grade: number; name: string; code: string }) => s.grade === 4 && s.name.includes("Prueba"));
  if (!testStudent) throw new Error("No se encontró alumno de prueba de 4.º");

  const runMobile = !subjectArg || subjectArg === "all";
  const mobileResults: WorldResult[] = [];
  const reportPath = path.join(CAPTURAS_DIR, "reporte-auditoria-108.json");

  if (runMobile) {
    console.log(`\n📱 --- PARTE 1: PRUEBA EN CELULAR (375 × 812) ---`);
    await page.setViewportSize({ width: 375, height: 812 });

    const mobileWorlds = [
      { subject: "lengua", worldId: 41001 },
      { subject: "matematica", worldId: 42001 },
      { subject: "sociales", worldId: 43001 },
      { subject: "naturales", worldId: 44001 },
    ];

    const mobileAlreadyDone = mobileWorlds.every((mw) =>
      fs.existsSync(path.join(CAPTURAS_DIR, `celular-${mw.subject}-${mw.worldId}.png`))
    );

    if (mobileAlreadyDone && fs.existsSync(reportPath)) {
      try {
        const prev = JSON.parse(fs.readFileSync(reportPath, "utf-8"));
        if (prev.mobilePlayed?.length === 4 && prev.mobilePlayed.every((r: { status: string }) => r.status === "OK")) {
          mobileResults.push(...prev.mobilePlayed);
          console.log(`📱 Los 4 mundos en celular ya fueron jugados y capturados con éxito.`);
        }
      } catch {}
    }

    if (mobileResults.length === 0) {
      for (const mw of mobileWorlds) {
        const worldDef = GRADE4_WORLDS.find((w) => w.id === mw.worldId)!;
        console.log(`📱 Jugando en celular Mundo ${mw.worldId} (${worldDef.subject}) "${worldDef.name}"...`);
        const t0 = Date.now();
        try {
          const res = await playOneWorld(page, testStudent.code, mw.worldId, "celular", true);
          const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
          console.log(`  -> Celular Mundo ${mw.worldId}: ✅ ${res.status} (${elapsed}s)`);
          mobileResults.push(res);
        } catch (err: unknown) {
          const errMsg = err instanceof Error ? err.message : String(err);
          const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
          console.error(`  -> Celular Mundo ${mw.worldId}: ❌ ERROR (${elapsed}s): ${errMsg}`);
          const shot = `problema-celular-${mw.worldId}.png`;
          try {
            await page.screenshot({ path: path.join(CAPTURAS_DIR, shot) });
          } catch {}
          mobileResults.push({
            worldId: mw.worldId,
            subject: worldDef.subject,
            name: worldDef.name,
            mode: "celular",
            status: "ERROR",
            activitiesCount: 0,
            issues: [errMsg],
            error: errMsg,
            screenshot: shot,
          });
          problems.push({
            worldId: mw.worldId,
            worldName: worldDef.name,
            screen: "celu",
            issue: errMsg,
            screenshot: shot,
            fixedOrClaude: "Para Claude",
          });
          try {
            await page.goto(`${BASE_URL}/student/play`);
          } catch {}
        }
      }
    }
  }

  // ==========================================
  // PARTE 2: Desktop (1280 × 800)
  // Los 108 mundos jugados completos
  // ==========================================
  console.log(`\n💻 --- PARTE 2: PRUEBA DE LOS 108 MUNDOS EN COMPUTADORA (1280 × 800) ---`);
  await page.setViewportSize({ width: 1280, height: 800 });

  // Cargar mundos previamente superados con OK
  const alreadyOkMap = new Map<number, WorldResult>();
  if (fs.existsSync(reportPath)) {
    try {
      const prev = JSON.parse(fs.readFileSync(reportPath, "utf-8"));
      for (const w of prev.desktopPlayed ?? []) {
        if (w.status === "OK") alreadyOkMap.set(w.worldId, w);
      }
    } catch {}
  }

  const desktopResults: WorldResult[] = [];
  let count = 0;

  for (const world of worldsToRun) {
    count++;
    if (alreadyOkMap.has(world.id) && (!subjectArg || subjectArg === "all")) {
      const prevRes = alreadyOkMap.get(world.id)!;
      console.log(`[${count}/${worldsToRun.length}] Mundo ${world.id} (${world.subject}) "${world.name}": ⏭️ YA SUPERADO EN SESIÓN ✅ OK (${prevRes.activitiesCount} acts)`);
      desktopResults.push(prevRes);
      continue;
    }

    const t0 = Date.now();
    try {
      const res = await playOneWorld(page, testStudent.code, world.id, "desktop", false);
      const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
      console.log(`[${count}/${worldsToRun.length}] Mundo ${world.id} (${world.subject}) "${world.name}": ✅ ${res.status} (${elapsed}s, ${res.activitiesCount} acts)`);
      desktopResults.push(res);
      alreadyOkMap.set(world.id, res);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
      console.error(`[${count}/${worldsToRun.length}] Mundo ${world.id} (${world.subject}) "${world.name}": ❌ ERROR (${elapsed}s): ${errMsg}`);
      const shot = `problema-${world.id}.png`;
      try {
        await page.screenshot({ path: path.join(CAPTURAS_DIR, shot) });
      } catch {}
      desktopResults.push({
        worldId: world.id,
        subject: world.subject,
        name: world.name,
        mode: "desktop",
        status: "ERROR",
        activitiesCount: 0,
        issues: [errMsg],
        error: errMsg,
        screenshot: shot,
      });
      problems.push({
        worldId: world.id,
        worldName: world.name,
        screen: "compu",
        issue: errMsg,
        screenshot: shot,
        fixedOrClaude: "Para Claude",
      });
      try {
        await page.goto(`${BASE_URL}/student/play`);
      } catch {}
    }
  }

  await browser.close();

  // Guardar resumen
  fs.writeFileSync(
    reportPath,
    JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        mobilePlayed: mobileResults,
        desktopPlayed: desktopResults,
        problems,
      },
      null,
      2
    ),
    "utf-8"
  );

  console.log(`\n======================================================`);
  console.log(`🏁 RESUMEN FINAL DE LA AUDITORÍA EN NAVEGADOR:`);
  console.log(`📱 Celular jugados: ${mobileResults.filter((r) => r.status === "OK").length}/${mobileResults.length}`);
  console.log(`💻 Desktop jugados: ${desktopResults.filter((r) => r.status === "OK").length}/${desktopResults.length}`);
  console.log(`⚠️  Problemas detectados: ${problems.length}`);
  console.log(`📄 Reporte JSON guardado en: ${reportPath}`);
  console.log(`======================================================\n`);
}

main().catch((err) => {
  console.error("Fallo general en runner:", err);
  process.exit(1);
});
