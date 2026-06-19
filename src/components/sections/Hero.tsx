import { Reveal } from "@/components/Reveal";
import { Parallax } from "@/components/Parallax";
import { ButterflyMark } from "@/components/ButterflyMark";
import { HeroVideo } from "@/components/HeroVideo";
import { BRAND, type SiteContent } from "@/lib/brand";
import { COPY, type Copy } from "@/lib/copy";

/**
 * Hero. Stacked background layers, back to front: the CSS gradient (-z-10, the
 * always-on fallback — warm amber/olive over ink, no sea), the restaurant's own
 * cinematic loop (-z-[8], skipped under reduced-motion / before load), and a CSS
 * dappled-light layer (-z-[4]) that drifts warm sun through a vine canopy across
 * the type. Copy clip-reveals on load over the top.
 */
export function Hero({
  content = BRAND,
  copy = COPY.hero,
}: {
  content?: SiteContent;
  copy?: Copy["hero"];
}) {
  return (
    <section
      id="top"
      // `isolate` gives the hero its own stacking context so its background
      // layers (the -z gradient and video) stay contained and paint above the
      // site-wide atmosphere wave (a fixed z-index:-1 layer). Without it the
      // hero's negative-z layers fall into the root context *behind* the wave,
      // and the cyan ripples bleed across the video. The wave is unaffected
      // everywhere else — it still shows through the other sections.
      // min-h-svh (small viewport height) keeps the whole hero in frame even
      // when mobile browser chrome is showing, so the copy is never cut off.
      // Fluid block padding centres the column on tall screens and gives it
      // breathing room (clearing the fixed nav) on short ones.
      className="relative isolate flex min-h-svh flex-col justify-center overflow-hidden px-6 py-28 sm:py-32 md:px-10"
    >
      <Parallax speed={-0.25} className="absolute inset-0 -z-10">
        <div
          aria-hidden
          className="h-[120%] w-full"
          style={{
            background:
              "radial-gradient(120% 90% at 70% 0%, color-mix(in oklab, var(--color-amber) 24%, transparent) 0%, transparent 55%), radial-gradient(90% 70% at 15% 100%, color-mix(in oklab, var(--color-olive) 40%, transparent) 0%, transparent 50%), var(--color-ink)",
          }}
        />
      </Parallax>

      {/* Pre-rendered Remotion light-field loop, between gradient and canopy. */}
      <HeroVideo />

      {/* Dappled light through leaves — drifts slowly over the type, behind it. */}
      <div aria-hidden className="absolute inset-0 -z-[4] overflow-hidden">
        <span className="leaf-light leaf-light--a" />
        <span className="leaf-light leaf-light--b" />
      </div>

      <div className="mx-auto w-full max-w-7xl">
        <Reveal
          variant="reveal"
          as="p"
          className="mb-6 flex items-center gap-3 text-sm uppercase tracking-[0.2em] text-amber sm:tracking-[0.25em]"
        >
          <ButterflyMark className="h-5 w-5" />
          {content.address.locality} · {content.address.region}
        </Reveal>

        <h1 className="font-display text-balance text-ivory" style={{ fontSize: "var(--text-display)" }}>
          {/* Names the entity in the page's one h1 for search/AI clarity without
              altering the visual line, which reads as the tagline. */}
          <span className="sr-only">{content.name} — </span>
          <Reveal variant="clip-reveal" as="span" className="block">
            {copy.headingLine1}
          </Reveal>
          <Reveal variant="clip-reveal" as="span" delay={140} className="block italic">
            <span className="text-gold-bright">{copy.headingLine2}</span>
          </Reveal>
        </h1>

        <Reveal
          variant="reveal"
          as="p"
          delay={260}
          className="mt-8 max-w-xl text-pretty text-lg text-ivory-dim"
        >
          {copy.intro}
        </Reveal>

        {/* CTAs stack full-width on phones, sit inline from sm up. */}
        <Reveal
          variant="reveal"
          as="div"
          delay={380}
          className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
        >
          <a
            href={content.reservationUrl}
            className="rounded-full px-7 py-3.5 text-center font-medium text-[color:var(--color-on-accent)] transition-[background-color] duration-200 hover:bg-amber-bright"
            style={{ background: "var(--color-amber)" }}
          >
            {copy.primaryCta}
          </a>
          <a
            href="#family"
            className="rounded-full border px-7 py-3.5 text-center font-medium text-ivory transition-colors duration-200 hover:border-amber hover:text-amber"
            style={{ borderColor: "var(--color-line)" }}
          >
            {copy.secondaryCta}
          </a>
        </Reveal>
      </div>

      <div className="mx-auto mt-12 flex w-full max-w-7xl items-center gap-3 text-xs uppercase tracking-[0.25em] text-ivory-dim sm:mt-16">
        <span
          className="h-px w-12 animate-pulse"
          style={{ background: "color-mix(in oklab, var(--color-ivory) 55%, transparent)" }}
        />
        {copy.scroll}
      </div>
    </section>
  );
}
