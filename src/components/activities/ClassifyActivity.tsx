"use client";

import { useState } from "react";
import { cardBase } from "./shared";

interface Item {
  label: string;
  categoryIndex: number;
}

interface Props {
  prompt: string;
  categories: string[];
  items: Item[];
  onDone: (correct: boolean) => void;
}

export default function ClassifyActivity({
  prompt,
  categories,
  items,
  onDone,
}: Props) {
  const [assignments, setAssignments] = useState<Record<number, number>>({});
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState<"correct" | "wrong" | null>(null);

  const allAssigned = Object.keys(assignments).length === items.length;

  function handleItemClick(i: number) {
    if (submitted !== null) return;
    setSelectedItem(i);
  }

  function handleCategoryClick(catIdx: number) {
    if (submitted !== null || selectedItem === null) return;
    setAssignments((prev) => ({ ...prev, [selectedItem]: catIdx }));
    setSelectedItem(null);
  }

  function handleSubmit() {
    if (submitted !== null || !allAssigned) return;
    const correctCount = items.filter(
      (it, i) => assignments[i] === it.categoryIndex
    ).length;
    const isCorrect = correctCount / items.length >= 0.7;
    setSubmitted(isCorrect ? "correct" : "wrong");
    setTimeout(() => onDone(isCorrect), 1200);
  }

  return (
    <div className={cardBase}>
      <p className="text-xl font-bold text-white mb-4 text-center">
        {prompt}
      </p>

      <div className="flex flex-wrap gap-2 justify-center mb-4">
        {items.map((it, i) => {
          const assignedTo = assignments[i];
          const isSelected = selectedItem === i;
          return (
            <button
              key={i}
              type="button"
              onClick={() => handleItemClick(i)}
              disabled={submitted !== null}
              className={`rounded-lg border-2 px-3 py-1.5 text-sm font-semibold transition ${
                assignedTo !== undefined
                  ? "bg-sky-500/20 border-sky-400 text-sky-200"
                  : isSelected
                    ? "bg-amber-500/20 border-amber-400 text-amber-200"
                    : "bg-slate-800 border-slate-600 text-white hover:border-amber-400"
              }`}
            >
              {it.label}
              {assignedTo !== undefined && (
                <span className="block text-[10px] text-sky-300 mt-0.5">
                  {categories[assignedTo]}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {categories.map((cat, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleCategoryClick(i)}
            disabled={submitted !== null || selectedItem === null}
            className="rounded-xl border-2 border-purple-400/50 bg-purple-500/10 text-purple-200 font-bold px-3 py-3 text-sm hover:bg-purple-500/20 transition disabled:opacity-40"
          >
            {cat}
          </button>
        ))}
      </div>

      {submitted === null && (
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!allAssigned}
          className="w-full rounded-2xl bg-amber-500 text-slate-900 font-bold py-2.5 disabled:opacity-40"
        >
          Listo
        </button>
      )}
      {submitted === "correct" && (
        <p className="text-emerald-300 font-bold text-lg text-center">
          ¡Muy bien clasificado! 🎉
        </p>
      )}
      {submitted === "wrong" && (
        <p className="text-red-300 font-bold text-lg text-center">
          Algunas no eran correctas, ¡a seguir practicando!
        </p>
      )}
    </div>
  );
}
