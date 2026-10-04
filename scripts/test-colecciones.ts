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
for (const t of TEMPORADAS) {
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
assert.ok(!enVenta("halloween", undefined, at("2027-10-10")));
assert.ok(enVenta("halloween", undefined, at("2027-10-18")));
assert.ok(!enVenta("halloween", undefined, at("2027-11-02")));
console.log("✅ Halloween: hasta el 2/11 en 2026; desde 2027, del 18/10 al 1/11");
// Carnaval 2027: lunes 8/2 (Pascua 28/3) → del 1/2 al 15/2.
assert.ok(enVenta("carnaval", undefined, at("2027-02-01")) && enVenta("carnaval", undefined, at("2027-02-15")) && !enVenta("carnaval", undefined, at("2027-02-16")));
console.log("✅ Carnaval (fecha móvil) 2027: del 1/2 al 15/2");
// Vuelve cada año.
assert.ok(enVenta("tradicion", undefined, at("2026-11-10")) && enVenta("tradicion", undefined, at("2027-11-10")) && !enVenta("tradicion", undefined, at("2027-11-18")));
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
