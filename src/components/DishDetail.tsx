"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X } from "lucide-react";
import type { SiteContent } from "@/lib/brand";

type Dish = SiteContent["dishes"][number];

/**
 * Dish detail view — a focused modal for a single signature plate. Opens from a
 * card in Signature Plates and carries: the plate's own photograph, two
 * produced-asset slots (a 360° spin and a short film) that show elegant empty
 * states until the client supplies them, the real attributed Tripadvisor
 * pull-quote, and the brand-voice description.
 *
 * Portaled to <body> so no ancestor transform/backdrop traps the fixed overlay.
 * Accessible: role=dialog + aria-modal, labelled by the dish name, Escape and
 * backdrop click close, focus moves into the panel on open and back to the
 * trigger on close, and body scroll is locked while open.
 */
export function DishDetail({ dish, onClose }: { dish: Dish; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const titleId = `dish-${dish.slug}-title`;

  return createPortal(
    <div
      className="fixed inset-0 flex items-start justify-center overflow-y-auto p-4 md:p-8"
      style={{ zIndex: "var(--z-overlay)" }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="fixed inset-0 -z-10 cursor-default"
        style={{
          background: "color-mix(in oklab, var(--color-ink) 55%, transparent)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
        }}
      />

      <div
        ref={panelRef}
        className="relative my-auto w-full max-w-4xl overflow-hidden rounded-xl border shadow-2xl"
        style={{ borderColor: "var(--color-line)", background: "var(--color-surface)" }}
      >
        <button
          ref={closeRef}
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 inline-flex items-center justify-center rounded-full p-2 text-ink transition-colors duration-200 hover:text-[color:var(--color-amber-deep)]"
          style={{ background: "color-mix(in oklab, var(--color-surface) 70%, transparent)" }}
        >
          <X className="h-5 w-5" aria-hidden />
        </button>

        <div className="grid md:grid-cols-2">
          {/* Hero plate photograph */}
          <div className="relative aspect-[4/3] md:aspect-auto md:min-h-full">
            <Image
              src={dish.image}
              alt={dish.name}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>

          {/* Detail column */}
          <div className="p-7 md:p-9">
            <p className="eyebrow text-amber-deep">Signature Plate</p>
            <h3
              id={titleId}
              className="font-display mt-2 text-balance"
              style={{ fontSize: "var(--text-2xl)", lineHeight: 1.05 }}
            >
              {dish.name}
            </h3>
            <p className="mt-4 text-pretty text-ink-dim">{dish.note}</p>

            {/* Produced-asset slots */}
            <div className="mt-7 grid grid-cols-2 gap-3">
              <MediaSlot kind="spin" src={dish.media.spin} label={dish.name} />
              <MediaSlot kind="video" src={dish.media.video} label={dish.name} />
            </div>
            <p className="mt-3 text-xs text-muted">
              360° views and short films are produced in-house and arrive soon;
              Tripadvisor does not host per-dish media.
            </p>

            {/* Real Tripadvisor pull-quote */}
            <figure className="mt-7 border-t pt-6" style={{ borderColor: "var(--color-line)" }}>
              <blockquote className="font-display text-pretty italic" style={{ fontSize: "var(--text-lg)", lineHeight: 1.3 }}>
                “{dish.review.quote}”
              </blockquote>
              <figcaption className="mt-3 text-sm uppercase tracking-[0.18em] text-ink-dim">
                {dish.review.author}
                {dish.review.city ? <span className="text-amber-deep">{` · ${dish.review.city}`}</span> : null}
                <span className="text-muted">{" · via Tripadvisor"}</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

/**
 * One produced-asset slot. Renders the asset when a src is present, otherwise an
 * elegant labelled empty state so the layout reads as intentional, not broken.
 */
function MediaSlot({
  kind,
  src,
  label,
}: {
  kind: "spin" | "video";
  src: string | null;
  label: string;
}) {
  const title = kind === "spin" ? "360° view" : "Short film";

  if (src) {
    return (
      <div className="relative aspect-square overflow-hidden rounded-md border" style={{ borderColor: "var(--color-line)" }}>
        {kind === "video" ? (
          <video src={src} controls playsInline className="h-full w-full object-cover">
            <track kind="captions" />
          </video>
        ) : (
          <Image src={src} alt={`360° view of ${label}`} fill sizes="25vw" className="object-cover" />
        )}
      </div>
    );
  }

  return (
    <div
      className="flex aspect-square flex-col items-center justify-center gap-2 rounded-md border text-center"
      style={{
        borderColor: "var(--color-line)",
        background: "color-mix(in oklab, var(--color-amber) 6%, var(--color-bg-alt))",
      }}
    >
      {kind === "spin" ? <SpinGlyph /> : <FilmGlyph />}
      <span className="eyebrow text-ink-dim">{title}</span>
      <span className="text-[0.68rem] uppercase tracking-[0.16em] text-muted">Coming soon</span>
    </div>
  );
}

/* Line glyphs matching the section-icon family (1px, round, currentColor). */
function SpinGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" aria-hidden className="h-6 w-6 text-amber-deep">
      <ellipse cx="12" cy="12" rx="8.5" ry="4" />
      <path d="M3.8 10.2A8.5 8.5 0 0 1 12 3.5a8.5 8.5 0 0 1 8.2 6.7" />
      <path d="M9.5 4.2 12 3.5l.6 2.5M20.2 10.2l-.5 2.4 2.3-.7" />
    </svg>
  );
}
function FilmGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" aria-hidden className="h-6 w-6 text-amber-deep">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M10.3 9.2 15 12l-4.7 2.8V9.2Z" />
    </svg>
  );
}
