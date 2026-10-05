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

async function kvSetRaw(key: string, value: string, ttlSeconds?: number): Promise<void> {
  if (!KV_URL || !KV_TOKEN) {
    const db = readLocalDb();
    db[key] = value;
    writeLocalDb(db);
    return;
  }
  await fetch(`${KV_URL}/set/${encodeURIComponent(key)}${ttlSeconds ? `?EX=${Math.round(ttlSeconds)}` : ""}`, {
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

// Lee varias claves en UNA sola consulta (MGET). Mucho más rápido que leer
// clave por clave cuando hay que mirar a toda la clase.
export async function getJSONMany<T>(keys: string[], fallback: (key: string) => T): Promise<T[]> {
  if (keys.length === 0) return [];
  let raws: (string | null)[];
  if (!KV_URL || !KV_TOKEN) {
    const db = readLocalDb();
    raws = keys.map((k) => db[k] ?? null);
  } else {
    const res = await fetch(KV_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${KV_TOKEN}` },
      body: JSON.stringify(["MGET", ...keys]),
      cache: "no-store",
    });
    if (!res.ok) {
      // Si falla, se lee una por una (más lento pero seguro).
      raws = await Promise.all(keys.map((k) => kvGetRaw(k)));
    } else {
      raws = ((await res.json()) as { result: (string | null)[] }).result ?? [];
    }
  }
  return keys.map((k, i) => {
    const raw = raws[i];
    if (raw === null || raw === undefined) return fallback(k);
    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback(k);
    }
  });
}

// ttlSeconds (opcional): en Upstash la clave vence sola.
export async function setJSON<T>(key: string, value: T, opts?: { ttlSeconds?: number }): Promise<void> {
  await kvSetRaw(key, JSON.stringify(value), opts?.ttlSeconds);
}

export async function delKey(key: string): Promise<void> {
  await kvDelRaw(key);
}

// Todas las claves guardadas (local: el archivo; Upstash: SCAN). La usa el
// borrado de datos del aula abierta para no dejar rastros en ninguna clave.
export async function listKeys(): Promise<string[]> {
  if (!KV_URL || !KV_TOKEN) return Object.keys(readLocalDb());
  const keys: string[] = [];
  let cursor = "0";
  for (let i = 0; i < 1000; i++) {
    const res = await fetch(KV_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${KV_TOKEN}` },
      body: JSON.stringify(["SCAN", cursor, "COUNT", "1000"]),
      cache: "no-store",
    });
    if (!res.ok) throw new Error("No se pudieron listar las claves.");
    const { result } = (await res.json()) as { result: [string, string[]] };
    keys.push(...result[1]);
    cursor = result[0];
    if (cursor === "0") break;
  }
  return keys;
}

// Valor crudo (texto) de una clave, sin interpretar.
export async function getRaw(key: string): Promise<string | null> {
  return kvGetRaw(key);
}
