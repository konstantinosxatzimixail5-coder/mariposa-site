# Mobile LCP / performance + reviews-carousel accessibility

Source of truth: PageSpeed Insights mobile (Moto G Power, Slow 4G) of
https://mariposa.restaurant/ — Perf 83, A11y 83, BP 100, SEO 100, Agentic 2/3.
FCP 1.0s (good), **LCP 4.5s (POOR)**, TBT 20ms, CLS 0, Speed Index 3.8s.

> Lighthouse couldn't be run inside this build environment (no headless Chrome /
> live URL), so "after" figures are engineering estimates from the payload/render
> changes. **Re-run PageSpeed Insights after deploy** to confirm.

## PART A — LCP

### 1. Enormous hero video (was ~11.7 MB of an ~12.9 MB page)
- The hero shipped `mariposa-hero-4k.mp4` (~11.7 MB) to every device. Now the hero
  renders a **server-side poster** (`hero-poster.jpg`, ~19 KB) as the background,
  with `fetchPriority="high"` — painted on first byte.
- The video (`HeroVideo`) now uses the **small encodes** (`hero.webm` ~370 KB /
  `hero.mp4` ~1.4 MB, not the 4K master), `preload="none"`, mounts **only when the
  browser is idle** (after first paint), and is **skipped entirely on small
  viewports / Save-Data / 2g** — phones show the poster and download **no video**.
  Still muted/inline/loop. The 4K file stays in `/public` but is never served.
- **Effect:** ~11.7 MB removed from the mobile critical path.

### 2. LCP element render delay (was 1,510 ms)
- The LCP heading ("The hidden gem") was hidden by the JS clip-reveal
  (`opacity:0` / `translateY(110%)`) until hydration ran.
- The hero copy now animates in via **CSS keyframes on load** (`hero-in` /
  `hero-clip` in `globals.css`) — the heading is in the **first server-rendered
  paint**, no JS gating, no `transition-delay`. Reduced-motion shows the final
  state instantly.
- **Effect:** removes the ~1.5 s render delay; LCP becomes the poster/heading at
  first paint. Target LCP < 2.5 s (expected ~1–1.5 s). CLS stays 0 (poster is
  absolutely positioned, fills its box).

## PART B — secondary wins
- **Legacy JS polyfills (~12 KB):** added a modern `browserslist` (Chrome ≥93,
  Safari ≥15.4, Firefox ≥92, …) to `package.json`, so Next stops shipping
  `Array.prototype.at/flat/flatMap`, `Object.fromEntries/hasOwn`,
  `String.trimStart/End` polyfills.
- **Render-blocking CSS (~70 ms):** enabled `experimental.optimizeCss` (Critters)
  to inline critical CSS and defer the rest.
- **Fonts:** dropped the unused `SOFT`/`WONK` Fraunces axes (kept `opsz`) — smaller
  variable-font download, identical look; `display: swap` retained.
- **Caching:** `/video/*` served `Cache-Control: public, max-age=31536000,
  immutable` (helps slow regions on repeat views).
- **Unused JS / forced reflow:** the heavy client libs (three/R3F, framer-motion)
  are already dynamically imported / gated (3D atmosphere is `ssr:false` + disabled
  ≤640px; smooth-scroll, cursor and parallax are desktop-only). Below-the-fold
  sections are left server-rendered for SEO rather than `ssr:false` (which would
  hide reviews/menu from crawlers). Remaining unused-JS is mostly Studio/vendor and
  left as-is to avoid regressions.
- **Image delivery (~67 KB):** intentionally NOT down-compressed — next/image
  already serves responsive AVIF/WebP, and the dish/garden photography is core art
  direction. This is the smallest line item; flagged as an optional follow-up
  (tighter `sizes`/`quality`) rather than risking the premium look.

## PART C — reviews carousel accessibility
- The ARIA/list failures were already fixed (PR #28: the dots are a labelled
  `role="group"` button group with `aria-current`, not a malformed tablist).
- **This change adds touch-target sizing:** each dot button now has a **28×28 px
  hit area** (`h-7 w-7`, flex-centred) around the unchanged 8 px visible dot —
  clearing WCAG 2.5.8 "Target Size". Visible dot styling unchanged.

## Expected after
FCP ~1.0 s (maintained), **LCP < 2.5 s (expected ~1–1.5 s)**, CLS 0, TBT low.
Re-running PageSpeed should pass Accessibility (touch targets) and Agentic Browsing.

## Verify after deploy
- DevTools → Network (mobile, Slow 4G): no `mariposa-hero-4k.mp4`; poster ~19 KB is
  the LCP; `hero.webm` only on desktop/idle.
- PageSpeed Insights mobile on `https://mariposa.restaurant/` — confirm LCP and the
  touch-target / ARIA / Agentic audits pass.
