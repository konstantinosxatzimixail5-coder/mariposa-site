"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { ReviewBadges } from "@/components/ReviewBadges";
import { BRAND, type SiteContent } from "@/lib/brand";
import { COPY, type Copy } from "@/lib/copy";

const AUTO_MS = 7000;

/**
 * Reviews. Leads with the verified Tripadvisor badge (4.9 / 288 / Travelers'
 * Choice 2025), then a slow crossfade through real, attributed guest excerpts —
 * no bounce, no slide. Auto-advances calmly; pauses on hover/focus and is a
 * manual keyboard stepper under reduced motion. Closes on a link to read all
 * reviews on Tripadvisor. An aria-live region announces each quote change.
 */
export function Testimonials({
  content = BRAND,
  copy = COPY.reviews,
}: {
  content?: SiteContent;
  copy?: Copy["reviews"];
}) {
  const reducedMotion = useReducedMotion();
  const items = content.reviews;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback(
    (dir: number) => setIndex((i) => (i + dir + items.length) % items.length),
    [items.length],
  );

  // Calm auto-advance — off for reduced motion and while paused.
  const timer = useRef<number | null>(null);
  useEffect(() => {
    if (reducedMotion || paused) return;
    timer.current = window.setInterval(() => go(1), AUTO_MS);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [reducedMotion, paused, go]);

  const current = items[index]!;

  return (
    <section
      id="reviews"
      className="section-beige border-t"
      style={{ borderColor: "var(--color-line)", paddingBlock: "var(--space-section)" }}
      aria-roledescription="carousel"
      aria-label="Guest reviews"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="mx-auto max-w-4xl px-6 text-center md:px-10">
        {/* Verified rating badge */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-1.5 text-amber-deep" aria-hidden>
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} className="h-5 w-5" fill="currentColor" strokeWidth={0} />
            ))}
          </div>
          <p className="text-balance text-sm uppercase tracking-[0.2em] text-ink-dim">
            <span className="text-ink">{content.rating.toFixed(1)} {copy.starsSuffix}</span> ·{" "}
            {content.reviewCount} {copy.reviewsLabel} · {content.award} ·{" "}
            <span className="text-amber-deep">{content.ranking}</span>
          </p>
        </div>

        <p className="mb-12 mt-8 font-display text-pretty" style={{ fontSize: "var(--text-xl)" }}>
          {copy.headlinePrefix}<span className="italic text-gold">{copy.headlineWord}</span>{copy.headlineSuffix}
        </p>

        <div className="relative min-h-[16rem] md:min-h-[13rem]" aria-live="polite">
          <AnimatePresence initial={false}>
            <motion.figure
              key={index}
              className="absolute inset-x-0 top-0"
              initial={{ opacity: 0, y: reducedMotion ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reducedMotion ? 0 : -12 }}
              transition={{ duration: reducedMotion ? 0 : 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <blockquote
                className="font-display text-balance italic"
                style={{ fontSize: "var(--text-2xl)", lineHeight: 1.25 }}
              >
                “{current.quote}”
              </blockquote>
              <figcaption className="mt-8 text-sm uppercase tracking-[0.2em] text-ink-dim">
                {current.author}
                {current.city ? (
                  <>
                    {" · "}
                    <span className="text-amber-deep">{current.city}</span>
                  </>
                ) : null}
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        <div className="mt-12 flex items-center justify-center gap-6">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous review"
            className="rounded-full border p-3 text-ink-dim transition-colors duration-200 hover:border-[color:var(--color-amber-deep)] hover:text-[color:var(--color-amber-deep)]"
            style={{ borderColor: "var(--color-line)" }}
          >
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>

          <ul className="flex items-center gap-2.5" role="tablist" aria-label="Choose review">
            {items.map((t, i) => (
              <li key={t.author}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={t.city ? `${t.author}, ${t.city}` : t.author}
                  onClick={() => setIndex(i)}
                  className="block h-2 w-2 rounded-full transition-colors duration-300"
                  style={{
                    background:
                      i === index ? "var(--color-amber)" : "var(--color-line)",
                  }}
                />
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next review"
            className="rounded-full border p-3 text-ink-dim transition-colors duration-200 hover:border-[color:var(--color-amber-deep)] hover:text-[color:var(--color-amber-deep)]"
            style={{ borderColor: "var(--color-line)" }}
          >
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>
        </div>

        {/* A voice from Google, alongside the Tripadvisor excerpts above. */}
        <figure className="mx-auto mt-16 max-w-2xl border-t pt-12" style={{ borderColor: "var(--color-line)" }}>
          <blockquote className="font-display text-balance italic" style={{ fontSize: "var(--text-xl)", lineHeight: 1.3 }}>
            “{content.googleReview.quote}”
          </blockquote>
          <figcaption className="mt-6 text-sm uppercase tracking-[0.2em] text-ink-dim">
            {content.googleReview.author}
            <span className="text-amber-deep">{` · via ${content.googleReview.source}`}</span>
          </figcaption>
        </figure>

        {/* Read more — Tripadvisor (wired) and Google (placeholder → Maps search). */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          <a
            href={content.tripadvisorUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full border px-7 py-3.5 text-sm font-medium text-ink transition-colors duration-200 hover:border-[color:var(--color-amber-deep)] hover:text-[color:var(--color-amber-deep)]"
            style={{ borderColor: "var(--color-line)" }}
          >
            {copy.tripadvisorCtaPrefix}{content.reviewCount}{copy.tripadvisorCtaSuffix}
          </a>
          <a
            href={content.googleReviewsUrl === "GOOGLE_REVIEWS_URL" ? content.googleMapsSearch : content.googleReviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full border px-7 py-3.5 text-sm font-medium text-ink transition-colors duration-200 hover:border-[color:var(--color-amber-deep)] hover:text-[color:var(--color-amber-deep)]"
            style={{ borderColor: "var(--color-line)" }}
          >
            {copy.googleCta}
          </a>
        </div>

        {/* Platform trust badges with their star ratings, below the buttons. */}
        <ReviewBadges content={content} />
      </div>
    </section>
  );
}
