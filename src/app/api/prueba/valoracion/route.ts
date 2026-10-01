import { NextRequest } from "next/server";
import { findStudentByCode } from "@/lib/data";
import { addOpenClassroomRating, hasStudentRated } from "@/lib/openClassroom";
import {
  OpenClassroomRating,
  RATING_LIKED_OPTIONS,
  canRateTrial,
} from "@/lib/openClassroomShared";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code) {
    return Response.json({ error: "Falta el código." }, { status: 400 });
  }

  const student = await findStudentByCode(code);
  if (!student) {
    return Response.json({ error: "Código no encontrado." }, { status: 404 });
  }

  if (student.type !== "prueba") {
    return Response.json({ canRate: false, hasRated: false });
  }

  const rated = await hasStudentRated(student.code);
  const eligible = canRateTrial(student);

  return Response.json({
    canRate: eligible && !rated,
    hasRated: rated,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, stars, liked, comment } = body as {
      code?: string;
      stars?: number;
      liked?: string[];
      comment?: string;
    };

    if (!code) {
      return Response.json({ error: "Falta el código." }, { status: 400 });
    }

    const student = await findStudentByCode(code);
    if (!student) {
      return Response.json({ error: "Código no encontrado." }, { status: 404 });
    }

    if (student.type !== "prueba") {
      return Response.json(
        { error: "Solo los alumnos del aula de prueba pueden valorar la experiencia." },
        { status: 403 }
      );
    }

    if (!canRateTrial(student)) {
      return Response.json(
        { error: "La valoración se habilita en los últimos días o al finalizar la prueba." },
        { status: 403 }
      );
    }

    const alreadyRated = await hasStudentRated(student.code);
    if (alreadyRated) {
      return Response.json(
        { error: "Ya enviaste tu valoración. ¡Muchas gracias!" },
        { status: 400 }
      );
    }

    const starCount = Math.round(Number(stars) || 0);
    if (starCount < 1 || starCount > 5) {
      return Response.json(
        { error: "Por favor elegí una calificación entre 1 y 5 estrellas." },
        { status: 400 }
      );
    }

    const validLiked = Array.isArray(liked)
      ? liked.filter((item): item is (typeof RATING_LIKED_OPTIONS)[number] =>
          (RATING_LIKED_OPTIONS as readonly string[]).includes(item)
        )
      : [];

    let cleanComment: string | undefined = undefined;
    if (typeof comment === "string") {
      const sanitized = comment.replace(/[\x00-\x1F\x7F]/g, "").trim();
      if (sanitized.length > 0) {
        cleanComment = sanitized.slice(0, 300);
      }
    }

    const rating: OpenClassroomRating = {
      code: student.code,
      at: new Date().toISOString(),
      stars: starCount,
      liked: validLiked,
      ...(cleanComment ? { comment: cleanComment } : {}),
    };

    await addOpenClassroomRating(rating);
    return Response.json({ ok: true });
  } catch {
    return Response.json(
      { error: "Ocurrió un error al guardar la valoración." },
      { status: 500 }
    );
  }
}
