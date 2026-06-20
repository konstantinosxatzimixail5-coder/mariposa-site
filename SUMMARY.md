# SEO / GEO / AIO optimisation — change summary

Optimisation of **mariposa.restaurant** (Next.js App Router) for classic SEO, local/GEO
discovery, and AI answer engines (ChatGPT, Claude, Perplexity, Google AI Overviews).

All facts are drawn from the single source of truth in `src/lib/brand.ts` / `src/lib/faq.ts`;
nothing was invented. NAP is byte-for-byte consistent across schema, footer, map and `llms.txt`.

> Note on skills: the installed-skills directory in this environment contained only
> `session-start-hook`; the referenced schema / local-SEO / GEO / image-SEO / technical-SEO
> skills were not present, so the work follows current schema.org + Google Rich Results
> guidance directly. Everything below is server-rendered so crawlers/AI see it without JS.

## Structured data (`src/components/RestaurantSchema.tsx`)

One server-rendered JSON-LD `@graph`, cross-linked by `@id`. Rendered on **both** the homepage
(via `(site)/layout.tsx`) and `/menu` (added this pass).

- **Business node** is now multi-typed `["Restaurant","LocalBusiness"]` — a single node satisfies
  both without a duplicate/conflicting-NAP second node (Restaurant ⊂ FoodEstablishment ⊂
  LocalBusiness). Added `hasMap` (Google Maps link at the exact coordinates) and set
  `addressRegion` to **"South Aegean"** (the administrative region) while the UI keeps the
  guest-facing "Rhodes".
- **aggregateRating** — `4.9` / `288` / best `5` / worst `1`. Visibly present in the Reviews badge
  (Google requires the marked-up rating to be user-visible), so it is eligible, not schema-only.
- **review[]** — now marks up genuine, attributed third-party reviews shown on the homepage: the
  four Tripadvisor carousel excerpts (incl. **olga k**) with `publisher` Tripadvisor, **plus the
  Google review (Paulien S.)** with `publisher` Google. Code comment notes that self-authored /
  business reviews are NOT eligible for Google review snippets.
- Already present and retained: **Organization**, **WebSite** (+ `SearchAction`),
  **BreadcrumbList** (Home → Menu), **Menu/MenuItem** (the five signature dishes),
  `openingHoursSpecification` (daily 09:00–23:59; 24:00 is rejected by validators),
  `acceptsReservations`, `servesCuisine`, `geo`, `sameAs`, `award`, family as `employee`/`founder`.

## FAQPage (`src/components/sections/FAQ.tsx`)

- Already built from the same `FAQS` source the UI renders (all 10 Q&As **verbatim** — schema text
  === on-page text). Added `@id`, `isPartOf` → WebSite, `about` → Restaurant, and a `speakable`
  spec (`#faq`) for voice/AI citability. Kept co-located with the component so the two never drift.

## Metadata / head

- **Home** (`src/app/layout.tsx`): refined `keywords` to local intent
  (restaurant Theologos Rhodes, Mediterranean / garden / fine dining / sunset dinner Rhodes …).
  Existing strong title template, description, canonical, OG (1200×630 `og.jpg`), Twitter
  summary_large_image, robots `max-image-preview:large`, `<html lang="en">`, theme-color/viewport
  were already in place and retained.
- **/menu** (`src/app/menu/page.tsx`): expanded `title` ("Menu — Mediterranean Dining in Theologos,
  Rhodes"), localised description, canonical `/menu`, and added Open Graph + Twitter cards.

## Image alt text

Rewrote to be descriptive, natural and entity/locally aware (no stuffing):
- Signature dishes (`Dishes.tsx`) — name + tagline + "at Mariposa … Theologos, Rhodes".
- Experience terrace shots (`Hours.tsx`), garden gallery (`Garden.tsx`), celebrations hero
  (`Celebrations.tsx`), menu cards (`menu/MenuExperience.tsx`), and the Travelers' Choice award
  logo (`ReviewBadges.tsx`).

## Embedded map (`src/components/sections/Footer.tsx`)

- Replaced the OpenStreetMap iframe with a **key-free Google Maps embed** pinned to
  `36.2787, 27.8472` (lazy-loaded, titled for a11y, `referrerPolicy` set). Added a **"Get
  directions"** link. Map coordinates, JSON-LD `geo`/`hasMap`, and the on-page `<address>` all match.

## GEO / AIO

- `public/llms.txt`: fixed the stale Menu link to `/menu`, restructured into Key pages / Contact;
  cuisine, location, hours, ratings and signature dishes remain factual and NAP-consistent.
- `robots.ts`: already allows all + named AI crawlers (GPTBot, ClaudeBot, PerplexityBot,
  Google-Extended, Applebot-Extended, OAI-SearchBot, CCBot …) and points to the sitemap.
- `sitemap.ts`: now lists **both** `/` and `/menu`.

## Validate

Test these URLs after deploy:
- Google Rich Results Test — https://search.google.com/test/rich-results
  - https://mariposa.restaurant/  (Restaurant/LocalBusiness, AggregateRating, Review, FAQPage, Breadcrumb, Menu)
  - https://mariposa.restaurant/menu
- Schema Markup Validator — https://validator.schema.org/
  - same two URLs
- `https://mariposa.restaurant/llms.txt`, `/robots.txt`, `/sitemap.xml` resolve and are current.

Reminder: confirm the FAQ answers render **identically** to the schema `acceptedAnswer` text
(they share `FAQS`, so they will) and that the 4.9 / 288 rating remains visible in the UI.
