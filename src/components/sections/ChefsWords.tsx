import { Reveal } from "@/components/Reveal";
import { IconChefMark } from "@/components/SectionIcon";
import { COPY, type Copy } from "@/lib/copy";

/**
 * Chef's Words. Two voices, one kitchen. Despoina's founding philosophy flows
 * into Salvatore's continuation: Sicily meeting Rhodes, pasta and bread made in
 * house each morning, a small menu changed often. Large clip-path quote reveals,
 * alternating alignment, a thin amber rule between the two voices.
 */
export function ChefsWords({ copy = COPY.chefsWords }: { copy?: Copy["chefsWords"] }) {
  return (
    <section
      id="chefs-words"
      className="section-beige-soft relative overflow-hidden border-t"
      style={{ borderColor: "var(--color-line)", paddingBlock: "var(--space-section)" }}
    >
      <div className="mx-auto max-w-5xl px-6 md:px-10">
        <Reveal as="p" className="eyebrow flex items-center gap-2.5 text-amber-deep">
          <IconChefMark className="h-[1.15rem] w-[1.15rem]" />
          {copy.eyebrow}
        </Reveal>
        <Reveal
          as="h2"
          variant="clip-reveal"
          className="font-display mt-5 max-w-3xl text-balance"
          style={{ fontSize: "var(--text-3xl)", lineHeight: 1.04 }}
        >
          {copy.heading}
        </Reveal>

        {/* Despoina — left-aligned founding voice */}
        <figure className="mt-20 max-w-3xl">
          <blockquote
            className="font-display text-balance hanging-quote"
            style={{ fontSize: "var(--text-2xl)", lineHeight: 1.18 }}
          >
            <Reveal variant="clip-reveal" as="span" className="block">
              {copy.despoinaQuoteLine1}
            </Reveal>
            <Reveal variant="clip-reveal" as="span" delay={120} className="block">
              {copy.despoinaQuoteLine2}
            </Reveal>
            <Reveal variant="clip-reveal" as="span" delay={240} className="block italic">
              <span className="text-gold">{copy.despoinaQuoteLine3}</span>
            </Reveal>
          </blockquote>
          <Reveal as="p" delay={200} className="mt-7 max-w-xl text-pretty text-ink-dim">
            {copy.despoinaBody}
          </Reveal>
          <figcaption className="eyebrow mt-6 text-amber-deep">
            {copy.despoinaCaption}
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
              {copy.salvatoreQuoteLine1}
            </Reveal>
            <Reveal variant="clip-reveal" as="span" delay={120} className="block">
              {copy.salvatoreQuoteLine2}
            </Reveal>
            <Reveal variant="clip-reveal" as="span" delay={240} className="block italic">
              <span className="text-gold">{copy.salvatoreQuoteLine3}</span>
            </Reveal>
          </blockquote>
          <Reveal as="p" delay={200} className="ml-auto mt-7 max-w-xl text-pretty text-ink-dim">
            {copy.salvatoreBody}
          </Reveal>
          <figcaption className="eyebrow mt-6 text-amber-deep">
            {copy.salvatoreCaption}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
