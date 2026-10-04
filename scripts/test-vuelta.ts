// Pruebas de «retomar el mundo donde se dejó» (src/lib/vuelta.ts).
// Uso: npx tsx scripts/test-vuelta.ts
import assert from "node:assert/strict";
import type { StudentProgress } from "../src/types";
import { avanzarVuelta, empezarVuelta, resumenVueltas, saltarEnVuelta, terminarVuelta, vueltaEnCurso } from "../src/lib/vuelta";

const base: StudentProgress = { code: "TEST", completedWorlds: [], activityLog: [], coins: 0 };
const acts = Array.from({ length: 10 }, (_, i) => ({ type: "mc", id: `a${i}`, prompt: `${i}`, choices: ["1", "2"], answerIndex: 0 }));
const t0 = new Date("2026-10-05T15:00:00Z");
const ID = "vuelta-1234";

let p = empezarVuelta(base, 101, ID, acts, t0);
assert.equal(vueltaEnCurso(p, 101, t0), null, "sin respuestas no hay nada que retomar");

p = avanzarVuelta(p, 101, ID, 0, true, undefined, t0);
p = avanzarVuelta(p, 101, ID, 1, true, undefined, t0);
p = avanzarVuelta(p, 101, ID, 2, false, undefined, t0);
const r = vueltaEnCurso(p, 101, t0)!;
assert.equal(r.index, 3, "3 hechas → sigue en la 4.ª");
assert.equal(r.correctCount, 2);
assert.deepEqual(r.activities, acts, "mismas actividades");
console.log("✅ 3 actividades hechas: retoma desde la 4.ª con las mismas actividades");

const dup = avanzarVuelta(p, 101, ID, 2, true, undefined, t0);
assert.equal(dup, p, "respuesta repetida no suma");
assert.equal(avanzarVuelta(p, 101, "otra-vuelta-99", 3, true, undefined, t0), p, "otra vuelta no avanza");
console.log("✅ Respuestas repetidas o de otra vuelta no cuentan");

assert.deepEqual(resumenVueltas(p, t0)[101], { hechas: 3, total: 10 });
console.log("✅ Resumen para el mapa: 3/10");

const tarde = new Date(t0.getTime() + 15 * 86_400_000);
assert.equal(vueltaEnCurso(p, 101, tarde), null, "vence a los 14 días");
console.log("✅ Vence a los 14 días");

assert.equal(terminarVuelta(p, 101).roundsInProgress?.[101], undefined);
console.log("✅ Al terminar la vuelta se borra");

// Cuento: el «listen» se salta sin respuesta y se retoma después de él.
const story = [{ type: "listen" }, ...acts.slice(0, 7)];
let s = empezarVuelta(base, 11103, ID, story, t0);
s = saltarEnVuelta(s, 11103, ID, 0, t0);
s = avanzarVuelta(s, 11103, ID, 1, true, undefined, t0);
assert.equal(vueltaEnCurso(s, 11103, t0)!.index, 2);
assert.deepEqual(resumenVueltas(s, t0)[11103], { hechas: 1, total: 7 });
console.log("✅ Mundos de cuentos: retoma después del cuento");

// Dictado: errores guardados; la vuelta no pasa a la semana siguiente.
let d = empezarVuelta(base, 28001, ID, acts, t0);
d = avanzarVuelta(d, 28001, ID, 0, false, "340", t0);
assert.deepEqual(vueltaEnCurso(d, 28001, t0)!.mistakes, ["340"]);
assert.equal(vueltaEnCurso(d, 28001, new Date(t0.getTime() + 7 * 86_400_000)), null);
console.log("✅ Dictado: guarda errores y no se arrastra a otra semana");

// Tope de mundos a medias.
let m = base;
for (let w = 1; w <= 12; w++) m = avanzarVuelta(empezarVuelta(m, w, ID, acts, new Date(t0.getTime() + w * 1000)), w, ID, 0, true, undefined, new Date(t0.getTime() + w * 1000));
assert.equal(Object.keys(m.roundsInProgress!).length, 8);
assert.ok(m.roundsInProgress![12] && !m.roundsInProgress![1]);
console.log("✅ Como mucho 8 mundos a medias (se descartan los más viejos)");

console.log("\n🎉 Todas las pruebas de vueltas pasaron.");
