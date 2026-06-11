"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Menu, X } from "lucide-react";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * Primary navigation sheet — the site's single menu at every breakpoint. A
 * hamburger in the bar opens a full-screen overlay listing every section anchor
 * plus the reservation CTA.
 *
 * Robustness the small-screen sheet needs:
 *  - It is portaled to <body> and sits at a z-index above the fixed bar, the
 *    grain overlay and the particle/3D layer, so nothing bleeds through.
 *  - The link column is independently scrollable and padded for the safe-area
 *    insets (notch / home indicator), so no item is ever clipped on short or
 *    notched viewports (tested at 360×640 and short-height landscape).
 *  - Body scroll is locked while open; Escape closes; focus moves into the panel
 *    on open, is trapped within it (Tab cycles), and returns to the trigger on
 *    close. Tapping any link closes the sheet and hands smooth-scroll back to
 *    the parent via onNavigate.
 *
 * The portal matters because the surrounding bar uses backdrop-blur, and an
 * ancestor with backdrop-filter becomes the containing block for position:fixed
 * descendants — which would otherwise trap the overlay inside the bar.
 *
 * Mount/unmount is self-managed with CSS transitions rather than a presence
 * library: the parent nav re-renders constantly (scroll listener + scroll-spy
 * IntersectionObserver), which disrupts exit-animation tracking and can strand a
 * closed-but-mounted dialog in the DOM. Driving the open→exit→unmount cycle here
 * guarantees the dialog leaves the accessibility tree the moment it closes.
 */
const EXIT_MS = 320;

export function MobileNav({
  links,
  onNavigate,
}: {
  links: ReadonlyArray<{ href: string; label: string }>;
  onNavigate: (href: string) => void;
}) {
  const [open, setOpen] = useState(false);
  // `mounted` keeps the panel in the DOM through its exit animation; the
  // enter/exit keyframes are driven purely by CSS off the `open` flag.
  const [mounted, setMounted] = useState(false);
  const reducedMotion = useReducedMotion();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Open mounts immediately; closing keeps the panel mounted just long enough
  // for the exit keyframes to finish (instant under reduced motion).
  useEffect(() => {
    if (open) {
      setMounted(true);
      return;
    }
    if (!mounted) return;
    const t = window.setTimeout(() => setMounted(false), reducedMotion ? 0 : EXIT_MS);
    return () => window.clearTimeout(t);
  }, [open, mounted, reducedMotion]);

  // Escape to close, Tab to stay trapped, body scroll lock, initial focus, and
  // focus return — all active only while the panel is mounted.
  useEffect(() => {
    if (!mounted) return;
    const trigger = triggerRef.current;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key === "Tab" && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])',
        );
        if (focusable.length === 0) return;
        const first = focusable[0]!;
        const last = focusable[focusable.length - 1]!;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const raf = requestAnimationFrame(() =>
      panelRef.current?.querySelector<HTMLElement>("a, button")?.focus(),
    );

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      cancelAnimationFrame(raf);
      trigger?.focus();
    };
  }, [mounted]);

  function navigate(href: string) {
    setOpen(false);
    // Let the sheet begin closing before the scroll begins.
    window.setTimeout(() => onNavigate(href), 60);
  }

  return (
    <div>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center justify-center rounded-full p-2 text-ivory transition-colors duration-200 hover:text-[color:var(--color-amber-bright)]"
      >
        {open ? <X className="h-6 w-6" aria-hidden /> : <Menu className="h-6 w-6" aria-hidden />}
      </button>

      {mounted &&
        createPortal(
          <div
            id="mobile-nav-panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="fixed inset-0 flex flex-col overflow-y-auto overscroll-contain"
            style={{
              // Above the fixed bar (z-nav 40), grain (z-overlay 80) and the
              // particle layer (z -1).
              zIndex: 90,
              background: "var(--color-bg)",
              // Respect the notch / home indicator on notched devices.
              paddingTop: "env(safe-area-inset-top)",
              paddingBottom: "env(safe-area-inset-bottom)",
              paddingLeft: "env(safe-area-inset-left)",
              paddingRight: "env(safe-area-inset-right)",
              animation: reducedMotion
                ? undefined
                : `${open ? "mobile-nav-in" : "mobile-nav-out"} ${EXIT_MS}ms cubic-bezier(0.16,1,0.3,1) both`,
            }}
          >
            <div className="flex items-center justify-end px-6 pt-5">
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center rounded-full p-2 text-ink transition-colors duration-200 hover:text-[color:var(--color-amber-deep)]"
              >
                <X className="h-6 w-6" aria-hidden />
              </button>
            </div>

            <nav
              aria-label="Mobile"
              className="flex flex-1 flex-col justify-center gap-1 px-8 py-6"
            >
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(l.href);
                  }}
                  className="font-display py-1.5 text-ink transition-colors duration-200 hover:text-[color:var(--color-amber-deep)]"
                  style={{ fontSize: "clamp(1.5rem, 7vw, 2rem)" }}
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#reserve"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("#reserve");
                }}
                className="mt-7 inline-flex w-fit rounded-full px-7 py-3.5 font-medium text-[color:var(--color-on-accent)] transition-colors duration-200 hover:bg-amber-bright"
                style={{ background: "var(--color-amber)" }}
              >
                Make a Reservation
              </a>
            </nav>
          </div>,
          document.body,
        )}
    </div>
  );
}
