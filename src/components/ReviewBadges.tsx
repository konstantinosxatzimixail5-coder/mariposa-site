import Image from "next/image";
import { BRAND } from "@/lib/brand";

/**
 * Review-platform trust badges — the Tripadvisor Travelers' Choice 2025 award
 * and Google with its five-star rating, shown beneath the "read all reviews"
 * buttons. The Google mark and stars are inline SVG; the Travelers' Choice badge
 * is a self-hosted vector asset. All stay razor-sharp on any display. The row
 * centres and wraps to a stack on narrow screens.
 */

const GOOGLE = {
  blue: "#4285F4",
  red: "#EA4335",
  yellow: "#FBBC05",
  green: "#34A853",
  star: "#FBBC05",
};

function Stars({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5" role="img" aria-label={label}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 24 24" className="h-5 w-5" fill={color} aria-hidden>
          <path d="M12 2.5l2.9 5.88 6.49.94-4.7 4.58 1.11 6.46L12 17.3l-5.8 3.05 1.1-6.46-4.69-4.58 6.49-.94L12 2.5z" />
        </svg>
      ))}
    </div>
  );
}

/** The Google wordmark, set letter-by-letter in the official brand colours. */
function GoogleWordmark() {
  const letters: [string, string][] = [
    ["G", GOOGLE.blue],
    ["o", GOOGLE.red],
    ["o", GOOGLE.yellow],
    ["g", GOOGLE.blue],
    ["l", GOOGLE.green],
    ["e", GOOGLE.red],
  ];
  return (
    <span
      aria-hidden
      className="font-sans text-[1.9rem] font-medium leading-none tracking-tight"
    >
      {letters.map(([ch, color], i) => (
        <span key={i} style={{ color }}>
          {ch}
        </span>
      ))}
    </span>
  );
}

export function ReviewBadges() {
  return (
    <div className="mt-10 flex flex-wrap items-center justify-center gap-x-16 gap-y-10">
      {/* Tripadvisor — Travelers' Choice 2025 award badge */}
      <a
        href={BRAND.tripadvisorUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Tripadvisor Travelers' Choice 2025 award"
        className="transition-opacity duration-200 hover:opacity-80"
      >
        <Image
          src="/images/logo/travelers-choice-2025.svg"
          alt="Tripadvisor Travelers' Choice Awards 2025"
          width={128}
          height={128}
          className="h-28 w-28"
        />
      </a>

      {/* Google */}
      <a
        href={BRAND.googleReviewsUrl === "GOOGLE_REVIEWS_URL" ? BRAND.googleMapsSearch : BRAND.googleReviewsUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Google Reviews — 4.9 of 5 stars"
        className="flex flex-col items-center gap-2 transition-opacity duration-200 hover:opacity-80"
      >
        <div className="flex items-baseline gap-2">
          <GoogleWordmark />
          <span className="text-[1.35rem] font-normal leading-none text-ink-dim">Reviews</span>
        </div>
        <Stars color={GOOGLE.star} label="4.9 of 5 on Google" />
      </a>
    </div>
  );
}
