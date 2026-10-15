import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs";

const BASE_URL = "http://localhost:3000";
const CAPTURAS_DIR = path.join(process.cwd(), "docs", "equipo", "capturas", "ag34");

async function capture(suffix: string) {
  if (!fs.existsSync(CAPTURAS_DIR)) {
    fs.mkdirSync(CAPTURAS_DIR, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 320, height: 640 } });
  const page = await context.newPage();

  // Student R7GAZ (Grade 3)
  await page.goto(`${BASE_URL}/student`);
  await page.evaluate(() => {
    sessionStorage.setItem("mundomat_code", "R7GAZ");
    sessionStorage.setItem("mundomat_name", "Giovanni Alexander");
    sessionStorage.setItem("mundomat_grade", "3");
    localStorage.setItem("mt26-video-bienvenida-R7GAZ", String(Date.now()));
  });

  // 1. Mapa letra (WorldMap)
  await page.goto(`${BASE_URL}/student/play`);
  await page.waitForSelector(".wood-panel-light", { timeout: 10000 });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(CAPTURAS_DIR, `mapa-letra-320${suffix}.png`) });
  console.log(`Saved mapa-letra-320${suffix}.png`);

  // 2. Metas especiales
  const btnMetas = page.locator("button[aria-label='Metas especiales']").first();
  if (await btnMetas.isVisible()) {
    await btnMetas.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(CAPTURAS_DIR, `metas-320${suffix}.png`) });
    console.log(`Saved metas-320${suffix}.png`);
    const closeBtn = page.locator("button:has-text('✕')").first();
    if (await closeBtn.isVisible()) await closeBtn.click();
    await page.waitForTimeout(300);
  }

  // 3. Vestidor
  const btnVestidor = page.locator("button[aria-label='Mi vestidor']").first();
  if (await btnVestidor.isVisible()) {
    await btnVestidor.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(CAPTURAS_DIR, `vestidor-320${suffix}.png`) });
    console.log(`Saved vestidor-320${suffix}.png`);
    const closeBtn = page.locator("button:has-text('✕')").first();
    if (await closeBtn.isVisible()) await closeBtn.click();
    await page.waitForTimeout(300);
  }

  // 4. Monte León
  const btnMonteLeon = page.locator("button:has-text('Monte León'), div:has-text('Monte León') button").first();
  if (await btnMonteLeon.isVisible()) {
    await btnMonteLeon.click();
    await page.waitForTimeout(600);
    const btnSaltar = page.locator("button:has-text('Saltar')").first();
    if (await btnSaltar.isVisible()) {
      await btnSaltar.click();
      await page.waitForTimeout(400);
    }
    await page.screenshot({ path: path.join(CAPTURAS_DIR, `monte-leon-320${suffix}.png`) });
    console.log(`Saved monte-leon-320${suffix}.png`);
    const closeBtn = page.locator("div[role='dialog'] button:has-text('✕')").last();
    if (await closeBtn.isVisible()) await closeBtn.click();
    await page.waitForTimeout(300);
  }

  // 5. Reserva patagónica
  const btnReserva = page.locator("button:has-text('Reserva'), div:has-text('Reserva patagónica') button").first();
  if (await btnReserva.isVisible()) {
    await btnReserva.click();
    await page.waitForTimeout(600);
    const btnSaltar = page.locator("button:has-text('Saltar')").first();
    if (await btnSaltar.isVisible()) {
      await btnSaltar.click();
      await page.waitForTimeout(400);
    }
    await page.screenshot({ path: path.join(CAPTURAS_DIR, `reserva-320${suffix}.png`) });
    console.log(`Saved reserva-320${suffix}.png`);
    const closeBtn = page.locator("div[role='dialog'] button:has-text('✕')").last();
    if (await closeBtn.isVisible()) await closeBtn.click();
    await page.waitForTimeout(300);
  }

  // 6. Torneo tablas (/student/tablas)
  await page.goto(`${BASE_URL}/student/tablas`);
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(CAPTURAS_DIR, `torneo-320${suffix}.png`) });
  console.log(`Saved torneo-320${suffix}.png`);

  await browser.close();
}

const arg = process.argv[2] ?? "-despues";
capture(arg).catch(console.error);
