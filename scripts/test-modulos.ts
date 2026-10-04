// Comprueba los módulos del mapa: todos los mundos de cada materia están en
// un módulo, sin repetirse, y los tramos cubren el mapa en orden.
import assert from "node:assert/strict";
import { GRADES } from "@/lib/grades";
import { LUGARES, MODULOS, tramosDelMapa, tramoActual, profeDelMundo } from "@/lib/mapa/modulos";
import type { WorldSubject } from "@/types";

for (const l of Object.values(LUGARES)) l.listo = true; // para probar los tramos
let n = 0;
for (const [g, porMateria] of Object.entries(MODULOS)) {
  const grado = Object.values(GRADES).find((x) => x.grade === Number(g))!;
  for (const [subject, mods] of Object.entries(porMateria) as [WorldSubject, typeof porMateria.matematica][]) {
    const mundos = grado.worlds.filter((w) => w.subject === subject);
    const ids = mods!.flatMap((m) => m.mundos);
    assert.equal(new Set(ids).size, ids.length, `${g} ${subject}: mundo repetido en módulos`);
    for (const w of mundos) assert.ok(ids.includes(w.id), `${g} ${subject}: falta el mundo ${w.id} ${w.name}`);
    for (const id of ids) assert.ok(mundos.some((w) => w.id === id), `${g} ${subject}: el id ${id} no existe`);
    const tramos = tramosDelMapa(Number(g), subject, mundos);
    assert.equal(tramos.length, mods!.length);
    assert.equal(tramos[0].desde, 0);
    assert.equal(tramos[tramos.length - 1].hasta, mundos.length - 1);
    tramos.slice(1).forEach((t, i) => assert.equal(t.desde, tramos[i].hasta + 1));
    assert.equal(tramoActual(tramos, mundos, [])?.numero, 1);
    assert.equal(tramoActual(tramos, mundos, mundos.map((w) => w.id))?.numero, tramos.length);
    mundos.forEach((w) => assert.ok(profeDelMundo(w)));
    n++;
  }
}
// Sin imágenes listas, el mapa sigue como siempre.
for (const l of Object.values(LUGARES)) l.listo = false;
assert.equal(tramosDelMapa(3, "matematica", GRADES[3]?.worlds ?? Object.values(GRADES).find((x) => x.grade === 3)!.worlds).length, 0);
console.log(`✅ módulos del mapa: ${n} materias comprobadas`);
