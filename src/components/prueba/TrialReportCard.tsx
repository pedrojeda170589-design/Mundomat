"use client";

import { TrialReport } from "@/lib/openClassroomShared";

// Informe final de la prueba: qué logró, qué le salió muy bien y qué
// conviene seguir reforzando. Se puede imprimir o guardar como PDF.
export default function TrialReportCard({ report }: { report: TrialReport }) {
  const pctTotal =
    report.totalAnswered > 0 ? Math.round((report.totalCorrect / report.totalAnswered) * 100) : null;
  const fecha = new Date(report.createdAt).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="parchment-panel rounded-2xl p-5 text-left shadow-lg border-2 border-amber-600/40 print:shadow-none print:border-0">
      <div className="text-center mb-3">
        <p className="text-3xl">📋</p>
        <h3 className="text-lg font-black text-amber-950">Informe de la prueba</h3>
        <p className="text-xs text-amber-900/80">
          {report.name} · {fecha}
        </p>
      </div>

      <p className="text-sm text-amber-950 mb-3">
        {report.endedReason === "mundos"
          ? "¡Superaste todos los mundos de la prueba en las cuatro materias! "
          : "Terminó tu período de prueba. "}
        Jugaste {report.daysPlayed} {report.daysPlayed === 1 ? "día" : "días"}, superaste{" "}
        <strong>{report.totalCompleted}</strong> {report.totalCompleted === 1 ? "mundo" : "mundos"} y
        respondiste {report.totalAnswered} actividades
        {pctTotal !== null && (
          <>
            {" "}
            con <strong>{pctTotal}%</strong> de aciertos
          </>
        )}
        .
      </p>

      <div className="grid grid-cols-1 gap-2 mb-3">
        {report.bySubject.map((s) => (
          <div key={s.subject} className="rounded-xl bg-white/60 border border-amber-700/20 px-3 py-2">
            <div className="flex items-center justify-between text-sm font-bold text-amber-950">
              <span>
                {s.emoji} {s.label}
              </span>
              <span>{s.pct === null ? "sin jugar" : `${s.pct}% de aciertos`}</span>
            </div>
            {s.completedWorlds.length > 0 && (
              <p className="text-xs text-amber-900/80 mt-0.5">Superó: {s.completedWorlds.join(", ")}</p>
            )}
          </div>
        ))}
      </div>

      {report.strengths.length > 0 && (
        <div className="mb-3">
          <p className="text-sm font-black text-emerald-800">🌟 Lo que le salió muy bien</p>
          <p className="text-sm text-amber-950">{report.strengths.join(", ")}.</p>
        </div>
      )}

      {(report.toReinforce.length > 0 || report.notExplored.length > 0) && (
        <div className="mb-3">
          <p className="text-sm font-black text-amber-800">💪 Para seguir reforzando</p>
          <ul className="text-sm text-amber-950 list-disc pl-5 space-y-1">
            {report.toReinforce.map((r) => (
              <li key={r.world}>
                <strong>{r.world}</strong> ({r.subject}, {r.pct}% de aciertos): {r.tip}
              </li>
            ))}
            {report.notExplored.length > 0 && (
              <li>Todavía no llegó a explorar: {report.notExplored.join(", ")}.</li>
            )}
          </ul>
        </div>
      )}

      <p className="text-sm text-amber-950 font-semibold">
        Aprender es como un músculo: cuanto más se practica, más fuerte se pone. ¡Seguí jugando, leyendo
        y contando todos los días!
      </p>
      <p className="text-[11px] text-amber-900/70 mt-2">
        Por privacidad, el historial de juego de la prueba se borró. Este informe es lo único que se
        conserva.
      </p>

      <div className="text-center mt-3 print:hidden">
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold px-4 py-2"
        >
          🖨️ Imprimir o guardar el informe
        </button>
      </div>
    </div>
  );
}
