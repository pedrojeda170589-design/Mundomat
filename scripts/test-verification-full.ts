import fs from "node:fs";
import path from "node:path";
import { addStudent, findStudentByCode, getProgress, saveProgress } from "../src/lib/data";
import { gradeOf, getGrade, THEMES } from "../src/lib/grades";
import { GRADE2_WORLDS } from "../src/lib/grade2/worlds";
import { GRADE1_WORLDS } from "../src/lib/grade1/worlds";
import { WORLDS } from "../src/lib/worlds";
import { buildActivitiesForWorld } from "../src/lib/activities";

async function verify() {
  console.log("=== INICIANDO VERIFICACIÓN COMPLETA DE 2.º GRADO ===");

  // 1. Crear un alumno de 2.º grado
  const testStudentName = `Alumno Test Bosque ${Date.now() % 10000}`;
  const student = await addStudent(testStudentName, "agregado", 2);
  console.log(`✓ Alumno de 2.º grado creado: ${student.name} (código: ${student.code}, grado: ${student.grade})`);

  if (student.grade !== 2) {
    throw new Error(`Se esperaba grade === 2, pero vino ${student.grade}`);
  }

  // 2. Verificar lectura y tema visual
  const retrieved = await findStudentByCode(student.code);
  if (!retrieved || retrieved.grade !== 2) {
    throw new Error("No se pudo recuperar el alumno con grado 2");
  }

  const g = gradeOf(retrieved);
  const gradeDef = getGrade(g);
  console.log(`✓ Grado resuelto: ${g} (${gradeDef.label}), umbral dominio: ${gradeDef.masteryPct}%`);

  const theme = gradeDef.theme;
  console.log(`✓ Tema visual: ${theme.id} (paisaje: ${theme.scenery}, fondo: ${theme.dayBg})`);
  if (theme.id !== "bosque" || theme.scenery !== "forest") {
    throw new Error(`Tema visual incorrecto para 2.º grado: ${theme.id}`);
  }

  // Verificar archivos de imagen del tema bosque
  for (let s = 1; s <= 4; s++) {
    const mapPath = path.join(process.cwd(), "public", theme.map(s));
    if (!fs.existsSync(mapPath)) {
      throw new Error(`Falta archivo de mapa: ${mapPath}`);
    }
  }
  console.log("✓ Las 4 etapas del mapa del bosque existen en public/theme/grados/2/mapa/");

  // 3. Verificar mundos iniciales desbloqueados (prerrequisitos vacíos)
  const initialWorlds = GRADE2_WORLDS.filter((w) => !w.prerequisites || w.prerequisites.length === 0);
  console.log(`✓ Mundos iniciales sin prerrequisitos (${initialWorlds.length}):`, initialWorlds.map((w) => `${w.id}: ${w.name}`).join(", "));
  if (initialWorlds.length !== 4) {
    throw new Error(`Se esperaban 4 mundos iniciales (1 por materia), hay ${initialWorlds.length}`);
  }

  // 4. Jugar una vuelta de un mundo de cada materia y registrar 100% de aciertos
  const progress = await getProgress(student.code);
  for (const w of initialWorlds) {
    const acts = buildActivitiesForWorld(w);
    console.log(`  -> Jugando Mundo ${w.id} (${w.name}): ${acts.length} actividades generadas`);
    if (acts.length < 6) {
      throw new Error(`Mundo ${w.id} tiene menos de 6 actividades`);
    }

    // Registrar aciertos
    progress.completedWorlds.push(w.id);
    for (const a of acts) {
      if (a.skills) {
        if (!progress.skillStats) progress.skillStats = {};
        for (const sk of a.skills) {
          if (!progress.skillStats[sk]) progress.skillStats[sk] = { c: 0, i: 0, recent: [] };
          progress.skillStats[sk].c++;
          progress.skillStats[sk].recent.push(1);
        }
      }
    }
  }

  await saveProgress(progress);
  console.log("✓ Progreso guardado con los 4 mundos iniciales completados.");

  // Comprobar que los mundos siguientes ahora tienen sus prerrequisitos cumplidos
  const secondWorlds = GRADE2_WORLDS.filter((w) =>
    w.prerequisites &&
    w.prerequisites.length > 0 &&
    w.prerequisites.every((req) => progress.completedWorlds.includes(req))
  );
  console.log(`✓ Mundos ahora desbloqueados (${secondWorlds.length}):`, secondWorlds.map((w) => `${w.id}: ${w.name}`).join(", "));
  if (secondWorlds.length < 4) {
    throw new Error(`Se esperaba que se desbloquearan al menos 4 mundos nuevos, se desbloquearon ${secondWorlds.length}`);
  }

  // 5. Verificar 1.º y 3.º grado
  const g1 = getGrade(1);
  if (g1.theme.id !== "costa" || g1.theme.scenery !== "seashore") {
    throw new Error("Tema de 1.º grado se modificó inesperadamente");
  }
  const g3 = getGrade(3);
  if (g3.theme.id !== "meseta" || g3.theme.scenery !== "mountains") {
    throw new Error("Tema de 3.º grado se modificó inesperadamente");
  }
  console.log("✓ 1.º grado mantiene tema costa y 3.º grado mantiene tema meseta sin regresiones.");

  // 6. Revisar fichas PDF en disco
  const testPdfs = [
    "mundo-21002-1.pdf",
    "mundo-22005-1.pdf",
    "mundo-23001-1.pdf",
    "mundo-24016-1.pdf",
  ];
  for (const pdf of testPdfs) {
    const fullPath = path.join(process.cwd(), "private", "fichas", pdf);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`PDF no encontrado: ${fullPath}`);
    }
    const stat = fs.statSync(fullPath);
    if (stat.size < 5000) {
      throw new Error(`PDF ${pdf} es sospechosamente pequeño (${stat.size} bytes)`);
    }
    console.log(`✓ Ficha PDF verificada: ${pdf} (${(stat.size / 1024).toFixed(1)} KB)`);
  }

  console.log("\n=== TODAS LAS VERIFICACIONES COMPLETADAS CON ÉXITO ===");
}

verify().catch((err) => {
  console.error("Error en la verificación:", err);
  process.exit(1);
});
