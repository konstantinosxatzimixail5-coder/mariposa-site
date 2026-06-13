---
name: motion
description: Build React animations with the Motion library (motiondivision/motion, imported as `framer-motion` in this repo) following the Mariposa house style. Use when adding or editing UI animation — fades, reveals, slides, layout transitions, enter/exit with AnimatePresence, drag, gestures, or scroll-linked motion — in any .tsx component. Covers reduced-motion handling, the signature easing, and when to reach for Motion vs. CSS/GSAP.
---

# Motion (Mariposa house style)

[Motion](https://github.com/motiondivision/motion) is the animation library
formerly named Framer Motion. In this repo it is installed as `framer-motion`
(`framer-motion@^11`) and imported from `"framer-motion"`. The newer package
name is `motion` (`import { motion } from "motion/react"`) — the API is
identical, so everything here applies to both. Keep using `"framer-motion"`
imports for consistency unless the whole project migrates.

## When to use Motion (and when not to)

This site layers several animation tools. Pick the lightest one that does the job:

- **CSS + `Reveal`** (`src/components/Reveal.tsx`) — one-shot scroll reveals and
  simple hover/transition states. Prefer this for static content fade-ins; it
  ships no JS animation runtime. Easing tokens live in `globals.css`
  (`--ease-entrance`, `--ease-out-soft`, `--ease-in-out-soft`).
- **GSAP / ScrollTrigger** (`src/lib/gsap.ts`, `Parallax.tsx`) — scrubbed,
  scroll-linked, and timeline choreography across a section.
- **Motion** — interactive React state transitions: enter/exit of mounting
  components (`AnimatePresence`), carousels, drag, gestures, `layout`
  animations, and anything driven by React state. See `Testimonials.tsx` and
  `Preloader.tsx` for the established patterns.

If a plain CSS transition or the `Reveal` primitive covers it, use that instead
of adding a `motion.*` element.

## Non-negotiables

1. **`"use client"`** at the top of any file that imports from `framer-motion` —
   these are client components.
2. **Respect reduced motion.** Read `useReducedMotion` from
   `@/lib/useReducedMotion` (the project's SSR-safe hook — do **not** use
   Motion's own `useReducedMotion`) and collapse movement to opacity-only or
   zero duration. Pattern from `Testimonials.tsx`:

   ```tsx
   const reducedMotion = useReducedMotion();
   // ...
   <motion.figure
     initial={{ opacity: 0, y: reducedMotion ? 0 : 12 }}
     animate={{ opacity: 1, y: 0 }}
     exit={{ opacity: 0, y: reducedMotion ? 0 : -12 }}
     transition={{ duration: reducedMotion ? 0 : 0.9, ease: [0.16, 1, 0.3, 1] }}
   />
   ```

3. **Use the signature easing.** The entrance curve is the cubic-bezier
   `[0.16, 1, 0.3, 1]` (mirrors `--ease-entrance` in `globals.css`). Use it for
   reveals and exits. Motion is **calm and slow** here — typical durations are
   `0.6`–`0.9s`, never bouncy or springy unless there's a clear reason.

## Common patterns

### Enter / exit on mount-unmount

```tsx
"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

const reducedMotion = useReducedMotion();

<AnimatePresence initial={false}>
  {open && (
    <motion.div
      key="panel"
      initial={{ opacity: 0, y: reducedMotion ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: reducedMotion ? 0 : -12 }}
      transition={{ duration: reducedMotion ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      …
    </motion.div>
  )}
</AnimatePresence>
```

- Give each child a stable `key`; crossfading siblings (e.g. a carousel)
  share one absolutely-positioned container so they overlap during the swap —
  see the `Testimonials` figure.
- `initial={false}` on `AnimatePresence` skips the animation on first paint.

### Overlay dismissal (Preloader)

Exit-only animation with the easing inlined on the `exit` transition:

```tsx
<motion.div exit={{ opacity: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } }} />
```

### Variants for staggered groups

```tsx
const container = { show: { transition: { staggerChildren: 0.08 } } };
const item = {
  hidden: { opacity: 0, y: reducedMotion ? 0 : 16 },
  show: { opacity: 1, y: 0, transition: { duration: reducedMotion ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] } },
};
// <motion.ul variants={container} initial="hidden" animate="show"> … <motion.li variants={item} />
```

## Accessibility & quality checklist

- [ ] File starts with `"use client"`.
- [ ] `useReducedMotion` from `@/lib/useReducedMotion` gates all positional
      movement; reduced-motion path is opacity-only or instant.
- [ ] Easing is `[0.16, 1, 0.3, 1]` for entrances/exits unless intentionally different.
- [ ] Durations stay in the calm `0.6`–`0.9s` range; no default springy bounce.
- [ ] `AnimatePresence` children have stable `key`s.
- [ ] A lighter tool (CSS `Reveal` / GSAP) wouldn't have done the job better.
- [ ] Run `pnpm typecheck` and `pnpm lint` after changes.

## Reference

- Library: https://github.com/motiondivision/motion · docs: https://motion.dev
- In-repo examples: `src/components/sections/Testimonials.tsx`,
  `src/components/Preloader.tsx`
- Reduced motion: `src/lib/useReducedMotion.ts` · easing tokens:
  `src/app/globals.css`
