import { Student, StudentProgress } from "@/types";
import { CurriculumEntry } from "@/lib/curriculo";
import { getWorld } from "@/lib/worlds";

export type ReportPeriod = "mes" | "trimestre" | "ano";

export interface WeeklyEvolutionPoint {
  weekLabel: string;
  startDate: string;
  activitiesCount: number;
  accuracyPct: number;
}

export interface FamilyReportStrength {
  worldId: number;
  worldName: string;
  area: string;
  eje: string;
  contenido: string;
  description: string;
}

export interface FamilyReportRecommendation {
  worldId: number;
  worldName: string;
  area: string;
  eje: string;
  contenido: string;
  tipForHome: string;
}

export interface FamilyReportData {
  studentName: string;
  grade: number;
  period: ReportPeriod;
  periodLabel: string;
  generatedDate: string;
  worldsCompleted: number;
  totalTimeMinutes: number;
  accuracyPct: number;
  accuracyMessage: string;
  weeklyEvolution: WeeklyEvolutionPoint[];
  strengths: FamilyReportStrength[];
  recommendations: FamilyReportRecommendation[];
  generalMessage: string;
  hasActivityInPeriod: boolean;
}

export function computeFamilyReportData(
  student: Student,
  progress: StudentProgress,
  curriculumEntries: Record<string, CurriculumEntry> = {},
  period: ReportPeriod = "mes"
): FamilyReportData {
  const now = Date.now();
  const msInDay = 24 * 60 * 60 * 1000;
  const grade = student.grade ?? 3;

  let periodCutoff = 0;
  let periodLabel = "Último mes (últimos 30 días)";
  if (period === "mes") {
    periodCutoff = now - 30 * msInDay;
    periodLabel = "Último mes (últimos 30 días)";
  } else if (period === "trimestre") {
    periodCutoff = now - 90 * msInDay;
    periodLabel = "Último trimestre (últimos 90 días)";
  } else {
    periodCutoff = 0;
    periodLabel = "Ciclo Lectivo Completo (Año en curso)";
  }

  // Filtrar logs de actividad por período
  const allLogs = progress.activityLog ?? [];
  const periodLogs = periodCutoff === 0
    ? allLogs
    : allLogs.filter((log) => {
        const time = new Date(log.finishedAt).getTime();
        return !isNaN(time) && time >= periodCutoff;
      });

  const hasActivityInPeriod = periodLogs.length > 0;

  // Si no hay actividad en el período corto, calculamos sobre todo el historial para no dejar el informe en blanco
  const logsToUse = hasActivityInPeriod ? periodLogs : allLogs;

  let periodCorrect = 0;
  let periodIncorrect = 0;
  let periodTimeSeconds = 0;

  for (const log of logsToUse) {
    periodCorrect += log.correct;
    periodIncorrect += log.incorrect;
    periodTimeSeconds += log.timeSpentSeconds ?? 0;
  }

  // Si es todo el año o no hubo actividad en logs recientes, sumamos el activitySummary
  if (period === "ano" || (!hasActivityInPeriod && periodCutoff !== 0)) {
    for (const sum of Object.values(progress.activitySummary ?? {})) {
      periodCorrect += sum.correct;
      periodIncorrect += sum.incorrect;
      periodTimeSeconds += sum.timeSpentSeconds ?? 0;
    }
  }

  const totalAttempts = periodCorrect + periodIncorrect;
  const accuracyPct =
    totalAttempts > 0 ? Math.round((periodCorrect / totalAttempts) * 100) : 0;

  const totalTimeMinutes = Math.max(1, Math.round(periodTimeSeconds / 60));

  // Mensaje positivo de precisión para la familia
  let accuracyMessage = "";
  if (accuracyPct >= 85) {
    accuracyMessage =
      "¡Excelente solidez y precisión en los desafíos! Resuelve con seguridad y muy buen nivel de comprensión.";
  } else if (accuracyPct >= 70) {
    accuracyMessage =
      "Muy buen avance y ritmo de aprendizaje. Demuestra constancia y capacidad para superar las dificultades.";
  } else if (accuracyPct >= 50) {
    accuracyMessage =
      "Avance en desarrollo. Con práctica y apoyo familiar en los puntos clave seguirá consolidando los aprendizajes.";
  } else if (totalAttempts > 0) {
    accuracyMessage =
      "Está explorando los primeros desafíos. Es muy valioso acompañar sus intentos con entusiasmo y paciencia.";
  } else {
    accuracyMessage =
      "Aún no se registran actividades suficientes en este período para calcular la precisión.";
  }

  // Evolución semanal (últimas 6 semanas)
  const weeklyEvolution: WeeklyEvolutionPoint[] = [];
  const sixWeeksMs = 6 * 7 * msInDay;
  const recentLogs = allLogs.filter((l) => {
    const t = new Date(l.finishedAt).getTime();
    return !isNaN(t) && t >= now - sixWeeksMs;
  });

  for (let i = 5; i >= 0; i--) {
    const wStart = now - (i + 1) * 7 * msInDay;
    const wEnd = now - i * 7 * msInDay;
    const startDateObj = new Date(wStart);
    const endDateObj = new Date(wEnd);

    const wLogs = recentLogs.filter((l) => {
      const t = new Date(l.finishedAt).getTime();
      return t >= wStart && t < wEnd;
    });

    let wCorrect = 0;
    let wTotal = 0;
    for (const l of wLogs) {
      wCorrect += l.correct;
      wTotal += l.correct + l.incorrect;
    }

    const startLabel = `${startDateObj.getDate()}/${startDateObj.getMonth() + 1}`;
    const endLabel = `${endDateObj.getDate()}/${endDateObj.getMonth() + 1}`;

    weeklyEvolution.push({
      weekLabel: `Sem. ${startLabel} - ${endLabel}`,
      startDate: startDateObj.toISOString(),
      activitiesCount: wLogs.length,
      accuracyPct: wTotal > 0 ? Math.round((wCorrect / wTotal) * 100) : 0,
    });
  }

  // Fortalezas (puntaje >= 80% o mundos completados)
  const strengths: FamilyReportStrength[] = [];
  const completedSet = new Set(progress.completedWorlds ?? []);

  // Recolectar mundos con puntaje alto
  const highScoringIds: number[] = [];
  for (const [idStr, score] of Object.entries(progress.bestWorldScore ?? {})) {
    const id = Number(idStr);
    if (score >= 80 && !highScoringIds.includes(id)) {
      highScoringIds.push(id);
    }
  }
  for (const id of completedSet) {
    if (!highScoringIds.includes(id)) {
      highScoringIds.push(id);
    }
  }

  for (const worldId of highScoringIds.slice(0, 4)) {
    const w = getWorld(worldId);
    const curr = curriculumEntries[String(worldId)];
    const area = curr?.area ?? (w?.subject ? String(w.subject) : "General");
    const eje = curr?.eje ?? "Desarrollo de habilidades";
    const contenido = curr?.contenido ?? w?.objective ?? "Contenido del programa";

    strengths.push({
      worldId,
      worldName: w?.name ?? `Mundo ${worldId}`,
      area,
      eje,
      contenido,
      description: `Demuestra gran soltura y seguridad al trabajar ${contenido.toLowerCase()}. Resuelve consignas con autonomía.`,
    });
  }

  // Recomendaciones / Para seguir creciendo juntos
  const recommendations: FamilyReportRecommendation[] = [];
  const needingReview = progress.worldsNeedingTeacherReview ?? [];
  const pendingRetry = progress.worldsPendingReinforcementRetry ?? [];

  const toStrengthenIds: number[] = [];
  for (const id of needingReview) {
    if (!toStrengthenIds.includes(id)) toStrengthenIds.push(id);
  }
  for (const id of pendingRetry) {
    if (!toStrengthenIds.includes(id)) toStrengthenIds.push(id);
  }

  // Si no hay mundos en revisión, buscamos algún mundo con score < 70
  if (toStrengthenIds.length === 0) {
    for (const [idStr, score] of Object.entries(progress.lastWorldAttemptScore ?? {})) {
      const id = Number(idStr);
      if (score < 70 && !toStrengthenIds.includes(id)) {
        toStrengthenIds.push(id);
      }
    }
  }

  for (const worldId of toStrengthenIds.slice(0, 3)) {
    const w = getWorld(worldId);
    const curr = curriculumEntries[String(worldId)];
    const area = curr?.area ?? (w?.subject ? String(w.subject) : "General");
    const eje = curr?.eje ?? "Contenido escolar";
    const contenido = curr?.contenido ?? w?.objective ?? "Práctica guiada";

    let tip = "";
    if (area.toLowerCase().includes("matem")) {
      tip = `En casa sugerimos jugar con situaciones de la vida diaria: contar elementos al ordenar, calcular sumas o restas sencillas con monedas o dados, y reforzar con calma ${contenido.toLowerCase()}.`;
    } else if (area.toLowerCase().includes("lengua")) {
      tip = `En casa es muy beneficioso compartir 10 minutos de lectura diaria en voz alta, conversar sobre los relatos y jugar a buscar palabras que rimen o contengan las letras trabajadas.`;
    } else {
      tip = `Recomendamos conversar en familia sobre el tema, observando el entorno cotidiano y valorando sus preguntas e hipótesis sobre ${contenido.toLowerCase()}.`;
    }

    recommendations.push({
      worldId,
      worldName: w?.name ?? `Mundo ${worldId}`,
      area,
      eje,
      contenido,
      tipForHome: tip,
    });
  }

  // Si no hay recomendaciones específicas, mensaje de estímulo general
  if (recommendations.length === 0) {
    recommendations.push({
      worldId: 0,
      worldName: "Continuidad del recorrido",
      area: "General",
      eje: "Hábitos de estudio",
      contenido: "Práctica regular",
      tipForHome:
        "Viene realizando un excelente recorrido. Para continuar acompañando su aprendizaje, sugerimos mantener momentos tranquilos de juego educativo, lectura compartida y descanso reparador en casa.",
    });
  }

  const generatedDate = new Date().toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return {
    studentName: student.name,
    grade,
    period,
    periodLabel,
    generatedDate,
    worldsCompleted: (progress.completedWorlds ?? []).length,
    totalTimeMinutes,
    accuracyPct,
    accuracyMessage,
    weeklyEvolution,
    strengths,
    recommendations,
    generalMessage:
      "Este informe fue elaborado por el equipo docente a partir de los desafíos interactivos resueltos en Mundomat, alineados con el Diseño Curricular de Educación Primaria. ¡El acompañamiento y el estímulo afectivo de la familia son fundamentales para su confianza!",
    hasActivityInPeriod,
  };
}
