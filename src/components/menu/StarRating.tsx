import { Star } from "lucide-react";

/** Five amber stars with an optional numeric value + review count. */
export function StarRating({
  rating = 0,
  count,
  size = 14,
}: {
  rating?: number;
  count?: number;
  size?: number;
}) {
  const rounded = Math.round(rating);
  return (
    <span className="inline-flex items-center gap-2" aria-label={`Rated ${rating} out of 5`}>
      <span className="inline-flex items-center gap-0.5" style={{ color: "var(--color-amber)" }} aria-hidden>
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            style={{ width: size, height: size }}
            fill={i < rounded ? "currentColor" : "none"}
            strokeWidth={i < rounded ? 0 : 1.5}
          />
        ))}
      </span>
      {rating ? (
        <span className="text-sm tabular-nums" style={{ color: "color-mix(in oklab, var(--color-ivory) 78%, transparent)" }}>
          {rating.toFixed(1)}
          {count ? ` · ${count} reviews` : null}
        </span>
      ) : null}
    </span>
  );
}
