"use client";

import Image from "next/image";
import { useState } from "react";

// Imagen con respaldo: si el dibujo todavía no está, muestra el emoji.
export default function ImgReserva({
  src,
  emoji,
  alt = "",
  sizes = "96px",
  cover = false,
  className = "",
}: {
  src: string;
  emoji: string;
  alt?: string;
  sizes?: string;
  cover?: boolean;
  className?: string;
}) {
  const [falla, setFalla] = useState(false);
  if (falla) {
    return (
      <span className={`absolute inset-0 flex items-center justify-center text-4xl ${className}`} role={alt ? "img" : undefined} aria-label={alt || undefined}>
        {emoji}
      </span>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      className={`${cover ? "object-cover" : "object-contain"} ${className}`}
      onError={() => setFalla(true)}
    />
  );
}
