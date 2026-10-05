// Prueba del aula abierta («Jugar gratis»): aceptación de condiciones,
// reemplazo del nombre por un número a los 30 días y «Eliminar cuenta y datos».
//
// Corre contra la base LOCAL (.data/db.json) y la carpeta backups/: hace una
// copia antes y las deja como estaban al final.
//   npx tsx scripts/test-privacidad-prueba.ts
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { isUsingRemoteStore, getJSON, setJSON } from "../src/lib/store";
import { registerOpenClassroomStudent, addOpenClassroomRating, getTrialReport } from "../src/lib/openClassroom";
import { getProgress, saveProgress, findStudentByCode } from "../src/lib/data";
import { addNews } from "../src/lib/news";
import { VERSION_CONDICIONES } from "../src/lib/legal/condiciones";
import { anonimizarVencidos, eliminarCuentaPrueba, rastrosDe } from "../src/lib/privacidadPrueba";
import { OPEN_CLASSROOM_ID } from "../src/lib/openClassroomShared";

if (isUsingRemoteStore()) throw new Error("Esta prueba usa la base local: sacá las variables de Upstash/KV.");

const DB = path.join(process.cwd(), ".data", "db.json");
const COPIAS = path.join(process.cwd(), "backups");
const RESPALDO = path.join(process.cwd(), ".data", "db.antes-de-test-privacidad.json");
const RESPALDO_COPIAS = path.join(process.cwd(), ".data", "backups-antes-de-test");
const DIA = 24 * 60 * 60 * 1000;

async function jugar(code: string, apodo: string, nombre: string) {
  const p = await getProgress(code);
  await saveProgress({
    ...p,
    nickname: apodo,
    completedWorlds: [1],
    activityLog: [{ worldId: 1, activityIndex: 0, correct: 1, incorrect: 0, timeSpentSeconds: 20, finishedAt: new Date().toISOString() }],
  });
  await addNews([{ code, who: apodo, kind: "mundo", emoji: "🏘️", text: "completó La Aldea de los Números" }], OPEN_CLASSROOM_ID);
  await addOpenClassroomRating({ code, at: new Date().toISOString(), stars: 5, liked: ["Los mundos"], comment: `Me gustó mucho, soy ${nombre}` });
  await setJSON(`tournament:2026-W40:${code}`, { code, name: nombre, score: 7 });
  // Una copia de la base con este alumno (como las de backups/).
  fs.mkdirSync(COPIAS, { recursive: true });
  fs.writeFileSync(
    path.join(COPIAS, `test-copia-${code}.json`),
    JSON.stringify({ students: [{ code, name: nombre }], progress: { [code]: { code, nickname: apodo } } }, null, 2)
  );
}

async function main() {
  fs.copyFileSync(DB, RESPALDO);
  fs.rmSync(RESPALDO_COPIAS, { recursive: true, force: true });
  if (fs.existsSync(COPIAS)) fs.cpSync(COPIAS, RESPALDO_COPIAS, { recursive: true });
  try {
    // Aula abierta abierta y con lugar, para la prueba.
    await setJSON("openClassroomConfig", { open: true, capacity: 1000, trialDays: 30 });

    // 1) Registro nuevo: sin aceptar la versión vigente no se puede.
    const malo = await registerOpenClassroomStudent("Zorbalindo", "10.0.0.1", { version: "vieja" });
    assert.equal(malo.ok, false);
    const conApellido = await registerOpenClassroomStudent("Zorba Linda Pérez", "10.0.0.1", { version: VERSION_CONDICIONES });
    assert.equal(conApellido.ok, false, "más de dos palabras: no se acepta (no se pide apellido)");

    const hace31 = new Date(Date.now() - 31 * DIA);
    const r1 = await registerOpenClassroomStudent("Zorbalindo", "10.0.0.2", { version: VERSION_CONDICIONES, now: hace31 });
    assert.ok(r1.ok);
    const a = r1.student;
    assert.equal(a.version_condiciones, VERSION_CONDICIONES, "guarda la versión aceptada");
    assert.equal(a.condicionesAceptadasAt, hace31.toISOString(), "guarda fecha y hora de aceptación");
    await jugar(a.code, "Zorbi", "Zorbalindo");
    assert.ok((await rastrosDe(["Zorbalindo"])).length >= 4, "antes: el nombre está en varias claves y en la copia");
    console.log("✅ Registro: guarda version_condiciones y fecha/hora de aceptación.");

    // 2) A los 29 días no pasa nada.
    assert.equal(await anonimizarVencidos(new Date(hace31.getTime() + 29 * DIA)), 0);
    assert.equal((await findStudentByCode(a.code))?.name, "Zorbalindo");

    // 3) Al cumplirse los 30 días: el nombre se reemplaza por un número y se borra de todos lados.
    const n = await anonimizarVencidos(new Date(hace31.getTime() + 30 * DIA + 60_000));
    assert.ok(n >= 1);
    const anon = await findStudentByCode(a.code);
    assert.match(anon!.name, /^Participante \d{6}$/, "el nombre ahora es un número");
    assert.ok(anon!.anonimizadoAt);
    const rastros = await rastrosDe(["Zorbalindo", "Zorbi"]);
    assert.deepEqual(rastros, [], `el nombre no debe quedar en ninguna clave ni copia: ${rastros.join(", ")}`);
    const informe = await getTrialReport(a.code);
    assert.equal(informe?.name, anon!.name, "los resultados quedan con el número");
    assert.ok((informe?.totalAnswered ?? 0) > 0, "los resultados se conservan");
    // Ninguna tabla une el número con el nombre (ya no existe el nombre en ningún lado).
    console.log(`✅ 30 días: «Zorbalindo» → «${anon!.name}», sin rastros del nombre; resultados conservados.`);

    // 4) Eliminar cuenta y datos: borra de verdad.
    const r2 = await registerOpenClassroomStudent("Quirinalda", "10.0.0.3", { version: VERSION_CONDICIONES });
    assert.ok(r2.ok);
    const b = r2.student;
    await jugar(b.code, "Quiri", "Quirinalda");
    assert.ok((await rastrosDe([b.code])).length > 0);
    assert.equal(await eliminarCuentaPrueba(b.code), true);
    assert.equal(await findStudentByCode(b.code), undefined, "la cuenta ya no existe");
    const quedan = await rastrosDe(["Quirinalda", "Quiri", b.code]);
    assert.deepEqual(quedan, [], `no debe quedar nada de la cuenta: ${quedan.join(", ")}`);
    console.log("✅ Eliminar cuenta y datos: no queda la cuenta, ni el nombre, ni el código, ni los resultados.");

    // Las cuentas de escuela no se borran por este camino.
    const deEscuela = (await getJSON<{ code: string; classroomId?: string }[]>("students", [])).find((s) => s.classroomId !== OPEN_CLASSROOM_ID);
    if (deEscuela) assert.equal(await eliminarCuentaPrueba(deEscuela.code), false);
  } finally {
    fs.copyFileSync(RESPALDO, DB);
    fs.rmSync(RESPALDO, { force: true });
    fs.rmSync(COPIAS, { recursive: true, force: true });
    if (fs.existsSync(RESPALDO_COPIAS)) {
      fs.cpSync(RESPALDO_COPIAS, COPIAS, { recursive: true });
      fs.rmSync(RESPALDO_COPIAS, { recursive: true, force: true });
    }
  }
  console.log("🎉 Privacidad del aula abierta: todo OK (base y copias restauradas).");
}

main().catch((e) => {
  console.error("❌", e);
  process.exit(1);
});
