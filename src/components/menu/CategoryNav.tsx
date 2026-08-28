"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import type { MenuSection } from "@/lib/menu";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * Category jump-nav for the menu page — sticky under the header.
 *
 * From `md` up it stays the familiar row of pills. Below that breakpoint those
 * pills wrapped into a block several rows deep — most of a phone screen spent
 * before a single dish appeared — so small screens get a hamburger instead: one
 * compact bar naming the section you are in, opening a sheet with every
 * category.
 *
 * The sheet is anchored to the sticky bar (no portal needed — the bar is a
 * sibling of the blurred header, not a descendant, so nothing traps a
 * positioned child). It closes on Escape, on a backdrop tap, on selection, and
 * when the viewport grows past the pill breakpoint; focus moves into it on
 * open, cycles within it, and returns to the trigger on close.
 *
 * Mount/unmount is self-managed with CSS keyframes rather than a presence
 * library, mirroring MobileNav: the parent re-renders on every scroll-spy tick,
 * which would otherwise strand a closed-but-mounted sheet in the DOM.
 */
const SURFACE = "var(--color-surface)";
const INK = "var(--color-ink)";
const LINE = "var(--color-line)";
const MUTED = "var(--color-ink-dim)";

const EXIT_MS = 220;
/** Matches the `md` breakpoint, where the pills come back. */
const PILLS_QUERY = "(min-width: 48rem)";
/** The bar's own sticky offset, in rem — keep in step with its `top-[4.3rem]`. */
const STICKY_TOP_REM = 4.3;

export function CategoryNav({
  sections,
  active,
  onSelect,
}: {
  sections: MenuSection[];
  active: string;
  onSelect: (title: string) => void;
}) {
  const [open, setOpen] = useState(false);
  // `mounted` keeps the sheet in the DOM through its exit animation; the
  // enter/exit keyframes are driven purely by CSS off the `open` flag.
  const [mounted, setMounted] = useState(false);
  // Height the sheet may take without running past the bottom of the screen —
  // measured, because the bar it hangs from is only pinned once you scroll.
  const [sheetMax, setSheetMax] = useState<number>();
  const reducedMotion = useReducedMotion();
  const barRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setMounted(true);
      return;
    }
    if (!mounted) return;
    const t = window.setTimeout(() => setMounted(false), reducedMotion ? 0 : EXIT_MS);
    return () => window.clearTimeout(t);
  }, [open, mounted, reducedMotion]);

  // Escape closes, Tab stays inside the sheet, focus enters on open and returns
  // to the hamburger on close.
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
          "button:not([disabled])",
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
    const raf = requestAnimationFrame(() =>
      panelRef.current?.querySelector<HTMLElement>("button")?.focus(),
    );

    return () => {
      document.removeEventListener("keydown", onKey);
      cancelAnimationFrame(raf);
      // preventScroll: the jump to the chosen section is already under way.
      trigger?.focus({ preventScroll: true });
    };
  }, [mounted]);

  // The sheet hangs off the bottom of the bar, and at the top of the page that
  // bar sits well down the screen (the hero is still above it), so a fixed
  // max-height would push the last categories below the fold — unreachable
  // while the body is locked. Measure the room that is actually left instead.
  useEffect(() => {
    if (!mounted) return;
    const measure = () => {
      const bar = barRef.current;
      if (!bar) return;
      const room = window.innerHeight - bar.getBoundingClientRect().bottom - 16;
      setSheetMax(Math.max(180, Math.min(room, window.innerHeight * 0.65)));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [mounted]);

  // Scroll lock is tied to `open`, not `mounted`, so the body is scrollable
  // again by the time the jump to the chosen section fires.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // A rotation into landscape (or a resize past `md`) brings the pills back —
  // drop the sheet rather than leave it open behind them.
  useEffect(() => {
    if (!open) return;
    const mql = window.matchMedia(PILLS_QUERY);
    const onChange = () => {
      if (mql.matches) setOpen(false);
    };
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [open]);

  function openSheet() {
    const bar = barRef.current;
    if (bar) {
      const rootPx = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      const delta = bar.getBoundingClientRect().top - STICKY_TOP_REM * rootPx;
      // At the top of the page the bar still sits under the hero, with only a
      // sliver of screen beneath it. Pin it first so the sheet opens into the
      // full height below the header instead of a two-item stub. The two-number
      // scrollTo is always instant and needs no `behavior: "instant"`, which
      // older Safari rejects outright (unknown enum value → TypeError).
      if (delta > 1) window.scrollTo(window.scrollX, window.scrollY + delta);
    }
    setOpen(true);
  }

  function choose(title: string) {
    setOpen(false);
    // Let the sheet begin closing, and the scroll lock lift, before the jump.
    window.setTimeout(() => onSelect(title), 60);
  }

  return (
    <div
      ref={barRef}
      className="sticky top-[4.3rem] z-40 px-6 py-3 md:px-10 md:py-4"
      style={{ background: "color-mix(in oklab, var(--color-bg) 88%, transparent)" }}
    >
      {/* md and up — the pill row, unchanged. */}
      <div className="mx-auto hidden max-w-7xl flex-wrap justify-center gap-2.5 md:flex">
        {sections.map((s) => {
          const on = active === s.title;
          return (
            <button
              key={s.title}
              type="button"
              onClick={() => onSelect(s.title)}
              aria-current={on ? "true" : undefined}
              className="rounded-full border px-5 py-2 text-center transition-colors"
              style={{
                borderColor: on ? "var(--color-amber)" : LINE,
                background: on ? "var(--color-amber)" : SURFACE,
                color: on ? "var(--color-on-accent)" : INK,
              }}
            >
              <span className="block text-xs font-medium uppercase tracking-[0.18em]">{s.title}</span>
              {s.subtitle ? (
                <span
                  className="block text-[0.68rem] italic"
                  style={{ color: on ? "var(--color-on-accent)" : MUTED }}
                >
                  {s.subtitle}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Below md — one hamburger bar in place of the wrapped pills. Sits above
          the backdrop so the icon stays a working toggle while the sheet is up. */}
      <div className="relative z-10 mx-auto max-w-7xl md:hidden">
        <button
          ref={triggerRef}
          type="button"
          aria-expanded={open}
          aria-controls="menu-category-sheet"
          aria-label={open ? "Close menu categories" : "Open menu categories"}
          onClick={() => (open ? setOpen(false) : openSheet())}
          className="flex w-full items-center gap-3 rounded-full border px-4 py-2.5 text-left transition-colors"
          style={{ borderColor: LINE, background: SURFACE, color: INK }}
        >
          {open ? <X className="h-5 w-5 shrink-0" aria-hidden /> : <Menu className="h-5 w-5 shrink-0" aria-hidden />}
          <span className="min-w-0 flex-1">
            <span className="block text-[0.58rem] uppercase tracking-[0.22em]" style={{ color: MUTED }}>
              Categories
            </span>
            <span className="block truncate text-xs font-medium uppercase tracking-[0.18em]">
              {active || sections[0]?.title}
            </span>
          </span>
        </button>
      </div>

      {mounted ? (
        <>
          {/* Backdrop: no z-index, so it paints under the bar and the sheet. */}
          <div
            aria-hidden
            onClick={() => setOpen(false)}
            className="fixed inset-0 md:hidden"
            style={{
              background: "color-mix(in oklab, var(--color-ink) 45%, transparent)",
              opacity: open ? 1 : 0,
              transition: reducedMotion ? undefined : `opacity ${EXIT_MS}ms var(--ease-out-soft)`,
            }}
          />
          <div
            id="menu-category-sheet"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu categories"
            className="absolute inset-x-0 top-full z-10 px-6 md:hidden"
            style={{
              animation: reducedMotion
                ? undefined
                : `${open ? "menu-cats-in" : "menu-cats-out"} ${EXIT_MS}ms var(--ease-out-soft) both`,
            }}
          >
            <ul
              className="overflow-y-auto overscroll-contain rounded-2xl border py-1 shadow-xl"
              style={{ borderColor: LINE, background: SURFACE, maxHeight: sheetMax ?? "65vh" }}
            >
              {sections.map((s) => {
                const on = active === s.title;
                return (
                  <li key={s.title}>
                    <button
                      type="button"
                      onClick={() => choose(s.title)}
                      aria-current={on ? "true" : undefined}
                      className="flex w-full items-center justify-between gap-3 px-5 py-3 text-left transition-colors"
                      style={{
                        background: on ? "var(--color-amber)" : "transparent",
                        color: on ? "var(--color-on-accent)" : INK,
                      }}
                    >
                      <span className="min-w-0">
                        <span className="block text-xs font-medium uppercase tracking-[0.18em]">{s.title}</span>
                        {s.subtitle ? (
                          <span
                            className="block text-[0.68rem] italic"
                            style={{ color: on ? "var(--color-on-accent)" : MUTED }}
                          >
                            {s.subtitle}
                          </span>
                        ) : null}
                      </span>
                      <span
                        className="shrink-0 text-[0.6rem] uppercase tracking-[0.15em]"
                        style={{ color: on ? "var(--color-on-accent)" : MUTED }}
                      >
                        {s.items.length}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      ) : null}
    </div>
  );
}
