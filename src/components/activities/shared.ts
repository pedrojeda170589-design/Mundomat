export const cardBase =
  "w-full max-w-md rounded-3xl bg-slate-900/80 border border-slate-700 p-6 shadow-xl";

export const choiceButtonClass = (state: "idle" | "correct" | "wrong" | "muted") => {
  const base =
    "w-full rounded-2xl border-2 px-4 py-3 text-lg font-bold transition text-center";
  switch (state) {
    case "correct":
      return `${base} bg-emerald-500/20 border-emerald-400 text-emerald-200`;
    case "wrong":
      return `${base} bg-red-500/20 border-red-400 text-red-200`;
    case "muted":
      return `${base} bg-slate-800/50 border-slate-700 text-slate-500`;
    default:
      return `${base} bg-slate-800 border-slate-600 text-white hover:border-amber-400 active:scale-[0.98]`;
  }
};
