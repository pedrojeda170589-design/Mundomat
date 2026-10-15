// Genera los PDFs de prueba para las capturas de AG-33 y los renderiza como PNGs.
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import type { Student, StudentProgress } from "@/types";
import { armarInformeAlumno, pdfDelInforme } from "@/lib/informeAlumno/pdf";
import { sumarPartida } from "@/lib/torneo/prioridades";
import { PENALIDAD_ERROR_MS } from "@/lib/torneo/tiempos";

const CAPTURAS_DIR = path.join(process.cwd(), "docs", "equipo", "capturas", "ag33");

async function main() {
  if (!fs.existsSync(CAPTURAS_DIR)) {
    fs.mkdirSync(CAPTURAS_DIR, { recursive: true });
  }

  // 1. Alumno de 3.º grado con tablas variadas
  const alumno3ro: Student = {
    code: "SANTI3RO",
    name: "Santiago Benjamín Solorza Gómez",
    grade: 3,
    type: "aula",
    createdAt: "2026-03-01T10:00:00Z",
  };

  let stats3ro: StudentProgress["tablasStats"] = undefined;
  // Tablas con facilidad: 2, 4, 6 (rápidas y sin errores)
  for (const t of [2, 4, 6]) {
    stats3ro = sumarPartida(stats3ro, t, { ms: 18000, errores: 0, dia: "2026-10-10" });
    stats3ro = sumarPartida(stats3ro, t, { ms: 19000, errores: 0, dia: "2026-10-12" });
  }
  // Tablas en camino: 3, 5 (sin errores pero lentas, entre oro y plata)
  for (const t of [3, 5]) {
    stats3ro = sumarPartida(stats3ro, t, { ms: 33000, errores: 0, dia: "2026-10-11" });
    stats3ro = sumarPartida(stats3ro, t, { ms: 34000, errores: 0, dia: "2026-10-13" });
  }
  // Tablas que le cuestan: 7, 8 (con errores y tiempo alto)
  stats3ro = sumarPartida(stats3ro, 7, { ms: 38000 + 2 * PENALIDAD_ERROR_MS, errores: 2, dia: "2026-10-09" });
  stats3ro = sumarPartida(stats3ro, 7, { ms: 40000 + 2 * PENALIDAD_ERROR_MS, errores: 2, dia: "2026-10-13" });
  stats3ro = sumarPartida(stats3ro, 8, { ms: 42000 + 3 * PENALIDAD_ERROR_MS, errores: 3, dia: "2026-10-08" });
  stats3ro = sumarPartida(stats3ro, 8, { ms: 45000 + 3 * PENALIDAD_ERROR_MS, errores: 3, dia: "2026-10-12" });
  // Tablas sin practicar: 9 y 10 (sin partidas en stats3ro)

  const progress3ro: StudentProgress = {
    code: "SANTI3RO",
    completedWorlds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    bestWorldScore: { "1": 100, "2": 95, "3": 90, "4": 85 },
    activityLog: [
      { worldId: 1, activityIndex: 0, correct: 10, incorrect: 1, timeSpentSeconds: 120, finishedAt: new Date(Date.now() - 2 * 86400000).toISOString() },
      { worldId: 2, activityIndex: 0, correct: 8, incorrect: 2, timeSpentSeconds: 150, finishedAt: new Date(Date.now() - 5 * 86400000).toISOString() },
      { worldId: 3, activityIndex: 0, correct: 9, incorrect: 1, timeSpentSeconds: 110, finishedAt: new Date(Date.now() - 10 * 86400000).toISOString() },
    ],
    tablasStats: stats3ro,
    coins: 140,
  };

  const informe3ro = armarInformeAlumno(alumno3ro, progress3ro, {}, "mes", "N.° 14 Río Gallegos");
  const pdfBytes3ro = await pdfDelInforme(informe3ro);
  const pdfPath3ro = path.join(CAPTURAS_DIR, "informe-3ro-variado.pdf");
  fs.writeFileSync(pdfPath3ro, pdfBytes3ro);
  console.log("PDF 3.º generado:", pdfPath3ro);

  // 2. Alumno de 1.º grado (sin sección de tablas)
  const alumno1ro: Student = {
    code: "MARTINA1",
    name: "Martina Fernández",
    grade: 1,
    type: "aula",
    createdAt: "2026-03-01T10:00:00Z",
  };

  const progress1ro: StudentProgress = {
    code: "MARTINA1",
    completedWorlds: [101, 102, 103, 104],
    bestWorldScore: { "101": 90, "102": 85 },
    activityLog: [
      { worldId: 101, activityIndex: 0, correct: 8, incorrect: 1, timeSpentSeconds: 90, finishedAt: new Date(Date.now() - 3 * 86400000).toISOString() },
      { worldId: 102, activityIndex: 0, correct: 7, incorrect: 2, timeSpentSeconds: 100, finishedAt: new Date(Date.now() - 7 * 86400000).toISOString() },
    ],
    coins: 45,
  };

  const informe1ro = armarInformeAlumno(alumno1ro, progress1ro, {}, "mes", "N.° 14 Río Gallegos");
  const pdfBytes1ro = await pdfDelInforme(informe1ro);
  const pdfPath1ro = path.join(CAPTURAS_DIR, "informe-1ro.pdf");
  fs.writeFileSync(pdfPath1ro, pdfBytes1ro);
  console.log("PDF 1.º generado:", pdfPath1ro);

  // 3. Alumno recién creado sin actividad
  const alumnoNuevo: Student = {
    code: "LUCASNUEVO",
    name: "Lucas Pereyra",
    grade: 3,
    type: "aula",
    createdAt: new Date().toISOString(),
  };

  const progressNuevo: StudentProgress = {
    code: "LUCASNUEVO",
    completedWorlds: [],
    coins: 0,
    activityLog: [],
  };

  const informeNuevo = armarInformeAlumno(alumnoNuevo, progressNuevo, {}, "mes", "N.° 14 Río Gallegos");
  const pdfBytesNuevo = await pdfDelInforme(informeNuevo);
  const pdfPathNuevo = path.join(CAPTURAS_DIR, "informe-sin-actividad.pdf");
  fs.writeFileSync(pdfPathNuevo, pdfBytesNuevo);
  console.log("PDF Alumno nuevo generado:", pdfPathNuevo);

  // Renderizar las páginas a PNG usando Python y pypdfium2
  const scriptPy = `
import pypdfium2 as pdfium
import os

cases = [
    ("informe-3ro-variado.pdf", "alumno-3ro-variado"),
    ("informe-1ro.pdf", "alumno-1ro"),
    ("informe-sin-actividad.pdf", "alumno-sin-actividad"),
]

for pdf_name, prefix in cases:
    pdf_path = os.path.join(r"${CAPTURAS_DIR}", pdf_name)
    pdf = pdfium.PdfDocument(pdf_path)
    for i, page in enumerate(pdf):
        img = page.render(scale=1.5).to_pil()
        out_name = f"{prefix}-pag{i+1}.png"
        out_path = os.path.join(r"${CAPTURAS_DIR}", out_name)
        img.save(out_path)
        print(f"Guardada imagen: {out_name} ({img.width}x{img.height})")
`;
  fs.writeFileSync(path.join(CAPTURAS_DIR, "render_pngs.py"), scriptPy, "utf-8");
  execSync(`python "${path.join(CAPTURAS_DIR, "render_pngs.py")}"`, { stdio: "inherit" });
  fs.unlinkSync(path.join(CAPTURAS_DIR, "render_pngs.py"));

  console.log("¡Todas las páginas de PDF fueron pasadas a PNG!");
}

main().catch(console.error);
