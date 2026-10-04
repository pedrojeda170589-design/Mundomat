// Imprime (en Markdown) la lista de imágenes que faltan de las colecciones,
// en orden de fecha. Uso: npx tsx scripts/coleccion/lista-para-dibujar.ts
import { existsSync } from "node:fs";
import { join } from "node:path";
import { TEMPORADAS } from "../../src/lib/coleccion/temporadas";
import { AVATARES_LOGRO } from "../../src/lib/coleccion/logros";
import { ventanaDe } from "../../src/lib/tiempo-limitado";

const root = join(__dirname, "../..");
const hecho = (carpeta: string, id: string) => existsSync(join(root, "public/theme", carpeta, `${id}.png`));
const tipo = (o: { slot?: string; molde?: string }) =>
  o.slot === "pet" ? "mascota" : o.slot === "prop" ? "objeto de mano" : `se usa puesto (${o.slot}, molde \`${o.molde}\`)`;
const marca = (ok: boolean) => (ok ? "✅" : "⬜");

if (process.argv.includes("--json")) {
  // Catálogo para scripts/coleccion/procesar_arte.py.
  const items: Record<string, { tipo: string; slot?: string; molde?: string; comoAvatar?: string; carpeta: string }> = {};
  for (const t of TEMPORADAS) {
    for (const a of t.avatares) items[a.id] = { tipo: "avatar", comoAvatar: a.comoAvatar, carpeta: "avatars" };
    for (const o of t.objetos) items[o.id] = { tipo: "objeto", slot: o.slot, molde: o.molde, carpeta: "accessories-tienda" };
    if (t.legendario) items[t.legendario.id] = { tipo: "objeto", slot: t.legendario.slot, molde: t.legendario.molde, carpeta: "accessories-temporada" };
  }
  for (const l of AVATARES_LOGRO) {
    items[l.id] = { tipo: "avatar", comoAvatar: l.comoAvatar, carpeta: "avatars" };
    if (l.mascota) items[l.mascota.id] = { tipo: "objeto", slot: "pet", carpeta: "accessories-temporada" };
  }
  console.log(JSON.stringify(items));
  process.exit(0);
}

let out = "";
const orden = [...TEMPORADAS].sort((a, b) => {
  const va = ventanaDe(a.id)!, vb = ventanaDe(b.id)!;
  return Date.UTC(va.desde.year, va.desde.month - 1, va.desde.day) - Date.UTC(vb.desde.year, vb.desde.month - 1, vb.desde.day);
});
for (const t of orden) {
  const v = ventanaDe(t.id)!;
  out += `\n### ${t.emoji} ${t.coleccion} · ${t.label} (a la venta del ${v.desde.day}/${v.desde.month} al ${v.hasta.day}/${v.hasta.month})\n\n| | Archivo | Qué es | Descripción |\n|---|---|---|---|\n`;
  for (const a of t.avatares) out += `| ${marca(hecho("avatars", a.id))} | \`arte/coleccion/avatars/${a.id}.jpg\` | Avatar (encuadre como \`${a.comoAvatar}\`) | **${a.label}**: ${a.blurb} |\n`;
  for (const o of t.objetos) out += `| ${marca(hecho("accessories-tienda", o.id))} | \`arte/coleccion/objetos/${o.id}.jpg\` | ${tipo(o)} | **${o.label}**: ${o.blurb} |\n`;
  if (t.legendario) out += `| ${marca(hecho("accessories-temporada", t.legendario.id))} | \`arte/coleccion/legendarios/${t.legendario.id}.jpg\` | 👑 legendario, ${tipo(t.legendario)} | **${t.legendario.label}**: ${t.legendario.blurb} |\n`;
}
out += `\n### 🏆 Avatares de logro (uno por texto de comprensión)\n\n| | Archivo | Texto | Descripción |\n|---|---|---|---|\n`;
for (const l of AVATARES_LOGRO) {
  out += `| ${marca(hecho("avatars", l.id))} | \`arte/coleccion/avatars/${l.id}.jpg\` | ${l.texto} | **${l.label}** (encuadre como \`${l.comoAvatar}\`): ${l.blurb} |\n`;
  if (l.mascota) out += `| ${marca(hecho("accessories-temporada", l.mascota.id))} | \`arte/coleccion/legendarios/${l.mascota.id}.jpg\` | ${l.texto} | 🐾 **${l.mascota.label}** (mascota de logro): ${l.mascota.blurb} |\n`;
}
console.log(out);
