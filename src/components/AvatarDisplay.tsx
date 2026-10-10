import Image from "next/image";
import {
  AVATAR_FIT_LIKE,
  AvatarAccessories,
  AvatarCapa,
  AvatarTweak,
  AvatarTweaks,
  getAccessoryById,
  getAccessorySrc,
  getAvatarSrc,
  getBackgroundById,
} from "@/types";
import { resolveBackgroundId } from "@/lib/seasons";
import { ACCESSORIES_WITH_BACK, AVATAR_FIT } from "@/lib/avatarFit";
import { capasDe, isPet, isProp } from "@/lib/avatarCapas";

// Recuadro interno (en % del avatar) donde se dibuja el personaje. Deja
// aire arriba para que gorros, coronas y orejas no queden cortados.
const STAGE = { left: 7, top: 14, size: 86 };

interface Props {
  character?: string;
  accessories?: AvatarAccessories;
  capas?: AvatarCapa[];
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
  capas,
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

  // Resolver capas ordenadas (usa capas si se envían; si no, migra de accessories + tweaks)
  const allCapas = capas ?? capasDe({ avatarAccessories: accessories, avatarTweaks: tweaks });

  // Separar mascotas (hasta 3), objeto de mano (prop) y accesorios que van sobre el personaje
  const petCapas = allCapas.filter((c) => isPet(c.id)).slice(0, 3);
  const propCapa = allCapas.find((c) => isProp(c.id));
  let characterCapas = allCapas.filter((c) => !isPet(c.id) && !isProp(c.id));

  if (birthday) {
    // La corona del cumpleaños reemplaza cualquier accesorio en la cabeza (A5)
    const sinCabeza = characterCapas.filter(
      (c) => getAccessoryById(c.id)?.slot !== "headwear" && c.id !== "corona-cumple"
    );
    characterCapas = [...sinCabeza, { id: "corona-cumple" }];
  }

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
        {characterCapas
          .filter((c) => ACCESSORIES_WITH_BACK.has(c.id) || ACCESSORIES_WITH_BACK.has(getAccessoryById(c.id)?.fitLike ?? ""))
          .map((c) => (
            <AccessoryLayer
              key={`${c.id}-back`}
              id={c.id}
              character={characterId}
              back
              imageSizes={imageSizes}
              tweak={{ x: c.x ?? 0, y: c.y ?? 0, s: c.s ?? 1 }}
            />
          ))}
        <Image src={avatarSrc} alt={alt} fill sizes={imageSizes} className="object-contain" />
        {characterCapas.map((c) => (
          <AccessoryLayer
            key={c.id}
            id={c.id}
            character={characterId}
            back={false}
            imageSizes={imageSizes}
            tweak={{ x: c.x ?? 0, y: c.y ?? 0, s: c.s ?? 1 }}
          />
        ))}
      </span>

      {/* Mascotas (hasta 3, una al lado de la otra abajo del personaje; la 3.ª no tapa el objeto de mano) */}
      {petCapas.map((c, idx) => {
        const total = petCapas.length;
        const sizePct = total === 1 ? 38 : total === 2 ? 28 : 22;
        let baseLeft = 1;
        if (total === 2) {
          baseLeft = idx === 0 ? 1 : 27;
        } else if (total === 3) {
          baseLeft = idx === 0 ? 1 : idx === 1 ? 19 : 37;
        }
        const leftVal = baseLeft + (c.x ?? 0);
        const bottomVal = 1 - (c.y ?? 0);
        return (
          <span
            key={c.id}
            className="absolute pointer-events-none"
            style={{
              width: `${sizePct}%`,
              height: `${sizePct}%`,
              left: `${leftVal}%`,
              bottom: `${bottomVal}%`,
              transform: c.s ? `scale(${c.s})` : undefined,
              transformOrigin: "50% 100%",
            }}
          >
            <Image
              src={getAccessorySrc(c.id)}
              alt=""
              fill
              sizes={imageSizes}
              className="object-contain object-bottom drop-shadow-[0_2px_2px_rgba(0,0,0,0.35)]"
            />
          </span>
        );
      })}

      {/* Objeto de mano (prop) en la esquina inferior derecha */}
      {propCapa && (
        <span
          key={propCapa.id}
          className="absolute w-[38%] h-[38%] pointer-events-none z-10"
          style={{
            right: `${1 - (propCapa.x ?? 0)}%`,
            bottom: `${1 - (propCapa.y ?? 0)}%`,
            transform: propCapa.s ? `scale(${propCapa.s})` : undefined,
            transformOrigin: "50% 100%",
          }}
        >
          <Image
            src={getAccessorySrc(propCapa.id)}
            alt=""
            fill
            sizes={imageSizes}
            className="object-contain object-bottom drop-shadow-[0_2px_2px_rgba(0,0,0,0.35)]"
          />
        </span>
      )}

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
