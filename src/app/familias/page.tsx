import Image from "next/image";
import Link from "next/link";
import { WORLDS } from "@/lib/worlds";
import { SUBJECT_INFO, WorldSubject } from "@/types";
import { fichaHref, fichaVersions } from "@/lib/fichas";
import FichasGate from "@/components/FichasGate";

export const metadata = {
  title: "Fichas para imprimir · MundoTest26",
};

// Página para las familias (con el código del alumno): fichas de
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
              Propuestas para seguir aprendiendo en casa lo que se trabajó en cada mundo, sin
              repetir la app: hacer con objetos de la casa, jugar en familia, investigar,
              conversar y crear. Cada mundo tiene dos fichas distintas.
            </p>
          </div>
          <Link href="/" className="text-amber-100 text-sm font-bold underline shrink-0">
            Inicio
          </Link>
        </div>

        <FichasGate>
        <div className="flex flex-col gap-6">
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
                  <li
                    key={w.id}
                    id={`mundo-${w.id}`}
                    className="flex items-center gap-3 rounded-xl bg-white/60 border border-amber-700/20 px-3 py-2 scroll-mt-4 target:ring-4 target:ring-sky-400"
                  >
                    <span className="relative w-12 h-12 shrink-0">
                      <Image src={`/theme/islands/mundo-${w.id}.png`} alt="" fill sizes="48px" className="object-contain" />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block font-bold text-sm">{w.name}</span>
                      <span className="flex flex-wrap gap-1.5 mt-1">
                        {Array.from({ length: fichaVersions(w) }, (_, k) => k + 1).map((v) => (
                          <a
                            key={v}
                            href={fichaHref(w.id, v)}
                            target="_blank"
                            rel="noopener"
                            className="rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold px-2.5 py-1"
                          >
                            Ficha {v} ⬇
                          </a>
                        ))}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
        </div>
        </FichasGate>
      </div>
    </main>
  );
}
