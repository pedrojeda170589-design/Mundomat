import Link from "next/link";
import FichasView from "./FichasView";

export const metadata = {
  title: "Fichas para imprimir · MundoTest26",
};

// Página para las familias (con el código del alumno): fichas de
// refuerzo en PDF de cada mundo, para descargar, imprimir y trabajar en
// papel (repasar trazos, escribir, dibujar y resolver).
export default function FamiliasPage() {
  return (
    <main className="flex-1 bg-explorer-day py-8 px-4">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        <div className="wood-panel-light rounded-2xl px-5 py-4 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-white font-black text-xl sm:text-2xl">📄 Fichas para imprimir</h1>
            <p className="text-amber-100 text-sm">
              Propuestas para seguir aprendiendo en casa lo que se trabajó en cada mundo, sin
              repetir la app: hacer con objetos de la casa, jugar en familia, investigar,
              conversar y crear. Cada mundo tiene sus fichas de refuerzo (dos para 3.º grado, una para 1.º y 2.º grado).
            </p>
          </div>
          <Link href="/" className="text-amber-100 text-sm font-bold underline shrink-0">
            Inicio
          </Link>
        </div>

        <a
          href="/tabla-pitagorica"
          className="parchment-panel rounded-2xl px-4 py-3 flex items-center gap-3 font-bold text-amber-950 hover:brightness-105"
        >
          <span className="text-3xl">✖️</span>
          <span>
            Tabla pitagórica para imprimir (PDF o imagen)
            <span className="block text-xs font-normal">Del 0 al 10, para multiplicar y dividir. Ideal para pegar en la carpeta.</span>
          </span>
        </a>

        <FichasView />
      </div>
    </main>
  );
}
