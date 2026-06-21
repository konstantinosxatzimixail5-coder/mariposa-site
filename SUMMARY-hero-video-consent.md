# Hero video restored (both breakpoints, LCP-safe) + cookie-consent banner

## Hero video — back on desktop AND mobile
The video had been dropped on mobile; it now plays on **both** breakpoints,
without hurting LCP.

- **Poster = LCP element.** `Hero.tsx` renders the poster via **`next/image`**
  with `priority` (→ `fetchpriority="high"`) + `fill` + `sizes="100vw"`, optimized
  and preloaded, painted immediately. CLS stays 0 (it fills its box).
- **Heading visible on first paint** — unchanged from the LCP fix: CSS-on-load
  reveal (`hero-in`/`hero-clip`), never hidden before JS, reduced-motion safe.
- **`HeroVideo`** sits above the poster: `preload="none"`, muted, loop,
  playsInline, mounts only **after first paint (on idle)**, then sets source +
  `play()` + fades in. Plays on **both** desktop and mobile.
  - **Per-breakpoint encode:** 720p MP4 on small screens; 1080p WebM → MP4 on
    larger (chosen in JS, since `<source media>` is unreliable for `<video>`).
  - **Save-Data / 2g** → video skipped on both breakpoints, poster stays.
  - The 12 MB 4K master is **never referenced** by the live hero.
- **Fallback so it plays today:** the small in-repo `hero.webm`/`hero.mp4` are
  listed as trailing `<source>`s. The hero plays immediately and **auto-upgrades**
  to the cinematic 1080p/720p encodes once you add them.

### ffmpeg encodes to generate (no ffmpeg in this env — run locally, commit to `public/video/`)
Full doc: `docs/hero-video-encoding.md`.
```bash
ffmpeg -i public/video/mariposa-hero-4k.mp4 -ss 00:00:02 -frames:v 1 -vf "scale=1600:-2" public/video/hero-poster.jpg
ffmpeg -i public/video/mariposa-hero-4k.mp4 -an -vf "scale=1920:-2" -c:v libx264 -crf 28 -preset slow -movflags +faststart public/video/hero-1080.mp4
ffmpeg -i public/video/mariposa-hero-4k.mp4 -an -vf "scale=1920:-2" -c:v libvpx-vp9 -crf 34 -b:v 0 public/video/hero-1080.webm
ffmpeg -i public/video/mariposa-hero-4k.mp4 -an -vf "scale=1280:-2" -c:v libx264 -crf 30 -preset slow -movflags +faststart public/video/hero-720.mp4
```

### LCP (mobile)
- **Before** this batch: 4.5 s (4K loaded eagerly, no SSR poster).
- **After:** the LCP element is the optimized poster (preloaded), video is
  deferred and never blocks paint → target **< 2.5 s** (Lighthouse couldn't run
  here; verify on PageSpeed after deploy). CLS 0.

## Cookie-consent banner (Consent Mode v2)
- New `CookieConsent` client component, rendered in the `(site)` layout (marketing
  only, not the Studio).
- Consent still **defaults to denied** before GTM (set in `app/layout.tsx`). The
  banner lets the visitor **Accept** (→ `gtag('consent','update',{…:'granted'})`)
  or **Decline** (stays denied); the choice is stored in `localStorage` and
  re-applied on return so the banner shows only once.
- On-brand styling (surface card, amber Accept), `role="dialog"`, keyboard-usable
  buttons. This resolves the earlier TODO — GTM/GA4 now collect normally once a
  visitor accepts, and stay cookieless until then.

## Verify after deploy
- Hero video visibly plays on **desktop and mobile** (after the encodes are added;
  the fallback plays meanwhile).
- DevTools → Network: `hero-1080.*` on desktop, `hero-720.mp4` on mobile, no
  `mariposa-hero-4k.mp4`; poster is the LCP.
- PageSpeed Insights (mobile): LCP < 2.5 s, CLS 0.
- Accept/Decline on the banner flips Consent Mode (check in Tag Assistant).
