import { NextRequest } from "next/server";
import { checkAdminPassword } from "@/lib/auth";
import { getStudents, getProgressMany, getTeacherAlertConfig, setTeacherAlertConfig } from "@/lib/data";
import { computeTeacherAlerts } from "@/lib/activityMetrics";
import { StudentProgress } from "@/types";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const adminPassword =
    url.searchParams.get("adminPassword") || request.headers.get("x-admin-password");

  if (!adminPassword || !checkAdminPassword(adminPassword)) {
    return Response.json({ error: "No autorizado" }, { status: 401 });
  }

  const config = await getTeacherAlertConfig();
  const students = await getStudents();
  const progressList = await getProgressMany(students.map((s) => s.code));

  const progressMap: Record<string, StudentProgress> = {};
  for (let i = 0; i < students.length; i++) {
    progressMap[students[i].code] = progressList[i];
  }

  const alerts = computeTeacherAlerts(students, progressMap, config.inactiveDaysThreshold);

  return Response.json({
    ok: true,
    config,
    alerts,
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { adminPassword, inactiveDaysThreshold } = body as {
    adminPassword?: string;
    inactiveDaysThreshold?: number;
  };

  if (!adminPassword || !checkAdminPassword(adminPassword)) {
    return Response.json({ error: "No autorizado" }, { status: 401 });
  }

  if (typeof inactiveDaysThreshold !== "number" || inactiveDaysThreshold <= 0) {
    return Response.json({ error: "Umbral inválido" }, { status: 400 });
  }

  await setTeacherAlertConfig({ inactiveDaysThreshold });
  const updatedConfig = await getTeacherAlertConfig();

  return Response.json({
    ok: true,
    config: updatedConfig,
  });
}
