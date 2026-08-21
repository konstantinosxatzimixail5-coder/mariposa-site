/**
 * Meta (Facebook) Pixel — the pixel id and a safe client-side event helper.
 *
 * The pixel itself is injected by `src/components/MetaPixel.tsx` (mounted in the
 * (site) layout, so the Studio at /studio stays untracked). This module exists so
 * that any client component can fire a conversion event without knowing how the
 * pixel was loaded.
 */

/**
 * Pixel id — Events Manager → Data Sources.
 *
 * Baked in like `GTM-NQWTBSMG` / `G-EJ1LSJ3489` in `app/layout.tsx`: the id is
 * public by definition (it ships inside the browser snippet and in the noscript
 * URL), so there is nothing to hide. Set `NEXT_PUBLIC_META_PIXEL_ID` to point a
 * deploy at a different pixel — an empty value disables the pixel entirely,
 * which is the useful setting for local development.
 */
export const META_PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "974216358924953";

/**
 * The standard Meta events this site sends. Deliberately narrow — standard event
 * names are what Ads Manager can optimise and report on, so we stick to them:
 *   - `PageView` — every page, fired by the base snippet + on client navigation.
 *   - `Lead`     — a reservation request (the site's real conversion).
 *   - `Contact`  — contact form submitted, or a phone/e-mail link clicked.
 */
export type PixelEvent = "PageView" | "Lead" | "Contact";

type Fbq = (...args: unknown[]) => void;

/**
 * Fire a standard Meta Pixel event.
 *
 * A no-op — never a throw — when the pixel isn't there: during SSR, when
 * META_PIXEL_ID is empty, before `fbevents.js` has loaded, or when a tracker
 * blocker removed it. Call sites don't need to guard.
 *
 * NEVER pass personal data (name, phone, e-mail, free-text notes): everything in
 * `params` is transmitted to Meta as-is. Keep it to non-identifying context such
 * as which form fired and how many guests.
 */
export function trackPixel(event: PixelEvent, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const fbq = (window as Window & { fbq?: Fbq }).fbq;
  if (typeof fbq !== "function") return;
  if (params) fbq("track", event, params);
  else fbq("track", event);
}
