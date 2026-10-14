import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE_URL = "http://localhost:3000";
const CAPTURAS_DIR = path.join(process.cwd(), "docs", "equipo", "capturas", "ag31");

async function main() {
  fs.mkdirSync(CAPTURAS_DIR, { recursive: true });

  console.log("🚀 Iniciando navegador Edge con Playwright...");
  const browser = await chromium.launch({
    channel: "msedge",
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  });
  const page = await context.newPage();

  console.log("🔑 Ingresando al panel docente...");
  await page.goto(`${BASE_URL}/admin`);
  await page.fill('input[type="password"]', "docente2026");
  await page.click('button[type="submit"]');
  await page.waitForURL("**/admin/dashboard");

  console.log("👤 Yendo a pestaña Alumnos...");
  await page.click('button:has-text("Alumnos")');
  await page.waitForTimeout(500);

  // Verificamos las opciones del select de Grado
  const selectGrado = page.locator('select[aria-label="Grado"]');
  const options = await selectGrado.locator('option').allTextContents();
  console.log("Opciones en selector de grado:", options);

  // Tomamos captura del problema: no está la opción 4.º en el select del panel
  const probPath = path.join(CAPTURAS_DIR, "problema-admin-falta-4to.png");
  await page.screenshot({ path: probPath });
  console.log(`📸 Captura del problema guardada en: ${probPath}`);

  // Creamos el alumno de 4.º mediante la API desde el navegador
  console.log("Creando alumno de prueba de 4.º grado vía API...");
  const addRes = await page.evaluate(async () => {
    const r = await fetch("/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Alumno Prueba 4to",
        displayName: "Prueba 4to",
        grade: 4,
        adminPassword: "docente2026",
      }),
    });
    return r.json();
  });
  console.log("Alumno creado:", addRes);

  const student = addRes.student;
  if (!student || !student.code) {
    throw new Error("No se pudo crear el alumno");
  }

  // Ahora navegamos a /student y nos logueamos como el alumno
  console.log("🎒 Logueando como alumno en /student...");
  await page.goto(`${BASE_URL}/student`);
  await page.fill('input', student.code);
  await page.click('button:has-text("Entrar")');
  await page.waitForURL("**/student/play");
  await page.waitForTimeout(1500);

  console.log("📸 Capturando mapas en Desktop (1280x800)...");
  const materias = [
    { id: "matematica", label: "Matemática", file: "matematica-desktop.png" },
    { id: "lengua", label: "Lengua", file: "lengua-desktop.png" },
    { id: "sociales", label: "Ciencias Sociales", file: "sociales-desktop.png" },
    { id: "naturales", label: "Ciencias Naturales", file: "naturales-desktop.png" },
  ];

  for (const m of materias) {
    console.log(`  -> Cambiando a ${m.label}...`);
    await page.click(`button:has-text("${m.label}")`);
    await page.waitForTimeout(1000);
    const outPath = path.join(CAPTURAS_DIR, m.file);
    await page.screenshot({ path: outPath, fullPage: false });
    console.log(`     Guardado: ${outPath}`);
  }

  console.log("📱 Cambiando a vista celular (375x812)...");
  await page.setViewportSize({ width: 375, height: 812 });
  await page.waitForTimeout(500);

  const materiasMobile = [
    { id: "matematica", label: "Matemática", file: "matematica-celular.png" },
    { id: "lengua", label: "Lengua", file: "lengua-celular.png" },
    { id: "sociales", label: "Ciencias Sociales", file: "sociales-celular.png" },
    { id: "naturales", label: "Ciencias Naturales", file: "naturales-celular.png" },
  ];

  for (const m of materiasMobile) {
    console.log(`  -> Celular: Cambiando a ${m.label}...`);
    await page.click(`button:has-text("${m.label}")`);
    await page.waitForTimeout(1000);
    const outPath = path.join(CAPTURAS_DIR, m.file);
    await page.screenshot({ path: outPath, fullPage: false });
    console.log(`     Guardado: ${outPath}`);
  }

  await browser.close();
  console.log("🎉 Capturas iniciales completadas con éxito!");
}

main().catch(err => {
  console.error("❌ Error en main:", err);
  process.exit(1);
});
