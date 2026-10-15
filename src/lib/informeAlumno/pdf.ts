// Generación del informe pedagógico en PDF para el alumno y su familia.
// Utiliza pdf-lib y @pdf-lib/fontkit sin dependencias de navegador (compatible con Vercel).

import fs from "fs";
import path from "path";
import { PDFDocument, StandardFonts, rgb, RGB, PDFFont, PDFPage } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { Student, StudentProgress } from "@/types";
import { CurriculumEntry } from "@/lib/curriculo";
import { computeFamilyReportData, ReportPeriod } from "@/lib/familyReport";
import { DESAFIOS } from "@/lib/eventos/config";
import { tablasDelAlumno, GrupoTabla } from "./tablas";

export interface SeccionTablasItem {
  tabla: number;
  texto: string;
  consejo?: string;
}

export interface SeccionTablas {
  conFacilidad: SeccionTablasItem[];
  enCamino: SeccionTablasItem[];
  leCuesta: SeccionTablasItem[];
  sinPracticar: SeccionTablasItem[];
  grilla: { tabla: number; grupo: GrupoTabla }[];
  consejos: { tabla: number; consejo: string }[];
}

export interface InformeAlumno {
  titulo: string;
  alumnoNombre: string;
  grado: number;
  gradoTexto: string;
  periodo: ReportPeriod;
  periodoTexto: string;
  fechaEmision: string;
  escuela?: string;

  logros: {
    mundosSuperados: number;
    tiempoMinutos: number;
    mensajePrecision: string;
    precisionPct: number;
  };

  fortalezas: {
    titulo: string;
    area: string;
    descripcion: string;
  }[];

  tablas?: SeccionTablas;

  recomendaciones: {
    area: string;
    consejo: string;
  }[];

  evolucionSemanal: {
    etiqueta: string;
    actividades: number;
    precisionPct: number;
  }[];

  pie: string;
}

/**
 * Carga los bytes de la fuente Fredoka desde el repo.
 */
function getFredokaBytes(): Buffer {
  const p1 = path.join(process.cwd(), "private", "fuentes", "Fredoka.ttf");
  if (fs.existsSync(p1)) return fs.readFileSync(p1);
  const p2 = path.join(process.cwd(), "scripts", "videos", "Fredoka.ttf");
  if (fs.existsSync(p2)) return fs.readFileSync(p2);
  throw new Error("No se encontró el archivo de fuente Fredoka.ttf");
}

/**
 * Separa los datos del informe del dibujo del PDF.
 * IMPORTANTE: No incluye el código del alumno ni compara con otros alumnos.
 */
export function armarInformeAlumno(
  student: Student,
  progress: StudentProgress,
  curriculum: Record<string, CurriculumEntry> = {},
  periodo: ReportPeriod = "mes",
  escuela?: string
): InformeAlumno {
  const familyData = computeFamilyReportData(student, progress, curriculum, periodo);
  const resTablas = tablasDelAlumno(progress);

  const grade = student.grade ?? 3;
  // Solo se muestra la sección de tablas si el grado tiene repaso de tablas o si hay datos
  const tieneRepasoTablas = (DESAFIOS.repasoTablas.grados as readonly number[]).includes(grade);
  const mostrarTablas = tieneRepasoTablas || resTablas.tieneDatos;

  let seccionTablas: SeccionTablas | undefined = undefined;
  if (mostrarTablas) {
    seccionTablas = {
      conFacilidad: resTablas.conFacilidad.map((t) => ({ tabla: t.tabla, texto: t.texto })),
      enCamino: resTablas.enCamino.map((t) => ({ tabla: t.tabla, texto: t.texto })),
      leCuesta: resTablas.leCuesta.map((t) => ({
        tabla: t.tabla,
        texto: t.texto,
        consejo: t.consejo,
      })),
      sinPracticar: resTablas.sinPracticar.map((t) => ({ tabla: t.tabla, texto: t.texto })),
      grilla: resTablas.todas.map((t) => ({ tabla: t.tabla, grupo: t.grupo })),
      consejos: resTablas.leCuesta
        .filter((t): t is typeof t & { consejo: string } => Boolean(t.consejo))
        .map((t) => ({ tabla: t.tabla, consejo: t.consejo })),
    };
  }

  const schoolName = escuela || undefined;
  const pie = schoolName
    ? `Informe generado por MundoTest26 · Escuela ${schoolName}`
    : "Informe generado por MundoTest26";

  return {
    titulo: "Mi informe de MundoTest26",
    alumnoNombre: student.name,
    grado: grade,
    gradoTexto: `${grade}.º grado`,
    periodo,
    periodoTexto: familyData.periodLabel,
    fechaEmision: familyData.generatedDate,
    escuela: schoolName,
    logros: {
      mundosSuperados: familyData.worldsCompleted,
      tiempoMinutos: familyData.totalTimeMinutes,
      mensajePrecision: familyData.accuracyMessage,
      precisionPct: familyData.accuracyPct,
    },
    fortalezas: familyData.strengths.map((s) => ({
      titulo: s.worldName,
      area: s.area,
      descripcion: s.description,
    })),
    tablas: seccionTablas,
    recomendaciones: familyData.recommendations.map((r) => ({
      area: r.area,
      consejo: r.tipForHome,
    })),
    evolucionSemanal: familyData.weeklyEvolution.map((w) => ({
      etiqueta: w.weekLabel.replace("Sem. ", ""),
      actividades: w.activitiesCount,
      precisionPct: w.accuracyPct,
    })),
    pie,
  };
}

// Colores del informe
const PRIMARY = rgb(0.25, 0.28, 0.68); // #3f47ad
const TEXT_DARK = rgb(0.12, 0.16, 0.22); // #1f2937
const TEXT_MUTED = rgb(0.42, 0.46, 0.53); // #6b7280
const BORDER_LIGHT = rgb(0.88, 0.90, 0.93); // #e2e8f0
const BG_CARD = rgb(0.98, 0.99, 1.0); // #fafcff
const WHITE = rgb(1, 1, 1);

// Colores de la grilla de tablas
const GRUPO_COLORES: Record<
  GrupoTabla,
  { bg: RGB; text: RGB; border: RGB; label: string }
> = {
  "con-facilidad": {
    bg: rgb(0.86, 0.96, 0.90),
    text: rgb(0.08, 0.45, 0.22),
    border: rgb(0.65, 0.88, 0.72),
    label: "La maneja con facilidad",
  },
  "en-camino": {
    bg: rgb(0.99, 0.96, 0.82),
    text: rgb(0.55, 0.40, 0.05),
    border: rgb(0.95, 0.85, 0.50),
    label: "Va en camino",
  },
  "le-cuesta": {
    bg: rgb(0.99, 0.91, 0.91),
    text: rgb(0.70, 0.15, 0.15),
    border: rgb(0.96, 0.70, 0.70),
    label: "Le cuesta",
  },
  "sin-practicar": {
    bg: rgb(0.93, 0.94, 0.95),
    text: rgb(0.45, 0.48, 0.52),
    border: rgb(0.80, 0.83, 0.86),
    label: "Todavía no la practicó",
  },
};

/**
 * Limpia emojis y caracteres no imprimibles para evitar errores de renderizado.
 */
// Helvetica (WinAnsi) solo tiene Latin-1 y unos pocos signos más: con un
// nombre como «Łukasz» o «Dvořák» pdf-lib tiraba error y no salía el informe.
// Lo que no entra se pasa a la letra sin tilde (ř → r, Ł → L) o se quita.
const WINANSI_EXTRA = new Set("€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ");
const SIN_DESCOMPONER: Record<string, string> = { Ł: "L", ł: "l", Đ: "D", đ: "d", Ħ: "H", ħ: "h", ı: "i" };
function sanitizeText(str: string): string {
  let out = "";
  for (const ch of str) {
    const c = ch.codePointAt(0) ?? 0;
    if ((c >= 0x20 && c <= 0x7e) || (c >= 0xa0 && c <= 0xff) || WINANSI_EXTRA.has(ch) || ch === "\n") {
      out += ch;
      continue;
    }
    const base = SIN_DESCOMPONER[ch] ?? ch.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if ([...base].every((b) => (b.codePointAt(0) ?? 0) >= 0x20 && (b.codePointAt(0) ?? 0) <= 0x7e)) out += base;
  }
  return out;
}

/**
 * Divide un texto largo en líneas para que entre en maxWidth.
 */
function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const clean = sanitizeText(text);
  const words = clean.split(/\s+/);
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (font.widthOfTextAtSize(testLine, size) <= maxWidth) {
      currentLine = testLine;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

/**
 * Dibuja un rectángulo con borde opcional.
 */
function drawBox(
  page: PDFPage,
  x: number,
  y: number,
  width: number,
  height: number,
  bgColor: RGB,
  borderColor?: RGB,
  borderWidth: number = 1
) {
  page.drawRectangle({
    x,
    y,
    width,
    height,
    color: bgColor,
    borderColor: borderColor ?? bgColor,
    borderWidth: borderColor ? borderWidth : 0,
  });
}

/**
 * Dibuja una barra de progreso / porcentaje.
 */
function drawProgressBar(
  page: PDFPage,
  x: number,
  y: number,
  width: number,
  height: number,
  pct: number,
  barColor: RGB,
  trackColor: RGB
) {
  drawBox(page, x, y, width, height, trackColor);
  const fillWidth = Math.max(0, Math.min(width, (width * pct) / 100));
  if (fillWidth > 0) {
    drawBox(page, x, y, fillWidth, height, barColor);
  }
}

/**
 * Dibuja el informe completo en PDF y devuelve los bytes Uint8Array.
 * Produce 1 página (si no hay sección de tablas o si es breve) o 2 páginas.
 */
export async function pdfDelInforme(informe: InformeAlumno): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);

  const fontTitle = await doc.embedFont(getFredokaBytes());
  const fontBody = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  const PAGE_WIDTH = 595.28;
  const PAGE_HEIGHT = 841.89;
  const MARGIN_LEFT = 40;
  const MARGIN_RIGHT = 40;
  const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT; // 515.28

  let page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = PAGE_HEIGHT - 38;

  function drawFooter(p: PDFPage, num: number, total: number) {
    const footY = 25;
    p.drawLine({
      start: { x: MARGIN_LEFT, y: footY + 14 },
      end: { x: PAGE_WIDTH - MARGIN_RIGHT, y: footY + 14 },
      thickness: 0.5,
      color: BORDER_LIGHT,
    });
    p.drawText(sanitizeText(informe.pie), {
      x: MARGIN_LEFT,
      y: footY,
      size: 8,
      font: fontBody,
      color: TEXT_MUTED,
    });
    const pageStr = `Página ${num} de ${total}`;
    const pageW = fontBody.widthOfTextAtSize(pageStr, 8);
    p.drawText(pageStr, {
      x: PAGE_WIDTH - MARGIN_RIGHT - pageW,
      y: footY,
      size: 8,
      font: fontBody,
      color: TEXT_MUTED,
    });
  }

  // --- 1. ENCABEZADO ---
  // Franja superior con marca
  page.drawText("MundoTest26", {
    x: MARGIN_LEFT,
    y,
    size: 14,
    font: fontTitle,
    color: PRIMARY,
  });
  const subMarca = "Informe Pedagógico Escolar";
  page.drawText(subMarca, {
    x: MARGIN_LEFT + fontTitle.widthOfTextAtSize("MundoTest26", 14) + 10,
    y: y + 1,
    size: 8.5,
    font: fontBold,
    color: TEXT_MUTED,
  });

  y -= 26;
  page.drawText(sanitizeText(informe.titulo), {
    x: MARGIN_LEFT,
    y,
    size: 20,
    font: fontTitle,
    color: PRIMARY,
  });

  y -= 8;
  const cardH = 46;
  y -= cardH;
  drawBox(page, MARGIN_LEFT, y, CONTENT_WIDTH, cardH, BG_CARD, BORDER_LIGHT);

  const datosFicha = [
    { label: "Estudiante", val: informe.alumnoNombre, width: 175 },
    { label: "Grado", val: informe.gradoTexto, width: 80 },
    { label: "Período", val: informe.periodoTexto.split("(")[0].trim(), width: 135 },
    { label: "Emisión", val: informe.fechaEmision, width: 110 },
  ];

  let currentX = MARGIN_LEFT + 12;
  datosFicha.forEach((d) => {
    page.drawText(d.label.toUpperCase(), {
      x: currentX,
      y: y + 28,
      size: 7,
      font: fontBold,
      color: TEXT_MUTED,
    });
    const valLines = wrapText(d.val, fontBold, 9, d.width - 12);
    if (valLines.length === 1) {
      page.drawText(valLines[0], {
        x: currentX,
        y: y + 13,
        size: 9,
        font: fontBold,
        color: TEXT_DARK,
      });
    } else {
      page.drawText(valLines[0], {
        x: currentX,
        y: y + 16,
        size: 8.5,
        font: fontBold,
        color: TEXT_DARK,
      });
      page.drawText(valLines[1], {
        x: currentX,
        y: y + 5.5,
        size: 8.5,
        font: fontBold,
        color: TEXT_DARK,
      });
    }
    currentX += d.width;
  });

  y -= 18;

  // --- 2. LO QUE LOGRÉ ---
  page.drawText("Lo que logré", {
    x: MARGIN_LEFT,
    y,
    size: 13,
    font: fontTitle,
    color: PRIMARY,
  });

  y -= 6;
  const logrosBoxH = 68;
  y -= logrosBoxH;
  drawBox(page, MARGIN_LEFT, y, CONTENT_WIDTH, logrosBoxH, WHITE, BORDER_LIGHT);

  // 3 métricas destacadas
  const metricColW = (CONTENT_WIDTH - 24) / 3;
  const metricas = [
    { num: String(informe.logros.mundosSuperados), label: "Mundos superados" },
    { num: `${informe.logros.tiempoMinutos} min`, label: "Tiempo de práctica" },
    {
      num: informe.logros.precisionPct > 0 ? `${informe.logros.precisionPct}%` : "—",
      label: "Precisión general",
    },
  ];

  metricas.forEach((m, i) => {
    const mX = MARGIN_LEFT + 12 + i * metricColW;
    page.drawText(m.num, {
      x: mX,
      y: y + logrosBoxH - 24,
      size: 16,
      font: fontTitle,
      color: PRIMARY,
    });
    page.drawText(m.label, {
      x: mX,
      y: y + logrosBoxH - 36,
      size: 8,
      font: fontBold,
      color: TEXT_MUTED,
    });
  });

  // Mensaje de precisión
  const msgLines = wrapText(informe.logros.mensajePrecision, fontBody, 8.5, CONTENT_WIDTH - 24);
  const msgY = y + 16;
  page.drawText(msgLines[0] || "", {
    x: MARGIN_LEFT + 12,
    y: msgY,
    size: 8.5,
    font: fontBody,
    color: TEXT_DARK,
  });
  if (msgLines[1]) {
    page.drawText(msgLines[1], {
      x: MARGIN_LEFT + 12,
      y: msgY - 10,
      size: 8.5,
      font: fontBody,
      color: TEXT_DARK,
    });
  }

  y -= 18;

  // --- 3. LO QUE MEJOR ME SALE ---
  page.drawText("Lo que mejor me sale", {
    x: MARGIN_LEFT,
    y,
    size: 13,
    font: fontTitle,
    color: PRIMARY,
  });

  y -= 14;
  const fortalezasAMostrar = informe.fortalezas.slice(0, 3);
  if (fortalezasAMostrar.length === 0) {
    page.drawText("Comenzando el recorrido de aprendizajes con entusiasmo y dedicación.", {
      x: MARGIN_LEFT + 10,
      y,
      size: 9,
      font: fontBody,
      color: TEXT_MUTED,
    });
    y -= 16;
  } else {
    for (const fort of fortalezasAMostrar) {
      // Viñeta circular
      page.drawCircle({
        x: MARGIN_LEFT + 5,
        y: y + 3,
        size: 3,
        color: PRIMARY,
      });
      // Título y área
      const titArea = `${fort.titulo} · ${fort.area}`;
      page.drawText(sanitizeText(titArea), {
        x: MARGIN_LEFT + 14,
        y,
        size: 9.5,
        font: fontBold,
        color: TEXT_DARK,
      });
      y -= 12;
      // Descripción envuelta
      const descLines = wrapText(fort.descripcion, fontBody, 8.5, CONTENT_WIDTH - 20);
      for (const line of descLines) {
        page.drawText(line, {
          x: MARGIN_LEFT + 14,
          y,
          size: 8.5,
          font: fontBody,
          color: TEXT_MUTED,
        });
        y -= 10.5;
      }
      y -= 3;
    }
  }

  // --- 4. MIS TABLAS (si corresponde) ---
  if (informe.tablas) {
    y -= 8;
    page.drawText("Mis tablas", {
      x: MARGIN_LEFT,
      y,
      size: 13,
      font: fontTitle,
      color: PRIMARY,
    });

    y -= 8;
    // Grilla horizontal del 2 al 10 en colores
    const numTablas = informe.tablas.grilla.length; // 9
    const gap = 5;
    const boxW = (CONTENT_WIDTH - gap * (numTablas - 1)) / numTablas;
    const boxH = 26;
    y -= boxH;

    for (let i = 0; i < numTablas; i++) {
      const item = informe.tablas.grilla[i];
      const bx = MARGIN_LEFT + i * (boxW + gap);
      const colores = GRUPO_COLORES[item.grupo];

      drawBox(page, bx, y, boxW, boxH, colores.bg, colores.border);

      const numStr = String(item.tabla);
      const numW = fontTitle.widthOfTextAtSize(numStr, 11);
      page.drawText(numStr, {
        x: bx + (boxW - numW) / 2,
        y: y + 7,
        size: 11,
        font: fontTitle,
        color: colores.text,
      });
    }

    y -= 14;
    // Leyenda de 4 colores debajo de la grilla
    const legGrupos: GrupoTabla[] = [
      "con-facilidad",
      "en-camino",
      "le-cuesta",
      "sin-practicar",
    ];
    let legX = MARGIN_LEFT;
    for (const g of legGrupos) {
      const col = GRUPO_COLORES[g];
      page.drawCircle({ x: legX + 3, y: y + 3, size: 3, color: col.text });
      page.drawText(col.label, {
        x: legX + 9,
        y,
        size: 7.5,
        font: fontBold,
        color: col.text,
      });
      legX += fontBold.widthOfTextAtSize(col.label, 7.5) + 16;
    }

    y -= 14;
    // Detalle de tablas agrupadas
    const gruposParaListar = [
      {
        grupo: "con-facilidad" as GrupoTabla,
        titulo: "La maneja con facilidad",
        items: informe.tablas.conFacilidad,
      },
      {
        grupo: "en-camino" as GrupoTabla,
        titulo: "Va en camino",
        items: informe.tablas.enCamino,
      },
      {
        grupo: "le-cuesta" as GrupoTabla,
        titulo: "Le cuesta",
        items: informe.tablas.leCuesta,
      },
      {
        grupo: "sin-practicar" as GrupoTabla,
        titulo: "Todavía no la practicó",
        items: informe.tablas.sinPracticar,
      },
    ];

    for (const gr of gruposParaListar) {
      if (gr.items.length === 0) continue;
      const c = GRUPO_COLORES[gr.grupo];
      for (const item of gr.items) {
        page.drawCircle({ x: MARGIN_LEFT + 6, y: y + 3, size: 2.5, color: c.text });
        page.drawText(sanitizeText(item.texto), {
          x: MARGIN_LEFT + 14,
          y,
          size: 8.5,
          font: fontBody,
          color: TEXT_DARK,
        });
        y -= 11.5;
      }
    }

    // Consejos para la casa de las tablas que le cuestan
    if (informe.tablas.consejos.length > 0) {
      y -= 4;
      page.drawText("Consejos para practicar las tablas en casa:", {
        x: MARGIN_LEFT + 4,
        y,
        size: 9,
        font: fontBold,
        color: PRIMARY,
      });
      y -= 12;
      for (const c of informe.tablas.consejos) {
        page.drawCircle({ x: MARGIN_LEFT + 8, y: y + 3, size: 2, color: PRIMARY });
        const cLines = wrapText(
          `Tabla del ${c.tabla}: ${c.consejo}`,
          fontBody,
          8,
          CONTENT_WIDTH - 24
        );
        for (const line of cLines) {
          page.drawText(line, {
            x: MARGIN_LEFT + 16,
            y,
            size: 8,
            font: fontBody,
            color: TEXT_DARK,
          });
          y -= 10;
        }
      }
    }
  }

  // Si tenemos tablas, pasamos limpiamente a la página 2 para recomendaciones y evolución semanal.
  // Si no tenemos tablas, todo entra en la página 1.
  let totalPaginas = 1;
  if (informe.tablas) {
    totalPaginas = 2;
    drawFooter(page, 1, 2);

    page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    y = PAGE_HEIGHT - 38;

    // Encabezado compacto página 2
    page.drawText("MundoTest26", {
      x: MARGIN_LEFT,
      y,
      size: 12,
      font: fontTitle,
      color: PRIMARY,
    });
    const subTit = `Mi informe · ${informe.alumnoNombre} (${informe.gradoTexto})`;
    page.drawText(sanitizeText(subTit), {
      x: MARGIN_LEFT + fontTitle.widthOfTextAtSize("MundoTest26", 12) + 10,
      y: y + 1,
      size: 8.5,
      font: fontBold,
      color: TEXT_MUTED,
    });
    y -= 22;
  }

  // --- 5. PARA SEGUIR CRECIENDO ---
  y -= 4;
  page.drawText("Para seguir creciendo", {
    x: MARGIN_LEFT,
    y,
    size: 13,
    font: fontTitle,
    color: PRIMARY,
  });
  y -= 10;

  const recs = informe.recomendaciones.slice(0, 3);
  for (const rec of recs) {
    const tipLines = wrapText(rec.consejo, fontBody, 8.5, CONTENT_WIDTH - 24);
    const boxHeight = 22 + tipLines.length * 10.5;
    y -= boxHeight;
    drawBox(page, MARGIN_LEFT, y, CONTENT_WIDTH, boxHeight, BG_CARD, BORDER_LIGHT);

    page.drawText(sanitizeText(rec.area), {
      x: MARGIN_LEFT + 12,
      y: y + boxHeight - 14,
      size: 8.5,
      font: fontBold,
      color: PRIMARY,
    });

    tipLines.forEach((tl, idx) => {
      page.drawText(tl, {
        x: MARGIN_LEFT + 12,
        y: y + boxHeight - 26 - idx * 10.5,
        size: 8.5,
        font: fontBody,
        color: TEXT_DARK,
      });
    });

    y -= 8;
  }

  // --- 6. CÓMO FUE MI SEMANA ---
  y -= 10;
  page.drawText("Cómo fue mi semana", {
    x: MARGIN_LEFT,
    y,
    size: 13,
    font: fontTitle,
    color: PRIMARY,
  });

  y -= 8;
  const chartBoxH = 120;
  y -= chartBoxH;
  drawBox(page, MARGIN_LEFT, y, CONTENT_WIDTH, chartBoxH, WHITE, BORDER_LIGHT);

  page.drawText("Evolución de actividades y precisión en las últimas 6 semanas", {
    x: MARGIN_LEFT + 12,
    y: y + chartBoxH - 16,
    size: 8,
    font: fontBold,
    color: TEXT_MUTED,
  });

  // Barras horizontales por semana
  const semanas = informe.evolucionSemanal;
  const rowH = 14;
  const barMaxW = 240;
  const startY = y + chartBoxH - 32;

  semanas.forEach((sem, idx) => {
    const rowY = startY - idx * rowH;
    page.drawText(sem.etiqueta, {
      x: MARGIN_LEFT + 12,
      y: rowY,
      size: 7.5,
      font: fontBold,
      color: TEXT_MUTED,
    });

    const barX = MARGIN_LEFT + 95;
    const barY = rowY - 1;
    drawProgressBar(
      page,
      barX,
      barY,
      barMaxW,
      7,
      sem.actividades > 0 ? sem.precisionPct : 0,
      PRIMARY,
      BORDER_LIGHT
    );

    const txtDetalle =
      sem.actividades > 0
        ? `${sem.precisionPct}% (${sem.actividades} act.)`
        : "Sin actividad";
    page.drawText(txtDetalle, {
      x: barX + barMaxW + 10,
      y: rowY,
      size: 7.5,
      font: fontBody,
      color: sem.actividades > 0 ? TEXT_DARK : TEXT_MUTED,
    });
  });

  // Pie de página final
  drawFooter(page, totalPaginas, totalPaginas);

  return doc.save();
}
