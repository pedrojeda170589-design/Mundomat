"use client";

import type { Apoyo } from "@/lib/activities";

// Apoyos visuales de las actividades (fila y cuadro de números, recta
// numérica, bloques de base 10, reloj, dinero y grupos). Son dibujos simples
// y grandes, pensados para 1.º a 3.º: el chico «ve» el número antes de
// elegir la respuesta.

function rango(desde: number, hasta: number, paso = 1): number[] {
  const out: number[] = [];
  for (let n = desde; n <= hasta && out.length < 120; n += paso) out.push(n);
  return out;
}

function Casillero({ n, marcado, oculto, chico }: { n: number; marcado: boolean; oculto: boolean; chico?: boolean }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-md border-2 font-black tabular-nums ${chico ? "w-8 h-8 text-[13px]" : "w-10 h-10 text-base"} ${
        oculto
          ? "bg-amber-100 border-amber-500 text-amber-700 border-dashed"
          : marcado
            ? "bg-sky-500 border-sky-700 text-white shadow"
            : "bg-white border-slate-300 text-slate-800"
      }`}
      aria-label={oculto ? "número que falta" : String(n)}
    >
      {oculto ? "?" : n}
    </span>
  );
}

function Titulo({ texto }: { texto?: string }) {
  return texto ? <span className="text-[12px] font-bold text-slate-600">{texto}</span> : null;
}

function Fila({ a }: { a: Extract<Apoyo, { tipo: "fila" }> }) {
  const nums = rango(a.desde, a.hasta, a.paso ?? 1);
  const chico = nums.length > 8;
  return (
    <span className="flex flex-col items-center gap-1">
      <Titulo texto={a.titulo} />
      <span className="flex flex-wrap gap-1 justify-center max-w-[24rem]">
        {nums.map((n) => (
          <Casillero key={n} n={n} chico={chico} marcado={!!a.marcar?.includes(n)} oculto={!!a.ocultar?.includes(n)} />
        ))}
      </span>
    </span>
  );
}

function Cuadro({ a }: { a: Extract<Apoyo, { tipo: "cuadro" }> }) {
  const inicio = Math.floor(a.desde / 10) * 10;
  const filas: number[][] = [];
  for (let f = inicio; f <= a.hasta; f += 10) filas.push(rango(f, f + 9).filter((n) => n >= a.desde && n <= a.hasta));
  return (
    <span className="flex flex-col items-center gap-1">
      <Titulo texto={a.titulo} />
      <span className="grid gap-0.5" style={{ gridTemplateColumns: "repeat(10, minmax(0, 1fr))" }}>
        {filas.flatMap((fila) =>
          fila.map((n) => (
            <span key={n} style={{ gridColumn: (n % 10) + 1 }}>
              <Casillero n={n} chico marcado={!!a.marcar?.includes(n)} oculto={!!a.ocultar?.includes(n)} />
            </span>
          ))
        )}
      </span>
    </span>
  );
}

function Recta({ a }: { a: Extract<Apoyo, { tipo: "recta" }> }) {
  const paso = a.paso ?? 1;
  const marcas = rango(a.desde, a.hasta, paso);
  const etiq = a.etiquetasCada ?? (marcas.length > 21 ? paso * 5 : paso);
  const W = 340;
  const x0 = 14;
  const x1 = W - 14;
  const X = (n: number) => x0 + ((n - a.desde) / Math.max(1, a.hasta - a.desde)) * (x1 - x0);
  const y = 46;
  const s = a.salto;
  let arcos: React.ReactNode = null;
  if (s && s.cantidad !== 0) {
    const dir = Math.sign(s.cantidad);
    const porPaso = s.paso ?? 1;
    const n = Math.abs(s.cantidad) / porPaso;
    const pasos = Number.isInteger(n) && n <= 12 ? n : 1;
    const largo = s.cantidad / pasos;
    arcos = Array.from({ length: pasos }, (_, i) => {
      const xa = X(s.desde + i * largo);
      const xb = X(s.desde + (i + 1) * largo);
      const alto = Math.min(26, Math.abs(xb - xa) * 0.7 + 6);
      const color = dir > 0 ? "#f97316" : "#dc2626";
      // Punta de flecha dibujada a mano (cae sobre el número de llegada).
      const sx = dir > 0 ? -1 : 1;
      return (
        <g key={i}>
          <path d={`M${xa} ${y - 6} Q${(xa + xb) / 2} ${y - 6 - alto} ${xb} ${y - 7}`} fill="none" stroke={color} strokeWidth="2.5" />
          <path d={`M${xb} ${y - 5} L${xb + sx * 6} ${y - 13} L${xb + sx * 1} ${y - 14} Z`} fill={color} />
        </g>
      );
    });
  }
  return (
    <span className="flex flex-col items-center gap-1">
      <Titulo texto={a.titulo} />
      <svg width={W} height={72} viewBox={`0 0 ${W} 72`} role="img" aria-label={`Recta numérica del ${a.desde} al ${a.hasta}`}>
        <line x1={x0 - 6} y1={y} x2={x1 + 6} y2={y} stroke="#334155" strokeWidth="3" strokeLinecap="round" />
        {marcas.map((n) => {
          // Si hay un número marcado muy cerca, su etiqueta tapa a esta.
          const tapado = (a.marcar ?? []).some((m) => m !== n && !marcas.includes(m) && Math.abs(X(m) - X(n)) < 18);
          const conEtiqueta = ((n - a.desde) % etiq === 0 || n === a.hasta) && !tapado;
          const marcado = a.marcar?.includes(n);
          return (
            <g key={n}>
              <line x1={X(n)} y1={y - (conEtiqueta ? 7 : 4)} x2={X(n)} y2={y + (conEtiqueta ? 7 : 4)} stroke="#334155" strokeWidth={conEtiqueta ? 2 : 1.2} />
              {marcado && <circle cx={X(n)} cy={y} r="7" fill="#0ea5e9" stroke="#075985" strokeWidth="2" />}
              {(conEtiqueta || marcado) && (
                <text x={X(n)} y={y + 22} textAnchor="middle" fontSize={marcas.length > 21 ? 10 : 12} fontWeight={marcado ? 900 : 700} fill={marcado ? "#0369a1" : "#334155"}>
                  {n}
                </text>
              )}
            </g>
          );
        })}
        {(a.marcar ?? []).filter((n) => !marcas.includes(n)).map((n) => (
          <g key={`m${n}`}>
            <circle cx={X(n)} cy={y} r="7" fill="#0ea5e9" stroke="#075985" strokeWidth="2" />
            <text x={X(n)} y={y + 22} textAnchor="middle" fontSize="12" fontWeight={900} fill="#0369a1">{n}</text>
          </g>
        ))}
        {arcos}
      </svg>
    </span>
  );
}

function Bloques({ n }: { n: number }) {
  const c = Math.floor(n / 100);
  const d = Math.floor((n % 100) / 10);
  const u = n % 10;
  const Pieza = ({ w, h, fill }: { w: number; h: number; fill: string }) => (
    <span className="inline-block rounded-sm border border-slate-700" style={{ width: w, height: h, background: fill }} />
  );
  return (
    <span className="flex items-end gap-4 flex-wrap justify-center">
      {c > 0 && (
        <span className="flex flex-col items-center gap-1">
          <span className="flex flex-wrap gap-1 max-w-[9rem] justify-center">
            {Array.from({ length: Math.min(c, 15) }, (_, i) => <Pieza key={i} w={24} h={24} fill="#60a5fa" />)}
          </span>
          <span className="text-[12px] font-bold text-slate-600">{c} {c === 1 ? "cien" : "cienes"}</span>
        </span>
      )}
      {d > 0 && (
        <span className="flex flex-col items-center gap-1">
          <span className="flex gap-0.5">
            {Array.from({ length: d }, (_, i) => <Pieza key={i} w={6} h={32} fill="#34d399" />)}
          </span>
          <span className="text-[12px] font-bold text-slate-600">{d} {d === 1 ? "diez" : "dieces"}</span>
        </span>
      )}
      {u > 0 && (
        <span className="flex flex-col items-center gap-1">
          <span className="flex flex-wrap gap-0.5 max-w-[3.6rem]">
            {Array.from({ length: u }, (_, i) => <Pieza key={i} w={8} h={8} fill="#fbbf24" />)}
          </span>
          <span className="text-[12px] font-bold text-slate-600">{u} {u === 1 ? "uno" : "unos"}</span>
        </span>
      )}
    </span>
  );
}

function Reloj({ h, m }: { h: number; m: number }) {
  const ang = (deg: number) => ((deg - 90) * Math.PI) / 180;
  const hh = ((h % 12) + m / 60) * 30;
  const mm = m * 6;
  return (
    <svg width="110" height="110" viewBox="0 0 100 100" role="img" aria-label="Reloj">
      <circle cx="50" cy="50" r="45" fill="#fff" stroke="#334155" strokeWidth="4" />
      {Array.from({ length: 12 }, (_, i) => {
        const a = ang((i + 1) * 30);
        return (
          <text key={i} x={50 + 34 * Math.cos(a)} y={50 + 34 * Math.sin(a) + 4} textAnchor="middle" fontSize="10" fontWeight="800" fill="#334155">
            {i + 1}
          </text>
        );
      })}
      <line x1="50" y1="50" x2={50 + 22 * Math.cos(ang(hh))} y2={50 + 22 * Math.sin(ang(hh))} stroke="#0f172a" strokeWidth="5" strokeLinecap="round" />
      <line x1="50" y1="50" x2={50 + 33 * Math.cos(ang(mm))} y2={50 + 33 * Math.sin(ang(mm))} stroke="#0ea5e9" strokeWidth="3" strokeLinecap="round" />
      <circle cx="50" cy="50" r="3.5" fill="#0f172a" />
    </svg>
  );
}

function Dinero({ piezas }: { piezas: { valor: number; cantidad: number }[] }) {
  return (
    <span className="flex flex-wrap items-end gap-3 justify-center">
      {piezas.filter((p) => p.cantidad > 0).map((p) => {
        const billete = p.valor >= 10;
        return (
          <span key={p.valor} className="flex flex-col items-center gap-1">
            <span className="flex flex-wrap gap-1 justify-center max-w-[10rem]">
              {Array.from({ length: Math.min(p.cantidad, 12) }, (_, i) =>
                billete ? (
                  <span key={i} className="inline-flex items-center justify-center w-11 h-6 rounded bg-emerald-200 border-2 border-emerald-600 text-[11px] font-black text-emerald-900">
                    ${p.valor}
                  </span>
                ) : (
                  <span key={i} className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-300 border-2 border-amber-600 text-[11px] font-black text-amber-900">
                    ${p.valor}
                  </span>
                )
              )}
            </span>
            <span className="text-[12px] font-bold text-slate-600">
              {p.cantidad} de ${p.valor}
            </span>
          </span>
        );
      })}
    </span>
  );
}

const COLORES = ["#3b82f6", "#f97316", "#10b981", "#ec4899", "#8b5cf6", "#eab308"];

function Grupos({ a }: { a: Extract<Apoyo, { tipo: "grupos" }> }) {
  const total = a.grupos.reduce((s, x) => s + x, 0);
  let visto = 0;
  return (
    <span className="flex flex-col items-center gap-1">
      <Titulo texto={a.titulo} />
      <span className="flex flex-wrap gap-3 justify-center">
        {a.grupos.map((g, gi) => (
          <span key={gi} className="inline-flex flex-wrap gap-1 max-w-[8rem] justify-center rounded-xl bg-slate-100 p-1.5">
            {Array.from({ length: g }, (_, i) => {
              visto++;
              const tachado = !!a.tachados && visto > total - a.tachados;
              return (
                <svg key={i} width="16" height="16" viewBox="0 0 20 20" aria-hidden>
                  <circle cx="10" cy="10" r="8" fill={COLORES[gi % COLORES.length]} opacity={tachado ? 0.35 : 1} stroke="#1f2937" strokeWidth="1" />
                  {tachado && <path d="M4 4 L16 16 M16 4 L4 16" stroke="#dc2626" strokeWidth="2.5" />}
                </svg>
              );
            })}
          </span>
        ))}
      </span>
    </span>
  );
}

export default function ApoyoVisual({ apoyo }: { apoyo: Apoyo }) {
  switch (apoyo.tipo) {
    case "fila":
      return <Fila a={apoyo} />;
    case "cuadro":
      return <Cuadro a={apoyo} />;
    case "recta":
      return <Recta a={apoyo} />;
    case "bloques":
      if (apoyo.mas !== undefined || apoyo.menos !== undefined) {
        const otro = apoyo.mas ?? apoyo.menos ?? 0;
        return (
          <span className="flex items-center gap-3 flex-wrap justify-center">
            <Bloques n={apoyo.n} />
            <span className="text-2xl font-black text-slate-700">{apoyo.mas !== undefined ? "+" : "−"}</span>
            <Bloques n={otro} />
          </span>
        );
      }
      return <Bloques n={apoyo.n} />;
    case "reloj":
      return <Reloj h={apoyo.h} m={apoyo.m} />;
    case "dinero":
      return <Dinero piezas={apoyo.piezas} />;
    case "grupos":
      return <Grupos a={apoyo} />;
  }
}
