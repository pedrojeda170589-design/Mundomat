import {
  AccessorySlot,
  AvatarAccessories,
  AvatarCapa,
  AvatarTweaks,
  TWEAK_LIMITES,
  getAccessoryById,
} from "@/types";

export const MAX_ACCESORIOS = 5;
export const MAX_MASCOTAS = 3;

// Orden histórico de los casilleros (de atrás hacia adelante).
export const SLOT_ORDER_LEGACY: AccessorySlot[] = [
  "torso",
  "backpack",
  "face",
  "pendant",
  "eyewear",
  "headwear",
  "prop",
  "pet",
];

export function isPet(id: string): boolean {
  return getAccessoryById(id)?.slot === "pet";
}

export function isProp(id: string): boolean {
  return getAccessoryById(id)?.slot === "prop";
}

/**
 * Obtiene la lista ordenada de capas del avatar (de atrás hacia adelante).
 * Si `avatarCapas` ya existe, la devuelve.
 * Si no, migra automáticamente desde `avatarAccessories` + `avatarTweaks`
 * respetando el orden histórico de dibujo (SLOT_ORDER_LEGACY).
 */
export function capasDe(
  progress?: {
    avatarCapas?: AvatarCapa[];
    avatarAccessories?: AvatarAccessories;
    avatarTweaks?: AvatarTweaks;
  } | null
): AvatarCapa[] {
  if (!progress) return [];
  if (Array.isArray(progress.avatarCapas) && progress.avatarCapas.length > 0) {
    return progress.avatarCapas.filter((c) => !!getAccessoryById(c.id));
  }
  if (!progress.avatarAccessories) return [];

  const capas: AvatarCapa[] = [];
  for (const slot of SLOT_ORDER_LEGACY) {
    const id = progress.avatarAccessories[slot];
    if (id && getAccessoryById(id)) {
      const t = progress.avatarTweaks?.[slot];
      const capa: AvatarCapa = { id };
      if (t?.x !== undefined && t.x !== 0) capa.x = t.x;
      if (t?.y !== undefined && t.y !== 0) capa.y = t.y;
      if (t?.s !== undefined && t.s !== 1) capa.s = t.s;
      capas.push(capa);
    }
  }
  return capas;
}

/**
 * Convierte una lista de capas a los campos históricos `avatarAccessories` y `avatarTweaks`
 * para compatibilidad con código antiguo que lea esos campos.
 * Guarda el primer accesorio de cada casillero.
 */
export function capasToAccessories(capas: AvatarCapa[]): {
  accessories: AvatarAccessories;
  tweaks: AvatarTweaks;
} {
  const accessories: AvatarAccessories = {};
  const tweaks: AvatarTweaks = {};
  for (const c of capas) {
    const def = getAccessoryById(c.id);
    if (!def) continue;
    const slot = def.slot;
    if (!accessories[slot]) {
      accessories[slot] = c.id;
      if (c.x !== undefined || c.y !== undefined || c.s !== undefined) {
        tweaks[slot] = { x: c.x ?? 0, y: c.y ?? 0, s: c.s ?? 1 };
      }
    }
  }
  return { accessories, tweaks };
}

/**
 * Agrega un accesorio o mascota arriba de todo (al final de la lista).
 * Controla límites: máximo 5 accesorios y 3 mascotas.
 */
export function agregarCapa(
  capas: AvatarCapa[],
  id: string
): { ok: true; capas: AvatarCapa[] } | { ok: false; error: string } {
  const def = getAccessoryById(id);
  if (!def) return { ok: false, error: "El accesorio no existe." };
  if (capas.some((c) => c.id === id)) {
    return { ok: false, error: "Ese objeto ya está puesto." };
  }

  if (isPet(id)) {
    const petCount = capas.filter((c) => isPet(c.id)).length;
    if (petCount >= MAX_MASCOTAS) {
      return { ok: false, error: "Ya tenés 3 mascotas: sacate una." };
    }
  } else if (isProp(id)) {
    const propCount = capas.filter((c) => isProp(c.id)).length;
    if (propCount >= 1) {
      return { ok: false, error: "Ya tenés un objeto en la mano: sacalo para poner otro." };
    }
    const accCount = capas.filter((c) => !isPet(c.id)).length;
    if (accCount >= MAX_ACCESORIOS) {
      return { ok: false, error: "Ya tenés 5 accesorios: sacate uno." };
    }
  } else {
    const accCount = capas.filter((c) => !isPet(c.id)).length;
    if (accCount >= MAX_ACCESORIOS) {
      return { ok: false, error: "Ya tenés 5 accesorios: sacate uno." };
    }
  }

  return { ok: true, capas: [...capas, { id }] };
}

/**
 * Quita una capa del avatar por su id.
 */
export function quitarCapa(capas: AvatarCapa[], id: string): AvatarCapa[] {
  return capas.filter((c) => c.id !== id);
}

/**
 * Mueve una capa una posición adelante (hacia arriba / z-index mayor).
 */
export function moverCapaAdelante(capas: AvatarCapa[], id: string): AvatarCapa[] {
  const idx = capas.findIndex((c) => c.id === id);
  if (idx < 0 || idx >= capas.length - 1) return capas;
  const res = [...capas];
  const tmp = res[idx];
  res[idx] = res[idx + 1];
  res[idx + 1] = tmp;
  return res;
}

/**
 * Mueve una capa una posición atrás (hacia abajo / z-index menor).
 */
export function moverCapaAtras(capas: AvatarCapa[], id: string): AvatarCapa[] {
  const idx = capas.findIndex((c) => c.id === id);
  if (idx <= 0) return capas;
  const res = [...capas];
  const tmp = res[idx];
  res[idx] = res[idx - 1];
  res[idx - 1] = tmp;
  return res;
}

/**
 * Actualiza el corrimiento x/y y la escala s de una capa específica.
 */
export function actualizarTweakCapa(
  capas: AvatarCapa[],
  id: string,
  tweak: { x?: number; y?: number; s?: number }
): AvatarCapa[] {
  const L = TWEAK_LIMITES;
  return capas.map((c) => {
    if (c.id !== id) return c;
    const x =
      tweak.x !== undefined
        ? Math.max(-L.pos, Math.min(L.pos, Math.round(tweak.x * 10) / 10))
        : c.x;
    const y =
      tweak.y !== undefined
        ? Math.max(-L.pos, Math.min(L.pos, Math.round(tweak.y * 10) / 10))
        : c.y;
    const s =
      tweak.s !== undefined
        ? Math.max(L.sMin, Math.min(L.sMax, Math.round(tweak.s * 100) / 100))
        : c.s;

    const res: AvatarCapa = { id: c.id };
    if (x !== undefined && x !== 0) res.x = x;
    if (y !== undefined && y !== 0) res.y = y;
    if (s !== undefined && s !== 1) res.s = s;
    return res;
  });
}

/**
 * Valida un array de capas para guardar en el servidor.
 * Verifica existencia, propiedad del alumno, límites (5 accesorios + 3 mascotas),
 * unicidad y límites de tweaks.
 */
export function validarCapas(
  input: unknown,
  equippableIds: Set<string>
): { ok: true; capas: AvatarCapa[] } | { ok: false; error: string } {
  if (!Array.isArray(input)) {
    return { ok: false, error: "Las capas deben ser una lista." };
  }

  const cleanCapas: AvatarCapa[] = [];
  const seenIds = new Set<string>();
  const L = TWEAK_LIMITES;

  let accCount = 0;
  let petCount = 0;
  let propCount = 0;

  for (let i = 0; i < input.length; i++) {
    const item = input[i];
    if (!item || typeof item !== "object" || typeof (item as { id?: unknown }).id !== "string") {
      return { ok: false, error: `Capa #${i + 1} inválida.` };
    }
    const id = (item as { id: string }).id;
    if (seenIds.has(id)) {
      return { ok: false, error: `El accesorio "${id}" está repetido.` };
    }
    seenIds.add(id);

    const def = getAccessoryById(id);
    if (!def) {
      return { ok: false, error: `El accesorio "${id}" no existe.` };
    }
    if (!equippableIds.has(id)) {
      return { ok: false, error: `No tenés el accesorio "${id}".` };
    }

    if (def.slot === "pet") {
      petCount++;
    } else {
      accCount++;
      if (def.slot === "prop") {
        propCount++;
      }
    }

    const capa: AvatarCapa = { id };
    const rawX = (item as { x?: unknown }).x;
    const rawY = (item as { y?: unknown }).y;
    const rawS = (item as { s?: unknown }).s;

    if (typeof rawX === "number" && Number.isFinite(rawX)) {
      const x = Math.max(-L.pos, Math.min(L.pos, Math.round(rawX * 10) / 10));
      if (x !== 0) capa.x = x;
    }
    if (typeof rawY === "number" && Number.isFinite(rawY)) {
      const y = Math.max(-L.pos, Math.min(L.pos, Math.round(rawY * 10) / 10));
      if (y !== 0) capa.y = y;
    }
    if (typeof rawS === "number" && Number.isFinite(rawS)) {
      const s = Math.max(L.sMin, Math.min(L.sMax, Math.round(rawS * 100) / 100));
      if (s !== 1) capa.s = s;
    }

    cleanCapas.push(capa);
  }

  if (accCount > MAX_ACCESORIOS) {
    return { ok: false, error: `Como máximo podés poner ${MAX_ACCESORIOS} accesorios.` };
  }
  if (petCount > MAX_MASCOTAS) {
    return { ok: false, error: `Como máximo podés poner ${MAX_MASCOTAS} mascotas.` };
  }
  if (propCount > 1) {
    return { ok: false, error: "Ya tenés un objeto en la mano: sacalo para poner otro." };
  }

  return { ok: true, capas: cleanCapas };
}
