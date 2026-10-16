import { GRADES } from "../src/lib/grades";
import { buildActivitiesForWorld, ActivitySpec } from "../src/lib/activities";

interface ActivityCandidate {
  worldId: number;
  worldName: string;
  activityId: string;
  activityType: string;
  prompt: string;
  maxOptionText: string;
  totalLength: number;
  activity: ActivitySpec;
}

function getTextLength(act: ActivitySpec): { prompt: string; maxOptionText: string; totalLength: number } {
  const prompt = (act as { prompt?: string }).prompt || (act as { statement?: string }).statement || "";
  let maxOption = "";

  if ("choices" in act && Array.isArray(act.choices)) {
    for (const c of act.choices) {
      if (typeof c === "string" && c.length > maxOption.length) maxOption = c;
    }
  } else if ("cards" in act && Array.isArray(act.cards)) {
    for (const c of act.cards) {
      const txt = c.label || c.big || "";
      if (txt.length > maxOption.length) maxOption = txt;
    }
  } else if ("items" in act && Array.isArray(act.items)) {
    for (const it of act.items) {
      const txt = typeof it === "string" ? it : (it as { label?: string }).label || "";
      if (txt.length > maxOption.length) maxOption = txt;
    }
  } else if ("pairs" in act && Array.isArray(act.pairs)) {
    for (const p of act.pairs) {
      const txt = `${p.left} - ${p.right}`;
      if (txt.length > maxOption.length) maxOption = txt;
    }
  } else if ("scenes" in act && Array.isArray(act.scenes)) {
    for (const sc of act.scenes) {
      if (sc.text && sc.text.length > maxOption.length) maxOption = sc.text;
    }
  } else if ("categories" in act && Array.isArray(act.categories)) {
    for (const cat of act.categories) {
      if (cat.length > maxOption.length) maxOption = cat;
    }
  }

  const totalLength = prompt.length + maxOption.length;
  return { prompt, maxOptionText: maxOption, totalLength };
}

function main() {
  console.log("=== ANÁLISIS DE ACTIVIDADES POR GRADO Y TIPO ===\n");

  const gradeTypes: Record<number, Set<string>> = { 1: new Set(), 2: new Set(), 3: new Set(), 4: new Set() };
  const longestByGradeAndType: Record<number, Record<string, ActivityCandidate>> = {
    1: {},
    2: {},
    3: {},
    4: {},
  };

  for (const gradeDef of GRADES) {
    const grade = gradeDef.grade;
    for (const world of gradeDef.worlds) {
      let activities: ActivitySpec[] = [];
      try {
        activities = buildActivitiesForWorld(world);
      } catch (err) {
        console.error(`Error al construir actividades para mundo ${world.id}:`, err);
      }

      for (const act of activities) {
        const type = act.type;
        gradeTypes[grade].add(type);

        const { prompt, maxOptionText, totalLength } = getTextLength(act);
        const currentBest = longestByGradeAndType[grade][type];

        if (!currentBest || totalLength > currentBest.totalLength) {
          longestByGradeAndType[grade][type] = {
            worldId: world.id,
            worldName: world.name,
            activityId: act.id,
            activityType: type,
            prompt,
            maxOptionText,
            totalLength,
            activity: act,
          };
        }
      }
    }
  }

  // Resumen
  for (const grade of [1, 2, 3, 4]) {
    const types = Array.from(gradeTypes[grade]).sort();
    console.log(`\n📘 Grado ${grade}: ${types.length} tipos de actividad encontrados:`);
    console.log(`   ${types.join(", ")}`);
    for (const t of types) {
      const best = longestByGradeAndType[grade][t];
      console.log(`   - [${t}] Mundo ${best.worldId} (${best.worldName}):`);
      console.log(`       Prompt (${best.prompt.length} cars): "${best.prompt.slice(0, 70)}..."`);
      if (best.maxOptionText) {
        console.log(`       Opción/Texto (${best.maxOptionText.length} cars): "${best.maxOptionText.slice(0, 70)}..."`);
      }
    }
  }
}

main();
