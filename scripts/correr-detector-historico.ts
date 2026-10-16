import { chromium } from "playwright";
import { detectarProblemasCelular, ProblemaCelular } from "./detector-celular";
import { getProgress, saveProgress } from "../src/lib/data";
import { ActivitySpec } from "../src/lib/activities";

const BASE_URL = "http://localhost:3000";

export async function probar43001(viewport = { width: 375, height: 812 }): Promise<ProblemaCelular[]> {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();

  try {
    await page.goto(`${BASE_URL}/student`);
    await page.evaluate(() => {
      sessionStorage.setItem("mundomat_code", "H5CKT");
      sessionStorage.setItem("mundomat_name", "Alumno Prueba 4to");
      sessionStorage.setItem("mundomat_grade", "4");
      localStorage.setItem("mt26-video-bienvenida-H5CKT", String(Date.now()));
    });

    await page.goto(`${BASE_URL}/student/play`);
    await page.waitForSelector(".wood-panel-light", { timeout: 10000 });

    const tabSociales = page.locator('button:has-text("Ciencias Sociales"), button:has-text("Sociales")').first();
    await tabSociales.click();
    await page.waitForTimeout(500);

    const isla43001 = page.locator('button[aria-label*="Santa Cruz en el mapa"]').first();
    await isla43001.click();
    await page.waitForSelector("button:has-text('Salir')", { timeout: 8000 });
    await page.waitForTimeout(500);

    // Evaluar detector
    const problemas = await detectarProblemasCelular(page, {
      ignorarTipos: ["boton-chico", "letra-chica"],
    });

    return problemas;
  } finally {
    await browser.close();
  }
}

export async function probar44001(viewport = { width: 375, height: 812 }): Promise<ProblemaCelular[]> {
  const { NATURALES_BANK } = await import("../src/lib/grade4/content/naturales");
  const { qToPick } = await import("../src/lib/grade4/content/util");
  const qPrecip = NATURALES_BANK[1][2]; // "¿Qué factor geográfico favorece el desarrollo del bosque andino en la cordillera?"
  const actPrecip = qToPick(qPrecip, "nat-44001-precip", "Ciencias Naturales", []);
  const dummyAct = qToPick(NATURALES_BANK[1][0], "nat-44001-dummy", "Ciencias Naturales", []);

  const prog = await getProgress("H5CKT");
  const iso = new Date().toISOString();
  prog.roundsInProgress = {
    44001: {
      id: "test-round-precip-12345678",
      startedAt: iso,
      updatedAt: iso,
      index: 1, // Reanuda en la actividad 1 (actPrecip)
      correctCount: 0,
      activities: [dummyAct, actPrecip] as unknown as ActivitySpec[],
    },
  };
  await saveProgress(prog);


  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();

  try {
    await page.goto(`${BASE_URL}/student`);
    await page.evaluate(() => {
      sessionStorage.setItem("mundomat_code", "H5CKT");
      sessionStorage.setItem("mundomat_name", "Alumno Prueba 4to");
      sessionStorage.setItem("mundomat_grade", "4");
      localStorage.setItem("mt26-video-bienvenida-H5CKT", String(Date.now()));
    });

    await page.goto(`${BASE_URL}/student/play`);
    await page.waitForSelector(".wood-panel-light", { timeout: 10000 });

    const tabNaturales = page.locator('button:has-text("Ciencias Naturales"), button:has-text("Naturales")').first();
    await tabNaturales.click();
    await page.waitForTimeout(500);

    const isla44001 = page.locator('button[aria-label*="Diversidad de ambientes"]').first();
    await isla44001.click();
    await page.waitForSelector("button:has-text('Salir')", { timeout: 8000 });
    await page.waitForTimeout(500);

    const problemas = await detectarProblemasCelular(page, {
      ignorarTipos: ["boton-chico", "letra-chica"],
    });

    return problemas;
  } finally {
    await browser.close();
  }
}

export async function probarMapa(studentCode = "R7GAZ", viewport = { width: 375, height: 812 }): Promise<ProblemaCelular[]> {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();

  try {
    await page.goto(`${BASE_URL}/student`);
    await page.evaluate(({ c }) => {
      sessionStorage.setItem("mundomat_code", c);
      sessionStorage.setItem("mundomat_name", "Giovanni Alexander");
      sessionStorage.setItem("mundomat_grade", "3");
      localStorage.setItem(`mt26-video-bienvenida-${c}`, String(Date.now()));
    }, { c: studentCode });

    await page.goto(`${BASE_URL}/student/play`);
    await page.waitForSelector(".wood-panel-light", { timeout: 10000 });
    await page.waitForTimeout(500);

    const problemas = await detectarProblemasCelular(page, {
      ignorarTipos: ["boton-chico", "letra-chica"],
    });

    return problemas;
  } finally {
    await browser.close();
  }
}

export async function probarMonteLeon(viewport = { width: 320, height: 640 }): Promise<ProblemaCelular[]> {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();

  try {
    await page.goto(`${BASE_URL}/student`);
    await page.evaluate(() => {
      sessionStorage.setItem("mundomat_code", "R7GAZ");
      sessionStorage.setItem("mundomat_name", "Giovanni Alexander");
      sessionStorage.setItem("mundomat_grade", "3");
      localStorage.setItem("mt26-video-bienvenida-R7GAZ", String(Date.now()));
    });

    await page.goto(`${BASE_URL}/student/play`);
    await page.waitForSelector(".wood-panel-light", { timeout: 10000 });

    const btnMonteLeon = page.locator('button:has-text("Monte León"), div:has-text("Monte León") button').first();
    await btnMonteLeon.click();
    await page.waitForTimeout(600);

    const btnSaltar = page.locator('button:has-text("Saltar")').first();
    if (await btnSaltar.isVisible()) {
      await btnSaltar.click();
      await page.waitForTimeout(500);
    }

    await page.waitForSelector('div[role="dialog"]', { timeout: 5000 });
    await page.waitForTimeout(400);

    const problemas = await detectarProblemasCelular(page, {
      ignorarTipos: ["boton-chico", "letra-chica"],
    });

    return problemas;
  } finally {
    await browser.close();
  }
}

async function main() {
  const testName = process.argv[2] || "all";
  console.log(`=== CORREDOR DE PRUEBAS HISTÓRICAS REALES (Modo: ${testName}) ===\n`);

  if (testName === "43001" || testName === "all") {
    console.log("--> Probando Mundo 43001 a 375 px...");
    const p43001 = await probar43001();
    console.log(`Resultado 43001: ${p43001.length} problemas encontrados.`);
    for (const p of p43001) console.log(`   [${p.tipo}] ${p.texto}: ${p.detalle}`);
  }

  if (testName === "44001" || testName === "all") {
    console.log("\n--> Probando Mundo 44001 a 375 px...");
    const p44001 = await probar44001();
    console.log(`Resultado 44001: ${p44001.length} problemas encontrados.`);
    for (const p of p44001) console.log(`   [${p.tipo}] ${p.texto}: ${p.detalle}`);
  }

  if (testName === "mapa" || testName === "all") {
    console.log("\n--> Probando Mapa a 375 px...");
    const pMapa = await probarMapa();
    console.log(`Resultado Mapa: ${pMapa.length} problemas encontrados.`);
    for (const p of pMapa) console.log(`   [${p.tipo}] ${p.texto}: ${p.detalle}`);
  }

  if (testName === "monteleon" || testName === "all") {
    console.log("\n--> Probando Monte León a 320 px...");
    const pML = await probarMonteLeon();
    console.log(`Resultado Monte León: ${pML.length} problemas encontrados.`);
    for (const p of pML) console.log(`   [${p.tipo}] ${p.texto}: ${p.detalle}`);
  }
}

if (process.argv[1]?.endsWith("correr-detector-historico.ts")) {
  main().catch((err) => {
    console.error("Error en corredor histórico:", err);
    process.exit(1);
  });
}
