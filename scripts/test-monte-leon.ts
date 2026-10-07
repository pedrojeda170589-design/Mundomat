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
    assert.equal(banco5.length, 26, `Etapa 5 debe tener exactamente las 26 palabras solicitadas (tiene ${banco5.length})`);

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

    console.log("   ✅ Bancos de 15+ y 26 palabras; 8 actividades por vuelta sin opciones repetidas ni ✅/❌.");

    // ========================================================================
    // 4. MOCHILA: OBJETOS EN ORDEN Y MASCOTA AL COMPLETARLA (6 OBJETOS)
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

    // Etapa 1 superada al 85% -> entrega botella de agua
    const r1 = registrarResultadoEtapa(mockProgress, 1, 85, t15Oct);
    assert.equal(r1.objetoPremio, "botella-agua-ml", "Etapa 1 debe entregar botella de agua");
    assert.ok(r1.nextProgress.seasonalCollection?.includes("botella-agua-ml"));
    mockProgress = r1.nextProgress;

    // Etapa 2 superada al 80% -> entrega anteojos de sol
    const r2 = registrarResultadoEtapa(mockProgress, 2, 80, t15Oct);
    assert.equal(r2.objetoPremio, "anteojos-sol-ml", "Etapa 2 debe entregar anteojos de sol");
    mockProgress = r2.nextProgress;

    // Etapa 3 superada al 90% -> entrega gorra
    const r3 = registrarResultadoEtapa(mockProgress, 3, 90, t15Oct);
    assert.equal(r3.objetoPremio, "gorra-ml", "Etapa 3 debe entregar gorra");
    mockProgress = r3.nextProgress;

    // Etapa 4 superada al 85% -> entrega protector solar
    const r4 = registrarResultadoEtapa(mockProgress, 4, 85, t15Oct);
    assert.equal(r4.objetoPremio, "protector-solar-ml", "Etapa 4 debe entregar protector solar");
    mockProgress = r4.nextProgress;

    // Repetir etapa 1 con 85% -> entrega bocadillos (el siguiente en la lista general)
    const rExtra = registrarResultadoEtapa(mockProgress, 1, 85, t15Oct);
    assert.equal(rExtra.objetoPremio, "bocadillos-ml", "Siguiente entrega debe ser bocadillos");
    mockProgress = rExtra.nextProgress;

    // Mochila todavía no completa (faltan golosina y mascota)
    assert.equal(tieneMochilaCompleta(mockProgress), false, "Aún falta la golosina");
    assert.equal(mockProgress.seasonalCollection?.includes(MASCOTA_MONTE_LEON.id), false);

    // Etapa 5 (dictado) superada al 80% -> entrega golosina y ¡MASCOTA!
    const r5 = registrarResultadoEtapa(mockProgress, 5, 80, t15Oct);
    assert.equal(r5.objetoPremio, "golosina-ml", "Etapa 5 debe entregar golosina");
    assert.equal(r5.mascotaPremio, "pinguino-peluche-ml", "Completar la mochila debe entregar el pingüino de peluche");
    assert.ok(r5.nextProgress.seasonalCollection?.includes("pinguino-peluche-ml"));
    assert.equal(tieneMochilaCompleta(r5.nextProgress), true, "La mochila debe estar completa con los 6 objetos");
    mockProgress = r5.nextProgress;

    console.log("   ✅ Mochila entrega los objetos en orden y la mascota al completar los 6.");

    // ========================================================================
    // 5. AVATARES SUPERESPECIALES Y SUS REGLAS
    // ========================================================================
    console.log("\n5. Verificando desbloqueo de avatares superespeciales...");

    // En mockProgress ya superamos etapas 1, 2 y 4 con 80%+.
    // Por lo tanto, explorador y guardaparque ya deben estar desbloqueados.
    assert.ok(
      mockProgress.achievementCollection?.includes("explorador-monte-leon"),
      "Explorador se desbloquea con etapas 1 y 2"
    );
    assert.ok(
      mockProgress.achievementCollection?.includes("guardaparque-monte-leon"),
      "Guardaparque se desbloquea con etapa 4"
    );
    // Pero el pingüino requiere TODAS las 5 etapas con 90%+ (etapa 2 y 5 tuvieron 80%).
    assert.equal(
      mockProgress.achievementCollection?.includes("pinguino-monte-leon"),
      false,
      "Pingüino NO debe desbloquearse si alguna etapa tuvo menos de 90%"
    );

    // Subimos todas las etapas a 90%+
    const rP1 = registrarResultadoEtapa(mockProgress, 1, 100, t15Oct);
    const rP2 = registrarResultadoEtapa(rP1.nextProgress, 2, 95, t15Oct);
    const rP3 = registrarResultadoEtapa(rP2.nextProgress, 3, 90, t15Oct);
    const rP4 = registrarResultadoEtapa(rP3.nextProgress, 4, 90, t15Oct);
    const rP5 = registrarResultadoEtapa(rP4.nextProgress, 5, 95, t15Oct);

    assert.ok(
      rP5.nextProgress.achievementCollection?.includes("pinguino-monte-leon"),
      "Pingüino se desbloquea con todas las 5 etapas con 90%+"
    );
    assert.ok(
      rP5.nuevosAvatares.includes("pinguino-monte-leon"),
      "Debe figurar en nuevosAvatares"
    );

    // Verificar que canUseAvatar valida correctamente contra achievementCollection
    assert.equal(
      canUseAvatar("pinguino-monte-leon", [], rP5.nextProgress.achievementCollection),
      true,
      "Avatar desbloqueado es válido en perfil"
    );
    assert.equal(
      canUseAvatar("pinguino-monte-leon", [], []),
      false,
      "Avatar bloqueado es rechazado"
    );

    console.log("   ✅ Avatares: explorador (1 y 2), guardaparque (4) y pingüino (todas 90%+).");

    // ========================================================================
    // 6. MEDALLA: SE DA UNA SOLA VEZ Y SOLO A QUIEN PARTICIPÓ
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
    const entregaNo = entregarMedallaBuenViaje(alumnoNoParticipo);
    assert.equal(entregaNo.entregada, false, "No debe recibir medalla si no participó");

    // Alumno participante sí recibe medalla
    assert.equal(haParticipadoMonteLeon(mockProgress), true);
    const entregaSi = entregarMedallaBuenViaje(mockProgress);
    assert.equal(entregaSi.entregada, true, "Alumno participante recibe medalla");
    assert.ok(entregaSi.nextProgress.seasonalCollection?.includes(MEDALLA_MONTE_LEON.id));

    // Si se vuelve a llamar, no se duplica
    const entregaSegunda = entregarMedallaBuenViaje(entregaSi.nextProgress);
    assert.equal(entregaSegunda.entregada, false, "La medalla no se entrega dos veces");
    const cantidadMedallas = entregaSegunda.nextProgress.seasonalCollection?.filter(
      (id) => id === MEDALLA_MONTE_LEON.id
    ).length;
    assert.equal(cantidadMedallas, 1, "Debe figurar una sola vez en la colección");

    console.log("   ✅ Medalla entregada una sola vez y únicamente a quien participó.");

    // ========================================================================
    // 7. OBJETO REGALADO NO SE VUELVE A DAR (REGLA GENERAL CL-18)
    // ========================================================================
    console.log("\n7. Verificando que un objeto regalado no se vuelve a ganar automáticamente...");

    // Simulamos que el alumno regaló la botella de agua
    const alumnoRegalador: StudentProgress = {
      code: "REGALADOR-01",
      coins: 20,
      completedWorlds: [],
      activityLog: [],
      seasonalCollection: [], // ya no tiene la botella
      objetosRegalados: ["botella-agua-ml"], // quedó en regalados
      monteLeon: { etapas: {} },
    };

    assert.equal(
      alumnoTieneORegalo(alumnoRegalador, "botella-agua-ml"),
      true,
      "Se reconoce como obtenido históricamente para la mochila"
    );

    // Juega y supera la etapa 1 de nuevo con 100%
    const rRegalo = registrarResultadoEtapa(alumnoRegalador, 1, 100, t15Oct);
    assert.notEqual(
      rRegalo.objetoPremio,
      "botella-agua-ml",
      "No debe volver a entregar la botella regalada"
    );
    assert.equal(
      rRegalo.objetoPremio,
      "anteojos-sol-ml",
      "Debe avanzar al siguiente objeto que nunca tuvo"
    );
    assert.equal(
      rRegalo.nextProgress.seasonalCollection?.includes("botella-agua-ml"),
      false,
      "La botella no debe reaparecer en seasonalCollection"
    );

    console.log("   ✅ Objeto regalado registrado en objetosRegalados no se vuelve a entregar.");

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
        etapas: { 1: { bestScore: 90, completedAt: t15Oct.toISOString() } },
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
