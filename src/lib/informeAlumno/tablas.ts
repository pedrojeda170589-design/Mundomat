// Clasificación de las tablas del alumno para el informe pedagógico en PDF.
// Utiliza los mismos datos de torneo y prioridades del alumno.

import type { StudentProgress } from "@/types";
import { TABLAS_DE_LA_VUELTA } from "@/lib/torneo/vueltas";
import { getMetaTabla } from "@/lib/torneo/tiempos";
import { medir } from "@/lib/torneo/prioridades";
import { getConsejoTabla } from "./consejosTablas";

export type GrupoTabla = "con-facilidad" | "en-camino" | "le-cuesta" | "sin-practicar";

export interface InfoTabla {
  tabla: number;
  grupo: GrupoTabla;
  texto: string;
  segundos?: number;
  errores?: number;
  partidas: number;
  metaOro: number;
  metaPlata: number;
  consejo?: string;
}

export interface TablasDelAlumnoResult {
  conFacilidad: InfoTabla[];
  enCamino: InfoTabla[];
  leCuesta: InfoTabla[];
  sinPracticar: InfoTabla[];
  todas: InfoTabla[];
  tieneDatos: boolean;
}

const uno = (n: number) => (Math.round(n * 10) / 10).toLocaleString("es-AR");

/**
 * Clasifica las tablas del 2 al 10 en cuatro grupos según el desempeño del alumno:
 * - con-facilidad: < 0,5 errores y tiempo <= meta oro (al menos 2 partidas).
 * - en-camino: < 0,5 errores y tiempo > oro y <= plata (o 1 partida perfecta con aclaración).
 * - le-cuesta: errores >= 0,5 o tiempo > meta plata.
 * - sin-practicar: sin registros de partidas.
 */
export function tablasDelAlumno(progress: StudentProgress | null | undefined): TablasDelAlumnoResult {
  const todas: InfoTabla[] = [];
  const conFacilidad: InfoTabla[] = [];
  const enCamino: InfoTabla[] = [];
  const leCuesta: InfoTabla[] = [];
  const sinPracticar: InfoTabla[] = [];

  let tieneDatos = false;

  for (const t of TABLAS_DE_LA_VUELTA) {
    const meta = getMetaTabla(t);
    const m = progress ? medir(progress, t) : null;

    if (!m) {
      const info: InfoTabla = {
        tabla: t,
        grupo: "sin-practicar",
        texto: `Tabla del ${t}: todavía no la jugó`,
        partidas: 0,
        metaOro: meta.oroSegundos,
        metaPlata: meta.plataSegundos,
      };
      todas.push(info);
      sinPracticar.push(info);
      continue;
    }

    tieneDatos = true;
    const extraTiempo = Math.max(0, (m.relTiempo ?? 1) - 1);
    const tardaMasQuePlata = (m.segundos ?? 0) > meta.plataSegundos;
    const porErrores = m.errores >= 0.5 && m.errores >= extraTiempo * 2;
    const esLeCuesta = m.errores >= 0.5 || tardaMasQuePlata;

    if (esLeCuesta) {
      const errTxt =
        m.errores === 1 ? "1 error por partida" : `${uno(m.errores)} errores por partida`;
      const texto =
        m.errores >= 0.5 && (porErrores || !tardaMasQuePlata)
          ? `Tabla del ${t}: ${errTxt}`
          : `Tabla del ${t}: tarda ${Math.round(m.segundos ?? 0)} s`;

      const info: InfoTabla = {
        tabla: t,
        grupo: "le-cuesta",
        texto,
        segundos: m.segundos,
        errores: m.errores,
        partidas: m.partidas,
        metaOro: meta.oroSegundos,
        metaPlata: meta.plataSegundos,
        consejo: getConsejoTabla(t),
      };
      todas.push(info);
      leCuesta.push(info);
    } else {
      const errTxt = m.errores < 0.1 ? "sin errores" : `con ${uno(m.errores)} errores`;
      const tiempoSegundos = Math.round(m.segundos ?? 0);

      if ((m.segundos ?? 0) <= meta.oroSegundos) {
        if (m.partidas < 2) {
          const info: InfoTabla = {
            tabla: t,
            grupo: "en-camino",
            texto: `Tabla del ${t}: ${errTxt} y en ${tiempoSegundos} s (pocas partidas)`,
            segundos: m.segundos,
            errores: m.errores,
            partidas: m.partidas,
            metaOro: meta.oroSegundos,
            metaPlata: meta.plataSegundos,
          };
          todas.push(info);
          enCamino.push(info);
        } else {
          const info: InfoTabla = {
            tabla: t,
            grupo: "con-facilidad",
            texto: `Tabla del ${t}: ${errTxt} y en ${tiempoSegundos} s (meta de oro: ${meta.oroSegundos} s)`,
            segundos: m.segundos,
            errores: m.errores,
            partidas: m.partidas,
            metaOro: meta.oroSegundos,
            metaPlata: meta.plataSegundos,
          };
          todas.push(info);
          conFacilidad.push(info);
        }
      } else {
        const info: InfoTabla = {
          tabla: t,
          grupo: "en-camino",
          texto: `Tabla del ${t}: ${errTxt}, pero tarda ${tiempoSegundos} s`,
          segundos: m.segundos,
          errores: m.errores,
          partidas: m.partidas,
          metaOro: meta.oroSegundos,
          metaPlata: meta.plataSegundos,
        };
        todas.push(info);
        enCamino.push(info);
      }
    }
  }

  return {
    conFacilidad,
    enCamino,
    leCuesta,
    sinPracticar,
    todas,
    tieneDatos,
  };
}
