"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import Mountains from "@/components/Mountains";
import { friendlyError, isPlatformConfigured, platform } from "@/lib/platform/client";
import type { AppRole } from "@/lib/platform/shared";

export interface AccessRow {
  role: AppRole;
  school_id: string | null;
  school_name: string | null;
}

export interface PanelSession {
  user: User;
  access: AccessRow[];
  isSuperAdmin: boolean;
  adminSchools: { id: string; name: string }[];
}

// Sesión de la plataforma: quién es y qué roles tiene (los roles los
// devuelve la base; la interfaz solo los usa para mostrar opciones: los
// permisos reales los controla la base con RLS).
export function usePanelSession() {
  const [state, setState] = useState<"loading" | "anon" | "ready" | "off">(
    isPlatformConfigured() ? "loading" : "off"
  );
  const [session, setSession] = useState<PanelSession | null>(null);

  const load = useCallback(async () => {
    if (!isPlatformConfigured()) return;
    const sb = platform();
    const { data } = await sb.auth.getSession();
    const user = data.session?.user;
    if (!user) {
      setSession(null);
      setState("anon");
      return;
    }
    const { data: access } = await sb.rpc("my_access");
    const rows = (access ?? []) as AccessRow[];
    setSession({
      user,
      access: rows,
      isSuperAdmin: rows.some((r) => r.role === "super_admin"),
      adminSchools: rows
        .filter((r) => r.role === "school_admin" && r.school_id)
        .map((r) => ({ id: r.school_id!, name: r.school_name ?? "" })),
    });
    setState("ready");
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
    if (!isPlatformConfigured()) return;
    const { data } = platform().auth.onAuthStateChange(() => void load());
    return () => data.subscription.unsubscribe();
  }, [load]);

  return { state, session, reload: load };
}

export default function PanelShell({
  title,
  subtitle,
  back,
  children,
}: {
  title: string;
  subtitle?: string;
  back?: { href: string; label: string };
  children: React.ReactNode;
}) {
  const router = useRouter();
  async function logout() {
    await platform().auth.signOut();
    router.push("/docente");
  }
  return (
    <main className="relative flex-1 bg-explorer-day py-6 px-4 overflow-hidden [&_select]:text-slate-900 [&_select]:bg-white [&_input]:text-slate-900">
      <Mountains isDay />
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="wood-panel-light flex items-center justify-between gap-3 mb-5 rounded-2xl px-5 py-3">
          <div className="min-w-0">
            {back && (
              <Link href={back.href} className="text-amber-100 text-xs underline">
                ← {back.label}
              </Link>
            )}
            <h1 className="text-xl sm:text-2xl font-black text-amber-50 truncate">{title}</h1>
            {subtitle && <p className="text-amber-100 text-sm truncate">{subtitle}</p>}
          </div>
          {isPlatformConfigured() && (
            <button onClick={logout} className="text-amber-100 text-sm underline shrink-0">
              Salir
            </button>
          )}
        </div>
        {children}
      </div>
    </main>
  );
}

export function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`parchment-panel rounded-2xl p-4 text-amber-950 ${className}`}>{children}</section>;
}

export function ErrorNote({ error }: { error: unknown }) {
  if (!error) return null;
  return <p className="text-sm font-bold text-rose-700">⚠️ {friendlyError(error)}</p>;
}

export function NotConfigured() {
  return (
    <Panel>
      <p className="font-black text-lg">La plataforma todavía no está configurada</p>
      <p className="text-sm mt-1">
        Faltan las variables <code>NEXT_PUBLIC_SUPABASE_URL</code> y <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>. Mientras
        tanto, el panel de siempre sigue funcionando.
      </p>
      <Link href="/admin" className="inline-block mt-3 rounded-xl bg-sky-600 text-white font-bold px-4 py-2">
        Ir al panel de siempre
      </Link>
    </Panel>
  );
}
