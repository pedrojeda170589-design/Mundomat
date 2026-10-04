// Imprime (en Markdown) la lista de imágenes que faltan de las colecciones,
// en orden de fecha. Uso: npx tsx scripts/coleccion/lista-para-dibujar.ts
import { existsSync } from "node:fs";
import { join } from "node:path";
import { TEMPORADAS } from "../../src/lib/coleccion/temporadas";
import { AVATARES_LOGRO } from "../../src/lib/coleccion/logros";
import { DROPS } from "../../src/lib/coleccion/drops";
import { CAMINO } from "../../src/lib/coleccion/racha";
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
  for (const d of DROPS) for (const o of [...d.items, ...(d.superEspecial ? [d.superEspecial] : [])]) items[o.id] = { tipo: "objeto", slot: o.slot, molde: o.molde, carpeta: "accessories-tienda" };
  for (const n of CAMINO) if (n.premio.tipo === "objeto") items[n.premio.id] = { tipo: "objeto", slot: n.premio.slot, molde: n.premio.molde, carpeta: "accessories-temporada" };
  for (const l of AVATARES_LOGRO) {
    items[l.id] = { tipo: "avatar", comoAvatar: l.comoAvatar, carpeta: "avatars" };
    if (l.mascota) items[l.mascota.id] = { tipo: "objeto", slot: "pet", carpeta: "accessories-temporada" };
  }
  items["vincha-relampago"] = { tipo: "objeto", slot: "headwear", molde: "cuernitos-dragon", carpeta: "accessories-temporada" };
  items["lentes-turbo"] = { tipo: "objeto", slot: "eyewear", molde: "lentes-aviador", carpeta: "accessories-temporada" };
  items["medalla-rayo"] = { tipo: "objeto", slot: "pendant", molde: "sol-de-mayo", carpeta: "accessories-temporada" };
  console.log(JSON.stringify(items));
  process.exit(0);
}

let out = "";
const orden = [...TEMPORADAS].filter((t) => !t.pausada).sort((a, b) => {
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
for (const d of DROPS) {
  out += `\n### ⚡ Drop ${d.label} (${d.desde}, ${d.dias} días)\n\n| | Archivo | Qué es | Descripción |\n|---|---|---|---|\n`;
  for (const o of [...d.items, ...(d.superEspecial ? [d.superEspecial] : [])]) out += `| ${marca(hecho("accessories-tienda", o.id))} | \`arte/coleccion/objetos/${o.id}.jpg\` | ${tipo(o)}${o === d.superEspecial ? " 🌟 superespecial" : ""} | **${o.label}**: ${o.blurb} |\n`;
}
out += `\n### 🔥 Camino de premios (racha)\n\n| | Archivo | Qué es | Descripción |\n|---|---|---|---|\n`;
for (const n of CAMINO) if (n.premio.tipo === "objeto") out += `| ${marca(hecho("accessories-temporada", n.premio.id))} | \`arte/coleccion/legendarios/${n.premio.id}.jpg\` | ${tipo(n.premio)} | **${n.premio.label}**: ${n.premio.blurb} |\n`;
out += `\n### 🏆 Avatares de logro (uno por texto de comprensión)\n\n| | Archivo | Texto | Descripción |\n|---|---|---|---|\n`;
for (const l of AVATARES_LOGRO) {
  out += `| ${marca(hecho("avatars", l.id))} | \`arte/coleccion/avatars/${l.id}.jpg\` | ${l.texto} | **${l.label}** (encuadre como \`${l.comoAvatar}\`): ${l.blurb} |\n`;
  if (l.mascota) out += `| ${marca(hecho("accessories-temporada", l.mascota.id))} | \`arte/coleccion/legendarios/${l.mascota.id}.jpg\` | ${l.texto} | 🐾 **${l.mascota.label}** (mascota de logro): ${l.mascota.blurb} |\n`;
}
out += `\n### ⚡ Torneo de las tablas (fin de semana)\n\n| | Archivo | Qué es | Descripción |\n|---|---|---|---|\n`;
out += `| ${marca(hecho("accessories-temporada", "vincha-relampago"))} | \`arte/coleccion/legendarios/vincha-relampago.jpg\` | se usa puesto (headwear, molde \`cuernitos-dragon\`) | **Vincha relámpago**: Oro en tablas 2 a 4 |\n`;
out += `| ${marca(hecho("accessories-temporada", "lentes-turbo"))} | \`arte/coleccion/legendarios/lentes-turbo.jpg\` | se usa puesto (eyewear, molde \`lentes-aviador\`) | **Lentes turbo**: Oro en tablas 5 a 7 |\n`;
out += `| ${marca(hecho("accessories-temporada", "medalla-rayo"))} | \`arte/coleccion/legendarios/medalla-rayo.jpg\` | se usa puesto (pendant, molde \`sol-de-mayo\`) | **Medalla del rayo**: Oro en tablas 8 a 10 |\n`;
console.log(out);
