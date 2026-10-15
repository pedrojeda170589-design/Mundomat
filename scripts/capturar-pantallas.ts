import { chromium } from "playwright";
import path from "path";
import fs from "fs";
import { guardarEventosConfig, leerEventosConfig } from "@/lib/eventos/server";

const CAPTURAS_DIR = path.join(process.cwd(), "docs", "equipo", "capturas", "ag33");

async function main() {
  if (!fs.existsSync(CAPTURAS_DIR)) {
    fs.mkdirSync(CAPTURAS_DIR, { recursive: true });
  }

  // Asegurar que el interruptor esté encendido para capturar el botón y cartelito
  const confOriginal = await leerEventosConfig();
  await guardarEventosConfig({
    ...confOriginal,
    "informe-alumno": { modo: "siempre", grados: [1, 2, 3, 4, 5, 6, 7] },
  });

  const browser = await chromium.launch({ headless: true });

  try {
    // ---------------------------------------------------------
    // 1. CELULAR (375 px)
    // ---------------------------------------------------------
    console.log("Capturando celular (375 px)...");
    const contextMobile = await browser.newContext({
      viewport: { width: 375, height: 667 },
      deviceScaleFactor: 2,
    });
    const pageMobile = await contextMobile.newPage();

    await pageMobile.goto("http://localhost:3000/student");
    await pageMobile.evaluate(() => {
      sessionStorage.setItem("mundomat_code", "R7GAZ");
      sessionStorage.setItem("mundomat_name", "Giovanni Alexander");
      localStorage.setItem("mt26-video-bienvenida-R7GAZ", String(Date.now()));
    });

    await pageMobile.goto("http://localhost:3000/student/play");
    await pageMobile.waitForLoadState("networkidle");

    // Si aparece video, saltar
    const saltarBtnM = pageMobile.locator("button:has-text('Saltar')");
    if (await saltarBtnM.isVisible({ timeout: 2000 }).catch(() => false)) {
      await saltarBtnM.click();
      await pageMobile.waitForTimeout(500);
    }

    const botonInformeMobile = pageMobile.locator("button:has-text('Descargar mi informe')");
    await botonInformeMobile.waitFor({ state: "visible", timeout: 15000 });

    // Captura del botón en celular
    await pageMobile.screenshot({
      path: path.join(CAPTURAS_DIR, "boton-celular-375px.png"),
      fullPage: false,
    });
    console.log("✓ Guardada captura: boton-celular-375px.png");

    // Abrir el cartelito
    await botonInformeMobile.click();
    await pageMobile.locator("text=Elegí qué período").waitFor({ state: "visible", timeout: 5000 });

    // Captura del cartelito en celular
    await pageMobile.screenshot({
      path: path.join(CAPTURAS_DIR, "cartelito-celular-375px.png"),
      fullPage: false,
    });
    console.log("✓ Guardada captura: cartelito-celular-375px.png");
    await contextMobile.close();

    // ---------------------------------------------------------
    // 2. COMPUTADORA (1280 px)
    // ---------------------------------------------------------
    console.log("Capturando computadora (1280 px)...");
    const contextDesktop = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 1,
    });
    const pageDesktop = await contextDesktop.newPage();

    await pageDesktop.goto("http://localhost:3000/student");
    await pageDesktop.evaluate(() => {
      sessionStorage.setItem("mundomat_code", "R7GAZ");
      sessionStorage.setItem("mundomat_name", "Giovanni Alexander");
      localStorage.setItem("mt26-video-bienvenida-R7GAZ", String(Date.now()));
    });

    await pageDesktop.goto("http://localhost:3000/student/play");
    await pageDesktop.waitForLoadState("networkidle");

    const saltarBtnD = pageDesktop.locator("button:has-text('Saltar')");
    if (await saltarBtnD.isVisible({ timeout: 2000 }).catch(() => false)) {
      await saltarBtnD.click();
      await pageDesktop.waitForTimeout(500);
    }

    const botonInformeDesktop = pageDesktop.locator("button:has-text('Descargar mi informe')");
    await botonInformeDesktop.waitFor({ state: "visible", timeout: 15000 });

    // Captura del botón en computadora
    await pageDesktop.screenshot({
      path: path.join(CAPTURAS_DIR, "boton-computadora.png"),
      fullPage: false,
    });
    console.log("✓ Guardada captura: boton-computadora.png");

    // Abrir el cartelito
    await botonInformeDesktop.click();
    await pageDesktop.locator("text=Elegí qué período").waitFor({ state: "visible", timeout: 5000 });

    // Captura del cartelito en computadora
    await pageDesktop.screenshot({
      path: path.join(CAPTURAS_DIR, "cartelito-computadora.png"),
      fullPage: false,
    });
    console.log("✓ Guardada captura: cartelito-computadora.png");
    await contextDesktop.close();

    // ---------------------------------------------------------
    // 3. INTERRUPTOR EN EL PANEL DOCENTE
    // ---------------------------------------------------------
    console.log("Capturando interruptor en el panel docente...");
    const contextAdmin = await browser.newContext({
      viewport: { width: 1280, height: 900 },
      deviceScaleFactor: 1,
    });
    const pageAdmin = await contextAdmin.newPage();

    await pageAdmin.goto("http://localhost:3000/admin");
    await pageAdmin.evaluate(() => {
      sessionStorage.setItem("mundomat_admin_password", "docente2026");
    });

    await pageAdmin.goto("http://localhost:3000/admin/dashboard");
    await pageAdmin.waitForLoadState("networkidle");

    // Buscar botón de la pestaña Desafíos y eventos
    const tabDesafios = pageAdmin.locator("button", { hasText: "Desafíos y eventos" });
    await tabDesafios.waitFor({ state: "visible", timeout: 15000 });
    await tabDesafios.click();

    // Esperar a que se vea la fila de "Mi informe en PDF"
    const filaInforme = pageAdmin.locator("text=Mi informe en PDF");
    await filaInforme.waitFor({ state: "visible", timeout: 15000 });
    await filaInforme.scrollIntoViewIfNeeded();
    await pageAdmin.waitForTimeout(500);

    await pageAdmin.screenshot({
      path: path.join(CAPTURAS_DIR, "interruptor-panel.png"),
      fullPage: false,
    });
    console.log("✓ Guardada captura: interruptor-panel.png");
    await contextAdmin.close();

  } finally {
    await browser.close();
    // Restaurar config original de eventos
    await guardarEventosConfig(confOriginal);
  }

  console.log("\n🎉 Todas las capturas fueron tomadas con éxito.");
}

main().catch((err) => {
  console.error("Error al capturar pantallas:", err);
  process.exit(1);
});
