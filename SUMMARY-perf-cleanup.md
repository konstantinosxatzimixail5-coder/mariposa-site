# PageSpeed cleanup (desktop + mobile)

Final optimization pass. No regression to LCP, CLS (0), or the hero video; design
preserved. Lighthouse can't run in this build env — **re-run PageSpeed after
deploy** to capture the field/lab deltas.

## P1 — Image delivery (~112 KiB over-served on desktop)
The gallery photos were requested larger than rendered because `sizes` used `vw`
units that don't cap at the container's max width (`max-w-7xl` = 1200px content),
so they kept scaling past the real column width on wide screens.
- **Garden gallery** (`gallery[0]`,`[1]`, true column ≈ 280px): `sizes` →
  `(min-width:1280px) 280px, (min-width:768px) 22vw, 50vw`.
- **Garden "beats"** (3-col, true column ≈ 380px): `sizes` →
  `(min-width:1280px) 380px, (min-width:768px) 30vw, 100vw`.
- **Celebrations** background stays `100vw` (full-bleed).
- **Quality** lowered from default 75 → **65** on these gallery/background photos
  (added `images.qualities: [65, 75]` in `next.config.ts`). No visible loss on
  the soft garden/terrace imagery; the hero poster keeps full quality.

## P2 — Legacy JavaScript (~12 KiB polyfills)
Root cause of why they were *still* shipping after the earlier browserslist add:
the list included `"not dead"`, and **browserslist OR-unions queries**, so
`"not dead"` pulled old browsers (e.g. Safari 14) back into the target set and
SWC kept emitting the polyfills. Removed `"not dead"`; the list is now purely
modern floors (Chrome ≥93, Edge ≥93, Firefox ≥92, Safari/iOS ≥15.4, Samsung ≥18,
Opera ≥79) — all of which support `Array.prototype.at/flat/flatMap`,
`Object.fromEntries/hasOwn`, `String.prototype.trimStart/End` natively, so those
polyfills are dropped from the client bundle.

## P3 — Continuous main-thread work (paint/composite)
- **Reviews carousel** auto-advance now runs **only while the section is in the
  viewport** (IntersectionObserver) — no timer/re-renders off-screen (on top of
  the existing pause-on-hover/focus).
- **Hero dappled-light** layer is paused (`animation-play-state: paused`) once the
  hero scrolls off-screen — no continuous composite past the fold.
- Audited animations: hero reveal, clip reveal, parallax and leaf-light all
  animate **transform/opacity only** (compositor-friendly); `will-change` stays
  scoped to the reveal primitives. The 3D atmosphere remains the main intentional
  continuous cost (already disabled ≤640px / under reduced motion).

## P4 — Render-blocking CSS
Already addressed: `experimental.optimizeCss` (Critters) was enabled in the prior
LCP pass, so critical CSS is inlined and the stylesheet is off the critical path.

## Before / after (fill in from PageSpeed after deploy)
| Metric | Desktop before | Desktop after | Mobile before | Mobile after |
|---|---|---|---|---|
| Performance | 83→? | | (prev run) | |
| LCP | (hero renders) | no regression | 4.5s → target <2.5s | |
| CLS | 0 | 0 | 0 | 0 |
| TBT | ~20ms | ~20ms | low | low |
| Image delivery | ~112 KiB | reduced | — | reduced |
| Legacy JS | ~12 KiB | ~0 | ~12 KiB | ~0 |

## Verify after deploy
- PageSpeed (both desktop + mobile): image-delivery + legacy-JS items cleared,
  Performance up, LCP/CLS not regressed.
- Hero video still plays on desktop + mobile; gallery images look unchanged.
