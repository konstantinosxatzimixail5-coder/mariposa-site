"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { TiltCard } from "@/components/TiltCard";
import { DishDetail } from "@/components/DishDetail";
import { IconCloche } from "@/components/SectionIcon";
import { BRAND, type SiteContent } from "@/lib/brand";
import { COPY, type Copy } from "@/lib/copy";
import { MENU_PUBLISHED } from "@/lib/flags";

type ContentDish = SiteContent["dishes"][number];

/**
 * Menu · Signature Plates. The menu changes with the garden and the day, so the
 * page leads with the recurring favourites guests ask for by name. Each plate is
 * a clickable card that opens a detail view — photograph, produced 360°/film
 * slots, the real Tripadvisor pull-quote and a brand-voice description. A closing
 * box carries guests to the full, daily-changing menu.
 */
export function Dishes({
  content = BRAND,
  copy = COPY.dishes,
}: {
  content?: SiteContent;
  copy?: Copy["dishes"];
}) {
  const [active, setActive] = useState<ContentDish | null>(null);

  return (
    <section
      id="dishes"
      className="section-white relative overflow-hidden border-t"
      style={{ borderColor: "var(--color-line)", paddingBlock: "var(--space-section)" }}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="max-w-2xl">
          <Reveal as="p" className="eyebrow flex items-center gap-2.5 text-amber-deep">
            <IconCloche className="h-[1.15rem] w-[1.15rem]" />
            {copy.eyebrow}
          </Reveal>
          <Reveal
            as="h2"
            variant="clip-reveal"
            className="font-display mt-5 text-balance"
            style={{ fontSize: "var(--text-3xl)", lineHeight: 1.04 }}
          >
            {copy.heading}
          </Reveal>
          <Reveal as="p" delay={140} className="mt-7 max-w-xl text-pretty text-lg text-ink-dim">
            {copy.intro}
          </Reveal>
        </div>

        <ul className="mt-16 grid grid-cols-2 gap-5 md:grid-cols-3 md:gap-6 lg:grid-cols-3">
          {content.dishes.map((dish, i) => (
            <Reveal key={dish.slug} variant="reveal" delay={i * 70} as="li">
              <button
                type="button"
                onClick={() => setActive(dish)}
                aria-haspopup="dialog"
                className="group block w-full text-left"
              >
                <TiltCard className="relative aspect-[4/5] overflow-hidden rounded-sm">
                  <Image
                    src={dish.image}
                    alt={`${dish.name} at Mariposa restaurant in Theologos, Rhodes — ${dish.tagline}`}
                    fill
                    quality={65}
                    sizes="(min-width: 1280px) 384px, (min-width: 768px) 30vw, 45vw"
                    className="object-cover transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.05]"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      background:
                        "linear-gradient(to top, color-mix(in oklab, var(--color-ink) 60%, transparent) 0%, transparent 55%)",
                    }}
                  />
                  <span
                    aria-hidden
                    className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 text-sm font-medium text-[color:var(--color-ivory)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  >
                    {copy.viewPlate} <ArrowUpRight className="h-4 w-4" />
                  </span>
                </TiltCard>
                <h3 className="font-display mt-4" style={{ fontSize: "var(--text-lg)" }}>
                  {dish.name}
                </h3>
                <p className="mt-1.5 text-pretty text-sm text-ink-dim">{dish.tagline}</p>
              </button>
            </Reveal>
          ))}
        </ul>

        {/* Discover the full, daily-changing menu — hidden while MENU_PUBLISHED is off. */}
        {MENU_PUBLISHED ? (
        <Reveal as="div" delay={120} className="mt-16 md:mt-20">
          <Link
            href="/menu"
            className="group flex flex-col items-start justify-between gap-5 rounded-lg border p-8 transition-colors duration-300 hover:bg-[color-mix(in_oklab,var(--color-amber)_8%,var(--color-surface))] md:flex-row md:items-center md:p-10"
            style={{ borderColor: "var(--color-line)", background: "var(--color-surface)" }}
          >
            <div>
              <h3 className="font-display" style={{ fontSize: "var(--text-xl)" }}>
                {copy.fullMenuHeading}
              </h3>
              <p className="mt-2 max-w-xl text-pretty text-ink-dim">
                {copy.fullMenuBody}
              </p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-7 py-3.5 font-medium text-[color:var(--color-on-accent)] transition-[background-color] duration-200 group-hover:bg-amber-bright" style={{ background: "var(--color-amber)" }}>
              {copy.fullMenuCta} <ArrowUpRight className="h-4 w-4" />
            </span>
          </Link>
        </Reveal>
        ) : null}
      </div>

      {active ? <DishDetail dish={active} onClose={() => setActive(null)} /> : null}
    </section>
  );
}
