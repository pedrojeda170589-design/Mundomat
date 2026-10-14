// Pruebas de la explicación de errores del dictado (CL-45): npx tsx scripts/test-dictado-diferencias.ts
import assert from "node:assert/strict";
import { diferencias, textoDePartes } from "@/lib/dictado/diferencias";

const casos: ["palabra" | "oracion", string, string, RegExp][] = [
  ["palabra", "pinguino", "pingüino", /diéresis/],
  ["palabra", "guardaparqe", "guardaparque", /«q» siempre va «u»/],
  ["palabra", "bieje", "viaje", /Va con «v», no con «b»/],
  ["palabra", "uevo", "huevo", /faltó la «h»/],
  ["palabra", "cormoran", "cormorán", /tilde en la «á»/],
  ["palabra", "gora", "gorra", /rr/],
  ["palabra", "piedrabuena", "Piedrabuena", /mayúscula/],
  ["palabra", "tanbien", "también", /Va con «m», no con «n»/],
  ["palabra", "botela", "botella", /ll/],
  ["palabra", "lobomarino", "lobo marino", /separadas/],
  ["palabra", "casa", "sendero", /la palabra es «sendero»/],
  ["palabra", "", "meseta", /No escribiste nada/],
  ["oracion", "el perro corre por el parqe", "El perro corre por el parque.", /mayúscula/],
  ["oracion", "Que lindo dia!", "¡Qué lindo día!", /«¡»/],
  ["oracion", "La ballena salta en el mar.", "La gran ballena salta en el mar.", /faltó la palabra «gran»/],
];
for (const [k, u, e, re] of casos) {
  const d = diferencias(k, u, e);
  assert.equal(textoDePartes(d.partes), e, `partes de ${u}`);
  assert.ok(d.explicaciones.some((x) => re.test(x)), `${u} → ${e}: ${d.explicaciones.join(" | ")}`);
  assert.ok(d.explicaciones.length >= 1 && d.explicaciones.length <= 4);
}
// En las palabras que tienen errores, algo queda marcado.
assert.ok(diferencias("palabra", "bieje", "viaje").partes.some((p) => p.tipo !== "ok"));
console.log(`✅ Explicación de errores del dictado: ${casos.length} casos OK.`);
