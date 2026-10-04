import assert from "node:assert";
import {
  computeCurrentStreak,
  computeStudentActivityMetrics,
  computeTeacherAlerts,
  computeStudentEvolution,
  computeClassroomEvolution,
  PERFORMANCE_DROP_THRESHOLD_PTS,
  DEFAULT_INACTIVE_DAYS_THRESHOLD,
} from "../src/lib/activityMetrics";
import { StudentProgress, Student } from "../src/types";
import { getTeacherAlertConfig, setTeacherAlertConfig, getStudents, getProgressMany } from "../src/lib/data";
import fs from "node:fs";
import path from "node:path";

// Helper to format YYYY-MM-DD
function formatDay(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return formatDay(d);
}

async function main() {
  console.log("--- 🧪 INICIANDO TEST-ACTIVIDAD (AG-11) ---");

  // 1. STREAK LOGIC TESTS
  console.log("1. Probando lógica de racha (streak)...");
{
  const today = daysAgo(0);
  const yesterday = daysAgo(1);
  const twoDaysAgo = daysAgo(2);
  const threeDaysAgo = daysAgo(3);
  const fiveDaysAgo = daysAgo(5);

  // Test: Played today and yesterday and 2 days ago -> streak = 3
  const streak3 = computeCurrentStreak([threeDaysAgo, twoDaysAgo, yesterday, today]);
  assert.strictEqual(streak3, 4, "Debería dar 4 días de racha continua incluyendo hoy");

  // Test: Did not play today, but played yesterday and 2 days ago -> streak = 2 (still alive)
  const streak2 = computeCurrentStreak([twoDaysAgo, yesterday]);
  assert.strictEqual(streak2, 2, "Racha de ayer sigue viva y debe dar 2");

  // Test: Last played 2 days ago (missed yesterday and today) -> streak = 0
  const streak0 = computeCurrentStreak([fiveDaysAgo, twoDaysAgo]);
  assert.strictEqual(streak0, 0, "Racha rota hace 2 días debe dar 0");

  // Test: Empty active days -> streak = 0
  assert.strictEqual(computeCurrentStreak([]), 0, "Racha sin días debe dar 0");

  console.log("  ✅ Lógica de racha validada correctamente.");
}

// 2. ACTIVE DAYS IN WINDOWS (7d and 30d)
console.log("2. Probando conteo de días activos (7d y 30d)...");
{
  const testDays = [
    daysAgo(0),
    daysAgo(2),
    daysAgo(4), // 3 in last 7 days
    daysAgo(10),
    daysAgo(20), // +2 in last 30 days (total 5)
    daysAgo(40), // outside 30 days
  ];

  const dummyProgress: StudentProgress = {
    code: "DUMMY",
    coins: 10,
    completedWorlds: [1],
    activityLog: [],
    activeDays: testDays,
  };

  const metrics = computeStudentActivityMetrics(dummyProgress);
  assert.strictEqual(metrics.activeDaysLast7, 3, "Debe tener 3 días activos en los últimos 7");
  assert.strictEqual(metrics.activeDaysLast30, 5, "Debe tener 5 días activos en los últimos 30");
  assert.strictEqual(metrics.streakDays, 1, "Racha debe ser 1 (jugó hoy)");
  assert.strictEqual(metrics.lastConnectionLabel, "Hoy", "Última conexión debe ser 'Hoy'");

  console.log("  ✅ Conteo de días activos validado.");
}

// 3. PERFORMANCE DROP DETECTION
console.log("3. Probando detección de caída abrupta de rendimiento (≥ 20 pts)...");
{
  // Window 1: Prior (days 8 to 28) - 10 activities, 9 correct (90%)
  const priorLogs = Array.from({ length: 10 }, (_, i) => ({
    worldId: 1,
    activityIndex: i,
    correct: 9,
    incorrect: 1,
    timeSpentSeconds: 60,
    finishedAt: new Date(Date.now() - (10 + i) * 86400000).toISOString(),
  }));

  // Window 2: Recent (days 0 to 7) - 6 activities, 3 correct (50% -> drop of 40 pts)
  const recentLogsDrop = Array.from({ length: 6 }, (_, i) => ({
    worldId: 1,
    activityIndex: i,
    correct: 5,
    incorrect: 5,
    timeSpentSeconds: 60,
    finishedAt: new Date(Date.now() - (1 + i) * 86400000).toISOString(),
  }));

  const progressWithDrop: StudentProgress = {
    code: "DROP",
    coins: 50,
    completedWorlds: [1],
    activityLog: [...priorLogs, ...recentLogsDrop],
    activeDays: [daysAgo(1), daysAgo(10)],
  };

  const metricsWithDrop = computeStudentActivityMetrics(progressWithDrop);
  assert.strictEqual(metricsWithDrop.hasPerformanceDrop, true, "Debe detectar caída abrupta");
  assert.strictEqual(metricsWithDrop.priorAccuracyPct, 90, "Precisión previa debe ser 90%");
  assert.strictEqual(metricsWithDrop.recentAccuracyPct, 50, "Precisión reciente debe ser 50%");
  assert(
    (metricsWithDrop.priorAccuracyPct ?? 0) - (metricsWithDrop.recentAccuracyPct ?? 0) >= PERFORMANCE_DROP_THRESHOLD_PTS,
    "La diferencia debe ser >= umbral de 20 pts"
  );

  // Case with stable performance (no drop)
  const recentLogsStable = Array.from({ length: 6 }, (_, i) => ({
    worldId: 1,
    activityIndex: i,
    correct: 8,
    incorrect: 2,
    timeSpentSeconds: 60,
    finishedAt: new Date(Date.now() - (1 + i) * 86400000).toISOString(),
  }));

  const progressStable: StudentProgress = {
    code: "STABLE",
    coins: 50,
    completedWorlds: [1],
    activityLog: [...priorLogs, ...recentLogsStable],
  };

  const metricsStable = computeStudentActivityMetrics(progressStable);
  assert.strictEqual(metricsStable.hasPerformanceDrop, false, "No debe alertar con rendimiento estable");

  // Case with < 5 recent activities (not enough statistical data)
  const progressFewRecent: StudentProgress = {
    code: "FEW",
    coins: 50,
    completedWorlds: [1],
    activityLog: [...priorLogs, recentLogsDrop[0]], // only 1 activity in recent window
  };
  const metricsFew = computeStudentActivityMetrics(progressFewRecent);
  assert.strictEqual(metricsFew.hasPerformanceDrop, false, "No debe alertar si hay menos de 5 actividades recientes");

  console.log("  ✅ Detección de caída de rendimiento validada correctamente.");
}

// 4. TEACHER ALERTS GENERATION
console.log("4. Probando alertas tempranas docentes (inactividad y caída)...");
{
  const studentActive: Student = { code: "ST-ACT", name: "Estudiante Activo", type: "aula", grade: 3, createdAt: new Date().toISOString() };
  const studentInactive: Student = { code: "ST-INACT", name: "Estudiante Inactivo", type: "aula", grade: 3, createdAt: new Date().toISOString() };
  const studentStruggling: Student = { code: "ST-STRUG", name: "Estudiante En Dificultad", type: "aula", grade: 3, createdAt: new Date().toISOString() };

  const progressActive: StudentProgress = {
    code: "ST-ACT",
    coins: 100,
    completedWorlds: [1, 2],
    activityLog: [{ worldId: 1, activityIndex: 0, correct: 9, incorrect: 1, finishedAt: new Date().toISOString(), timeSpentSeconds: 60 }],
    activeDays: [daysAgo(0)],
  };

  const progressInactive: StudentProgress = {
    code: "ST-INACT",
    coins: 10,
    completedWorlds: [],
    activityLog: [{ worldId: 1, activityIndex: 0, correct: 8, incorrect: 2, finishedAt: new Date(Date.now() - 15 * 86400000).toISOString(), timeSpentSeconds: 60 }],
    activeDays: [daysAgo(15)],
  };

  const priorLogs = Array.from({ length: 6 }, (_, i) => ({
    worldId: 1, activityIndex: i, correct: 9, incorrect: 1,
    finishedAt: new Date(Date.now() - (12 + i) * 86400000).toISOString(), timeSpentSeconds: 60
  }));
  const dropLogs = Array.from({ length: 6 }, (_, i) => ({
    worldId: 1, activityIndex: i, correct: 5, incorrect: 5,
    finishedAt: new Date(Date.now() - (1 + i) * 86400000).toISOString(), timeSpentSeconds: 60
  }));

  const progressStruggling: StudentProgress = {
    code: "ST-STRUG",
    coins: 20,
    completedWorlds: [],
    activityLog: [...priorLogs, ...dropLogs],
    activeDays: [daysAgo(1), daysAgo(12)],
  };

  const students = [studentActive, studentInactive, studentStruggling];
  const progressMap = {
    [studentActive.code]: progressActive,
    [studentInactive.code]: progressInactive,
    [studentStruggling.code]: progressStruggling,
  };

  // Test with default threshold (7 days)
  const alerts7 = computeTeacherAlerts(students, progressMap, 7);
  const inactive7 = alerts7.filter((a) => a.type === "inactivity");
  const drops7 = alerts7.filter((a) => a.type === "performance_drop");

  assert.strictEqual(inactive7.length, 1, "Debe haber 1 inactivo");
  assert.strictEqual(inactive7[0].student.code, "ST-INACT");
  assert.strictEqual(drops7.length, 1, "Debe haber 1 con caída");
  assert.strictEqual(drops7[0].student.code, "ST-STRUG");

  // Test with custom threshold (20 days) -> none should be inactive
  const alerts20 = computeTeacherAlerts(students, progressMap, 20);
  const inactive20 = alerts20.filter((a) => a.type === "inactivity");
  const drops20 = alerts20.filter((a) => a.type === "performance_drop");

  assert.strictEqual(inactive20.length, 0, "Con umbral 20 días no debe haber inactivos");
  assert.strictEqual(drops20.length, 1, "Debe seguir existiendo la alerta de caída");

  console.log("  ✅ Generación de alertas docentes validada.");
}

// 5. EVOLUTION CHART POINTS (STUDENT & CLASSROOM)
console.log("5. Probando cálculo de series de evolución temporal...");
{
  const now = Date.now();
  const logs = [
    // 3 weeks ago (between 21 and 28 days ago)
    { worldId: 1, activityIndex: 0, correct: 7, incorrect: 3, finishedAt: new Date(now - 22 * 86400000).toISOString(), timeSpentSeconds: 60 },
    // 2 weeks ago (between 14 and 21 days ago)
    { worldId: 2, activityIndex: 0, correct: 8, incorrect: 2, finishedAt: new Date(now - 15 * 86400000).toISOString(), timeSpentSeconds: 60 },
    // 1 week ago (between 7 and 14 days ago)
    { worldId: 3, activityIndex: 0, correct: 9, incorrect: 1, finishedAt: new Date(now - 8 * 86400000).toISOString(), timeSpentSeconds: 60 },
    // this week (between 0 and 7 days ago)
    { worldId: 4, activityIndex: 0, correct: 10, incorrect: 0, finishedAt: new Date(now - 1 * 86400000).toISOString(), timeSpentSeconds: 60 },
  ];

  const progress: StudentProgress = {
    code: "ST-EVOL",
    coins: 100,
    completedWorlds: [1, 2, 3, 4],
    activityLog: logs,
  };

  const studentEvol = computeStudentEvolution(progress, 6);
  assert.strictEqual(studentEvol.length, 6, "Debe retornar 6 semanas de evolución");
  const weeksWithActivity = studentEvol.filter((p) => p.activitiesCount > 0);
  assert.strictEqual(weeksWithActivity.length, 4, "Debe registrar actividad en 4 semanas");

  // Classroom evolution
  const classroomEvol = computeClassroomEvolution({ "p1": progress }, 6);
  assert.strictEqual(classroomEvol.length, 6, "Debe retornar 6 semanas de evolución del aula");
  const classWeeksWithActivity = classroomEvol.filter((p) => p.activitiesCount > 0);
  assert.strictEqual(classWeeksWithActivity.length, 4, "Aula debe registrar actividad en 4 semanas");

  console.log("  ✅ Cálculo de series de evolución temporal validado.");
}

// 6. DB CONFIG PERSISTENCE
console.log("6. Probando persistencia de configuración de alertas en db.json...");
{
  const initialConfig = await getTeacherAlertConfig();
  assert(typeof initialConfig.inactiveDaysThreshold === "number", "inactiveDaysThreshold debe ser número");

  await setTeacherAlertConfig({ inactiveDaysThreshold: 10 });

  const reloadedConfig = await getTeacherAlertConfig();
  assert.strictEqual(reloadedConfig.inactiveDaysThreshold, 10, "Debe persistir 10 días al recargar");

  // Restore initial config
  await setTeacherAlertConfig(initialConfig);
  console.log("  ✅ Configuración persistente de alertas validada.");
}

// 7. REAL PILOT DATA VALIDATION
console.log("7. Validando contra los datos reales de los 21 alumnos en .data/db.json...");
  const students = await getStudents();
  const codes = students.map((s) => s.code);
  const progressList = await getProgressMany(codes);
  const progressMap: Record<string, StudentProgress> = {};
  students.forEach((s, idx) => {
    progressMap[s.code] = progressList[idx];
  });

  if (students.length > 0) {

    const alerts = computeTeacherAlerts(students, progressMap, 7);
    const inactiveCount = alerts.filter((a) => a.type === "inactivity").length;
    const dropCount = alerts.filter((a) => a.type === "performance_drop").length;
    console.log(`  📊 Alumnos piloto analizados: ${students.length}`);
    console.log(`  🔔 Alumnos inactivos (>7d): ${inactiveCount}`);
    console.log(`  ⚠️ Alumnos con caída de rendimiento: ${dropCount}`);

    // Verify metrics calculate without throwing for any student
    for (const student of students) {
      const p = progressMap[student.code];
      if (p) {
        const m = computeStudentActivityMetrics(p);
        assert(typeof m.streakDays === "number", `streakDays debe ser número para ${student.name}`);
        assert(typeof m.activeDaysLast7 === "number", `activeDaysLast7 debe ser número para ${student.name}`);
        assert(typeof m.activeDaysLast30 === "number", `activeDaysLast30 debe ser número para ${student.name}`);
        assert(typeof m.lastConnectionLabel === "string", `lastConnectionLabel debe ser string para ${student.name}`);
        const evol = computeStudentEvolution(p, 8);
        assert.strictEqual(evol.length, 8, `evolución debe tener 8 puntos para ${student.name}`);
      }
    }

    const classEvol = computeClassroomEvolution(students, progressMap, 8);
    assert.strictEqual(classEvol.length, 8, "Evolución del aula debe tener 8 puntos (con students)");

    const classEvolFromMap = computeClassroomEvolution(progressMap, 8);
    assert.strictEqual(classEvolFromMap.length, 8, "Evolución del aula debe tener 8 puntos (desde mapa)");
    console.log("  ✅ Datos de alumnos reales validados satisfactoriamente.");
  }

  console.log("--- 🎉 TODOS LOS TESTS DE ACTIVIDAD, ALERTAS Y EVOLUCIÓN (AG-11) PASARON CON ÉXITO ---");
}

main().catch((err) => {
  console.error("❌ Error en test-actividad:", err);
  process.exit(1);
});
