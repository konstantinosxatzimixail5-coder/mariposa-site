import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { Parallax } from "@/components/Parallax";
import { IconSprig } from "@/components/SectionIcon";
import { BRAND } from "@/lib/brand";
import { COPY, type Copy } from "@/lib/copy";

/**
 * Garden & Philosophy. The three things that set Mariposa apart, each given its
 * own visual beat: the garden steps from the table, the small menu changed
 * often, and the setting under the vines. A lead editorial composition, then a
 * three-up of the differentiators. The ambient light wash is the always-on
 * fallback beneath the site-wide atmosphere layer.
 */

// Image and alt for each beat stay static (art direction); the label/title/body
// copy is editable and supplied via `copy.beats`, zipped in order below.
const BEAT_MEDIA = [
  { image: BRAND.gallery[2], alt: "The planted beds running alongside the dining terrace" },
  { image: BRAND.gallery[3], alt: "A dish being finished in the Mariposa kitchen" },
  { image: BRAND.gallery[4], alt: "The vine-shaded terrace in late-afternoon light" },
] as const;

export function Garden({ copy = COPY.garden }: { copy?: Copy["garden"] }) {
  return (
    <section
      id="garden"
      className="section-beige relative overflow-hidden border-t"
      style={{ borderColor: "var(--color-line)", paddingBlock: "var(--space-section)" }}
    >
      {/* Ambient warm light wash — a soft sunlit bloom over the beige ground. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20"
        style={{
          background:
            "radial-gradient(60% 50% at 80% 20%, color-mix(in oklab, var(--color-amber) 14%, transparent), transparent 70%)",
        }}
      />

      <div className="mx-auto max-w-7xl px-6 md:px-10">
        {/* Lead composition */}
        <div className="grid items-center gap-12 md:grid-cols-12">
          <div className="md:col-span-6">
            <Reveal as="p" className="eyebrow flex items-center gap-2.5 text-amber-deep">
              <IconSprig className="h-[1.15rem] w-[1.15rem]" />
              {copy.eyebrow}
            </Reveal>
            <Reveal
              as="h2"
              variant="clip-reveal"
              className="font-display mt-5 text-balance"
              style={{ fontSize: "var(--text-4xl)", lineHeight: 1.04 }}
            >
              {copy.heading}
            </Reveal>
            <Reveal as="p" delay={140} className="mt-7 max-w-md text-pretty text-lg text-ink-dim">
              {copy.intro}
            </Reveal>
          </div>

          <div className="md:col-span-6">
            <div className="grid grid-cols-2 gap-4">
              <Parallax speed={-0.18}>
                <div className="relative aspect-[3/4] overflow-hidden rounded-sm">
                  <Image
                    src={BRAND.gallery[0]}
                    alt="Detail of the garden terrace and its planted beds"
                    fill
                    sizes="(min-width: 768px) 25vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </Parallax>
              <Parallax speed={0.14}>
                <div className="relative mt-10 aspect-[3/4] overflow-hidden rounded-sm">
                  <Image
                    src={BRAND.gallery[1]}
                    alt="The vine-shaded dining terrace in late-afternoon light"
                    fill
                    sizes="(min-width: 768px) 25vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </Parallax>
            </div>
          </div>
        </div>

        {/* The three differentiators, each its own beat */}
        <div className="mt-24 grid gap-10 md:mt-32 md:grid-cols-3 md:gap-8">
          {copy.beats.map((beat, i) => (
            <Reveal key={beat.label} variant="reveal" delay={i * 90} as="article">
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
                <Image
                  src={BEAT_MEDIA[i]?.image ?? BRAND.gallery[2]}
                  alt={BEAT_MEDIA[i]?.alt ?? ""}
                  fill
                  sizes="(min-width: 768px) 30vw, 100vw"
                  className="object-cover"
                />
              </div>
              <p className="eyebrow mt-6 text-amber-deep">{beat.label}</p>
              <h3 className="font-display mt-2" style={{ fontSize: "var(--text-xl)" }}>
                {beat.title}
              </h3>
              <p className="mt-3 text-pretty text-ink-dim">{beat.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
