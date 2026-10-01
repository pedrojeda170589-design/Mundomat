"use client";

import { useState } from "react";
import Image from "next/image";
import { WORLDS } from "@/lib/worlds";
import { GRADE1_WORLDS } from "@/lib/grade1/worlds";
import { SUBJECT_INFO, WorldSubject } from "@/types";
import { fichaHref, fichaVersions } from "@/lib/fichas";
import FichasGate from "@/components/FichasGate";

export default function FichasView() {
  const [grade, setGrade] = useState<number>(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const match = window.location.hash.match(/mundo-(\d+)/);
      if (match && parseInt(match[1], 10) >= 10000) return 1;
    }
    return 3;
  });
  const subjects = Object.keys(SUBJECT_INFO) as WorldSubject[];

  const worlds = grade === 1 ? GRADE1_WORLDS : WORLDS;

  return (
    <FichasGate onUnlocked={(g) => setGrade(g)}>
      <div className="flex flex-col gap-6">
        {/* Selector de grado */}
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setGrade(1)}
            className={`px-4 py-2 rounded-xl font-bold text-sm transition shadow ${
              grade === 1
                ? "bg-amber-500 text-slate-950 ring-2 ring-amber-300 scale-105"
                : "bg-amber-900/40 text-amber-100 hover:bg-amber-900/60"
            }`}
          >
            🎒 1.º Grado (96 mundos)
          </button>
          <button
            type="button"
            onClick={() => setGrade(3)}
            className={`px-4 py-2 rounded-xl font-bold text-sm transition shadow ${
              grade === 3
                ? "bg-amber-500 text-slate-950 ring-2 ring-amber-300 scale-105"
                : "bg-amber-900/40 text-amber-100 hover:bg-amber-900/60"
            }`}
          >
            🏆 3.º Grado (47 mundos)
          </button>
        </div>

        {subjects.map((subject) => {
          const info = SUBJECT_INFO[subject];
          const subjectWorlds = worlds.filter((w) => w.subject === subject);
          if (subjectWorlds.length === 0) return null;

          return (
            <section key={subject} className="parchment-panel rounded-2xl p-4">
              <h2 className="font-black text-lg mb-3">
                {info.emoji} {info.label}
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {subjectWorlds.map((w) => (
                  <li
                    key={w.id}
                    id={`mundo-${w.id}`}
                    className="flex items-center gap-3 rounded-xl bg-white/60 border border-amber-700/20 px-3 py-2 scroll-mt-4 target:ring-4 target:ring-sky-400"
                  >
                    {w.grade === 1 ? (
                      <span
                        className="relative w-12 h-12 shrink-0 flex items-center justify-center rounded-full border-2 border-white/80 shadow text-2xl"
                        style={{
                          background: `radial-gradient(circle at 35% 30%, ${w.colorFrom}, ${w.colorTo})`,
                        }}
                      >
                        {w.emoji}
                      </span>
                    ) : (
                      <span className="relative w-12 h-12 shrink-0">
                        <Image
                          src={`/theme/islands/mundo-${w.id}.png`}
                          alt=""
                          fill
                          sizes="48px"
                          className="object-contain"
                        />
                      </span>
                    )}

                    <span className="flex-1 min-w-0">
                      <span className="block font-bold text-sm truncate">{w.name}</span>
                      <span className="flex flex-wrap gap-1.5 mt-1">
                        {Array.from({ length: fichaVersions(w) }, (_, k) => k + 1).map((v) => (
                          <a
                            key={v}
                            href={fichaHref(w.id, v)}
                            target="_blank"
                            rel="noopener"
                            className="rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold px-2.5 py-1 transition active:scale-95"
                          >
                            {fichaVersions(w) === 1 ? "Descargar ficha ⬇" : `Ficha ${v} ⬇`}
                          </a>
                        ))}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </FichasGate>
  );
}
