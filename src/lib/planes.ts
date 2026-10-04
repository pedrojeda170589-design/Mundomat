/**
 * Modelo de Planes y Funcionalidades (AG-12)
 *
 * Define en un único lugar los planes disponibles, sus límites provisorios
 * y las funciones habilitadas en cada uno:
 *   - Piloto / Gratuito: para docentes individuales o pruebas en un aula.
 *   - Escuela: para escuelas completas con panel directivo, reportes PDF y CSV.
 *   - Distrito: para redes escolares o supervisores con multi-institución.
 *
 * El aula piloto de Pedro (sin Supabase o con is_legacy_pilot) cuenta con
 * todas las funciones habilitadas sin restricciones.
 */

export type PlanId = "piloto_gratuito" | "escuela" | "distrito";

export type PlanFeature =
  | "reportes"              // Reporte imprimible individual para familias
  | "reportes_pdf_curso"    // Reporte imprimible consolidado del curso completo
  | "exportacion_csv"       // Planilla CSV de calificaciones y estadísticas
  | "resumen_curso"         // Grilla completa del curso con seguimiento
  | "vista_directivo"       // Resumen multi-aula institucional para directivos
  | "comparacion_aulas"     // Gráfico y tabla comparativa entre divisiones del mismo grado
  | "alertas_docentes"      // Tarjeta de alertas tempranas (inactividad y caída)
  | "fichas_familias"       // Descarga de fichas complementarias en PDF
  | "juego_completo";       // Acceso a los mundos pedagógicos del juego

export type PlanLimit = "aulas" | "alumnos" | "docentes";

export interface PlanDefinition {
  id: PlanId;
  name: string;
  badge: string;
  description: string;
  // Valores provisorios para que Pedro defina o ajuste
  limits: Record<PlanLimit, number>;
  features: Record<PlanFeature, boolean>;
}

export const PLANES: Record<PlanId, PlanDefinition> = {
  piloto_gratuito: {
    id: "piloto_gratuito",
    name: "Piloto / Gratuito",
    badge: "🌱 Plan Piloto",
    description: "Para docentes individuales que prueban MundoTest26 en su aula.",
    limits: {
      aulas: 2,          // Provisorio: hasta 2 aulas
      alumnos: 35,       // Provisorio: hasta 35 alumnos
      docentes: 2,       // Provisorio: hasta 2 docentes
    },
    features: {
      juego_completo: true,
      resumen_curso: true,
      reportes: true,            // Reporte familiar básico habilitado
      reportes_pdf_curso: false, // Requiere Plan Escuela
      exportacion_csv: false,    // Requiere Plan Escuela
      vista_directivo: false,    // Requiere Plan Escuela o Distrito
      comparacion_aulas: false,  // Requiere Plan Escuela o Distrito
      alertas_docentes: false,   // Requiere Plan Escuela o Distrito
      fichas_familias: true,
    },
  },
  escuela: {
    id: "escuela",
    name: "Plan Escuela",
    badge: "🏫 Plan Escuela",
    description: "Para escuelas que integran todos sus cursos con panel directivo y reportes.",
    limits: {
      aulas: 25,         // Provisorio: hasta 25 aulas
      alumnos: 750,      // Provisorio: hasta 750 alumnos
      docentes: 40,      // Provisorio: hasta 40 docentes
    },
    features: {
      juego_completo: true,
      resumen_curso: true,
      reportes: true,
      reportes_pdf_curso: true,
      exportacion_csv: true,
      vista_directivo: true,
      comparacion_aulas: true,
      alertas_docentes: true,
      fichas_familias: true,
    },
  },
  distrito: {
    id: "distrito",
    name: "Plan Distrito / Red",
    badge: "🏛️ Plan Distrito",
    description: "Para municipios o ministerios con múltiples escuelas y métricas consolidadas.",
    limits: {
      aulas: Infinity,
      alumnos: Infinity,
      docentes: Infinity,
    },
    features: {
      juego_completo: true,
      resumen_curso: true,
      reportes: true,
      reportes_pdf_curso: true,
      exportacion_csv: true,
      vista_directivo: true,
      comparacion_aulas: true,
      alertas_docentes: true,
      fichas_familias: true,
    },
  },
};

export type PlanTarget =
  | PlanId
  | { plan?: string; is_legacy_pilot?: boolean }
  | null
  | undefined;

/**
 * Obtiene la definición del plan por ID (por defecto 'piloto_gratuito').
 */
export function getPlan(planId?: string | null): PlanDefinition {
  if (planId && planId in PLANES) {
    return PLANES[planId as PlanId];
  }
  return PLANES.piloto_gratuito;
}

/**
 * Resuelve el ID del plan de un objetivo (escuela, aula o string de plan).
 */
export function resolvePlanId(target: PlanTarget): PlanId {
  if (!target) return "piloto_gratuito";
  if (typeof target === "string" && target in PLANES) {
    return target as PlanId;
  }
  if (typeof target === "object" && target.plan && target.plan in PLANES) {
    return target.plan as PlanId;
  }
  return "piloto_gratuito";
}

/**
 * Determina si una escuela u objeto de contexto puede usar una función determinada.
 * Regla de negocio: El aula piloto de Pedro tiene TODO habilitado.
 */
export function puedeUsar(target: PlanTarget, feature: PlanFeature): boolean {
  // El aula piloto de Pedro o ejecuciones sin contexto de escuela tienen todo habilitado
  if (!target) return true;
  if (typeof target === "object" && target.is_legacy_pilot) return true;

  const planId = resolvePlanId(target);
  const plan = getPlan(planId);
  return plan.features[feature] ?? false;
}

/**
 * Obtiene el límite numérico para una métrica (aulas, alumnos, docentes).
 * Regla de negocio: El aula piloto de Pedro no tiene límites (Infinity).
 */
export function limiteDe(target: PlanTarget, limit: PlanLimit): number {
  if (!target) return Infinity;
  if (typeof target === "object" && target.is_legacy_pilot) return Infinity;

  const planId = resolvePlanId(target);
  const plan = getPlan(planId);
  return plan.limits[limit] ?? Infinity;
}

/**
 * Mensaje pedagógico y cordial cuando una función no está incluida en el plan actual.
 * (Sin pantallas de cobro ni enlaces de pago).
 */
export function planUpgradeNotice(feature: PlanFeature): {
  title: string;
  message: string;
  requiredPlan: PlanId;
} {
  switch (feature) {
    case "vista_directivo":
    case "comparacion_aulas":
      return {
        title: "Panel Directivo Institucional",
        message:
          "La vista general de la escuela y la comparación pedagógica entre divisiones están disponibles en el Plan Escuela y Plan Distrito.",
        requiredPlan: "escuela",
      };
    case "reportes_pdf_curso":
      return {
        title: "Reporte Imprimible del Curso",
        message:
          "La generación del informe consolidado del aula en formato imprimible/PDF forma parte del Plan Escuela.",
        requiredPlan: "escuela",
      };
    case "exportacion_csv":
      return {
        title: "Exportación a Planilla CSV",
        message:
          "La exportación de calificaciones y métricas para Excel o sistemas escolares forma parte del Plan Escuela.",
        requiredPlan: "escuela",
      };
    case "alertas_docentes":
      return {
        title: "Alertas Tempranas Docentes",
        message:
          "El sistema inteligente de detección de caídas e inactividad se encuentra disponible en los planes Escuela y Distrito.",
        requiredPlan: "escuela",
      };
    default:
      return {
        title: "Función del Plan Escuela",
        message:
          "Esta herramienta está disponible en los planes institucionales de MundoTest26. Consultá con tu escuela para activarla.",
        requiredPlan: "escuela",
      };
  }
}
