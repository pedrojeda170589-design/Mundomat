import Image from "next/image";
import Link from "next/link";
import { COLOR_COLUMNA, COLOR_FILA, TABLA_MAX } from "@/lib/tablaPitagorica";

// Tabla pitagórica para descargar e imprimir (modelo de Pedro). La misma
// página genera el PDF y la imagen de public/descargas/ con
// scripts/descargas/tabla-pitagorica.mjs.
export const metadata = {
  title: "Tabla pitagórica · MundoTest26",
  description: "Tabla pitagórica del 0 al 10 para multiplicar y dividir, lista para imprimir.",
};

const nums = Array.from({ length: TABLA_MAX + 1 }, (_, i) => i);

export default function TablaPitagoricaPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900 flex flex-col items-center py-4 px-2 print:p-0">
      {/* Botones (no se imprimen) */}
      <div className="print:hidden w-full max-w-[820px] flex flex-wrap items-center justify-center gap-2 mb-4">
        <a href="/descargas/tabla-pitagorica.pdf" download className="rounded-full bg-indigo-600 text-white font-bold px-4 py-2 text-sm shadow">
          📥 Descargar PDF
        </a>
        <a href="/descargas/tabla-pitagorica.png" download className="rounded-full bg-sky-600 text-white font-bold px-4 py-2 text-sm shadow">
          🖼️ Descargar imagen
        </a>
        <Link href="/" className="rounded-full bg-slate-200 text-slate-800 font-bold px-4 py-2 text-sm">
          ← Volver
        </Link>
      </div>

      <section id="lamina" className="w-full max-w-[820px] bg-white rounded-3xl p-4 sm:p-6 print:rounded-none" style={{ aspectRatio: "auto" }}>
        {/* Encabezado: el profe a cada lado, con sus globitos */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2 mb-3">
          <div className="flex items-end gap-1">
            <span className="relative w-16 h-24 sm:w-20 sm:h-28 shrink-0">
              <Image src="/theme/profe/saluda.png" alt="El profe" fill sizes="80px" className="object-contain object-bottom" />
            </span>
            <p className="mb-10 min-w-[7.5rem] sm:min-w-[8.5rem] rounded-2xl rounded-bl-sm border-2 border-sky-400 bg-sky-50 px-2 py-1 text-[11px] sm:text-sm font-bold text-sky-900 leading-tight">
              En la <b>fila</b> está el primer número.
            </p>
          </div>
          <div className="text-center">
            <h1 className="text-3xl sm:text-[2.3rem] font-black text-indigo-900 tracking-tight whitespace-nowrap">Tabla Pitagórica</h1>
            <p className="mt-1 inline-block rounded-full bg-amber-100 border-2 border-amber-300 px-3 py-0.5 text-xs sm:text-sm font-bold text-indigo-800 whitespace-nowrap">
              Multiplicamos y también podemos dividir
            </p>
          </div>
          <div className="flex items-end gap-1 justify-end">
            <p className="mb-10 min-w-[7.5rem] sm:min-w-[8.5rem] rounded-2xl rounded-br-sm border-2 border-pink-400 bg-pink-50 px-2 py-1 text-[11px] sm:text-sm font-bold text-pink-900 leading-tight text-right">
              En la <b>columna</b> está el segundo número.
            </p>
            <span className="relative w-16 h-24 sm:w-20 sm:h-28 shrink-0">
              <Image src="/theme/profe/explica.png" alt="" fill sizes="80px" className="object-contain object-bottom" />
            </span>
          </div>
        </div>

        {/* La tabla */}
        <div
          className="grid gap-[3px] p-[3px] rounded-xl"
          style={{ gridTemplateColumns: `repeat(${TABLA_MAX + 2}, minmax(0, 1fr))`, background: "#3f3a8c" }}
        >
          <div className="flex items-center justify-center rounded-md text-white font-black text-lg sm:text-3xl aspect-[1.25]" style={{ background: COLOR_FILA.esquina }}>
            ×
          </div>
          {nums.map((c) => (
            <div key={`h${c}`} className="flex items-center justify-center rounded-md font-black text-lg sm:text-3xl text-slate-900" style={{ background: COLOR_COLUMNA[c].encabezado }}>
              {c}
            </div>
          ))}
          {nums.map((f) => [
            <div key={`f${f}`} className="flex items-center justify-center rounded-md font-black text-lg sm:text-3xl text-slate-900 aspect-[1.25]" style={{ background: COLOR_FILA.encabezado }}>
              {f}
            </div>,
            ...nums.map((c) => (
              <div key={`${f}-${c}`} className="flex items-center justify-center rounded-md text-sm sm:text-2xl font-semibold text-slate-900" style={{ background: COLOR_COLUMNA[c].celda }}>
                {f * c}
              </div>
            )),
          ])}
        </div>

        {/* Cómo se usa */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          <div className="rounded-2xl border-2 border-violet-300 bg-violet-50 p-3">
            <p className="font-black text-violet-800 text-base sm:text-lg">Para multiplicar:</p>
            <p className="text-sm text-slate-700">Busco el número de la fila, cruzo con el número de la columna y encuentro el resultado.</p>
            <p className="mt-1 text-sm font-bold text-indigo-800">
              Ejemplo: 3 × 4 → fila 3, columna 4 → <span className="rounded bg-violet-200 px-1.5">12</span>
            </p>
          </div>
          <div className="rounded-2xl border-2 border-green-300 bg-green-50 p-3">
            <p className="font-black text-green-800 text-base sm:text-lg">Para dividir:</p>
            <p className="text-sm text-slate-700">Busco el resultado en la tabla y encuentro qué números lo forman.</p>
            <p className="mt-1 text-sm font-bold text-indigo-800">
              Ejemplo: 24 ÷ 6 → busco el 24 en la fila 6 → está en la columna 4 → <span className="rounded bg-green-200 px-1.5">4</span>
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3 text-center">
          <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-2">
            <p className="text-sm font-bold">💡 Todo número multiplicado por 0 da 0.</p>
            <p className="text-sm">5 × 0 = 0 · 0 × 8 = 0</p>
          </div>
          <div className="rounded-2xl border-2 border-pink-300 bg-pink-50 p-2">
            <p className="text-sm font-bold">Todo número multiplicado por 1 da el mismo número.</p>
            <p className="text-sm">7 × 1 = 7 · 1 × 9 = 9</p>
          </div>
          <div className="rounded-2xl border-2 border-red-400 bg-red-50 p-2 flex items-center justify-center">
            <p className="text-sm font-black text-red-700">❗ No se puede dividir por 0.</p>
          </div>
        </div>
        <p className="mt-3 text-center text-lg sm:text-2xl font-black text-indigo-800">
          ¡La misma tabla nos ayuda a multiplicar y a dividir!
        </p>
        <p className="text-center text-[10px] text-slate-500 mt-1">MundoTest26 · Escuela Hogar Primaria Provincial N.º 2 «Héroes de Malvinas»</p>
      </section>
    </main>
  );
}
