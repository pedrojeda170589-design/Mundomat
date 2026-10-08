// Pruebas de «Desafíos y eventos» (configuración desde el panel), del
// mezclado de opciones en todas las actividades y del bloqueo de mundos.
// Uso: npx tsx scripts/test-eventos.ts
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { isUsingRemoteStore } from "../src/lib/store";
import { usarEventosConfig, validarEventosConfig, eventoActivo, DESAFIOS, idTemporada, idDrop, idEstacion } from "../src/lib/eventos/config";
import { catalogoEventos, idsEventos } from "../src/lib/eventos/catalogo";
import { guardarEventosConfig, leerEventosConfig } from "../src/lib/eventos/server";
import { aventuraDelDia } from "../src/lib/weekend/plan";
import { torneoHabilitado } from "../src/lib/torneo/tiempos";
import { esSemanaDeDictado } from "../src/lib/dictado/banco";
import { debeMostrarMonteLeon } from "../src/lib/monteLeon/fechas";
import { getActiveEvents } from "../src/lib/seasons";
import { ventanaDe, enVenta } from "../src/lib/tiempo-limitado";
import { dropActivo, getDrop } from "../src/lib/coleccion/drops";
import { practiceZonesFor } from "../src/lib/grade1/practice";
import { buildActivitiesForWorld, repasoTablasActivo } from "../src/lib/activities";
import { WORLDS } from "../src/lib/worlds";
import { findStudentByCode, getStudents, mundoHabilitadoPara, getWorldsConfig, saveWorldsConfig } from "../src/lib/data";
import { OPEN_CLASSROOM_ID } from "../src/lib/openClassroomShared";

if (isUsingRemoteStore()) throw new Error("Esta prueba usa la base local: sacá las variables de Upstash/KV.");
const DB = path.join(process.cwd(), ".data", "db.json");
const RESPALDO = path.join(process.cwd(), ".data", "db.antes-de-test-eventos.json");

const AR = (s: string) => new Date(`${s}-03:00`);
const miercoles = AR("2026-10-07T12:00:00"); // miércoles
const sabado = AR("2026-10-10T12:00:00");

async function main() {
  fs.copyFileSync(DB, RESPALDO);
  try {
    // ---------------------------------------------------------------
    console.log("1. Sin configuración, todo funciona como antes…");
    usarEventosConfig({});
    assert.equal(aventuraDelDia(miercoles, 3), null);
    assert.ok(aventuraDelDia(sabado, 3));
    assert.equal(aventuraDelDia(sabado, 2), null, "la aventura de siempre es solo de 3.º");
    assert.equal(torneoHabilitado(3, miercoles), true);
    assert.equal(torneoHabilitado(2, miercoles), false);
    assert.equal(torneoHabilitado(3, AR("2026-05-10T12:00:00")), false, "antes de julio no");
    assert.equal(debeMostrarMonteLeon({ grade: 3 }, miercoles), true);
    assert.equal(debeMostrarMonteLeon({ grade: 2 }, miercoles), false);
    assert.equal(debeMostrarMonteLeon({ grade: 3 }, AR("2026-10-28T10:00:00")), false);

    // ---------------------------------------------------------------
    console.log("2. Validación de lo que manda el panel…");
    const ids = idsEventos();
    assert.ok(ids.has("fin-de-semana") && ids.has(idTemporada("animales")) && ids.has(idDrop("six-seven")) && ids.has(idEstacion("halloween")));
    const desconocido = validarEventosConfig({ inventado: { modo: "apagado" } }, ids);
    assert.ok(desconocido.ok && Object.keys(desconocido.config).length === 0, "un evento que ya no existe se descarta");
    assert.equal(validarEventosConfig({ [idDrop("six-seven")]: { modo: "siempre" } }, ids).ok, false, "un drop va entre fechas");
    assert.equal(validarEventosConfig({ "fin-de-semana": { modo: "fechas" } }, ids).ok, false, "fechas sin fechas");
    assert.equal(validarEventosConfig({ "fin-de-semana": { modo: "fechas", desde: "2026-10-10", hasta: "2026-10-01" } }, ids).ok, false);
    assert.equal(validarEventosConfig({ "fin-de-semana": { modo: "siempre", dias: [] } }, ids).ok, false, "sin días");
    const v = validarEventosConfig({ "fin-de-semana": { modo: "siempre", dias: [3, 3, 9, 1], grados: [3, 2, 99] } }, ids);
    assert.ok(v.ok);
    if (v.ok) assert.deepEqual(v.config["fin-de-semana"], { modo: "siempre", dias: [1, 3], grados: [2, 3] });
    assert.ok(catalogoEventos().length > 20);

    // ---------------------------------------------------------------
    console.log("3. Aventura de fin de semana: días de semana, grados y apagado…");
    usarEventosConfig({ "fin-de-semana": { modo: "siempre", dias: [3], grados: [2, 3] } });
    assert.deepEqual(aventuraDelDia(miercoles, 2)?.day, "sabado", "un miércoles habilitado juega el plan del sábado");
    assert.equal(aventuraDelDia(sabado, 3), null, "el sábado no está entre los días elegidos");
    assert.equal(aventuraDelDia(miercoles, 1), null, "1.º no está habilitado");
    usarEventosConfig({ "fin-de-semana": { modo: "apagado" } });
    assert.equal(aventuraDelDia(sabado, 3), null);
    usarEventosConfig({ "fin-de-semana": { modo: "fechas", desde: "2026-10-05", hasta: "2026-10-09" } });
    assert.ok(aventuraDelDia(miercoles, 3));
    assert.equal(aventuraDelDia(sabado, 3), null, "fuera de las fechas");

    // ---------------------------------------------------------------
    console.log("4. Repaso de las tablas, dictado, Monte León y zonas de práctica…");
    usarEventosConfig({ "repaso-tablas": { modo: "apagado" }, "repaso-en-mundos": { modo: "apagado" } });
    assert.equal(torneoHabilitado(3, miercoles), false);
    const mate = WORLDS.find((w) => w.subject === "matematica" && w.category !== "tabla" && w.category !== "reparto" && !w.storyId)!;
    assert.equal(repasoTablasActivo(mate, miercoles), false);
    usarEventosConfig({ "repaso-tablas": { modo: "siempre", grados: [2, 3] } });
    assert.equal(torneoHabilitado(2, AR("2026-03-10T12:00:00")), true, "con «siempre» también en marzo y en 2.º");
    usarEventosConfig({ dictado: { modo: "siempre", dias: [1, 2, 3, 4, 5] } });
    assert.equal(esSemanaDeDictado(miercoles, 3), true);
    assert.equal(esSemanaDeDictado(sabado, 3), false);
    assert.equal(esSemanaDeDictado(miercoles, 1), false, "1.º no tiene dictado por defecto");
    usarEventosConfig({ "monte-leon": { modo: "fechas", desde: "2026-11-01", hasta: "2026-11-05", grados: [3, 4] } });
    assert.equal(debeMostrarMonteLeon({ grade: 3 }, miercoles), false);
    assert.equal(debeMostrarMonteLeon({ grade: 4 }, AR("2026-11-03T10:00:00")), true);
    assert.equal(debeMostrarMonteLeon({ grade: 3, classroomId: OPEN_CLASSROOM_ID }, AR("2026-11-03T10:00:00")), false, "nunca el aula abierta");
    usarEventosConfig({ "zonas-practica": { modo: "apagado" } });
    assert.deepEqual(practiceZonesFor({ code: "X", coins: 0, completedWorlds: [], activityLog: [] }, "lengua", 1), []);

    // ---------------------------------------------------------------
    console.log("5. Festividades, temporadas de la tienda y lanzamientos…");
    usarEventosConfig({ [idEstacion("halloween")]: { modo: "apagado" } });
    assert.ok(!getActiveEvents(AR("2026-10-31T12:00:00")).some((e) => e.id === "halloween"));
    usarEventosConfig({ [idEstacion("navidad")]: { modo: "fechas", desde: "2026-10-01", hasta: "2026-10-15" } });
    assert.ok(getActiveEvents(miercoles).some((e) => e.id === "navidad"));
    // Temporada en pausa: se abre con «entre fechas».
    usarEventosConfig({});
    assert.equal(ventanaDe("animales", miercoles), null, "en pausa no se anuncia");
    usarEventosConfig({ [idTemporada("animales")]: { modo: "fechas", desde: "2026-10-06", hasta: "2026-10-12" } });
    const va = ventanaDe("animales", miercoles);
    assert.ok(va?.activa);
    assert.equal(va?.hasta.day, 12);
    assert.equal(enVenta("animales", undefined, miercoles), true);
    usarEventosConfig({ [idTemporada("halloween")]: { modo: "apagado" } });
    assert.equal(enVenta("halloween", undefined, AR("2026-10-20T12:00:00")), false);
    // Apagar la FESTIVIDAD también cierra su tienda (si la temporada está en automático).
    usarEventosConfig({ [idEstacion("halloween")]: { modo: "apagado" } });
    assert.equal(enVenta("halloween", undefined, AR("2026-10-20T12:00:00")), false);
    // «Siempre»: el contador no dice «último día»; ventana del año en curso.
    usarEventosConfig({ [idTemporada("animales")]: { modo: "siempre" } });
    const vs = ventanaDe("animales", miercoles)!;
    assert.ok(vs.activa && vs.dias > 30 && vs.hasta.month === 12 && vs.desde.year === 2026, JSON.stringify(vs));
    const six = getDrop("six-seven")!;
    usarEventosConfig({});
    assert.equal(dropActivo(six, miercoles), false);
    usarEventosConfig({ [idDrop("six-seven")]: { modo: "fechas", desde: "2026-10-07", hasta: "2026-10-08" } });
    assert.equal(dropActivo(six, miercoles), true);
    assert.equal(dropActivo(six, AR("2026-10-09T12:00:00")), false);

    // ---------------------------------------------------------------
    console.log("6. Grados de siempre con «automático» y grados elegidos…");
    usarEventosConfig({ competencia: { modo: "auto", grados: [2] } });
    assert.equal(eventoActivo("competencia", 3, sabado, () => true, [...DESAFIOS.competencia.grados]), false);
    assert.equal(eventoActivo("competencia", 2, sabado, () => true, [...DESAFIOS.competencia.grados]), true);

    // ---------------------------------------------------------------
    console.log("7. Guardar y leer del KV local…");
    await guardarEventosConfig({ dictado: { modo: "apagado" } });
    assert.deepEqual(await leerEventosConfig(), { dictado: { modo: "apagado" } });
    usarEventosConfig({});

    // ---------------------------------------------------------------
    console.log("8. Opciones mezcladas en todas las actividades de 3.º…");
    const pos = [0, 0, 0, 0];
    let tfPrimera = 0;
    let tfTotal = 0;
    for (const w of WORLDS) {
      for (let k = 0; k < 15; k++) {
        for (const a of buildActivitiesForWorld(w)) {
          if (a.type === "mc" || a.type === "find-error") {
            pos[Math.min(3, a.answerIndex)]++;
            assert.ok(a.answerIndex >= 0 && a.answerIndex < a.choices.length);
            assert.equal(new Set(a.choices).size, a.choices.length, `opciones repetidas en ${a.id}`);
          }
          if (a.type === "true-false" && a.justification) {
            tfTotal++;
            if (a.justification.answerIndex === 0) tfPrimera++;
          }
        }
      }
    }
    const total = pos.reduce((s, x) => s + x, 0);
    assert.ok(pos[0] / total < 0.45, `la correcta queda primera en el ${Math.round((100 * pos[0]) / total)} %`);
    assert.ok(pos[1] / total > 0.25 && pos[2] / total > 0.15, `posiciones: ${pos}`);
    assert.ok(tfPrimera / tfTotal < 0.65, "justificaciones de verdadero/falso mezcladas");

    // ---------------------------------------------------------------
    console.log("9. Un mundo bloqueado no suma (servidor)…");
    const alumnos = await getStudents();
    const a3 = alumnos.find((s) => (s.grade ?? 3) === 3 && s.classroomId !== OPEN_CLASSROOM_ID && s.type !== "prueba");
    assert.ok(a3, "hace falta un alumno de 3.º en la base local");
    const st = (await findStudentByCode(a3!.code))!;
    const antes = await getWorldsConfig();
    const id = WORLDS[1].id;
    await saveWorldsConfig({ enabledWorldIds: antes.enabledWorldIds.filter((x) => x !== id) });
    assert.equal(await mundoHabilitadoPara(st, id), false);
    await saveWorldsConfig({ enabledWorldIds: [...antes.enabledWorldIds.filter((x) => x !== id), id] });
    assert.equal(await mundoHabilitadoPara(st, id), true);
    assert.equal(await mundoHabilitadoPara(st, 38001), true, "el dictado tiene su propia regla");

    console.log("\n🎉 Desafíos y eventos: todo OK.");
  } finally {
    fs.copyFileSync(RESPALDO, DB);
    fs.unlinkSync(RESPALDO);
    usarEventosConfig({});
  }
}

main().catch((e) => {
  console.error("❌", e);
  process.exit(1);
});
