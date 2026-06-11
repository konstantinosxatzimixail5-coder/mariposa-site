# Mariposa — Placeholder Assets To Supply

Everything below currently ships as a tasteful placeholder so the site builds and
demos end-to-end. Replace each item with the real asset when available.

| # | Asset | Where it's used | Current placeholder | Notes |
|---|-------|-----------------|---------------------|-------|
| 1 | **5 dish photos** — Octopus with Fava, Green Apple Salad, Zucchini Balls, Ossobuco alla Milanese, Garlic Shrimp Spaghetti. Ideally top-down on a dark surface, ~2000px, AVIF/WebP. | Signature Dishes (Phase 3 gallery) | Color-field gradient cards | Consistent lighting/crop matters most |
| 2 | **Hero / garden / sea photography** — 2–4 wide landscape shots (Aegean horizon + garden). | Philosophy parallax, Garden section | Radial color-field gradients | Used behind clip-reveal text |
| 3 | ~~**Butterfly trademark SVG**~~ ✅ RECEIVED | Preloader, nav, footer, favicon | Real olive leaf-spiral mark rebuilt as scalable stroke art (`ButterflyMark.tsx`, `public/favicon.svg`) | Redrawn from client image; if a vector original exists, drop it in to replace the redrawn paths |
| 4 | **`RESERVATION_URL`** — live booking system link. | All "Reserve a Table" CTAs | `#reserve` anchor (see `BRAND.reservationUrl`) | Drop into `src/lib/brand.ts` |
| 5 | **Font licensing confirmation** — Fraunces + Inter are both SIL OFL (free to self-host). | All typography | Self-hosted via `next/font` | No action needed unless brand fonts are mandated |
| 6 | **Exact map pin** — precise lat/long of the venue. | Location & Footer map | Approx Theologos coords `36.2787, 27.8472` | Update `BRAND.geo` |
| 7 | **OG share image** — 1200×630. | SEO / social cards | To be generated from the wordmark (Phase 5) | — |
| 8 | **Copy sign-off** — headline + section copy approval. | All sections | Draft copy written from chef's philosophy | Flagged for review |
| 9 | *(Optional)* **Dish glTF models** (Draco-compressed). | Dish gallery (upgrade path) | Procedural plate + photo cards | Only if you want true 3D dishes |

## Decisions locked in (this build)
- Site lives in `./mariposa` (standalone Next.js 15 app inside the worktree).
- Typography: **Fraunces** (display) + **Inter** (body), self-hosted.
- 3D butterfly: **procedural** (R3F geometry + MeshPhysicalMaterial), no external glTF needed.
