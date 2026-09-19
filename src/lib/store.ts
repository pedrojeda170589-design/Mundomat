import fs from "node:fs";
import path from "node:path";

// Capa de persistencia de MundoMat.
//
// En producción (Vercel) se usa Upstash Redis vía su API REST: hay que
// agregar el storage "Upstash for Redis" (o "KV") desde el dashboard de
// Vercel y conectarlo al proyecto — eso crea automáticamente las variables
// de entorno KV_REST_API_URL y KV_REST_API_TOKEN.
//
// En desarrollo local (o si todavía no se configuró el storage), se usa un
// archivo JSON en disco como respaldo simple. OJO: en Vercel el sistema de
// archivos de las funciones es efímero, así que ese respaldo NO persiste
// entre despliegues/instancias — es solo para poder probar la app.

const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;

const LOCAL_DB_PATH = path.join(process.cwd(), ".data", "db.json");

function readLocalDb(): Record<string, string> {
  try {
    const raw = fs.readFileSync(LOCAL_DB_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function writeLocalDb(db: Record<string, string>) {
  fs.mkdirSync(path.dirname(LOCAL_DB_PATH), { recursive: true });
  fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}

export function isUsingRemoteStore(): boolean {
  return Boolean(KV_URL && KV_TOKEN);
}

async function kvGetRaw(key: string): Promise<string | null> {
  if (!KV_URL || !KV_TOKEN) {
    const db = readLocalDb();
    return db[key] ?? null;
  }
  const res = await fetch(`${KV_URL}/get/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${KV_TOKEN}` },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { result: string | null };
  return data.result;
}

async function kvSetRaw(key: string, value: string): Promise<void> {
  if (!KV_URL || !KV_TOKEN) {
    const db = readLocalDb();
    db[key] = value;
    writeLocalDb(db);
    return;
  }
  await fetch(`${KV_URL}/set/${encodeURIComponent(key)}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${KV_TOKEN}` },
    body: value,
    cache: "no-store",
  });
}

async function kvDelRaw(key: string): Promise<void> {
  if (!KV_URL || !KV_TOKEN) {
    const db = readLocalDb();
    delete db[key];
    writeLocalDb(db);
    return;
  }
  await fetch(`${KV_URL}/del/${encodeURIComponent(key)}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${KV_TOKEN}` },
    cache: "no-store",
  });
}

export async function getJSON<T>(key: string, fallback: T): Promise<T> {
  const raw = await kvGetRaw(key);
  if (raw === null || raw === undefined) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function setJSON<T>(key: string, value: T): Promise<void> {
  await kvSetRaw(key, JSON.stringify(value));
}

export async function delKey(key: string): Promise<void> {
  await kvDelRaw(key);
}
