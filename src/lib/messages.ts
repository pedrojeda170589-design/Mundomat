// Buzón de la clase: funciones de guardado (solo servidor).
import { getJSON, setJSON } from "@/lib/store";
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
// está conectado ahora).
export async function touchPresence(code: string): Promise<Record<string, string>> {
  const p = await getJSON<Record<string, string>>(PRESENCE_KEY, {});
  p[code] = new Date().toISOString();
  await setJSON(PRESENCE_KEY, p);
  return p;
}
