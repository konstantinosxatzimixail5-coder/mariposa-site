import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { IconClock } from "@/components/SectionIcon";
import { BRAND } from "@/lib/brand";

/**
 * The Experience. The day at Mariposa told in its three services — breakfast as
 * the terrace wakes, lunch held long under the vines, dinner as the sun sets.
 * Each service is a circular plate cut-out above a small-caps label, the hours
 * set in hung serif numerals, and a single evocative line. No "open daily until
 * midnight"; the real rhythm, stated plainly and unhurried.
 */
export function Hours() {
  return (
    <section
      id="experience"
      className="section-white border-t"
      style={{ borderColor: "var(--color-line)", paddingBlock: "var(--space-section)" }}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal as="p" className="eyebrow flex items-center justify-center gap-2.5 text-amber-deep">
            <IconClock className="h-[1.15rem] w-[1.15rem]" />
            The Experience
          </Reveal>
          <Reveal
            as="h2"
            variant="clip-reveal"
            className="font-display mt-5 text-balance"
            style={{ fontSize: "var(--text-3xl)", lineHeight: 1.04 }}
          >
            One long, unhurried day
          </Reveal>
          <Reveal as="p" delay={140} className="mx-auto mt-7 max-w-md text-pretty text-ink-dim">
            The garden, the vines and the light shift through the hours, and the
            kitchen follows. We hold only a handful of covers each service, so we
            gently suggest reserving ahead.
          </Reveal>
        </div>

        <ol className="mt-20 grid gap-14 md:mt-24 md:grid-cols-3 md:gap-10">
          {BRAND.services.map((service, i) => (
            <Reveal
              key={service.label}
              variant="reveal"
              delay={i * 110}
              as="li"
              className="flex flex-col items-center text-center"
            >
              <div
                className="relative aspect-square w-44 overflow-hidden rounded-full border md:w-48"
                style={{ borderColor: "color-mix(in oklab, var(--color-amber-deep) 35%, transparent)" }}
              >
                <Image
                  src={service.image}
                  alt={`The Mariposa terrace during ${service.label.toLowerCase()} service`}
                  fill
                  sizes="(min-width: 768px) 12rem, 11rem"
                  className="object-cover"
                />
              </div>

              <p className="eyebrow mt-8 text-amber-deep">{service.label}</p>
              <p
                className="font-display mt-2 tabular-nums"
                style={{ fontSize: "var(--text-2xl)", letterSpacing: "-0.01em" }}
              >
                {service.time}
              </p>
              <p className="mt-4 max-w-[15rem] text-pretty text-sm text-ink-dim">{service.line}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
