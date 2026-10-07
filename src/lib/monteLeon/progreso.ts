// Lógica de progresión para el Mundo Especial «Viaje a Monte León».
// Administra:
// 1. Llenado de la mochila de viaje (6 objetos) y mascota de pingüino.
// 2. Desbloqueo de avatares superespeciales (explorador, guardaparque, pingüino).
// 3. Entrega de la medalla de buen viaje.
// 4. Regla estricta: los objetos regalados (objetosRegalados) no se vuelven a entregar.
import type { StudentProgress } from "@/types";
import {
  MOCHILA_MONTE_LEON,
  MEDALLA_MONTE_LEON,
  MASCOTA_MONTE_LEON,
} from "./arte";
import { esMomentoBuenViaje } from "./fechas";

// Reglas (revisadas por Claude el 7/10/2026, para que lo que ve el alumno y lo
// que da el servidor sean lo mismo):
// - Cada vuelta tiene 8 actividades. Una etapa se SUPERA con 7 u 8 bien
//   (80 % o más); el servidor recibe cuántas acertó, no un porcentaje.
// - Cada etapa da SU objeto la primera vez que se supera (ETAPAS_MONTE_LEON):
//   1 botella, 2 anteojos, 3 gorra, 4 protector solar, 5 (dictado) golosina.
// - Los bocadillos se ganan con una vuelta PERFECTA (8 de 8) en cualquier etapa.
// - Con los 6 objetos: la mascota (pingüino de peluche).
// - Avatares: explorador (etapas 1 y 2), guardaparque (etapa 4), pingüino
//   (las 5 etapas con 90 % o más; con 8 actividades eso es 8 de 8 en cada una).
// - «Participó» = superó al menos una etapa. La medalla se da solo a quien
//   participó y solo en la ventana del buen viaje (27/10 20:00 a 28/10).
export const ACTIVIDADES_POR_ETAPA = 8;
export const MINIMO_PARA_SUPERAR = 7; // 7 de 8 = 87,5 % (≥ 80 %)
export const ITEM_VUELTA_PERFECTA = "bocadillos-ml";
export const OBJETO_DE_ETAPA: Record<number, string> = {
  1: "botella-agua-ml",
  2: "anteojos-sol-ml",
  3: "gorra-ml",
  4: "protector-solar-ml",
  5: "golosina-ml",
};
export const ITEM_DICTADO = OBJETO_DE_ETAPA[5];

export function etapaSuperada(e: { bestScore?: number } | undefined): boolean {
  return (e?.bestScore ?? 0) >= 80;
}

export interface ResultadoRegistroEtapa {
  nextProgress: StudentProgress;
  scorePct: number;
  objetosPremio: string[];
  objetoPremio?: string;
  mascotaPremio?: string;
  nuevosAvatares: string[];
  medallaPremio?: string;
}

/**
 * Determina si el alumno ya obtuvo o regaló un ítem determinado.
 */
export function alumnoTieneORegalo(
  progress: Pick<StudentProgress, "seasonalCollection" | "objetosRegalados">,
  itemId: string
): boolean {
  const owned = new Set(progress.seasonalCollection ?? []);
  const regalados = new Set(progress.objetosRegalados ?? []);
  return owned.has(itemId) || regalados.has(itemId);
}

/**
 * ¿El alumno completó la mochila con los 6 objetos (propios o regalados)?
 */
export function tieneMochilaCompleta(
  progress: Pick<StudentProgress, "seasonalCollection" | "objetosRegalados">
): boolean {
  return MOCHILA_MONTE_LEON.every((item) => alumnoTieneORegalo(progress, item.id));
}

/**
 * Cantidad de objetos de la mochila obtenidos por el alumno (0..6).
 */
export function cantidadObjetosMochila(
  progress: Pick<StudentProgress, "seasonalCollection" | "objetosRegalados">
): number {
  return MOCHILA_MONTE_LEON.filter((item) => alumnoTieneORegalo(progress, item.id)).length;
}

/**
 * ¿Participó el alumno en Monte León?
 * Participó si superó (o completó) al menos una etapa del mundo especial.
 */
export function haParticipadoMonteLeon(progress: StudentProgress): boolean {
  if (!progress.monteLeon?.etapas) return false;
  return Object.values(progress.monteLeon.etapas).some((e) => etapaSuperada(e));
}

/**
 * Registra una vuelta de una etapa (1..5) con `correctas` respuestas bien de 8.
 */
export function registrarResultadoEtapa(
  progress: StudentProgress,
  etapa: number,
  correctas: number,
  now: Date = new Date()
): ResultadoRegistroEtapa {
  const bien = Math.max(0, Math.min(ACTIVIDADES_POR_ETAPA, Math.floor(correctas)));
  const scorePct = Math.round((bien / ACTIVIDADES_POR_ETAPA) * 100);
  const currentMonteLeon = progress.monteLeon ?? { etapas: {} };
  const currentEtapas = { ...(currentMonteLeon.etapas ?? {}) };
  const prev = currentEtapas[etapa];
  currentEtapas[etapa] = {
    bestScore: Math.max(prev?.bestScore ?? 0, scorePct),
    completedAt: now.toISOString(),
  };

  const ownedSeasonal = new Set(progress.seasonalCollection ?? []);
  const regalados = new Set(progress.objetosRegalados ?? []);
  const yaObtenido = (id: string) => ownedSeasonal.has(id) || regalados.has(id);

  let objetoPremio: string | undefined;
  let mascotaPremio: string | undefined;
  let medallaPremio: string | undefined;
  const premios: string[] = [];

  if (bien >= MINIMO_PARA_SUPERAR) {
    const propio = OBJETO_DE_ETAPA[etapa];
    if (propio && !yaObtenido(propio)) {
      ownedSeasonal.add(propio);
      premios.push(propio);
    }
    if (bien === ACTIVIDADES_POR_ETAPA && !yaObtenido(ITEM_VUELTA_PERFECTA)) {
      ownedSeasonal.add(ITEM_VUELTA_PERFECTA);
      premios.push(ITEM_VUELTA_PERFECTA);
    }
    objetoPremio = premios[0];
    if (MOCHILA_MONTE_LEON.every((item) => yaObtenido(item.id)) && !yaObtenido(MASCOTA_MONTE_LEON.id)) {
      ownedSeasonal.add(MASCOTA_MONTE_LEON.id);
      mascotaPremio = MASCOTA_MONTE_LEON.id;
    }
  }

  const achievements = new Set(progress.achievementCollection ?? []);
  const nuevosAvatares: string[] = [];
  const sup = (e: number) => etapaSuperada(currentEtapas[e]);
  const dar = (id: string, cond: boolean) => {
    if (cond && !achievements.has(id)) {
      achievements.add(id);
      nuevosAvatares.push(id);
    }
  };
  dar("explorador-monte-leon", sup(1) && sup(2));
  dar("guardaparque-monte-leon", sup(4));
  dar("pinguino-monte-leon", [1, 2, 3, 4, 5].every((e) => (currentEtapas[e]?.bestScore ?? 0) >= 90));

  let medallaEntregada = currentMonteLeon.medallaEntregada ?? false;
  const participo = Object.values(currentEtapas).some((e) => etapaSuperada(e));
  if (esMomentoBuenViaje(now) && participo && !yaObtenido(MEDALLA_MONTE_LEON.id)) {
    ownedSeasonal.add(MEDALLA_MONTE_LEON.id);
    medallaPremio = MEDALLA_MONTE_LEON.id;
    medallaEntregada = true;
  }

  const nextProgress: StudentProgress = {
    ...progress,
    seasonalCollection: [...ownedSeasonal],
    achievementCollection: [...achievements],
    monteLeon: { ...currentMonteLeon, etapas: currentEtapas, medallaEntregada },
  };
  return { nextProgress, objetoPremio, objetosPremio: premios, mascotaPremio, nuevosAvatares, medallaPremio, scorePct };
}

/**
 * Entrega la medalla de buen viaje a un alumno participante si aún no la tiene.
 * (Usado tanto por la ventana de bienvenida al entrar a la app como por el script docente).
 */
export function entregarMedallaBuenViaje(
  progress: StudentProgress
): { nextProgress: StudentProgress; entregada: boolean } {
  if (!haParticipadoMonteLeon(progress)) {
    return { nextProgress: progress, entregada: false };
  }

  if (alumnoTieneORegalo(progress, MEDALLA_MONTE_LEON.id)) {
    return { nextProgress: progress, entregada: false };
  }

  const ownedSeasonal = new Set(progress.seasonalCollection ?? []);
  ownedSeasonal.add(MEDALLA_MONTE_LEON.id);

  const nextMonteLeon = {
    ...(progress.monteLeon ?? { etapas: {} }),
    medallaEntregada: true,
  };

  const nextProgress: StudentProgress = {
    ...progress,
    seasonalCollection: [...ownedSeasonal],
    monteLeon: nextMonteLeon,
  };

  return { nextProgress, entregada: true };
}
