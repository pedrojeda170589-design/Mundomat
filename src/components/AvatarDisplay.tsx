import Image from "next/image";
import {
  AccessorySlot,
  AvatarAccessories,
  getAccessorySrc,
  getAvatarSrc,
} from "@/types";

// Posición de cada casillero de accesorio, como porcentaje del contenedor
// cuadrado del avatar. Están pensadas para retratos tipo "cara y hombros"
// centrados y mirando de frente (el mismo encuadre que se usó para generar
// todos los personajes en public/theme/avatars/), así que un mismo ancla
// sirve razonablemente bien para los 6 personajes sin tener que ajustar
// cada accesorio por personaje.
const SLOT_STYLE: Record<AccessorySlot, string> = {
  headwear: "top-[-8%] left-[22%] w-[56%]",
  eyewear: "top-[28%] left-[27%] w-[46%]",
  face: "top-[44%] left-[26%] w-[48%]",
  torso: "top-[66%] left-[2%] w-[96%]",
};

const SLOT_ORDER: AccessorySlot[] = ["torso", "headwear", "face", "eyewear"];

interface Props {
  character?: string;
  accessories?: AvatarAccessories;
  className?: string;
  alt?: string;
  imageSizes?: string;
}

// Compone el avatar del alumno: el retrato del personaje base como fondo, y
// arriba, en orden fijo, los accesorios que tenga equipados. El contenedor
// que se le pase por className debe definir tamaño y position relative (o
// dejar que este componente lo haga con w-full h-full si ya está dentro de
// uno) ya que las imágenes internas usan `fill`.
export default function AvatarDisplay({
  character,
  accessories,
  className = "",
  alt = "Avatar",
  imageSizes = "200px",
}: Props) {
  return (
    <span className={`relative block overflow-hidden ${className}`}>
      <Image
        src={getAvatarSrc(character)}
        alt={alt}
        fill
        sizes={imageSizes}
        className="object-cover"
      />
      {SLOT_ORDER.map((slot) => {
        const accessoryId = accessories?.[slot];
        if (!accessoryId) return null;
        return (
          <span
            key={slot}
            className={`absolute pointer-events-none aspect-square ${SLOT_STYLE[slot]}`}
          >
            <Image
              src={getAccessorySrc(accessoryId)}
              alt=""
              fill
              sizes={imageSizes}
              className="object-contain drop-shadow-md"
            />
          </span>
        );
      })}
    </span>
  );
}
