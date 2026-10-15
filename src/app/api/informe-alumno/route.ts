// Endpoint para que el alumno (o el docente desde el panel) descargue su informe pedagógico en PDF.
// GET /api/informe-alumno?code=...&periodo=mes|trimestre|ano

import { NextRequest } from "next/server";
import { findStudentByCode, getProgress, syncStudentWithPlatform } from "@/lib/data";
import { isTrialExpired } from "@/lib/openClassroomShared";
import { getAllCurriculumEntries } from "@/lib/curriculo";
import { checkAdminPassword } from "@/lib/auth";
import { fechaAR, informeAlumnoActivo } from "@/lib/eventos/config";
import { cargarEventosConfig } from "@/lib/eventos/server";
import { ReportPeriod } from "@/lib/familyReport";
import { armarInformeAlumno, pdfDelInforme } from "@/lib/informeAlumno/pdf";
import {
  checkCodeRateLimit,
  codigoDe,
  getClientIp,
  recordFailedCodeAttempt,
  recordSuccessfulCodeAttempt,
} from "@/lib/rateLimit";

function sanitizarNombreArchivo(nombre: string): string {
  const sinTildes = nombre
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return sinTildes || "alumno";
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code")?.trim().toUpperCase();
  const periodoParam = searchParams.get("periodo");
  const periodo: ReportPeriod =
    periodoParam === "trimestre" || periodoParam === "ano" ? periodoParam : "mes";

  // Verificación de acceso docente con x-admin-password (permite al docente previsualizar / descargar el informe)
  const adminHeader = request.headers.get("x-admin-password") || searchParams.get("adminPassword") || "";
  const esDocente = checkAdminPassword(adminHeader);

  const ip = getClientIp(request);

  if (!esDocente) {
    const rateLimit = await checkCodeRateLimit(ip, await codigoDe(request));
    if (rateLimit.blocked) {
      return Response.json(
        { error: "Demasiados intentos fallidos. Esperá unos minutos y probá de nuevo.", blocked: true },
        { status: 429 }
      );
    }
  }

  if (!code) {
    return Response.json({ error: "Falta el código de alumno." }, { status: 400 });
  }

  const student = (await syncStudentWithPlatform(code)) ?? (await findStudentByCode(code));
  if (!student) {
    if (!esDocente) {
      await recordFailedCodeAttempt(ip);
    }
    return Response.json({ error: "Código no encontrado." }, { status: 404 });
  }

  if (!esDocente) {
    await recordSuccessfulCodeAttempt(ip, student.code);
  }

  if (isTrialExpired(student)) {
    return Response.json({ error: "Tu período de prueba terminó." }, { status: 403 });
  }

  // El servidor controla el interruptor si es el alumno quien descarga
  if (!esDocente) {
    await cargarEventosConfig();
    const habilitado = informeAlumnoActivo(student.grade ?? 3, new Date());
    if (!habilitado) {
      return Response.json(
        { error: "Tu docente todavía no habilitó el informe." },
        { status: 403 }
      );
    }
  }

  // Generar informe
  const progress = await getProgress(student.code);
  const curriculum = getAllCurriculumEntries();
  const informe = armarInformeAlumno(student, progress, curriculum, periodo);
  const pdfBytes = await pdfDelInforme(informe);

  const { dia } = fechaAR(new Date());
  const nombreSinTildes = sanitizarNombreArchivo(student.name);
  const filename = `informe-${nombreSinTildes}-${dia}.pdf`;

  return new Response(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
