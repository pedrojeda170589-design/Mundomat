import { NextRequest, after } from "next/server";
import { getOpenClassroomStats, registerOpenClassroomStudent } from "@/lib/openClassroom";
import { VERSION_CONDICIONES } from "@/lib/legal/condiciones";
import { anonimizarVencidos } from "@/lib/privacidadPrueba";

export async function GET() {
  // De paso, anonimiza a quienes ya cumplieron 30 días (proceso automático).
  after(() => anonimizarVencidos().catch(() => {}));
  const stats = await getOpenClassroomStats();
  return Response.json({
    open: stats.open,
    available: stats.open && stats.totalEnrolled < stats.capacity,
    capacity: stats.capacity,
    trialDays: stats.trialDays,
    totalEnrolled: stats.totalEnrolled,
    versionCondiciones: VERSION_CONDICIONES,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, consent, honeypot, versionCondiciones } = body as {
      name?: string;
      consent?: boolean;
      honeypot?: string;
      versionCondiciones?: string;
    };

    // Filtro anti-bots (campo trampa)
    if (honeypot) {
      return Response.json({ error: "Solicitud rechazada." }, { status: 400 });
    }

    if (consent !== true) {
      return Response.json(
        { error: "La persona adulta responsable debe aceptar las condiciones de la prueba." },
        { status: 400 }
      );
    }

    if (!name || typeof name !== "string") {
      return Response.json(
        { error: "Por favor indicá un nombre de pila o apodo." },
        { status: 400 }
      );
    }

    // IP del cliente para el límite anti-abuso
    const forwardedFor = request.headers.get("x-forwarded-for");
    const clientIp =
      (forwardedFor ? forwardedFor.split(",")[0].trim() : null) ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    const result = await registerOpenClassroomStudent(name, clientIp, { version: String(versionCondiciones ?? "") });
    if (!result.ok) {
      return Response.json({ error: result.error }, { status: result.status });
    }

    return Response.json({ ok: true, student: result.student });
  } catch {
    return Response.json(
      { error: "Ocurrió un error al procesar la inscripción." },
      { status: 500 }
    );
  }
}
