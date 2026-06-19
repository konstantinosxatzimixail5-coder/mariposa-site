import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { ButterflyMark } from "@/components/ButterflyMark";
import { Footer } from "@/components/sections/Footer";
import { IconCloche } from "@/components/SectionIcon";
import { getContent, getMenu } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "The Mariposa menu — Mediterranean cooking from our own garden and the day's catch, served beneath the vines of Theologos, Rhodes.",
  alternates: { canonical: "/menu" },
};

export default async function MenuPage() {
  const [content, menu] = await Promise.all([getContent(), getMenu()]);

  return (
    <>
      {/* Minimal branded header — wordmark home, reservation CTA */}
      <header
        className="sticky top-0 z-50 border-b backdrop-blur"
        style={{
          borderColor: "var(--color-line)",
          background: "color-mix(in oklab, var(--color-bg) 86%, transparent)",
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
          <Link href="/" className="flex items-center gap-2.5" aria-label={`${content.name}, home`}>
            <ButterflyMark className="h-7 w-7 text-[color:var(--color-amber-deep)]" />
            <span className="font-display text-lg tracking-tight">{content.name}</span>
          </Link>
          <Link
            href="/#reserve"
            className="rounded-full px-5 py-2.5 text-sm font-medium text-[color:var(--color-on-accent)] transition-[background-color] duration-200 hover:bg-amber-bright"
            style={{ background: "var(--color-amber)" }}
          >
            Reserve a table
          </Link>
        </div>
      </header>

      <main id="main" className="section-white">
        {/* Header */}
        <section
          className="border-b"
          style={{ borderColor: "var(--color-line)", paddingBlock: "var(--space-section)" }}
        >
          <div className="mx-auto max-w-3xl px-6 text-center md:px-10">
            <Reveal as="p" className="eyebrow flex items-center justify-center gap-2.5 text-amber-deep">
              <IconCloche className="h-[1.15rem] w-[1.15rem]" />
              The Menu
            </Reveal>
            <Reveal
              as="h1"
              variant="clip-reveal"
              className="font-display mt-5 text-balance"
              style={{ fontSize: "var(--text-4xl)", lineHeight: 1.04 }}
            >
              Grown here, cooked here
            </Reveal>
            <Reveal as="p" delay={140} className="mx-auto mt-7 max-w-xl text-pretty text-lg text-ink-dim">
              Our menu follows the garden and the day&apos;s catch, so plates come
              and go with the season. These are the dishes our guests return for —
              {content.cuisine ? ` ${content.cuisine.toLowerCase()}` : " Mediterranean"} at heart, cooked with what the morning brings.
            </Reveal>
          </div>
        </section>

        {/* Sections */}
        <div className="mx-auto max-w-3xl px-6 md:px-10" style={{ paddingBlock: "var(--space-section)" }}>
          <div className="flex flex-col gap-16 md:gap-24">
            {menu.map((section, s) => (
              <Reveal key={section.title} as="section" variant="reveal" delay={s * 80}>
                <h2
                  className="font-display flex items-baseline gap-3 border-b pb-4 text-amber-deep"
                  style={{ fontSize: "var(--text-xl)", borderColor: "var(--color-line)" }}
                >
                  {section.title}
                  {section.subtitle ? (
                    <span className="text-base font-normal italic text-muted">{section.subtitle}</span>
                  ) : null}
                </h2>
                <ul className="mt-8 flex flex-col gap-8">
                  {section.items.map((item) => (
                    <li key={item.name}>
                      <div className="flex items-baseline justify-between gap-4">
                        <h3 className="font-display flex flex-wrap items-center gap-2.5" style={{ fontSize: "var(--text-lg)" }}>
                          {item.name}
                          {item.vegan ? <Badge>Vegan</Badge> : item.vegetarian ? <Badge>Veg</Badge> : null}
                          {item.glutenFree ? <Badge>GF</Badge> : null}
                        </h3>
                        {item.price ? (
                          <span
                            aria-hidden
                            className="mx-3 h-px flex-1 self-center"
                            style={{ background: "var(--color-line)" }}
                          />
                        ) : null}
                        {item.price ? (
                          <span className="font-display tabular-nums text-ink" style={{ fontSize: "var(--text-lg)" }}>
                            {/^\d/.test(item.price) ? `€${item.price}` : item.price}
                          </span>
                        ) : null}
                      </div>
                      {item.description ? (
                        <p className="mt-2 max-w-prose text-pretty text-ink-dim">{item.description}</p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>

          <Reveal as="p" delay={120} className="mt-20 text-center text-sm text-muted">
            Dishes change with the season and availability. Tell us about allergies
            or dietary needs when you book and the kitchen will look after you.
          </Reveal>
        </div>
      </main>

      <Footer content={content} />
    </>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="rounded-full px-2 py-0.5 text-[0.62rem] font-medium uppercase tracking-[0.12em] text-amber-deep"
      style={{ background: "color-mix(in oklab, var(--color-olive) 16%, transparent)" }}
    >
      {children}
    </span>
  );
}
