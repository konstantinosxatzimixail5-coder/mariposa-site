"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { TiltCard } from "@/components/TiltCard";
import { DishDetail } from "@/components/DishDetail";
import { IconCloche } from "@/components/SectionIcon";
import { BRAND, type Dish } from "@/lib/brand";

/**
 * Menu · Signature Plates. The menu changes with the garden and the day, so the
 * page leads with the recurring favourites guests ask for by name. Each plate is
 * a clickable card that opens a detail view — photograph, produced 360°/film
 * slots, the real Tripadvisor pull-quote and a brand-voice description. A closing
 * box carries guests to the full, daily-changing menu.
 */
export function Dishes() {
  const [active, setActive] = useState<Dish | null>(null);

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
            Menu · Signature Plates
          </Reveal>
          <Reveal
            as="h2"
            variant="clip-reveal"
            className="font-display mt-5 text-balance"
            style={{ fontSize: "var(--text-3xl)", lineHeight: 1.04 }}
          >
            The plates guests ask for by name
          </Reveal>
          <Reveal as="p" delay={140} className="mt-7 max-w-xl text-pretty text-lg text-ink-dim">
            Our menu changes with the garden and the day; these are the plates
            guests ask for by name.
          </Reveal>
        </div>

        <ul className="mt-16 grid grid-cols-2 gap-5 md:grid-cols-3 md:gap-6 lg:grid-cols-5">
          {BRAND.dishes.map((dish, i) => (
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
                    alt={dish.name}
                    fill
                    sizes="(min-width: 1024px) 18vw, (min-width: 768px) 30vw, 45vw"
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
                    View plate <ArrowUpRight className="h-4 w-4" />
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

        {/* Discover the full, daily-changing menu */}
        <Reveal as="div" delay={120} className="mt-16 md:mt-20">
          <a
            href={BRAND.menuUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-start justify-between gap-5 rounded-lg border p-8 transition-colors duration-300 hover:bg-[color-mix(in_oklab,var(--color-amber)_8%,var(--color-surface))] md:flex-row md:items-center md:p-10"
            style={{ borderColor: "var(--color-line)", background: "var(--color-surface)" }}
          >
            <div>
              <h3 className="font-display" style={{ fontSize: "var(--text-xl)" }}>
                Discover our full menu
              </h3>
              <p className="mt-2 max-w-xl text-pretty text-ink-dim">
                The kitchen writes the day&apos;s menu around what the garden and
                the catch give. See everything on the table right now.
              </p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-7 py-3.5 font-medium text-[color:var(--color-on-accent)] transition-[background-color] duration-200 group-hover:bg-amber-bright" style={{ background: "var(--color-amber)" }}>
              View the menu <ArrowUpRight className="h-4 w-4" />
            </span>
          </a>
        </Reveal>
      </div>

      {active ? <DishDetail dish={active} onClose={() => setActive(null)} /> : null}
    </section>
  );
}
