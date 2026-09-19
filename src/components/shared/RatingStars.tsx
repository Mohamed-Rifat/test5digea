import { Star } from "lucide-react";

interface RatingStarsProps {
  rating: number;
  reviewsCount?: number;
  size?: number;
  compact?: boolean;
}

export default function RatingStars({
  rating,
  reviewsCount,
  size,
  compact = false,
}: RatingStarsProps) {
  const safeRating = Math.max(0, Math.min(5, rating || 0));
  const starSize = size ?? (compact ? 12 : 14);
  const textSize = compact ? "text-xs" : "text-sm";

  return (
    <span className="inline-flex shrink-0 items-center gap-1.5">
      <span className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={starSize}
            strokeWidth={0}
            className={
              i < Math.round(safeRating)
                ? "fill-[#e4c477] text-[#e4c477]"
                : "fill-neutral-200 text-neutral-200"
            }
          />
        ))}
      </span>

      <span className={`font-semibold text-[#30251f] ${textSize}`}>
        {safeRating.toFixed(1)}
      </span>

      {typeof reviewsCount === "number" && (
        <span className={`text-neutral-400 ${textSize}`}>
          ({reviewsCount})
        </span>
      )}
    </span>
  );
}