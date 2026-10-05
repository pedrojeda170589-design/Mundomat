import { insigniaDeVueltas } from "@/lib/torneo/vueltas";

// Insignia del Torneo de las tablas: registro de las veces que repasó las 9
// tablas (×2, ×3… ×10, A1… A10, B1…). El alumno la puede ocultar.
export default function InsigniaTorneo({
  vueltas,
  texto,
  className = "min-w-6 h-6 px-1 text-[10px]",
}: {
  vueltas?: number;
  texto?: string; // para mostrar una insignia que todavía no tiene (la próxima)
  className?: string;
}) {
  const t = texto ?? insigniaDeVueltas(vueltas ?? 0);
  if (!t) return null;
  const nivelLetra = /^[A-Z]/.test(t);
  const title = nivelLetra ? `Insignia ${t}: repasó las tablas muchas veces en el torneo` : `Insignia ${t}: repasó las tablas en el torneo`;
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full border-2 border-white font-black shadow ring-1 leading-none select-none ${
        nivelLetra
          ? "bg-gradient-to-br from-fuchsia-400 via-violet-500 to-indigo-600 text-white ring-violet-700/50"
          : "bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-500 text-slate-950 ring-amber-600/40"
      } ${className}`}
      title={title}
      aria-label={title}
      role="img"
    >
      {t}
    </span>
  );
}
