import assert from "node:assert/strict";
import { Student, StudentProgress } from "../src/types";
import {
  computeClassroomMetrics,
  computeStudentsNeedingHelp,
  getMasteryThreshold,
  getStudentWorldSummary,
  getWorldsForGrade,
} from "../src/lib/courseSummary";
import { getProgressMany, getStudents } from "../src/lib/data";
import { computeStudentStats } from "../src/lib/progressLogic";
import { getWorld } from "../src/lib/worlds";

async function run() {
  console.log("=== TEST SUITE: AG-08 Resumen del curso ===");

  // --- Bloque 1: Umbrales de dominio por grado ---
  console.log("1. Verificando umbrales de dominio por grado...");
  assert.equal(getMasteryThreshold(1), 80, "1.º grado debe ser 80%");
  assert.equal(getMasteryThreshold(2), 85, "2.º grado debe ser 85%");
  assert.equal(getMasteryThreshold(3), 90, "3.º grado debe ser 90%");
  assert.equal(getMasteryThreshold(undefined), 90, "Por defecto debe ser 90%");
  console.log("  ✓ Umbrales de dominio correctos.");

  // --- Bloque 2: Resumen y estado por mundo de un alumno ---
  console.log("2. Verificando getStudentWorldSummary...");
  const dummyStudentG3: Student = { code: "TEST3", name: "Estudiante Tres", type: "aula", grade: 3, createdAt: "" };
  const dummyStudentG2: Student = { code: "TEST2", name: "Estudiante Dos", type: "aula", grade: 2, createdAt: "" };

  // 2.a: Mundo no jugado
  const sUnplayed = getStudentWorldSummary(dummyStudentG3, undefined, 1);
  assert.equal(sUnplayed.played, false, "Debe ser played=false");
  assert.equal(sUnplayed.status, "unplayed", "Status debe ser 'unplayed'");
  assert.equal(sUnplayed.bestScore, 0);
  assert.equal(sUnplayed.vueltas, 0);

  // 2.b: Mundo completado (>= umbral)
  const pCompleted: StudentProgress = {
    code: "TEST3",
    coins: 100,
    completedWorlds: [1],
    activityLog: [],
  };
  const sCompleted = getStudentWorldSummary(dummyStudentG3, pCompleted, 1);
  assert.equal(sCompleted.played, true);
  assert.equal(sCompleted.status, "mastered", "Mundo en completedWorlds debe ser 'mastered'");
  assert.ok(sCompleted.bestScore >= 90, "Puntaje debe ser al menos 90%");

  // 2.c: Mundo en progreso (50-89%)
  const pProgress: StudentProgress = {
    code: "TEST3",
    coins: 10,
    completedWorlds: [],
    activityLog: [],
    lastWorldAttemptScore: { 1: 70 },
    activitySummary: { 1: { correct: 7, incorrect: 3, timeSpentSeconds: 120 } },
  };
  const sProgress = getStudentWorldSummary(dummyStudentG3, pProgress, 1);
  assert.equal(sProgress.played, true);
  assert.equal(sProgress.status, "in_progress");
  assert.equal(sProgress.bestScore, 70);
  assert.equal(sProgress.vueltas, 1);

  // 2.d: Mundo requiere ayuda (< 50%)
  const pNeedsHelp: StudentProgress = {
    code: "TEST3",
    coins: 5,
    completedWorlds: [],
    activityLog: [],
    lastWorldAttemptScore: { 2: 40 },
    activitySummary: { 2: { correct: 4, incorrect: 6, timeSpentSeconds: 100 } },
  };
  const sNeedsHelp = getStudentWorldSummary(dummyStudentG3, pNeedsHelp, 2);
  assert.equal(sNeedsHelp.played, true);
  assert.equal(sNeedsHelp.status, "needs_help");
  assert.equal(sNeedsHelp.bestScore, 40);

  // 2.e: Umbral en 2.º grado (85% es mastered)
  const pG2: StudentProgress = {
    code: "TEST2",
    coins: 50,
    completedWorlds: [],
    activityLog: [],
    lastWorldAttemptScore: { 22001: 85 },
  };
  const sG2 = getStudentWorldSummary(dummyStudentG2, pG2, 22001);
  assert.equal(sG2.status, "mastered", "En 2.º grado 85% debe ser 'mastered'");

  console.log("  ✓ Estados por mundo verificados.");

  // --- Bloque 3: Métricas globales del aula ---
  console.log("3. Verificando computeClassroomMetrics...");
  const mockStudents: Student[] = [
    { code: "S1", name: "Alumno Uno", type: "aula", grade: 3, createdAt: "" },
    { code: "S2", name: "Alumno Dos", type: "aula", grade: 3, createdAt: "" },
    { code: "S3", name: "Alumno Tres", type: "aula", grade: 3, createdAt: "" },
  ];

  const now = Date.now();
  const mockProgressMap: Record<string, StudentProgress> = {
    S1: {
      code: "S1",
      coins: 50,
      completedWorlds: [1],
      activityLog: [],
      activitySummary: { 1: { correct: 9, incorrect: 1, timeSpentSeconds: 60 } },
      lastPlayedAt: new Date(now - 2 * 24 * 3600 * 1000).toISOString(), // hace 2 días (activo)
    },
    S2: {
      code: "S2",
      coins: 30,
      completedWorlds: [],
      activityLog: [],
      activitySummary: { 1: { correct: 6, incorrect: 4, timeSpentSeconds: 80 } },
      lastWorldAttemptScore: { 1: 60 },
      lastPlayedAt: new Date(now - 10 * 24 * 3600 * 1000).toISOString(), // hace 10 días (inactivo)
    },
    S3: {
      code: "S3",
      coins: 20,
      completedWorlds: [],
      activityLog: [],
      activitySummary: { 1: { correct: 3, incorrect: 7, timeSpentSeconds: 90 } },
      lastWorldAttemptScore: { 1: 30 },
      lastPlayedAt: new Date(now - 1 * 24 * 3600 * 1000).toISOString(), // hace 1 día (activo)
    },
  };

  const metrics = computeClassroomMetrics(mockStudents, mockProgressMap, [1]);
  // Total correct = 9 + 6 + 3 = 18; Total attempts = 10 + 10 + 10 = 30; Precision = 18/30 = 60%
  assert.equal(metrics.averageAccuracy, 60, "Precisión promedio esperada: 60%");
  assert.equal(metrics.activeThisWeek.count, 2, "2 de 3 activos esta semana");
  assert.equal(metrics.activeThisWeek.pct, 67, "67% de actividad");
  assert.equal(metrics.hardestWorlds.length, 1, "Mundo 1 tiene 3 alumnos");
  assert.equal(metrics.hardestWorlds[0].worldId, 1);
  // Promedio de mejores notas en mundo 1: S1 (90) + S2 (60) + S3 (30) = 180 / 3 = 60%
  assert.equal(metrics.hardestWorlds[0].averageScore, 60);

  console.log("  ✓ Métricas del aula calculadas correctamente.");

  // --- Bloque 4: «A quién ayudar primero» ---
  console.log("4. Verificando computeStudentsNeedingHelp...");
  const helpList = computeStudentsNeedingHelp(mockStudents, mockProgressMap, [1], now);
  // S3 tiene mundo 1 en rojo (30%) y está activo
  // S2 tiene mundo 1 al 60% pero no juega hace 10 días
  // S1 está al día
  assert.equal(helpList.length, 2, "Dos alumnos deben requerir atención");
  // S3 tiene 1 mundo en rojo (score = 10 + 0 = 10)
  // S2 tiene inactividad de 10 días (score = 0 + 10 = 10)
  const s3Entry = helpList.find((h) => h.student.code === "S3");
  const s2Entry = helpList.find((h) => h.student.code === "S2");
  assert.ok(s3Entry, "S3 debe estar en la lista");
  assert.ok(s2Entry, "S2 debe estar en la lista");
  assert.ok(s3Entry.reasons.some((r) => r.includes("en rojo")), "Motivo de S3 debe mencionar mundo en rojo");
  assert.ok(s2Entry.reasons.some((r) => r.includes("No juega hace 10 días")), "Motivo de S2 debe mencionar 10 días");

  console.log("  ✓ Priorización pedagógica verificada.");

  // --- Bloque 5: Verificación con datos reales del aula piloto ---
  console.log("5. Verificando con datos reales del aula piloto (.data/db.json)...");
  const realStudents = (await getStudents()).filter((s) => !s.classroomId);
  assert.ok(realStudents.length >= 19, `Debe haber al menos 19 alumnos (hay ${realStudents.length})`);
  const realProgressList = await getProgressMany(realStudents.map((s) => s.code));
  const realProgressMap: Record<string, StudentProgress> = {};
  for (const p of realProgressList) {
    realProgressMap[p.code] = p;
  }

  // Comprobamos 3 alumnos reales a mano
  const sampleCodes = [realStudents[0].code, realStudents[1].code, realStudents[2].code];
  for (const code of sampleCodes) {
    const s = realStudents.find((x) => x.code === code)!;
    const p = realProgressMap[code];
    const stats = computeStudentStats(p, (id) => getWorld(id)?.name ?? "?");
    // Verificamos que para cada mundo en completedWorlds, getStudentWorldSummary reporta status mastered
    for (const wId of p.completedWorlds) {
      const summary = getStudentWorldSummary(s, p, wId);
      assert.equal(summary.status, "mastered", `Mundo completado ${wId} del alumno ${s.name} debe figurar dominado`);
    }
  }

  const realMetrics = computeClassroomMetrics(realStudents, realProgressMap, [1, 2, 3, 4, 5]);
  console.log(`  - Alumnos en aula piloto: ${realStudents.length}`);
  console.log(`  - Precisión global: ${realMetrics.averageAccuracy}%`);
  console.log(`  - Alumnos activos en la semana: ${realMetrics.activeThisWeek.count} de ${realMetrics.activeThisWeek.total}`);

  console.log("\n✅ TODAS LAS PRUEBAS DE AG-08 PASARON EXITOSAMENTE.");
}

run().catch((err) => {
  console.error("❌ ERROR EN TEST RESUMEN:", err);
  process.exit(1);
});
