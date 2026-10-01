import { NextRequest } from "next/server";
import { checkAdminPassword } from "@/lib/auth";
import {
  getOpenClassroomConfig,
  getOpenClassroomRatings,
  getOpenClassroomStats,
  saveOpenClassroomConfig,
} from "@/lib/openClassroom";

export async function GET(request: NextRequest) {
  const adminPassword = request.nextUrl.searchParams.get("adminPassword");
  if (!adminPassword || !checkAdminPassword(adminPassword)) {
    return Response.json({ error: "No autorizado." }, { status: 401 });
  }

  const [config, stats, ratings] = await Promise.all([
    getOpenClassroomConfig(),
    getOpenClassroomStats(),
    getOpenClassroomRatings(),
  ]);

  return Response.json({
    config,
    stats,
    ratings,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { adminPassword, open, capacity, trialDays } = body as {
      adminPassword?: string;
      open?: boolean;
      capacity?: number;
      trialDays?: number;
    };

    if (!adminPassword || !checkAdminPassword(adminPassword)) {
      return Response.json({ error: "No autorizado." }, { status: 401 });
    }

    const current = await getOpenClassroomConfig();
    const next = {
      open: typeof open === "boolean" ? open : current.open,
      capacity:
        typeof capacity === "number" && capacity >= 1 && capacity <= 1000
          ? Math.round(capacity)
          : current.capacity,
      trialDays:
        typeof trialDays === "number" && trialDays >= 1 && trialDays <= 365
          ? Math.round(trialDays)
          : current.trialDays,
    };

    await saveOpenClassroomConfig(next);
    const stats = await getOpenClassroomStats();

    return Response.json({ ok: true, config: next, stats });
  } catch {
    return Response.json(
      { error: "Error al actualizar la configuración." },
      { status: 500 }
    );
  }
}
