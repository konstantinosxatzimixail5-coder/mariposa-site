import { Phone, MessageCircle } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { ButterflyMark } from "@/components/ButterflyMark";
import { ReservationForm } from "@/components/ReservationForm";
import { BRAND, type SiteContent } from "@/lib/brand";
import { COPY, type Copy } from "@/lib/copy";
import { RESERVATION_FORM_ENABLED, RESERVATION_WHATSAPP } from "@/lib/flags";

// Prefilled WhatsApp request so guests send a structured booking the moment they
// tap through — and the restaurant's chat becomes the record of who asked for what.
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hello Mariposa! I'd like to request a table.\n\nName:\nDate:\nTime:\nGuests:\nOccasion (optional):",
);
const WHATSAPP_HREF = `https://wa.me/${RESERVATION_WHATSAPP}?text=${WHATSAPP_MESSAGE}`;

/**
 * Reservation. The conversion moment — a real booking form wired to
 * /api/reservations, with phone and WhatsApp kept as the always-live direct
 * path beneath it.
 */
export function Reservation({
  content = BRAND,
  copy = COPY.reservation,
}: {
  content?: SiteContent;
  copy?: Copy["reservation"];
}) {
  return (
    <section
      id="reserve"
      className="section-beige-soft relative overflow-hidden border-t"
      style={{ borderColor: "var(--color-line)", paddingBlock: "var(--space-section)" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(70% 60% at 50% 0%, color-mix(in oklab, var(--color-aegean) 40%, transparent), transparent 70%)",
        }}
      />

      <div className="mx-auto flex max-w-xl flex-col items-center px-6 text-center md:px-10">
        <Reveal variant="reveal">
          <ButterflyMark className="h-24 w-24 text-[color:var(--color-amber-deep)] md:h-28 md:w-28" />
        </Reveal>
        <Reveal as="h2" variant="clip-reveal" className="font-display mt-8" style={{ fontSize: "var(--text-4xl)" }}>
          {copy.heading}
        </Reveal>
        <Reveal as="p" delay={140} className="mt-6 max-w-md text-pretty text-ink-dim">
          {copy.intro}
        </Reveal>

        <Reveal as="div" delay={260} className="mt-10 w-full">
          {RESERVATION_FORM_ENABLED ? (
            <>
              <ReservationForm occasions={content.occasions} />

              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm">
                <span className="text-muted">{copy.reachUsDirectly}</span>
                <a
                  href={content.phoneHref}
                  className="inline-flex items-center gap-2 text-ink-dim transition-colors duration-200 hover:text-[color:var(--color-amber-deep)]"
                >
                  <Phone className="h-4 w-4" aria-hidden />
                  {content.phone}
                </a>
                <a
                  href={content.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-ink-dim transition-colors duration-200 hover:text-[color:var(--color-amber-deep)]"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden />
                  {copy.whatsappLabel}
                </a>
              </div>
            </>
          ) : (
            // Reservations are taken on WhatsApp for now (the form is hidden).
            <div className="flex flex-col items-center gap-5">
              <a
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full max-w-sm items-center justify-center gap-2.5 rounded-full px-8 py-4 font-medium text-[color:var(--color-on-accent)] transition-[background-color] duration-200 hover:bg-amber-bright"
                style={{ background: "var(--color-amber)" }}
              >
                <MessageCircle className="h-5 w-5" aria-hidden />
                Reserve on WhatsApp
              </a>
              <p className="text-sm text-muted">
                Prefer to call?{" "}
                <a
                  href={content.phoneHref}
                  className="inline-flex items-center gap-1.5 text-ink-dim transition-colors duration-200 hover:text-[color:var(--color-amber-deep)]"
                >
                  <Phone className="h-4 w-4" aria-hidden />
                  {content.phone}
                </a>
              </p>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
