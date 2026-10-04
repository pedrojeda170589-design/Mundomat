import santaCruzRaw from "./santa-cruz.json";
import napRaw from "./nap.json";

export interface CurriculumEntry {
  area: string;
  eje: string;
  contenido: string;
  fuente: string;
  validado: boolean;
}

export type CurriculoId = "santa-cruz" | "nap";

const curriculos: Record<CurriculoId, Record<string, CurriculumEntry>> = {
  "santa-cruz": santaCruzRaw as Record<string, CurriculumEntry>,
  nap: napRaw as Record<string, CurriculumEntry>,
};

let activeCurriculoId: CurriculoId = "santa-cruz";

export function getCurriculoActivo(): CurriculoId {
  return activeCurriculoId;
}

export function setCurriculoActivo(id: CurriculoId): void {
  if (curriculos[id]) {
    activeCurriculoId = id;
  }
}

export function getCurriculumEntry(
  worldId: number | string,
  curriculoId: CurriculoId = activeCurriculoId,
  validatedIds?: Set<number> | number[]
): CurriculumEntry | undefined {
  const dataset = curriculos[curriculoId] ?? curriculos["santa-cruz"];
  const entry = dataset[String(worldId)];
  if (!entry) return undefined;

  const numId = Number(worldId);
  const isValidated =
    validatedIds instanceof Set
      ? validatedIds.has(numId)
      : Array.isArray(validatedIds)
      ? validatedIds.includes(numId)
      : entry.validado;

  return {
    ...entry,
    validado: isValidated,
  };
}

export function getAllCurriculumEntries(
  curriculoId: CurriculoId = activeCurriculoId,
  validatedIds?: Set<number> | number[]
): Record<string, CurriculumEntry> {
  const dataset = curriculos[curriculoId] ?? curriculos["santa-cruz"];
  const result: Record<string, CurriculumEntry> = {};

  const valSet =
    validatedIds instanceof Set
      ? validatedIds
      : Array.isArray(validatedIds)
      ? new Set(validatedIds)
      : undefined;

  for (const [key, entry] of Object.entries(dataset)) {
    const worldId = Number(key);
    result[key] = {
      ...entry,
      validado: valSet ? valSet.has(worldId) : entry.validado,
    };
  }

  return result;
}
