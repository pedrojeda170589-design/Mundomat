// Genera la captura de pantalla requerida por AG-20:
// 1. Gorra atrás de los lentes (los lentes sobre la gorra)
// 2. Lentes atrás de la gorra (la gorra sobre los lentes)
// 3. Avatar con 3 mascotas abajo una al lado de la otra sin tapar la cara.
// Uso:
//   npx tsx scripts/captura-avatar-capas.ts
import fs from "node:fs";
import path from "node:path";
import React from "react";
import { renderToString } from "react-dom/server";
import AvatarDisplay from "../src/components/AvatarDisplay";
import { AvatarCapa } from "../src/types";

const PUBLIC_DIR = path.join(process.cwd(), "public");
const OUT_DIR = path.join(process.cwd(), "docs", "equipo", "capturas");

function fileToDataUri(relPath: string): string {
  const cleanPath = relPath.startsWith("/") ? relPath.slice(1) : relPath;
  const fullPath = path.join(PUBLIC_DIR, cleanPath);
  if (!fs.existsSync(fullPath)) {
    console.warn("  [warn] no existe:", fullPath);
    return "";
  }
  const buf = fs.readFileSync(fullPath);
  const mime = cleanPath.endsWith(".jpg") || cleanPath.endsWith(".jpeg") ? "image/jpeg" : "image/png";
  return `data:${mime};base64,${buf.toString("base64")}`;
}

function inlineImages(html: string): string {
  // Eliminar srcSet / srcset case-insensitively
  let out = html.replace(/\s+srcset="[^"]*"/gi, "");
  // Reemplazar src="..."
  out = out.replace(/src="([^"]+)"/g, (match, srcVal) => {
    let url = srcVal;
    if (url.includes("url=")) {
      const matchUrl = url.match(/url=([^&]+)/);
      if (matchUrl) url = decodeURIComponent(matchUrl[1]);
    }
    const dataUri = fileToDataUri(url);
    return dataUri ? `src="${dataUri}"` : match;
  });
  // Reemplazar url(/theme/...) en estilos inline
  out = out.replace(/url\((\/[^)]+)\)/g, (match, urlVal) => {
    const dataUri = fileToDataUri(urlVal);
    return dataUri ? `url(${dataUri})` : match;
  });
  return out;
}

function renderCard(title: string, subtitle: string, capas: AvatarCapa[]): string {
  const raw = renderToString(
    React.createElement(AvatarDisplay, {
      character: "estudiante-1",
      capas,
      className: "w-48 h-48 rounded-3xl bg-slate-800/90 border-2 border-amber-400/80 shadow-2xl",
      imageSizes: "192px",
    })
  );
  const inlined = inlineImages(raw);

  return `
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">${title}</h3>
        <p class="card-sub">${subtitle}</p>
      </div>
      <div class="avatar-wrap">
        ${inlined}
      </div>
      <div class="capas-list">
        ${capas
          .map(
            (c, i) =>
              `<div class="capa-item"><span class="capa-num">Capa #${i + 1}</span> <span class="capa-id">${c.id}</span></div>`
          )
          .join("")}
      </div>
    </div>
  `;
}

async function main() {
  console.log("📸 Generando captura de pantalla de avatares con capas...");
  fs.mkdirSync(OUT_DIR, { recursive: true });

  // 1. Gorra primero (atrás), vincha segundo (adelante, la vincha sobre la gorra)
  const orden1: AvatarCapa[] = [
    { id: "gorra" },
    { id: "vincha-67" },
  ];

  // 2. Vincha primero (atrás), gorra segundo (adelante, la gorra sobre la vincha)
  const orden2: AvatarCapa[] = [
    { id: "vincha-67" },
    { id: "gorra" },
  ];

  // 3. Avatar con 3 mascotas abajo y objeto de mano (sin tapar el objeto de mano)
  const con3Mascotas: AvatarCapa[] = [
    { id: "gorra" },
    { id: "vincha-67" },
    { id: "squishy-6" },
    { id: "squishy-7" },
    { id: "pinguino-peluche-ml" },
    { id: "globos-67" },
  ];

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <title>AG-20 · Capas del Avatar</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
      color: #f8fafc;
      padding: 32px 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 24px;
      min-width: 900px;
    }
    .header {
      text-align: center;
      max-width: 800px;
    }
    .header h1 {
      font-size: 24px;
      font-weight: 900;
      color: #fbbf24;
      margin-bottom: 6px;
    }
    .header p {
      font-size: 13px;
      color: #94a3b8;
    }
    .grid {
      display: flex;
      gap: 20px;
      justify-content: center;
      align-items: stretch;
      max-width: 960px;
      width: 100%;
    }
    .card {
      background: rgba(30, 41, 59, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 24px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
    }
    .card-header {
      text-align: center;
      margin-bottom: 16px;
      min-height: 48px;
    }
    .card-title {
      font-size: 14px;
      font-weight: 800;
      color: #f1f5f9;
      margin-bottom: 4px;
    }
    .card-sub {
      font-size: 11px;
      color: #38bdf8;
      font-weight: 600;
    }
    .avatar-wrap {
      margin-bottom: 16px;
    }
    /* Estilos réplica de Tailwind para AvatarDisplay */
    .relative { position: relative; }
    .block { display: block; }
    .overflow-hidden { overflow: hidden; }
    .absolute { position: absolute; }
    .pointer-events-none { pointer-events: none; }
    .inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
    .w-full { width: 100%; }
    .h-full { height: 100%; }
    .w-48 { width: 192px; }
    .h-48 { height: 192px; }
    .w-\\[38\\%\\] { width: 38%; }
    .h-\\[38\\%\\] { height: 38%; }
    .z-10 { z-index: 10; }
    .rounded-3xl { border-radius: 24px; }
    .border-2 { border-width: 2px; }
    .border-amber-400\\/80 { border-color: rgba(251, 191, 36, 0.8); }
    .bg-slate-800\\/90 { background-color: rgba(30, 41, 59, 0.9); }
    img {
      max-width: 100%;
      height: 100%;
      object-fit: contain;
    }
    .object-bottom {
      object-position: bottom;
    }
    .drop-shadow-\\[0_1px_1px_rgba\\(0\\,0\\,0\\,0\\.25\\)\\] {
      filter: drop-shadow(0 1px 1px rgba(0,0,0,0.25));
    }
    .drop-shadow-\\[0_2px_2px_rgba\\(0\\,0\\,0\\,0\\.35\\)\\] {
      filter: drop-shadow(0 2px 2px rgba(0,0,0,0.35));
    }
    .capas-list {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 4px;
      background: rgba(15, 23, 42, 0.6);
      border-radius: 12px;
      padding: 8px 12px;
      border: 1px solid rgba(255, 255, 255, 0.06);
    }
    .capa-item {
      display: flex;
      justify-content: space-between;
      font-size: 11px;
    }
    .capa-num {
      color: #94a3b8;
    }
    .capa-id {
      color: #facc15;
      font-weight: 700;
      font-family: ui-monospace, SFMono-Regular, monospace;
    }
    .footer {
      font-size: 11px;
      color: #64748b;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>AG-20 · Editor del avatar: orden adelante/atrás y 3 mascotas</h1>
    <p>Demostración visual del nuevo modelo de capas: orden relativo configurable y distribución horizontal de hasta 3 mascotas.</p>
  </div>

  <div class="grid">
    ${renderCard("1. Vincha sobre la gorra", "Gorra en capa #1, Vincha en capa #2", orden1)}
    ${renderCard("2. Gorra sobre la vincha", "Vincha en capa #1, Gorra en capa #2", orden2)}
    ${renderCard("3. Avatar con 3 mascotas y globos", "3 mascotas abajo y globos en mano", con3Mascotas)}
  </div>

  <div class="footer">
    MundoMat · Antigravity · Captura automatizada con Playwright
  </div>
</body>
</html>`;

  const htmlPath = path.join(OUT_DIR, "preview.html");
  fs.writeFileSync(htmlPath, html, "utf8");
  const pngPath = path.join(OUT_DIR, "avatar-capas.png");

  try {
    const { execSync } = await import("node:child_process");
    const url = `file:///${htmlPath.replace(/\\/g, "/")}`;
    execSync(`npx playwright screenshot --channel=msedge --viewport-size="1024,560" --wait-for-timeout=500 "${url}" "${pngPath}"`, {
      stdio: "inherit",
    });
    console.log(`✅ Captura guardada con éxito en:\n   - ${pngPath}`);
  } catch (e) {
    console.warn("  [warn] Error al tomar captura con npx playwright:", e);
  } finally {
    if (fs.existsSync(htmlPath)) fs.unlinkSync(htmlPath);
  }
}

main().catch((err) => {
  console.error("❌ Error generando captura:", err);
  process.exit(1);
});
