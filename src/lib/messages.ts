// Buzón de la clase: funciones de guardado (solo servidor).
import { getJSON, getJSONMany, setJSON } from "@/lib/store";
import type { ClassMessage } from "@/lib/messagesShared";

export * from "@/lib/messagesShared";

const MESSAGES_KEY = "messages";
const CONFIG_KEY = "messagingConfig";
const PRESENCE_KEY = "presence";
const MAX_STORED = 400;

export async function getMessages(): Promise<ClassMessage[]> {
  return getJSON<ClassMessage[]>(MESSAGES_KEY, []);
}

export async function saveMessages(list: ClassMessage[]): Promise<void> {
  await setJSON(MESSAGES_KEY, list.slice(0, MAX_STORED));
}

export async function isMessagingEnabled(): Promise<boolean> {
  const cfg = await getJSON<{ enabled: boolean }>(CONFIG_KEY, { enabled: true });
  return cfg.enabled;
}

export async function setMessagingEnabled(enabled: boolean): Promise<void> {
  await setJSON(CONFIG_KEY, { enabled });
}

// Presencia: cuándo se vio por última vez a cada alumno (para mostrar quién
// está conectado ahora). Una clave por alumno: escribir es una sola
// operación y dos alumnos nunca se pisan.
export async function touchPresence(code: string): Promise<void> {
  await setJSON(`${PRESENCE_KEY}:${code}`, new Date().toISOString());
}

export async function getPresenceMap(codes: string[]): Promise<Record<string, string>> {
  const list = await getJSONMany<string | null>(codes.map((c) => `${PRESENCE_KEY}:${c}`), () => null);
  const out: Record<string, string> = {};
  codes.forEach((c, i) => {
    if (list[i]) out[c] = list[i]!;
  });
  return out;
}
