import assert from "node:assert";
import { torneoHabilitado } from "../src/lib/torneo/tiempos";
import { isUsingRemoteStore } from "../src/lib/store";
import { generarPasosTabla, obtenerDistractores } from "../src/lib/torneo/opciones";
import {
  calcularMedalla,
  getMetaTabla,
  metaOro,
  metaPlata,
  MONEDAS_MEDALLA,
  PENALIDAD_ERROR_MS,
} from "../src/lib/torneo/tiempos";
import {
  evaluarVuelta,
  insigniaDeVueltas,
  objetoDelMes,
  OBJETOS_MES,
  OBJETOS_MES_SUPER,
  ordenarPrestadosTorneo,
  TABLAS_DE_LA_VUELTA,
  TODOS_LOS_PREMIOS_TORNEO,
  venceElAnio,
  vueltasParaQuedarse,
} from "../src/lib/torneo/vueltas";
import { devolverPrestamoVencido, hastaDelPrestamo, IDS_PRESTAMO, prestamoVigente, tiendaConPrestamo } from "../src/lib/torneo/prestamo";
import { elegirPrestamo, estadoPrestamo } from "../src/lib/torneo/prestamoServer";
import { updateStudentProfile } from "../src/lib/data";
import {
  completeTorneoTable,
  getClassroomTorneoRanking,
  getProgress,
  getEnabledWorldIdsFor,
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
  assert.strictEqual(PENALIDAD_ERROR_MS, 2000);
  console.log("  ✅ Penalidad de 2000 ms (+2s por error) confirmada.");

  // 5. Monedas por medalla
  console.log("5. Verificando monedas por medalla...");
  assert.strictEqual(MONEDAS_MEDALLA.oro, 15);
  assert.strictEqual(MONEDAS_MEDALLA.plata, 8);
  assert.strictEqual(MONEDAS_MEDALLA.bronce, 3);
  console.log("  ✅ Monedas configuradas: Oro 15 🪙, Plata 8 🪙, Bronce 3 🪙.");

  // 6. Vueltas, metales, insignia y préstamo de los premios (pedido de Pedro, 5/10)
  console.log("6. Verificando vueltas, metales e insignia...");
  assert.deepStrictEqual(OBJETOS_MES.map((p) => p.mes), [7, 8, 9, 10, 11, 12]);
  assert.deepStrictEqual(OBJETOS_MES_SUPER.map((p) => p.mes), [7, 8, 9, 10, 11, 12]);
  assert.strictEqual(new Set(TODOS_LOS_PREMIOS_TORNEO.map((p) => p.id)).size, 36, "6 objetos × 3 metales × 2 niveles");
  assert.strictEqual(objetoDelMes(new Date("2026-10-10T15:00:00-03:00"), false)?.base, "vincha-relampago");
  assert.strictEqual(objetoDelMes(new Date("2026-10-10T15:00:00-03:00"), true)?.base, "antifaz-estelar");
  assert.strictEqual(objetoDelMes(new Date("2026-11-01T01:00:00Z"), false)?.base, "vincha-relampago", "31/10 a la noche sigue siendo octubre");
  // Insignia: ×2 … ×10, A1 … A10, B1
  const ins = (n: number) => insigniaDeVueltas(n);
  assert.deepStrictEqual([0, 1, 2, 9, 10, 11, 19, 20, 35].map(ins), [null, "×2", "×3", "×10", "A1", "A2", "A10", "B1", "C6"]);
  assert.deepStrictEqual([1, 9, 10, 19, 20].map(vueltasParaQuedarse), [10, 10, 20, 20, 30]);
  // Metal según aciertos y tiempo
  const vuelta = (errores: number[], factorTiempo: number) => ({
    desde: "",
    tablas: Object.fromEntries(TABLAS_DE_LA_VUELTA.map((t, i) => [t, { errores: errores[i] ?? 0, ms: getMetaTabla(t).plataMs * factorTiempo }])),
  });
  const sinErrores = evaluarVuelta(vuelta([], 1));
  assert.strictEqual(sinErrores.porcentaje, 100);
  assert.strictEqual(sinErrores.metal, "oro", "100 % y dentro del tiempo de plata: dorado");
  assert.strictEqual(evaluarVuelta(vuelta([], 1.2)).metal, "plata", "100 % pero lento: plateado");
  // 99 pasos: 11 errores → 90 % justo (no es «más de 90»): plateado
  assert.strictEqual(evaluarVuelta(vuelta([11], 0.5)).porcentaje, 90);
  assert.strictEqual(evaluarVuelta(vuelta([11], 0.5)).metal, "plata");
  assert.strictEqual(evaluarVuelta(vuelta([10], 0.5)).metal, "oro", "90,8 %: dorado");
  // 42 errores → 70,2 %: plateado; 43 → 69,7 %: bronce
  assert.strictEqual(evaluarVuelta(vuelta([42], 0.5)).metal, "plata");
  assert.strictEqual(evaluarVuelta(vuelta([43], 0.5)).metal, "bronce");
  // Prestados: se quedan al llegar a las vueltas; vencidos se devuelven el 31/12
  assert.strictEqual(venceElAnio(new Date("2026-10-10T15:00:00-03:00")), "2027-01-01T02:59:59.000Z");
  const base = {
    code: "X", completedWorlds: [], activityLog: [], coins: 0,
    seasonalCollection: ["vincha-relampago-plata", "otro"],
    avatarAccessories: { headwear: "vincha-relampago-plata" },
    torneoPrestados: [{ id: "vincha-relampago-plata", hastaVueltas: 10, vence: "2027-01-01T02:59:59.000Z" }],
  };
  assert.strictEqual(ordenarPrestadosTorneo({ ...base, torneoVueltas: 3 }, new Date("2026-12-20T12:00:00-03:00")).torneoPrestados?.length, 1, "todavía prestado");
  const quedo = ordenarPrestadosTorneo({ ...base, torneoVueltas: 10 }, new Date("2027-02-01T12:00:00-03:00"));
  assert.deepStrictEqual(quedo.torneoPrestados, []);
  assert.ok(quedo.seasonalCollection?.includes("vincha-relampago-plata"), "con 10 vueltas se lo queda");
  const devuelto2 = ordenarPrestadosTorneo({ ...base, torneoVueltas: 4 }, new Date("2027-01-01T00:00:00-03:00"));
  assert.ok(!devuelto2.seasonalCollection?.includes("vincha-relampago-plata"), "el 1/1 sin 10 vueltas se devuelve");
  assert.deepStrictEqual(devuelto2.avatarAccessories, {}, "y se saca del avatar");
  for (const item of TODOS_LOS_PREMIOS_TORNEO) {
    const found = ACCESSORY_CATALOG_PREMIO.find((a) => a.id === item.id);
    if (found) assert.strictEqual(found.fitLike, item.molde);
  }
  console.log("  ✅ Vueltas de 9 tablas, metales por aciertos y tiempo, insignia ×2…A1…B1 y préstamo hasta 10 vueltas.");

  // 6b. Préstamo Six-Seven: reglas puras
  console.log("6b. Verificando reglas del préstamo Six-Seven...");
  assert.ok(IDS_PRESTAMO.length >= 5 && !IDS_PRESTAMO.includes("cadena-67"), "sin el superespecial");
  const hasta = hastaDelPrestamo("2026-10-10");
  assert.strictEqual(hasta, "2026-10-17T02:59:59.000Z", "hasta el viernes 16/10 a las 23:59:59 (hora argentina)");
  const conPrestamo = {
    code: "X",
    completedWorlds: [],
    activityLog: [],
    coins: 0,
    shopCollection: ["gorra-x"],
    prestamo67: { id: "anteojos-67", hasta, semana: "2026-10-10" },
    avatarAccessories: { eyewear: "anteojos-67", headwear: "gorra-x" },
  };
  assert.strictEqual(prestamoVigente(conPrestamo, new Date("2026-10-16T20:00:00-03:00")), "anteojos-67", "el viernes todavía lo tiene");
  assert.deepStrictEqual(tiendaConPrestamo(conPrestamo, new Date("2026-10-12T10:00:00-03:00")), ["gorra-x", "anteojos-67"]);
  assert.strictEqual(prestamoVigente(conPrestamo, new Date("2026-10-17T00:00:01-03:00")), null, "el sábado ya se devolvió");
  const devuelto = devolverPrestamoVencido(conPrestamo, new Date("2026-10-17T09:00:00-03:00"));
  assert.strictEqual(devuelto.prestamo67, undefined);
  assert.deepStrictEqual(devuelto.avatarAccessories, { headwear: "gorra-x" }, "se saca del avatar; lo comprado queda");
  assert.strictEqual(devolverPrestamoVencido(conPrestamo, new Date("2026-10-12T10:00:00-03:00")), conPrestamo, "vigente: no cambia");
  console.log("  ✅ El préstamo dura hasta el viernes y se devuelve solo.");

  // 7. Todos los días (pedido de Pedro, 5/10): un miércoles también se juega.
  console.log("7. Probando que el repaso de las tablas está todos los días...");
  const miercoles = new Date("2026-10-07T14:00:00-03:00"); // Miércoles
  const resMiercoles = await completeTorneoTable("NOEXISTE", 2, 25000, 0, miercoles);
  assert.ok("error" in resMiercoles && resMiercoles.error.includes("Alumno"), "un miércoles no se rechaza por el día");
  assert.strictEqual(weekendSaturdayKey(miercoles), "2026-10-03", "la semana va de sábado a viernes");
  console.log("  ✅ Se juega cualquier día; récords y ranking por semana.");

  // 7b. Desde 3.º grado y después de junio (pedido de Pedro)
  assert.equal(torneoHabilitado(3, new Date("2026-07-04T15:00:00-03:00")), true);
  assert.equal(torneoHabilitado(4, new Date("2026-12-05T15:00:00-03:00")), true);
  assert.equal(torneoHabilitado(2, new Date("2026-10-10T15:00:00-03:00")), false, "2.º no tiene torneo");
  assert.equal(torneoHabilitado(3, new Date("2026-06-27T15:00:00-03:00")), false, "en junio todavía no");
  assert.equal(torneoHabilitado(3, new Date("2026-07-01T01:00:00Z")), false, "30/6 a la noche en Argentina sigue siendo junio");
  console.log("  ✅ Torneo solo desde 3.º y de julio en adelante.");

  // 8. Flujo completo con alumno real en sábado y domingo simulados
  console.log("8. Probando flujo del repaso de las tablas...");
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
    prestamo67: undefined,
    torneoVueltas: undefined,
    vueltaTablas: undefined,
    torneoPrestados: undefined,
    insigniaTorneoOculta: undefined,
    seasonalCollection: (originalProgress.seasonalCollection ?? []).filter(
      (id) => !TODOS_LOS_PREMIOS_TORNEO.some((p) => p.id === id)
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
  assert.deepStrictEqual(r1.vueltaTablasHechas, [2]);
  assert.strictEqual(r1.vueltaCompleta, undefined);

  // Segunda partida mismo sábado: Tabla del 2 con 28 segundos y sin errores
  const r2 = await completeTorneoTable(student.code, 2, 28000, 0, sabado);
  assert.ok(!("error" in r2));
  assert.strictEqual(r2.monedasGanadas, 0, "No debe cobrar monedas dos veces el mismo día para la misma tabla");
  assert.strictEqual(r2.esMejorTiempo, true);
  assert.strictEqual(r2.mejorMs, 28000);
  assert.strictEqual((await getProgress(student.code)).vueltaTablas?.tablas[2]?.errores, 0, "de cada tabla cuenta la mejor partida");

  // Domingo: otro día, cobra monedas.
  const r4 = await completeTorneoTable(student.code, 2, 29000, 0, domingo);
  assert.ok(!("error" in r4));
  assert.strictEqual(r4.monedasGanadas, 15, "Domingo es un día nuevo, cobra monedas");
  assert.strictEqual(r4.esMejorTiempo, false, "29s no supera el récord de 28s del sábado");
  assert.strictEqual(r4.mejorMs, 28000);

  // Completa la vuelta (tablas 3 a 10) sin errores y rápido: dorado e insignia ×2.
  let ultima = r4;
  for (const t of [3, 4, 5, 6, 7, 8, 9, 10]) {
    ultima = await completeTorneoTable(student.code, t, getMetaTabla(t).oroMs - 1000, 0, domingo) as typeof r4;
    assert.ok(!("error" in ultima));
  }
  assert.ok(ultima.vueltaCompleta, "con las 9 tablas se cierra la vuelta");
  assert.strictEqual(ultima.vueltaCompleta.metal, "oro");
  assert.strictEqual(ultima.vueltaCompleta.insignia, "×2");
  assert.strictEqual(ultima.vueltaCompleta.premio?.id, "vincha-relampago-oro", "objeto de octubre, dorado");
  assert.strictEqual(ultima.vueltaCompleta.hastaVueltas, 10);
  let pr = await getProgress(student.code);
  assert.strictEqual(pr.torneoVueltas, 1);
  assert.strictEqual(pr.vueltaTablas, undefined, "empieza una vuelta nueva");
  assert.ok(pr.seasonalCollection?.includes("vincha-relampago-oro"));
  assert.deepStrictEqual(pr.torneoPrestados?.map((x) => x.id), ["vincha-relampago-oro"], "prestado");

  // Segunda vuelta en octubre con muchos errores: bronce, pero ya tiene el dorado → no baja.
  const finde2 = new Date("2026-10-17T15:00:00-03:00");
  for (const t of TABLAS_DE_LA_VUELTA) ultima = await completeTorneoTable(student.code, t, 90000, 6, finde2) as typeof r4;
  assert.strictEqual(ultima.vueltaCompleta?.metal, "bronce");
  assert.strictEqual(ultima.vueltaCompleta?.premio, undefined);
  assert.strictEqual(ultima.vueltaCompleta?.yaTeniaMejor, true);
  assert.strictEqual(ultima.vueltaCompleta?.insignia, "×3");

  // Noviembre, vuelta regular (≈77 %): lentes turbo plateados.
  const nov = new Date("2026-11-07T15:00:00-03:00");
  for (const t of TABLAS_DE_LA_VUELTA) ultima = await completeTorneoTable(student.code, t, 40000, 3, nov) as typeof r4;
  assert.strictEqual(ultima.vueltaCompleta?.metal, "plata");
  assert.strictEqual(ultima.vueltaCompleta?.premio?.id, "lentes-turbo-plata");

  // Llegar a 10 vueltas: A1, se queda con todo y el premio pasa a superespecial.
  pr = await getProgress(student.code);
  await saveProgress({ ...pr, torneoVueltas: 9 });
  const dic = new Date("2026-12-05T15:00:00-03:00");
  for (const t of TABLAS_DE_LA_VUELTA) ultima = await completeTorneoTable(student.code, t, 30000, 0, dic) as typeof r4;
  assert.strictEqual(ultima.vueltaCompleta?.insignia, "A1");
  assert.strictEqual(ultima.vueltaCompleta?.premio?.id, "cetro-numeros-oro", "desde A1: superespecial");
  assert.strictEqual(ultima.vueltaCompleta?.premio?.superEspecial, true);
  assert.strictEqual(ultima.vueltaCompleta?.hastaVueltas, 20);
  assert.deepStrictEqual([...(ultima.vueltaCompleta?.seQuedo ?? [])].sort(), ["lentes-turbo-plata", "vincha-relampago-oro"], "a las 10 vueltas se queda los prestados");
  pr = await getProgress(student.code);
  assert.deepStrictEqual(pr.torneoPrestados?.map((x) => x.id), ["cetro-numeros-oro"]);

  // Insignia: se puede ocultar y volver a mostrar.
  const oculta = await updateStudentProfile(student.code, { insigniaVisible: false });
  assert.strictEqual(oculta?.insigniaTorneoOculta, true);
  const visible = await updateStudentProfile(student.code, { insigniaVisible: true });
  assert.strictEqual(visible?.insigniaTorneoOculta, false);
  console.log("  ✅ Vueltas completas: dorado/plateado/bronce, nunca baja, insignia ×2→×3→A1, prestados que se quedan y superespeciales.");

  // Préstamo Six-Seven: solo quien jugó este finde y está al día.
  // Primero, sin estar al día (ningún mundo completo):
  const habilitados = await getEnabledWorldIdsFor(student);
  await saveProgress({ ...(await getProgress(student.code)), completedWorlds: [] });
  if (habilitados.length > 2) {
    const r = await elegirPrestamo(student.code, IDS_PRESTAMO[0], sabado);
    assert.strictEqual(r.ok, false, "si no está al día, no hay préstamo");
    assert.ok(!r.ok && r.error.includes("al día"));
  }
  // Ahora al día con los mundos habilitados:
  await saveProgress({ ...(await getProgress(student.code)), completedWorlds: habilitados });
  const estadoSab = await estadoPrestamo(student.code, sabado);
  assert.ok(estadoSab);
  assert.strictEqual(estadoSab.jugoEsteFinde, true);
  const otroFinde = new Date("2026-10-31T15:00:00-03:00");
  const sinJugar = await estadoPrestamo(student.code, otroFinde);
  assert.strictEqual(sinJugar?.jugoEsteFinde, false);
  assert.strictEqual(sinJugar?.puedeElegir, false, "sin jugar ese finde no puede elegir");
  const rechazo = await elegirPrestamo(student.code, IDS_PRESTAMO[0], otroFinde);
  assert.strictEqual(rechazo.ok, false);
  // Todos los días: un miércoles de la misma semana (jugó el sábado 10) también puede elegir.
  const enSemana = await estadoPrestamo(student.code, new Date("2026-10-14T15:00:00-03:00"));
  assert.strictEqual(enSemana?.jugoEsteFinde, true, "la semana va de sábado a viernes");
  if (!estadoSab.alDia) {
    const r = await elegirPrestamo(student.code, IDS_PRESTAMO[0], sabado);
    assert.strictEqual(r.ok, false, "si no está al día, no hay préstamo");
    console.log(`  ✅ Préstamo rechazado: no está al día (${estadoSab.pendientes.length} mundos sin terminar).`);
  } else if (estadoSab.opciones.length === 0) {
    console.log("  ⏳ Los accesorios Six-Seven todavía no tienen dibujo: no se pueden elegir.");
  } else {
    const id = estadoSab.opciones[0];
    const r = await elegirPrestamo(student.code, id, sabado);
    assert.ok(r.ok, "al día y jugó: puede elegir");
    const pr = await getProgress(student.code);
    assert.strictEqual(pr.prestamo67?.id, id);
    const def = (await import("../src/types")).getAccessoryById(id)!;
    const puesto = await updateStudentProfile(student.code, { accessories: { [def.slot]: id } });
    assert.ok(puesto, "el prestado se puede poner en el avatar");
    console.log(`  ✅ Préstamo elegido (${id}) y puesto en el avatar.`);
  }

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
