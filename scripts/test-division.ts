// Mundo 8 «El Valle de los Repartos» con la metodología de Pedro: comprueba
// 2000 vueltas (respuestas correctas presentes, cuentas bien, sin repetir
// opciones, divisiones exactas donde corresponde).
import assert from "node:assert/strict";
import { buildActivitiesForWorld, repasoTablasActivo, actividadRepasoTablas } from "../src/lib/activities";
import { GRADE1_WORLDS } from "../src/lib/grade1/worlds";
import { GRADE4_WORLDS } from "../src/lib/grade4/worlds";
import { WORLDS } from "../src/lib/worlds";

const mundo = WORLDS.find((w) => w.id === 8)!;
assert.equal(mundo.category, "reparto");
for (let v = 0; v < 2000; v++) {
  const acts = buildActivitiesForWorld(mundo);
  assert.equal(acts.length, 10);
  const tipos = new Set(acts.map((a) => a.type));
  assert.ok(tipos.has("pitagorica") && tipos.has("reparto"), "debe tener tabla pitagórica y cajitas");
  for (const a of acts) {
    if (a.type === "mc" || a.type === "find-error") {
      assert.equal(new Set(a.choices).size, a.choices.length, `opciones repetidas en ${a.id}`);
      assert.ok(a.answerIndex >= 0 && a.answerIndex < a.choices.length, `respuesta fuera de rango en ${a.id}`);
    }
    if (a.type === "find-error") assert.ok(a.choices[a.answerIndex].startsWith("Está mal"));
    if (a.type === "pitagorica") assert.ok(a.fila >= 2 && a.fila <= 10 && a.columna >= 2 && a.columna <= 10);
    if (a.type === "reparto") {
      assert.ok(a.cajas >= 2 && a.total >= a.cajas);
      if (a.id === "rep-cajitas") assert.equal(a.total % a.cajas, 0);
      if (a.id === "rep-sobra") assert.ok(a.total % a.cajas > 0);
    }
    if (a.type === "mc" && a.id === "rep-familia") {
      const [x, y, z] = a.choices[a.answerIndex].match(/\d+/g)!.map(Number);
      assert.equal(x / y, z);
    }
    if (a.type === "input" && a.id === "rep-particion") {
      const [tot, g] = a.prompt.match(/\d+/g)!.map(Number);
      assert.equal(tot / g, a.answer);
    }
  }
}
console.log("✅ Mundo 8 (división con la metodología de Pedro): 2000 vueltas OK.");

// Mundos 5 a 7 (tablas): tabla pitagórica y regularidades.
for (const id of [5, 6, 7]) {
  const w = WORLDS.find((x) => x.id === id)!;
  for (let v = 0; v < 1000; v++) {
    const acts = buildActivitiesForWorld(w);
    assert.equal(acts[0].type, "pitagorica");
    for (const a of acts) {
      if (a.type === "mc") {
        assert.equal(new Set(a.choices).size, a.choices.length);
        if (a.prompt.includes("tabla del 9?")) {
          const buenas = a.choices.filter((c) => Number(c) % 9 === 0);
          assert.deepEqual(buenas, [a.choices[a.answerIndex]], "una sola de la tabla del 9");
        }
        if (a.prompt.includes("tabla del 5?")) assert.equal(a.choices.filter((c) => /[05]$/.test(c)).length, 1);
        if (a.prompt.includes("tabla del 10?")) assert.equal(a.choices.filter((c) => /0$/.test(c)).length, 1);
      }
    }
  }
}
console.log("✅ Mundos 5 a 7: tabla pitagórica y regularidades OK.");

// Repaso de las tablas: desde julio de 3.º; en 4.º en adelante, todo el año.
{
  const mayo = new Date("2026-05-15T12:00:00-03:00");
  const julio = new Date("2026-07-01T09:00:00-03:00");
  const mundo1 = WORLDS.find((w) => w.id === 1)!; // 3.º, números
  assert.equal(repasoTablasActivo(mundo1, mayo), false, "3.º antes de julio: no");
  assert.equal(repasoTablasActivo(mundo1, julio), true, "3.º desde julio: sí");
  assert.equal(repasoTablasActivo(WORLDS.find((w) => w.id === 15)!, julio), false, "solo en Matemática (no en Lengua)");
  for (const w of WORLDS.filter((x) => x.subject !== "matematica")) assert.equal(repasoTablasActivo(w, julio), false, `no en ${w.subject}`);
  assert.equal(repasoTablasActivo(WORLDS.find((w) => w.id === 5)!, julio), false, "los mundos de tablas ya son de tablas");
  assert.equal(repasoTablasActivo(WORLDS.find((w) => w.storyId)!, julio), false, "no en los cuentos");
  assert.equal(repasoTablasActivo(GRADE1_WORLDS[0], julio), false, "1.º nunca");
  assert.equal(repasoTablasActivo(GRADE4_WORLDS.find((w) => w.subject === "matematica")!, mayo), true, "4.º todo el año (Matemática)");
  assert.equal(repasoTablasActivo(GRADE4_WORLDS.find((w) => w.subject === "naturales")!, mayo), false, "4.º: no en Naturales");
  // Aparece a veces (no siempre), nunca primera ni última.
  let con = 0;
  for (let v = 0; v < 2000; v++) {
    const acts = buildActivitiesForWorld(mundo1, julio);
    const i = acts.findIndex((a) => a.id === "repaso-tablas");
    if (i >= 0) {
      con++;
      assert.ok(i > 0 && i < acts.length - 1);
    }
    assert.ok(buildActivitiesForWorld(mundo1, mayo).every((a) => a.id !== "repaso-tablas"));
  }
  assert.ok(con > 600 && con < 1000, `aparece en ~40 % de las vueltas (salió ${con}/2000)`);
  for (let v = 0; v < 3000; v++) {
    const a = actividadRepasoTablas(v % 2 ? 3 : 6);
    if (a.type === "pitagorica") assert.ok(a.fila >= 2 && a.fila <= 10 && a.columna >= 2 && a.columna <= 10);
    if (a.type === "mc") {
      assert.equal(new Set(a.choices).size, a.choices.length);
      const [x, y] = a.prompt.match(/(\d+) × (\d+)/)!.slice(1).map(Number);
      assert.equal(Number(a.choices[a.answerIndex]), x * y);
    }
  }
  console.log(`✅ Repaso de las tablas: desde julio de 3.º y siempre desde 4.º (${con}/2000 vueltas).`);
}
