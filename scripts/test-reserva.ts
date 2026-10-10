// Pruebas de la Reserva y expedición patagónica (CL-36): npx tsx scripts/test-reserva.ts
// Con IMAGENES=1 además exige que estén todas las ilustraciones.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import type { StudentProgress } from "@/types";
import { ETAPAS, ESPECIES, OBJETOS, EMBLEMAS, PREMIO_SANTA_CRUZ, armarVuelta, registrarVuelta, etapaAbierta, proximaEtapa, debeMostrarReserva, premiosDeEtapa, enPeligro, MINIMO_PARA_SUPERAR } from "@/lib/reserva";
import { BANCOS } from "@/lib/reserva/preguntas";
import { MAPA } from "@/lib/reserva/mapaDatos";
import { rutaPostal, rutaPremio } from "@/lib/reserva/arte";
import { usarEventosConfig } from "@/lib/eventos/config";

const prog = (over: Partial<StudentProgress> = {}) => ({ code: "T", completedWorlds: [], activityLog: [], coins: 0, ...over }) as StudentProgress;
let n = 0;
const ok = (m: string) => { n++; console.log("✓", m); };

// Orden confirmado por Pedro (10/10/2026).
assert.deepEqual(ETAPAS.slice(0, 7).map((e) => e.territorio), ["rio-chico", "lago-buenos-aires", "deseado", "magallanes", "corpen-aike", "lago-argentino", "guer-aike"]);
assert.deepEqual(ETAPAS.slice(7).map((e) => e.territorio), ["tierra-del-fuego", "chubut", "rio-negro", "neuquen"]);
ok("orden de la expedición: Río Chico primero, después la Patagonia");

const ids = new Set<string>();
for (const e of ETAPAS) {
  assert.ok(MAPA.departamentos.some((d) => d.id === e.territorio) || MAPA.provincias.some((p) => p.id === e.territorio && p.patagonia), e.territorio);
  for (const l of e.localidades) assert.ok(MAPA.localidades.some((x) => x.id === l), l);
  assert.equal(ESPECIES.find((x) => x.id === e.animal)?.tipo, "animal", e.animal);
  assert.equal(ESPECIES.find((x) => x.id === e.planta)?.tipo, "planta", e.planta);
  assert.ok(OBJETOS.some((x) => x.id === e.objeto), e.objeto);
  assert.ok(EMBLEMAS.some((x) => x.id === e.emblema), e.emblema);
  for (const p of premiosDeEtapa(e)) { assert.ok(!ids.has(p), `premio repetido ${p}`); ids.add(p); }
  assert.ok(e.datos.length >= 3, `datos de ${e.nombre}`);
}
assert.deepEqual(PREMIO_SANTA_CRUZ, ["medalla-santa-cruz"]);
ok("cada etapa tiene territorio, localidades, animal, planta, objeto y símbolo propios");

for (const e of ESPECIES) {
  for (const k of ["alimentacion", "habitat", "comportamiento", "poblacion", "conservacion", "curioso", "dondeVerlo", "fuente"] as const) assert.ok(e[k].length > 10, `${e.id}.${k}`);
}
assert.ok(enPeligro("CR") && enPeligro("EN") && !enPeligro("VU") && !enPeligro("LC"));
const peligro = ESPECIES.filter((e) => enPeligro(e.categoria)).map((e) => e.id).sort();
assert.deepEqual(peligro, ["alerce", "cauquen-colorado", "gato-andino", "huemul", "huillin", "maca-tobiano", "pehuen"]);
ok(`fichas completas con fuente; distintivo «en peligro» en ${peligro.length} especies`);

// Bancos: una sola correcta, sin opciones repetidas, sin fugas en la pista.
let total = 0, largaMas = 0, cortaMas = 0, mcs = 0;
const vistos = new Set<string>();
for (const e of ETAPAS) {
  const b = BANCOS[e.n];
  assert.ok(b.length >= 12, `banco ${e.n} tiene ${b.length}`);
  assert.equal(b.filter((a) => a.type === "mapa").length, 1);
  for (const a of b) {
    total++;
    assert.ok(!vistos.has(a.id), `id repetido ${a.id}`); vistos.add(a.id);
    assert.ok(a.hint.startsWith("Pista: ") && a.hint.length > 15, a.id);
    if (a.type === "mapa") assert.equal(a.respuesta, e.territorio, a.id);
    if (a.type === "mc") {
      mcs++;
      assert.equal(new Set(a.choices).size, 3, a.id);
      const correcta = a.choices[a.answerIndex];
      const largos = a.choices.map((c) => c.length);
      if (correcta.length === Math.max(...largos) && largos.filter((x) => x === correcta.length).length === 1) largaMas++;
      if (correcta.length === Math.min(...largos) && largos.filter((x) => x === correcta.length).length === 1) cortaMas++;
      // Fuga: la pista trae todas las palabras propias de la correcta (las que
      // no aparecen en las otras opciones).
      const pal = (t: string) => t.toLowerCase().split(/[^a-záéíóúüñ0-9.]+/).filter((w) => w.length >= 4);
      const otras = new Set(a.choices.filter((_, i) => i !== a.answerIndex).flatMap(pal));
      const propias = pal(correcta).filter((w) => !otras.has(w));
      const hint = pal(a.hint);
      const fuga = propias.length > 0 && propias.every((w) => hint.includes(w));
      assert.ok(!fuga, `la pista de ${a.id} regala la respuesta`);
      for (const c of a.choices) assert.ok(c.split(/\s+/).length <= 12, `opción larga en ${a.id}`);
    }
  }
}
console.log(`   ${total} actividades; la correcta es la más larga en ${Math.round((100 * largaMas) / mcs)} % y la más corta en ${Math.round((100 * cortaMas) / mcs)} % de las de opción múltiple`);
assert.ok(largaMas / mcs < 0.5, "la correcta es demasiadas veces la más larga");
ok("bancos sin respuestas repetidas ni pistas que regalan");

for (const e of ETAPAS) {
  for (let i = 0; i < 100; i++) {
    const v = armarVuelta(e.n);
    assert.equal(v.length, 8);
    assert.equal(v[0].type, "mapa");
    assert.equal(new Set(v.map((a) => a.id)).size, 8);
    assert.ok(v.filter((a) => a.type === "classify").length <= 1);
    for (const a of v) if (a.type === "mc") assert.ok(a.answerIndex >= 0 && a.answerIndex < 3);
  }
}
ok("cada vuelta: 8 actividades distintas, empieza con el mapa");

// Progreso y premios.
let p = prog();
assert.ok(etapaAbierta(p, 1) && !etapaAbierta(p, 2));
let r = registrarVuelta(p, 1, MINIMO_PARA_SUPERAR - 1);
assert.equal(r.superada, false); assert.deepEqual(r.premios, []);
p = r.nextProgress;
assert.ok(!etapaAbierta(p, 2));
r = registrarVuelta(p, 1, 9);
assert.equal(r.superada, true); assert.equal(r.primeraVez, true);
assert.deepEqual(r.premios, ["huemul", "calafate", "boleadoras", "bandera-santa-cruz"]);
p = r.nextProgress;
assert.equal(p.reserva?.etapas[1].mejor, 8, "se limita a 8");
r = registrarVuelta(p, 1, 7);
assert.deepEqual(r.premios, []); assert.equal(r.primeraVez, false);
assert.equal(r.nextProgress.reserva?.etapas[1].mejor, 8, "guarda el mejor");
assert.ok(etapaAbierta(p, 2) && !etapaAbierta(p, 3));
ok("se supera con 6 de 8, da sus 4 premios una sola vez y abre la siguiente");

for (let k = 2; k <= 6; k++) p = registrarVuelta(p, k, 6).nextProgress;
assert.ok(!p.reserva!.coleccion.includes("medalla-santa-cruz"));
r = registrarVuelta(p, 7, 8);
assert.ok(r.premios.includes("medalla-santa-cruz") && r.premios.includes("escudo-santa-cruz"), "medalla y escudo de Santa Cruz");
p = r.nextProgress;
assert.equal(proximaEtapa(p), 8);
for (let k = 8; k <= 11; k++) p = registrarVuelta(p, k, 6).nextProgress;
assert.equal(proximaEtapa(p), null);
assert.equal(p.reserva!.coleccion.length, ETAPAS.length * 4 + 1);
ok("con los 7 departamentos: la medalla de Santa Cruz; al final, 45 premios");

usarEventosConfig({});
assert.ok(debeMostrarReserva({ grade: 3 }) && debeMostrarReserva({ grade: 4 }));
assert.ok(!debeMostrarReserva({ grade: 2 }) && !debeMostrarReserva({ grade: 5 }));
usarEventosConfig({ "reserva-patagonica": { modo: "apagado" } });
assert.ok(!debeMostrarReserva({ grade: 3 }));
usarEventosConfig({ "reserva-patagonica": { modo: "siempre", grados: [5] } });
assert.ok(debeMostrarReserva({ grade: 5 }) && !debeMostrarReserva({ grade: 3 }));
usarEventosConfig({});
ok("aparece en 3.º y 4.º y se configura desde «Desafíos y eventos»");

const faltan: string[] = [];
const pub = (r: string) => path.join(process.cwd(), "public", r);
for (const e of ETAPAS) if (!fs.existsSync(pub(rutaPostal(e.territorio)))) faltan.push(rutaPostal(e.territorio));
for (const id of ids) if (!fs.existsSync(pub(rutaPremio(id)))) faltan.push(rutaPremio(id));
for (const id of PREMIO_SANTA_CRUZ) if (!fs.existsSync(pub(rutaPremio(id)))) faltan.push(rutaPremio(id));
// Escudos municipales que todavía no tienen archivo oficial (se ve el escudo genérico).
const sinArchivo = EMBLEMAS.filter((m) => !m.fuente).map((m) => rutaPremio(m.id));
if (process.env.IMAGENES) assert.deepEqual(faltan.filter((f) => !sinArchivo.includes(f)), [], "faltan ilustraciones");
console.log(faltan.length ? `   (faltan ${faltan.length} ilustraciones; se ve el emoji)` : "   todas las ilustraciones están");
ok("ilustraciones");

console.log(`\n${n} pruebas de la reserva patagónica OK`);
