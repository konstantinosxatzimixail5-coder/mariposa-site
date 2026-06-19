"use client";

import { useEffect } from "react";
import { X, Phone, MessageCircle } from "lucide-react";
import { ButterflyMark } from "@/components/ButterflyMark";
import { ReservationForm } from "@/components/ReservationForm";
import type { SiteContent } from "@/lib/brand";

/** In-page reservation popup. Reuses the landing's ReservationForm. */
export function ReservationModal({ content, onClose }: { content: SiteContent; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[130] flex items-start justify-center overflow-y-auto p-4 py-10"
      style={{ background: "color-mix(in oklab, var(--color-ink) 78%, transparent)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Reserve a table"
    >
      <div
        className="relative w-full max-w-xl rounded-2xl border p-7 md:p-9"
        style={{ background: "var(--color-bg)", borderColor: "var(--color-line)", color: "var(--color-ink)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border text-ink-dim"
          style={{ borderColor: "var(--color-line)" }}
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-col items-center text-center">
          <ButterflyMark className="h-14 w-14 text-[color:var(--color-amber-deep)]" />
          <h2 className="font-display mt-4" style={{ fontSize: "var(--text-2xl)" }}>Reserve your table</h2>
          <p className="mt-3 max-w-md text-pretty text-ink-dim">
            We hold only a handful of covers each service, so we gently suggest reserving ahead.
          </p>
        </div>

        <div className="mt-7">
          <ReservationForm occasions={content.occasions} />
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm">
            <span className="text-muted">Or reach us directly</span>
            <a href={content.phoneHref} className="inline-flex items-center gap-2 text-ink-dim transition-colors hover:text-[color:var(--color-amber-deep)]">
              <Phone className="h-4 w-4" aria-hidden /> {content.phone}
            </a>
            <a href={content.whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-ink-dim transition-colors hover:text-[color:var(--color-amber-deep)]">
              <MessageCircle className="h-4 w-4" aria-hidden /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
