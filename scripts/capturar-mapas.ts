import { chromium } from "playwright";
import path from "node:path";
const BASE_URL = "http://localhost:3000";
const CAPTURAS_DIR = path.join(process.cwd(), "docs", "equipo", "capturas", "ag31");

async function main() {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  const resStudents = await page.request.get(`${BASE_URL}/api/students?adminPassword=docente2026`);
  const { students } = await resStudents.json();
  const testStudent = students.find((s: { grade: number; name: string; code: string }) => s.grade === 4 && s.name.includes("Prueba"));

  await page.goto(`${BASE_URL}/student`);
  await page.fill('input', testStudent.code);
  await page.click('button:has-text("Entrar")');
  await page.waitForURL("**/student/play");
  await page.waitForTimeout(1000);

  const materias = [
    { label: "Matemática", fileDesktop: "matematica-desktop.png", fileCelular: "matematica-celular.png" },
    { label: "Lengua", fileDesktop: "lengua-desktop.png", fileCelular: "lengua-celular.png" },
    { label: "Ciencias Sociales", fileDesktop: "sociales-desktop.png", fileCelular: "sociales-celular.png" },
    { label: "Ciencias Naturales", fileDesktop: "naturales-desktop.png", fileCelular: "naturales-celular.png" },
  ];

  // Desktop
  await page.setViewportSize({ width: 1280, height: 800 });
  for (const m of materias) {
    await page.click(`button:has-text("${m.label}")`);
    await page.waitForTimeout(600);

    const flecha = page.locator('span:has-text("¡Te toca!")').first();
    await flecha.scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy(0, 160));
    await page.waitForTimeout(500);

    const outPath = path.join(CAPTURAS_DIR, m.fileDesktop);
    await page.screenshot({ path: outPath });
    console.log(`📸 Desktop: ${m.label} guardada en ${m.fileDesktop}`);
  }

  // Celular (375 x 812)
  await page.setViewportSize({ width: 375, height: 812 });
  for (const m of materias) {
    await page.click(`button:has-text("${m.label}")`);
    await page.waitForTimeout(600);

    const flecha = page.locator('span:has-text("¡Te toca!")').first();
    await flecha.scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy(0, 140));
    await page.waitForTimeout(500);

    const outPath = path.join(CAPTURAS_DIR, m.fileCelular);
    await page.screenshot({ path: outPath });
    console.log(`📱 Celular: ${m.label} guardada en ${m.fileCelular}`);
  }

  await browser.close();
  console.log("✅ Capturas de mapas actualizadas con islas centradas!");
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
