"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import AvatarDisplay from "@/components/AvatarDisplay";
import { CHALLENGE_MESSAGES } from "@/lib/messagesShared";
import { AvatarAccessories } from "@/types";

interface Invite {
  id: string;
  fromName: string;
  avatar?: string;
  accessories?: AvatarAccessories;
  tweaks?: import("@/types").AvatarTweaks;
  background?: string;
  presetId: string;
}

const POLL_MS = 20_000;

// Entrada a la competencia (en el mapa) + aviso cuando un compañero te
// invita a un duelo EN VIVO (se consulta cada 20 s).
export default function CompetitionBanner({ code }: { code: string }) {
  const router = useRouter();
  const [invite, setInvite] = useState<Invite | null>(null);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stop = false;
    async function poll() {
      try {
        const d = await fetch(`/api/competition?code=${encodeURIComponent(code)}&invites=1`).then((r) => r.json());
        if (stop) return;
        const next = (d.invites as Invite[] | undefined)?.find((i) => !dismissed.has(i.id)) ?? null;
        setInvite(next);
      } catch {
        // sin conexión: se vuelve a intentar
      }
    }
    void poll();
    const t = setInterval(() => void poll(), POLL_MS);
    return () => {
      stop = true;
      clearInterval(t);
    };
  }, [code, dismissed]);

  async function respond(accept: boolean) {
    if (!invite) return;
    setBusy(true);
    try {
      const r = await fetch("/api/competition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, action: "respond", duelId: invite.id, accept }),
      });
      if (accept && r.ok) {
        router.push(`/student/competencia/jugar?duelo=${invite.id}`);
        return;
      }
      if (accept && !r.ok) {
        const d = await r.json();
        setError(d.error ?? "No se pudo aceptar.");
        return;
      }
      setDismissed((s) => new Set(s).add(invite.id));
      setInvite(null);
      setError(null);
    } finally {
      setBusy(false);
    }
  }

  const msg = invite && CHALLENGE_MESSAGES.find((m) => m.id === invite.presetId);

  return (
    <>
      <button
        onClick={() => router.push("/student/competencia")}
        className="relative z-10 w-full max-w-3xl mx-auto mb-5 px-4 text-left"
      >
        <div className="rounded-2xl border-4 border-rose-300 bg-gradient-to-r from-rose-600 via-red-500 to-amber-500 px-4 py-2.5 flex items-center gap-3 shadow-lg hover:brightness-110 transition">
          <span className="text-3xl">⚔️</span>
          <span className="flex-1 min-w-0">
            <span className="block text-white font-black text-base drop-shadow">Competencia de memoria</span>
            <span className="block text-white/90 text-xs">
              Duelos con tus compañeros y torneo de la semana · ¡todos ganan monedas!
            </span>
          </span>
          <span className="shrink-0 rounded-xl bg-white/90 px-3 py-1.5 font-black text-rose-700">Entrar →</span>
        </div>
      </button>

      {invite &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4">
            <div className="w-full max-w-sm rounded-3xl bg-white p-5 flex flex-col items-center gap-3 text-center text-slate-900">
              <AvatarDisplay
                character={invite.avatar}
                accessories={invite.accessories}
                  tweaks={invite.tweaks}
                background={invite.background}
                className="w-20 h-20 rounded-2xl"
                imageSizes="80px"
              />
              <p className="font-black text-lg">⚡ {invite.fromName} te desafía a un duelo en vivo</p>
              {msg && (
                <p className="text-sm italic">
                  {msg.emoji} “{msg.text}”
                </p>
              )}
              {error && <p className="text-sm font-bold text-rose-600">{error}</p>}
              <div className="grid grid-cols-2 gap-2 w-full">
                <button
                  disabled={busy}
                  onClick={() => void respond(true)}
                  className="rounded-2xl bg-emerald-500 text-white font-black py-2.5"
                >
                  ¡Acepto!
                </button>
                <button disabled={busy} onClick={() => void respond(false)} className="rounded-2xl bg-slate-200 font-bold py-2.5">
                  Ahora no
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
