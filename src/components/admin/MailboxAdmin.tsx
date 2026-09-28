"use client";

import { useEffect, useState } from "react";
import { ClassMessage, describeMessage } from "@/lib/messagesShared";

type Row = ClassMessage & { fromName: string; toName: string };

// Buzón de la clase para el docente: prender/apagar y ver todo lo enviado.
export default function MailboxAdmin({ adminPassword }: { adminPassword: string }) {
  const [enabled, setEnabled] = useState(true);
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    fetch(`/api/messages?adminPassword=${encodeURIComponent(adminPassword)}`)
      .then((r) => r.json())
      .then((d) => {
        setEnabled(d.enabled ?? true);
        setRows(d.messages ?? []);
      })
      .catch(() => {});
  }, [adminPassword]);

  async function toggle() {
    const next = !enabled;
    setEnabled(next);
    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminPassword, enabled: next }),
    });
  }

  return (
    <div className="parchment-panel rounded-2xl p-4">
      <div className="flex items-center justify-between mb-2 gap-3">
        <h3 className="font-bold text-amber-950">💌 Buzón de la clase (mensajes ya escritos, regalos y monedas)</h3>
        <button
          onClick={toggle}
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
            enabled ? "bg-emerald-600 text-white" : "bg-slate-400 text-white"
          }`}
        >
          {enabled ? "Encendido" : "Apagado"}
        </button>
      </div>
      {rows.length === 0 ? (
        <p className="text-amber-800/60 text-sm">Todavía no se enviaron mensajes.</p>
      ) : (
        <ul className="text-sm text-amber-950 flex flex-col gap-1 max-h-64 overflow-y-auto">
          {rows.map((m) => {
            const d = describeMessage(m);
            return (
              <li key={m.id}>
                {d.emoji} <b>{m.fromName}</b> → <b>{m.toName}</b>:{" "}
                {m.kind === "mensaje" ? `“${d.text}”` : d.text.replace("te ", "")}
                <span className="text-amber-800/50 text-xs"> · {new Date(m.at).toLocaleString("es-AR")}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
