// Actividades de un mundo de cuento: primero el cuento (escuchado en 1.º,
// leído en 2.º y 3.º; no suma puntos), después todas las preguntas, una
// detrás de otra.
import type { ActivitySpec } from "@/lib/activities";
import type { WorldDef } from "@/types";
import { cuentoImage, getCuento } from "./catalogo";
import { BASE_SKILL, preguntasDe, SKILL_BY_KIND } from "./recorrido";

function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function buildStoryActivities(world: WorldDef): ActivitySpec[] {
  const c = world.storyId ? getCuento(world.storyId) : undefined;
  if (!c) return [];
  const grade = world.grade ?? 3;
  const mode = grade >= 2 ? "read" : "listen";
  const story = { title: c.title, text: c.scenes.join(" ") };
  const acts: ActivitySpec[] = [
    {
      type: "listen",
      id: `${c.id}-cuento`,
      title: c.title,
      prompt: mode === "read" ? `Leé el cuento: ${c.title}.` : `Escuchá el cuento: ${c.title}.`,
      storyId: c.id,
      mode,
      scenes: c.scenes.map((text, i) => ({ text, image: cuentoImage(c.id, i + 1) })),
      hint: mode === "read" ? "Leé con atención: después vienen preguntas." : "Escuchá con atención: después vienen preguntas.",
      skills: [],
    },
  ];
  preguntasDe(grade, c.id).forEach((q, i) => {
    const cards = q.options.map(([emoji, label], k) => ({ id: `o${k}`, emoji, label, say: label }));
    acts.push({
      type: "pick",
      id: `${c.id}-p${i + 1}`,
      title: `Pregunta ${i + 1}`,
      prompt: q.q,
      cards: shuffle(cards),
      answerIds: [`o${q.answer}`],
      story,
      storyFirst: false,
      hint: q.hint,
      skills: [BASE_SKILL[grade], SKILL_BY_KIND[grade][q.kind]],
    });
  });
  return acts;
}
