import { Student, StudentProgress } from "@/types";

// Constantes explicadas pedagógicamente (según especificación de AG-11):
// - Caída de 20 puntos porcentuales entre la última semana y el promedio de las 3 semanas anteriores.
//   Indica una desaceleración o dificultad imprevista que requiere intervención docente temprana.
export const PERFORMANCE_DROP_THRESHOLD_PTS = 20;

// - Alerta por inactividad: por defecto 7 días sin registrar ingresos.
export const DEFAULT_INACTIVE_DAYS_THRESHOLD = 7;

export interface TeacherAlertConfig {
  inactiveDaysThreshold: number;
}

export interface StudentActivityMetrics {
  currentStreak: number; // Días seguidos con actividad hasta hoy o ayer
  streakDays: number; // alias ergonómico
  activeDaysLast7: number; // Días activos en los últimos 7 días
  activeDaysLast30: number; // Días activos en los últimos 30 días
  lastConnectionDaysAgo: number | null; // null si nunca jugó, 0 = hoy, 1 = ayer, etc.
  lastConnectionLabel: string; // "Hoy", "Ayer", "Hace 3 días", "Sin ingresos"
  performanceDropAlert?: {
    lastWeekAccuracy: number;
    previousWeeksAccuracy: number;
    dropPts: number;
    explanation: string;
  };
  hasPerformanceDrop: boolean;
  recentAccuracyPct?: number;
  priorAccuracyPct?: number;
  isInactiveAlert: boolean;
}

export interface TeacherAlert {
  id: string;
  type: "inactivity" | "performance_drop";
  student: Student;
  title: string;
  description: string;
  severity: "high" | "medium";
}

export interface EvolutionWeekPoint {
  weekLabel: string;
  accuracyPct: number;
  totalMinutes: number;
  activitiesCount: number;
}

/**
 * Obtiene el conjunto de fechas calendario distintas (formato "YYYY-MM-DD")
 * en las cuales el alumno registró actividad.
 */
export function getStudentActiveDates(progress: StudentProgress | undefined): Set<string> {
  const dates = new Set<string>();
  if (!progress) return dates;

  // 1. Días registrados explícitamente en activeDays
  if (Array.isArray(progress.activeDays)) {
    for (const d of progress.activeDays) {
      if (/^\d{4}-\d{2}-\d{2}$/.test(d)) {
        dates.add(d);
      }
    }
  }

  // 2. Fechas de activityLog
  if (Array.isArray(progress.activityLog)) {
    for (const log of progress.activityLog) {
      if (log.finishedAt) {
        const dateStr = log.finishedAt.slice(0, 10);
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
          dates.add(dateStr);
        }
      }
    }
  }

  // 3. lastPlayedAt
  if (progress.lastPlayedAt) {
    const dStr = progress.lastPlayedAt.slice(0, 10);
    if (/^\d{4}-\d{2}-\d{2}$/.test(dStr)) {
      dates.add(dStr);
    }
  }

  return dates;
}

/**
 * Calcula la racha actual (días seguidos con actividad).
 * Si jugó hoy, cuenta hacia atrás desde hoy.
 * Si no jugó hoy pero sí ayer, la racha sigue viva y cuenta hacia atrás desde ayer.
 * Si no jugó ni hoy ni ayer, la racha es 0.
 */
export function computeCurrentStreak(activeDates: Set<string> | string[], nowMs: number = Date.now()): number {
  const datesSet = activeDates instanceof Set ? activeDates : new Set(activeDates);
  if (datesSet.size === 0) return 0;

  const msInDay = 24 * 60 * 60 * 1000;
  const todayStr = new Date(nowMs).toISOString().slice(0, 10);
  const yesterdayStr = new Date(nowMs - msInDay).toISOString().slice(0, 10);

  let startDateMs: number;

  if (datesSet.has(todayStr)) {
    startDateMs = nowMs;
  } else if (datesSet.has(yesterdayStr)) {
    startDateMs = nowMs - msInDay;
  } else {
    return 0; // Racha cortada
  }

  let streak = 0;
  let checkMs = startDateMs;

  while (true) {
    const key = new Date(checkMs).toISOString().slice(0, 10);
    if (datesSet.has(key)) {
      streak++;
      checkMs -= msInDay;
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Calcula métricas de actividad individuales de un alumno.
 */
export function computeStudentActivityMetrics(
  progress: StudentProgress | undefined,
  nowMs: number = Date.now(),
  inactiveDaysThreshold: number = DEFAULT_INACTIVE_DAYS_THRESHOLD
): StudentActivityMetrics {
  if (!progress) {
    return {
      currentStreak: 0,
      streakDays: 0,
      activeDaysLast7: 0,
      activeDaysLast30: 0,
      lastConnectionDaysAgo: null,
      lastConnectionLabel: "Sin ingresos",
      hasPerformanceDrop: false,
      isInactiveAlert: true,
    };
  }

  const activeDates = getStudentActiveDates(progress);
  const currentStreak = computeCurrentStreak(activeDates, nowMs);

  const msInDay = 24 * 60 * 60 * 1000;
  const sevenDaysCutoff = new Date(nowMs - 7 * msInDay).toISOString().slice(0, 10);
  const thirtyDaysCutoff = new Date(nowMs - 30 * msInDay).toISOString().slice(0, 10);

  let activeDaysLast7 = 0;
  let activeDaysLast30 = 0;

  let mostRecentDateStr: string | null = null;

  for (const d of activeDates) {
    if (d >= sevenDaysCutoff) activeDaysLast7++;
    if (d >= thirtyDaysCutoff) activeDaysLast30++;
    if (!mostRecentDateStr || d > mostRecentDateStr) {
      mostRecentDateStr = d;
    }
  }

  let lastConnectionDaysAgo: number | null = null;
  let lastConnectionLabel = "Sin ingresos";

  if (mostRecentDateStr) {
    const todayStr = new Date(nowMs).toISOString().slice(0, 10);
    const mostRecentMs = new Date(mostRecentDateStr).getTime();
    const todayMs = new Date(todayStr).getTime();
    const diffDays = Math.max(0, Math.round((todayMs - mostRecentMs) / msInDay));

    lastConnectionDaysAgo = diffDays;
    if (diffDays === 0) {
      lastConnectionLabel = "Hoy";
    } else if (diffDays === 1) {
      lastConnectionLabel = "Ayer";
    } else {
      lastConnectionLabel = `Hace ${diffDays} días`;
    }
  }

  const isInactiveAlert =
    lastConnectionDaysAgo === null || lastConnectionDaysAgo >= inactiveDaysThreshold;

  // Detección de caída marcada de rendimiento (última semana vs. 3 semanas anteriores)
  let performanceDropAlert: StudentActivityMetrics["performanceDropAlert"] = undefined;

  const logs = progress.activityLog ?? [];
  if (logs.length >= 10) {
    const oneWeekAgoMs = nowMs - 7 * msInDay;
    const fourWeeksAgoMs = nowMs - 28 * msInDay;

    let recentCorrect = 0;
    let recentTotal = 0;
    let recentActivitiesCount = 0;
    let prevCorrect = 0;
    let prevTotal = 0;
    let prevActivitiesCount = 0;

    for (const log of logs) {
      const rawDate = log.finishedAt || (log as { timestamp?: string }).timestamp;
      const t = rawDate ? new Date(rawDate).getTime() : NaN;
      if (isNaN(t)) continue;

      const c = log.correct ?? (log as { correctCount?: number }).correctCount ?? 0;
      const inc = log.incorrect ?? (log as { incorrectCount?: number }).incorrectCount ?? 0;

      if (t >= oneWeekAgoMs && t <= nowMs) {
        recentCorrect += c;
        recentTotal += c + inc;
        recentActivitiesCount++;
      } else if (t >= fourWeeksAgoMs && t < oneWeekAgoMs) {
        prevCorrect += c;
        prevTotal += c + inc;
        prevActivitiesCount++;
      }
    }

    // Mínimo 5 actividades en cada período para que la comparación sea pedagógicamente válida
    if (recentActivitiesCount >= 5 && prevActivitiesCount >= 5 && recentTotal > 0 && prevTotal > 0) {
      const recentAcc = Math.round((recentCorrect / recentTotal) * 100);
      const prevAcc = Math.round((prevCorrect / prevTotal) * 100);
      const dropPts = prevAcc - recentAcc;

      if (dropPts >= PERFORMANCE_DROP_THRESHOLD_PTS) {
        performanceDropAlert = {
          lastWeekAccuracy: recentAcc,
          previousWeeksAccuracy: prevAcc,
          dropPts,
          explanation: `Rendimiento de ${recentAcc}% esta semana frente a un ${prevAcc}% en las semanas anteriores (−${dropPts} pts).`,
        };
      }
    }
  }

  return {
    currentStreak,
    streakDays: currentStreak,
    activeDaysLast7,
    activeDaysLast30,
    lastConnectionDaysAgo,
    lastConnectionLabel,
    performanceDropAlert,
    hasPerformanceDrop: !!performanceDropAlert,
    recentAccuracyPct: performanceDropAlert?.lastWeekAccuracy,
    priorAccuracyPct: performanceDropAlert?.previousWeeksAccuracy,
    isInactiveAlert,
  };
}

/**
 * Genera la lista de alertas activas para el docente («🔔 Para mirar»).
 */
export function computeTeacherAlerts(
  students: Student[],
  progressMap: Record<string, StudentProgress>,
  inactiveDaysThreshold: number = DEFAULT_INACTIVE_DAYS_THRESHOLD,
  nowMs: number = Date.now()
): TeacherAlert[] {
  const alerts: TeacherAlert[] = [];

  for (const student of students) {
    const p = progressMap[student.code];
    const metrics = computeStudentActivityMetrics(p, nowMs, inactiveDaysThreshold);

    // 1. Alerta por caída marcada de rendimiento
    if (metrics.performanceDropAlert) {
      alerts.push({
        id: `drop-${student.code}`,
        type: "performance_drop",
        student,
        title: `Caída de rendimiento: ${student.name}`,
        description: metrics.performanceDropAlert.explanation,
        severity: "high",
      });
    }

    // 2. Alerta por inactividad prolongada
    if (metrics.isInactiveAlert) {
      const desc =
        metrics.lastConnectionDaysAgo === null
          ? "No registra actividades iniciadas en la plataforma."
          : `Sin actividad desde hace ${metrics.lastConnectionDaysAgo} días (umbral: ${inactiveDaysThreshold} días).`;

      alerts.push({
        id: `inactive-${student.code}`,
        type: "inactivity",
        student,
        title: `Inactividad: ${student.name}`,
        description: desc,
        severity: metrics.lastConnectionDaysAgo && metrics.lastConnectionDaysAgo >= inactiveDaysThreshold * 2 ? "high" : "medium",
      });
    }
  }

  // Ordenar: primero caídas de rendimiento, luego inactividad severa
  return alerts.sort((a, b) => {
    if (a.severity === "high" && b.severity !== "high") return -1;
    if (b.severity === "high" && a.severity !== "high") return 1;
    const nameA = a.student?.name || "";
    const nameB = b.student?.name || "";
    return nameA.localeCompare(nameB, "es");
  });
}

/**
 * Evolución semanal de un alumno (aciertos % y tiempo en minutos de las últimas 6 semanas).
 */
export function computeStudentEvolution(
  progress: StudentProgress | undefined,
  weeksCount: number = 6,
  nowMs: number = Date.now()
): EvolutionWeekPoint[] {
  const msInDay = 24 * 60 * 60 * 1000;
  const result: EvolutionWeekPoint[] = [];
  const logs = progress?.activityLog ?? [];

  for (let i = weeksCount - 1; i >= 0; i--) {
    const wStart = nowMs - (i + 1) * 7 * msInDay;
    const wEnd = nowMs - i * 7 * msInDay;
    const sDate = new Date(wStart);
    const eDate = new Date(wEnd);

    const wLogs = logs.filter((l) => {
      const rawDate = l.finishedAt || (l as { timestamp?: string }).timestamp;
      const t = rawDate ? new Date(rawDate).getTime() : NaN;
      return !isNaN(t) && t >= wStart && t < wEnd;
    });

    let correct = 0;
    let totalAttempts = 0;
    let timeSec = 0;

    for (const l of wLogs) {
      const c = l.correct ?? (l as { correctCount?: number }).correctCount ?? 0;
      const inc = l.incorrect ?? (l as { incorrectCount?: number }).incorrectCount ?? 0;
      const dur = l.timeSpentSeconds ?? (l as { durationSeconds?: number }).durationSeconds ?? 0;
      correct += c;
      totalAttempts += c + inc;
      timeSec += dur;
    }

    const accuracyPct = totalAttempts > 0 ? Math.round((correct / totalAttempts) * 100) : 0;
    const totalMinutes = Math.round(timeSec / 60);
    const startStr = `${sDate.getDate()}/${sDate.getMonth() + 1}`;
    const endStr = `${eDate.getDate()}/${eDate.getMonth() + 1}`;

    result.push({
      weekLabel: `${startStr} - ${endStr}`,
      accuracyPct,
      totalMinutes,
      activitiesCount: wLogs.length,
    });
  }

  return result;
}

/**
 * Evolución semanal promedio de toda el aula.
 * Acepta (students, progressMap, weeksCount) o directamente (progressMap, weeksCount).
 */
export function computeClassroomEvolution(
  studentsOrMap: Student[] | Record<string, StudentProgress>,
  progressMapOrWeeksCount?: Record<string, StudentProgress> | number,
  maybeWeeksCount?: number,
  maybeNowMs?: number
): EvolutionWeekPoint[] {
  let students: Student[];
  let progressMap: Record<string, StudentProgress>;
  let weeksCount: number;
  let nowMs: number;

  if (Array.isArray(studentsOrMap)) {
    students = studentsOrMap;
    progressMap = (progressMapOrWeeksCount as Record<string, StudentProgress>) || {};
    weeksCount = typeof maybeWeeksCount === "number" ? maybeWeeksCount : 6;
    nowMs = typeof maybeNowMs === "number" ? maybeNowMs : Date.now();
  } else {
    progressMap = studentsOrMap;
    weeksCount = typeof progressMapOrWeeksCount === "number" ? progressMapOrWeeksCount : 6;
    nowMs = typeof maybeWeeksCount === "number" ? maybeWeeksCount : Date.now();
    students = Object.keys(progressMap).map((code) => ({
      code,
      name: code,
      type: "aula" as const,
      createdAt: new Date(nowMs).toISOString(),
    }));
  }

  const msInDay = 24 * 60 * 60 * 1000;
  const result: EvolutionWeekPoint[] = [];

  for (let i = weeksCount - 1; i >= 0; i--) {
    const wStart = nowMs - (i + 1) * 7 * msInDay;
    const wEnd = nowMs - i * 7 * msInDay;
    const sDate = new Date(wStart);
    const eDate = new Date(wEnd);

    let weekCorrect = 0;
    let weekTotalAttempts = 0;
    let weekTimeSec = 0;
    let weekActivitiesCount = 0;

    for (const student of students) {
      const p = progressMap[student.code];
      if (!p?.activityLog) continue;

      for (const l of p.activityLog) {
        const rawDate = l.finishedAt || (l as { timestamp?: string }).timestamp;
        const t = rawDate ? new Date(rawDate).getTime() : NaN;
        if (!isNaN(t) && t >= wStart && t < wEnd) {
          const c = l.correct ?? (l as { correctCount?: number }).correctCount ?? 0;
          const inc = l.incorrect ?? (l as { incorrectCount?: number }).incorrectCount ?? 0;
          const dur = l.timeSpentSeconds ?? (l as { durationSeconds?: number }).durationSeconds ?? 0;
          weekCorrect += c;
          weekTotalAttempts += c + inc;
          weekTimeSec += dur;
          weekActivitiesCount++;
        }
      }
    }

    const accuracyPct =
      weekTotalAttempts > 0 ? Math.round((weekCorrect / weekTotalAttempts) * 100) : 0;
    const totalMinutes = Math.round(weekTimeSec / 60);
    const startStr = `${sDate.getDate()}/${sDate.getMonth() + 1}`;
    const endStr = `${eDate.getDate()}/${eDate.getMonth() + 1}`;

    result.push({
      weekLabel: `${startStr} - ${endStr}`,
      accuracyPct,
      totalMinutes,
      activitiesCount: weekActivitiesCount,
    });
  }

  return result;
}
