import { NextRequest } from "next/server";
import { checkAdminPassword } from "@/lib/auth";
import { getValidatedCurriculumWorldIds, validateCurriculumWorld } from "@/lib/data";
import { CurriculoId, getAllCurriculumEntries, getCurriculoActivo, setCurriculoActivo } from "@/lib/curriculo";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const curriculoParam = url.searchParams.get("curriculo") as CurriculoId | null;

  if (curriculoParam === "santa-cruz" || curriculoParam === "nap") {
    setCurriculoActivo(curriculoParam);
  }

  const activeCurriculo = getCurriculoActivo();
  const validatedWorldIds = await getValidatedCurriculumWorldIds();
  const entries = getAllCurriculumEntries(activeCurriculo, validatedWorldIds);

  return Response.json({
    curriculo: activeCurriculo,
    validatedWorldIds,
    entries,
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { adminPassword, worldId, validated, curriculo } = body as {
    adminPassword?: string;
    worldId?: number;
    validated?: boolean;
    curriculo?: CurriculoId;
  };

  if (!adminPassword || !checkAdminPassword(adminPassword)) {
    return Response.json({ error: "No autorizado." }, { status: 401 });
  }

  if (typeof worldId !== "number") {
    return Response.json({ error: "Falta el id de mundo." }, { status: 400 });
  }

  if (curriculo === "santa-cruz" || curriculo === "nap") {
    setCurriculoActivo(curriculo);
  }

  const validatedWorldIds = await validateCurriculumWorld(worldId, validated ?? true);
  return Response.json({ ok: true, validatedWorldIds });
}
