import { Star } from "lucide-react";

interface RatingStarsProps {
  rating: number;
  reviewsCount?: number;
  size?: number;
}

export default function RatingStars({
  rating,
  reviewsCount,
  size = 14,
}: RatingStarsProps) {
  const rounded = Math.round(rating);

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            size={size}
            className={
              index < rounded
                ? "fill-[#b99a62] text-[#b99a62]"
                : "fill-transparent text-[#d8cdc0]"
            }
          />
        ))}
      </div>

      <span className="text-xs font-medium text-[#766d67]">
        {rating > 0 ? rating.toFixed(1) : "New"}
        {typeof reviewsCount === "number" && reviewsCount > 0 && (
          <span className="text-[#9b8f86]"> ({reviewsCount})</span>
        )}
      </span>
    </div>
  );
}
