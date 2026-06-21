# Forms → email + mobile performance

Two pieces of work: (A) make the reservation **and** contact forms email
`mariposa.rhodos@gmail.com` instantly, and (B) cut mobile FCP/LCP.

---

## PART A — Reservation & contact forms → email

### What was already true
The **reservation** form was already wired end-to-end to `/api/reservations` →
`src/lib/reservation-delivery.ts` (Resend email + Twilio WhatsApp). It just never
sent because no Resend env vars are set in production. The **contact** form posted
to `/api/contact`, which was a placeholder that acknowledged but emailed nothing.

### What changed
- **`src/lib/email.ts`** (new) — one shared Resend sender (`sendEmail`) with a
  `sent | skipped | failed` contract, From/To resolution, HTML escaping and a
  labelled-lines → HTML table helper. Falls back to Resend's onboarding sender
  when `RESERVATION_FROM_EMAIL` is unset (testing), and is "skipped" (not an
  error) when `RESEND_API_KEY` is absent so local dev works.
- **`/api/contact`** now actually sends: validates name/email/message, emails the
  restaurant with subject `New message from {name} via mariposa.restaurant`, and
  sets **reply-to = the guest's email** so a reply goes straight back to them.
- **`reservation-delivery.ts`** email channel refactored onto the shared helper;
  subject is now `New reservation request — {name}, {party} guests, {date} {time}`.
  (No reply-to: the reservation form has no email field; the phone is in the body.)
- **Spam protection on both handlers**: a hidden **honeypot** field
  (`src/components/Honeypot.tsx`, added to both forms) — any value ⇒ silently
  accepted, nothing sent — and a **per-IP rate limit** (`src/lib/rate-limit.ts`,
  5 req/min, in-memory/best-effort; swap to Upstash for hard guarantees).
- **Graceful failure**: if a *configured* send fails, the handler returns an error
  and the form already shows the phone/WhatsApp/email fallback that's on the page.
- Server-side validation + `escapeHtml` on all input; raw input is never
  interpolated into the HTML body unescaped. Both forms keep their existing
  styling, required-field validation, disabled/"Sending…" state, success + error
  panels, and reset-on-success.

### Required env vars (set in Vercel)
| Var | Required? | Value |
|---|---|---|
| `RESEND_API_KEY` | **Yes** | Resend API key (`re_…`). Without it nothing is emailed. |
| `RESERVATION_FROM_EMAIL` | Recommended | Sender on a **verified domain**, e.g. `Mariposa <reservations@mariposa.restaurant>`. Falls back to `onboarding@resend.dev` (owner-only delivery) if unset. |
| `RESERVATION_TO_EMAIL` | Optional | Recipient. Defaults to `mariposa.rhodos@gmail.com`. |

### Vercel dashboard steps
1. **Resend** → create account → **Domains** → add `mariposa.restaurant` → add the
   shown **SPF/DKIM DNS records** at your registrar → wait for **Verified**.
2. **Resend → API Keys** → create a key (Sending access).
3. **Vercel → Project → Settings → Environment Variables** → add `RESEND_API_KEY`,
   `RESERVATION_FROM_EMAIL` (on the verified domain), `RESERVATION_TO_EMAIL=mariposa.rhodos@gmail.com`
   for **Production** (and Preview if you want). **Redeploy.**
4. Submit each form on the live site → an email should arrive within seconds.

> **Alternative (not implemented):** if you'd rather send directly through the
> Gmail account instead of Resend, swap `sendEmail()` for **Nodemailer** over SMTP
> with a **Gmail App Password** (`GMAIL_USER` + `GMAIL_APP_PASSWORD`). Resend is the
> default here because it's the cleaner Vercel-native, deliverability-friendly path
> (SPF/DKIM on your own domain) and avoids storing a Gmail password.

---

## PART B — Mobile performance

### Measurement note
A full throttled Lighthouse run wasn't possible in this build environment (no
headless Chrome / deployed URL available here), so the changes are driven by
`next build` payload analysis and the Vercel Speed Insights field data you
provided. **Re-run Lighthouse (mobile preset) and re-check Speed Insights ~24–48h
after deploy** — field data lags.

**Before (Vercel Speed Insights, mobile P75):** FCP **2.17s** · LCP **2.3s**
(both "Needs Improvement") · CLS 0 · INP 176ms · FID 41ms · TTFB 0.49s. Server
fast, layout stable ⇒ the problem was render-blocking startup + heavy hero assets.

### Root causes found
1. The hero shipped **`mariposa-hero-4k.mp4` — 12.25 MB** to every device,
   competing with critical content for bandwidth (worst in slower regions:
   France/Switzerland).
2. **No SSR poster.** The largest paint had nothing to latch onto until the video
   or JS arrived.
3. The hero copy used the JS reveal primitive: `.reveal { opacity:0 }` and
   `.clip-reveal > .clip-inner { transform: translateY(110%) }` — **the entire
   hero, including the LCP heading, stayed invisible until hydration ran** and the
   IntersectionObserver fired.

### What changed
- **SSR hero poster as the LCP element** (`Hero.tsx`): `hero-poster.jpg` (~19 KB)
  rendered as a server `<img fetchPriority="high" decoding="async">` filling the
  hero. Largest paint is now a 19 KB image available on first byte — no JS, no
  video dependency.
- **Killed the 4K on the web** (`brand.ts`, `HeroVideo.tsx`): the loop now uses the
  small encodes (**`hero.webm` ~370 KB**, `hero.mp4` ~1.4 MB), `preload="none"`,
  `poster=…`, and **mounts only when the browser is idle** (after first paint).
  It's **skipped entirely on small viewports, Save-Data, and 2g** — phones show the
  poster and download no video. (Already muted/inline/loop/autoplay; the 4K master
  stays in `/public` but is never served.)
- **Hero copy paints without JS** (`Hero.tsx` + `globals.css`): the eyebrow,
  heading and intro now animate in via CSS keyframes (`hero-in` / `hero-clip`) on
  load, so the **heading is in the first server-rendered paint** and is never held
  hidden by hydration. Reduced-motion users get the final visible state instantly.
- **Fonts** (`fonts.ts`): dropped the unused `SOFT`/`WONK` Fraunces axes (they were
  forced off in CSS anyway) — smaller variable-font download, identical look.
  `display: swap` retained.
- **Preconnect** (`layout.tsx`): `preconnect` + `dns-prefetch` to `cdn.sanity.io`.
- **Long-cache headers** (`next.config.ts`): `/video/*` served
  `Cache-Control: public, max-age=31536000, immutable` — biggest lever for repeat
  views in slow regions.

### Expected after / targets
- Mobile **FCP < 1.8s** and **LCP < 2.5s (aiming < 2.0s)**: the LCP element drops
  from a multi-MB video / JS-gated heading to a **19 KB SSR poster**, and the hero
  payload on phones drops from **~12 MB → ~0** (poster only).
- **CLS stays 0** (poster is absolutely positioned and fills its box; no reserved-
  space shift). **INP unchanged** (less main-thread work if anything — video is
  deferred, parallax already off on touch).
- All imagery, alt text, schema and design are intact; the preloader was already
  skipped on touch (PR #24).

### Verify after deploy
- Lighthouse (mobile, throttled) on `https://mariposa.restaurant/` — confirm the
  LCP element is the hero poster and FCP/LCP are within target.
- DevTools → Network (Fast 3G, mobile) — confirm no `mariposa-hero-4k.mp4` request;
  `hero.webm` only loads on desktop/idle.
- Re-check **Vercel Speed Insights** in 24–48h for updated field P75.
