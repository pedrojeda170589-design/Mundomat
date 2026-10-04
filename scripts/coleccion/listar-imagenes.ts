// Regenera src/lib/coleccion/imagenes-listas.ts: qué avatares y objetos de
// las colecciones (temporadas y logros) ya tienen su imagen en public/.
// Un ítem sin imagen no aparece en la tienda ni en el perfil.
//
// Uso: npx tsx scripts/coleccion/listar-imagenes.ts
import { existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { TEMPORADAS } from "../../src/lib/coleccion/temporadas";
import { AVATARES_LOGRO } from "../../src/lib/coleccion/logros";
import { DROPS } from "../../src/lib/coleccion/drops";
import { CAMINO } from "../../src/lib/coleccion/racha";

const root = join(__dirname, "../..");
const png = (carpeta: string, id: string) => existsSync(join(root, "public/theme", carpeta, `${id}.png`));

const listos: string[] = [];
const faltan: string[] = [];
const ver = (id: string, carpeta: string) => (png(carpeta, id) ? listos : faltan).push(id);

for (const t of TEMPORADAS) {
  for (const a of t.avatares) ver(a.id, "avatars");
  for (const o of t.objetos) ver(o.id, "accessories-tienda");
  if (t.legendario) ver(t.legendario.id, "accessories-temporada");
}
for (const d of DROPS) for (const o of [...d.items, ...(d.superEspecial ? [d.superEspecial] : [])]) ver(o.id, "accessories-tienda");
for (const n of CAMINO) if (n.premio.tipo === "objeto") ver(n.premio.id, "accessories-temporada");
for (const l of AVATARES_LOGRO) {
  ver(l.id, "avatars");
  if (l.mascota) ver(l.mascota.id, "accessories-temporada");
}

writeFileSync(
  join(root, "src/lib/coleccion/imagenes-listas.ts"),
  `// Generado por scripts/coleccion/listar-imagenes.ts: no editar a mano.\n// Ítems de las colecciones que ya tienen imagen en public/theme.\nexport const IMAGENES_LISTAS = new Set<string>(${JSON.stringify(listos.sort(), null, 2)});\n`
);
console.log(`${listos.length} con imagen, ${faltan.length} sin imagen todavía.`);
