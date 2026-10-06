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

export const ORDEN_MOCHILA_GENERAL = [
  "botella-agua-ml",
  "anteojos-sol-ml",
  "gorra-ml",
  "protector-solar-ml",
  "bocadillos-ml",
] as const;

export const ITEM_DICTADO = "golosina-ml";

export interface ResultadoRegistroEtapa {
  nextProgress: StudentProgress;
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
  return Object.values(progress.monteLeon.etapas).some(
    (e) => typeof e?.bestScore === "number" && e.bestScore > 0
  );
}

/**
 * Registra el resultado de una vuelta en una etapa de Monte León.
 * - Actualiza el mejor puntaje de la etapa en `monteLeon.etapas[etapa]`.
 * - Si puntaje >= 80%:
 *   - Etapa 5 (dictado): entrega la golosina (`golosina-ml`). Si ya la tiene, entrega el próximo de la lista general.
 *   - Etapas 1..4: entrega el siguiente objeto en orden: botella -> anteojos -> gorra -> protector -> bocadillos.
 *   - Con los 6 objetos completados: entrega la mascota `pinguino-peluche-ml`.
 * - Desbloquea avatares:
 *   - `explorador-monte-leon`: al superar etapas 1 y 2 (ambas >= 80%).
 *   - `guardaparque-monte-leon`: al superar etapa 4 (>= 80%).
 *   - `pinguino-monte-leon`: al superar las 5 etapas con 90% o más.
 * - Si estamos en la ventana de buen viaje y participó: entrega la `medalla-monte-leon`.
 */
export function registrarResultadoEtapa(
  progress: StudentProgress,
  etapa: number,
  scorePct: number,
  now: Date = new Date()
): ResultadoRegistroEtapa {
  const currentMonteLeon = progress.monteLeon ?? { etapas: {} };
  const currentEtapas = { ...(currentMonteLeon.etapas ?? {}) };
  const prevEtapaRecord = currentEtapas[etapa];

  const newBestScore = Math.max(prevEtapaRecord?.bestScore ?? 0, scorePct);
  currentEtapas[etapa] = {
    bestScore: newBestScore,
    completedAt: now.toISOString(),
  };

  const ownedSeasonal = new Set(progress.seasonalCollection ?? []);
  const regalados = new Set(progress.objetosRegalados ?? []);
  const yaObtenido = (id: string) => ownedSeasonal.has(id) || regalados.has(id);

  let objetoPremio: string | undefined;
  let mascotaPremio: string | undefined;
  let medallaPremio: string | undefined;

  // Entrega de objetos de la mochila si superó la etapa con 80% o más
  if (scorePct >= 80) {
    let candidato: string | undefined;

    if (etapa === 5) {
      if (!yaObtenido(ITEM_DICTADO)) {
        candidato = ITEM_DICTADO;
      } else {
        candidato = ORDEN_MOCHILA_GENERAL.find((id) => !yaObtenido(id));
      }
    } else {
      candidato = ORDEN_MOCHILA_GENERAL.find((id) => !yaObtenido(id));
      if (!candidato && !yaObtenido(ITEM_DICTADO)) {
        candidato = ITEM_DICTADO;
      }
    }

    if (candidato && !yaObtenido(candidato)) {
      ownedSeasonal.add(candidato);
      objetoPremio = candidato;
    }

    // Chequeo de mochila completa para entregar la mascota pingüino de peluche
    const todosObjetosListos = MOCHILA_MONTE_LEON.every((item) => yaObtenido(item.id));
    if (todosObjetosListos && !yaObtenido(MASCOTA_MONTE_LEON.id)) {
      ownedSeasonal.add(MASCOTA_MONTE_LEON.id);
      mascotaPremio = MASCOTA_MONTE_LEON.id;
    }
  }

  // Desbloqueo de avatares superespeciales
  const achievements = new Set(progress.achievementCollection ?? []);
  const nuevosAvatares: string[] = [];

  // 1. Explorador: superar etapas 1 y 2 con 80%+
  const e1Superada = (currentEtapas[1]?.bestScore ?? 0) >= 80;
  const e2Superada = (currentEtapas[2]?.bestScore ?? 0) >= 80;
  if (e1Superada && e2Superada && !achievements.has("explorador-monte-leon")) {
    achievements.add("explorador-monte-leon");
    nuevosAvatares.push("explorador-monte-leon");
  }

  // 2. Guardaparque: superar etapa 4 con 80%+
  const e4Superada = (currentEtapas[4]?.bestScore ?? 0) >= 80;
  if (e4Superada && !achievements.has("guardaparque-monte-leon")) {
    achievements.add("guardaparque-monte-leon");
    nuevosAvatares.push("guardaparque-monte-leon");
  }

  // 3. Pingüino: TODAS las 5 etapas con 90%+
  const todas90 = [1, 2, 3, 4, 5].every((e) => (currentEtapas[e]?.bestScore ?? 0) >= 90);
  if (todas90 && !achievements.has("pinguino-monte-leon")) {
    achievements.add("pinguino-monte-leon");
    nuevosAvatares.push("pinguino-monte-leon");
  }

  let medallaEntregada = currentMonteLeon.medallaEntregada ?? false;

  // Entrega automática de medalla si estamos en la ventana de buen viaje y participó
  if (esMomentoBuenViaje(now) && !yaObtenido(MEDALLA_MONTE_LEON.id)) {
    ownedSeasonal.add(MEDALLA_MONTE_LEON.id);
    medallaPremio = MEDALLA_MONTE_LEON.id;
    medallaEntregada = true;
  }

  const nextProgress: StudentProgress = {
    ...progress,
    seasonalCollection: [...ownedSeasonal],
    achievementCollection: [...achievements],
    monteLeon: {
      ...currentMonteLeon,
      etapas: currentEtapas,
      medallaEntregada,
    },
  };

  return {
    nextProgress,
    objetoPremio,
    mascotaPremio,
    nuevosAvatares,
    medallaPremio,
  };
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
