export default function CoinBadge({ coins }: { coins: number }) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/40 px-3 py-1.5 text-yellow-300 font-bold text-sm">
      <span className="text-base">🪙</span>
      {coins}
    </div>
  );
}
