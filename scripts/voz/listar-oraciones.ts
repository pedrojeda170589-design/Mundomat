// Lista todas las oraciones (y títulos) de los textos de los 3 grados, con su
// hash, para generar las voces: npx tsx scripts/voz/listar-oraciones.ts > oraciones.json
import { CUENTOS } from "../../src/lib/cuentos/catalogo";
import { escenasDe } from "../../src/lib/cuentos/recorrido";
import { oraciones, vozHash } from "../../src/lib/cuentos/voz";

const out = new Map<string, string>();
for (const c of CUENTOS) {
  out.set(vozHash(c.title), c.title);
  for (const g of [1, 2, 3]) for (const esc of escenasDe(g, c.id)) for (const o of oraciones(esc)) out.set(vozHash(o), o);
}
console.log(JSON.stringify(Object.fromEntries(out), null, 0));
