// Script para detectar y limpiar fechas de nacimiento sospechosas (AG-07).
//
// Identifica:
// 1. Fechas repetidas como "2018-10-04" (originadas por el bug de anteponer 2018 a MM-DD).
// 2. Fechas idénticas compartidas por 3 o más alumnos en el aula.
//
// Uso:
//   npx tsx scripts/privacidad/limpiar-fechas.ts            (Modo simulación / lectura)
//   npx tsx scripts/privacidad/limpiar-fechas.ts --aplicar  (Aplica los cambios en el store)

import { getStudents } from "../../src/lib/data";
import { setJSON } from "../../src/lib/store";
import { Student } from "../../src/types";

const STUDENTS_KEY = "students";

async function main() {
  const aplicar = process.argv.includes("--aplicar");

  console.log("=== INSPECCIÓN DE FECHAS DE NACIMIENTO (AG-07) ===");
  console.log(`Modo: ${aplicar ? "🔴 APLICAR CAMBIOS" : "🟡 SIMULACIÓN (lectura)"}\n`);

  const students = await getStudents();
  console.log(`Total de alumnos registrados: ${students.length}`);

  const withBirthday = students.filter((s) => s.birthday && s.birthday.trim().length > 0);
  console.log(`Alumnos con fecha de nacimiento cargada: ${withBirthday.length}\n`);

  if (withBirthday.length === 0) {
    console.log("✅ No hay fechas de nacimiento cargadas en el store.");
    return;
  }

  // Agrupar por fecha exacta
  const byDate = new Map<string, Student[]>();
  for (const s of withBirthday) {
    const d = s.birthday!.trim();
    const list = byDate.get(d) ?? [];
    list.push(s);
    byDate.set(d, list);
  }

  // Detectar fechas sospechosas:
  // - Fecha "2018-10-04" o que termine en "10-04" con año 2018
  // - Fechas compartidas por 3 o más alumnos
  const suspiciousStudents: { student: Student; reason: string }[] = [];

  for (const [date, list] of byDate) {
    const is2018Oct4 = date === "2018-10-04" || date === "04/10/2018";
    const isRepeatedAnomaly = list.length >= 3;

    if (is2018Oct4) {
      for (const s of list) {
        suspiciousStudents.push({
          student: s,
          reason: `Valor por defecto detectado (2018-10-04)`,
        });
      }
    } else if (isRepeatedAnomaly) {
      for (const s of list) {
        suspiciousStudents.push({
          student: s,
          reason: `Fecha repetida en ${list.length} alumnos (${date})`,
        });
      }
    }
  }

  if (suspiciousStudents.length === 0) {
    console.log("✅ No se detectaron fechas sospechosas (ningún 2018-10-04 ni repeticiones anómalas).");
    console.log("Distribución de fechas existentes:");
    for (const [date, list] of byDate) {
      console.log(`  - ${date}: ${list.length} alumno(s) (${list.map((s) => s.code).join(", ")})`);
    }
    return;
  }

  console.log(`⚠️ Se encontraron ${suspiciousStudents.length} registros con fechas sospechosas:\n`);
  for (const item of suspiciousStudents) {
    console.log(`  - [${item.student.code}] ${item.student.name}: "${item.student.birthday}" → Motivo: ${item.reason}`);
  }

  if (aplicar) {
    const suspiciousCodes = new Set(suspiciousStudents.map((s) => s.student.code));
    const updated = students.map((s) => {
      if (suspiciousCodes.has(s.code)) {
        const copy = { ...s };
        delete copy.birthday;
        return copy;
      }
      return s;
    });

    await setJSON(STUDENTS_KEY, updated);
    console.log(`\n✅ Se limpiaron ${suspiciousStudents.length} fechas sospechosas en el store.`);
  } else {
    console.log("\nℹ️ Modo simulación. Para borrar estas fechas sospechosas, ejecutá:");
    console.log("   npx tsx scripts/privacidad/limpiar-fechas.ts --aplicar");
  }
}

main().catch((err) => {
  console.error("Error al ejecutar limpiar-fechas:", err);
  process.exit(1);
});
