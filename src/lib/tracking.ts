/**
 * Conversion tracking — the Google/GTM side.
 *
 * Pushes named events onto the dataLayer so GTM (`GTM-NQWTBSMG`) can map each one
 * to a Google Ads conversion tag through a Custom Event trigger. Explicit events
 * beat GTM's DOM click triggers here: no CSS selectors to break when the markup
 * changes, no double-fire risk, and the reservation "button" isn't a link at all
 * (it opens WhatsApp from JS), which click triggers handle poorly.
 *
 * The Meta side lives in `meta-pixel.ts` — the two are independent on purpose, so
 * neither platform's blocker or outage can take the other down.
 */

/** Events GTM listens for. Names must match the Custom Event triggers exactly. */
export type ConversionEvent =
  | "reservation_request"
  | "phone_click"
  | "whatsapp_click"
  | "contact_form_submit";

type Payload = Record<string, string | number | undefined>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    /** Defined by gtm.js once the container has actually loaded. */
    google_tag_manager?: unknown;
  }
}

/**
 * Push a conversion event to the dataLayer.
 *
 * The push always happens, even before gtm.js has loaded — GTM drains whatever
 * is already in `dataLayer` when it initialises, so an early click still counts.
 *
 * `next` is only for call sites that must WAIT for the tags before doing
 * something destructive to the page. None of Mariposa's conversion points need
 * it today: the reservation button opens WhatsApp in a new tab, `tel:`/`mailto:`
 * are handled by the OS, and the contact form is a fetch — the page survives all
 * four, so the beacon has all the time it needs. Reach for `next` only if a
 * conversion ever precedes a real same-tab navigation, and note that you cannot
 * call `window.open` from it (popup blockers require the user gesture).
 *
 * When `next` is given: GTM's `eventCallback` fires it once the tags are done,
 * `eventTimeout` caps GTM's own wait, and a hard timer guarantees it runs even if
 * GTM never loaded (ad blocker, script error) — the guest is never held hostage
 * to a blocked beacon.
 */
export function trackConversion(
  event: ConversionEvent,
  payload: Payload = {},
  next?: () => void,
): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];

  if (!next) {
    window.dataLayer.push({ event, ...payload });
    return;
  }

  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    next();
  };
  const hardStop = window.setTimeout(finish, 1000);
  const wrapped = () => {
    window.clearTimeout(hardStop);
    finish();
  };

  window.dataLayer.push({
    event,
    ...payload,
    eventTimeout: 900,
    eventCallback: wrapped,
  });

  // Nothing will ever call back if the container isn't there. NB: testing
  // `dataLayer` instead would be useless — the Consent Mode stub in
  // `app/layout.tsx` creates it on every load, blocker or not.
  if (typeof window.google_tag_manager === "undefined") wrapped();
}
