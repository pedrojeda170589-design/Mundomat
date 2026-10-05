// Regalar objetos ganados a un compañero (ver src/lib/regalosObjetos.ts).
// Corre contra la base LOCAL y la deja como estaba.
//   npx tsx scripts/test-regalos.ts
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { isUsingRemoteStore, setJSON } from "../src/lib/store";
import { getProgress, getStudents, saveProgress, sameClassroom } from "../src/lib/data";
import { getMessages } from "../src/lib/messages";
import { describeMessage } from "../src/lib/messagesShared";
import { getRegalos, objetosRegalables, regalarObjeto, responderRegalo, vencerRegalos, MAX_REGALOS_OBJETO_POR_DIA } from "../src/lib/regalosObjetos";
import { ACCESSORY_CATALOG_PREMIO, ACCESSORY_CATALOG_TEMPORADA, ACCESSORY_CATALOG_TIENDA } from "../src/types";
import { OPEN_CLASSROOM_ID } from "../src/lib/openClassroomShared";
import { collectActiveSeasonalRewards, getActiveEvents, getEventRewardIds } from "../src/lib/seasons";

if (isUsingRemoteStore()) throw new Error("Esta prueba usa la base local: sacá las variables de Upstash/KV.");
const DB = path.join(process.cwd(), ".data", "db.json");
const RESPALDO = path.join(process.cwd(), ".data", "db.antes-de-test-regalos.json");
const DIA = 86_400_000;

async function main() {
  fs.copyFileSync(DB, RESPALDO);
  try {
    await setJSON("regalosObjetos", []);
    const alumnos = (await getStudents()).filter((s) => s.classroomId !== OPEN_CLASSROOM_ID);
    const a = alumnos[0];
    const b = alumnos.find((s) => s.code !== a.code && sameClassroom(s, a))!;
    const c = alumnos.find((s) => !sameClassroom(s, a));
    assert.ok(a && b, "hacen falta dos compañeros");

    const ganables = [...ACCESSORY_CATALOG_TEMPORADA, ...ACCESSORY_CATALOG_PREMIO].map((x) => x.id);
    const [o1, o2, o3, o4, o5] = ganables;
    const comprado = ACCESSORY_CATALOG_TIENDA[0].id;
    const prestado = ganables[5];
    const pa = await getProgress(a.code);
    await saveProgress({
      ...pa,
      seasonalCollection: [o1, o2, o3, o4, o5, prestado],
      shopCollection: [comprado],
      torneoPrestados: [{ id: prestado, hastaVueltas: 10, vence: new Date(Date.now() + 30 * DIA).toISOString() }],
      avatarAccessories: { [ACCESSORY_CATALOG_TEMPORADA[0].slot]: o1 },
    });
    const pb = await getProgress(b.code);
    await saveProgress({ ...pb, seasonalCollection: [o2] });

    // Qué se puede regalar: solo ganados, suyos y no prestados.
    const reg = objetosRegalables(await getProgress(a.code));
    assert.deepEqual(reg, [o1, o2, o3, o4, o5], "sin el prestado ni el comprado");
    assert.equal((await regalarObjeto(a.code, b.code, comprado)).ok, false, "lo comprado no se regala");
    assert.equal((await regalarObjeto(a.code, b.code, prestado)).ok, false, "lo prestado no se regala");
    assert.equal((await regalarObjeto(a.code, b.code, o2)).ok, false, "si ya lo tiene, no");
    assert.equal((await regalarObjeto(a.code, a.code, o1)).ok, false, "a sí mismo no");
    if (c) assert.equal((await regalarObjeto(a.code, c.code, o1)).ok, false, "solo a compañeros del aula");
    console.log("✅ Solo objetos ganados, propios y no prestados, a un compañero que no lo tenga.");

    // Regalar: sale de la colección (y del avatar) y queda en camino.
    const r1 = await regalarObjeto(a.code, b.code, o1);
    assert.ok(r1.ok);
    const pa2 = await getProgress(a.code);
    assert.ok(!pa2.seasonalCollection?.includes(o1), "deja de ser suyo");
    assert.ok(!Object.values(pa2.avatarAccessories ?? {}).includes(o1), "se le saca del avatar");
    assert.ok(!(await getProgress(b.code)).seasonalCollection?.includes(o1), "todavía no es del compañero");
    const aviso = (await getMessages()).find((m) => m.giftId === r1.regalo.id && m.kind === "objeto");
    assert.ok(aviso && aviso.to === b.code, "le llega al buzón");
    assert.match(describeMessage(aviso).text, /te quiere regalar/);
    assert.equal((await regalarObjeto(a.code, b.code, o1)).ok, false, "no se puede regalar dos veces");

    // Aceptar: pasa a ser del compañero; a quien regaló le llega el aviso.
    assert.equal((await responderRegalo(a.code, r1.regalo.id, true)).ok, false, "solo responde quien lo recibe");
    const acepta = await responderRegalo(b.code, r1.regalo.id, true);
    assert.ok(acepta.ok && acepta.regalo.estado === "aceptado");
    assert.ok((await getProgress(b.code)).seasonalCollection?.includes(o1), "ahora es del compañero");
    assert.equal((await responderRegalo(b.code, r1.regalo.id, true)).ok, false, "no se acepta dos veces");
    const resp = (await getMessages()).find((m) => m.giftId === r1.regalo.id && m.kind === "objeto-respuesta");
    assert.ok(resp && resp.to === a.code && resp.presetId === "aceptado");
    console.log("✅ Aceptar: el objeto pasa al compañero y a quien regaló le llega el aviso.");

    // Rechazar: vuelve a quien lo regaló.
    const r2 = await regalarObjeto(a.code, b.code, o3);
    assert.ok(r2.ok);
    assert.ok((await responderRegalo(b.code, r2.regalo.id, false)).ok);
    assert.ok((await getProgress(a.code)).seasonalCollection?.includes(o3), "rechazado: vuelve");
    assert.ok(!(await getProgress(b.code)).seasonalCollection?.includes(o3));
    console.log("✅ Rechazar: el objeto vuelve a quien lo regaló.");

    // Sin respuesta en 7 días: vuelve.
    const r3 = await regalarObjeto(a.code, b.code, o4);
    assert.ok(r3.ok);
    await vencerRegalos(new Date(Date.now() + 6 * DIA));
    assert.ok(!(await getProgress(a.code)).seasonalCollection?.includes(o4), "a los 6 días sigue en camino");
    await vencerRegalos(new Date(Date.now() + 7 * DIA + 60_000));
    assert.ok((await getProgress(a.code)).seasonalCollection?.includes(o4), "a los 7 días vuelve");
    assert.equal((await getRegalos()).find((r) => r.id === r3.regalo.id)?.estado, "vencido");
    assert.equal((await responderRegalo(b.code, r3.regalo.id, true)).ok, false, "vencido: ya no se acepta");
    console.log("✅ Sin respuesta en 7 días: vuelve a quien lo regaló.");

    // Lo regalado no se le vuelve a dar solo (premios de temporada, finde, lápiz).
    assert.ok((await getProgress(a.code)).objetosRegalados?.includes(o1), "queda registrado como regalado");
    assert.ok(!(await getProgress(a.code)).objetosRegalados?.includes(o3), "lo que volvió deja de figurar como regalado");
    const evento = getActiveEvents(new Date("2026-10-05T12:00:00-03:00")).find((e) => getEventRewardIds(e.id).length > 0);
    if (evento) {
      const premio = getEventRewardIds(evento.id)[0];
      const base = { code: "X", completedWorlds: [], activityLog: [], coins: 0 };
      const sinRegalar = collectActiveSeasonalRewards({ ...base, seasonalCollection: [] }, new Date("2026-10-05T12:00:00-03:00"));
      assert.ok(sinRegalar.newRewards.includes(premio));
      const regalado = collectActiveSeasonalRewards({ ...base, seasonalCollection: [], objetosRegalados: [premio] }, new Date("2026-10-05T12:00:00-03:00"));
      assert.ok(!regalado.newRewards.includes(premio), "si lo regaló, la temporada no se lo vuelve a dar");
      console.log(`✅ Lo regalado no se «copia»: la temporada (${evento.id}) no se lo vuelve a dar.`);
    }

    // Límite por día.
    assert.ok(MAX_REGALOS_OBJETO_POR_DIA <= 3);
    const r4 = await regalarObjeto(a.code, b.code, o5);
    assert.equal(r4.ok, false, `ya regaló ${MAX_REGALOS_OBJETO_POR_DIA} hoy`);
    console.log("✅ Límite de regalos de objetos por día.");
  } finally {
    fs.copyFileSync(RESPALDO, DB);
    fs.rmSync(RESPALDO, { force: true });
  }
  console.log("🎉 Regalos de objetos: todo OK (base restaurada).");
}

main().catch((e) => {
  console.error("❌", e);
  process.exit(1);
});
