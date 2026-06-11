"use client";

import { useEffect, useState } from "react";
import { BRAND } from "@/lib/brand";
import { ButterflyMark } from "./ButterflyMark";
import { MobileNav } from "./MobileNav";
import { useLenis } from "./SmoothScroll";

/**
 * Primary navigation — a fixed, full-width translucent bar that rides above the
 * page. It lifts a soft shadow once you scroll, smooth-scrolls to each section
 * (via Lenis when present, native otherwise) and highlights the section you are
 * in with a scroll-spy. Below lg it collapses into the MobileNav slide-in sheet.
 */
// `label` is the full name (used in the vertical MobileNav sheet, which has
// room); `short` is the condensed form for the horizontal desktop bar, where
// the full "Garden & Philosophy" / "Celebrations & Special Events" would
// overflow. Destinations and section headings stay full.
export const NAV_LINKS = [
  { href: "#dishes", label: "Menu" },
  { href: "#garden", label: "Garden & Philosophy", short: "Garden" },
  { href: "#chefs-words", label: "Chef's Words", short: "Chef's Words" },
  { href: "#experience", label: "The Experience", short: "Experience" },
  { href: "#celebrations", label: "Celebrations & Special Events", short: "Celebrations" },
  { href: "#reviews", label: "Reviews" },
  { href: "#family", label: "The Family", short: "Family" },
] as const;

const NAV_OFFSET = -88; // clears the fixed bar when scrolling to a section

export function SiteNav() {
  const lenis = useLenis();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");

  // Soft shadow + stronger ground once the page leaves the very top.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy: the active section is the one crossing the upper third.
  useEffect(() => {
    const ids = [...NAV_LINKS.map((l) => l.href.slice(1)), "top"];
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  function go(href: string) {
    const el = document.querySelector(href);
    if (!el) return;
    if (lenis) {
      lenis.scrollTo(el as HTMLElement, { offset: NAV_OFFSET });
    } else {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    e.preventDefault();
    go(href);
  }

  return (
    <header
      className="fixed inset-x-0 top-0 transition-[background-color,box-shadow,backdrop-filter] duration-300"
      style={{
        zIndex: "var(--z-nav)",
        background: scrolled
          ? "color-mix(in oklab, var(--color-ink) 90%, transparent)"
          : "color-mix(in oklab, var(--color-ink) 64%, transparent)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        boxShadow: scrolled
          ? "0 1px 0 color-mix(in oklab, var(--color-ivory) 12%, transparent), 0 10px 34px -18px color-mix(in oklab, #000 70%, transparent)"
          : "none",
      }}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-[88rem] items-center justify-between gap-6 px-5 py-3.5 md:px-8"
      >
        <a
          href="#top"
          onClick={(e) => handleClick(e, "#top")}
          className="flex shrink-0 items-center gap-2.5 text-ivory transition-colors duration-200 hover:text-[color:var(--color-amber-bright)]"
          aria-label={`${BRAND.name}, home`}
        >
          <ButterflyMark className="h-6 w-6 text-[color:var(--color-amber)]" />
          <span className="font-display text-lg tracking-tight">{BRAND.name}</span>
        </a>

        <ul className="hidden items-center gap-4 xl:gap-6 lg:flex">
          {NAV_LINKS.map((l) => {
            const isActive = active === l.href;
            return (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={(e) => handleClick(e, l.href)}
                  aria-current={isActive ? "true" : undefined}
                  className="relative whitespace-nowrap text-[0.72rem] uppercase tracking-[0.1em] transition-colors duration-200 hover:text-[color:var(--color-ivory)]"
                  style={{ color: isActive ? "var(--color-amber-bright)" : "var(--color-ivory-dim)" }}
                >
                  {"short" in l ? l.short : l.label}
                  <span
                    aria-hidden
                    className="absolute -bottom-1.5 left-0 h-px bg-[color:var(--color-amber-bright)] transition-[width] duration-300"
                    style={{ width: isActive ? "100%" : "0%" }}
                  />
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href="#reserve"
            onClick={(e) => handleClick(e, "#reserve")}
            className="hidden whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium text-[color:var(--color-on-accent)] transition-[background-color] duration-200 hover:bg-amber-bright lg:inline-flex"
            style={{ background: "var(--color-amber)" }}
          >
            Make a Reservation
          </a>
          <MobileNav links={NAV_LINKS} onNavigate={go} />
        </div>
      </nav>
    </header>
  );
}
