import { Phone, MessageCircle } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { ButterflyMark } from "@/components/ButterflyMark";
import { ReservationForm } from "@/components/ReservationForm";
import { BRAND } from "@/lib/brand";

/**
 * Reservation. The conversion moment — a real booking form wired to
 * /api/reservations, with phone and WhatsApp kept as the always-live direct
 * path beneath it.
 */
export function Reservation() {
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
          Reserve your table
        </Reveal>
        <Reveal as="p" delay={140} className="mt-6 max-w-md text-pretty text-ink-dim">
          Lunch beneath the vines or dinner over the Aegean at dusk. We hold only
          a handful of covers each service, so we gently suggest reserving ahead.
        </Reveal>

        <Reveal as="div" delay={260} className="mt-10 w-full">
          <ReservationForm />

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm">
            <span className="text-muted">Or reach us directly</span>
            <a
              href={BRAND.phoneHref}
              className="inline-flex items-center gap-2 text-ink-dim transition-colors duration-200 hover:text-[color:var(--color-amber-deep)]"
            >
              <Phone className="h-4 w-4" aria-hidden />
              {BRAND.phone}
            </a>
            <a
              href={BRAND.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-ink-dim transition-colors duration-200 hover:text-[color:var(--color-amber-deep)]"
            >
              <MessageCircle className="h-4 w-4" aria-hidden />
              WhatsApp
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
