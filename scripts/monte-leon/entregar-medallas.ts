// Script docente: entrega la Medalla de Monte León a todos los alumnos de 3.º que participaron.
// Uso:
//   npx tsx scripts/monte-leon/entregar-medallas.ts [--dry-run]
import { getProgress, getStudents, saveProgress } from "../../src/lib/data";
import { OPEN_CLASSROOM_ID } from "../../src/lib/openClassroomShared";
import {
  haParticipadoMonteLeon,
  alumnoTieneORegalo,
  entregarMedallaBuenViaje,
} from "../../src/lib/monteLeon/progreso";
import { MEDALLA_MONTE_LEON } from "../../src/lib/monteLeon/arte";

async function main() {
  const isDryRun = process.argv.includes("--dry-run");

  console.log(`\n🎖️ Entrega de medallas del viaje a Monte León ${isDryRun ? "(MODO SIMULACIÓN / DRY-RUN)" : ""}`);
  console.log("=".repeat(65));

  const allStudents = await getStudents();
  // Solo 3.º grado, no el aula abierta
  const eligibleStudents = allStudents.filter(
    (s) => (s.grade === undefined || s.grade === 3) && s.classroomId !== OPEN_CLASSROOM_ID
  );

  console.log(`Total alumnos de 3.º grado en el sistema: ${eligibleStudents.length}`);

  let participaron = 0;
  let entregadas = 0;
  let yaTenian = 0;
  let noParticiparon = 0;

  for (const student of eligibleStudents) {
    const progress = await getProgress(student.code);
    const didParticipate = haParticipadoMonteLeon(progress);
    const alreadyHad = alumnoTieneORegalo(progress, MEDALLA_MONTE_LEON.id);

    if (!didParticipate) {
      noParticiparon++;
      continue;
    }

    participaron++;

    if (alreadyHad) {
      yaTenian++;
      console.log(`  ℹ️  ${student.name} (${student.code}): ya tiene la medalla.`);
      continue;
    }

    if (isDryRun) {
      entregadas++;
      console.log(`  🔍 [DRY-RUN] Se entregaría la medalla a ${student.name} (${student.code})`);
    } else {
      const res = entregarMedallaBuenViaje(progress);
      if (res.entregada) {
        await saveProgress(res.nextProgress);
        entregadas++;
        console.log(`  ✅ Medalla entregada a ${student.name} (${student.code})`);
      }
    }
  }

  console.log("=".repeat(65));
  console.log(`Resumen:`);
  console.log(`  - Participaron del mundo especial: ${participaron}`);
  console.log(`  - Medallas ${isDryRun ? "a entregar" : "entregadas"}: ${entregadas}`);
  console.log(`  - Ya tenían la medalla: ${yaTenian}`);
  console.log(`  - No participaron: ${noParticiparon}`);
  console.log(`\nFin del proceso.\n`);
}

main().catch((err) => {
  console.error("Error al entregar medallas:", err);
  process.exit(1);
});
