/* eslint-disable @typescript-eslint/no-explicit-any -- script de prueba con Playwright: lee campos de cualquier tipo de actividad */
import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs";
import { getProgress, saveProgress } from "../src/lib/data";

const BASE_URL = "http://localhost:3000";
const CAPTURAS_DIR = path.join(process.cwd(), "docs", "equipo", "capturas", "ag31");

async function main() {
  fs.mkdirSync(CAPTURAS_DIR, { recursive: true });

  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  const resStudents = await page.request.get(`${BASE_URL}/api/students?adminPassword=docente2026`);
  const { students } = await resStudents.json();
  const testStudent = students.find((s: any) => s.grade === 4 && s.name.includes("Prueba"));
  console.log("Alumno:", testStudent.code);

  // Limpiamos roundsInProgress, damos 500 monedas y ponemos 42001 en pendingRetry
  const prog = await getProgress(testStudent.code);
  prog.roundsInProgress = {};
  prog.coins = 500;
  prog.worldsPendingReinforcementRetry = [42001];
  await saveProgress(prog);

  // Vamos al mapa
  await page.goto(`${BASE_URL}/student`);
  await page.fill('input', testStudent.code);
  await page.click('button:has-text("Entrar")');
  await page.waitForURL("**/student/play");
  await page.waitForTimeout(1000);

  // Aseguramos pestaña Matemática
  await page.click('button:has-text("Matemática")');
  await page.waitForTimeout(500);

  // Hacemos click en la primera isla (42001) usando aria-label exacto
  console.log("Haciendo click en Mundo 42001...");
  const isla42001 = page.locator('button[aria-label^="Números hasta el 100.000"]');
  await isla42001.scrollIntoViewIfNeeded();
  await isla42001.click();
  await page.waitForTimeout(1500);

  // Leemos las actividades del round guardado en el servidor
  const progAfter = await getProgress(testStudent.code);
  const round = progAfter.roundsInProgress?.[42001];
  if (!round) throw new Error("No se encontró round para 42001");
  const activities = round.activities;
  console.log(`✅ Ronda obtenida con ${activities.length} actividades.`);

  for (let idx = 0; idx < activities.length; idx++) {
    const currentAct = activities[idx] as any;
    console.log(`\n--- Actividad ${idx + 1} de ${activities.length} (${currentAct.type}) ---`);
    await page.waitForTimeout(600);

    // 1. Consigna
    const promptEl = page.locator('p.text-lg, p.text-xl').first();
    const promptText = await promptEl.textContent();
    console.log(`Consigna: "${promptText?.trim()}"`);

    // 2. Pedir pista
    const btnPista = page.locator('button:has-text("Pista")');
    if (await btnPista.isVisible() && !(await btnPista.isDisabled())) {
      await btnPista.click();
      await page.waitForTimeout(300);
      const pistaEl = page.locator('div:has-text("Pista:")').first();
      console.log(`Pista visible: ${await pistaEl.isVisible()}`);
    }

    if (idx === 0) {
      await page.screenshot({ path: path.join(CAPTURAS_DIR, "mundo-42001-actividad-pista.png") });
      console.log("📸 Captura con pista guardada.");
    }

    // 3. Responder
    if (idx === 0) {
      // Equivocarse a propósito en la primera actividad
      console.log("Equivocándonos a propósito en la primera actividad...");
      if (currentAct.type === "input") {
        await page.locator('input[type="number"]').fill("9999999");
        await page.click('button:has-text("Responder")');
      } else if (currentAct.type === "true-false") {
        const btnAnswer = currentAct.isTrue ? page.locator('button:has-text("Falso")') : page.locator('button:has-text("Verdadero")');
        await btnAnswer.click();
      } else if (currentAct.type === "pick") {
        const wrongCard = currentAct.cards.find((c: any) => !currentAct.answerIds.includes(c.id));
        if (wrongCard?.label) {
          await page.locator(`button:has-text("${wrongCard.label}")`).first().click();
        } else {
          await page.locator('div.grid button').last().click();
        }
      } else if (currentAct.type === "pitagorica") {
        const gridBtns = page.locator('div[role="grid"] button');
        const wrongBtnIdx = (currentAct.fila + 1) * 12 + (((currentAct.columna + 2) % 10) + 1);
        await gridBtns.nth(wrongBtnIdx).click();
      } else {
        // MC
        const wrongIdx = ((currentAct.answerIndex ?? 0) + 1) % 4;
        const btns = page.locator('div.grid button');
        await btns.nth(wrongIdx).click();
      }

      await page.waitForTimeout(1200);
      await page.screenshot({ path: path.join(CAPTURAS_DIR, "mundo-42001-correccion.png") });
      console.log("📸 Captura de corrección guardada.");

      const feedbackTexts = await page.locator('div.parchment-panel p').allTextContents();
      console.log("Feedback corrección:", feedbackTexts.join(" | "));

      await page.click('button:has-text("Siguiente actividad")');
      await page.waitForTimeout(1000);
    } else {
      // Responder correctamente
      if (currentAct.type === "input") {
        await page.locator('input[type="number"]').fill(String(currentAct.answer));
        await page.click('button:has-text("Responder")');
      } else if (currentAct.type === "true-false") {
        const btnAnswer = currentAct.isTrue ? page.locator('button:has-text("Verdadero")') : page.locator('button:has-text("Falso")');
        await btnAnswer.click();
        if (currentAct.justification) {
          await page.waitForTimeout(600);
          const justBtns = page.locator('div.grid button');
          await justBtns.nth(currentAct.justification.answerIndex).click();
        }
      } else if (currentAct.type === "pick") {
        const correctCard = currentAct.cards.find((c: any) => currentAct.answerIds.includes(c.id));
        if (correctCard?.label) {
          await page.locator(`button:has-text("${correctCard.label}")`).first().click();
        } else {
          await page.locator('div.grid button').first().click();
        }
      } else if (currentAct.type === "pitagorica") {
        const gridBtns = page.locator('div[role="grid"] button');
        if (currentAct.modo === "cruce") {
          const btnIdx = (currentAct.fila + 1) * 12 + (currentAct.columna + 1);
          await gridBtns.nth(btnIdx).click();
        } else {
          const btnIdx = (currentAct.columna + 1) * 12 + (currentAct.fila + 1);
          await gridBtns.nth(btnIdx).click();
          await page.waitForTimeout(600);
          const rowHeaderIdx = (currentAct.columna + 1) * 12 + 0;
          await gridBtns.nth(rowHeaderIdx).click();
        }
      } else {
        // MC
        const btns = page.locator('div.grid button');
        const correctIdx = currentAct.answerIndex ?? 0;
        await btns.nth(correctIdx).click();
      }

      await page.waitForTimeout(1600);
      const nextBtn = page.locator('button:has-text("Siguiente actividad"), button:has-text("Ver resultado")');
      await nextBtn.click();
      await page.waitForTimeout(1000);
    }
  }

  // Esperar WorldDoneScreen
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(CAPTURAS_DIR, "mundo-42001-resultado.png") });
  console.log("📸 Captura de resultado guardada.");

  const doneTitle = await page.locator('h2').textContent();
  console.log(`Título en pantalla final: ${doneTitle}`);

  // Volver al mapa
  await page.click('button:has-text("Volver al mapa")');
  await page.waitForTimeout(1500);

  // Scrollear al mapa y capturar
  await page.locator('button[aria-label*="Números hasta el 100.000"]').first().scrollIntoViewIfNeeded();
  await page.screenshot({ path: path.join(CAPTURAS_DIR, "mundo-42001-mapa-superado.png") });
  console.log("📸 Captura del mapa con mundo superado guardada.");

  // Verificar pizarrón de novedades
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(CAPTURAS_DIR, "pizarron-novedades.png") });
  console.log("📸 Captura del pizarrón de novedades guardada.");

  const newsItems = await page.locator('section ul li').allTextContents();
  console.log("Items en el pizarrón:", newsItems);

  await browser.close();
  console.log("🎉 Prueba de mundo 42001 completada con total éxito!");
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
