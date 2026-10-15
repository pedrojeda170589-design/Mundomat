import { chromium, Page } from "playwright";
import path from "node:path";
import fs from "node:fs";
import { detectarProblemasCelular, ProblemaCelular } from "./detector-celular";

const BASE_URL = "http://localhost:3000";
const CAPTURAS_DIR = path.join(process.cwd(), "docs", "equipo", "capturas", "ag32");

export interface ScreenCheckResult {
  pantalla: string;
  tamano: "375x812" | "320x640";
  captura: string;
  problemas: ProblemaCelular[];
  arreglado?: boolean;
}

const resultados: ScreenCheckResult[] = [];

async function setupStudentSession(page: Page, code: string, name: string) {
  await page.goto(`${BASE_URL}/student`);
  await page.evaluate(
    ({ c, n }) => {
      sessionStorage.setItem("mundomat_code", c);
      sessionStorage.setItem("mundomat_name", n);
      localStorage.setItem(`mt26-video-bienvenida-${c}`, String(Date.now()));
    },
    { c: code, n: name }
  );
}

async function checkScreen(
  page: Page,
  pantalla: string,
  fileName375: string,
  fileName320?: string
) {
  // 1. Probar en 375x812
  await page.setViewportSize({ width: 375, height: 812 });
  await page.waitForTimeout(400);

  const shotPath375 = path.join(CAPTURAS_DIR, fileName375);
  await page.screenshot({ path: shotPath375, fullPage: false });

  const probs375 = await detectarProblemasCelular(page, {
    ignorarTipos: ["boton-chico"], // se audita por separado
  });

  resultados.push({
    pantalla,
    tamano: "375x812",
    captura: fileName375,
    problemas: probs375,
  });

  console.log(`📱 [375px] ${pantalla}: ${probs375.length === 0 ? "✅ OK" : `⚠️ ${probs375.length} problemas`}`);
  for (const p of probs375) {
    console.log(`   - [${p.tipo}] ${p.texto}: ${p.detalle}`);
  }

  // 2. Probar en 320x640 (celular chico)
  await page.setViewportSize({ width: 320, height: 640 });
  await page.waitForTimeout(400);

  if (fileName320) {
    const shotPath320 = path.join(CAPTURAS_DIR, fileName320);
    await page.screenshot({ path: shotPath320, fullPage: false });
  }

  const probs320 = await detectarProblemasCelular(page, {
    ignorarTipos: ["boton-chico"],
  });

  resultados.push({
    pantalla,
    tamano: "320x640",
    captura: fileName320 ?? fileName375,
    problemas: probs320,
  });

  console.log(`📱 [320px] ${pantalla}: ${probs320.length === 0 ? "✅ OK" : `⚠️ ${probs320.length} problemas`}`);
  for (const p of probs320) {
    console.log(`   - [${p.tipo}] ${p.texto}: ${p.detalle}`);
  }

  // Restaurar a 375
  await page.setViewportSize({ width: 375, height: 812 });
}

async function main() {
  if (!fs.existsSync(CAPTURAS_DIR)) {
    fs.mkdirSync(CAPTURAS_DIR, { recursive: true });
  }

  console.log("=== INICIANDO RECORRIDO EN CELULAR (AG-32) ===\n");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const page = await context.newPage();

  // Obtener alumnos de prueba
  const resStudents = await page.request.get(`${BASE_URL}/api/students?adminPassword=docente2026`);
  const { students } = (await resStudents.json()) as { students: Array<{ code: string; name: string; grade?: number }> };

  const sGrade3 = students.find((s) => !s.grade || s.grade === 3) || students[0];
  const sGrade2 = students.find((s) => s.grade === 2) || sGrade3;
  const sGrade4 = students.find((s) => s.grade === 4) || sGrade3;

  // ------------------------------------------------------------------
  // 1. INGRESO DEL ALUMNO (/student)
  // ------------------------------------------------------------------
  await page.goto(`${BASE_URL}/student`);
  await checkScreen(page, "Ingreso del alumno (/student)", "01-ingreso-alumno-375.png", "01-ingreso-alumno-320.png");

  // ------------------------------------------------------------------
  // 2. MAPAS POR GRADO
  // ------------------------------------------------------------------
  // 3.º Grado (por defecto)
  await setupStudentSession(page, sGrade3.code, sGrade3.name);
  await page.goto(`${BASE_URL}/student/play`);
  await page.waitForSelector(".wood-panel-light");
  await checkScreen(page, "Mapa de 3.º grado", "02-mapa-3er-grado-375.png", "02-mapa-3er-grado-320.png");

  // 2.º Grado
  if (sGrade2) {
    await setupStudentSession(page, sGrade2.code, sGrade2.name);
    await page.goto(`${BASE_URL}/student/play`);
    await page.waitForSelector(".wood-panel-light");
    await checkScreen(page, "Mapa de 2.º grado", "03-mapa-2do-grado-375.png", "03-mapa-2do-grado-320.png");
  }

  // 1.º Grado
  await page.evaluate(() => {
    sessionStorage.setItem("mundomat_grade", "1");
  });
  // Si hay alumno de 1ro o cambiamos grado
  await checkScreen(page, "Mapa de 1.º grado", "04-mapa-1er-grado-375.png", "04-mapa-1er-grado-320.png");

  // 4.º Grado
  if (sGrade4) {
    await setupStudentSession(page, sGrade4.code, sGrade4.name);
    await page.goto(`${BASE_URL}/student/play`);
    await page.waitForSelector(".wood-panel-light");
    await checkScreen(page, "Mapa de 4.º grado", "05-mapa-4to-grado-375.png", "05-mapa-4to-grado-320.png");
  }

  // Volver a sesión de alumno de 3.º
  await setupStudentSession(page, sGrade3.code, sGrade3.name);
  await page.goto(`${BASE_URL}/student/play`);
  await page.waitForSelector(".wood-panel-light");

  // ------------------------------------------------------------------
  // 3. MODALES Y PANELES DEL MAPA
  // ------------------------------------------------------------------
  // Pizarrón de novedades
  const btnNovedades = page.locator('button:has-text("Novedades"), button:has-text("Pizarrón"), button:has-text("📜")').first();
  if (await btnNovedades.isVisible()) {
    await btnNovedades.click();
    await page.waitForTimeout(400);
    await checkScreen(page, "Pizarrón de novedades", "06-pizarron-375.png", "06-pizarron-320.png");
    const closeBtn = page.locator('button[aria-label="Cerrar"], button:has-text("✕"), button:has-text("Cerrar")').last();
    if (await closeBtn.isVisible()) await closeBtn.click();
    await page.waitForTimeout(300);
  }

  // Metas especiales (🎯)
  await page.goto(`${BASE_URL}/student/play`);
  await page.waitForSelector(".wood-panel-light");
  const btnMetas = page.locator('button[title*="Metas"], button[aria-label="Metas especiales"]').first();
  if (await btnMetas.isVisible()) {
    await btnMetas.click();
    await page.waitForTimeout(400);
    await checkScreen(page, "Metas especiales (🎯)", "07-metas-especiales-375.png", "07-metas-especiales-320.png");
    const closeBtn = page.locator('div[role="dialog"] button[aria-label="Cerrar"], div[role="dialog"] button:has-text("✕")').last();
    if (await closeBtn.isVisible()) await closeBtn.click();
    await page.waitForTimeout(300);
  }

  // Mi vestidor (👕)
  await page.goto(`${BASE_URL}/student/play`);
  await page.waitForSelector(".wood-panel-light");
  const btnVestidor = page.locator('button[title*="vestidor"], button[aria-label="Mi vestidor"]').first();
  if (await btnVestidor.isVisible()) {
    await btnVestidor.click();
    await page.waitForTimeout(400);
    await checkScreen(page, "Mi vestidor (👕)", "08-vestidor-375.png", "08-vestidor-320.png");
    const closeBtn = page.locator('div[role="dialog"] button[aria-label="Cerrar"], div[role="dialog"] button:has-text("✕")').last();
    if (await closeBtn.isVisible()) await closeBtn.click();
    await page.waitForTimeout(300);
  }

  // Tienda (Cofre / Tienda)
  await page.goto(`${BASE_URL}/student/play`);
  await page.waitForSelector(".wood-panel-light");
  const btnTienda = page.locator('button[title*="Tienda"], button:has(span:has-text("🛍️"))').first();
  if (await btnTienda.isVisible()) {
    await btnTienda.click();
    await page.waitForTimeout(400);
    await checkScreen(page, "Tienda de avatares", "09-tienda-375.png", "09-tienda-320.png");
    const closeBtn = page.locator('div[role="dialog"] button[aria-label="Cerrar"], div[role="dialog"] button:has-text("✕")').last();
    if (await closeBtn.isVisible()) await closeBtn.click();
    await page.waitForTimeout(300);
  }

  // Fichas para imprimir
  await page.goto(`${BASE_URL}/student/play`);
  await page.waitForSelector(".wood-panel-light");
  const btnFichas = page.locator('button:has-text("Fichas"), button:has-text("Descargar fichas"), button[title*="Fichas"]').first();
  if (await btnFichas.isVisible()) {
    await btnFichas.click();
    await page.waitForTimeout(400);
    await checkScreen(page, "Fichas para imprimir", "10-fichas-imprimir-375.png", "10-fichas-imprimir-320.png");
    const closeBtn = page.locator('div[role="dialog"] button[aria-label="Cerrar"], div[role="dialog"] button:has-text("✕")').last();
    if (await closeBtn.isVisible()) await closeBtn.click();
    await page.waitForTimeout(300);
  }

  // ------------------------------------------------------------------
  // 4. ACTIVIDADES ESPECIALES
  // ------------------------------------------------------------------
  // Repaso de las tablas (/student/tablas)
  await page.goto(`${BASE_URL}/student/tablas`);
  await page.waitForTimeout(500);
  await checkScreen(page, "Repaso de las tablas (/student/tablas)", "11-tablas-375.png", "11-tablas-320.png");

  // Competencia (/student/competencia)
  await page.goto(`${BASE_URL}/student/competencia`);
  await page.waitForTimeout(500);
  await checkScreen(page, "Competencia escolar (/student/competencia)", "12-competencia-375.png", "12-competencia-320.png");

  // Reserva patagónica y Monte León
  await page.goto(`${BASE_URL}/student/play`);
  await page.waitForSelector(".wood-panel-light");

  const btnReserva = page.locator('button:has-text("Reserva"), div:has-text("Reserva patagónica") button').first();
  if (await btnReserva.isVisible()) {
    await btnReserva.click();
    await page.waitForTimeout(500);
    // Si aparece video intro, capturarlo y luego saltarlo
    const btnSaltar = page.locator('button:has-text("Saltar")').first();
    if (await btnSaltar.isVisible()) {
      await checkScreen(page, "Reserva patagónica (Intro video)", "13-reserva-video-375.png", "13-reserva-video-320.png");
      await btnSaltar.click();
      await page.waitForTimeout(500);
    }
    await checkScreen(page, "Reserva patagónica", "13-reserva-patagonica-375.png", "13-reserva-patagonica-320.png");
    const closeBtn = page.locator('div[role="dialog"] button[aria-label="Cerrar"], div[role="dialog"] button:has-text("✕")').last();
    if (await closeBtn.isVisible()) await closeBtn.click();
    await page.waitForTimeout(300);
  }

  await page.goto(`${BASE_URL}/student/play`);
  await page.waitForSelector(".wood-panel-light");

  const btnMonteLeon = page.locator('button:has-text("Monte León"), div:has-text("Monte León") button').first();
  if (await btnMonteLeon.isVisible()) {
    await btnMonteLeon.click();
    await page.waitForTimeout(500);
    // Si aparece video intro, capturarlo y luego saltarlo
    const btnSaltar = page.locator('button:has-text("Saltar")').first();
    if (await btnSaltar.isVisible()) {
      await checkScreen(page, "Viaje a Monte León (Intro video)", "14-monte-leon-video-375.png", "14-monte-leon-video-320.png");
      await btnSaltar.click();
      await page.waitForTimeout(500);
    }
    await checkScreen(page, "Viaje a Monte León", "14-monte-leon-375.png", "14-monte-leon-320.png");
    const closeBtn = page.locator('div[role="dialog"] button[aria-label="Cerrar"], div[role="dialog"] button:has-text("✕")').last();
    if (await closeBtn.isVisible()) await closeBtn.click();
    await page.waitForTimeout(300);
  }

  await page.goto(`${BASE_URL}/student/play`);
  await page.waitForSelector(".wood-panel-light");

  // ------------------------------------------------------------------
  // 5. TIPOS DE ACTIVIDADES Y CORRECCIÓN DE DICTADO (320 px)
  // ------------------------------------------------------------------
  console.log("\n--- Probando tipos de actividades en ActivityRunner ---");

  // Jugamos una actividad del mapa para ver runner
  const islaBtn = page.locator('span:has-text("¡Te toca!"), button:has-text("La Aldea de los Números")').first();
  if (await islaBtn.isVisible()) {
    await islaBtn.click();
    await page.waitForSelector(".parchment-panel, button:has-text('Salir')", { timeout: 6000 });
    await page.waitForTimeout(500);
    await checkScreen(page, "Actividad en curso (Runner)", "15-actividad-runner-375.png", "15-actividad-runner-320.png");

    const btnSalir = page.locator('button:has-text("Salir")').first();
    if (await btnSalir.isVisible()) await btnSalir.click();
    await page.waitForTimeout(400);
  }

  // Actividad de Dictado con corrección («Tenías que escribir» a 320 px)
  console.log("Probando corrección de dictado en 320 px...");
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="stylesheet" href="${BASE_URL}/_next/static/css/app/layout.css">
      <style>
        * { box-sizing: border-box; }
        body { margin: 0; padding: 12px; background: #0f172a; font-family: ui-sans-serif, system-ui; }
        .parchment-panel {
          background: #fef3c7; border: 4px solid #b45309; border-radius: 24px; padding: 16px;
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); width: 100%; max-width: 448px; margin: 0 auto;
        }
        .wood-panel-light {
          display: flex; align-items: center; justify-content: space-between; gap: 8px;
          padding: 8px 12px; border-radius: 16px; background: rgba(69, 26, 3, 0.4);
          border: 1px solid rgba(245, 158, 11, 0.2); width: 100%; max-width: 448px; margin: 0 auto 12px;
        }
        .btn-salir { flex-shrink: 0; white-space: nowrap; color: #fffbeb; font-size: 14px; font-weight: 600; border: none; background: none; }
        .title-container { flex: 1; min-width: 0; text-align: center; font-size: 14px; color: #fffbeb; font-weight: 600; }
        .title-truncate { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .coins { flex-shrink: 0; padding: 4px 8px; border-radius: 9999px; background: #fef3c7; color: #78350f; font-weight: 700; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="wood-panel-light">
        <button class="btn-salir">← Salir</button>
        <span class="title-container">
          <span class="title-truncate">✍️ Dictado de oraciones</span>
          <span style="display:block; font-size: 12px; color: rgba(254, 243, 199, 0.9);">1/5</span>
        </span>
        <span style="flex-shrink:0;"><div class="coins">🪙 150</div></span>
      </div>

      <div class="parchment-panel">
        <p style="font-size: 18px; font-weight: bold; text-align: center; color: #78350f; margin-bottom: 12px;">
          Escuchá y escribí la oración
        </p>

        <div style="display: flex; justify-content: center; margin-bottom: 16px;">
          <button style="display: flex; align-items: center; gap: 8px; border-radius: 16px; background: #f59e0b; color: #020617; font-weight: 900; padding: 12px 24px; font-size: 16px; border: none; cursor: pointer;">
            <span style="font-size: 20px;">🔊</span> <span>Escuchar</span>
          </button>
        </div>

        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px; margin-top: 8px; text-align: center;">
          <p style="color: #f87171; font-weight: bold; font-size: 16px; margin: 0;">¡Casi! Mirá cómo se escribe:</p>
          <div style="width: 100%; border-radius: 16px; background: rgba(30, 41, 59, 0.9); border: 2px solid rgba(52, 211, 153, 0.6); padding: 10px 12px;">
            <p style="font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; color: #6ee7b7; margin: 0 0 4px 0;">Tenías que escribir</p>
            <p style="font-size: 20px; font-weight: 900; letter-spacing: 0.025em; color: #ffffff; word-break: break-word; margin: 0;">
              <span>La </span><span style="border-radius: 4px; padding: 0 2px; background: #fbbf24; color: #020617;">gran</span><span> ballena salta en el mar.</span>
            </p>
            <p style="margin-top: 6px; font-size: 14px; color: #cbd5e1; word-break: break-word;">
              Vos escribiste: <span style="font-weight: bold; color: #f1f5f9;">«La ballena salta en el mar.»</span>
            </p>
          </div>

          <ul style="width: 100%; text-align: left; font-size: 14px; color: #fef3c7; background: rgba(69, 26, 3, 0.6); border: 1px solid rgba(245, 158, 11, 0.4); border-radius: 12px; padding: 8px 12px; margin: 0; list-style: none; display: flex; flex-direction: column; gap: 4px;">
            <li>👉 Te faltó la palabra «gran»</li>
          </ul>

          <p style="font-size: 12px; color: #94a3b8; margin: 4px 0 0 0;">
            <span style="border-radius: 4px; background: #f43f5e; padding: 0 4px; color: white;">rojo</span> = lo que pusiste distinto ·
            <span style="border-radius: 4px; background: #fbbf24; padding: 0 4px; color: #020617;">amarillo</span> = lo que te faltó
          </p>

          <button style="border-radius: 9999px; background: #f59e0b; color: #020617; font-weight: 900; padding: 8px 24px; font-size: 14px; border: none; margin-top: 8px; cursor: pointer;">
            Continuar →
          </button>
        </div>
      </div>
    </body>
    </html>
  `);
  await checkScreen(page, "Dictado - Corrección Tenías que escribir", "15b-dictado-correccion-375.png", "15b-dictado-correccion-320.png");

  // Video de festejo / animación con botón Saltar y Sonido
  console.log("Probando video animación (Saltar y Sonido)...");
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; background: rgba(0,0,0,0.85); font-family: ui-sans-serif, system-ui; }
        .modal-overlay {
          position: fixed; inset: 0; z-index: 100; display: flex; flex-direction: column;
          align-items: center; justify-content: center; padding: 16px;
        }
        .video-box {
          position: relative; width: 100%; max-width: 320px; aspect-ratio: 1;
          border-radius: 24px; border: 4px solid #fcd34d; background: #0f172a;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;
        }
        .bottom-bar {
          position: absolute; bottom: -56px; left: 0; right: 0;
          display: flex; justify-content: center; gap: 8px;
        }
        .btn-sonido {
          min-height: 44px; min-width: 44px; border-radius: 9999px; background: rgba(255,255,255,0.9);
          padding: 8px 16px; font-size: 14px; font-weight: 900; color: #0f172a; border: none; cursor: pointer;
        }
        .btn-saltar {
          min-height: 44px; min-width: 44px; border-radius: 9999px; background: #fbbf24;
          padding: 8px 20px; font-size: 14px; font-weight: 900; color: #020617; border: none; cursor: pointer;
        }
      </style>
    </head>
    <body>
      <div class="modal-overlay">
        <div class="video-box">
          <span style="font-size: 64px;">🎬</span>
          <div class="bottom-bar">
            <button class="btn-sonido">🔊 Sonido</button>
            <button class="btn-saltar">Saltar ⏭</button>
          </div>
        </div>
      </div>
    </body>
    </html>
  `);
  await checkScreen(page, "Video de animación (Saltar y Sonido)", "15c-video-animacion-375.png", "15c-video-animacion-320.png");

  // ------------------------------------------------------------------
  // 6. PANEL DOCENTE
  // ------------------------------------------------------------------
  // Login /admin
  await page.goto(`${BASE_URL}/admin`);
  await checkScreen(page, "Panel Docente - Login (/admin)", "16-docente-login-375.png", "16-docente-login-320.png");

  // Iniciar sesión docente
  await page.fill('input[type="password"]', "docente2026");
  await page.click('button[type="submit"]');
  await page.waitForURL("**/admin/dashboard");
  await page.waitForTimeout(500);
  await checkScreen(page, "Panel Docente - Dashboard (/admin/dashboard)", "17-docente-dashboard-375.png", "17-docente-dashboard-320.png");

  // Reporte de alumno
  const testCode = sGrade3?.code || "QKNQZ";
  await page.goto(`${BASE_URL}/admin/reporte/alumno?code=${testCode}`);
  await page.waitForSelector(".parchment-panel, .wood-panel, h1, h2, table", { timeout: 6000 }).catch(() => {});
  await page.waitForTimeout(600);
  await checkScreen(page, "Panel Docente - Reporte alumno", "18-docente-reporte-alumno-375.png", "18-docente-reporte-alumno-320.png");

  // Qué reforzar por contenidos
  await page.goto(`${BASE_URL}/admin/reporte/alumno-contenidos?code=${testCode}`);
  await page.waitForSelector(".parchment-panel, .wood-panel, h1, h2, table", { timeout: 6000 }).catch(() => {});
  await page.waitForTimeout(600);
  await checkScreen(page, "Panel Docente - Qué reforzar", "19-docente-reforzar-375.png", "19-docente-reforzar-320.png");

  await browser.close();

  // Guardar informe JSON
  const reportJson = path.join(CAPTURAS_DIR, "recorrido-reporte.json");
  fs.writeFileSync(reportJson, JSON.stringify(resultados, null, 2), "utf-8");
  console.log(`\n✅ Recorrido finalizado. Informe guardado en: ${reportJson}`);
}

if (process.argv[1]?.endsWith("recorrido-celular.ts")) {
  main().catch((err) => {
    console.error("Error en recorrido-celular:", err);
    process.exit(1);
  });
}
