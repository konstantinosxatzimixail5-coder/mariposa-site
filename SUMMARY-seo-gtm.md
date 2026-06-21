# LocalBusiness schema (Rhodes signals) + meta description + GTM + indexability

## 1. Schema — strengthened the EXISTING `#restaurant` node (no duplicate)
File: `src/components/RestaurantSchema.tsx`. Edited the single multi-typed
`["Restaurant","LocalBusiness"]` node at `@id https://mariposa.restaurant/#restaurant`
— no second business node, NAP unchanged.
- `address`: kept streetAddress "Epar.Od. Ialisou-Katavias", addressLocality
  "Theologos", postalCode "85106", addressCountry "GR"; `addressRegion` is
  **"South Aegean"**.
- `geo`: unchanged — **lat 36.2787, lng 27.8472** (anchors it on Rhodes).
- **Added `containedInPlace`** chaining village → island/country → country:
  `Place "Rhodes, Greece"` → `Country "Greece"`.
- **Added `areaServed`**: `[Place "Rhodes", Place "Rhodes Island, Greece"]`.
- **`description`** now reads: *"Family-run Mediterranean restaurant in Theologos,
  Rhodes, Greece — Greek and Italian cooking from our own garden, served beneath
  the vines above the Aegean."* (naturally includes "Rhodes, Greece"). Server-rendered.

**Validate (0 errors expected):**
- Rich Results Test — https://search.google.com/test/rich-results → `https://mariposa.restaurant/`
- Schema Markup Validator — https://validator.schema.org/ → same URL

## 2. Homepage meta description (149–150 chars, < 159 limit)
File: `src/app/layout.tsx` — the shared `DESCRIPTION` constant now feeds
`description`, `og:description` and `twitter:description` (consistent). Exact text:

> Award-winning Mediterranean restaurant in Rhodes, Greece. Garden-grown Greek & Italian dishes, daily-changing menu, Aegean views. Reserve at Mariposa.

**Length: 150 characters** (under the 159 cap). Canonical, title, robots, keywords
left unchanged.

## 3. Google Tag Manager — `GTM-KB7XQXGB`
File: `src/app/layout.tsx`, via the official **`@next/third-parties`** package
(`GoogleTagManager`), pinned to `15.5.9` to match Next.
- Injects the head loader **afterInteractive** (non-blocking, no render-blocking
  analytics request — protects the LCP work) **and** the `<noscript>` iframe.
- Rendered as the first element inside `<body>`, before `{children}`.
- **No separate GA4 `gtag.js`** added — GA4 is configured inside the container, so
  pageviews aren't double-counted.
- **Consent Mode v2:** a tiny inline stub defaults `ad_storage`, `ad_user_data`,
  `ad_personalization` and `analytics_storage` to **`denied`** before GTM loads
  (GDPR/EU). It's inline (no network request); it uses `beforeInteractive` only
  because consent defaults must precede GTM — the GTM loader itself stays
  afterInteractive.
  **TODO:** wire a cookie-consent banner to call
  `gtag('consent','update',{...})` on accept (until then analytics runs in
  consent-denied / cookieless mode).

## 4. Indexability — verified, nothing blocking
- **No `noindex`** on indexable routes. The only `index:false` is `/menu`, which is
  intentionally hidden right now (it redirects to `/`); the homepage and site are
  fully indexable. No `X-Robots-Tag` headers in `next.config`/middleware.
- **`/robots.txt`** allows all crawlers (+ named AI bots) and references
  `https://mariposa.restaurant/sitemap.xml`.
- **`/sitemap.xml`** returns the homepage `/` (and `/menu` only when republished —
  correctly excluded while hidden, since it currently redirects).
- **Canonical** is self-referential: `metadataBase https://mariposa.restaurant` +
  `alternates.canonical "/"` → `https://mariposa.restaurant/`.

## After deploy
- Verify GTM is firing with **Google Tag Assistant** (Preview/connect to the site).
- Run the Rich Results Test + Schema validator on the homepage (expect 0 errors).
