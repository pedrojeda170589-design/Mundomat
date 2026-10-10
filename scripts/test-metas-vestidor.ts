// Pruebas de las metas especiales y del vestidor (CL-33): npx tsx scripts/test-metas-vestidor.ts
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import type { StudentProgress } from "@/types";
import { AVATAR_OPTIONS, canUseAvatar, getAccessoryById } from "@/types";
import { METAS } from "@/lib/coleccion/metasDatos";
import { avanceMetas, diasSuper, etapasSuperadas, reclamarMetas } from "@/lib/coleccion/metas";
import { MODULOS } from "@/lib/mapa/modulos";
import { GRADE1_WORLDS } from "@/lib/grade1/worlds";
import { CUERPOS, PRENDAS, prendasDe, validarVestimenta } from "@/lib/vestidor/catalogo";

const prog = (over: Partial<StudentProgress> = {}) =>
  ({ code: "T", completedWorlds: [], activityLog: [], coins: 0, ...over }) as StudentProgress;

console.log("1. Etapas: módulos completos (3.º/4.º) y grupos de 4 mundos (1.º/2.º)");
assert.equal(etapasSuperadas(prog()), 0);
const mod = MODULOS[3]!.matematica![0];
assert.equal(etapasSuperadas(prog({ completedWorlds: mod.mundos })), 1);
assert.equal(etapasSuperadas(prog({ completedWorlds: mod.mundos.slice(1) })), 0);
const g1 = GRADE1_WORLDS.filter((w) => w.subject === "lengua" && w.kind !== "dictado" && w.kind !== "refuerzo").slice(0, 4).map((w) => w.id);
assert.equal(etapasSuperadas(prog({ completedWorlds: g1 })), 1);

console.log("2. Días súper: 20 actividades o más con 60 % de aciertos");
const dias = { "2026-10-01": { c: 15, i: 5 }, "2026-10-02": { c: 10, i: 15 }, "2026-10-03": { c: 30, i: 2 } };
assert.equal(diasSuper(prog({ diasEstudio: dias })), 2);
assert.equal(diasSuper(prog({ diasEstudio: {}, diasSuperContados: 4 })), 4, "no se pierden al borrar días viejos");

console.log("3. Se entregan solas y una sola vez");
const p0 = prog({ diasEstudio: dias, completedWorlds: mod.mundos });
const r1 = reclamarMetas(p0);
const ids = r1.nuevas.map((m) => m.id).sort();
assert.deepEqual(ids, ["d1", "d2", "e1"]);
assert.ok(r1.progress.seasonalCollection?.includes("libro-brillante"));
assert.ok(r1.progress.prendas?.includes("botines"));
assert.ok(r1.progress.prendas?.includes("gorro-pompon"));
assert.equal(reclamarMetas(r1.progress).nuevas.length, 0);
assert.equal(avanceMetas(r1.progress).diasSuper, 2);

console.log("4. Los avatares de las metas se ganan (no se pueden elegir sin ganarlos)");
for (const m of METAS) {
  if (m.premio.tipo !== "avatar") continue;
  if (!AVATAR_OPTIONS.includes(m.premio.id)) continue; // todavía sin imagen
  assert.equal(canUseAvatar(m.premio.id, [], []), false);
  assert.equal(canUseAvatar(m.premio.id, [], [m.premio.id]), true);
}

console.log("5. Cada premio de meta existe (prenda del vestidor, objeto con imagen o avatar)");
for (const m of METAS) {
  if (m.premio.tipo === "prenda") assert.ok(PRENDAS.some((p) => p.id === m.premio.id), `prenda ${m.premio.id}`);
  if (m.premio.tipo === "objeto" && getAccessoryById(m.premio.id)) assert.equal(getAccessoryById(m.premio.id)!.slot, m.premio.slot);
}
const ids2 = METAS.map((m) => m.id);
assert.equal(new Set(ids2).size, ids2.length, "ids de metas repetidos");

console.log("6. Vestidor: imágenes de todos los cuerpos y prendas");
const pub = (r: string) => path.join(process.cwd(), "public", r);
for (const c of CUERPOS) assert.ok(fs.existsSync(pub(`theme/vestidor/cuerpos/${c.id}.png`)), `falta cuerpo ${c.id}`);
for (const p of PRENDAS) {
  assert.ok(fs.existsSync(pub(`theme/vestidor/prendas/${p.id}.png`)), `falta prenda ${p.id}`);
  assert.ok(fs.existsSync(pub(`theme/vestidor/prendas/${p.id}-mini.png`)), `falta mini ${p.id}`);
  assert.ok(p.regalo || p.precio || METAS.some((m) => m.premio.tipo === "prenda" && m.premio.id === p.id), `${p.id}: ni regalo, ni precio, ni meta`);
}

console.log("7. Vestidor: solo cuerpos que existen y prendas que tiene, cada una en su zona");
const tiene = prendasDe(prog());
assert.ok(tiene.includes("remera-roja") && tiene.includes("guardapolvo"));
assert.equal(validarVestimenta({ cuerpo: "nena-a", puesto: { arriba: "remera-roja", abajo: "jean" } }, tiene).ok, true);
assert.equal(validarVestimenta({ cuerpo: "dragon", puesto: {} }, tiene).ok, false);
assert.equal(validarVestimenta({ cuerpo: "nene-a", puesto: { abajo: "remera-roja" } }, tiene).ok, false, "prenda en otra zona");
const sinComprar = validarVestimenta({ cuerpo: "nene-a", puesto: { arriba: "buzo-guarda" } }, tiene);
assert.equal(sinComprar.ok, false);
assert.equal(validarVestimenta({ cuerpo: "nene-a", puesto: { arriba: "buzo-guarda" } }, prendasDe(prog({ prendas: ["buzo-guarda"] }))).ok, true);

console.log("\n✅ Metas especiales y vestidor: todo OK.");
