import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { FICHAS_COOKIE, studentForFichas } from "@/lib/fichasAccess";

// Descarga de una ficha en PDF. Los archivos ya no están en /public: solo
// se entregan a quien entró con un código de alumno válido.
export async function GET(_request: NextRequest, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  if (!/^mundo-\d{1,5}-\d{1,2}\.pdf$/.test(file)) {
    return new Response("No encontrado.", { status: 404 });
  }
  const jar = await cookies();
  const student = await studentForFichas(jar.get(FICHAS_COOKIE)?.value);
  if (!student) {
    return new Response("Para descargar las fichas hay que ingresar con el código de alumno.", {
      status: 403,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
  try {
    const data = await readFile(path.join(process.cwd(), "private", "fichas", file));
    return new Response(new Uint8Array(data), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${file}"`,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch {
    return new Response("No encontrado.", { status: 404 });
  }
}
