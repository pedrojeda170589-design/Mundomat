// Pruebas completas de AG-33 (Informe del alumno en PDF y tablas).
// Ejecutar con: npx tsx scripts/test-informe-alumno.ts

import assert from "node:assert/strict";
import { PDFDocument } from "pdf-lib";
import { NextRequest } from "next/server";
import type { Student, StudentProgress } from "@/types";
import { tablasDelAlumno } from "@/lib/informeAlumno/tablas";
import { armarInformeAlumno, pdfDelInforme } from "@/lib/informeAlumno/pdf";
import { GET } from "@/app/api/informe-alumno/route";
import { guardarEventosConfig, leerEventosConfig } from "@/lib/eventos/server";
import { sumarPartida } from "@/lib/torneo/prioridades";
import { getMetaTabla, PENALIDAD_ERROR_MS } from "@/lib/torneo/tiempos";
import { getStudents } from "@/lib/data";
import { MAX_FAILED_ATTEMPTS } from "@/lib/rateLimit";
import { delKey } from "@/lib/store";

const mockProg = (over: Partial<StudentProgress> = {}): StudentProgress =>
  ({
    code: "TESTCOD123",
    completedWorlds: [1, 2, 3],
    activityLog: [],
    coins: 50,
    ...over,
  } as StudentProgress);

const mockStudent = (over: Partial<Student> = {}): Student =>
  ({
    code: "TESTCOD123",
    name: "Ñaupa Gómez",
    grade: 3,
    type: "aula",
    createdAt: "2026-03-01T00:00:00Z",
    ...over,
  } as Student);

function containsString(obj: unknown, target: string): boolean {
  if (typeof obj === "string") {
    return obj.toLowerCase().includes(target.toLowerCase());
  }
  if (Array.isArray(obj)) {
    return obj.some((item) => containsString(item, target));
  }
  if (obj && typeof obj === "object") {
    for (const [k, v] of Object.entries(obj)) {
      if (k.toLowerCase().includes(target.toLowerCase())) return true;
      if (containsString(v, target)) return true;
    }
  }
  return false;
}

async function run() {
  console.log("=== AG-33: PRUEBAS DEL INFORME DEL ALUMNO EN PDF ===");

  // --------------------------------------------------------------------------
  // 1. CLASIFICACIÓN DE TABLAS
  // --------------------------------------------------------------------------
  console.log("\n1. Clasificación de tablas:");

  // Caso 1: sin datos -> todavía no
  const pVacio = mockProg();
  const cVacio = tablasDelAlumno(pVacio);
  const t9SinDatos = cVacio.todas.find((t) => t.tabla === 9)!;
  assert.equal(t9SinDatos.grupo, "sin-practicar");
  assert.ok(t9SinDatos.texto.includes("todavía no la jugó"));
  console.log("  ✓ Sin datos → todavía no la jugó");

  // Caso 2: sin errores y rápido (>= 2 partidas) -> con facilidad
  let st6: StudentProgress["tablasStats"] = undefined;
  // 2 partidas en 24 s (meta oro = 33 s)
  st6 = sumarPartida(st6, 6, { ms: 24000, errores: 0, dia: "2026-10-10" });
  st6 = sumarPartida(st6, 6, { ms: 24000, errores: 0, dia: "2026-10-11" });
  const cFacil = tablasDelAlumno(mockProg({ tablasStats: st6 }));
  const t6Facil = cFacil.todas.find((t) => t.tabla === 6)!;
  assert.equal(t6Facil.grupo, "con-facilidad");
  assert.ok(t6Facil.texto.includes("sin errores"));
  assert.ok(t6Facil.texto.includes("meta de oro"));
  console.log("  ✓ Sin errores y rápido (2 partidas) → con facilidad");

  // Caso 3: 1 sola partida perfecta -> en camino (pocas partidas)
  let st4: StudentProgress["tablasStats"] = undefined;
  st4 = sumarPartida(st4, 4, { ms: 20000, errores: 0, dia: "2026-10-12" });
  const cUnaPartida = tablasDelAlumno(mockProg({ tablasStats: st4 }));
  const t4Una = cUnaPartida.todas.find((t) => t.tabla === 4)!;
  assert.equal(t4Una.grupo, "en-camino");
  assert.ok(t4Una.texto.includes("(pocas partidas)"));
  console.log("  ✓ 1 sola partida perfecta → en camino (pocas partidas)");

  // Caso 4: sin errores y lento (entre oro y plata) -> en camino
  let st7: StudentProgress["tablasStats"] = undefined;
  // Meta oro de la del 7 es 35s, meta plata 45s. Tarda 40s sin errores.
  st7 = sumarPartida(st7, 7, { ms: 40000, errores: 0, dia: "2026-10-10" });
  st7 = sumarPartida(st7, 7, { ms: 40000, errores: 0, dia: "2026-10-11" });
  const cLento = tablasDelAlumno(mockProg({ tablasStats: st7 }));
  const t7Lento = cLento.todas.find((t) => t.tabla === 7)!;
  assert.equal(t7Lento.grupo, "en-camino");
  assert.ok(t7Lento.texto.includes("pero tarda"));
  console.log("  ✓ Sin errores y lento → en camino");

  // Caso 5: con 2 errores por partida -> le cuesta
  let st8: StudentProgress["tablasStats"] = undefined;
  st8 = sumarPartida(st8, 8, { ms: 30000 + 2 * PENALIDAD_ERROR_MS, errores: 2, dia: "2026-10-10" });
  st8 = sumarPartida(st8, 8, { ms: 30000 + 2 * PENALIDAD_ERROR_MS, errores: 2, dia: "2026-10-11" });
  const cErrores = tablasDelAlumno(mockProg({ tablasStats: st8 }));
  const t8Errores = cErrores.todas.find((t) => t.tabla === 8)!;
  assert.equal(t8Errores.grupo, "le-cuesta");
  assert.ok(t8Errores.texto.includes("2 errores por partida"));
  assert.ok(Boolean(t8Errores.consejo));
  console.log("  ✓ Con 2 errores por partida → le cuesta y tiene consejo");

  // Caso 6: solo datos viejos de tablasTorneo -> se usan
  const cTorneo = tablasDelAlumno(
    mockProg({
      tablasTorneo: {
        "2026-10-03": {
          5: { mejorMs: 22000, medalla: "oro", errores: 0 },
        },
      },
    })
  );
  const t5Torneo = cTorneo.todas.find((t) => t.tabla === 5)!;
  assert.equal(t5Torneo.grupo, "en-camino"); // 1 sola semana -> pocas partidas
  assert.ok(t5Torneo.partidas >= 1);
  console.log("  ✓ Solo datos viejos de tablasTorneo → se usan correctamente");

  // --------------------------------------------------------------------------
  // 2. ARMAR INFORME DEL ALUMNO (armarInformeAlumno)
  // --------------------------------------------------------------------------
  console.log("\n2. armarInformeAlumno:");
  const alumno3 = mockStudent({ code: "CODIGO_SECRETO_999", name: "Valentina Alfaro", grade: 3 });
  const otroAlumno = "Lorenzo Daniel";
  const informe3 = armarInformeAlumno(alumno3, pVacio, {}, "mes", "Escuela 14");

  // El objeto no contiene el código del alumno en ningún texto
  assert.equal(
    containsString(informe3, "CODIGO_SECRETO_999"),
    false,
    "El objeto del informe NO debe contener el código del alumno"
  );
  console.log("  ✓ El objeto NO contiene el código del alumno en ningún texto");

  // No contiene nombres de otros alumnos
  assert.equal(
    containsString(informe3, otroAlumno),
    false,
    "El objeto del informe NO debe contener nombres de otros alumnos"
  );
  console.log("  ✓ No contiene nombres de otros alumnos");

  // No dice cuántos mundos faltan
  assert.equal(
    containsString(informe3, "falta"),
    false,
    "No debe decir cuántos mundos faltan"
  );
  assert.equal(
    containsString(informe3, "faltan"),
    false,
    "No debe decir cuántos mundos faltan"
  );
  console.log("  ✓ No dice cuántos mundos faltan");

  // Un alumno de 1.º sin datos de tablas no tiene la sección «Mis tablas»
  const alumno1 = mockStudent({ grade: 1, name: "Benjamín" });
  const informe1 = armarInformeAlumno(alumno1, pVacio, {}, "mes");
  assert.equal(
    informe1.tablas,
    undefined,
    "Un alumno de 1.º sin datos de tablas no debe tener la sección tablas"
  );
  console.log("  ✓ Alumno de 1.º sin datos de tablas no tiene sección «Mis tablas»");

  // Un alumno de 3.º sí tiene la sección tablas (3.º tiene repaso de tablas)
  assert.ok(Boolean(informe3.tablas), "Alumno de 3.º debe tener la sección de tablas");
  console.log("  ✓ Alumno de 3.º tiene la sección de tablas");

  // --------------------------------------------------------------------------
  // 3. DIBUJO DEL PDF (pdfDelInforme)
  // --------------------------------------------------------------------------
  console.log("\n3. pdfDelInforme:");
  const alumnoEspecial = mockStudent({
    code: "ESPECIAL1",
    name: "Ñaupa Gómez",
    grade: 3,
  });
  const informeEspecial = armarInformeAlumno(alumnoEspecial, mockProg({ tablasStats: st6 }), {}, "mes", "Escuela N.º 43");
  const pdfBytes = await pdfDelInforme(informeEspecial);

  // Empieza con %PDF
  const magic = Buffer.from(pdfBytes.slice(0, 4)).toString("ascii");
  assert.equal(magic, "%PDF", "El archivo debe comenzar con %PDF");
  console.log("  ✓ Los bytes empiezan con %PDF");

  // Carga con PDFDocument.load
  const loadedDoc = await PDFDocument.load(pdfBytes);
  const pageCount = loadedDoc.getPageCount();
  assert.ok(pageCount >= 1 && pageCount <= 2, `Debe tener 1 o 2 páginas (tuvo ${pageCount})`);
  console.log(`  ✓ Carga correctamente con PDFDocument.load (${pageCount} páginas)`);

  // Alumno de 1.º (1 página)
  const pdf1Bytes = await pdfDelInforme(informe1);
  const loaded1Doc = await PDFDocument.load(pdf1Bytes);
  assert.equal(loaded1Doc.getPageCount(), 1, "Alumno de 1.º sin tablas debe tener 1 página");
  console.log("  ✓ Alumno de 1.º genera exactamente 1 página");

  // --------------------------------------------------------------------------
  // 4. RUTA API /api/informe-alumno
  // --------------------------------------------------------------------------
  console.log("\n4. Ruta API /api/informe-alumno:");

  // Guardar configuración de eventos para probar interruptor
  const configOriginal = await leerEventosConfig();

  try {
    // Tomar un alumno real de la base para las pruebas de ruta
    const allStudents = await getStudents();
    assert.ok(allStudents.length > 0, "Debe haber al menos un alumno en la base de datos");
    const testStudent = allStudents[0];

    // 4.1 Interruptor APAGADO -> 403
    await guardarEventosConfig({
      ...configOriginal,
      "informe-alumno": { modo: "apagado", grados: [1, 2, 3, 4, 5, 6, 7] },
    });

    const reqApagado = new NextRequest(
      `http://localhost:3000/api/informe-alumno?code=${testStudent.code}&periodo=mes`,
      { headers: { "x-forwarded-for": "192.168.1.101" } }
    );
    const resApagado = await GET(reqApagado);
    assert.equal(resApagado.status, 403, "Con interruptor apagado debe responder 403");
    const jsonApagado = await resApagado.json();
    assert.ok(jsonApagado.error.includes("todavía no habilitó"));
    console.log("  ✓ Interruptor apagado → 403 «Tu docente todavía no habilitó el informe»");

    // 4.2 Interruptor PRENDIDO -> 200 y application/pdf
    await guardarEventosConfig({
      ...configOriginal,
      "informe-alumno": { modo: "siempre", grados: [1, 2, 3, 4, 5, 6, 7] },
    });

    const reqPrendido = new NextRequest(
      `http://localhost:3000/api/informe-alumno?code=${testStudent.code}&periodo=mes`,
      { headers: { "x-forwarded-for": "192.168.1.101" } }
    );
    const resPrendido = await GET(reqPrendido);
    assert.equal(resPrendido.status, 200, "Con interruptor prendido debe responder 200");
    assert.equal(
      resPrendido.headers.get("content-type"),
      "application/pdf",
      "Debe devolver Content-Type: application/pdf"
    );
    const disposition = resPrendido.headers.get("content-disposition");
    assert.ok(
      disposition?.includes("attachment") && disposition?.includes("filename="),
      "Debe incluir Content-Disposition: attachment; filename=..."
    );
    console.log("  ✓ Interruptor prendido → 200 y Content-Type application/pdf");

    // 4.3 Código inventado -> 404
    const ipPrueba = "192.168.1.222";
    await delKey(`rate_limit:code:${ipPrueba}`);

    const reqInventado = new NextRequest(
      `http://localhost:3000/api/informe-alumno?code=CODIGO_FALSO_XYZ`,
      { headers: { "x-forwarded-for": ipPrueba } }
    );
    const resInventado = await GET(reqInventado);
    assert.equal(resInventado.status, 404, "Código inventado debe responder 404");
    console.log("  ✓ Código inventado → 404");

    // 4.4 Más de MAX_FAILED_ATTEMPTS (20) códigos inventados seguidos -> 429
    console.log(`  ... Enviando ${MAX_FAILED_ATTEMPTS - 1} intentos fallidos adicionales ...`);
    for (let i = 1; i < MAX_FAILED_ATTEMPTS; i++) {
      const r = await GET(
        new NextRequest(`http://localhost:3000/api/informe-alumno?code=FAKE_${i}`, {
          headers: { "x-forwarded-for": ipPrueba },
        })
      );
      assert.equal(r.status, 404);
    }

    // Intento 21: debe ser bloqueado con 429
    const reqBloqueado = new NextRequest(
      `http://localhost:3000/api/informe-alumno?code=OTRO_FAKE`,
      { headers: { "x-forwarded-for": ipPrueba } }
    );
    const resBloqueado = await GET(reqBloqueado);
    assert.equal(resBloqueado.status, 429, "Tras superar MAX_FAILED_ATTEMPTS debe devolver 429");
    const jsonBloqueado = await resBloqueado.json();
    assert.ok(jsonBloqueado.blocked, "Debe indicar blocked: true");
    console.log("  ✓ Más de 20 códigos inventados seguidos → 429 (Rate Limit)");

    // Limpieza de rate limit de prueba
    await delKey(`rate_limit:code:${ipPrueba}`);
  } finally {
    // Restaurar configuración original de eventos
    await guardarEventosConfig(configOriginal);
  }

  console.log("\n✅ Todas las pruebas de AG-33 pasaron con éxito.");
}

run().catch((err) => {
  console.error("\n❌ Error en las pruebas:", err);
  process.exit(1);
});
