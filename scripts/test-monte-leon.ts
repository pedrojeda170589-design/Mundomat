// Suite de pruebas exhaustiva para el Mundo Especial «Viaje a Monte León» (AG-19).
// Uso:
//   npx tsx scripts/test-monte-leon.ts
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { isUsingRemoteStore } from "../src/lib/store";
import { getProgress, getStudents, saveProgress } from "../src/lib/data";
import { OPEN_CLASSROOM_ID } from "../src/lib/openClassroomShared";
import {
  estaActivoMonteLeon,
  esMomentoBuenViaje,
  diasParaElViaje,
  debeMostrarMonteLeon,
  debeMostrarBuenViaje,
  textoCuentaRegresiva,
} from "../src/lib/monteLeon/fechas";
import {
  buildMonteLeonActivities,
  obtenerBancoCompletoEtapa,
} from "../src/lib/monteLeon/contenido";
import {
  registrarResultadoEtapa,
  entregarMedallaBuenViaje,
  tieneMochilaCompleta,
  haParticipadoMonteLeon,
  alumnoTieneORegalo,
} from "../src/lib/monteLeon/progreso";
import {
  MOCHILA_MONTE_LEON,
  MASCOTA_MONTE_LEON,
  MEDALLA_MONTE_LEON,
} from "../src/lib/monteLeon/arte";
import {
  ACCESSORY_CATALOG_PREMIO,
  LOGRO_AVATAR_IDS,
  AVATAR_OPTIONS,
  canUseAvatar,
  type StudentProgress,
} from "../src/types";
import { IMAGENES_LISTAS } from "../src/lib/coleccion/imagenes-listas";

if (isUsingRemoteStore()) throw new Error("Esta prueba usa la base local: sacá las variables de Upstash/KV.");

const DB = path.join(process.cwd(), ".data", "db.json");
const RESPALDO = path.join(process.cwd(), ".data", "db.antes-de-test-monte-leon.json");

async function main() {
  console.log("\n🧪 Iniciando pruebas de AG-19: Mundo especial «Viaje a Monte León»...");

  // Respaldar base local
  fs.copyFileSync(DB, RESPALDO);

  try {
    // ========================================================================
    // 1. PRUEBAS DE FECHAS Y BORDES (Hora argentina UTC-3)
    // ========================================================================
    console.log("\n1. Verificando fechas, bordes y cuenta regresiva...");

    // Borde de visibilidad: 27/10 23:59:59 AR visible, 28/10 00:00:00 AR no visible
    const tVisible = new Date("2026-10-27T23:59:59.000-03:00");
    const tNoVisible = new Date("2026-10-28T00:00:00.000-03:00");
    assert.equal(estaActivoMonteLeon(tVisible), true, "27/10 23:59:59 AR debe ser visible");
    assert.equal(estaActivoMonteLeon(tNoVisible), false, "28/10 00:00:00 AR no debe ser visible");

    // Ventana de buen viaje: 27/10 20:00 AR hasta 28/10 23:59:59 AR
    const tAntesBuenViaje = new Date("2026-10-27T19:59:59.000-03:00");
    const tInicioBuenViaje = new Date("2026-10-27T20:00:00.000-03:00");
    const tFinBuenViaje = new Date("2026-10-28T23:59:59.000-03:00");
    const tDespuesBuenViaje = new Date("2026-10-29T00:00:00.000-03:00");

    assert.equal(esMomentoBuenViaje(tAntesBuenViaje), false, "27/10 19:59:59 AR no es momento buen viaje");
    assert.equal(esMomentoBuenViaje(tInicioBuenViaje), true, "27/10 20:00:00 AR inicia ventana buen viaje");
    assert.equal(esMomentoBuenViaje(tFinBuenViaje), true, "28/10 23:59:59 AR cierra ventana buen viaje");
    assert.equal(esMomentoBuenViaje(tDespuesBuenViaje), false, "29/10 00:00:00 AR ya pasó ventana buen viaje");

    // Días que faltan para el viaje (28/10/2026)
    const t15Oct = new Date("2026-10-15T12:00:00.000-03:00");
    const t27Oct = new Date("2026-10-27T10:00:00.000-03:00");
    const t28Oct = new Date("2026-10-28T08:00:00.000-03:00");
    assert.equal(diasParaElViaje(t15Oct), 13, "El 15/10 faltan 13 días");
    assert.equal(diasParaElViaje(t27Oct), 1, "El 27/10 falta 1 día");
    assert.equal(diasParaElViaje(t28Oct), 0, "El 28/10 es hoy (0 días)");
    assert.equal(textoCuentaRegresiva(t27Oct), "¡Mañana es el gran viaje!");
    assert.equal(textoCuentaRegresiva(t28Oct), "¡Hoy es el viaje a Monte León!");

    console.log("   ✅ Bordes de tiempo y cuenta regresiva correctos.");

    // ========================================================================
    // 2. AUDIENCIA: SOLO 3.º GRADO, NUNCA AULA ABIERTA
    // ========================================================================
    console.log("\n2. Verificando destinatarios y exclusión de aula abierta...");

    const alumnoG3 = { grade: 3, classroomId: "aula-3a" };
    const alumnoPiloto = { grade: undefined, classroomId: undefined }; // 3.º por defecto
    const alumnoG2 = { grade: 2, classroomId: "aula-2a" };
    const alumnoG4 = { grade: 4, classroomId: "aula-4a" };
    const alumnoAbierta = { grade: 3, classroomId: OPEN_CLASSROOM_ID };

    assert.equal(debeMostrarMonteLeon(alumnoG3, tVisible), true, "3.º grado debe ver Monte León");
    assert.equal(debeMostrarMonteLeon(alumnoPiloto, tVisible), true, "Aula piloto (sin grade) debe ver Monte León");
    assert.equal(debeMostrarMonteLeon(alumnoG2, tVisible), false, "2.º grado no debe ver Monte León");
    assert.equal(debeMostrarMonteLeon(alumnoG4, tVisible), false, "4.º grado no debe ver Monte León");
    assert.equal(debeMostrarMonteLeon(alumnoAbierta, tVisible), false, "Aula abierta NUNCA debe ver Monte León");

    // El 28/10 ya no se muestra en el mapa a nadie
    assert.equal(debeMostrarMonteLeon(alumnoG3, tNoVisible), false, "El 28/10 ya no aparece en el mapa");

    // Pero en el buen viaje del 28/10 los alumnos de 3.º sí reciben el saludo
    assert.equal(debeMostrarBuenViaje(alumnoG3, t28Oct), true, "El 28/10 3.º grado ve el buen viaje");
    assert.equal(debeMostrarBuenViaje(alumnoAbierta, t28Oct), false, "El aula abierta nunca ve el buen viaje");

    console.log("   ✅ Solo 3.º grado habilitado; aula abierta bloqueada.");

    // ========================================================================
    // 3. CONTENIDO: 8 ACTIVIDADES POR ETAPA, BANCOS DE 15+ Y 26 PALABRAS
    // ========================================================================
    console.log("\n3. Verificando contenido, bancos y consignas limpias...");

    // Bancos completos
    const banco1 = obtenerBancoCompletoEtapa(1);
    const banco2 = obtenerBancoCompletoEtapa(2);
    const banco3 = obtenerBancoCompletoEtapa(3);
    const banco4 = obtenerBancoCompletoEtapa(4);
    const banco5 = obtenerBancoCompletoEtapa(5);

    assert.ok(banco1.length >= 15, `Etapa 1 debe tener 15+ preguntas (tiene ${banco1.length})`);
    assert.ok(banco2.length >= 15, `Etapa 2 debe tener 15+ preguntas (tiene ${banco2.length})`);
    assert.ok(banco3.length >= 15, `Etapa 3 debe tener 15+ preguntas (tiene ${banco3.length})`);
    assert.ok(banco4.length >= 15, `Etapa 4 debe tener 15+ preguntas (tiene ${banco4.length})`);
    // Las 26 palabras pedidas por Pedro + las que se sumaron (mb/nv: también, envase).
    assert.ok(banco5.length >= 26, `Etapa 5 debe tener las 26 palabras pedidas o más (tiene ${banco5.length})`);

    // Cada etapa arma exactamente 8 actividades sin repetirse
    for (let e = 1; e <= 5; e++) {
      const vuelta = buildMonteLeonActivities(e);
      assert.equal(vuelta.length, 8, `Etapa ${e} debe armar exactamente 8 actividades`);

      const ids = new Set<string>();
      for (const act of vuelta) {
        assert.ok(!ids.has(act.id), `Etapa ${e}: actividad id duplicada: ${act.id}`);
        ids.add(act.id);

        if (act.type === "mc") {
          // Sin opciones duplicadas
          const choicesSet = new Set(act.choices);
          assert.equal(choicesSet.size, act.choices.length, `Etapa ${e}: opciones repetidas en ${act.id}`);
          // Sin emojis de chiste ni ✅/❌
          for (const c of act.choices) {
            assert.ok(!c.includes("✅") && !c.includes("❌"), `Etapa ${e}: opción con tilde/cruz en ${act.id}`);
            assert.ok(!/^[A-D]\)/.test(c), `Etapa ${e}: opción con letra de orden en ${act.id}`);
            assert.ok(!/^[1-4]\./.test(c), `Etapa ${e}: opción con número de orden en ${act.id}`);
          }
          assert.ok(act.answerIndex >= 0 && act.answerIndex < act.choices.length);
        }

        if (act.type === "dictation") {
          assert.equal(act.kind, "palabra");
          assert.ok(act.say && act.say.length > 5, "Dictado debe tener oración dictada en say");
          assert.ok(act.answer && act.answer.length > 0, "Dictado debe tener answer");
        }
      }
    }

    // Las respuestas correctas no quedan siempre en el mismo lugar y los
    // «ordenar» nunca aparecen ya ordenados.
    const posiciones = new Set<number>();
    for (let n = 0; n < 40; n++) {
      for (const e of [1, 2, 3, 4]) {
        for (const act of buildMonteLeonActivities(e)) {
          if (act.type === "mc") posiciones.add(act.answerIndex);
          if (act.type === "order") {
            assert.ok(
              act.correctOrder.some((v, i) => v !== i),
              `Etapa ${e}: ${act.id} aparece ya ordenado`
            );
          }
        }
      }
    }
    assert.ok(posiciones.size >= 3, `La respuesta correcta debe variar de lugar (posiciones: ${[...posiciones]})`);
    // Cada vuelta trae exactamente una actividad interactiva (ordenar o clasificar)
    for (const e of [1, 2, 3, 4]) {
      const inter = buildMonteLeonActivities(e).filter((a) => a.type === "order" || a.type === "classify");
      assert.equal(inter.length, 1, `Etapa ${e}: debe haber una actividad interactiva`);
    }

    console.log("   ✅ Bancos de 15+ y 26 palabras; 8 actividades por vuelta sin opciones repetidas ni ✅/❌; respuestas mezcladas.");

    // ========================================================================
    // 4. MOCHILA: CADA ETAPA DA SU OBJETO; BOCADILLOS CON 8 DE 8; MASCOTA CON LOS 6
    // ========================================================================
    console.log("\n4. Verificando progresión de la mochila y mascota pingüino...");

    let mockProgress: StudentProgress = {
      code: "TEST-ML-01",
      coins: 50,
      completedWorlds: [],
      activityLog: [],
      seasonalCollection: [],
      achievementCollection: [],
    };

    // 6 de 8 (75 %) NO supera: no da nada
    const r0 = registrarResultadoEtapa(mockProgress, 1, 6, t15Oct);
    assert.equal(r0.scorePct, 75);
    assert.deepEqual(r0.objetosPremio, [], "6 de 8 no supera la etapa");
    assert.equal(haParticipadoMonteLeon(r0.nextProgress), false, "Jugar sin superar no cuenta como participar");
    mockProgress = r0.nextProgress;

    // 7 de 8 supera: cada etapa da SU objeto
    const esperados: Record<number, string> = {
      1: "botella-agua-ml",
      2: "anteojos-sol-ml",
      3: "gorra-ml",
      4: "protector-solar-ml",
      5: "golosina-ml",
    };
    // Orden distinto al de las etapas, para comprobar que el premio depende de la etapa.
    for (const e of [3, 1, 5, 2]) {
      const r = registrarResultadoEtapa(mockProgress, e, 7, t15Oct);
      assert.equal(r.scorePct, 88);
      assert.deepEqual(r.objetosPremio, [esperados[e]], `Etapa ${e} debe dar ${esperados[e]}`);
      mockProgress = r.nextProgress;
    }
    // Repetir una etapa ya superada con 7 no da nada nuevo
    const rRep = registrarResultadoEtapa(mockProgress, 3, 7, t15Oct);
    assert.deepEqual(rRep.objetosPremio, [], "Repetir sin vuelta perfecta no da objetos nuevos");
    mockProgress = rRep.nextProgress;

    // Vuelta perfecta (8 de 8) en una etapa ya superada: bocadillos
    const rPerf = registrarResultadoEtapa(mockProgress, 1, 8, t15Oct);
    assert.deepEqual(rPerf.objetosPremio, ["bocadillos-ml"], "8 de 8 da los bocadillos");
    mockProgress = rPerf.nextProgress;
    assert.equal(tieneMochilaCompleta(mockProgress), false, "Falta el protector solar (etapa 4)");
    assert.equal(mockProgress.seasonalCollection?.includes(MASCOTA_MONTE_LEON.id), false);

    // Etapa 4 con 8 de 8: protector solar (los bocadillos ya estaban) y ¡mascota!
    const r4 = registrarResultadoEtapa(mockProgress, 4, 8, t15Oct);
    assert.deepEqual(r4.objetosPremio, ["protector-solar-ml"]);
    assert.equal(r4.mascotaPremio, "pinguino-peluche-ml", "Completar la mochila da el pingüino de peluche");
    assert.equal(tieneMochilaCompleta(r4.nextProgress), true);
    mockProgress = r4.nextProgress;

    // Una sola vuelta perfecta en una etapa nueva da los dos objetos juntos
    const rDoble = registrarResultadoEtapa(
      { code: "TEST-ML-02", coins: 0, completedWorlds: [], activityLog: [] },
      2,
      8,
      t15Oct
    );
    assert.deepEqual(rDoble.objetosPremio, ["anteojos-sol-ml", "bocadillos-ml"]);

    console.log("   ✅ Cada etapa da su objeto (7 de 8), bocadillos con 8 de 8 y mascota con los 6.");

    // ========================================================================
    // 5. AVATARES SUPERESPECIALES Y SUS REGLAS
    // ========================================================================
    console.log("\n5. Verificando desbloqueo de avatares superespeciales...");

    let pAv: StudentProgress = { code: "TEST-AV", coins: 0, completedWorlds: [], activityLog: [] };
    pAv = registrarResultadoEtapa(pAv, 1, 7, t15Oct).nextProgress;
    assert.equal(pAv.achievementCollection?.includes("explorador-monte-leon"), false, "Falta la etapa 2");
    const rAv2 = registrarResultadoEtapa(pAv, 2, 7, t15Oct);
    assert.deepEqual(rAv2.nuevosAvatares, ["explorador-monte-leon"]);
    pAv = rAv2.nextProgress;
    const rAv4 = registrarResultadoEtapa(pAv, 4, 7, t15Oct);
    assert.deepEqual(rAv4.nuevosAvatares, ["guardaparque-monte-leon"]);
    pAv = rAv4.nextProgress;
    pAv = registrarResultadoEtapa(pAv, 3, 7, t15Oct).nextProgress;
    pAv = registrarResultadoEtapa(pAv, 5, 7, t15Oct).nextProgress;
    assert.equal(
      pAv.achievementCollection?.includes("pinguino-monte-leon"),
      false,
      "Pingüino NO con 7 de 8 (hace falta 90 % o más = 8 de 8 en cada etapa)"
    );
    for (const e of [1, 2, 3, 4]) pAv = registrarResultadoEtapa(pAv, e, 8, t15Oct).nextProgress;
    assert.equal(pAv.achievementCollection?.includes("pinguino-monte-leon"), false, "Falta la etapa 5 perfecta");
    const rAv5 = registrarResultadoEtapa(pAv, 5, 8, t15Oct);
    assert.ok(rAv5.nuevosAvatares.includes("pinguino-monte-leon"), "Pingüino con 8 de 8 en las 5 etapas");
    pAv = rAv5.nextProgress;

    assert.equal(canUseAvatar("pinguino-monte-leon", [], pAv.achievementCollection), true);
    assert.equal(canUseAvatar("pinguino-monte-leon", [], []), false);

    console.log("   ✅ Avatares: explorador (1 y 2), guardaparque (4) y pingüino (8 de 8 en las 5).");

    // ========================================================================
    // 6. MEDALLA: SOLO EN LA VENTANA, SOLO A QUIEN SUPERÓ ALGUNA ETAPA, UNA VEZ
    // ========================================================================
    console.log("\n6. Verificando entrega de la medalla de Monte León...");

    const alumnoNoParticipo: StudentProgress = {
      code: "NO-PARTICIPO",
      coins: 0,
      completedWorlds: [],
      activityLog: [],
      seasonalCollection: [],
    };
    assert.equal(haParticipadoMonteLeon(alumnoNoParticipo), false);
    assert.equal(entregarMedallaBuenViaje(alumnoNoParticipo).entregada, false, "Sin participar no hay medalla");

    // Jugar en la ventana sin superar: no hay medalla
    const rSinSuperar = registrarResultadoEtapa(alumnoNoParticipo, 1, 5, tInicioBuenViaje);
    assert.equal(rSinSuperar.medallaPremio, undefined, "Sin superar una etapa no hay medalla");
    // Superar FUERA de la ventana: tampoco (llega con el cartel del 27/10)
    const rFuera = registrarResultadoEtapa(alumnoNoParticipo, 1, 7, t15Oct);
    assert.equal(rFuera.medallaPremio, undefined, "Antes del 27/10 20:00 no se da la medalla");
    // Superar DENTRO de la ventana: sí
    const rDentro = registrarResultadoEtapa(alumnoNoParticipo, 1, 7, tInicioBuenViaje);
    assert.equal(rDentro.medallaPremio, MEDALLA_MONTE_LEON.id);

    assert.equal(haParticipadoMonteLeon(mockProgress), true);
    const entregaSi = entregarMedallaBuenViaje(mockProgress);
    assert.equal(entregaSi.entregada, true, "Alumno participante recibe medalla");
    const entregaSegunda = entregarMedallaBuenViaje(entregaSi.nextProgress);
    assert.equal(entregaSegunda.entregada, false, "La medalla no se entrega dos veces");
    assert.equal(
      entregaSegunda.nextProgress.seasonalCollection?.filter((id) => id === MEDALLA_MONTE_LEON.id).length,
      1
    );

    console.log("   ✅ Medalla solo en la ventana, solo a quien superó una etapa, una sola vez.");

    // ========================================================================
    // 7. OBJETO REGALADO NO SE VUELVE A DAR (REGLA GENERAL CL-18)
    // ========================================================================
    console.log("\n7. Verificando que un objeto regalado no se vuelve a ganar automáticamente...");

    const alumnoRegalador: StudentProgress = {
      code: "REGALADOR-01",
      coins: 20,
      completedWorlds: [],
      activityLog: [],
      seasonalCollection: [],
      objetosRegalados: ["botella-agua-ml"],
      monteLeon: { etapas: {} },
    };
    assert.equal(alumnoTieneORegalo(alumnoRegalador, "botella-agua-ml"), true);
    const rRegalo = registrarResultadoEtapa(alumnoRegalador, 1, 8, t15Oct);
    assert.deepEqual(rRegalo.objetosPremio, ["bocadillos-ml"], "La botella regalada no vuelve; sí los bocadillos");
    assert.equal(rRegalo.nextProgress.seasonalCollection?.includes("botella-agua-ml"), false);

    console.log("   ✅ Objeto regalado no se vuelve a entregar.");

    // ========================================================================
    // 8. CATÁLOGO DE PREMIOS Y CATÁLOGO DE IMÁGENES
    // ========================================================================
    console.log("\n8. Verificando catálogo de premios y registro en ACCESSORY_CATALOG_PREMIO...");

    for (const obj of MOCHILA_MONTE_LEON) {
      assert.ok(
        ACCESSORY_CATALOG_PREMIO.some((a) => a.id === obj.id),
        `Objeto de mochila ${obj.id} debe estar en ACCESSORY_CATALOG_PREMIO`
      );
      assert.ok(IMAGENES_LISTAS.has(obj.id), `Objeto ${obj.id} debe tener imagen en IMAGENES_LISTAS`);
    }

    assert.ok(
      ACCESSORY_CATALOG_PREMIO.some((a) => a.id === MASCOTA_MONTE_LEON.id),
      "Mascota debe estar en ACCESSORY_CATALOG_PREMIO"
    );
    assert.ok(
      ACCESSORY_CATALOG_PREMIO.some((a) => a.id === MEDALLA_MONTE_LEON.id),
      "Medalla debe estar en ACCESSORY_CATALOG_PREMIO"
    );

    for (const av of ["explorador-monte-leon", "guardaparque-monte-leon", "pinguino-monte-leon"]) {
      assert.ok(AVATAR_OPTIONS.includes(av), `Avatar ${av} debe estar en AVATAR_OPTIONS`);
      assert.ok(LOGRO_AVATAR_IDS.has(av), `Avatar ${av} debe estar en LOGRO_AVATAR_IDS`);
      assert.ok(IMAGENES_LISTAS.has(av), `Avatar ${av} debe tener imagen en IMAGENES_LISTAS`);
    }

    console.log("   ✅ Catálogo de accesorios y avatares perfectamente integrado.");

    // ========================================================================
    // 9. PROBAR SCRIPT DOCENTE CON BASE REAL (MODO DRY-RUN Y EJECUCIÓN)
    // ========================================================================
    console.log("\n9. Verificando script docente y datos reales...");

    const allStudents = await getStudents();
    const studentG3 = allStudents.find(
      (s) => (s.grade === undefined || s.grade === 3) && s.classroomId !== OPEN_CLASSROOM_ID
    );
    assert.ok(studentG3, "Debe haber al menos un alumno de 3.º grado");

    // Simulamos que participó guardando progreso en la base
    const pReal = await getProgress(studentG3.code);
    await saveProgress({
      ...pReal,
      monteLeon: {
        etapas: { 1: { bestScore: 88, completedAt: t15Oct.toISOString() } },
      },
    });

    const pAfterSave = await getProgress(studentG3.code);
    assert.equal(haParticipadoMonteLeon(pAfterSave), true);

    const entrega = entregarMedallaBuenViaje(pAfterSave);
    assert.equal(entrega.entregada, true);
    await saveProgress(entrega.nextProgress);

    const pFinal = await getProgress(studentG3.code);
    assert.ok(pFinal.seasonalCollection?.includes(MEDALLA_MONTE_LEON.id));

    console.log("   ✅ Flujo docente e interacción con base de datos OK.");

    console.log("\n🎉 TODAS LAS PRUEBAS DE AG-19 PASARON EXITOSAMENTE.");
  } finally {
    // Restaurar base de datos
    fs.copyFileSync(RESPALDO, DB);
    fs.unlinkSync(RESPALDO);
    console.log("💾 Base de datos restaurada al estado original.");
  }
}

main().catch((err) => {
  console.error("\n❌ Error en las pruebas de Monte León:", err);
  process.exit(1);
});
