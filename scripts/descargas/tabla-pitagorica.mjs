// Genera public/descargas/tabla-pitagorica.pdf (A4) y .png desde la página
// /tabla-pitagorica. Uso: con `npx next dev -p 3100` andando,
//   node scripts/descargas/tabla-pitagorica.mjs
import { chromium } from "playwright";
const base = process.env.BASE ?? "http://localhost:3100";
const b = await chromium.launch({ executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium" });
const p = await b.newPage({ viewport: { width: 860, height: 1200 }, deviceScaleFactor: 2 });
await p.goto(`${base}/tabla-pitagorica`, { waitUntil: "networkidle" });
await p.addStyleTag({ content: "nextjs-portal{display:none!important}" }); // sin el botón de desarrollo
await p.waitForTimeout(800);
await p.locator("#lamina").screenshot({ path: "public/descargas/tabla-pitagorica.png" });
await p.emulateMedia({ media: "print" });
await p.pdf({ path: "public/descargas/tabla-pitagorica.pdf", format: "A4", printBackground: true, margin: { top: "8mm", bottom: "8mm", left: "8mm", right: "8mm" }, scale: 0.92 });
await b.close();
console.log("✅ public/descargas/tabla-pitagorica.pdf y .png");
