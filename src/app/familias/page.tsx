import Image from "next/image";
import Link from "next/link";
import { WORLDS } from "@/lib/worlds";
import { SUBJECT_INFO, WorldSubject } from "@/types";

export const metadata = {
  title: "Fichas para imprimir · MundoTest26",
};

// Página para las familias (no hace falta código de alumno): fichas de
// refuerzo en PDF de cada mundo, para descargar, imprimir y trabajar en
// papel (repasar trazos, escribir, dibujar y resolver).
export default function FamiliasPage() {
  const subjects = Object.keys(SUBJECT_INFO) as WorldSubject[];
  return (
    <main className="flex-1 bg-explorer-day py-8 px-4">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        <div className="wood-panel-light rounded-2xl px-5 py-4 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-white font-black text-xl sm:text-2xl">📄 Fichas para imprimir</h1>
            <p className="text-amber-100 text-sm">
              Actividades de refuerzo de cada mundo para trabajar en casa: repasar con el lápiz,
              escribir, dibujar y resolver. Cada ficha tiene 2 hojas y las soluciones al pie.
            </p>
          </div>
          <Link href="/" className="text-amber-100 text-sm font-bold underline shrink-0">
            Inicio
          </Link>
        </div>

        {subjects.map((subject) => {
          const info = SUBJECT_INFO[subject];
          const worlds = WORLDS.filter((w) => w.subject === subject);
          return (
            <section key={subject} className="parchment-panel rounded-2xl p-4">
              <h2 className="font-black text-lg mb-3">
                {info.emoji} {info.label}
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {worlds.map((w) => (
                  <li key={w.id}>
                    <a
                      href={`/fichas/mundo-${w.id}.pdf`}
                      target="_blank"
                      rel="noopener"
                      className="flex items-center gap-3 rounded-xl bg-white/60 hover:bg-white/90 border border-amber-700/20 px-3 py-2 transition"
                    >
                      <span className="relative w-12 h-12 shrink-0">
                        <Image src={`/theme/islands/mundo-${w.id}.png`} alt="" fill sizes="48px" className="object-contain" />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block font-bold text-sm">{w.name}</span>
                        <span className="block text-xs opacity-70 truncate">{w.description}</span>
                      </span>
                      <span className="text-xs font-black text-sky-700 shrink-0">PDF ⬇</span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </main>
  );
}
