import Link from "next/link";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950">
      <div className="text-center mb-10">
        <p className="text-amber-300 font-semibold tracking-wide text-sm mb-2">
          3° GRADO · EDUCACIÓN PRIMARIA
        </p>
        <p className="text-slate-300 text-sm mb-1">
          Escuela Hogar Primaria Provincial Rural N°2 - Héroes de Malvinas
        </p>
        <p className="text-slate-400 text-sm mb-6">Profe: Pedro</p>
        <h1 className="text-5xl sm:text-6xl font-black bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent drop-shadow-sm">
          MundoMat
        </h1>
        <p className="text-slate-300 mt-3 text-lg">
          Matemática, Lengua, Ciencias Naturales y Ciencias Sociales 🚀
        </p>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Link
          href="/student"
          className="rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 font-extrabold text-lg py-4 text-center shadow-lg shadow-amber-500/20 hover:brightness-105 active:scale-[0.98] transition"
        >
          🎮 Soy alumno/a
        </Link>
        <Link
          href="/admin"
          className="rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-lg py-4 text-center shadow-lg shadow-blue-600/20 hover:brightness-105 active:scale-[0.98] transition"
        >
          🧑‍🏫 Soy docente
        </Link>
      </div>
    </main>
  );
}
