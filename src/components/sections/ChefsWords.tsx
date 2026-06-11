import { Reveal } from "@/components/Reveal";
import { IconChefMark } from "@/components/SectionIcon";

/**
 * Chef's Words. Two voices, one kitchen. Despoina's founding philosophy flows
 * into Salvatore's continuation: Sicily meeting Rhodes, pasta and bread made in
 * house each morning, a small menu changed often. Large clip-path quote reveals,
 * alternating alignment, a thin amber rule between the two voices.
 */
export function ChefsWords() {
  return (
    <section
      id="chefs-words"
      className="section-beige-soft relative overflow-hidden border-t"
      style={{ borderColor: "var(--color-line)", paddingBlock: "var(--space-section)" }}
    >
      <div className="mx-auto max-w-5xl px-6 md:px-10">
        <Reveal as="p" className="eyebrow flex items-center gap-2.5 text-amber-deep">
          <IconChefMark className="h-[1.15rem] w-[1.15rem]" />
          Chef&apos;s Words
        </Reveal>
        <Reveal
          as="h2"
          variant="clip-reveal"
          className="font-display mt-5 max-w-3xl text-balance"
          style={{ fontSize: "var(--text-3xl)", lineHeight: 1.04 }}
        >
          Two voices, one kitchen
        </Reveal>

        {/* Despoina — left-aligned founding voice */}
        <figure className="mt-20 max-w-3xl">
          <blockquote
            className="font-display text-balance hanging-quote"
            style={{ fontSize: "var(--text-2xl)", lineHeight: 1.18 }}
          >
            <Reveal variant="clip-reveal" as="span" className="block">
              Good food begins in respect.
            </Reveal>
            <Reveal variant="clip-reveal" as="span" delay={120} className="block">
              For the ingredient, and for the
            </Reveal>
            <Reveal variant="clip-reveal" as="span" delay={240} className="block italic">
              <span className="text-gold">land that gives it.</span>
            </Reveal>
          </blockquote>
          <Reveal as="p" delay={200} className="mt-7 max-w-xl text-pretty text-ink-dim">
            Despoina draws the vegetables from the beds beside the terrace, picked
            the morning they reach your plate, and cooks them the way she cooks at
            home. The menu, the dishes and the look of the room all began with her.
          </Reveal>
          <figcaption className="eyebrow mt-6 text-amber-deep">
            Despoina · Founder &amp; Chef
          </figcaption>
        </figure>

        {/* Thin rule between the two voices */}
        <div className="my-16 flex justify-center md:my-20">
          <span className="rule-leaf" aria-hidden />
        </div>

        {/* Salvatore — right-aligned continuation */}
        <figure className="ml-auto max-w-3xl text-right">
          <blockquote
            className="font-display text-balance hanging-quote"
            style={{ fontSize: "var(--text-2xl)", lineHeight: 1.18 }}
          >
            <Reveal variant="clip-reveal" as="span" className="block">
              I keep the menu small and
            </Reveal>
            <Reveal variant="clip-reveal" as="span" delay={120} className="block">
              change it often, so every plate
            </Reveal>
            <Reveal variant="clip-reveal" as="span" delay={240} className="block italic">
              <span className="text-gold">is cooked fresh.</span>
            </Reveal>
          </blockquote>
          <Reveal as="p" delay={200} className="ml-auto mt-7 max-w-xl text-pretty text-ink-dim">
            Salvatore came from Sicily and now carries Despoina&apos;s kitchen
            forward. The pasta is rolled by hand and the bread leaves his oven each
            morning. Sicily meets Rhodes on one table, and the result is a handful
            of flavors you rarely find twice.
          </Reveal>
          <figcaption className="eyebrow mt-6 text-amber-deep">
            Salvatore · Chef, Pasta &amp; Bread
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
