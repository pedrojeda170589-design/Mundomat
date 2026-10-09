"use client";

import Image from "next/image";
import { ActivitySpec } from "@/lib/activities";
import { WorldDef } from "@/types";
import ApoyoVisual from "./Apoyos";

// Ilustraciones que acompañan a cada actividad para que sea más amena y,
// cuando se puede, ayuden a resolverla: grupos de fichas para sumar y
// restar, filas de puntos para multiplicar, platos para repartir, pizzas
// para fracciones, bloques de base 10 para leer números y dibujos de
// animales/objetos cuando se nombran en la consigna.

function textOf(a: ActivitySpec): string {
  switch (a.type) {
    case "true-false":
      return a.statement;
    case "find-error":
      return `${a.prompt} ${a.resolution}`;
    case "full-table-review":
    case "timed":
      return "";
    default:
      return a.prompt;
  }
}

const KEYWORD_ICONS: [RegExp, string, string][] = [
  [/guanaco/i, "guanaco", "Guanaco"],
  [/choique|ñandú/i, "choique", "Choique"],
  [/c[oó]ndor/i, "condor", "Cóndor"],
  [/ping[uü]ino/i, "pinguino", "Pingüino"],
  [/zorro/i, "zorro", "Zorro"],
  [/ballena/i, "ballena", "Ballena"],
  [/huemul/i, "huemul", "Huemul"],
  [/puma/i, "puma", "Puma"],
  [/lenga/i, "lenga", "Lenga"],
  [/calafate/i, "calafate", "Calafate"],
  [/mochila/i, "mochila", "Mochila"],
  [/l[aá]pi(z|ces)/i, "lapiz", "Lápiz"],
  [/libro|cuento/i, "libro", "Libro"],
  [/\breloj|\bhoras?\b|\bminutos?\b/i, "reloj", "Reloj"],
  [/mate\b/i, "mate", "Mate"],
  [/pelota/i, "pelota", "Pelota"],
];

// Dibujos (emoji) para ilustrar el tema de la consigna en las actividades
// de texto de 2.º y 3.º (pedido de Pedro, 8/10/2026: «una imagen
// ilustrativa del tema»). Se muestran como mucho tres, grandes.
const EMOJI_TEMA: [RegExp, string][] = [
  [/\bagua\b|\bríos?\b|\blagos?\b/i, "💧"], [/\blluvia|llueve/i, "🌧️"], [/\bnieve|nevad/i, "❄️"], [/\bviento/i, "🌬️"],
  [/\bsol\b/i, "☀️"], [/\bluna\b/i, "🌙"], [/estrella/i, "⭐"], [/\bnube/i, "☁️"], [/planeta|tierra gira|la tierra\b/i, "🌍"],
  [/\bplantas?\b|semilla|germin/i, "🌱"], [/\bárbol|\bárboles/i, "🌳"], [/\bflor(es)?\b/i, "🌸"], [/\bhojas?\b/i, "🍃"], [/hongo/i, "🍄"],
  [/\boveja|\blana\b|esquila/i, "🐑"], [/\bvaca|\bleche\b/i, "🐄"], [/\bcaballo/i, "🐎"], [/\bperro/i, "🐕"], [/\bgato\b|\bgatos\b/i, "🐈"],
  [/\bpájaro|\baves?\b/i, "🐦"], [/\bpez\b|\bpeces\b|pesca/i, "🐟"], [/\binsecto|\bhormiga/i, "🐜"], [/\bmariposa/i, "🦋"], [/\babeja|\bmiel\b/i, "🐝"],
  [/\bhuevo/i, "🥚"], [/\bpan\b|panader/i, "🍞"], [/\bfruta|\bmanzana/i, "🍎"], [/\bverdura|\bhuerta/i, "🥕"], [/\bcomida|aliment/i, "🍽️"],
  [/\bdientes?\b|cepill/i, "🦷"], [/\bcorazón/i, "❤️"], [/\bhuesos?\b|esqueleto/i, "🦴"], [/\bmúsculo/i, "💪"], [/\bojos?\b|\bvista\b/i, "👀"], [/\boído|\boreja/i, "👂"],
  [/\bimán|magnet/i, "🧲"], [/\bluz\b|linterna|lámpara/i, "💡"], [/\bsonido|\bmúsica|instrumento/i, "🎵"], [/\bsombra/i, "🌗"], [/\bhielo\b/i, "🧊"], [/\bfuego\b|calor/i, "🔥"],
  [/\bmadera\b/i, "🪵"], [/\bmetal\b|hierro/i, "⚙️"], [/\bvidrio|botella/i, "🍾"], [/\bplástico/i, "🧴"], [/\bpiedra|\broca\b/i, "🪨"],
  [/colectivo|ómnibus|\bmicro\b/i, "🚌"], [/\btren\b|ferrocarril/i, "🚂"], [/\bbarco|\bpuerto\b|\bnavega/i, "⛵"], [/\bavión|aeropuerto/i, "✈️"], [/\bauto\b|\bautos\b|camión/i, "🚗"], [/\bbicicleta/i, "🚲"],
  [/\bescuela\b|\baula\b/i, "🏫"], [/\bhospital|\bmédic/i, "🏥"], [/\bcasa\b|\bcasas\b|vivienda/i, "🏠"], [/\bplaza\b/i, "🛝"], [/\bciudad/i, "🏙️"], [/\bcampo\b|\bestancia|rural/i, "🌾"],
  [/montaña|cordillera|\bcerro/i, "🏔️"], [/\bmar\b|\bcosta\b|\bplaya/i, "🌊"], [/\bglaciar/i, "🧊"], [/\bmeseta|estepa/i, "🏜️"], [/\bbosque/i, "🌲"], [/\bvolcán/i, "🌋"],
  [/\bbandera/i, "🇦🇷"], [/\bmapa\b|\bplano\b/i, "🗺️"], [/\bcalendario|\bmes(es)?\b|\bsemana/i, "📅"], [/\bcarta\b|\bcorreo|\bsobre\b/i, "✉️"], [/\bdiario|noticia/i, "📰"],
  [/\bcuento|\blibro|leyenda|fábula/i, "📖"], [/\bpoesía|\bpoema|\bverso/i, "🪶"], [/\bteatro\b/i, "🎭"], [/\breceta|cocina/i, "🍳"], [/\btrabaj/i, "🧑‍🔧"],
  [/herbívor/i, "🥬"], [/carnívor/i, "🥩"], [/\banimal(es)?\b|seres vivos|ser vivo/i, "🐾"], [/urban|\bciudad/i, "🏙️"], [/\bclima\b|temperatura/i, "🌤️"],
  [/lavar|jabón|higiene/i, "🧼"], [/paisaje/i, "🏞️"], [/transporte/i, "🚌"], [/cerebro/i, "🧠"], [/pulmon|respira/i, "🫁"], [/\bsalud\b|vacuna/i, "🩺"],
  [/familia/i, "👨‍👩‍👧"], [/\bjuego|\bjugar/i, "🧸"], [/\bnormas?\b|\breglas?\b/i, "📋"], [/\bvoto|\belecci/i, "🗳️"], [/historia|antiguo/i, "⏳"],
  [/\bbasura|recicl/i, "♻️"], [/\bplata\b|\bdinero|\bprecio|\bmonedas?\b|\bbillete/i, "💰"], [/\bmedir|\bregla\b|\bmetros?\b|centímetro/i, "📏"], [/\bpesa\b|\bpesar\b|\bkilos?\b|balanza/i, "⚖️"], [/\blitros?\b|capacidad/i, "🥛"],
];

function emojisDelTema(text: string): string[] {
  const out: string[] = [];
  for (const [re, e] of EMOJI_TEMA) {
    if (re.test(text) && !out.includes(e)) out.push(e);
    if (out.length >= 3) break;
  }
  return out;
}

const COLORS = ["#3b82f6", "#f97316", "#10b981", "#ec4899", "#8b5cf6", "#eab308"];

function Dots({ count, color, crossed = 0, size = 16 }: { count: number; color: string; crossed?: number; size?: number }) {
  return (
    <span className="inline-flex flex-wrap gap-1 max-w-[11rem] justify-center">
      {Array.from({ length: count }, (_, i) => {
        const x = i >= count - crossed;
        return (
          <svg key={i} width={size} height={size} viewBox="0 0 20 20" aria-hidden>
            <circle cx="10" cy="10" r="8" fill={color} opacity={x ? 0.35 : 1} stroke="#1f2937" strokeWidth="1" />
            {x && <path d="M4 4 L16 16 M16 4 L4 16" stroke="#dc2626" strokeWidth="2.5" />}
          </svg>
        );
      })}
    </span>
  );
}

function Pizza({ parts, shaded }: { parts: number; shaded: number }) {
  const r = 40;
  const slices = Array.from({ length: parts }, (_, i) => {
    const a0 = (i / parts) * Math.PI * 2 - Math.PI / 2;
    const a1 = ((i + 1) / parts) * Math.PI * 2 - Math.PI / 2;
    const p = `M50 50 L${50 + r * Math.cos(a0)} ${50 + r * Math.sin(a0)} A${r} ${r} 0 0 1 ${50 + r * Math.cos(a1)} ${50 + r * Math.sin(a1)} Z`;
    return <path key={i} d={p} fill={i < shaded ? "#f59e0b" : "#fde68a"} stroke="#92400e" strokeWidth="2" />;
  });
  return (
    <svg width="96" height="96" viewBox="0 0 100 100" aria-hidden>
      {slices}
      {Array.from({ length: 7 }, (_, i) => (
        <circle key={i} cx={50 + 22 * Math.cos(i)} cy={50 + 22 * Math.sin(i * 1.7)} r="3.5" fill="#dc2626" opacity={0.8} />
      ))}
    </svg>
  );
}

function BaseTen({ n }: { n: number }) {
  const h = Math.floor(n / 100);
  const t = Math.floor((n % 100) / 10);
  const u = n % 10;
  const Block = ({ w, hgt, fill }: { w: number; hgt: number; fill: string }) => (
    <span className="inline-block rounded-sm border border-slate-700" style={{ width: w, height: hgt, background: fill }} />
  );
  return (
    <span className="flex items-end gap-3 flex-wrap justify-center">
      {h > 0 && (
        <span className="flex flex-col items-center gap-1">
          <span className="flex flex-wrap gap-1 max-w-[9rem] justify-center">
            {Array.from({ length: Math.min(h, 15) }, (_, i) => <Block key={i} w={22} hgt={22} fill="#60a5fa" />)}
          </span>
          <span className="text-[10px] font-bold text-slate-600">{h} centenas</span>
        </span>
      )}
      {t > 0 && (
        <span className="flex flex-col items-center gap-1">
          <span className="flex gap-0.5">
            {Array.from({ length: t }, (_, i) => <Block key={i} w={5} hgt={30} fill="#34d399" />)}
          </span>
          <span className="text-[10px] font-bold text-slate-600">{t} decenas</span>
        </span>
      )}
      {u > 0 && (
        <span className="flex flex-col items-center gap-1">
          <span className="flex flex-wrap gap-0.5 max-w-[3.5rem]">
            {Array.from({ length: u }, (_, i) => <Block key={i} w={7} hgt={7} fill="#fbbf24" />)}
          </span>
          <span className="text-[10px] font-bold text-slate-600">{u} unidades</span>
        </span>
      )}
    </span>
  );
}

function mathAid(text: string, world: WorldDef): React.ReactNode | null {
  const t = text.replace(/\./g, "");
  let m = t.match(/(\d+)\s*[×x]\s*(\d+)/);
  if (m) {
    const a = +m[1], b = +m[2];
    if (a * b <= 60 && a > 0 && b > 0) {
      return (
        <span className="flex flex-col items-center gap-1">
          {Array.from({ length: a }, (_, i) => (
            <Dots key={i} count={b} color={COLORS[i % COLORS.length]} size={13} />
          ))}
          <span className="text-[11px] font-bold text-slate-600">
            {a} filas de {b}
          </span>
        </span>
      );
    }
  }
  m = t.match(/(\d+)\s*\+\s*(\d+)/);
  if (m && +m[1] <= 20 && +m[2] <= 20) {
    return (
      <span className="flex items-center gap-2 flex-wrap justify-center">
        <Dots count={+m[1]} color={COLORS[0]} />
        <span className="text-xl font-black">+</span>
        <Dots count={+m[2]} color={COLORS[1]} />
      </span>
    );
  }
  m = t.match(/(\d+)\s*[-−]\s*(\d+)/);
  if (m && +m[1] <= 20 && +m[2] <= +m[1]) {
    return <Dots count={+m[1]} color={COLORS[2]} crossed={+m[2]} />;
  }
  m = t.match(/(\d+)\s*:\s*(\d+)/);
  if (!m && /repart/i.test(t)) {
    const between = t.match(/entre\s+(\d+)/i);
    const total = t.replace(/entre\s+\d+/i, "").match(/(\d+)/);
    if (between && total) m = [t, total[1], between[1]] as unknown as RegExpMatchArray;
  }
  if (m && +m[2] > 0 && +m[2] <= 8) {
    return (
      <span className="flex flex-col items-center gap-1">
        {+m[1] <= 30 && <Dots count={+m[1]} color={COLORS[3]} size={13} />}
        <span className="text-xs font-bold text-slate-600">{m[1]} para repartir en {m[2]} platos</span>
        <span className="flex gap-2">
          {Array.from({ length: +m[2] }, (_, i) => (
            <span key={i} className="w-9 h-9 rounded-full bg-white border-2 border-slate-400 shadow-inner" />
          ))}
        </span>
      </span>
    );
  }
  const nums = [...t.matchAll(/\b(\d+)\b/g)].map((x) => +x[1]);
  if (nums.length === 2 && nums.every((n) => n > 0 && n <= 20)) {
    const [a, b] = nums;
    if (/\bm[aá]s\b|junt|en total|agreg|sum/i.test(t)) {
      return (
        <span className="flex items-center gap-2 flex-wrap justify-center">
          <Dots count={a} color={COLORS[0]} />
          <span className="text-xl font-black">+</span>
          <Dots count={b} color={COLORS[1]} />
        </span>
      );
    }
    if (b <= a && /perdi|regal[oó]\b|comi[oó]|se llev|quedan|gast|menos|rest/i.test(t)) {
      return <Dots count={a} color={COLORS[2]} crossed={b} />;
    }
  }
  if (/cuarto|1\/4/i.test(t)) return <Pizza parts={4} shaded={1} />;
  if (/mitad|medio|1\/2/i.test(t)) return <Pizza parts={2} shaded={1} />;
  if (world.category === "numeros" || world.category === "numeros-grandes") {
    const n = t.match(/\b(\d{3,4})\b/);
    if (n && +n[1] <= 1500) return <BaseTen n={+n[1]} />;
  }
  return null;
}

export default function VisualAid({ activity, world }: { activity: ActivitySpec; world: WorldDef }) {
  // Apoyo explícito de la actividad (fila, cuadro, recta, bloques, reloj…).
  if (activity.apoyo) {
    return (
      <div className="w-full max-w-md rounded-2xl bg-white/90 border-2 border-sky-200 px-3 py-2 flex items-center justify-center shadow-sm">
        <ApoyoVisual apoyo={activity.apoyo} />
      </div>
    );
  }
  // En 1.º solo se usan los apoyos explícitos (sus actividades ya traen dibujos).
  if ((world.grade ?? 3) === 1) return null;
  const text = textOf(activity);
  const math = world.subject === "matematica" ? mathAid(text, world) : null;
  const icons = KEYWORD_ICONS.filter(([re]) => re.test(text)).slice(0, 3);
  // Si no hay apoyo de matemática ni dibujo propio, un dibujo del tema.
  const yaTieneDibujo = activity.type === "pick" && (!!activity.promptEmoji || activity.cards.some((c) => c.emoji || c.image));
  const tema = !math && icons.length === 0 && !yaTieneDibujo ? emojisDelTema(text) : [];
  if (!math && icons.length === 0 && tema.length === 0) return null;
  if (tema.length) {
    return (
      <div className="w-full max-w-md rounded-2xl bg-white/85 border-2 border-amber-200 px-3 py-1.5 flex items-center justify-center gap-5 shadow-sm" aria-hidden>
        {tema.map((e) => (
          <span key={e} className="text-5xl leading-none">{e}</span>
        ))}
      </div>
    );
  }
  return (
    <div className="w-full max-w-md rounded-2xl bg-white/85 border-2 border-amber-200 px-3 py-2 flex items-center justify-center gap-4 flex-wrap shadow-sm">
      {math}
      {icons.map(([, id, label]) => (
        <span key={id} className="relative w-16 h-16" title={label}>
          <Image src={`/theme/memo/${id}.png`} alt={label} fill sizes="64px" className="object-contain" />
        </span>
      ))}
    </div>
  );
}
