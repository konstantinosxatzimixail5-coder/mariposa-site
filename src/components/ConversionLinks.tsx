"use client";

import { useEffect } from "react";
import { trackPixel } from "@/lib/meta-pixel";
import { trackConversion } from "@/lib/tracking";

/**
 * Click tracking for the site's direct-contact links — phone, e-mail and the
 * standalone WhatsApp links — reported to Meta and to GTM in one place.
 *
 * WHY A DELEGATED LISTENER, not a <TrackedLink> wrapper: these links are
 * rendered by *server* components in five places (footer address, footer icon
 * row, "Prefer to call?", and on the menu page its reservation modal + social
 * row). One listener covers all of them, and anything added later, without
 * turning each into a client component or shipping extra JS.
 *
 * It deliberately does NOT intercept the click. Wrapping these in
 * preventDefault + `window.location.href` buys nothing here, because none of
 * them unload the page: `tel:`/`mailto:` are handed to the OS and the WhatsApp
 * links open in a new tab. The page stays alive, so the beacons finish on their
 * own — and the guest's call starts instantly instead of waiting on a tag.
 *
 * The reservation button is NOT an anchor (it opens WhatsApp from JS), so it can
 * never match here. That's what keeps a booking from being counted twice, as
 * both `reservation_request` and `whatsapp_click`.
 */
export function ConversionLinks() {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest<HTMLAnchorElement>(
        'a[href^="tel:"], a[href^="mailto:"], a[href*="wa.me"]',
      );
      if (!link) return;

      const href = link.href;
      // No PII in any payload: the channel, never the number or address.
      if (href.startsWith("tel:")) {
        trackPixel("Contact", { content_name: "Phone click", content_category: "contact" });
        trackConversion("phone_click");
      } else if (href.startsWith("mailto:")) {
        // Meta only — the Ads spec has no e-mail conversion action.
        trackPixel("Contact", { content_name: "Email click", content_category: "contact" });
      } else {
        // A WhatsApp chat start that isn't a reservation (footer icon, menu page).
        trackConversion("whatsapp_click");
      }
    }

    // Capture phase, so the click is recorded even if a handler further down
    // stops propagation before it reaches the document.
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return null;
}
