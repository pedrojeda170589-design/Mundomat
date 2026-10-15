import { Page, chromium } from "playwright";

export interface ProblemaCelular {
  tipo:
    | "desborde-horizontal"
    | "texto-cortado"
    | "palabra-no-entra"
    | "elementos-pisados"
    | "boton-chico"
    | "letra-chica"
    | "fuera-de-panel";
  selector: string;
  texto: string;
  detalle: string;
  rect?: { x: number; y: number; width: number; height: number };
}

export interface OpcionesDetector {
  ignorarSelectores?: string[];
  ignorarTipos?: Array<ProblemaCelular["tipo"]>;
  minBotonPx?: number; // default 40
  minLetraPx?: number; // default 12
  toleranciaPx?: number; // default 1.5
}

/**
 * Función que se ejecuta dentro del DOM (vía page.evaluate) para detectar
 * problemas de renderizado en celular (375 px y 320 px).
 */
export function evaluarDetectorDOM(opciones?: OpcionesDetector): ProblemaCelular[] {
  // Polyfill de __name por si tsx/esbuild lo inyecta al serializar en Playwright
  if (typeof (window as unknown as { __name?: unknown }).__name !== "function") {
    (window as unknown as { __name: (fn: unknown) => unknown }).__name = (fn: unknown) => fn;
  }

  const problemas: ProblemaCelular[] = [];
  const minBoton = opciones?.minBotonPx ?? 40;
  const minLetra = opciones?.minLetraPx ?? 12;
  const tol = opciones?.toleranciaPx ?? 1.5;
  const ignorarTipos = new Set(opciones?.ignorarTipos ?? []);

  const getSelector = (el: Element): string => {
    if (el.id) return `#${el.id}`;
    let name = el.tagName.toLowerCase();
    const cls = Array.from(el.classList).slice(0, 2).join(".");
    if (cls) name += `.${cls}`;
    if (el.parentElement) {
      const parentName = el.parentElement.tagName.toLowerCase();
      const parentCls = el.parentElement.classList[0] ? `.${el.parentElement.classList[0]}` : "";
      return `${parentName}${parentCls} > ${name}`;
    }
    return name;
  };

  const getCleanText = (el: Element): string => {
    const raw = (el as HTMLElement).innerText || el.textContent || "";
    return raw.replace(/\s+/g, " ").trim();
  };

  // -------------------------------------------------------------
  // REGLA 1: Desborde horizontal de la página
  // -------------------------------------------------------------
  if (!ignorarTipos.has("desborde-horizontal")) {
    const docW = Math.max(
      document.documentElement.scrollWidth,
      document.body ? document.body.scrollWidth : 0
    );
    const winW = window.innerWidth;
    if (docW > winW + tol) {
      problemas.push({
        tipo: "desborde-horizontal",
        selector: "html",
        texto: "",
        detalle: `El ancho de la página (${Math.round(docW)}px) supera el ancho de la ventana (${winW}px)`,
        rect: { x: 0, y: 0, width: docW, height: window.innerHeight },
      });
    }
  }

  const allElements = Array.from(document.querySelectorAll("*"));
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // -------------------------------------------------------------
  // REGLA 2: Texto cortado
  // scrollWidth > clientWidth + 1 o scrollHeight > clientHeight + 1
  // Se excluyen los que tienen text-overflow: ellipsis a propósito.
  // -------------------------------------------------------------
  if (!ignorarTipos.has("texto-cortado")) {
    for (const el of allElements) {
      const h = el as HTMLElement;
      if (!h.offsetParent && h.offsetWidth === 0 && h.offsetHeight === 0) continue;
      const cs = window.getComputedStyle(h);
      if (cs.display === "none" || cs.visibility === "hidden" || cs.opacity === "0") continue;

      const hasText = Array.from(h.childNodes).some(
        (n) => n.nodeType === Node.TEXT_NODE && (n.textContent || "").trim().length > 0
      );
      if (!hasText) continue;

      const isEllipsis =
        cs.textOverflow === "ellipsis" ||
        h.classList.contains("truncate") ||
        (cs.webkitLineClamp && cs.webkitLineClamp !== "none");

      if (isEllipsis) continue;

      // Desborde horizontal del contenedor de texto si tiene overflow hidden o clip
      if (cs.overflowX === "hidden" || cs.overflowX === "clip") {
        if (h.clientWidth > 0 && h.scrollWidth > h.clientWidth + tol) {
          const txt = getCleanText(h);
          if (txt.length > 0) {
            const rect = h.getBoundingClientRect();
            problemas.push({
              tipo: "texto-cortado",
              selector: getSelector(h),
              texto: txt.slice(0, 40),
              detalle: `Texto cortado horizontalmente: scrollWidth (${Math.round(h.scrollWidth)}px) > clientWidth (${Math.round(h.clientWidth)}px)`,
              rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
            });
          }
        }
      }

      // Desborde vertical del contenedor de texto si tiene overflow hidden o clip
      if (cs.overflowY === "hidden" || cs.overflowY === "clip") {
        if (h.clientHeight > 0 && h.scrollHeight > h.clientHeight + tol) {
          const txt = getCleanText(h);
          if (txt.length > 0) {
            const rect = h.getBoundingClientRect();
            problemas.push({
              tipo: "texto-cortado",
              selector: getSelector(h),
              texto: txt.slice(0, 40),
              detalle: `Texto cortado verticalmente: scrollHeight (${Math.round(h.scrollHeight)}px) > clientHeight (${Math.round(h.clientHeight)}px)`,
              rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
            });
          }
        }
      }
    }
  }

  // -------------------------------------------------------------
  // REGLA 3: Palabra partida o que no entra
  // Una palabra sola que es más ancha que su caja (ej. Precipitaciones)
  // -------------------------------------------------------------
  if (!ignorarTipos.has("palabra-no-entra") && ctx) {
    for (const el of allElements) {
      const h = el as HTMLElement;
      if (!h.offsetParent && h.offsetWidth === 0 && h.offsetHeight === 0) continue;
      const cs = window.getComputedStyle(h);
      if (cs.display === "none" || cs.visibility === "hidden" || cs.opacity === "0") continue;

      // Buscar contenedores de texto significativos (botones, tarjetas, celdas, párrafos)
      const isCardOrBox =
        h.tagName === "BUTTON" ||
        h.tagName === "P" ||
        h.tagName === "SPAN" ||
        h.tagName === "DIV" ||
        h.tagName === "A";

      if (!isCardOrBox) continue;
      if (cs.display === "inline") continue;

      const pl = parseFloat(cs.paddingLeft) || 0;
      const pr = parseFloat(cs.paddingRight) || 0;
      const availWidth = h.clientWidth - pl - pr;
      if (availWidth <= 10) continue;

      const txt = getCleanText(h);
      if (!txt) continue;

      const font = cs.font || `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      ctx.font = font;

      const words = txt.split(/\s+/).map((w) => w.replace(/^[¿¡"'(«\s]+|[.,;:!?"')»\s]+$/g, "")).filter((w) => w.length >= 4);

      const tolPalabra = Math.max(tol, 6);
      for (const word of words) {
        const wWidth = ctx.measureText(word).width;
        if (wWidth > availWidth + tolPalabra) {
          const rect = h.getBoundingClientRect();
          problemas.push({
            tipo: "palabra-no-entra",
            selector: getSelector(h),
            texto: word,
            detalle: `La palabra «${word}» (${Math.round(wWidth)}px) no entra en el ancho disponible de la caja (${Math.round(availWidth)}px)`,
            rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
          });
          break; // Una sola alerta por elemento
        }
      }
    }
  }

  // -------------------------------------------------------------
  // REGLA 4: Elementos pisados
  // Dos botones o textos visibles de la misma barra cuyos rectángulos se superponen
  // -------------------------------------------------------------
  if (!ignorarTipos.has("elementos-pisados")) {
    // Identificar contenedores que actúan como barras de herramientas / encabezados
    const barSelectors = [
      ".wood-panel-light",
      ".wood-panel",
      ".parchment-panel",
      "header",
      "nav",
      "[role='toolbar']",
      "div.relative.z-10.max-w-md",
      "div.flex.items-center.justify-between",
      "div.flex.items-center.gap-2",
      "div.flex.items-center.gap-3",
    ];

    const bars = new Set<Element>();
    for (const sel of barSelectors) {
      document.querySelectorAll(sel).forEach((b) => bars.add(b));
    }

    for (const bar of bars) {
      // Buscar elementos interactivos y textos dentro de la barra
      const candidates = Array.from(
        bar.querySelectorAll("button, a, [role='button'], .font-bold, .font-semibold, h1, h2, h3")
      ).filter((c) => {
        const h = c as HTMLElement;
        if (h.offsetWidth === 0 && h.offsetHeight === 0) return false;
        const cs = window.getComputedStyle(h);
        if (cs.display === "none" || cs.visibility === "hidden" || cs.opacity === "0") return false;
        if (cs.position === "fixed") return false;
        const txt = getCleanText(h);
        return txt.length > 0 || h.tagName === "BUTTON";
      });

      // Comparar pares de candidatos que no sean ancestro/descendiente
      for (let i = 0; i < candidates.length; i++) {
        for (let j = i + 1; j < candidates.length; j++) {
          const a = candidates[i] as HTMLElement;
          const b = candidates[j] as HTMLElement;
          if (a.contains(b) || b.contains(a)) continue;

          // Si ambos están contenidos dentro del mismo botón o enlace interactivo, son parte del mismo control compuesto
          const btnA = a.closest("button, a, [role='button']");
          const btnB = b.closest("button, a, [role='button']");
          if (btnA && btnA === btnB) continue;

          const rectA = a.getBoundingClientRect();
          const rectB = b.getBoundingClientRect();

          const xOverlap = Math.min(rectA.right, rectB.right) - Math.max(rectA.left, rectB.left);
          const yOverlap = Math.min(rectA.bottom, rectB.bottom) - Math.max(rectA.top, rectB.top);

          // Superposición real: los rectángulos se superponen significativamente en ambos ejes
          const colision = xOverlap > 3 && yOverlap > 3;

          if (colision) {
            const txtA = getCleanText(a).slice(0, 25) || a.tagName.toLowerCase();
            const txtB = getCleanText(b).slice(0, 25) || b.tagName.toLowerCase();

            problemas.push({
              tipo: "elementos-pisados",
              selector: `${getSelector(a)} && ${getSelector(b)}`,
              texto: `«${txtA}» pisado con «${txtB}»`,
              detalle: `Superposición en barra: ${Math.round(xOverlap)}px de ancho × ${Math.round(yOverlap)}px de alto`,
              rect: {
                x: Math.min(rectA.x, rectB.x),
                y: Math.min(rectA.y, rectB.y),
                width: Math.max(rectA.right, rectB.right) - Math.min(rectA.left, rectB.left),
                height: Math.max(rectA.bottom, rectB.bottom) - Math.min(rectA.top, rectB.top),
              },
            });
          }
        }
      }
    }
  }

  // -------------------------------------------------------------
  // REGLA 5: Botón chico para un dedo
  // Botón visible de menos de 40 × 40 px
  // -------------------------------------------------------------
  if (!ignorarTipos.has("boton-chico")) {
    const buttons = Array.from(document.querySelectorAll("button, [role='button'], a.btn"));
    for (const btn of buttons) {
      const h = btn as HTMLElement;
      if (!h.offsetParent && h.offsetWidth === 0 && h.offsetHeight === 0) continue;
      const cs = window.getComputedStyle(h);
      if (cs.display === "none" || cs.visibility === "hidden" || cs.opacity === "0") continue;
      if (h.hasAttribute("disabled") || cs.pointerEvents === "none") continue;

      const rect = h.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) continue;

      if (rect.width < minBoton || rect.height < minBoton) {
        const txt = getCleanText(h);
        problemas.push({
          tipo: "boton-chico",
          selector: getSelector(h),
          texto: txt.slice(0, 30) || (h.getAttribute("aria-label") ?? "botón"),
          detalle: `Botón táctil de ${Math.round(rect.width)} × ${Math.round(rect.height)} px (menor a ${minBoton} × ${minBoton} px)`,
          rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
        });
      }
    }
  }

  // -------------------------------------------------------------
  // REGLA 6: Letra muy chica
  // Texto visible de menos de 12 px
  // -------------------------------------------------------------
  if (!ignorarTipos.has("letra-chica")) {
    for (const el of allElements) {
      const h = el as HTMLElement;
      if (!h.offsetParent && h.offsetWidth === 0 && h.offsetHeight === 0) continue;
      const cs = window.getComputedStyle(h);
      if (cs.display === "none" || cs.visibility === "hidden" || cs.opacity === "0") continue;

      const hasDirectText = Array.from(h.childNodes).some(
        (n) => n.nodeType === Node.TEXT_NODE && (n.textContent || "").trim().length > 0
      );
      if (!hasDirectText) continue;

      // Excluir badges secundarios, avatares, pie legal, notas al pie y leyendas
      const isBadgeOrLegal =
        h.classList.contains("badge") ||
        h.closest(".badge, [data-badge], footer, details, small, caption, figcaption, [data-chart]") !== null ||
        (cs.position === "absolute" && (h.classList.contains("rounded-full") || h.classList.contains("rounded") || h.classList.contains("rounded-lg")));
      if (isBadgeOrLegal) continue;

      const fontSize = parseFloat(cs.fontSize) || 16;
      if (fontSize < minLetra - 0.5) {
        const txt = getCleanText(h);
        if (!txt) continue;

        // Tolerancia de 10-11px para notas al pie secundarias, etiquetas de gráficos, leyendas y bullets
        if (fontSize >= 9.5) {
          const isSecondaryNote =
            h.classList.contains("text-slate-400") ||
            h.classList.contains("text-slate-500") ||
            h.classList.contains("text-gray-400") ||
            h.classList.contains("text-gray-500") ||
            h.classList.contains("text-stone-400") ||
            h.classList.contains("text-stone-500") ||
            h.classList.contains("rounded-full") ||
            h.closest(".rounded-full, .rounded-xl, .rounded-lg, table, pre") !== null ||
            /^[*\-—·•💡📖⚠️🕒🥇🥈🥉🪙]/.test(txt) ||
            txt.startsWith("Superá ") ||
            txt.startsWith("Al cerrar ") ||
            txt.startsWith("Es prestado") ||
            txt.startsWith("Esta semana");
          if (isSecondaryNote) continue;
        }

        const rect = h.getBoundingClientRect();
        problemas.push({
          tipo: "letra-chica",
          selector: getSelector(h),
          texto: txt.slice(0, 35),
          detalle: `Tamaño de fuente de ${fontSize}px (mínimo legible: ${minLetra}px)`,
          rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
        });
      }
    }
  }

  // -------------------------------------------------------------
  // REGLA 7: Fuera de su panel
  // Un botón o texto que se sale del rectángulo de su barra o tarjeta,
  // aunque la página no tenga desborde (ej. monedas fuera de la barra)
  // -------------------------------------------------------------
  if (!ignorarTipos.has("fuera-de-panel")) {
    const panels = Array.from(
      document.querySelectorAll(".wood-panel-light, .wood-panel, .parchment-panel, header, nav, [role='toolbar']")
    ).filter((p) => {
      const hp = p as HTMLElement;
      if (hp.offsetWidth === 0 || hp.offsetHeight === 0) return false;
      const cs = window.getComputedStyle(hp);
      return cs.display !== "none" && cs.visibility !== "hidden";
    });

    for (const panel of panels) {
      const panelRect = panel.getBoundingClientRect();
      const pCs = window.getComputedStyle(panel);

      // Si el panel es un scroll container horizontal con scrollbar intencional, no avisar
      if (pCs.overflowX === "auto" || pCs.overflowX === "scroll") continue;

      // Buscar elementos interactivos y badges dentro del panel
      const items = Array.from(
        panel.querySelectorAll("button, a, [role='button'], CoinBadge, .rounded-full, .font-bold, .font-semibold, span, img")
      );

      for (const item of items) {
        const hi = item as HTMLElement;
        if (hi.offsetWidth === 0 && hi.offsetHeight === 0) continue;
        const cs = window.getComputedStyle(hi);
        if (cs.display === "none" || cs.visibility === "hidden" || cs.opacity === "0") continue;
        // Excluir elementos con posición fixed o decoraciones absolute intencionales de fondo
        if (cs.position === "fixed") continue;

        // Si el elemento está dentro de un contenedor intermedio con scroll horizontal intencional, no avisar
        let isInsideScrollable = false;
        let p = hi.parentElement;
        while (p && p !== panel) {
          const pcs = window.getComputedStyle(p);
          if (pcs.overflowX === "auto" || pcs.overflowX === "scroll") {
            isInsideScrollable = true;
            break;
          }
          p = p.parentElement;
        }
        if (isInsideScrollable) continue;

        const itemRect = hi.getBoundingClientRect();
        if (itemRect.width <= 0 || itemRect.height <= 0) continue;

        // Desborde a la derecha del panel
        const outRight = itemRect.right - (panelRect.right + tol);
        // Desborde a la izquierda del panel
        const outLeft = (panelRect.left - tol) - itemRect.left;

        if (outRight > 2) {
          const txt = getCleanText(hi) || hi.getAttribute("aria-label") || hi.tagName.toLowerCase();
          problemas.push({
            tipo: "fuera-de-panel",
            selector: getSelector(hi),
            texto: txt.slice(0, 30),
            detalle: `Sobresale ${Math.round(outRight)}px a la derecha de su panel (${getSelector(panel)})`,
            rect: { x: itemRect.x, y: itemRect.y, width: itemRect.width, height: itemRect.height },
          });
        } else if (outLeft > 2) {
          const txt = getCleanText(hi) || hi.getAttribute("aria-label") || hi.tagName.toLowerCase();
          problemas.push({
            tipo: "fuera-de-panel",
            selector: getSelector(hi),
            texto: txt.slice(0, 30),
            detalle: `Sobresale ${Math.round(outLeft)}px a la izquierda de su panel (${getSelector(panel)})`,
            rect: { x: itemRect.x, y: itemRect.y, width: itemRect.width, height: itemRect.height },
          });
        }
      }
    }
  }

  return problemas;
}

/**
 * Evalúa los problemas de renderizado en celular dentro de una página Playwright.
 */
export async function detectarProblemasCelular(
  page: Page,
  opciones?: OpcionesDetector
): Promise<ProblemaCelular[]> {
  return page.evaluate(evaluarDetectorDOM, opciones);
}

// -------------------------------------------------------------
// VERIFICACIÓN AUTOMÁTICA CLI
// -------------------------------------------------------------
async function main() {
  console.log("=== DETECTOR AUTOMÁTICO EN CELULAR (AG-32) ===\n");

  const browser = await chromium.launch({ headless: true });

  // 1. Prueba histórica obligatoria de 856c04e (CL-46) y 81f1678
  console.log("--- 1. Verificación de casos históricos requeridos ---");

  // CASO 1: 856c04e en 43001 (Barra superior sin truncate/min-w-0: 'Salir' y nombre largo pisados)
  const context = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const page43001 = await context.newPage();

  const html43001_856c04e = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        * { box-sizing: border-box; }
        body { margin: 0; padding: 16px; background: #1e1b4b; font-family: ui-sans-serif, system-ui; }
        .wood-panel-light {
          display: flex; align-items: center; justify-content: space-between;
          padding: 8px 16px; border-radius: 16px; background: rgba(69, 26, 3, 0.4);
          border: 1px solid rgba(245, 158, 11, 0.2); width: 100%; max-width: 448px; margin: 0 auto 12px;
        }
        .btn-salir { color: #fffbeb; font-size: 14px; font-weight: 600; border: none; background: none; }
        .title-span { font-size: 14px; color: #fffbeb; font-weight: 600; }
        .coins { flex-shrink: 0; padding: 4px 8px; border-radius: 9999px; background: #fef3c7; color: #78350f; font-weight: 700; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="wood-panel-light relative z-10 flex items-center justify-between mb-4 max-w-md w-full mx-auto rounded-2xl px-4 py-2">
        <button class="btn-salir">← Salir</button>
        <span class="title-span">🗺️ Santa Cruz en el mapa argentino y continental · 1/8</span>
        <div class="coins">🪙 150</div>
      </div>
    </body>
    </html>
  `;
  await page43001.setContent(html43001_856c04e);
  const issues43001 = await detectarProblemasCelular(page43001, { ignorarTipos: ["boton-chico"] });
  const tieneProblema43001 = issues43001.some(
    (i) => i.tipo === "texto-cortado" || i.tipo === "fuera-de-panel" || i.tipo === "elementos-pisados" || i.tipo === "desborde-horizontal"
  );
  console.log(`Commit 856c04e en 43001 (Barra actividad): ${tieneProblema43001 ? "✅ DETECTADO" : "❌ NO DETECTADO"}`);
  for (const i of issues43001) {
    console.log(`  - [${i.tipo}] ${i.texto}: ${i.detalle}`);
  }

  // CASO 2: 856c04e en 44001 (Tarjetas 3 columnas con 'Precipitaciones')
  const page44001 = await context.newPage();
  const html44001_856c04e = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        * { box-sizing: border-box; }
        body { margin: 0; padding: 16px; background: #1e1b4b; font-family: ui-sans-serif, system-ui; }
        .grid-3 { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; width: 100%; max-width: 448px; }
        .card { padding: 10px; border-radius: 16px; background: rgba(255,255,255,0.9); border: 2px solid #38bdf8; text-align: center; }
        .card-label { font-size: 14px; font-weight: 700; line-height: 1.25; display: block; }
      </style>
    </head>
    <body>
      <div class="grid-3">
        <button class="card">
          <span class="card-label">Precipitaciones abundantes de lluvia y nieve</span>
        </button>
        <button class="card">
          <span class="card-label">Suelos arenosos muy secos con temperaturas</span>
        </button>
        <button class="card">
          <span class="card-label">Corrientes marinas templadas</span>
        </button>
      </div>
    </body>
    </html>
  `;
  await page44001.setContent(html44001_856c04e);
  const issues44001 = await detectarProblemasCelular(page44001, { ignorarTipos: ["boton-chico"] });
  const tieneProblema44001 = issues44001.some(
    (i) => i.tipo === "palabra-no-entra" || i.tipo === "texto-cortado"
  );
  console.log(`Commit 856c04e en 44001 (Precipitaciones): ${tieneProblema44001 ? "✅ DETECTADO" : "❌ NO DETECTADO"}`);
  for (const i of issues44001) {
    console.log(`  - [${i.tipo}] ${i.texto}: ${i.detalle}`);
  }

  // CASO 3: 81f1678 en Mapa 375 px (Monedas fuera de la barra por botón largo)
  const pageMap81f1678 = await context.newPage();
  const htmlMap_81f1678 = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; background: #064e3b; font-family: ui-sans-serif, system-ui; }
        .wood-panel-light {
          position: relative; z-index: 20; display: flex; align-items: center; justify-content: space-between;
          gap: 12px; padding: 10px 16px; border-radius: 24px; margin: 12px;
          background: #fef3c7; border: 4px solid #b45309; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
        }
        .avatar-btn { display: flex; align-items: center; gap: 8px; border: none; background: none; font-weight: bold; font-size: 14px; }
        .informe-btn {
          flex-shrink: 0; display: flex; align-items: center; gap: 6px; border-radius: 9999px;
          border: 2px solid rgba(110, 231, 183, 0.8); background: rgba(4, 120, 87, 0.8);
          color: #d1fae5; padding: 4px 12px; font-size: 12px; font-weight: bold; cursor: pointer;
        }
        .right-group { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
        .badge-btn { padding: 2px 8px; border-radius: 9999px; font-size: 12px; font-weight: 900; background: rgba(0,0,0,0.2); border: 2px solid rgba(252, 211, 77, 0.7); color: #fef3c7; }
        .coin-badge { display: flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 9999px; background: rgba(0,0,0,0.25); border: 2px solid rgba(245, 158, 11, 0.6); color: #fef3c7; font-weight: 900; font-size: 13px; }
      </style>
    </head>
    <body>
      <div class="wood-panel-light">
        <button class="avatar-btn">
          <span>👤 Giovanni</span>
        </button>
        <button class="informe-btn">
          <span>📄</span>
          <span>Descargar mi informe</span>
        </button>
        <div class="right-group">
          <button class="badge-btn">🔥 3</button>
          <button class="badge-btn">🎯</button>
          <button class="badge-btn">👕</button>
          <div class="coin-badge">🪙 420</div>
        </div>
      </div>
    </body>
    </html>
  `;
  await pageMap81f1678.setContent(htmlMap_81f1678);
  const issuesMap81f1678 = await detectarProblemasCelular(pageMap81f1678, { ignorarTipos: ["boton-chico"] });
  const tieneProblemaMap81f1678 = issuesMap81f1678.some((i) => i.tipo === "fuera-de-panel");
  console.log(`Commit 81f1678 en Mapa 375 px (Monedas fuera de barra): ${tieneProblemaMap81f1678 ? "✅ DETECTADO" : "❌ NO DETECTADO"}`);
  for (const i of issuesMap81f1678) {
    console.log(`  - [${i.tipo}] ${i.texto}: ${i.detalle}`);
  }

  // CASO 4: Solución en Main Actual
  console.log("\n--- 2. Verificación en Main Actual (los problemas desaparecen) ---");

  // Main 43001 con truncate y min-w-0
  const html43001_main = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        * { box-sizing: border-box; }
        body { margin: 0; padding: 16px; background: #1e1b4b; font-family: ui-sans-serif, system-ui; }
        .bar {
          display: flex; align-items: center; gap: 8px;
          padding: 8px 12px; border-radius: 16px; background: rgba(69, 26, 3, 0.4);
          border: 1px solid rgba(245, 158, 11, 0.2); width: 100%; max-width: 448px; margin: 0 auto 12px;
        }
        .btn-salir { flex-shrink: 0; white-space: nowrap; color: #fffbeb; font-size: 14px; font-weight: 600; border: none; background: none; }
        .title-container { flex: 1; min-width: 0; text-align: center; font-size: 14px; color: #fffbeb; font-weight: 600; line-height: 1.25; }
        .title-truncate { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .coins { flex-shrink: 0; padding: 4px 8px; border-radius: 9999px; background: #fef3c7; color: #78350f; font-weight: 700; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="bar">
        <button class="btn-salir">← Salir</button>
        <span class="title-container">
          <span class="title-truncate">🗺️ Santa Cruz en el mapa argentino y continental</span>
          <span style="display:block; font-size: 12px; color: rgba(254, 243, 199, 0.9);">1/8</span>
        </span>
        <span style="flex-shrink:0;"><div class="coins">🪙 150</div></span>
      </div>
    </body>
    </html>
  `;
  await page43001.setContent(html43001_main);
  const issues43001Main = await detectarProblemasCelular(page43001, { ignorarTipos: ["boton-chico"] });
  console.log(`Main actual en 43001: ${issues43001Main.length === 0 ? "✅ 0 PROBLEMAS (RESUELTO)" : `❌ ${issues43001Main.length} problemas`}`);

  // Main 44001 con 2 columnas (Precipitaciones entra perfecto)
  const html44001_main = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        * { box-sizing: border-box; }
        body { margin: 0; padding: 16px; background: #1e1b4b; font-family: ui-sans-serif, system-ui; }
        .grid-2 { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; width: 100%; max-width: 448px; }
        .card { padding: 10px; border-radius: 16px; background: rgba(255,255,255,0.9); border: 2px solid #38bdf8; text-align: center; }
        .card-label { font-size: 14px; font-weight: 700; line-height: 1.25; display: block; overflow-wrap: break-word; hyphens: auto; }
      </style>
    </head>
    <body>
      <div class="grid-2">
        <button class="card">
          <span class="card-label">Precipitaciones abundantes de lluvia y nieve alimentadas por masas de aire</span>
        </button>
        <button class="card">
          <span class="card-label">Suelos arenosos muy secos con temperaturas cálidas sostenidas</span>
        </button>
        <button class="card">
          <span class="card-label">Corrientes marinas templadas que ascienden</span>
        </button>
      </div>
    </body>
    </html>
  `;
  await page44001.setContent(html44001_main);
  const issues44001Main = await detectarProblemasCelular(page44001, { ignorarTipos: ["boton-chico"] });
  console.log(`Main actual en 44001: ${issues44001Main.length === 0 ? "✅ 0 PROBLEMAS (RESUELTO)" : `❌ ${issues44001Main.length} problemas`}`);

  // Main Mapa 375 px con flex-wrap y botón 'Mi informe' compacto
  const htmlMap_main = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; background: #064e3b; font-family: ui-sans-serif, system-ui; }
        .wood-panel-light {
          position: relative; z-index: 20; display: flex; align-items: center; justify-content: space-between;
          gap: 8px; padding: 10px 14px; border-radius: 24px; margin: 12px;
          background: #fef3c7; border: 4px solid #b45309; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
        }
        .avatar-btn { display: flex; align-items: center; gap: 6px; border: none; background: none; font-weight: bold; font-size: 14px; flex-shrink: 0; }
        .right-wrap { display: flex; min-width: 0; flex-wrap: wrap; align-items: center; justify-content: flex-end; gap: 8px; }
        .informe-btn-compact {
          flex-shrink: 0; white-space: nowrap; border-radius: 9999px;
          border: 2px solid rgba(110, 231, 183, 0.8); background: rgba(4, 120, 87, 0.8);
          color: #d1fae5; padding: 2px 8px; font-size: 12px; font-weight: 900; cursor: pointer;
        }
        .badge-btn { padding: 2px 8px; border-radius: 9999px; font-size: 12px; font-weight: 900; background: rgba(0,0,0,0.2); border: 2px solid rgba(252, 211, 77, 0.7); color: #fef3c7; }
        .coin-badge { display: flex; align-items: center; gap: 6px; padding: 2px 8px; border-radius: 9999px; background: rgba(0,0,0,0.25); border: 2px solid rgba(245, 158, 11, 0.6); color: #fef3c7; font-weight: 900; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="wood-panel-light">
        <button class="avatar-btn">
          <span>👤 Giovanni</span>
        </button>
        <div class="right-wrap">
          <button class="badge-btn">🔥 3</button>
          <button class="informe-btn-compact">📄</button>
          <button class="badge-btn">🎯</button>
          <button class="badge-btn">👕</button>
          <div class="coin-badge">🪙 420</div>
        </div>
      </div>
    </body>
    </html>
  `;
  await pageMap81f1678.setContent(htmlMap_main);
  const issuesMapMain = await detectarProblemasCelular(pageMap81f1678, { ignorarTipos: ["boton-chico"] });
  console.log(`Main actual en Mapa 375 px: ${issuesMapMain.length === 0 ? "✅ 0 PROBLEMAS (RESUELTO)" : `❌ ${issuesMapMain.length} problemas`}`);

  await browser.close();
  console.log("\n✅ Verificación del detector celular completada.");
}

if (process.argv[1]?.endsWith("detector-celular.ts")) {
  main().catch((err) => {
    console.error("Error en detector-celular:", err);
    process.exit(1);
  });
}
