// Clave de administrador del Panel Docente.
// En producción configurala como variable de entorno ADMIN_PASSWORD en
// Vercel (Settings → Environment Variables). En desarrollo local, si no
// está configurada, se usa una clave por defecto para poder probar.

const DEFAULT_DEV_PASSWORD = "docente2026";

export function checkAdminPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD || DEFAULT_DEV_PASSWORD;
  return input === expected;
}

export function isUsingDefaultPassword(): boolean {
  return !process.env.ADMIN_PASSWORD;
}
