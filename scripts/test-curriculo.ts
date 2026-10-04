import assert from "node:assert/strict";
import { GRADE1_WORLDS } from "../src/lib/grade1/worlds";
import { GRADE2_WORLDS } from "../src/lib/grade2/worlds";
import { WORLDS } from "../src/lib/worlds";
import {
  getAllCurriculumEntries,
  getCurriculumEntry,
  getCurriculoActivo,
  setCurriculoActivo,
} from "../src/lib/curriculo";
import {
  getValidatedCurriculumWorldIds,
  validateCurriculumWorld,
} from "../src/lib/data";

async function runTests() {
  console.log("🧪 Iniciando pruebas de diseño curricular (AG-09)...");

  // 1. Verificar carga de entradas y selector de currículo
  assert.equal(getCurriculoActivo(), "santa-cruz", "El currículo por defecto debe ser santa-cruz");

  const santaCruzEntries = getAllCurriculumEntries("santa-cruz");
  const napEntries = getAllCurriculumEntries("nap");

  assert(Object.keys(santaCruzEntries).length > 0, "santa-cruz.json no debe estar vacío");
  assert(Object.keys(napEntries).length > 0, "nap.json no debe estar vacío");

  console.log(`✓ Currículos cargados: Santa Cruz (${Object.keys(santaCruzEntries).length} mundos), NAP (${Object.keys(napEntries).length} mundos)`);

  // 2. Recolectar todos los mundos esperados por grado
  const g1Ids = GRADE1_WORLDS.map((w) => w.id);
  const g2Ids = [...GRADE2_WORLDS.map((w) => w.id), 28001];
  const g3Ids = [...WORLDS.map((w) => w.id), 38001];

  const allWorlds = [
    { grade: 1, ids: g1Ids },
    { grade: 2, ids: g2Ids },
    { grade: 3, ids: g3Ids },
  ];

  let totalChecked = 0;

  for (const { grade, ids } of allWorlds) {
    for (const worldId of ids) {
      totalChecked++;
      // Verificar en Santa Cruz
      const sc = santaCruzEntries[worldId];
      assert(sc, `Falta entrada en santa-cruz.json para grado ${grade}, mundo ${worldId}`);
      assert(typeof sc.area === "string" && sc.area.trim().length > 0, `Área vacía en SC para mundo ${worldId}`);
      assert(typeof sc.eje === "string" && sc.eje.trim().length > 0, `Eje vacío en SC para mundo ${worldId}`);
      assert(typeof sc.contenido === "string" && sc.contenido.trim().length > 0, `Contenido vacío en SC para mundo ${worldId}`);
      assert(typeof sc.fuente === "string" && sc.fuente.trim().length > 0, `Fuente vacía en SC para mundo ${worldId}`);
      assert.match(sc.fuente, /DC Santa Cruz/i, `La fuente debe citar el DC de Santa Cruz para mundo ${worldId}`);

      // Verificar en NAP
      const nap = napEntries[worldId];
      assert(nap, `Falta entrada en nap.json para grado ${grade}, mundo ${worldId}`);
      assert(typeof nap.area === "string" && nap.area.trim().length > 0, `Área vacía en NAP para mundo ${worldId}`);
      assert(typeof nap.eje === "string" && nap.eje.trim().length > 0, `Eje vacío en NAP para mundo ${worldId}`);
      assert(typeof nap.contenido === "string" && nap.contenido.trim().length > 0, `Contenido vacío en NAP para mundo ${worldId}`);
      assert(typeof nap.fuente === "string" && nap.fuente.trim().length > 0, `Fuente vacía en NAP para mundo ${worldId}`);
      assert.match(nap.fuente, /NAP/i, `La fuente debe citar NAP para mundo ${worldId}`);
    }
  }

  console.log(`✓ Verificados ${totalChecked} mundos en ambos marcos curriculares: 0 entradas vacías o faltantes.`);

  // 3. Verificar que getCurriculumEntry funciona tanto con número como con string
  const sampleEntryNum = getCurriculumEntry(21001, "santa-cruz");
  const sampleEntryStr = getCurriculumEntry("21001", "santa-cruz");
  assert(sampleEntryNum && sampleEntryStr, "getCurriculumEntry debe resolver el mundo 21001");
  assert.equal(sampleEntryNum.area, sampleEntryStr.area);
  assert.equal(sampleEntryNum.eje, sampleEntryStr.eje);

  // 4. Verificar estado 'validado': por defecto false en los JSONs
  const rawSc = require("../src/lib/curriculo/santa-cruz.json");
  const rawNap = require("../src/lib/curriculo/nap.json");
  for (const [id, entry] of Object.entries(rawSc) as [string, any][]) {
    assert.equal(entry.validado, false, `El mundo ${id} en santa-cruz.json debe tener validado=false por defecto`);
  }
  for (const [id, entry] of Object.entries(rawNap) as [string, any][]) {
    assert.equal(entry.validado, false, `El mundo ${id} en nap.json debe tener validado=false por defecto`);
  }
  console.log("✓ Todos los campos en JSON tienen strictly validado: false por defecto.");

  // 5. Verificar persistencia de validación en store (sin mutar los JSONs)
  const testWorldId = 999999;
  const initialValidations = await getValidatedCurriculumWorldIds();
  await validateCurriculumWorld(testWorldId, true);
  const afterValidation = await getValidatedCurriculumWorldIds();
  assert(afterValidation.includes(testWorldId), "El mundo de prueba debe estar validado en el store");

  // Limpiar el mundo de prueba
  await validateCurriculumWorld(testWorldId, false);
  const afterCleanup = await getValidatedCurriculumWorldIds();
  assert(!afterCleanup.includes(testWorldId), "El mundo de prueba debe haberse desvalidado");
  console.log("✓ Flujo de validación en store verificado correctamente.");

  // 6. Cambio de currículo activo
  setCurriculoActivo("nap");
  assert.equal(getCurriculoActivo(), "nap", "setCurriculoActivo debe alternar a nap");
  setCurriculoActivo("santa-cruz");
  assert.equal(getCurriculoActivo(), "santa-cruz", "setCurriculoActivo debe volver a santa-cruz");

  console.log("🎉 Todas las pruebas de AG-09 pasaron satisfactoriamente (100%).");
}

runTests().catch((err) => {
  console.error("❌ Error en pruebas de currículo:", err);
  process.exit(1);
});
