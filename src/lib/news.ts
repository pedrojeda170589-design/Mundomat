// Pizarrón de novedades: logros recientes de la clase (mundo completado,
// medalla nueva, aventura de fin de semana completada...). Se muestra a
// todos los alumnos de la clase con el apodo de juego de cada uno (o, si no
// eligió apodo, su nombre como figura en la lista del aula).

import { getJSON, setJSON } from "@/lib/store";
import { getMedalTier, MEDAL_INFO } from "@/lib/medals";
import { getWorld } from "@/lib/worlds";
import { Student, StudentProgress } from "@/types";

const NEWS_KEY = "news";
const MAX_NEWS = 40;

export type NewsKind = "mundo" | "medalla" | "finde" | "racha";

export interface NewsItem {
  id: string;
  at: string; // ISO
  code: string;
  who: string; // apodo (o nombre de la lista si no tiene)
  kind: NewsKind;
  emoji: string;
  text: string; // "completó La Aldea de los Números"
}

export function displayName(student: Student, progress?: StudentProgress): string {
  const nick = progress?.nickname?.trim();
  if (nick) return nick;
  // Sin apodo: el nombre como lo cargó el docente (en la lista del aula a
  // veces va primero el apellido, así que no se recorta).
  return student.name.trim() || "Un compañero";
}

export async function getNews(): Promise<NewsItem[]> {
  return getJSON<NewsItem[]>(NEWS_KEY, []);
}

export async function addNews(items: Omit<NewsItem, "id" | "at">[]): Promise<void> {
  if (items.length === 0) return;
  const now = new Date().toISOString();
  const current = await getNews();
  const added = items.map((it, i) => ({
    ...it,
    at: now,
    id: `${Date.now().toString(36)}-${i}-${Math.random().toString(36).slice(2, 7)}`,
  }));
  await setJSON(NEWS_KEY, [...added, ...current].slice(0, MAX_NEWS));
}

export async function clearNews(): Promise<void> {
  await setJSON(NEWS_KEY, []);
}

// Novedades que se generan al comparar el progreso antes y después de
// completar un mundo.
export function newsForWorldProgress(
  student: Student,
  before: StudentProgress,
  after: StudentProgress
): Omit<NewsItem, "id" | "at">[] {
  const who = displayName(student, after);
  const out: Omit<NewsItem, "id" | "at">[] = [];
  const newly = after.completedWorlds.filter((id) => !before.completedWorlds.includes(id));
  for (const id of newly) {
    const world = getWorld(id);
    if (world) {
      out.push({ code: student.code, who, kind: "mundo", emoji: world.emoji, text: `completó ${world.name}` });
    }
  }
  const tierBefore = getMedalTier(before.completedWorlds.length);
  const tierAfter = getMedalTier(after.completedWorlds.length);
  if (tierAfter !== tierBefore && tierAfter !== "ninguna") {
    const info = MEDAL_INFO[tierAfter];
    out.push({ code: student.code, who, kind: "medalla", emoji: info.emoji, text: `ganó la ${info.label}` });
  }
  return out;
}

// Mensajes para animar a seguir participando (se elige uno según el día y
// el avance del alumno).
export function encouragement(progress: StudentProgress, name: string, now: Date = new Date()): string {
  const done = progress.completedWorlds.length;
  const next = done < 1 ? 1 : done < 5 ? 5 : done < 10 ? 10 : null;
  const pool = [
    `¡Vamos, ${name}! Cada mundo que completás hace crecer tu mapa.`,
    `Equivocarse también es aprender, ${name}. ¡Seguí intentando!`,
    `¡Tus compañeros están avanzando! ¿Te sumás a la aventura, ${name}?`,
    `Un poquito cada día hace una gran diferencia, ${name}. 💪`,
    `¡Qué lindo verte jugar, ${name}! Tu esfuerzo vale mucho.`,
  ];
  if (next) {
    const missing = next - done;
    const medal = next === 1 ? "tu primera medalla" : next === 5 ? "la Medalla de Plata" : "la Medalla de Oro";
    pool.push(
      `¡Te ${missing === 1 ? "falta 1 mundo" : `faltan ${missing} mundos`} para ${medal}, ${name}!`
    );
  }
  const day = Math.floor(now.getTime() / 86_400_000);
  return pool[day % pool.length];
}
