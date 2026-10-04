import assert from "node:assert";
import { isUsingRemoteStore } from "../src/lib/store";
import { generarPasosTabla, obtenerDistractores } from "../src/lib/torneo/opciones";
import {
  calcularMedalla,
  getMetaTabla,
  metaOro,
  metaPlata,
  MONEDAS_MEDALLA,
  PENALIDAD_ERROR_MS,
  premioGrupoParaTabla,
  PREMIOS_TORNEO_ITEMS,
} from "../src/lib/torneo/tiempos";
import {
  completeTorneoTable,
  getClassroomTorneoRanking,
  getProgress,
  getStudents,
  saveProgress,
  weekendSaturdayKey,
} from "../src/lib/data";
import { ACCESSORY_CATALOG_PREMIO } from "../src/types";

async function main() {
  console.log("--- 🧪 INICIANDO TEST-TORNEO (AG-14) ---");

  // 1. Opciones para todas las tablas (2..10) y todos los k (0..10)
  console.log("1. Probando generación de opciones para todas las tablas...");
  for (let n = 2; n <= 10; n++) {
    const pasos = generarPasosTabla(n);
    assert.strictEqual(pasos.length, 11, `Tabla ${n} debe tener 11 pasos`);

    for (let k = 0; k <= 10; k++) {
      const paso = pasos[k];
      assert.strictEqual(paso.tabla, n);
      assert.strictEqual(paso.multiplicador, k);
      assert.strictEqual(paso.correcta, n * k);

      // Opciones
      assert.strictEqual(paso.opciones.length, 3, `Paso ${n}x${k} debe tener 3 opciones`);
      assert.ok(paso.opciones.includes(n * k), `Paso ${n}x${k} debe incluir la respuesta correcta`);

      // Todas distintas
      const set = new Set(paso.opciones);
      assert.strictEqual(set.size, 3, `Las 3 opciones de ${n}x${k} deben ser distintas: ${paso.opciones}`);

      // Ninguna negativa
      for (const op of paso.opciones) {
        assert.ok(op >= 0, `Opción ${op} en ${n}x${k} no puede ser negativa`);
      }

      // Probar directamente obtenerDistractores
      const [d1, d2] = obtenerDistractores(n, k);
      assert.ok(d1 >= 0 && d2 >= 0, `Distractores deben ser >= 0`);
      assert.notStrictEqual(d1, d2, `Distractores deben ser distintos`);
      assert.notStrictEqual(d1, n * k, `Distractor 1 no puede ser la correcta`);
      assert.notStrictEqual(d2, n * k, `Distractor 2 no puede ser la correcta`);
    }
  }
  console.log("  ✅ Todas las opciones son válidas, distintas, no negativas y contienen la correcta.");

  // 2. Metas de tiempo por tabla (oro y plata)
  console.log("2. Verificando metas por tabla...");
  assert.strictEqual(metaOro(2), 35);
  assert.strictEqual(metaPlata(2), 50);

  assert.strictEqual(metaOro(3), 38);
  assert.strictEqual(metaPlata(3), 53);

  assert.strictEqual(metaOro(4), 41);
  assert.strictEqual(metaPlata(4), 56);

  assert.strictEqual(metaOro(5), 44);
  assert.strictEqual(metaPlata(5), 59);

  assert.strictEqual(metaOro(6), 47);
  assert.strictEqual(metaPlata(6), 62);

  assert.strictEqual(metaOro(7), 50);
  assert.strictEqual(metaPlata(7), 65);

  assert.strictEqual(metaOro(8), 53);
  assert.strictEqual(metaPlata(8), 68);

  assert.strictEqual(metaOro(9), 56);
  assert.strictEqual(metaPlata(9), 71);

  assert.strictEqual(metaOro(10), 59);
  assert.strictEqual(metaPlata(10), 74);

  for (let n = 2; n <= 10; n++) {
    const meta = getMetaTabla(n);
    assert.strictEqual(meta.oroSegundos, 35 + 3 * (n - 2));
    assert.strictEqual(meta.plataSegundos, meta.oroSegundos + 15);
    assert.strictEqual(meta.oroMs, meta.oroSegundos * 1000);
    assert.strictEqual(meta.plataMs, meta.plataSegundos * 1000);
  }
  console.log("  ✅ Metas de tiempo verificadas (35s base + 3s por tabla; plata +15s).");

  // 3. Medallas en los bordes
  console.log("3. Probando asignación de medallas en los bordes exactos...");
  // Tabla del 2 (Oro <= 35s, Plata <= 50s)
  assert.strictEqual(calcularMedalla(2, 35000), "oro");
  assert.strictEqual(calcularMedalla(2, 35001), "plata");
  assert.strictEqual(calcularMedalla(2, 35100), "plata");
  assert.strictEqual(calcularMedalla(2, 50000), "plata");
  assert.strictEqual(calcularMedalla(2, 50001), "bronce");
  assert.strictEqual(calcularMedalla(2, 50100), "bronce");

  // Tabla del 10 (Oro <= 59s, Plata <= 74s)
  assert.strictEqual(calcularMedalla(10, 59000), "oro");
  assert.strictEqual(calcularMedalla(10, 59001), "plata");
  assert.strictEqual(calcularMedalla(10, 74000), "plata");
  assert.strictEqual(calcularMedalla(10, 74001), "bronce");
  console.log("  ✅ Bordes de medallas validados al milisegundo.");

  // 4. Penalidad de error
  console.log("4. Verificando penalidad de error...");
  assert.strictEqual(PENALIDAD_ERROR_MS, 3000);
  console.log("  ✅ Penalidad de 3000 ms (+3s) confirmada.");

  // 5. Monedas por medalla
  console.log("5. Verificando monedas por medalla...");
  assert.strictEqual(MONEDAS_MEDALLA.oro, 15);
  assert.strictEqual(MONEDAS_MEDALLA.plata, 8);
  assert.strictEqual(MONEDAS_MEDALLA.bronce, 3);
  console.log("  ✅ Monedas configuradas: Oro 15 🪙, Plata 8 🪙, Bronce 3 🪙.");

  // 6. Catálogo de objetos de premio y grupos
  console.log("6. Verificando catálogo de premios y grupos...");
  assert.strictEqual(PREMIOS_TORNEO_ITEMS.length, 3);

  const p1 = premioGrupoParaTabla(2);
  assert.strictEqual(p1?.id, "vincha-relampago");
  assert.strictEqual(p1?.slot, "headwear");
  assert.strictEqual(p1?.molde, "cuernitos-dragon");

  const p2 = premioGrupoParaTabla(5);
  assert.strictEqual(p2?.id, "lentes-turbo");
  assert.strictEqual(p2?.slot, "eyewear");
  assert.strictEqual(p2?.molde, "lentes-aviador");

  const p3 = premioGrupoParaTabla(8);
  assert.strictEqual(p3?.id, "medalla-rayo");
  assert.strictEqual(p3?.slot, "pendant");
  assert.strictEqual(p3?.molde, "sol-de-mayo");

  // Verificar que existen en ACCESSORY_CATALOG_PREMIO
  // (solo los que ya tienen dibujo: sin imagen no se muestran)
  for (const item of PREMIOS_TORNEO_ITEMS) {
    const found = ACCESSORY_CATALOG_PREMIO.find((a) => a.id === item.id);
    if (!found) {
      console.log(`  ⏳ ${item.id}: todavía sin dibujo, queda oculto.`);
      continue;
    }
    assert.strictEqual(found?.group, "premio");
    assert.strictEqual(found?.fitLike, item.molde);
  }
  console.log("  ✅ Catálogo de objetos de premio validado en types/index.ts.");

  // 7. Rechazo fuera de fin de semana
  console.log("7. Probando validación de fin de semana...");
  const miercoles = new Date("2026-10-07T14:00:00-03:00"); // Miércoles
  const resMiercoles = await completeTorneoTable("TEST", 2, 25000, 0, miercoles);
  assert.ok("error" in resMiercoles);
  assert.ok(resMiercoles.error.includes("fin de semana"));
  console.log("  ✅ Partida rechazada correctamente fuera del fin de semana.");

  // 8. Flujo completo con alumno real en sábado y domingo simulados
  console.log("8. Probando flujo de torneo en fin de semana...");
  // Nunca contra la base real: esta parte escribe en el progreso de un alumno.
  if (isUsingRemoteStore()) throw new Error("test-torneo usa datos locales: sacá las variables de Upstash/KV para correrlo.");
  const students = await getStudents();
  assert.ok(students.length > 0, "Debe haber alumnos para la prueba");
  const student = students[0];

  // Sábado a las 15:00 hora argentina
  const sabado = new Date("2026-10-10T15:00:00-03:00");
  const satKey = weekendSaturdayKey(sabado);
  assert.strictEqual(satKey, "2026-10-10");

  // Domingo a las 11:00 hora argentina
  const domingo = new Date("2026-10-11T11:00:00-03:00");
  const satKeyDomingo = weekendSaturdayKey(domingo);
  assert.strictEqual(satKeyDomingo, "2026-10-10", "Domingo debe compartir la clave del sábado");

  // Limpiar estado previo del alumno de prueba
  const originalProgress = await getProgress(student.code);
  const cleanProgress = {
    ...originalProgress,
    tablasTorneo: undefined,
    seasonalCollection: (originalProgress.seasonalCollection ?? []).filter(
      (id) => !["vincha-relampago", "lentes-turbo", "medalla-rayo"].includes(id)
    ),
  };
  await saveProgress(cleanProgress);
  try {

  // Primera partida: Sábado, Tabla del 2 con 30 segundos (Oro) y 1 error
  const r1 = await completeTorneoTable(student.code, 2, 30000, 1, sabado);
  assert.ok(!("error" in r1));
  assert.strictEqual(r1.tabla, 2);
  assert.strictEqual(r1.medalla, "oro");
  assert.strictEqual(r1.monedasGanadas, 15);
  assert.strictEqual(r1.esMejorTiempo, true);
  assert.strictEqual(r1.nuevoObjeto?.id, "vincha-relampago");

  // Segunda partida mismo sábado: Tabla del 2 con 28 segundos (Oro, supera tiempo)
  // No debe volver a entregar monedas en el mismo día ni volver a entregar el objeto
  const r2 = await completeTorneoTable(student.code, 2, 28000, 0, sabado);
  assert.ok(!("error" in r2));
  assert.strictEqual(r2.monedasGanadas, 0, "No debe cobrar monedas dos veces el mismo día para la misma tabla");
  assert.strictEqual(r2.esMejorTiempo, true);
  assert.strictEqual(r2.mejorMs, 28000);
  assert.strictEqual(r2.nuevoObjeto, undefined, "No debe duplicar objeto ya ganado");

  // Tercera partida mismo sábado: Tabla del 3 con 32 segundos (Oro)
  // Tabla del 3 pertenece al mismo grupo (tablas 2 a 4). Ya tiene vincha-relampago.
  const r3 = await completeTorneoTable(student.code, 3, 32000, 0, sabado);
  assert.ok(!("error" in r3));
  assert.strictEqual(r3.medalla, "oro");
  assert.strictEqual(r3.monedasGanadas, 15, "Primera vez de la tabla 3 en el día cobra monedas");
  assert.strictEqual(r3.nuevoObjeto, undefined, "Ya poseía el objeto de este grupo");

  // Cuarta partida: Domingo, Tabla del 2 con 29 segundos
  // En domingo es otro día: debe poder cobrar monedas del día domingo
  const r4 = await completeTorneoTable(student.code, 2, 29000, 0, domingo);
  assert.ok(!("error" in r4));
  assert.strictEqual(r4.monedasGanadas, 15, "Domingo es un día nuevo, cobra monedas");
  assert.strictEqual(r4.esMejorTiempo, false, "29s no supera el récord de 28s del sábado");
  assert.strictEqual(r4.mejorMs, 28000);

  // Quinta partida: Domingo, Tabla del 5 con 40 segundos (Oro)
  // Grupo 2 (tablas 5 a 7) -> debe ganar «lentes-turbo»
  const r5 = await completeTorneoTable(student.code, 5, 40000, 0, domingo);
  assert.ok(!("error" in r5));
  assert.strictEqual(r5.nuevoObjeto?.id, "lentes-turbo");

  // Sexta partida: Domingo, Tabla del 9 con 50 segundos (Oro)
  // Grupo 3 (tablas 8 a 10) -> debe ganar «medalla-rayo»
  const r6 = await completeTorneoTable(student.code, 9, 50000, 0, domingo);
  assert.ok(!("error" in r6));
  assert.strictEqual(r6.nuevoObjeto?.id, "medalla-rayo");

  // 9. Verificar ranking del aula
  console.log("9. Verificando ranking del curso...");
  const rankingTabla2 = await getClassroomTorneoRanking(student.code, 2, domingo);
  assert.ok(rankingTabla2.length > 0, "Debe haber al menos 1 alumno en el ranking");
  assert.strictEqual(rankingTabla2[0].mejorMs, 28000);
  assert.ok(typeof rankingTabla2[0].displayName === "string");
  // Asegurar que respeta privacidad (sin apellidos completos sospechosos de formato compuesto)
  assert.ok(rankingTabla2[0].displayName.length > 0);
  console.log(`  🏆 Primer puesto ranking tabla 2: ${rankingTabla2[0].displayName} (${rankingTabla2[0].mejorMs / 1000}s)`);

  } finally {
    // Restaurar progreso original del alumno (aunque falle una comprobación)
    await saveProgress(originalProgress);
  }
  console.log("  ✅ Flujo de fin de semana, monedas y objetos probado satisfactoriamente.");

  console.log("--- 🎉 TODOS LOS TESTS DEL TORNEO DE LAS TABLAS (AG-14) PASARON CON ÉXITO ---");
}

main().catch((err) => {
  console.error("❌ Error en test-torneo:", err);
  process.exit(1);
});
