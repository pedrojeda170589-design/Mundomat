"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { getAccessoryById, getAccessorySrc, type StudentProgress } from "@/types";
import { IMAGENES_LISTAS } from "@/lib/coleccion/imagenes-listas";
import { METAS } from "@/lib/coleccion/metasDatos";
import { rutaPrenda } from "@/lib/vestidor/catalogo";
import PremioAparece from "@/components/weekend/PremioAparece";

const clave = (code: string) => `mm-metas-vistas-${code}`;

function leer(code: string): string[] | null {
  try {
    const v = localStorage.getItem(clave(code));
    return v ? (JSON.parse(v) as string[]) : null;
  } catch {
    return null;
  }
}
function guardar(code: string, ids: string[]) {
  try {
    localStorage.setItem(clave(code), JSON.stringify(ids));
  } catch {
    // sin almacenamiento: se vuelve a mostrar la próxima vez
  }
}

// Cuando se gana una meta especial, el premio aparece en grande (se acerca a
// la pantalla con luz dorada). Se recuerda en este navegador qué ya se mostró.
export default function MetaNueva({ code, progress }: { code: string; progress: StudentProgress }) {
  const [vistas, setVistas] = useState<string[] | null>(null);
  const ganadas = progress.metasReclamadas ?? [];
  useEffect(() => {
    // La primera vez en este navegador no se festejan las metas viejas.
    const v = leer(code);
    if (v === null) guardar(code, ganadas);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVistas(v ?? ganadas);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);
  if (!vistas) return null;
  const id = ganadas.find((x) => !vistas.includes(x));
  const meta = METAS.find((m) => m.id === id);
  if (!meta) return null;
  const p = meta.premio;
  let src: string | null = null;
  if (p.tipo === "avatar" && IMAGENES_LISTAS.has(p.id)) src = `/theme/avatars/${p.id}.png`;
  if (p.tipo === "objeto" && getAccessoryById(p.id)) src = getAccessorySrc(p.id);
  if (p.tipo === "prenda") src = rutaPrenda(p.id, true);
  const dondeVer = p.tipo === "prenda" ? "Ponétela en tu vestidor 👕." : "Ya lo podés elegir en «Mi perfil».";
  return (
    <PremioAparece
      titulo={`¡Meta cumplida! ${p.label}. ${dondeVer}`}
      onCerrar={() => {
        const nuevas = [...vistas, meta.id];
        guardar(code, nuevas);
        setVistas(nuevas);
      }}
    >
      {src ? (
        <span className="relative block w-36 h-36">
          <Image src={src} alt="" fill sizes="144px" className="object-contain" />
        </span>
      ) : (
        <span className="text-8xl leading-none">{p.emoji}</span>
      )}
    </PremioAparece>
  );
}
