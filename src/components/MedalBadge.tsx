import { MedalTier } from "@/types";
import { MEDAL_INFO } from "@/lib/medals";

export default function MedalBadge({
  tier,
  size = "md",
}: {
  tier: MedalTier;
  size?: "sm" | "md" | "lg";
}) {
  const info = MEDAL_INFO[tier];
  const sizeClasses =
    size === "lg" ? "text-4xl" : size === "sm" ? "text-lg" : "text-2xl";
  return (
    <div className="inline-flex items-center gap-2">
      <span className={sizeClasses}>{info.emoji}</span>
      {size !== "sm" && (
        <span className="text-sm font-semibold" style={{ color: info.color }}>
          {info.label}
        </span>
      )}
    </div>
  );
}
