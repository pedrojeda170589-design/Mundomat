"use client";

import { useState } from "react";
import { AVATAR_OPTIONS, MAX_NICKNAME_LENGTH } from "@/types";

interface Props {
  code: string;
  currentAvatar?: string;
  currentNickname?: string;
  realName: string;
  onClose: () => void;
  onSaved: (update: { avatar?: string; nickname?: string }) => void;
}

export default function ProfileEditor({
  code,
  currentAvatar,
  currentNickname,
  realName,
  onClose,
  onSaved,
}: Props) {
  const [avatar, setAvatar] = useState<string>(
    currentAvatar || AVATAR_OPTIONS[0]
  );
  const [nickname, setNickname] = useState<string>(currentNickname || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, avatar, nickname: nickname.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "No pudimos guardar los cambios.");
        setSaving(false);
        return;
      }
      onSaved({ avatar: data.progress.avatar, nickname: data.progress.nickname });
    } catch {
      setError("Ocurrió un error. Probá de nuevo.");
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-700 p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-white font-black text-lg">Mi perfil</h2>
          <button
            onClick={onClose}
            className="text-slate-400 text-xl leading-none"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div>
          <p className="text-slate-400 text-xs mb-2">Elegí tu avatar</p>
          <div className="grid grid-cols-6 gap-2">
            {AVATAR_OPTIONS.map((a) => (
              <button
                key={a}
                onClick={() => setAvatar(a)}
                className={`text-2xl rounded-xl py-2 border-2 transition ${
                  avatar === a
                    ? "border-amber-400 bg-amber-400/10"
                    : "border-slate-700 bg-slate-800/50"
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-slate-400 text-xs mb-2">
            Nombre de usuario (solo para el juego)
          </p>
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder={realName}
            maxLength={MAX_NICKNAME_LENGTH}
            className="w-full rounded-xl bg-slate-800 border border-slate-600 px-3 py-2 text-white outline-none focus:border-amber-400"
          />
          <p className="text-slate-500 text-[11px] mt-1">
            Tu docente siempre va a ver tu nombre real ({realName}) en el
            Panel Docente. Este es solo el nombre que ves vos al jugar.
          </p>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl bg-slate-800 text-slate-300 font-semibold py-2.5"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 font-bold py-2.5 disabled:opacity-60"
          >
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}
