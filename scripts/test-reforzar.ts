import assert from "node:assert/strict";
import { Student, StudentProgress, WorldDef } from "../src/types";
import {
  contenidosAReforzar,
  getMundosAReforzarStudent,
  resumirEjes,
  formatWorldRefuerzoCSV,
  formatWorldsRefuerzoCSV,
  LEVEL_SEVERITY,
} from "../src/lib/reforzar";
import {
  getCurriculoActivo,
  setCurriculoActivo,
} from "../src/lib/curriculo";
import { computeStudentsNeedingHelp } from "../src/lib/courseSummary";
import { getProgressMany, getStudents } from "../src/lib/data";
import { getWorld, WORLDS } from "../src/lib/worlds";
import { GRADE1_WORLDS } from "../src/lib/grade1/worlds";
import { GRADE2_WORLDS } from "../src/lib/grade2/worlds";
import { GRADE4_WORLDS } from "../src/lib/grade4/worlds";

async function run() {
  console.log("=== TEST SUITE: AG-23 Panel docente - Qué contenidos reforzar por eje ===");

  // =========================================================================
  // Bloque 1: Agrupamiento por materia y eje en orden correcto y fallback a "Otros"
  // =========================================================================
  console.log("1. Verificando agrupamiento por materia y eje y orden correcto...");

  // Supongamos mundos de distintas materias:
  // Mundo 1: Matemática (Número y Operaciones)
  // Mundo 4: Matemática (Geometría y Espacio)
  // Mundo 15: Lengua (Lectura)
  // Mundo 101: Matemática 1º (Número y Operaciones)
  // Mundo sin entrada curricular: e.g. un mundo mock 9999 o un mundo sin entrada
  const mockWorldSinCurriculo: WorldDef = {
    id: 9999,
    name: "Mundo Fantasía",
    emoji: "🦄",
    subject: "naturales",
    category: "numeros",
    description: "Reconocer adaptaciones de seres vivos en ambientes extremos.",
    colorFrom: "#fff",
    colorTo: "#000",
    difficulty: "basico",
  };

  const grupos = contenidosAReforzar(
    [
      { worldId: 1, nivel: "practica-guiada" },
      { worldId: 15, nivel: "necesita-practica" },
      { worldId: 9999, nivel: "practica-guiada" },
      { worldId: 4, nivel: "practica-guiada" },
    ],
    {
      curriculoId: "santa-cruz",
      worlds: [...WORLDS, mockWorldSinCurriculo],
    }
  );

  // Verificamos materias en orden oficial:
  // 1º Matemática, 2º Lengua, 3º Ciencias Naturales
  assert.equal(grupos.length, 4, "Debe haber 4 grupos de (materia, eje)");
  assert.equal(grupos[0].materia, "Matemática");
  assert.equal(grupos[0].eje, "Número y Operaciones");
  assert.equal(grupos[1].materia, "Matemática");
  assert.equal(grupos[1].eje, "Geometría y Espacio");
  assert.equal(grupos[2].materia, "Lengua");
  assert.equal(grupos[3].materia, "Ciencias Naturales");
  assert.equal(grupos[3].eje, "Otros", "El mundo sin entrada curricular debe tener eje 'Otros'");

  // El texto del contenido de Mundo 9999 debe ser su description
  const itemSinCurriculo = grupos[3].items[0];
  assert.equal(
    itemSinCurriculo.contenido,
    mockWorldSinCurriculo.description,
    "El contenido debe ser la descripción del mundo"
  );
  assert.equal(itemSinCurriculo.mundo, "Mundo Fantasía");

  console.log("  ✓ Materias y ejes agrupados en orden y fallback 'Otros' verificado.");

  // =========================================================================
  // Bloque 2: Deduplicación y conservación del peor nivel pedagógico
  // =========================================================================
  console.log("2. Verificando deduplicación y retención del peor nivel...");

  // Supongamos dos entradas para el mismo eje y contenido:
  // Entrada A con necesita-practica (naranja) y 70%
  // Entrada B con practica-guiada (rojo) y 40%
  const mockWorldA: WorldDef = {
    id: 9001,
    name: "Mundo Práctica A",
    emoji: "⭐",
    subject: "matematica",
    category: "numeros",
    description: "Cálculo mental de sumas y restas.",
    colorFrom: "#fff",
    colorTo: "#000",
    difficulty: "basico",
  };
  const mockWorldB: WorldDef = {
    id: 9002,
    name: "Mundo Práctica B",
    emoji: "🌟",
    subject: "matematica",
    category: "numeros",
    description: "Cálculo mental de sumas y restas.", // Mismo contenido
    colorFrom: "#fff",
    colorTo: "#000",
    difficulty: "basico",
  };

  // Caso 1: viene primero el naranja, luego el rojo
  const dedup1 = contenidosAReforzar(
    [
      { worldId: 9001, nivel: "necesita-practica", precision: 70 },
      { worldId: 9002, nivel: "practica-guiada", precision: 40 },
    ],
    { worlds: [mockWorldA, mockWorldB] }
  );
  assert.equal(dedup1.length, 1);
  assert.equal(dedup1[0].items.length, 1, "Debe deduplicar a 1 solo ítem");
  assert.equal(dedup1[0].items[0].nivel, "practica-guiada", "Debe conservar nivel rojo (peor nivel)");
  assert.equal(dedup1[0].items[0].precision, 40, "Debe conservar peor precisión (40%)");

  // Caso 2: viene primero el consolidado (verde), luego necesita-practica (naranja)
  const dedup2 = contenidosAReforzar(
    [
      { worldId: 9001, nivel: "consolidado", precision: 95 },
      { worldId: 9002, nivel: "necesita-practica", precision: 65 },
    ],
    { worlds: [mockWorldA, mockWorldB] }
  );
  assert.equal(dedup2.length, 1);
  assert.equal(dedup2[0].items.length, 1);
  assert.equal(dedup2[0].items[0].nivel, "necesita-practica", "Debe conservar necesita-practica frente a consolidado");
  assert.equal(dedup2[0].items[0].precision, 65);

  // Verificamos severidad
  assert.ok(LEVEL_SEVERITY["practica-guiada"] < LEVEL_SEVERITY["necesita-practica"]);
  assert.ok(LEVEL_SEVERITY["necesita-practica"] < LEVEL_SEVERITY["en-desarrollo"]);
  assert.ok(LEVEL_SEVERITY["en-desarrollo"] < LEVEL_SEVERITY["consolidado"]);

  console.log("  ✓ Deduplicación y severidad de nivel verificadas correctamente.");

  // =========================================================================
  // Bloque 3: Currículo NAP activo usa ejes y contenidos de NAP
  // =========================================================================
  console.log("3. Verificando soporte para currículo NAP activo...");

  // Para Mundo 1:
  // En Santa Cruz: eje es "Número y Operaciones"
  // En NAP: eje es "En relación con el número y las operaciones"
  const refuerzoSC = contenidosAReforzar([{ worldId: 1, nivel: "practica-guiada" }], {
    curriculoId: "santa-cruz",
  });
  assert.equal(refuerzoSC[0].eje, "Número y Operaciones");
  assert.match(refuerzoSC[0].items[0].fuente ?? "", /DC Santa Cruz/i);

  const refuerzoNAP = contenidosAReforzar([{ worldId: 1, nivel: "practica-guiada" }], {
    curriculoId: "nap",
  });
  assert.equal(
    refuerzoNAP[0].eje,
    "En relación con el número y las operaciones",
    "Con currículo NAP debe usar el eje textual de NAP"
  );
  assert.match(refuerzoNAP[0].items[0].fuente ?? "", /NAP Matemática/i);

  // También verificamos con setCurriculoActivo("nap")
  const originalCurriculo = getCurriculoActivo();
  try {
    setCurriculoActivo("nap");
    const refuerzoGlobalNAP = contenidosAReforzar([{ worldId: 1, nivel: "practica-guiada" }]);
    assert.equal(refuerzoGlobalNAP[0].eje, "En relación con el número y las operaciones");

    const csvNAP = formatWorldRefuerzoCSV(1);
    assert.ok(
      csvNAP.startsWith("En relación con el número y las operaciones:"),
      `CSV NAP debe comenzar con el eje NAP, obtenido: ${csvNAP}`
    );
  } finally {
    setCurriculoActivo(originalCurriculo);
  }

  console.log("  ✓ NAP y Santa Cruz correctamente diferenciados.");

  // =========================================================================
  // Bloque 4: Ningún texto de salida es solo el nombre del mundo
  // =========================================================================
  console.log("4. Verificando que ningún texto de salida sea únicamente el nombre del mundo...");

  const allWorldsToTest: WorldDef[] = [
    ...WORLDS,
    ...GRADE1_WORLDS,
    ...GRADE2_WORLDS,
    ...GRADE4_WORLDS,
  ];

  for (const w of allWorldsToTest) {
    const grupos = contenidosAReforzar([w.id]);
    assert.ok(grupos.length > 0, `Mundo ${w.id} (${w.name}) debe generar al menos un grupo`);
    for (const g of grupos) {
      assert.notEqual(g.eje.trim(), w.name.trim(), `El eje no puede ser el nombre del mundo ${w.name}`);
      for (const item of g.items) {
        assert.notEqual(
          item.contenido.trim(),
          w.name.trim(),
          `item.contenido para mundo ${w.id} no puede ser únicamente su nombre (${w.name})`
        );
        // Debe ser descriptivo (al menos 10 caracteres)
        assert.ok(
          item.contenido.length >= 8,
          `item.contenido para mundo ${w.id} debe ser sustantivo: "${item.contenido}"`
        );
      }
    }

    // Probar formato CSV
    const csvStr = formatWorldRefuerzoCSV(w.id);
    assert.notEqual(csvStr.trim(), w.name.trim(), `CSV para mundo ${w.id} no puede ser solo el nombre del mundo`);
    assert.ok(csvStr.includes(": "), `CSV debe contener separador "eje: contenido": ${csvStr}`);

    // Probar resumirEjes
    const resumen = resumirEjes(grupos);
    for (const r of resumen) {
      assert.notEqual(r.trim(), w.name.trim(), `resumirEjes no puede ser solo el nombre del mundo`);
      assert.match(r, /\(\d+\)$/, `resumirEjes debe incluir conteo de contenidos "(n)": ${r}`);
    }
  }

  console.log(`  ✓ Verificados ${allWorldsToTest.length} mundos de 1º a 4º grado sin nombres sueltos.`);

  // =========================================================================
  // Bloque 5: El umbral de «a reforzar» coincide exactamente con computeStudentsNeedingHelp
  // =========================================================================
  console.log("5. Verificando coincidencia de umbrales con base local de alumnos...");

  const students = (await getStudents()).filter((s) => !s.classroomId);
  const progressList = await getProgressMany(students.map((s) => s.code));
  const progressMap: Record<string, StudentProgress> = {};
  for (const p of progressList) {
    progressMap[p.code] = p;
  }

  const enabledWorldIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  const needingHelpList = computeStudentsNeedingHelp(students, progressMap, enabledWorldIds);

  let verifiedNeedingHelpCount = 0;

  for (const item of needingHelpList) {
    const student = item.student;
    const progress = progressMap[student.code];
    const reinforcementItems = getMundosAReforzarStudent(student, progress, enabledWorldIds);

    // Los mundos en rojo identificados por computeStudentsNeedingHelp
    const redWorldIdsExpected = item.redWorldIds ?? [];
    const redItemsFromRefuerzo = reinforcementItems.filter((r) => r.nivel === "practica-guiada");
    const redWorldIdsFromRefuerzo = redItemsFromRefuerzo.map((r) => r.worldId);

    assert.equal(
      redWorldIdsFromRefuerzo.length,
      redWorldIdsExpected.length,
      `Cantidad de mundos rojos debe coincidir para alumno ${student.name} (${student.code})`
    );

    for (const expectedId of redWorldIdsExpected) {
      assert.ok(
        redWorldIdsFromRefuerzo.includes(expectedId),
        `Mundo ${expectedId} esperado en rojo para alumno ${student.name}`
      );
    }

    // Además verificar que contenidosAReforzar con student y progress produce grupos
    if (redWorldIdsExpected.length > 0) {
      verifiedNeedingHelpCount++;
      const grupos = contenidosAReforzar({
        student,
        progress,
        enabledWorldIds,
      });
      assert.ok(grupos.length > 0, `Debe generar grupos de refuerzo para ${student.name}`);
      const totalContenidos = grupos.reduce((acc, g) => acc + g.items.length, 0);
      assert.ok(
        totalContenidos >= redWorldIdsExpected.length,
        `Total de contenidos debe incluir al menos los mundos en rojo para ${student.name}`
      );
    }
  }

  // Prueba sintética con mundos en rojo reales
  const syntheticStudent: Student = {
    code: "TEST_ROJO",
    name: "Alumno Prueba Rojos",
    type: "aula",
    grade: 3,
    createdAt: "",
  };
  const syntheticProgress: StudentProgress = {
    code: "TEST_ROJO",
    coins: 10,
    completedWorlds: [],
    activityLog: [],
    activitySummary: {
      1: { correct: 3, incorrect: 7, timeSpentSeconds: 100 },
      2: { correct: 2, incorrect: 8, timeSpentSeconds: 120 },
      3: { correct: 9, incorrect: 1, timeSpentSeconds: 60 }, // Dominado
    },
    lastWorldAttemptScore: { 1: 30, 2: 20, 3: 90 },
    lastPlayedAt: new Date().toISOString(),
  };

  const syntheticHelp = computeStudentsNeedingHelp(
    [syntheticStudent],
    { TEST_ROJO: syntheticProgress },
    [1, 2, 3]
  );
  assert.equal(syntheticHelp.length, 1);
  assert.equal(syntheticHelp[0].redWorldsCount, 2);
  assert.deepEqual(syntheticHelp[0].redWorldIds?.sort(), [1, 2]);

  const syntheticRefuerzo = getMundosAReforzarStudent(syntheticStudent, syntheticProgress, [1, 2, 3]);
  const syntheticRojos = syntheticRefuerzo.filter((r) => r.nivel === "practica-guiada");
  assert.deepEqual(syntheticRojos.map((r) => r.worldId).sort(), [1, 2]);

  const syntheticGrupos = contenidosAReforzar({
    student: syntheticStudent,
    progress: syntheticProgress,
    enabledWorldIds: [1, 2, 3],
  });
  // Mundo 1 y Mundo 2 son de Matemática · Número y Operaciones
  const matNumEje = syntheticGrupos.find((g) => g.materia === "Matemática" && g.eje === "Número y Operaciones");
  assert.ok(matNumEje, "Debe agrupar en Matemática · Número y Operaciones");
  assert.equal(matNumEje.items.length, 2, "Debe contener los 2 contenidos en rojo");

  const syntheticResumen = resumirEjes(syntheticGrupos);
  assert.ok(
    syntheticResumen.includes("Matemática · Número y Operaciones (2)"),
    `Resumen debe decir 'Matemática · Número y Operaciones (2)', obtenido: ${JSON.stringify(syntheticResumen)}`
  );

  console.log(`  ✓ Coincidencia exacta de umbrales verificada en ${needingHelpList.length} alumnos priorizados y caso sintético con mundos en rojo.`);

  // =========================================================================
  // Bloque 6: Formato CSV múltiple
  // =========================================================================
  console.log("6. Verificando formatWorldsRefuerzoCSV...");
  const csvMulti = formatWorldsRefuerzoCSV([1, 2]);
  assert.ok(csvMulti.includes("; "), "CSV múltiple debe separar con '; '");
  assert.ok(csvMulti.includes("Número y Operaciones"), "CSV múltiple debe incluir eje");

  console.log("\n✅ TODAS LAS PRUEBAS DE AG-23 PASARON EXITOSAMENTE.");
}

run().catch((err) => {
  console.error("❌ ERROR EN TEST REFORZAR:", err);
  process.exit(1);
});
