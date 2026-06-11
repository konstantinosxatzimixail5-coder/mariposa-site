# Mariposa — Restaurant & Fine Dining

Flagship marketing site for **Mariposa**, a Mediterranean fine-dining restaurant in
Theologos, Rhodes. Slow, cinematic, editorial. The butterfly (_mariposa_) is the
central motif.

## Stack

| Concern | Tool |
|---------|------|
| Framework | Next.js 15 (App Router) · TypeScript strict |
| Styling | Tailwind CSS v4 (`@theme` design tokens in `src/app/globals.css`) |
| Fonts | Fraunces + Inter, self-hosted via `next/font` |
| Smooth scroll | Lenis (single RAF source of truth — `SmoothScroll.tsx`) |
| Scroll choreography | GSAP ScrollTrigger |
| 3D | React Three Fiber + drei + postprocessing — hero butterfly extruded from the **real logo SVG** |
| UI motion | Framer Motion |
| Cinematic hero video | Remotion → `/public/video` |
| Reservations | Form → `POST /api/reservations` (Next route handler) |
| Icons | lucide-react |
| Package manager | pnpm (via Corepack) |

## Getting started

```bash
corepack enable          # if pnpm isn't on PATH
pnpm install
pnpm dev                 # http://localhost:3000
```

Other scripts:

```bash
pnpm build               # production build
pnpm typecheck           # tsc --noEmit (strict)
pnpm lint                # next lint
```

## Remotion (hero loop) — Phase 4

The cinematic hero background is a pre-baked video rendered with Remotion (we do
**not** run the full montage live on the GPU). Project lives in `./remotion`.

```bash
pnpm remotion:studio     # preview compositions
pnpm remotion:render     # → public/video/hero.mp4 + hero.webm + hero-poster.jpg
```

The site uses the rendered loop as the hero background, with the poster frame as
the reduced-motion / mobile fallback. The composition lives in
`remotion/HeroLoop.tsx` (1920×1080, 30fps, 300-frame seamless loop).

## Hero butterfly (3D)

The live hero accent is the **actual Mariposa trademark given depth**: the
leaf-spiral wing paths from `ButterflyMark.tsx` are parsed with Three's
`SVGLoader`, rebuilt as smooth `TubeGeometry` filaments, and surfaced with a
physically-based iridescent material (`src/components/three/HeroButterfly.tsx`).
It is gated by `useCanRender3D` (GPU/Save-Data/viewport) and `prefers-reduced-motion`
— below the gate the CSS gradient hero stands alone.

## Reservations

The booking form (`src/components/ReservationForm.tsx`) posts JSON to
`src/app/api/reservations/route.ts`, which validates name / date (today-or-future) /
time (within service hours) / party size and acknowledges receipt. The handler is
the placeholder seam for a real integration (email via Resend, OpenTable, etc.).
Phone + WhatsApp remain the always-live direct path beneath the form.

## Design tokens

All brand values (palette, fluid type scale, easings, durations, spacing, z-index)
are defined once in the `@theme` block of `src/app/globals.css` and consumed as
Tailwind utilities / CSS vars. Real business content lives in `src/lib/brand.ts`.

| Token | Value |
|-------|-------|
| Ink (base) | `#0E0F0D` |
| Ivory (light surface) | `#F4EFE6` |
| Aegean (teal-blue) | `#1B4D52` |
| Olive (garden green) | `#6B7B52` |
| Amber (accent / butterfly) | `#C9A86A` |
| Entrance easing | `cubic-bezier(0.16, 1, 0.3, 1)` |

## Accessibility & performance

- `prefers-reduced-motion`: Lenis + custom cursor + all reveals + 3D disabled, static path.
- Custom cursor is desktop / fine-pointer only.
- WCAG AA targeted; semantic HTML, skip link, visible focus rings, labelled form fields.
- All interactive controls restored to `cursor: pointer` (Tailwind v4 preflight resets this).
- `schema.org` `Restaurant` JSON-LD (aggregateRating 4.9/288, hours, geo, menu) + OG/Twitter metadata.

## Build phases

1. ✅ Scaffold — tokens, fonts, Lenis, base layout, design system.
2. ✅ Sections + GSAP scroll choreography.
3. ✅ R3F — logo-derived butterfly hero, dish gallery, ambient garden.
4. ✅ Remotion hero loop render + wire-in.
5. ✅ Reduced-motion / mobile / a11y / SEO + JSON-LD.
6. ✅ Reservation form + API, cursor/a11y polish, performance pass.

## Content & assets

Real business content (hours, dishes, reviews, contact, social) lives in
`src/lib/brand.ts`. The full ingest of the client's WordPress export and
Tripadvisor page — verified facts, photography, menu, and open gaps — is
catalogued in [`notes/asset-inventory.md`](./notes/asset-inventory.md).
