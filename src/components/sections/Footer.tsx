import { Instagram, Facebook, MessageCircle, MapPin, Phone } from "lucide-react";
import { ButterflyMark } from "@/components/ButterflyMark";
import { ContactForm } from "@/components/ContactForm";
import { BRAND, type Brand, type Service } from "@/lib/brand";

type FooterProps = { settings?: Brand; services?: Service[] };

export function Footer({ settings = BRAND, services = [...BRAND.services] }: FooterProps) {
  // Key-free OpenStreetMap embed around the venue (refine pin — notes/assets.md #6).
  const { lat, lng } = settings.geo;
  const MAP_SRC = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.02}%2C${lat - 0.012}%2C${lng + 0.02}%2C${lat + 0.012}&layer=mapnik&marker=${lat}%2C${lng}`;

  return (
    <footer
      id="location"
      className="border-t"
      style={{ background: "var(--color-bg-alt)", borderColor: "var(--color-line)" }}
    >
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-12 md:px-10">
        {/* Brand + address + hours */}
        <div className="md:col-span-4">
          <div className="flex items-center gap-3">
            <ButterflyMark className="h-9 w-9 text-[color:var(--color-amber-deep)]" />
            <span className="font-display" style={{ fontSize: "var(--text-xl)" }}>
              {settings.legalName}
            </span>
          </div>
          <address className="mt-6 not-italic text-ink-dim">
            <span className="flex items-start gap-2">
              <MapPin className="mt-1 h-4 w-4 shrink-0 text-[color:var(--color-amber-deep)]" aria-hidden />
              {settings.address.full}
            </span>
            <a
              href={settings.phoneHref}
              className="mt-3 inline-flex items-center gap-2 transition-colors duration-200 hover:text-[color:var(--color-amber-deep)]"
            >
              <Phone className="h-4 w-4 text-[color:var(--color-amber-deep)]" aria-hidden />
              {settings.phone}
            </a>
          </address>

          {/* Hours — the three real services */}
          <h2 className="mt-8 text-xs uppercase tracking-[0.3em] text-amber-deep">Hours</h2>
          <dl className="mt-4 space-y-2.5 text-sm">
            {services.map((service) => (
              <div key={service.label} className="flex justify-between gap-4">
                <dt className="text-ink">{service.label}</dt>
                <dd className="tabular-nums text-ink-dim">{service.time}</dd>
              </div>
            ))}
          </dl>

          <ul className="mt-8 flex items-center gap-4">
            <li>
              <a
                href={settings.phoneHref}
                aria-label={`Call ${settings.phone}`}
                className="inline-flex rounded-full border p-2.5 text-ink-dim transition-colors duration-200 hover:border-[color:var(--color-amber-deep)] hover:text-[color:var(--color-amber-deep)]"
                style={{ borderColor: "var(--color-line)" }}
              >
                <Phone className="h-4 w-4" aria-hidden />
              </a>
            </li>
            <li>
              <a
                href={settings.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Instagram ${settings.social.instagramHandle}`}
                className="inline-flex rounded-full border p-2.5 text-ink-dim transition-colors duration-200 hover:border-[color:var(--color-amber-deep)] hover:text-[color:var(--color-amber-deep)]"
                style={{ borderColor: "var(--color-line)" }}
              >
                <Instagram className="h-4 w-4" aria-hidden />
              </a>
            </li>
            <li>
              <a
                href={settings.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="inline-flex rounded-full border p-2.5 text-ink-dim transition-colors duration-200 hover:border-[color:var(--color-amber-deep)] hover:text-[color:var(--color-amber-deep)]"
                style={{ borderColor: "var(--color-line)" }}
              >
                <Facebook className="h-4 w-4" aria-hidden />
              </a>
            </li>
            <li>
              <a
                href={settings.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="inline-flex rounded-full border p-2.5 text-ink-dim transition-colors duration-200 hover:border-[color:var(--color-amber-deep)] hover:text-[color:var(--color-amber-deep)]"
                style={{ borderColor: "var(--color-line)" }}
              >
                <MessageCircle className="h-4 w-4" aria-hidden />
              </a>
            </li>
          </ul>
        </div>

        {/* Contact form */}
        <div className="md:col-span-4">
          <h2 className="text-xs uppercase tracking-[0.3em] text-amber-deep">Write to Us</h2>
          <a
            href={settings.emailHref}
            className="mb-5 mt-3 inline-block text-sm text-ink-dim transition-colors duration-200 hover:text-[color:var(--color-amber-deep)]"
          >
            {settings.email}
          </a>
          <ContactForm />
        </div>

        {/* Map */}
        <div className="md:col-span-4">
          <h2 className="mb-5 text-xs uppercase tracking-[0.3em] text-amber-deep">Find Us</h2>
          <div className="overflow-hidden rounded-sm border" style={{ borderColor: "var(--color-line)" }}>
            <iframe
              src={MAP_SRC}
              title={`Map showing ${settings.name} in ${settings.address.locality}, ${settings.address.region}`}
              loading="lazy"
              className="aspect-[4/3] w-full grayscale-[0.3]"
              style={{ border: 0 }}
            />
          </div>
        </div>
      </div>

      <div
        className="border-t"
        style={{ borderColor: "var(--color-line)" }}
      >
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-muted md:flex-row md:px-10">
          <p>
            © {new Date().getFullYear()} {settings.legalName}. {settings.meaning}.
          </p>
          <p className="uppercase tracking-[0.2em]">Theologos · Rhodes · Greece</p>
        </div>
      </div>
    </footer>
  );
}
