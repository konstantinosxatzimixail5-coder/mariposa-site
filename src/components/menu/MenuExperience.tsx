"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Instagram, Facebook, MessageCircle } from "lucide-react";
import { ButterflyMark } from "@/components/ButterflyMark";
import type { SiteContent } from "@/lib/brand";
import type { MenuItem, MenuSection } from "@/lib/menu";
import { CategoryNav } from "./CategoryNav";
import { StarRating } from "./StarRating";
import { DishModal } from "./DishModal";
import { ReservationModal } from "./ReservationModal";

// Light landing palette for the page body; the header keeps a warm dark bar.
const BG = "var(--color-bg)";
const SURFACE = "var(--color-surface)";
const INK = "var(--color-ink)";
const LINE = "var(--color-line)";
const MUTED = "var(--color-ink-dim)";
const HEADER_BG = "color-mix(in oklab, var(--color-ink) 80%, var(--color-olive))";

export function MenuExperience({
  sections,
  content,
  legal,
}: {
  sections: MenuSection[];
  content: SiteContent;
  legal?: string;
}) {
  const [dish, setDish] = useState<MenuItem | null>(null);
  const [reserveOpen, setReserveOpen] = useState(false);
  const [active, setActive] = useState(sections[0]?.title ?? "");
  const refs = useRef<Record<string, HTMLElement | null>>({});

  function jump(title: string) {
    setActive(title);
    refs.current[title]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Scroll-spy: the category nav names the section you are actually reading, not
  // just the last one you tapped. The mobile hamburger shows that name in its
  // collapsed bar, so a click-only `active` would sit there stating the wrong
  // section for the whole scroll.
  useEffect(() => {
    const observed = sections
      .map((s) => refs.current[s.title])
      .filter((el): el is HTMLElement => el !== null && el !== undefined);
    if (observed.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const title = sections.find((s) => refs.current[s.title] === entry.target)?.title;
          if (title) setActive(title);
        }
      },
      // A band across the upper middle of the viewport, clear of the sticky bar.
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 },
    );
    observed.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [sections]);

  return (
    <div className="min-h-screen" style={{ background: BG, color: INK }}>
      {/* Header — warm dark bar */}
      <header
        className="sticky top-0 z-50 backdrop-blur"
        style={{ background: HEADER_BG, color: "var(--color-ivory)" }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 md:px-10">
          <Link href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3" aria-label={`${content.name}, home (opens in new tab)`}>
            <ButterflyMark className="h-9 w-9 text-[color:var(--color-amber)]" />
            <span className="flex flex-col leading-none">
              <span className="font-display text-lg tracking-[0.3em]">MARIPOSA</span>
              <span className="text-[0.6rem] tracking-[0.4em]" style={{ color: "color-mix(in oklab, var(--color-ivory) 60%, transparent)" }}>RESTAURANT</span>
            </span>
          </Link>

          <nav className="flex items-center gap-5 md:gap-7">
            <Link href="/" target="_blank" rel="noopener noreferrer" className="text-xs uppercase tracking-[0.2em] transition-colors hover:text-[color:var(--color-amber)]">
              Home
            </Link>
            <button type="button" onClick={() => setReserveOpen(true)} className="text-xs uppercase tracking-[0.2em] transition-colors hover:text-[color:var(--color-amber)]">
              Reservation
            </button>
            <span className="hidden items-center gap-3 sm:flex" style={{ color: "color-mix(in oklab, var(--color-ivory) 70%, transparent)" }}>
              {content.social?.facebook ? (
                <a href={content.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="transition-colors hover:text-[color:var(--color-amber)]"><Facebook className="h-4 w-4" /></a>
              ) : null}
              {content.social?.instagram ? (
                <a href={content.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="transition-colors hover:text-[color:var(--color-amber)]"><Instagram className="h-4 w-4" /></a>
              ) : null}
              {content.whatsapp ? (
                <a href={content.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="transition-colors hover:text-[color:var(--color-amber)]"><MessageCircle className="h-4 w-4" /></a>
              ) : null}
            </span>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-10 pt-16 text-center md:px-10 md:pt-24">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10" style={{ background: "radial-gradient(60% 55% at 50% 0%, color-mix(in oklab, var(--color-amber) 16%, transparent), transparent 70%)" }} />
        <p className="text-xs uppercase tracking-[0.35em]" style={{ color: "var(--color-amber-deep)" }}>
          Mariposa · Seasonal Kitchen
        </p>
        <h1 className="font-display mt-5" style={{ fontSize: "var(--text-4xl)", lineHeight: 1.02 }}>The Menu</h1>
        <p className="mx-auto mt-6 max-w-xl text-pretty" style={{ color: MUTED }}>
          Mediterranean plates built from the garden out. Tap any dish for photos, a
          360° spin, the price, and what our guests are saying.
        </p>
        <span className="mx-auto mt-8 block h-px w-16" style={{ background: "var(--color-amber-deep)" }} />
      </section>

      {/* Category nav — pills on desktop, hamburger sheet on phones */}
      <CategoryNav sections={sections} active={active} onSelect={jump} />

      {/* Sections */}
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-8 md:px-10">
        <div className="flex flex-col gap-20">
          {sections.map((section) => (
            <section key={section.title} ref={(el) => { refs.current[section.title] = el; }} style={{ scrollMarginTop: "9rem" }}>
              <div className="flex items-end justify-between border-b pb-4" style={{ borderColor: LINE }}>
                <h2 className="font-display flex items-baseline gap-3" style={{ fontSize: "var(--text-2xl)" }}>
                  {section.title}
                  {section.subtitle ? <span className="text-base font-normal italic" style={{ color: MUTED }}>{section.subtitle}</span> : null}
                </h2>
                <span className="text-xs uppercase tracking-[0.2em]" style={{ color: MUTED }}>{section.items.length} dishes</span>
              </div>

              <ul className="mt-8 grid gap-5 md:grid-cols-2">
                {section.items.map((item) => (
                  <li key={item.name}>
                    <DishCard item={item} onClick={() => setDish(item)} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t px-6 py-10 text-center" style={{ borderColor: LINE }}>
        <p className="text-xs uppercase tracking-[0.25em]" style={{ color: MUTED }}>
          {content.legalName ?? "Mariposa Restaurant"} · Open daily {content.hours?.time ?? "13:00 – 24:00"}
        </p>
        {legal ? (
          <div className="mx-auto mt-6 max-w-2xl space-y-1.5">
            {legal.split("\n").map((line, i) => (
              <p key={i} className="text-[0.7rem] leading-relaxed" style={{ color: MUTED }}>
                {line}
              </p>
            ))}
          </div>
        ) : null}
      </footer>

      {dish ? (
        <DishModal dish={dish} onClose={() => setDish(null)} onReserve={() => { setDish(null); setReserveOpen(true); }} />
      ) : null}
      {reserveOpen ? <ReservationModal content={content} onClose={() => setReserveOpen(false)} /> : null}
    </div>
  );

  function DishCard({ item, onClick }: { item: MenuItem; onClick: () => void }) {
    const tags = [
      item.vegan ? "Vegan" : item.vegetarian ? "Vegetarian" : null,
      item.glutenFree ? "Gluten-Free" : null,
    ].filter(Boolean) as string[];
    return (
      <button
        type="button"
        onClick={onClick}
        className="group flex w-full gap-4 rounded-xl border p-3 text-left transition-colors hover:border-[color:var(--color-amber)]"
        style={{ borderColor: LINE, background: SURFACE }}
      >
        <div className="relative aspect-square w-28 shrink-0 overflow-hidden rounded-lg md:w-32">
          {item.photo ? (
            <Image src={item.photo} alt={`${item.name} at Mariposa restaurant, Theologos, Rhodes`} fill sizes="8rem" className="object-cover transition-transform duration-500 group-hover:scale-105" />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center text-[0.6rem] uppercase tracking-[0.15em]"
              style={{
                backgroundImage: "repeating-linear-gradient(45deg, color-mix(in oklab, var(--color-olive) 14%, var(--color-surface)) 0 10px, color-mix(in oklab, var(--color-olive) 7%, var(--color-surface)) 10px 20px)",
                color: MUTED,
              }}
            >
              Dish photo
            </div>
          )}
          {item.spin && item.spin.length > 1 ? (
            <span className="absolute left-2 top-2 rounded-full px-2 py-0.5 text-[0.6rem]" style={{ background: "color-mix(in oklab, var(--color-ink) 70%, transparent)", color: "var(--color-ivory)" }}>360°</span>
          ) : null}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-display truncate" style={{ fontSize: "var(--text-lg)" }}>{item.name}</h3>
            {item.price ? <span className="font-display tabular-nums" style={{ color: "var(--color-amber-deep)" }}>€{item.price}</span> : null}
          </div>
          {item.description ? <p className="mt-1.5 line-clamp-2 text-sm" style={{ color: MUTED }}>{item.description}</p> : null}
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
            {tags.map((t) => (
              <span key={t} className="rounded-full px-2 py-0.5 text-[0.58rem] font-medium uppercase tracking-[0.1em]" style={{ background: "color-mix(in oklab, var(--color-olive) 16%, var(--color-surface))", color: "var(--color-amber-deep)" }}>{t}</span>
            ))}
            {item.rating ? <StarRating rating={item.rating} count={item.reviewCount} size={12} /> : null}
          </div>
        </div>
      </button>
    );
  }
}
