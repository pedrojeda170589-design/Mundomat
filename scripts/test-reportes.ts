import assert from "node:assert/strict";
import { Student, StudentProgress } from "../src/types";
import { getStudents, getProgressMany } from "../src/lib/data";
import { computeFamilyReportData } from "../src/lib/familyReport";
import { generateCourseCSV } from "../src/lib/courseExport";
import { getAllCurriculumEntries } from "../src/lib/curriculo";
import { WORLDS } from "../src/lib/worlds";

async function runTests() {
  console.log("=== INICIANDO TEST SUITE: AG-10 REPORTES IMPRIMIBLES Y CSV ===");

  // 1. Cargar alumnos reales del aula piloto
  const students: Student[] = (await getStudents()).filter((s) => !s.classroomId);
  assert(students.length >= 3, `Debe haber al menos 3 alumnos en el aula piloto (hay ${students.length})`);

  const progressList = await getProgressMany(students.map((s) => s.code));
  const progressMap: Record<string, StudentProgress> = {};
  for (let i = 0; i < students.length; i++) {
    progressMap[students[i].code] = progressList[i];
  }

  const currEntries = getAllCurriculumEntries("santa-cruz");
  console.log(`✓ Cargados ${students.length} alumnos reales del aula piloto y currículo Santa Cruz (${Object.keys(currEntries).length} mundos).`);

  // 2. Probar generación de reporte para 3 alumnos reales
  const sampleStudents = students.slice(0, 3);
  console.log(`\nProbando reporte familiar con 3 alumnos reales:`);
  for (const s of sampleStudents) {
    console.log(`  - Alumno: ${s.name} (${s.code}, grado: ${s.grade ?? 3}.º)`);
    const p = progressMap[s.code];

    for (const period of ["mes", "trimestre", "ano"] as const) {
      const report = computeFamilyReportData(s, p, currEntries, period);

      assert.equal(report.studentName, s.name, "El nombre del alumno debe coincidir exactamente");
      assert.equal(report.grade, s.grade ?? 3, "El grado debe coincidir");
      assert(report.accuracyPct >= 0 && report.accuracyPct <= 100, "Precisión debe ser un porcentaje válido 0-100");
      assert(typeof report.accuracyMessage === "string" && report.accuracyMessage.length > 0, "Mensaje de precisión no debe estar vacío");
      assert.equal(report.weeklyEvolution.length, 6, "Debe incluir 6 semanas de evolución");

      // Verificar lenguaje positivo y sin tecnicismos
      assert(!report.accuracyMessage.includes("undefined") && !report.accuracyMessage.includes("NaN"));
      assert(!report.generalMessage.includes("undefined"));

      // Verificar que las recomendaciones tengan sugerencias concretas para el hogar
      assert(report.recommendations.length > 0, "Debe haber al menos una recomendación o sugerencia familiar");
      for (const rec of report.recommendations) {
        assert(rec.tipForHome.length > 0, "El tip para el hogar no debe estar vacío");
        assert(!rec.tipForHome.toLowerCase().includes("undefined"));
      }

      // CONTROL ESTRICTO DE PRIVACIDAD:
      // El reporte de este alumno NO DEBE contener nombres ni códigos de ningún otro alumno.
      const otherStudents = students.filter((o) => o.code !== s.code);
      const reportFullText = JSON.stringify(report);

      for (const other of otherStudents) {
        assert(
          !reportFullText.includes(`"${other.name}"`),
          `VIOLACIÓN DE PRIVACIDAD: El reporte de ${s.name} contiene el nombre de ${other.name}`
        );
        assert(
          !reportFullText.includes(other.code),
          `VIOLACIÓN DE PRIVACIDAD: El reporte de ${s.name} contiene el código de ${other.code}`
        );
      }
    }
    console.log(`    ✓ Períodos mes/trimestre/año y aislamiento de privacidad aprobados.`);
  }

  // 3. Probar generación de CSV del aula
  console.log(`\nProbando exportación a CSV del curso:`);
  const enabledIds = WORLDS.slice(0, 10).map((w) => w.id);
  const csv = generateCourseCSV(students, progressMap, enabledIds, currEntries);

  // Verificaciones de formato
  assert(csv.startsWith("\uFEFF"), "El CSV debe comenzar con el BOM UTF-8 (\\uFEFF) para abrir correctamente en Excel");
  assert(csv.includes(";"), "El CSV debe usar ';' como separador para planillas en español");

  const lines = csv.split("\r\n").filter((l) => l.trim().length > 0);
  assert.equal(lines.length, students.length + 1, "El CSV debe contener 1 fila de cabecera + 1 fila por alumno");

  const header = lines[0];
  assert(header.includes("Alumno;Código;Grado;Mundos Completados;Precisión Global (%)"));
  assert(header.includes("Tiempo Total (min)"));
  assert(header.includes("Actividades Últimos 7 Días"));

  for (let i = 0; i < sampleStudents.length; i++) {
    const s = sampleStudents[i];
    const row = lines[i + 1];
    assert(row.includes(s.code), `La fila debe incluir el código del alumno ${s.code}`);
    assert(!row.includes("NaN"), "El CSV no debe contener valores NaN");
    assert(!row.includes("undefined"), "El CSV no debe contener valores undefined");
  }

  console.log(`✓ CSV generado exitosamente: ${lines.length} filas (con BOM y delimitador ';').`);

  console.log("\n🎉 TODAS LAS PRUEBAS DE AG-10 PASARON EXITOSAMENTE (100%).");
}

runTests().catch((err) => {
  console.error("❌ Error en pruebas de AG-10:", err);
  process.exit(1);
});
