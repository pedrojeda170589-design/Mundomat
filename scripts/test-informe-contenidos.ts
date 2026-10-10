// Pruebas del informe por contenidos (CL-29): npx tsx scripts/test-informe-contenidos.ts
import assert from "node:assert/strict";
import type { StudentProgress, Student } from "@/types";
import { getGrade } from "@/lib/grades";
import { estadoDeContenido, informeDelAlumno, prioridadesDelCurso } from "@/lib/informeContenidos";

function prog(over: Partial<StudentProgress> = {}): StudentProgress {
  return { code: "T", completedWorlds: [], activityLog: [], coins: 0, ...over } as StudentProgress;
}
const act = (worldId: number, ok: boolean) => ({
  worldId,
  activityIndex: 0,
  correct: ok ? 1 : 0,
  incorrect: ok ? 0 : 1,
  timeSpentSeconds: 10,
  finishedAt: "2026-10-01T10:00:00Z",
});

console.log("1. Sin jugar → sin trabajar");
assert.equal(estadoDeContenido(prog(), 1, 90).estado, "sin-trabajar");

console.log("2. Pocas respuestas y malas → todavía en desarrollo (no alcanza para decir que cuesta)");
assert.equal(estadoDeContenido(prog({ activityLog: [act(1, false), act(1, false)] }), 1, 90).estado, "en-desarrollo");

console.log("3. Muchas respuestas, menos del 60 % → a reforzar");
const malo = prog({ activityLog: [act(1, false), act(1, false), act(1, true), act(1, false), act(1, false)] });
assert.equal(estadoDeContenido(malo, 1, 90).estado, "a-reforzar");

console.log("4. Completado y bien → fortaleza; completado pero lo último mal → en desarrollo");
assert.equal(estadoDeContenido(prog({ completedWorlds: [1], activityLog: [act(1, true), act(1, true), act(1, true), act(1, true)] }), 1, 90).estado, "fortaleza");
assert.equal(
  estadoDeContenido(prog({ completedWorlds: [1], activityLog: [act(1, true), act(1, false), act(1, false), act(1, true), act(1, false)] }), 1, 90).estado,
  "a-reforzar"
);
assert.equal(
  estadoDeContenido(prog({ completedWorlds: [1], activityLog: [act(1, true), act(1, true), act(1, false), act(1, true), act(1, false)] }), 1, 90).estado,
  "en-desarrollo"
);

console.log("5. Marcado por el sistema para revisar → a reforzar; lo reciente pesa más que lo viejo");
assert.equal(estadoDeContenido(prog({ worldsNeedingTeacherReview: [1], lastWorldAttemptScore: { 1: 70 } }), 1, 90).estado, "a-reforzar");
const mejoro = prog({
  activitySummary: { 1: { correct: 2, incorrect: 20, timeSpentSeconds: 0 } },
  activityLog: Array.from({ length: 10 }, () => act(1, true)),
});
assert.equal(estadoDeContenido(mejoro, 1, 90).estado, "en-desarrollo");

console.log("6. Todos los grados tienen contenidos para el informe (sin zonas ni dictado)");
for (const g of [1, 2, 3, 4]) {
  const def = getGrade(g, { borradores: true });
  const items = informeDelAlumno(prog(), def.worlds, def.masteryPct);
  assert.ok(items.length > 10, `${g}.º sin contenidos`);
}
const g3 = getGrade(3);
assert.equal(informeDelAlumno(prog(), g3.worlds, 90, [1, 2]).length, 2, "solo lo habilitado cuenta como sin trabajar");

console.log("7. Prioridades del curso: primero lo que más alumnos necesitan reforzar");
const alumnos = ["A", "B", "C"].map((code) => ({ code, name: code }) as Student);
const pm: Record<string, StudentProgress> = {
  A: malo,
  B: prog({ activityLog: [act(1, false), act(1, false), act(1, false), act(1, false), act(2, false), act(2, false), act(2, false), act(2, false)] }),
  C: prog({ completedWorlds: [2], activityLog: [act(2, true), act(2, true), act(2, true), act(2, true)] }),
};
const pr = prioridadesDelCurso(alumnos, pm, g3.worlds, 90);
assert.equal(pr[0].worldId, 1);
assert.equal(pr[0].aReforzar, 2);
assert.deepEqual(pr[0].quienes, ["A", "B"]);
assert.equal(pr[1].worldId, 2);
assert.equal(pr[1].trabajaron, 2);

console.log("\n✅ Informe por contenidos: todo OK.");
