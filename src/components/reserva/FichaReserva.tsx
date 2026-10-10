"use client";

import { ESPECIES, OBJETOS, EMBLEMAS, MEDALLA_SANTA_CRUZ, NOMBRE_CATEGORIA, enPeligro, type Categoria } from "@/lib/reserva/fichas";
import { emojiPremio, rutaPremio } from "@/lib/reserva/arte";
import ImgReserva from "./ImgReserva";

// Sello de «En peligro» (pedido de Pedro): rojo para CR y EN; naranja para VU.
export function SelloConservacion({ c, chico = false }: { c: Categoria; chico?: boolean }) {
  if (enPeligro(c)) {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full bg-red-600 text-white font-black border-2 border-white shadow ${chico ? "text-[9px] px-1.5 py-0" : "text-[11px] px-2 py-0.5"}`}
        title={NOMBRE_CATEGORIA[c]}
      >
        ⚠️ {c === "CR" ? "En peligro crítico" : "En peligro"}
      </span>
    );
  }
  if (c === "VU") {
    return (
      <span className={`inline-flex items-center gap-1 rounded-full bg-orange-500 text-white font-black ${chico ? "text-[9px] px-1.5 py-0" : "text-[11px] px-2 py-0.5"}`}>
        Vulnerable
      </span>
    );
  }
  return null;
}

function Fila({ t, v }: { t: string; v: string }) {
  return (
    <p className="text-[13px] leading-snug text-amber-950">
      <span className="font-black">{t}: </span>
      {v}
    </p>
  );
}

// Contenido de la ficha (animal, planta, objeto o símbolo).
export function ContenidoFicha({ id, resumida = false }: { id: string; resumida?: boolean }) {
  const e = ESPECIES.find((x) => x.id === id);
  const o = [...OBJETOS, MEDALLA_SANTA_CRUZ].find((x) => x.id === id);
  const m = EMBLEMAS.find((x) => x.id === id);
  const nombre = e?.nombre ?? o?.nombre ?? m?.nombre ?? id;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <span className="relative w-24 h-24 shrink-0 rounded-2xl bg-gradient-to-b from-sky-100 to-emerald-100 border-2 border-amber-300 overflow-hidden">
          <ImgReserva src={rutaPremio(id)} emoji={emojiPremio(id)} alt={nombre} />
        </span>
        <div className="min-w-0">
          <p className="font-black text-lg text-amber-950 leading-tight">{nombre}</p>
          {e && <p className="text-[11px] italic text-amber-900/70">{e.cientifico}</p>}
          {e && (
            <div className="mt-1 flex flex-wrap items-center gap-1">
              <SelloConservacion c={e.categoria} />
              <span className="text-[10px] font-bold text-amber-900/70">{e.tipo === "animal" ? "Animal" : "Planta"}</span>
            </div>
          )}
          {o && <p className="text-[11px] font-bold text-amber-900/70">{o.id === MEDALLA_SANTA_CRUZ.id ? "Medalla" : "Objeto tradicional"}</p>}
          {m && <p className="text-[11px] font-bold text-amber-900/70">{m.tipo === "bandera" ? "Bandera" : "Escudo"}</p>}
        </div>
      </div>
      {e && (
        <>
          {e.tipo === "animal" && <Fila t="Qué come" v={e.alimentacion} />}
          <Fila t="Dónde vive" v={e.habitat} />
          <Fila t={e.tipo === "animal" ? "Cómo vive" : "Cómo es"} v={e.comportamiento} />
          <Fila t="Cuántos hay" v={e.poblacion} />
          <Fila t="Su cuidado" v={`${NOMBRE_CATEGORIA[e.categoria]}. ${e.conservacion}`} />
          <Fila t="Dato curioso" v={e.curioso} />
          {!resumida && <Fila t="Dónde verlo" v={e.dondeVerlo} />}
          {!resumida && <p className="text-[10px] text-amber-900/60">Fuente: {e.fuente}</p>}
        </>
      )}
      {o && <p className="text-[13px] leading-snug text-amber-950">{o.texto}</p>}
      {m && <p className="text-[13px] leading-snug text-amber-950">{m.texto}</p>}
      {m && <p className="text-[10px] text-amber-900/60">{m.fuente ? `Imagen: ${m.fuente}` : "Pronto vas a ver el escudo oficial del municipio."}</p>}
    </div>
  );
}

export default function FichaReserva({ id, onCerrar }: { id: string; onCerrar: () => void }) {
  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/55 p-3" role="dialog" aria-modal="true" onClick={onCerrar}>
      <div className="w-full max-w-sm max-h-[90vh] overflow-y-auto rounded-3xl border-4 border-amber-300 bg-amber-50 p-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <ContenidoFicha id={id} />
        <button onClick={onCerrar} className="mt-4 w-full min-h-11 rounded-2xl bg-amber-500 font-black text-slate-950">
          Cerrar
        </button>
      </div>
    </div>
  );
}
