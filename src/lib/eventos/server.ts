// Carga y guarda la configuración de desafíos y eventos (KV «eventosConfig»).
import { getJSON, setJSON } from "@/lib/store";
import { usarEventosConfig, type EventosConfig } from "./config";

const CLAVE = "eventosConfig";
const CACHE_MS = 15_000;
let cargadaEn = 0;

export async function leerEventosConfig(): Promise<EventosConfig> {
  return getJSON<EventosConfig>(CLAVE, {});
}

// La deja activa en este proceso (con una caché corta para no leer el KV en
// cada pedido).
export async function cargarEventosConfig(forzar = false): Promise<void> {
  if (!forzar && Date.now() - cargadaEn < CACHE_MS) return;
  try {
    usarEventosConfig(await leerEventosConfig());
    cargadaEn = Date.now();
  } catch {
    // Sin KV: sigue la última conocida (o «automático»).
  }
}

export async function guardarEventosConfig(c: EventosConfig): Promise<void> {
  await setJSON(CLAVE, c);
  usarEventosConfig(c);
  cargadaEn = Date.now();
}
