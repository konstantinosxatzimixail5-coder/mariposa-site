"use client";

import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { Parallax } from "@/components/Parallax";
import { IconFlute } from "@/components/SectionIcon";
import { BRAND, type SiteContent } from "@/lib/brand";

/**
 * Celebrations & Private Events. Mariposa as the setting for the marked days:
 * birthdays, anniversaries, proposals, intimate weddings up to sixty, and
 * private corporate dinners. A cinematic full-bleed cover opens it, then a quiet
 * grid of the occasions, each one a button that pre-fills the reservation form's
 * occasion field and carries the guest down to it.
 *
 * The pre-fill rides a CustomEvent (`mariposa:occasion`) that ReservationForm
 * listens for; no router/query plumbing, and it composes cleanly with Lenis.
 */

function planEvening(occasion: string) {
  window.dispatchEvent(new CustomEvent("mariposa:occasion", { detail: occasion }));
}

export function Celebrations({ content = BRAND }: { content?: SiteContent }) {
  return (
    <section
      id="celebrations"
      className="relative overflow-hidden border-t"
      style={{ borderColor: "var(--color-line)" }}
    >
      {/* Cinematic full-bleed cover */}
      <div className="relative h-[68svh] min-h-[28rem] w-full overflow-hidden">
        <Parallax speed={-0.2} className="absolute inset-0">
          <div className="relative h-[120%] w-full">
            <Image
              src={BRAND.gallery[8]}
              alt="An evening laid out beneath the vines at Mariposa"
              fill
              priority={false}
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </Parallax>
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, var(--color-bg) 0%, color-mix(in oklab, var(--color-ink) 30%, transparent) 14%, color-mix(in oklab, var(--color-ink) 50%, transparent) 50%, color-mix(in oklab, var(--color-ink) 30%, transparent) 100%)",
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <Reveal as="p" className="eyebrow flex items-center justify-center gap-2.5 text-amber">
            <IconFlute className="h-[1.15rem] w-[1.15rem]" />
            Celebrations &amp; Private Events
          </Reveal>
          <Reveal
            as="h2"
            variant="clip-reveal"
            className="font-display mt-5 max-w-3xl text-balance text-ivory"
            style={{ fontSize: "var(--text-4xl)", lineHeight: 1.04 }}
          >
            For the evenings that matter
          </Reveal>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-[var(--space-section)] pt-16 md:px-10 md:pt-20">
        <div className="grid gap-px overflow-hidden rounded-sm border md:grid-cols-2" style={{ borderColor: "var(--color-line)", background: "var(--color-line)" }}>
          {content.occasions.map((occasion) => (
            <button
              key={occasion.value}
              type="button"
              onClick={() => planEvening(occasion.value)}
              className="group flex flex-col items-start gap-3 p-8 text-left transition-colors duration-300 hover:bg-[color-mix(in_oklab,var(--color-amber)_10%,var(--color-surface))] focus-visible:bg-[color-mix(in_oklab,var(--color-amber)_10%,var(--color-surface))] md:p-10"
              style={{ background: "var(--color-surface)" }}
            >
              <h3 className="font-display transition-colors duration-300 group-hover:text-[color:var(--color-amber-deep)]" style={{ fontSize: "var(--text-xl)" }}>
                {occasion.title}
              </h3>
              <p className="max-w-md text-pretty text-ink-dim">{occasion.line}</p>
              <span className="eyebrow mt-2 text-muted transition-colors duration-300 group-hover:text-[color:var(--color-amber-deep)]">
                Plan this evening →
              </span>
            </button>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center text-center">
          <a
            href="#reserve"
            onClick={() => planEvening("other")}
            className="rounded-full px-8 py-4 font-medium text-[color:var(--color-on-accent)] transition-[background-color] duration-200 hover:bg-amber-bright"
            style={{ background: "var(--color-amber)" }}
          >
            Plan your evening with us
          </a>
          <p className="mt-5 max-w-md text-pretty text-sm text-muted">
            Tell us the occasion and a little of what you have in mind. Konstantin
            will take it from there.
          </p>
        </div>
      </div>
    </section>
  );
}
