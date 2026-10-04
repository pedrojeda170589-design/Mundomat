"use client";

interface DictationWeekRecord {
  firstScore: number;
  rewarded: boolean;
  mistakes?: string[];
  completedAt?: string;
}

interface Props {
  dictationWeeks?: Record<string, DictationWeekRecord>;
}

export default function DictationReport({ dictationWeeks }: Props) {
  if (!dictationWeeks || Object.keys(dictationWeeks).length === 0) {
    return (
      <div className="rounded-xl bg-amber-50/60 border border-amber-200 p-3 text-sm text-amber-900/70">
        Todavía no jugó en el Mundo del Dictado.
      </div>
    );
  }

  // Ordenar las semanas de la más reciente a la más antigua
  const weeks = Object.keys(dictationWeeks).sort().reverse();

  return (
    <div className="flex flex-col gap-2.5">
      {weeks.map((weekKey) => {
        const record = dictationWeeks[weekKey];
        const isPerfect = record.firstScore === 100;
        const mistakes = record.mistakes ?? [];

        return (
          <div
            key={weekKey}
            className="rounded-xl bg-white border border-amber-200/80 p-3 shadow-xs text-sm"
          >
            <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
              <span className="font-black text-amber-950 flex items-center gap-1.5">
                <span>📅</span> {weekKey}
              </span>
              <div className="flex items-center gap-2">
                <span
                  className={`font-black px-2 py-0.5 rounded-full text-xs ${
                    isPerfect
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : record.firstScore >= 80
                        ? "bg-amber-100 text-amber-800 border border-amber-300"
                        : "bg-red-100 text-red-800 border border-red-300"
                  }`}
                >
                  Primer intento: {record.firstScore}%
                </span>
                {record.rewarded && (
                  <span
                    className="bg-yellow-100 text-yellow-900 border border-yellow-300 font-bold px-2 py-0.5 rounded-full text-xs flex items-center gap-1"
                    title="Ganó +20 monedas y el Lápiz dorado"
                  >
                    <span>✏️</span> Premio obtenido
                  </span>
                )}
              </div>
            </div>

            {mistakes.length > 0 ? (
              <div className="mt-2 text-xs bg-red-50 border border-red-200 rounded-lg p-2 text-red-900">
                <span className="font-bold">❌ Palabras y números a reforzar:</span>{" "}
                <span>{mistakes.join(", ")}</span>
              </div>
            ) : (
              <div className="mt-1 text-xs text-emerald-700 font-semibold">
                ✨ ¡100% de aciertos sin errores en el primer intento!
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
