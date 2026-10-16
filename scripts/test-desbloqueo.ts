// Pruebas del desbloqueo en orden (src/lib/desbloqueo.ts).
// npx tsx scripts/test-desbloqueo.ts
import assert from "node:assert/strict";
import type { StudentProgress, WorldDef } from "@/types";
import { mundoQueFalta, PCT_PARA_ABRIR } from "@/lib/desbloqueo";
import { WORLDS } from "@/lib/worlds";

const w = (id: number, subject: WorldDef["subject"], kind?: WorldDef["kind"]) =>
  ({ id, subject, kind, name: `Mundo ${id}` }) as WorldDef;
const prog = (over: Partial<StudentProgress> = {}): StudentProgress =>
  ({ code: "TEST1", completedWorlds: [], activityLog: [], coins: 0, ...over }) as StudentProgress;

const mundos = [
  w(1, "matematica"),
  w(2, "matematica"),
  w(3, "matematica"),
  w(4, "matematica", "refuerzo"),
  w(5, "matematica"),
  w(10, "lengua"),
  w(11, "lengua"),
];
const todos = mundos.map((m) => m.id);
const falta = (id: number, p: StudentProgress, hab = todos) =>
  mundoQueFalta(mundos.find((m) => m.id === id)!, mundos, hab, p)?.id ?? null;

assert.equal(PCT_PARA_ABRIR, 80);

// Alumno nuevo: solo el primero de cada materia.
let p = prog();
assert.equal(falta(1, p), null, "el primero de matemática está abierto");
assert.equal(falta(2, p), 1, "el segundo espera al primero");
assert.equal(falta(10, p), null, "el primero de lengua está abierto");
assert.equal(falta(11, p), 10);
console.log("✓ alumno nuevo: abre el primero de cada materia");

// 79 % no alcanza; 80 % sí (mejor puntaje o último).
p = prog({ bestWorldScore: { 1: 79 }, lastWorldAttemptScore: { 1: 79 } });
assert.equal(falta(2, p), 1, "79 % no abre");
p = prog({ bestWorldScore: { 1: 80 }, lastWorldAttemptScore: { 1: 50 } });
assert.equal(falta(2, p), null, "con 80 % de mejor puntaje abre, aunque el último sea 50");
p = prog({ lastWorldAttemptScore: { 1: 85 } });
assert.equal(falta(2, p), null, "alumno viejo sin mejor puntaje guardado: cuenta el último");
assert.equal(falta(3, p), 2, "abre de a uno");
console.log("✓ 80 % abre el siguiente; 79 % no");

// Superado (completedWorlds) abre aunque no haya puntaje.
p = prog({ completedWorlds: [1, 2] });
assert.equal(falta(3, p), null);
console.log("✓ un mundo superado abre el siguiente");

// El refuerzo no entra en la fila: el 5 depende del 3.
p = prog({ completedWorlds: [1, 2] });
assert.equal(falta(4, p), null, "el refuerzo no se bloquea por orden");
assert.equal(falta(5, p), 3, "el 5 espera al 3 (se saltea el refuerzo)");
console.log("✓ los refuerzos no cuentan");

// Mundo no habilitado por el docente: se saltea.
p = prog({ completedWorlds: [1] });
assert.equal(falta(3, p, [1, 3, 5, 10, 11]), null, "sin el 2 habilitado, el 3 depende del 1");
console.log("✓ los mundos que el docente no habilitó se saltean");

// Lo que ya empezó o jugó no se le quita.
p = prog({ lastWorldAttemptScore: { 3: 40 } });
assert.equal(falta(3, p), null, "ya jugó el 3: queda abierto");
p = prog({ roundsResume: { 2: { hechas: 3, total: 8 } } });
assert.equal(falta(2, p), null, "vuelta empezada en el 2: queda abierto");
console.log("✓ lo ya empezado queda abierto");

// Con los mundos reales de 3.º: alumno nuevo con todo habilitado → 1 abierto por materia.
const habilitados3 = WORLDS.map((m) => m.id);
const abiertos = WORLDS.filter((m) => !mundoQueFalta(m, WORLDS, habilitados3, prog()));
const porMateria = new Map<string, number>();
for (const m of abiertos.filter((x) => x.kind !== "refuerzo" && x.kind !== "dictado")) {
  porMateria.set(m.subject, (porMateria.get(m.subject) ?? 0) + 1);
}
for (const [materia, n] of porMateria) assert.equal(n, 1, `${materia}: un solo mundo abierto al empezar`);
console.log(`✓ 3.º real: un mundo abierto por materia (${[...porMateria.keys()].join(", ")})`);

console.log("\n✅ Desbloqueo en orden: todo OK.");
