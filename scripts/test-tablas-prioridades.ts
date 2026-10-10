// Pruebas de las tablas para repasar hoy (CL-30): npx tsx scripts/test-tablas-prioridades.ts
import assert from "node:assert/strict";
import type { StudentProgress } from "@/types";
import { prioridadesTablas, sumarPartida } from "@/lib/torneo/prioridades";
import { getMetaTabla, PENALIDAD_ERROR_MS } from "@/lib/torneo/tiempos";

const prog = (over: Partial<StudentProgress> = {}) =>
  ({ code: "T", completedWorlds: [], activityLog: [], coins: 0, ...over }) as StudentProgress;
const HOY = "2026-10-10";

console.log("1. La penalidad es de 2 segundos por error");
assert.equal(PENALIDAD_ERROR_MS, 2000);

console.log("2. Sin partidas: se proponen las primeras tablas, sin jugar");
const vacio = prioridadesTablas(prog(), HOY);
assert.deepEqual(vacio.map((p) => p.tabla), [2, 3, 4]);
assert.ok(vacio.every((p) => p.motivo === "sin-jugar"));

console.log("3. La tabla con más errores va primero; la lenta, después");
let st: StudentProgress["tablasStats"] = undefined;
const rapido = (t: number) => getMetaTabla(t).oroMs - 5000;
for (const t of [2, 3, 4, 5, 6, 7, 8, 9, 10]) st = sumarPartida(st, t, { ms: rapido(t), errores: 0, dia: "2026-10-09" });
// Tabla del 7: 3 errores por partida (con su penalidad incluida en el tiempo).
st = sumarPartida(st, 7, { ms: rapido(7) + 3 * PENALIDAD_ERROR_MS, errores: 3, dia: "2026-10-09" });
st = sumarPartida(st, 7, { ms: rapido(7) + 3 * PENALIDAD_ERROR_MS, errores: 3, dia: "2026-10-09" });
// Tabla del 8: sin errores, pero tarda el doble de la meta de oro.
st = sumarPartida(st, 8, { ms: getMetaTabla(8).oroMs * 2, errores: 0, dia: "2026-10-09" });
st = sumarPartida(st, 8, { ms: getMetaTabla(8).oroMs * 2, errores: 0, dia: "2026-10-09" });
st = sumarPartida(st, 8, { ms: getMetaTabla(8).oroMs * 2, errores: 0, dia: "2026-10-09" });
const p = prioridadesTablas(prog({ tablasStats: st }), HOY);
assert.equal(p[0].tabla, 7);
assert.equal(p[0].motivo, "errores");
assert.equal(p[1].tabla, 8);
assert.equal(p[1].motivo, "tiempo");
assert.ok(p[1].texto.includes("meta de oro"));
assert.ok(!p.some((x) => x.tabla === 2), "las tablas que salen bien no se proponen");

console.log("4. El tiempo se mide sin la penalidad (los errores no cuentan dos veces)");
const sinPen = prioridadesTablas(prog({ tablasStats: sumarPartida(undefined, 5, { ms: rapido(5) + 4 * PENALIDAD_ERROR_MS, errores: 4, dia: HOY }) }), HOY, 9);
const cinco = sinPen.find((x) => x.tabla === 5)!;
assert.equal(cinco.motivo, "errores");
assert.ok(Math.abs((cinco.segundos ?? 0) - rapido(5) / 1000) < 0.01);

console.log("5. Marca las que ya repasó hoy");
const hoy = prioridadesTablas(prog({ tablasStats: sumarPartida(st, 7, { ms: rapido(7), errores: 2, dia: HOY }) }), HOY);
assert.equal(hoy.find((x) => x.tabla === 7)?.hechaHoy, true);
assert.equal(hoy.find((x) => x.tabla === 8)?.hechaHoy, false);

console.log("6. Solo se guardan las últimas 6 partidas de cada tabla");
let muchas: StudentProgress["tablasStats"] = undefined;
for (let i = 0; i < 10; i++) muchas = sumarPartida(muchas, 3, { ms: 30000, errores: i, dia: HOY });
assert.equal(muchas![3].ultimas.length, 6);
assert.equal(muchas![3].partidas, 10);
assert.equal(muchas![3].errores, 45);

console.log("7. Alumnos que jugaron antes: usa los récords semanales");
const viejo = prioridadesTablas(
  prog({ tablasTorneo: { "2026-10-03": { 9: { mejorMs: 90000, medalla: "bronce", errores: 4 } } } }),
  HOY
);
assert.equal(viejo[0].tabla, 9);

console.log("\n✅ Tablas para repasar hoy: todo OK.");
