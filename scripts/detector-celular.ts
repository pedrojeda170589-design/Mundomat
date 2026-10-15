import { Page, chromium } from "playwright";

export interface ProblemaCelular {
  tipo:
    | "desborde-horizontal"
    | "texto-cortado"
    | "palabra-no-entra"
    | "elementos-pisados"
    | "boton-chico"
    | "boton-partido"
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
 * Excepciones justificadas de letra menor a 12 px para elementos secundarios
 * no destinados a la lectura principal de juego del alumno.
 */
export const EXCEPCIONES_LETRA_CHICA = [
  // 1. Pizarrón de novedades: timestamps relativos secundarios ("hace 3 días")
  "li.flex > span.text-white\\/50",
  // 2. Mapas vectoriales SVG: nombres geográficos y coordenadas internas
  "svg text",
  // 3. Atribución cartográfica legal IGN ("Límites: Instituto Geográfico Nacional")
  "p.text-\\[9px\\]",
  // 4. Panel Docente / Admin: gráficos analíticos y badges de estado técnico para adultos
  "div.text-center > p.text-\\[8px\\]",
  "div.text-center > p.text-\\[9px\\]",
  "div.flex > span.text-\\[9px\\]",
  "div.parchment-panel > p.text-\\[11px\\]",
  "div.relative > span.absolute.-top-1",
  "div.flex > span.text-slate-600",
];

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

  const isIgnored = (el: Element): boolean => {
    if (!opciones?.ignorarSelectores?.length) return false;
    return opciones.ignorarSelectores.some((sel) => {
      try {
        return el.matches(sel) || el.closest(sel) !== null;
      } catch {
        return false;
      }
    });
  };

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
  // Se excluyen los que tienen text-overflow: ellipsis a propósito en contenedores de bloque.
  // Si display es flex o grid, text-overflow: ellipsis NO funciona en CSS estándar
  // y por lo tanto es un punto ciego que debe ser marcado como texto cortado.
  // -------------------------------------------------------------
  if (!ignorarTipos.has("texto-cortado")) {
    for (const el of allElements) {
      const h = el as HTMLElement;
      if (!h.offsetParent && h.offsetWidth === 0 && h.offsetHeight === 0) continue;
      if (isIgnored(h)) continue;
      const cs = window.getComputedStyle(h);
      if (cs.display === "none" || cs.visibility === "hidden" || cs.opacity === "0") continue;

      const hasText = Array.from(h.childNodes).some(
        (n) => n.nodeType === Node.TEXT_NODE && (n.textContent || "").trim().length > 0
      );
      if (!hasText) continue;

      const isFlexOrGrid =
        cs.display === "flex" ||
        cs.display === "inline-flex" ||
        cs.display === "grid" ||
        cs.display === "inline-grid";

      // En CSS, text-overflow: ellipsis sólo funciona en block containers.
      // En flex/grid contenedores, el texto se corta bruscamente sin generar puntos suspensivos (...).
      const isEllipsis =
        !isFlexOrGrid &&
        (cs.textOverflow === "ellipsis" ||
          h.classList.contains("truncate") ||
          (cs.webkitLineClamp && cs.webkitLineClamp !== "none"));

      if (isEllipsis) continue;

      // Desborde horizontal del contenedor de texto si tiene overflow hidden o clip
      if (cs.overflowX === "hidden" || cs.overflowX === "clip") {
        if (h.clientWidth > 0 && h.scrollWidth > h.clientWidth + tol) {
          const txt = getCleanText(h);
          if (txt.length > 0) {
            const rect = h.getBoundingClientRect();
            const flexNote = isFlexOrGrid && (cs.textOverflow === "ellipsis" || h.classList.contains("truncate"))
              ? " (truncate en display flex/grid no muestra puntos suspensivos)"
              : "";
            problemas.push({
              tipo: "texto-cortado",
              selector: getSelector(h),
              texto: txt.slice(0, 40),
              detalle: `Texto cortado horizontalmente${flexNote}: scrollWidth (${Math.round(h.scrollWidth)}px) > clientWidth (${Math.round(h.clientWidth)}px)`,
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
      if (isIgnored(h)) continue;
      const cs = window.getComputedStyle(h);
      if (cs.display === "none" || cs.visibility === "hidden" || cs.opacity === "0") continue;

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
      if (isIgnored(bar)) continue;
      const candidates = Array.from(
        bar.querySelectorAll("button, a, [role='button'], .font-bold, .font-semibold, h1, h2, h3")
      ).filter((c) => {
        const h = c as HTMLElement;
        if (h.offsetWidth === 0 && h.offsetHeight === 0) return false;
        if (isIgnored(h)) return false;
        const cs = window.getComputedStyle(h);
        if (cs.display === "none" || cs.visibility === "hidden" || cs.opacity === "0") return false;
        if (cs.position === "fixed") return false;
        const txt = getCleanText(h);
        return txt.length > 0 || h.tagName === "BUTTON";
      });

      for (let i = 0; i < candidates.length; i++) {
        for (let j = i + 1; j < candidates.length; j++) {
          const a = candidates[i] as HTMLElement;
          const b = candidates[j] as HTMLElement;
          if (a.contains(b) || b.contains(a)) continue;

          const btnA = a.closest("button, a, [role='button']");
          const btnB = b.closest("button, a, [role='button']");
          if (btnA && btnA === btnB) continue;

          const rectA = a.getBoundingClientRect();
          const rectB = b.getBoundingClientRect();

          const xOverlap = Math.min(rectA.right, rectB.right) - Math.max(rectA.left, rectB.left);
          const yOverlap = Math.min(rectA.bottom, rectB.bottom) - Math.max(rectA.top, rectB.top);

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
  // REGLA 5: Botón partido
  // Un botón o control con texto corto (1 o 2 palabras) que por falta
  // de espacio o compresión en una barra, cabecera o control interactivo
  // se parte en 2 o más renglones.
  // -------------------------------------------------------------
  if (!ignorarTipos.has("boton-partido")) {
    const buttons = Array.from(document.querySelectorAll("button, [role='button'], a.btn"));
    for (const btn of buttons) {
      const h = btn as HTMLElement;
      if (!h.offsetParent && h.offsetWidth === 0 && h.offsetHeight === 0) continue;
      if (isIgnored(h)) continue;
      const cs = window.getComputedStyle(h);
      if (cs.display === "none" || cs.visibility === "hidden" || cs.opacity === "0") continue;

      // Excluir botones diseñados deliberadamente como tarjetas verticales
      if ((cs.display === "flex" || cs.display === "inline-flex") && cs.flexDirection === "column") {
        continue;
      }
      if (h.classList.contains("flex-col") || h.closest(".grid") !== null) {
        continue;
      }

      const txt = getCleanText(h);
      if (!txt) continue;

      // Palabras significativas
      const words = txt.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w));
      if (words.length >= 1 && words.length <= 2) {
        const textNodes: Node[] = [];
        const walkNodes = (node: Node) => {
          if (node.nodeType === Node.TEXT_NODE && (node.textContent || "").trim().length > 0) {
            textNodes.push(node);
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            const elStyle = window.getComputedStyle(node as Element);
            if (
              elStyle.display !== "none" &&
              elStyle.visibility !== "hidden" &&
              elStyle.position !== "absolute" &&
              elStyle.position !== "fixed"
            ) {
              node.childNodes.forEach(walkNodes);
            }
          }
        };
        h.childNodes.forEach(walkNodes);

        let isMultiLine = false;

        const allRects: DOMRect[] = [];
        for (const tn of textNodes) {
          const range = document.createRange();
          range.selectNodeContents(tn);
          const rects = Array.from(range.getClientRects()).filter((r) => r.width > 0 && r.height > 0);
          allRects.push(...rects);
        }

        if (allRects.length >= 2) {
          const yCoords = allRects.map((r) => Math.round(r.top));
          const minY = Math.min(...yCoords);
          const maxY = Math.max(...yCoords);
          const fontSize = parseFloat(cs.fontSize) || 14;
          if (maxY - minY >= fontSize * 0.75) {
            isMultiLine = true;
          }
        }

        if (isMultiLine) {
          const rect = h.getBoundingClientRect();
          problemas.push({
            tipo: "boton-partido",
            selector: getSelector(h),
            texto: txt.slice(0, 30),
            detalle: `Botón de ${words.length} palabra(s) partido en múltiples renglones por falta de espacio`,
            rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
          });
        }
      }
    }
  }

  // -------------------------------------------------------------
  // REGLA 6: Botón chico para un dedo
  // Botón visible de menos de 40 × 40 px
  // -------------------------------------------------------------
  if (!ignorarTipos.has("boton-chico")) {
    const buttons = Array.from(document.querySelectorAll("button, [role='button'], a.btn"));
    for (const btn of buttons) {
      const h = btn as HTMLElement;
      if (!h.offsetParent && h.offsetWidth === 0 && h.offsetHeight === 0) continue;
      if (isIgnored(h)) continue;
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
  // REGLA 7: Letra muy chica
  // Texto visible de menos de 12 px
  // -------------------------------------------------------------
  if (!ignorarTipos.has("letra-chica")) {
    for (const el of allElements) {
      const h = el as HTMLElement;
      if (!h.offsetParent && h.offsetWidth === 0 && h.offsetHeight === 0) continue;
      if (isIgnored(h)) continue;
      const cs = window.getComputedStyle(h);
      if (cs.display === "none" || cs.visibility === "hidden" || cs.opacity === "0") continue;

      const hasDirectText = Array.from(h.childNodes).some(
        (n) => n.nodeType === Node.TEXT_NODE && (n.textContent || "").trim().length > 0
      );
      if (!hasDirectText) continue;

      const fontSize = parseFloat(cs.fontSize) || 16;
      if (fontSize < minLetra - 0.5) {
        const txt = getCleanText(h);
        if (!txt) continue;

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
  // REGLA 8: Fuera de su panel
  // Un botón o texto que se sale del rectángulo de su barra o tarjeta
  // -------------------------------------------------------------
  if (!ignorarTipos.has("fuera-de-panel")) {
    const panels = Array.from(
      document.querySelectorAll(".wood-panel-light, .wood-panel, .parchment-panel, header, nav, [role='toolbar']")
    ).filter((p) => {
      const hp = p as HTMLElement;
      if (hp.offsetWidth === 0 || hp.offsetHeight === 0) return false;
      if (isIgnored(hp)) return false;
      const cs = window.getComputedStyle(hp);
      return cs.display !== "none" && cs.visibility !== "hidden";
    });

    for (const panel of panels) {
      const panelRect = panel.getBoundingClientRect();
      const pCs = window.getComputedStyle(panel);

      if (pCs.overflowX === "auto" || pCs.overflowX === "scroll") continue;

      const items = Array.from(
        panel.querySelectorAll("button, a, [role='button'], CoinBadge, .rounded-full, .font-bold, .font-semibold, span, img")
      );

      for (const item of items) {
        const hi = item as HTMLElement;
        if (hi.offsetWidth === 0 && hi.offsetHeight === 0) continue;
        if (isIgnored(hi)) continue;
        const cs = window.getComputedStyle(hi);
        if (cs.display === "none" || cs.visibility === "hidden" || cs.opacity === "0") continue;
        if (cs.position === "fixed") continue;

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

        const outRight = itemRect.right - (panelRect.right + tol);
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
// VERIFICACIÓN AUTOMÁTICA CLI CONTRA APP REAL
// -------------------------------------------------------------
async function main() {
  const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
  console.log(`=== DETECTOR AUTOMÁTICO EN CELULAR (AG-34) ===`);
  console.log(`Conectando a la aplicación real en: ${BASE_URL}\n`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const page = await context.newPage();

  try {
    const res = await page.goto(`${BASE_URL}/student`, { timeout: 5000 }).catch(() => null);
    if (!res) {
      console.log(`⚠️ No se pudo conectar a ${BASE_URL}. Asegurate de que 'npm run dev' esté corriendo.`);
      await browser.close();
      return;
    }

    const issues = await detectarProblemasCelular(page);
    console.log(`Página /student a 375 px: ${issues.length} problemas detectados.`);
    for (const i of issues) {
      console.log(`  - [${i.tipo}] ${i.texto}: ${i.detalle}`);
    }
  } finally {
    await browser.close();
  }
}

if (process.argv[1]?.endsWith("detector-celular.ts")) {
  main().catch((err) => {
    console.error("Error en detector-celular:", err);
    process.exit(1);
  });
}
