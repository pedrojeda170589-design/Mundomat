import Image from "next/image";
import { WorldSubject } from "@/types";

// Insignias ilustradas por materia (recortadas de la lámina del proyecto),
// usadas en las pestañas de materia y en el Panel Docente. Si la imagen no
// carga por algún motivo, se ve igual el emoji de respaldo.
const BADGE_SRC: Record<WorldSubject, string> = {
  matematica: "/theme/badge-matematica.png",
  lengua: "/theme/badge-lengua.png",
  naturales: "/theme/badge-naturales.png",
  sociales: "/theme/badge-sociales.png",
};

export default function SubjectBadge({
  subject,
  size = 28,
  className = "",
}: {
  subject: WorldSubject;
  size?: number;
  className?: string;
}) {
  return (
    <Image
      src={BADGE_SRC[subject]}
      alt=""
      width={size}
      height={size}
      className={`inline-block rounded-lg shrink-0 ${className}`}
      style={{ width: size, height: size }}
      unoptimized
    />
  );
}
