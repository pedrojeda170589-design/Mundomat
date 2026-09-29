"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PanelShell, { NotConfigured, Panel, usePanelSession } from "@/components/platform/PanelShell";
import { friendlyError, platform } from "@/lib/platform/client";
import type { School } from "@/lib/platform/shared";

// Super admin: escuelas de toda la plataforma y sus direcciones. Es el
// único rol con acceso global (la base lo verifica en cada acción).
export default function PlatformPage() {
  const router = useRouter();
  const { state, session } = usePanelSession();
  const [schools, setSchools] = useState<School[]>([]);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [adminEmail, setAdminEmail] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data } = await platform().from("schools").select("*").order("name");
    setSchools(data ?? []);
  }, []);

  useEffect(() => {
    if (state === "anon") router.replace("/docente");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (state === "ready") void load();
  }, [state, load, router]);

  async function run(p: PromiseLike<{ error: unknown }>, ok: string) {
    setMsg(null);
    const { error } = await p;
    setMsg(error ? `⚠️ ${friendlyError(error)}` : `✅ ${ok}`);
    if (!error) await load();
  }

  if (state === "off") return <PanelShell title="Plataforma"><NotConfigured /></PanelShell>;
  if (state === "ready" && !session?.isSuperAdmin) {
    return (
      <PanelShell title="🌐 Plataforma" back={{ href: "/docente", label: "Mis aulas" }}>
        <Panel>Esta sección es solo para la administración general de la plataforma.</Panel>
      </PanelShell>
    );
  }
  return (
    <PanelShell title="🌐 Todas las escuelas" back={{ href: "/docente", label: "Mis aulas" }}>
      <div className="flex flex-col gap-4">
        {msg && <p className="rounded-xl bg-white/90 px-3 py-2 font-bold text-sm text-slate-800">{msg}</p>}
        <Panel>
          <p className="font-black mb-2">➕ Nueva escuela</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void run(platform().rpc("create_school", { p_name: name, p_code: code.toUpperCase() }), "Escuela creada.");
            }}
            className="flex flex-wrap gap-2 text-sm"
          >
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre" required className="flex-1 min-w-48 rounded-lg border px-2 py-1" />
            <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="CÓDIGO (letras, números y -)" required className="w-56 rounded-lg border px-2 py-1 uppercase" />
            <button className="rounded-xl bg-emerald-600 text-white font-bold px-3 py-1.5">Crear</button>
          </form>
        </Panel>
        {schools.map((s) => (
          <Panel key={s.id}>
            <div className="flex flex-wrap items-center gap-2 justify-between">
              <Link href={`/docente/escuela?id=${s.id}`} className="font-black underline decoration-dotted">
                {s.name}
              </Link>
              <span className="text-xs font-mono">{s.code}</span>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void run(platform().rpc("assign_school_admin", { p_school: s.id, p_email: adminEmail[s.id] ?? "" }), "Dirección asignada.");
              }}
              className="flex gap-1 mt-2 text-sm"
            >
              <input
                type="email"
                value={adminEmail[s.id] ?? ""}
                onChange={(e) => setAdminEmail({ ...adminEmail, [s.id]: e.target.value })}
                placeholder="email de la dirección"
                className="flex-1 rounded-lg border px-2 py-1 text-xs"
              />
              <button className="rounded-lg bg-sky-600 text-white text-xs font-bold px-2">Asignar dirección</button>
            </form>
          </Panel>
        ))}
      </div>
    </PanelShell>
  );
}
