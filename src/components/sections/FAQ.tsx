"use client";

import { useState } from "react";
import { Reveal } from "@/components/Reveal";
import { IconQuestion } from "@/components/SectionIcon";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { FAQS } from "@/lib/faq";
import { COPY, type Copy } from "@/lib/copy";

/**
 * FAQ. Ten answer-first questions in an accessible disclosure accordion, with a
 * matching FAQPage JSON-LD so search engines and AI assistants can lift the
 * answers directly.
 *
 * Accessibility / discoverability:
 *  - Each question is a real <h3> wrapping a <button> that carries
 *    aria-expanded / aria-controls; the answer panel is a labelled region. The
 *    button is natively keyboard-operable (Enter / Space).
 *  - Every answer stays in the DOM whether open or closed (collapsed only by a
 *    CSS grid-rows height transition), so the full text is present in the served
 *    HTML for crawlers, not injected on click.
 */
export function FAQ({ copy = COPY.faq }: { copy?: Copy["faq"] }) {
  const reducedMotion = useReducedMotion();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <section
      id="faq"
      className="section-white border-t"
      style={{ borderColor: "var(--color-line)", paddingBlock: "var(--space-section)" }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="mx-auto max-w-3xl px-6 md:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal as="p" className="eyebrow flex items-center justify-center gap-2.5 text-amber-deep">
            <IconQuestion className="h-[1.15rem] w-[1.15rem]" />
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
          <Reveal as="p" delay={140} className="mx-auto mt-7 max-w-md text-pretty text-ink-dim">
            {copy.intro}
          </Reveal>
        </div>

        <div
          className="mt-14 border-t"
          style={{ borderColor: "var(--color-line)" }}
        >
          {FAQS.map((item, i) => {
            const open = openIndex === i;
            const qId = `faq-q-${i}`;
            const panelId = `faq-panel-${i}`;
            return (
              <div key={item.q} className="border-b" style={{ borderColor: "var(--color-line)" }}>
                <h3 className="m-0">
                  <button
                    type="button"
                    id={qId}
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(open ? null : i)}
                    className="font-display flex w-full items-center justify-between gap-6 py-5 text-left text-ink transition-colors duration-200 hover:text-[color:var(--color-amber-deep)]"
                    style={{ fontSize: "var(--text-lg)" }}
                  >
                    <span>{item.q}</span>
                    <span
                      aria-hidden
                      className="relative h-4 w-4 shrink-0 text-amber-deep"
                      style={{
                        transform: open ? "rotate(180deg)" : "rotate(0deg)",
                        transition: reducedMotion ? "none" : "transform 300ms cubic-bezier(0.16,1,0.3,1)",
                      }}
                    >
                      {/* horizontal bar (always) + vertical bar that hides when open → plus/minus */}
                      <span className="absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 bg-current" />
                      <span
                        className="absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 bg-current"
                        style={{
                          opacity: open ? 0 : 1,
                          transition: reducedMotion ? "none" : "opacity 300ms ease",
                        }}
                      />
                    </span>
                  </button>
                </h3>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={qId}
                  style={{
                    display: "grid",
                    gridTemplateRows: open ? "1fr" : "0fr",
                    transition: reducedMotion ? "none" : "grid-template-rows 320ms cubic-bezier(0.16,1,0.3,1)",
                  }}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-prose text-pretty pb-6 text-ink-dim">{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
