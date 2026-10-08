// Lista de todo lo que se puede configurar en «Desafíos y eventos» del panel.
import { SEASONAL_EVENTS } from "@/lib/seasons";
import { TEMPORADAS } from "@/lib/coleccion/temporadas";
import { DROPS } from "@/lib/coleccion/drops";
import { DESAFIOS, idDrop, idEstacion, idTemporada } from "./config";

export type GrupoEvento = "desafio" | "festividad" | "estacion" | "temporada" | "drop";

export interface DefEvento {
  id: string;
  grupo: GrupoEvento;
  emoji: string;
  nombre: string;
  // Qué hace «automático» (la regla de siempre), en palabras para el docente.
  auto: string;
  // Grados de siempre; null = es para todos (tienda, festividades).
  grados: number[] | null;
  // Grados en los que puede existir (los botones que muestra el panel).
  gradosPosibles?: number[];
  nota?: string;
}

const D = (d: { id: string; grados: readonly number[] }) => ({ id: d.id, grados: [...d.grados] });

export const DESAFIOS_CATALOGO: DefEvento[] = [
  { ...D(DESAFIOS.finDeSemana), grupo: "desafio", emoji: "🧩", nombre: "Aventura de fin de semana (memorama y cofre)", auto: "Sábados y domingos.", nota: "El contenido está pensado para 3.º. En un día de semana se juega el plan del sábado." },
  { ...D(DESAFIOS.repasoTablas), grupo: "desafio", emoji: "⚡", nombre: "Repaso de las tablas (torneo, ranking y objeto del mes)", auto: "Todos los días, de julio a diciembre." },
  { ...D(DESAFIOS.repasoEnMundos), grupo: "desafio", gradosPosibles: [3, 4], emoji: "🔁", nombre: "Repaso de las tablas dentro de los mundos de Matemática", auto: "De julio en adelante (en 4.º, todo el año), a veces aparece una actividad de tablas en la vuelta." },
  { ...D(DESAFIOS.prestamo67), grupo: "desafio", emoji: "6️⃣", nombre: "Préstamo Six-Seven (para quien jugó el repaso y está al día)", auto: "Siempre que el repaso de las tablas esté habilitado." },
  { ...D(DESAFIOS.dictado), grupo: "desafio", gradosPosibles: [2, 3], emoji: "✍️", nombre: "Mundo del Dictado semanal", auto: "Semana por medio (semanas pares).", nota: "Existe en 2.º y 3.º." },
  { ...D(DESAFIOS.monteLeon), grupo: "desafio", emoji: "🐧", nombre: "Viaje a Monte León", auto: "Hasta el 27/10/2026 a las 23:59.", nota: "El cartel de buen viaje y la medalla siguen con su fecha (27 y 28/10)." },
  { ...D(DESAFIOS.competencia), grupo: "desafio", emoji: "⚔️", nombre: "Competencia (duelos entre compañeros)", auto: "Según la sección Competencia (fines de semana o todos los días).", nota: "Si la apagás en la sección Competencia, queda apagada." },
  { ...D(DESAFIOS.zonasPractica), grupo: "desafio", gradosPosibles: [1, 2], emoji: "🎯", nombre: "Zonas de práctica (refuerzo automático)", auto: "Aparecen solas cuando una habilidad necesita práctica.", nota: "Existen en 1.º y 2.º." },
];

export function catalogoEventos(): DefEvento[] {
  const fest: DefEvento[] = SEASONAL_EVENTS.map((e) => ({
    id: idEstacion(e.id),
    grupo: e.kind === "estacion" ? "estacion" : "festividad",
    emoji: e.emoji,
    nombre: e.label,
    auto: e.kind === "estacion" ? "Durante toda la estación." : "En su fecha de siempre.",
    grados: null,
    nota: "Fondo y premios del evento para todos; también abre los objetos de la tienda de esa festividad.",
  }));
  const temps: DefEvento[] = TEMPORADAS.map((t) => ({
    id: idTemporada(t.id),
    grupo: "temporada",
    emoji: t.emoji,
    nombre: `${t.coleccion} · ${t.label}`,
    auto: t.pausada ? "En pausa (no se vende). Elegí «siempre» o «entre fechas» para abrirla." : "Unos días alrededor de su fecha.",
    grados: null,
    nota: "Solo aparecen en la tienda los avatares y objetos que ya tienen dibujo.",
  }));
  const drops: DefEvento[] = DROPS.map((d) => ({
    id: idDrop(d.id),
    grupo: "drop",
    emoji: d.emoji,
    nombre: `Lanzamiento ${d.label}`,
    auto: `Desde el ${d.desde.split("-").reverse().join("/")} durante ${d.dias} días.`,
    grados: null,
  }));
  return [...DESAFIOS_CATALOGO, ...fest, ...temps, ...drops];
}

export function idsEventos(): Set<string> {
  return new Set(catalogoEventos().map((e) => e.id));
}
