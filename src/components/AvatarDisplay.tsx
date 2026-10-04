import Image from "next/image";
import {
  AVATAR_FIT_LIKE,
  AccessorySlot,
  AvatarAccessories,
  AvatarTweak,
  AvatarTweaks,
  getAccessoryById,
  getAccessorySrc,
  getAvatarSrc,
  getBackgroundById,
} from "@/types";
import { resolveBackgroundId } from "@/lib/seasons";
import { ACCESSORIES_WITH_BACK, AVATAR_FIT } from "@/lib/avatarFit";

// Recuadro interno (en % del avatar) donde se dibuja el personaje. Deja
// aire arriba para que gorros, coronas y orejas no queden cortados.
const STAGE = { left: 7, top: 14, size: 86 };

// Orden de dibujo de los casilleros (de atrás hacia adelante).
const SLOT_ORDER: AccessorySlot[] = [
  "torso",
  "backpack",
  "face",
  "pendant",
  "eyewear",
  "headwear",
];

interface Props {
  character?: string;
  accessories?: AvatarAccessories;
  className?: string;
  alt?: string;
  imageSizes?: string;
  // Fondo guardado del alumno (AUTO_BACKGROUND, un id de BACKGROUND_OPTIONS
  // o nada = automático). Se resuelve acá según la fecha.
  background?: string;
  // Día de cumpleaños: fondo y corona de cumple por encima de lo elegido, y
  // una tortita arriba del avatar.
  birthday?: boolean;
  // Ajustes del alumno (corrimiento y tamaño de cada objeto puesto).
  tweaks?: AvatarTweaks;
}

function AccessoryLayer({
  id,
  character,
  back,
  imageSizes,
  tweak,
}: {
  id: string;
  character: string;
  back: boolean;
  imageSizes: string;
  tweak?: AvatarTweak;
}) {
  // Los objetos nuevos pueden ubicarse "como" otro de la misma forma (fitLike).
  const like = getAccessoryById(id)?.fitLike;
  // Personajes nuevos (colecciones, logros): se ubican como uno de siempre con el mismo encuadre.
  const fits = AVATAR_FIT[character] ?? AVATAR_FIT[AVATAR_FIT_LIKE[character] ?? ""];
  const fit = fits?.[id] ?? (like ? fits?.[like] : undefined);
  if (!fit) return null;
  const [left, top, width, height, rot, ox, oy] = fit;
  // La parte de atrás (patillas, elástico) se toma del modelo si el objeto no tiene la suya.
  const src = back && like && !ACCESSORIES_WITH_BACK.has(id) ? getAccessorySrc(like) : getAccessorySrc(id);
  return (
    <span
      className="absolute pointer-events-none"
      style={{
        left: `${left + (tweak?.x ?? 0)}%`,
        top: `${top + (tweak?.y ?? 0)}%`,
        width: `${width}%`,
        height: `${height}%`,
        transform: rot || tweak?.s ? `${rot ? `rotate(${rot}deg) ` : ""}${tweak?.s ? `scale(${tweak.s})` : ""}` : undefined,
        transformOrigin: `${ox * 100}% ${oy * 100}%`,
      }}
    >
      <Image
        src={back ? src.replace(/\.png$/, ".back.png") : src}
        alt=""
        fill
        sizes={imageSizes}
        className={back ? "" : "drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]"}
      />
    </span>
  );
}

// Compone el avatar del alumno: fondo, partes traseras de los accesorios,
// el personaje (PNG transparente) y encima los accesorios, cada uno ubicado
// según la cara de ese personaje (ver src/lib/avatarFit.ts). El contenedor
// que se pase por className debe definir el tamaño.
export default function AvatarDisplay({
  character,
  accessories,
  className = "",
  alt = "Avatar",
  imageSizes = "200px",
  background,
  birthday = false,
  tweaks,
}: Props) {
  const avatarSrc = getAvatarSrc(character);
  const characterId = avatarSrc.split("/").pop()!.replace(/\.png$/, "");
  const bg = getBackgroundById(birthday ? "cumple" : resolveBackgroundId(background));

  const equipped: AvatarAccessories = { ...(accessories ?? {}) };
  if (birthday) equipped.headwear = "corona-cumple";
  // Ajuste del objeto según el casillero donde está puesto.
  const tweakDe = (id: string): AvatarTweak | undefined => {
    const slot = (Object.keys(equipped) as AccessorySlot[]).find((k) => equipped[k] === id);
    return slot ? tweaks?.[slot] : undefined;
  };
  const ids = SLOT_ORDER.map((slot) => equipped[slot]).filter(
    (id): id is string => !!id && !!getAccessoryById(id)
  );

  return (
    <span className={`relative block overflow-hidden ${className}`}>
      {bg && (
        <span aria-hidden className="absolute inset-0" style={{ background: bg.css }} />
      )}
      <span
        className="absolute"
        style={{
          left: `${STAGE.left}%`,
          top: `${STAGE.top}%`,
          width: `${STAGE.size}%`,
          height: `${STAGE.size}%`,
        }}
      >
        {ids
          .filter((id) => ACCESSORIES_WITH_BACK.has(id) || ACCESSORIES_WITH_BACK.has(getAccessoryById(id)?.fitLike ?? ""))
          .map((id) => (
            <AccessoryLayer key={`${id}-back`} id={id} character={characterId} back imageSizes={imageSizes} tweak={tweakDe(id)} />
          ))}
        <Image src={avatarSrc} alt={alt} fill sizes={imageSizes} className="object-contain" />
        {ids.map((id) => (
          <AccessoryLayer key={id} id={id} character={characterId} back={false} imageSizes={imageSizes} tweak={tweakDe(id)} />
        ))}
      </span>
      {/* Mascota (abajo a la izquierda) y objeto de mano (abajo a la derecha). */}
      {(["pet", "prop"] as const).map((slot) => {
        const id = equipped[slot];
        if (!id || !getAccessoryById(id)) return null;
        const t = tweaks?.[slot];
        return (
          <span
            key={slot}
            className="absolute w-[40%] h-[40%] pointer-events-none"
            style={{
              [slot === "pet" ? "left" : "right"]: `${1 + (slot === "pet" ? t?.x ?? 0 : -(t?.x ?? 0))}%`,
              bottom: `${1 - (t?.y ?? 0)}%`,
              transform: t?.s ? `scale(${t.s})` : undefined,
              transformOrigin: "50% 100%",
            }}
          >
            <Image src={getAccessorySrc(id)} alt="" fill sizes={imageSizes} className="object-contain object-bottom drop-shadow-[0_2px_2px_rgba(0,0,0,0.35)]" />
          </span>
        );
      })}
      {birthday && (
        <span
          className="absolute right-[3%] top-[3%] w-[30%] h-[30%] pointer-events-none animate-bounce"
          title="¡Feliz cumpleaños!"
        >
          <Image src="/theme/torta-cumple.png" alt="¡Feliz cumpleaños!" fill sizes="64px" className="object-contain drop-shadow" />
        </span>
      )}
    </span>
  );
}
