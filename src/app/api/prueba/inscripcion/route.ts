import { NextRequest } from "next/server";
import { getOpenClassroomStats, registerOpenClassroomStudent } from "@/lib/openClassroom";

export async function GET() {
  const stats = await getOpenClassroomStats();
  return Response.json({
    open: stats.open,
    available: stats.open && stats.totalEnrolled < stats.capacity,
    capacity: stats.capacity,
    trialDays: stats.trialDays,
    totalEnrolled: stats.totalEnrolled,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, consent, honeypot } = body as {
      name?: string;
      consent?: boolean;
      honeypot?: string;
    };

    // Filtro anti-bots (campo trampa)
    if (honeypot) {
      return Response.json({ error: "Solicitud rechazada." }, { status: 400 });
    }

    if (!consent) {
      return Response.json(
        { error: "La persona adulta responsable debe aceptar las condiciones de la prueba." },
        { status: 400 }
      );
    }

    if (!name || typeof name !== "string") {
      return Response.json(
        { error: "Por favor indicá el nombre del estudiante." },
        { status: 400 }
      );
    }

    // IP del cliente para el límite anti-abuso
    const forwardedFor = request.headers.get("x-forwarded-for");
    const clientIp =
      (forwardedFor ? forwardedFor.split(",")[0].trim() : null) ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    const result = await registerOpenClassroomStudent(name, clientIp);
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
