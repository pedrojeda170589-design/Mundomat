// Pruebas de las colecciones por temporada (15 días) y de los premios que se
// ganan aprendiendo. Uso: npx tsx scripts/test-colecciones.ts
import assert from "node:assert/strict";
import { TEMPORADAS, DIAS_TEMPORADA, LEGENDARIO_MUNDOS } from "../src/lib/coleccion/temporadas";
import { AVATARES_LOGRO } from "../src/lib/coleccion/logros";
import { CUENTOS } from "../src/lib/cuentos/catalogo";
import { ventanaDe, enVenta, textoContador } from "../src/lib/tiempo-limitado";
import { aplicarPremiosDeMundo } from "../src/lib/coleccion/premios";
import type { StudentProgress } from "../src/types";

const at = (iso: string) => new Date(`${iso}T15:00:00Z`);

// 1. Cada temporada dura 15 días (salvo excepciones) y el calendario 2026-27.
console.log("Calendario de la tienda (desde el 4/10/2026):");
for (const t of TEMPORADAS.filter((x) => !x.pausada)) {
  const v = ventanaDe(t.id, at("2026-10-04"))!;
  assert.ok(v, t.id);
  const largo = Math.round((Date.UTC(v.hasta.year, v.hasta.month - 1, v.hasta.day) - Date.UTC(v.desde.year, v.desde.month - 1, v.desde.day)) / 86400000) + 1;
  const esExcepcion = !!t.excepciones?.[v.desde.year];
  if (!esExcepcion) assert.equal(largo, DIAS_TEMPORADA, `${t.id} dura ${largo}`);
  console.log(`  ${t.emoji} ${t.coleccion.padEnd(34)} ${v.desde.day}/${v.desde.month}/${v.desde.year} → ${v.hasta.day}/${v.hasta.month}  ${textoContador(v)}`);
}
// Halloween: 2026 respeta el 2/11; 2027 vuelve a 15 días (18/10 al 1/11).
assert.ok(enVenta("halloween", undefined, at("2026-10-04")));
assert.ok(enVenta("halloween", undefined, at("2026-11-02")));
assert.ok(!enVenta("halloween", undefined, at("2026-11-03")));
assert.ok(!enVenta("halloween", undefined, at("2027-10-22")));
assert.ok(enVenta("halloween", undefined, at("2027-10-23")));
assert.ok(!enVenta("halloween", undefined, at("2027-11-02")));
console.log("✅ Halloween: hasta el 2/11 en 2026; desde 2027, del 23/10 al 1/11");
// Carnaval 2027: lunes 8/2 (Pascua 28/3) → del 4/2 al 13/2 (10 días).
assert.ok(!enVenta("carnaval", undefined, at("2027-02-03")) && enVenta("carnaval", undefined, at("2027-02-04")) && enVenta("carnaval", undefined, at("2027-02-13")) && !enVenta("carnaval", undefined, at("2027-02-14")));
console.log("✅ Carnaval (fecha móvil) 2027: del 4/2 al 13/2");
// Vuelve cada año.
assert.ok(enVenta("tradicion", undefined, at("2026-11-10")) && enVenta("tradicion", undefined, at("2027-11-10")) && !enVenta("tradicion", undefined, at("2027-11-20")) && !enVenta("tradicion", undefined, at("2027-11-04")));
assert.equal(ventanaDe("animales", at("2026-10-04")), null, "las temporadas en pausa no se venden ni se anuncian");
// Única vez.
assert.ok(enVenta("tradicion", 2026, at("2026-11-10")) && !enVenta("tradicion", 2026, at("2027-11-10")));
console.log("✅ Vuelven cada año; los exclusivos solo el año indicado");

// 2. Un avatar de logro por cada texto de comprensión.
assert.deepEqual(AVATARES_LOGRO.map((l) => l.storyId).sort(), CUENTOS.map((c) => c.id).sort());
console.log(`✅ ${AVATARES_LOGRO.length} avatares de logro, uno por texto`);

// 3. Premios por aprender.
const base: StudentProgress = { code: "T", completedWorlds: [], activityLog: [], coins: 0 };
let r = aplicarPremiosDeMundo(base, 11101, 80, "liebre-tortuga", at("2026-11-10"));
assert.equal(r.progress, base, "con 80 % no hay premio");
r = aplicarPremiosDeMundo(base, 11101, 90, "leyenda-iguazu", at("2026-11-10"));
assert.ok(r.progress.achievementCollection?.includes("logro-leyenda-iguazu"));
assert.ok(r.progress.seasonalCollection?.includes("mini-yaguarete"));
console.log("✅ 90 % en la leyenda del Iguazú → Guardián de la Selva + Mini yaguareté");
let p = base;
for (const w of [1, 1, 2]) p = aplicarPremiosDeMundo(p, w, 95, undefined, at("2026-11-10")).progress;
assert.equal(p.legendaryProgress?.["tradicion-2026"]?.length, 2, "el mismo mundo no cuenta dos veces");
const fin = aplicarPremiosDeMundo(p, 3, 100, undefined, at("2026-11-10"));
assert.deepEqual(fin.premios.legendarios, ["poncho-gran-explorador"]);
console.log(`✅ Legendario: ${LEGENDARIO_MUNDOS} mundos distintos con 90 %+ durante la temporada`);
const fuera = aplicarPremiosDeMundo(base, 5, 100, undefined, at("2027-07-01"));
assert.deepEqual(fuera.premios.legendarios, []);
console.log("\n🎉 Todas las pruebas de colecciones pasaron.");

// 4. Drops: 3/5/7 días, 3 mundos antes de comprar, superespecial solo «al día».
import { dropActivo, estaAlDia, mundosEnDrop, puedeComprarDrop, textoDrop, type Drop } from "../src/lib/coleccion/drops";
const drop: Drop = { id: "prueba", label: "Prueba", emoji: "⚡", desde: "2026-10-10", dias: 3, mundosRequeridos: 3, items: [] };
assert.ok(!dropActivo(drop, new Date("2026-10-10T02:59:00Z")), "antes de la medianoche argentina");
assert.ok(dropActivo(drop, new Date("2026-10-10T03:00:00Z")));
assert.ok(dropActivo(drop, new Date("2026-10-13T02:59:00Z")) && !dropActivo(drop, new Date("2026-10-13T03:00:00Z")));
console.log("✅ Drop de 3 días: del 10/10 0 h al 12/10 24 h (hora argentina) ·", textoDrop(drop, new Date("2026-10-12T20:00:00Z")));
let a: StudentProgress = base;
const t = (h: number) => new Date(Date.UTC(2026, 9, 10, 12 + h));
a = aplicarPremiosDeMundo(a, 1, 95, undefined, t(0)).progress;
a = aplicarPremiosDeMundo(a, 2, 92, undefined, t(1)).progress;
assert.equal(mundosEnDrop(a, drop), 2);
assert.equal(puedeComprarDrop(a, drop, false, t(2)).ok, false);
a = aplicarPremiosDeMundo(a, 3, 100, undefined, t(3)).progress;
assert.equal(puedeComprarDrop(a, drop, false, t(4)).ok, true);
console.log("✅ Se puede comprar recién después de superar 3 mundos durante el drop");
assert.ok(estaAlDia(a, t(5)));
assert.ok(!estaAlDia({ ...a, worldsNeedingTeacherReview: [7] }, t(5)), "con mundos a fortalecer no está al día");
assert.ok(!estaAlDia(a, new Date(Date.UTC(2026, 9, 20))), "a los 10 días ya no");
console.log("✅ «Al día»: 3 mundos en 7 días y nada a fortalecer (ve el superespecial)");
console.log("🎉 Drops OK.");

// 5. Calendario sin superposiciones y con días libres entre ventanas.
import { DROPS as TODOS_DROPS, ventanaDrop } from "../src/lib/coleccion/drops";
{
  const DAY = 86400000;
  const tramos: { id: string; a: number; b: number }[] = [];
  for (let d = Date.UTC(2026, 9, 4); d < Date.UTC(2028, 11, 31); d += DAY) {
    const now = new Date(d + 15 * 3600 * 1000);
    const activos = TEMPORADAS.filter((t) => enVenta(t.id, undefined, now)).map((t) => t.id).concat(TODOS_DROPS.filter((x) => dropActivo(x, now)).map((x) => `drop:${x.id}`));
    assert.ok(activos.length <= 1, `${new Date(d).toISOString().slice(0, 10)}: ${activos.join(", ")}`);
    const id = activos[0];
    const last = tramos[tramos.length - 1];
    if (id && last && last.id === id && last.b === d - DAY) last.b = d;
    else if (id) tramos.push({ id, a: d, b: d });
  }
  for (let i = 1; i < tramos.length; i++) {
    const libres = (tramos[i].a - tramos[i - 1].b) / DAY - 1;
    assert.ok(libres >= 2, `entre ${tramos[i - 1].id} y ${tramos[i].id} hay ${libres} días libres`);
  }
  console.log("✅ Nunca hay dos cosas especiales a la vez y siempre quedan 2+ días libres entre una y otra (2026–2028):");
  for (const t of tramos.filter((x) => x.a < Date.UTC(2027, 3, 1))) console.log(`   ${new Date(t.a).toISOString().slice(5, 10)} → ${new Date(t.b).toISOString().slice(5, 10)}  ${t.id}`);
  void ventanaDrop;
}

// 6. Racha y camino de premios.
import { estadoRacha, registrarRespuesta, reclamarCamino, CAMINO } from "../src/lib/coleccion/racha";
{
  let r: StudentProgress = { ...base };
  const dia = (iso: string, c: number, i: number) => {
    for (let k = 0; k < c; k++) r = registrarRespuesta(r, true, new Date(`${iso}T15:00:00Z`));
    for (let k = 0; k < i; k++) r = registrarRespuesta(r, false, new Date(`${iso}T15:00:00Z`));
  };
  // lun 5/10 a vie 9/10 bien; finde nada; lun 12 bien.
  for (const d of ["2026-10-05", "2026-10-06", "2026-10-07", "2026-10-08", "2026-10-09", "2026-10-12"]) dia(d, 5, 1);
  let e = estadoRacha(r, new Date("2026-10-12T20:00:00Z"));
  assert.equal(e.racha, 6, "el fin de semana no corta");
  assert.equal(e.escudos, 1);
  console.log("✅ Racha: 6 días (el finde no la corta) y 1 escudo a los 5 días");
  // mar 13 falta: usa el escudo; mié 14 vuelve.
  dia("2026-10-14", 5, 0);
  e = estadoRacha(r, new Date("2026-10-14T20:00:00Z"));
  assert.equal(e.racha, 7);
  assert.equal(e.escudos, 0);
  console.log("✅ Un día de escuela sin estudiar usa el escudo 🛡️ y la racha sigue");
  // jue 15 y vie 16 faltan: se corta.
  e = estadoRacha(r, new Date("2026-10-19T20:00:00Z"));
  assert.equal(e.racha, 0);
  assert.equal(e.mejor, 7);
  console.log("✅ Sin escudos, faltar corta la racha (la mejor queda: 7)");
  // Día con pocas actividades o muchos errores no cuenta.
  dia("2026-10-20", 3, 0);
  dia("2026-10-21", 3, 3);
  assert.equal(estadoRacha(r, new Date("2026-10-21T20:00:00Z")).hoyCuenta, false);
  console.log("✅ Un día cuenta solo con 5+ actividades y 60 % bien");
  const { progress: pr, nuevos } = reclamarCamino({ ...r, completedWorlds: [1, 2, 3] }, new Date("2026-10-21T20:00:00Z"));
  assert.deepEqual(nuevos.map((n) => n.id), ["r2", "r3", "m3", "r5", "r7"]);
  assert.equal(pr.coins, base.coins + 10 + 25);
  assert.ok(pr.seasonalCollection?.includes("vincha-estrellas"));
  assert.deepEqual(reclamarCamino(pr, new Date("2026-10-21T20:00:00Z")).nuevos, [], "no se entrega dos veces");
  console.log(`✅ Camino: ${CAMINO.length} paradas; con mejor racha 7 y 3 mundos se entregan r2, r3, m3, r5 y r7 (una sola vez)`);
}
console.log("🎉 Calendario y racha OK.");
