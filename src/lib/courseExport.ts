import { Student, StudentProgress } from "@/types";
import { getWorld } from "@/lib/worlds";
import { getMasteryThreshold } from "@/lib/courseSummary";
import { CurriculumEntry } from "@/lib/curriculo";

export function generateCourseCSV(
  students: Student[],
  progressMap: Record<string, StudentProgress>,
  worldIds: number[],
  curriculumEntries: Record<string, CurriculumEntry> = {}
): string {
  // Encabezados fijos
  const headers = [
    "Alumno",
    "Código",
    "Grado",
    "Mundos Completados",
    "Precisión Global (%)",
    "Tiempo Total (min)",
    "Actividades Últimos 7 Días",
    "Mundos a Fortalecer",
    "Mundos Pendientes de Refuerzo",
  ];

  // Columnas dinámicas por cada mundo
  for (const wid of worldIds) {
    const w = getWorld(wid);
    const curr = curriculumEntries[String(wid)];
    const name = w?.name ?? `Mundo ${wid}`;
    const areaTag = curr ? ` [${curr.area}]` : "";
    headers.push(`M${wid} - ${name}${areaTag} (%)`);
  }

  const now = Date.now();
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

  const rows: string[] = [headers.join(";")];

  for (const s of students) {
    const p = progressMap[s.code];
    const grade = s.grade ?? 3;
    const completedCount = p?.completedWorlds?.length ?? 0;

    // Calcular precisión global y tiempo
    let totalCorrect = 0;
    let totalAttempts = 0;
    let totalTimeSec = 0;
    let active7DaysCount = 0;

    if (p) {
      for (const sum of Object.values(p.activitySummary ?? {})) {
        totalCorrect += sum.correct;
        totalAttempts += sum.correct + sum.incorrect;
        totalTimeSec += sum.timeSpentSeconds ?? 0;
      }
      for (const log of p.activityLog ?? []) {
        totalCorrect += log.correct;
        totalAttempts += log.correct + log.incorrect;
        totalTimeSec += log.timeSpentSeconds ?? 0;
        const t = new Date(log.finishedAt).getTime();
        if (!isNaN(t) && t >= now - sevenDaysMs) {
          active7DaysCount++;
        }
      }
    }

    const accuracyPct =
      totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
    const timeMin = Math.round(totalTimeSec / 60);

    const needingReviewNames = (p?.worldsNeedingTeacherReview ?? [])
      .map((id) => getWorld(id)?.name ?? `M${id}`)
      .join(", ");

    const pendingRetryNames = (p?.worldsPendingReinforcementRetry ?? [])
      .map((id) => getWorld(id)?.name ?? `M${id}`)
      .join(", ");

    const rowCells = [
      `"${s.name.replace(/"/g, '""')}"`,
      s.code,
      `${grade}.º`,
      completedCount.toString(),
      totalAttempts > 0 ? `${accuracyPct}%` : "0%",
      timeMin.toString(),
      active7DaysCount.toString(),
      `"${needingReviewNames.replace(/"/g, '""')}"`,
      `"${pendingRetryNames.replace(/"/g, '""')}"`,
    ];

    // Celdas por mundo
    for (const wid of worldIds) {
      if (!p) {
        rowCells.push("No jugado");
        continue;
      }

      const best =
        p.bestWorldScore?.[wid] ?? p.lastWorldAttemptScore?.[wid];
      const completed = p.completedWorlds?.includes(wid);
      const pending = p.worldsPendingReinforcementRetry?.includes(wid);
      const threshold = getMasteryThreshold(grade);

      if (best !== undefined) {
        rowCells.push(`${best}%`);
      } else if (completed || pending) {
        rowCells.push(`${threshold}%`);
      } else {
        const sum = p.activitySummary?.[wid];
        const log = p.activityLog?.filter((a) => a.worldId === wid) ?? [];
        const answered = (sum?.correct ?? 0) + (sum?.incorrect ?? 0) + log.length;
        if (answered > 0) {
          const cor = (sum?.correct ?? 0) + log.filter((a) => a.correct > 0).length;
          rowCells.push(`${Math.round((cor / answered) * 100)}%`);
        } else {
          rowCells.push("No jugado");
        }
      }
    }

    rows.push(rowCells.join(";"));
  }

  // Retornar con BOM para compatibilidad con Excel en español
  return "\uFEFF" + rows.join("\r\n");
}

export function downloadCourseCSV(filename: string, csvContent: string): void {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
