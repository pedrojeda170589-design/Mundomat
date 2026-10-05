import Link from "next/link";
import { VERSION_CONDICIONES } from "@/lib/legal/condiciones";

// Página de texto legal (Términos / Privacidad) del aula abierta.
export default function PaginaLegal({
  titulo,
  secciones,
}: {
  titulo: string;
  secciones: { titulo: string; texto: string }[];
}) {
  return (
    <main className="min-h-screen bg-amber-50 text-slate-900 px-4 py-8">
      <article className="max-w-2xl mx-auto bg-white rounded-2xl shadow p-5 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-black text-indigo-900">{titulo}</h1>
        <p className="text-xs text-slate-500 mt-1">MundoTest26 · Versión {VERSION_CONDICIONES}</p>
        {secciones.map((s) => (
          <section key={s.titulo} className="mt-5">
            <h2 className="text-lg font-black text-slate-800">{s.titulo}</h2>
            <p className="mt-1 leading-relaxed">{s.texto}</p>
          </section>
        ))}
        <div className="mt-8 flex flex-wrap gap-4 text-sm">
          <Link href="/terminos" className="underline text-indigo-700">Términos</Link>
          <Link href="/privacidad" className="underline text-indigo-700">Política de privacidad</Link>
          <Link href="/prueba" className="underline text-indigo-700">← Volver a la inscripción</Link>
        </div>
      </article>
    </main>
  );
}
