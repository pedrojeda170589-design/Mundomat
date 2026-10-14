// Fichas de lectura de los cuentos, leyendas y fábulas (pedido de Pedro,
// 14/10/2026: primero las leyendas, con el formato de una ficha de «La
// leyenda del Kakuy»; después, «aplicá ese formato para los demás textos»).
//
// Una hoja A4 por texto y por grado:
// - a la izquierda, el texto ilustrado (cartel con el título, el texto del
//   grado y dos escenas);
// - a la derecha, «Comprensión lectora»: preguntas numeradas con casilleros,
//   preguntas para responder con renglones y «Numerá las imágenes según el
//   orden de la historia».
// Una segunda hoja trae las respuestas para la familia o el docente.
// El texto y las preguntas son los mismos de los mundos de la app
// (src/lib/cuentos), así que la ficha practica lo que el chico lee en la app.
//
// Uso: npx tsx scripts/fichas/fichas_lectura.ts
// Salida: private/fichas/mundo-<id>-2.pdf (la «Ficha 2» del mundo de la
// texto en la página de familias) y docs/equipo/capturas/fichas-lectura/.
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { CUENTOS } from "@/lib/cuentos/catalogo";
import { escenasDe, preguntasDe, storyWorldId } from "@/lib/cuentos/recorrido";
import type { CuentoQuestion } from "@/lib/cuentos/tipos";

const RAIZ = process.cwd();
const SALIDA = path.join(RAIZ, "private", "fichas");
const MUESTRAS = path.join(RAIZ, "docs", "equipo", "capturas", "fichas-lectura");
const b64 = (p: string) => fs.readFileSync(path.join(RAIZ, p)).toString("base64");
const imagen = (p: string) => `data:image/${p.endsWith(".png") ? "png" : "jpeg"};base64,${b64(p)}`;
const fuente = (p: string) => `data:font/ttf;base64,${b64(p)}`;
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Orden de las imágenes para numerar: nunca el orden correcto.
function mezclar<T>(xs: T[], semilla: number): T[] {
  const a = [...xs];
  let s = semilla;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  if (a.every((x, i) => x === xs[i])) a.push(a.shift() as T);
  return a;
}

// Opciones para los casilleros: la correcta y las dos distractoras más
// cortas (entran en la columna), en un orden que no deja siempre la correcta
// en el mismo lugar.
function opciones(q: CuentoQuestion, semilla: number, max = 3) {
  const correcta = q.options[q.answer][1];
  const otras = q.options.filter((_, i) => i !== q.answer).map((o) => o[1]).sort((a, b) => a.length - b.length).slice(0, max - 1);
  const todas = mezclar([correcta, ...otras], semilla);
  return { todas, correcta };
}

interface Plan {
  mc: CuentoQuestion[];
  abiertas: { q: string; renglones: number; esperada: string }[];
  ordenar: number[]; // escenas (1..6) para numerar
  dibujo: boolean;
}

const NOMBRE: Record<string, string> = { cuento: "el cuento", leyenda: "la leyenda", fabula: "la fábula" };
const SOBRE: Record<string, string> = {
  cuento: "Los cuentos narran una historia con personajes, un problema y un final. Se pueden contar de nuevo con las propias palabras.",
  leyenda: "Las leyendas cuentan, con imaginación, el origen de algo que existe en la naturaleza o en la cultura de un pueblo.",
  fabula: "Las fábulas son relatos breves, casi siempre con animales que hablan, que terminan con una enseñanza o moraleja.",
};

// En la app el texto va por escenas; en papel se dice «en el cuento», «en la leyenda»…
function enPapel(q: string, genero: string): string {
  const n = NOMBRE[genero] ?? "el texto";
  const N = n.charAt(0).toUpperCase() + n.slice(1);
  return q.replace(/^En la escena \d+,?\s*/i, `${N} `).replace(/en la escena \d+/gi, n);
}

function plan(grade: number, qs: CuentoQuestion[]): Plan {
  const de = (k: CuentoQuestion["kind"]) => qs.filter((q) => q.kind === k);
  const tomar = (lista: CuentoQuestion[], n: number, usadas: Set<CuentoQuestion>) => {
    const r = lista.filter((q) => !usadas.has(q)).slice(0, n);
    r.forEach((q) => usadas.add(q));
    return r;
  };
  const usadas = new Set<CuentoQuestion>();
  if (grade === 1) {
    const mc = [...tomar(de("literal"), 2, usadas), ...tomar(de("secuencia"), 1, usadas), ...tomar(de("inferencial"), 1, usadas)];
    return { mc, abiertas: [], ordenar: [1, 4, 6], dibujo: true };
  }
  const porQue = de("inferencial").find((q) => q.q.startsWith("¿Por qué")) ?? de("inferencial")[0];
  if (porQue) usadas.add(porQue);
  const cierre = grade >= 3 ? de("valoracion")[0] ?? de("estructura")[0] : de("estructura")[0];
  if (cierre) usadas.add(cierre);
  const mc = [...tomar(de("literal"), 2, usadas), ...tomar(de("secuencia"), 1, usadas), ...tomar(de("vocabulario"), 1, usadas)];
  const abiertas = [porQue, cierre]
    .filter(Boolean)
    .map((q, i) => ({ q: q!.q, renglones: i === 0 ? 2 : 3, esperada: q!.options[q!.answer][1] }));
  return { mc, abiertas, ordenar: [1, 3, 4, 6], dibujo: false };
}

const CSS = `
@font-face { font-family: Andika; src: url(${fuente("scripts/fichas/Andika-Regular.ttf")}); }
@font-face { font-family: Andika; font-weight: bold; src: url(${fuente("scripts/fichas/Andika-Bold.ttf")}); }
@font-face { font-family: Fredoka; src: url(${fuente("scripts/fichas/Fredoka-Bold.ttf")}); }
@page { size: A4; margin: 0; }
* { box-sizing: border-box; }
body { margin: 0; font-family: Andika, sans-serif; color: #2b2118; }
.hoja { width: 210mm; height: 297mm; padding: 7mm; display: flex; flex-direction: column; gap: 3mm; page-break-after: always; overflow: hidden; }
.nombre { display: flex; gap: 6mm; font-size: 10pt; color: #5b4636; }
.nombre span { flex: 1; border-bottom: 1px solid #8a7560; padding-bottom: 1mm; }
.cols { flex: 1; display: grid; grid-template-columns: 1.55fr 1fr; grid-template-rows: 100%; gap: 4mm; min-height: 0; }
.izq { border: 2.5px solid #5b3a1e; border-radius: 6mm; padding: 4mm; position: relative; overflow: hidden; background: #fffdf7; min-height: 0; }
.cabeza { display: flex; align-items: center; gap: 2mm; }
.der { border: 2.5px solid #5b3a1e; border-radius: 6mm; padding: 3.5mm 3.5mm 3mm; background: #fffdf7; display: flex; flex-direction: column; overflow: hidden; min-height: 0; }
.cartel { position: relative; background: linear-gradient(#c98a4b, #a8692f); border: 2.5px solid #5b3a1e; border-radius: 4mm; padding: 2mm 3mm 2.5mm;
  box-shadow: inset 0 0 0 2px rgba(255,255,255,.25); flex: 1; text-align: center; }
.cartel .chico { font-family: Fredoka; color: #fff5dd; font-size: 15pt; letter-spacing: .5px; line-height: 1; -webkit-text-stroke: .6px #5b3a1e; }
.cartel .grande { font-family: Fredoka; color: #fff1c9; font-size: 25pt; line-height: 1.02; -webkit-text-stroke: 1px #5b3a1e; text-transform: uppercase; }
.isla { width: 27mm; flex: none; }
.origen { font-size: 8.5pt; color: #7a5a3a; margin: 1.5mm 0 1mm; font-style: italic; }
.texto p { margin: 0 0 1.6mm; text-align: left; }
.escena { width: 41%; border-radius: 3mm; border: 2px solid #5b3a1e; margin: 0.5mm 0 1.5mm; }
.escena.d { float: right; margin-left: 2.5mm; }
.escena.i { float: left; margin-right: 2.5mm; }
.titulo-der { font-family: Fredoka; text-align: center; background: #ffe7a3; border: 2.5px solid #5b3a1e; border-radius: 3mm; font-size: 15pt; padding: 1mm 0; color: #4a2f17; margin-bottom: 2.5mm; }
.p { display: grid; grid-template-columns: 7.5mm 1fr; column-gap: 2mm; margin-bottom: 2.2mm; }
.num { width: 7mm; height: 7mm; border-radius: 50%; background: #f2b632; border: 2px solid #5b3a1e; font-family: Fredoka; font-size: 12pt; display: flex; align-items: center; justify-content: center; color: #3b2410; }
.q { font-weight: bold; line-height: 1.2; }
.op { display: flex; gap: 1.8mm; align-items: flex-start; margin-top: 1mm; line-height: 1.15; }
.caja { flex: none; width: 3.6mm; height: 3.6mm; border: 1.5px solid #3b2410; border-radius: .8mm; margin-top: .6mm; background: #fff; }
.renglon { border-bottom: 1.2px solid #8a7560; height: 6.5mm; }
.orden { display: grid; gap: 2mm; margin-top: 1.5mm; }
.orden figure { margin: 0; position: relative; }
.orden img { width: 100%; height: 21mm; object-fit: cover; border-radius: 2mm; border: 2px solid #5b3a1e; display: block; }
.orden .casillero { position: absolute; left: 1.2mm; top: 1.2mm; width: 7mm; height: 7mm; background: #fff; border: 2px solid #3b2410; border-radius: 1.5mm; }
.dibujo { flex: 1; min-height: 30mm; border: 2px dashed #8a7560; border-radius: 3mm; margin-top: 1.5mm; display: flex; align-items: flex-end; justify-content: center; font-size: 9pt; color: #8a7560; padding: 1.5mm; }
.pie { font-size: 7.5pt; color: #8a7560; text-align: center; }
.resp h1 { font-family: Fredoka; font-size: 20pt; margin: 0 0 2mm; color: #4a2f17; }
.resp li { margin-bottom: 2mm; font-size: 11pt; }
.resp .nota { font-size: 10pt; color: #5b4636; background: #fff4d6; border-radius: 3mm; padding: 3mm; margin-top: 3mm; }
`;

function hoja(grade: number, id: string): { html: string; titulo: string } | null {
  const c = CUENTOS.find((x) => x.id === id)!;
  const escenas = escenasDe(grade, id);
  const qs = preguntasDe(grade, id);
  if (escenas.length < 6) return null;
  const pl = plan(grade, qs);
  const semilla = id.length * 31 + grade * 7;
  const tam = grade === 1 ? 13.5 : grade === 2 ? 11.8 : 10.8; // se achica sola si no entra
  const tituloArriba = /^la leyenda de/i.test(c.title) ? c.title.replace(/^(La leyenda de(?:l| la| las)?)\s+(.*)$/i, "$1") : "";
  const tituloGrande = tituloArriba ? c.title.slice(tituloArriba.length).trim() : c.title;

  // Texto con dos escenas intercaladas (las del ordenamiento son otras).
  const conImagen: Record<number, string> = { 1: "d", 4: "i" };
  const parrafos = escenas
    .map((t, i) => {
      const img = conImagen[i] ? `<img class="escena ${conImagen[i]}" src="${imagen(`public/theme/grados/1/cuentos/${id}-${i === 1 ? 2 : 5}.jpg`)}">` : "";
      return `${img}<p>${esc(t)}</p>`;
    })
    .join("");

  let n = 0;
  const preguntas: string[] = [];
  const claves: string[] = [];
  pl.mc.forEach((q, k) => {
    n++;
    const { todas, correcta } = opciones(q, semilla + k * 13, grade === 1 ? 3 : 3);
    preguntas.push(
      `<div class="p"><div class="num">${n}</div><div><div class="q">${esc(enPapel(q.q, c.genre))}</div>${todas
        .map((o) => `<div class="op"><span class="caja"></span><span>${esc(o)}</span></div>`)
        .join("")}</div></div>`
    );
    claves.push(`<li><b>${n}.</b> ${esc(correcta)}</li>`);
  });
  pl.abiertas.forEach((a) => {
    n++;
    preguntas.push(
      `<div class="p"><div class="num">${n}</div><div><div class="q">${esc(enPapel(a.q, c.genre))}</div>${'<div class="renglon"></div>'.repeat(a.renglones)}</div></div>`
    );
    claves.push(`<li><b>${n}.</b> Respuesta abierta. Idea esperada: ${esc(a.esperada)}</li>`);
  });
  n++;
  const orden = mezclar(pl.ordenar, semilla);
  const cols = orden.length === 4 ? 2 : 3;
  preguntas.push(
    `<div class="p"><div class="num">${n}</div><div><div class="q">Numerá las imágenes según el orden de la historia.</div>
      <div class="orden" style="grid-template-columns: repeat(${cols}, 1fr)">${orden
        .map((e) => `<figure><img src="${imagen(`public/theme/grados/1/cuentos/${id}-${e}.jpg`)}"><span class="casillero"></span></figure>`)
        .join("")}</div></div></div>`
  );
  const posiciones = orden.map((e) => pl.ordenar.indexOf(e) + 1);
  claves.push(`<li><b>${n}.</b> De izquierda a derecha y de arriba abajo: ${posiciones.join(", ")}.</li>`);
  const dibujo = pl.dibujo ? `<div class="dibujo">Dibujá la parte de ${NOMBRE[c.genre] ?? "la historia"} que más te gustó.</div>` : "";

  const isla = [`public/theme/grados/1/islas/cuento-${id}.png`, `public/theme/grados/2/islas/cuento-${id}.png`, `public/theme/islands/cuento-${id}.png`].find((p) =>
    fs.existsSync(path.join(RAIZ, p))
  ) ?? "";
  const html = `
  <section class="hoja">
    <div class="nombre"><span>Nombre:</span><span>Grado: ${grade}.º</span><span>Fecha:</span></div>
    <div class="cols">
      <div class="izq">
        <div class="cabeza">
          <div class="cartel">${tituloArriba ? `<div class="chico">${esc(tituloArriba.toUpperCase())}</div>` : ""}<div class="grande" style="font-size:${tituloGrande.length > 30 ? 16 : tituloGrande.length > 20 ? 19.5 : 25}pt">${esc(tituloGrande)}</div></div>
          ${isla ? `<img class="isla" src="${imagen(isla)}">` : ""}
        </div>
        <div class="origen">${esc(c.origin)}</div>
        <div class="texto" style="font-size:${tam}pt; line-height:${grade === 1 ? 1.35 : 1.28}">${parrafos}</div>
      </div>
      <div class="der" style="font-size:${grade === 1 ? 11 : 9.4}pt">
        <div class="titulo-der">COMPRENSIÓN LECTORA</div>
        ${preguntas.join("")}
        ${dibujo}
      </div>
    </div>
    <div class="pie">MundoTest26 · Ficha de lectura · ${esc(c.title)} (${grade}.º grado)</div>
  </section>
  <section class="hoja resp">
    <h1>Respuestas · ${esc(c.title)}</h1>
    <p>Para la familia o el docente. Leé ${NOMBRE[c.genre] ?? "el texto"} junto al chico y conversen sobre las respuestas antes de corregir.</p>
    <ol style="list-style:none;padding:0">${claves.join("")}</ol>
    <div class="nota"><b>Sobre ${NOMBRE[c.genre] ?? "el texto"}:</b> ${esc(c.origin)}. ${SOBRE[c.genre] ?? ""} Es el mismo texto que el chico lee en su mundo de MundoTest26, en ${grade}.º grado.</div>
  </section>`;
  return { html, titulo: c.title };
}

async function main() {
  fs.mkdirSync(SALIDA, { recursive: true });
  fs.mkdirSync(MUESTRAS, { recursive: true });
  const exe = process.env.CHROMIUM_PATH;
  const browser = await chromium.launch(exe ? { executablePath: exe } : {});
  const page = await browser.newPage();
  const hechas: string[] = [];
  for (const grade of [1, 2, 3]) {
    for (const c of CUENTOS) {
      const wid = storyWorldId(grade, c.id);
      if (!wid) continue;
      const h = hoja(grade, c.id);
      if (!h) continue;
      await page.setContent(`<!doctype html><html lang="es"><head><meta charset="utf-8"><style>${CSS}</style></head><body>${h.html}</body></html>`, { waitUntil: "load" });
      // Si la primera hoja no entra, achica la letra hasta que entre.
      for (let k = 0; k < 12; k++) {
        const sobra = await page.evaluate(() => {
          const el = document.querySelector(".izq .texto") as HTMLElement;
          const izq = document.querySelector(".izq") as HTMLElement;
          const der = document.querySelector(".der") as HTMLElement;
          return izq.scrollHeight > izq.clientHeight + 1 || der.scrollHeight > der.clientHeight + 1 ? el.style.fontSize : "";
        });
        if (!sobra) break;
        await page.evaluate(() => {
          for (const sel of [".izq .texto", ".der"]) {
            const el = document.querySelector(sel) as HTMLElement;
            el.style.fontSize = `${parseFloat(el.style.fontSize) * 0.96}pt`;
          }
        });
      }
      const pdf = path.join(SALIDA, `mundo-${wid}-2.pdf`);
      await page.pdf({ path: pdf, format: "A4", printBackground: true, preferCSSPageSize: true });
      if ([11102, 21108, 31102, 21103, 31104].includes(wid)) {
        await page.setViewportSize({ width: 794, height: 1123 });
        await page.screenshot({ path: path.join(MUESTRAS, `mundo-${wid}.png`), clip: { x: 0, y: 0, width: 794, height: 1123 } });
      }
      hechas.push(`${wid} ${h.titulo} (${grade}.º)`);
    }
  }
  await browser.close();
  console.log(hechas.length, "fichas de lectura:\n" + hechas.join("\n"));
}

void main();
