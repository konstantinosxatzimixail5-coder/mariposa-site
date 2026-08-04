# Meta (Facebook) Pixel — `974216358924953`

Ad-side tracking to sit next to the existing Google tags: base **PageView** plus
two conversions Ads Manager can optimise against — **Lead** (a reservation
request) and **Contact**.

## 1. Files

| File | Role |
|------|------|
| `src/lib/meta-pixel.ts` | The pixel id + `trackPixel()`, a safe client-side event helper |
| `src/components/MetaPixel.tsx` | Loads the base snippet, handles route-change PageViews and phone/e-mail clicks |
| `src/app/layout.tsx` | Mounts `<MetaPixel />` beside `GoogleTagManager` / `GoogleAnalytics` |
| `src/components/WhatsAppReservationForm.tsx` | Fires `Lead` |
| `src/components/ContactForm.tsx` | Fires `Contact` |
| `.env.example` | Documents the `NEXT_PUBLIC_META_PIXEL_ID` override |

The id is **baked into `src/lib/meta-pixel.ts`**, the same way `GTM-KB7XQXGB` and
`G-EJ1LSJ3489` live in `app/layout.tsx` — it is public by definition (it ships in
the browser snippet). Nothing needs to be set in Vercel for it to work.
`NEXT_PUBLIC_META_PIXEL_ID` overrides it; setting that var **empty** switches the
pixel off completely, which is what you want in `.env.local` so local traffic and
test bookings never reach Meta.

## 2. Events

| Event | Fires when | Params sent |
|-------|-----------|-------------|
| `PageView` | Every page load, **and** every client-side route change | — |
| `Lead` | "Reserve via WhatsApp" is clicked with the required fields filled | `content_name: "WhatsApp reservation request"`, `content_category: "reservation"`, `service_slot`, `num_guests` |
| `Contact` | The footer contact form is delivered successfully | `content_name: "Footer contact form"`, `content_category: "contact"` |
| `Contact` | Any `tel:` or `mailto:` link is clicked | `content_name: "Phone click"` / `"Email click"`, `content_category: "contact"` |

**No personal data is ever sent.** The guest's name, phone, e-mail, notes and
message body stay out of the payloads by design — only the channel, the service
window and the party size go to Meta. Keep it that way when adding events:
`trackPixel()`'s doc comment says so, and Meta's terms require it for anything
that isn't hashed Advanced Matching.

Two honest caveats when reading the numbers:

- `Lead` fires when the guest hands off to WhatsApp, which is the last thing the
  site can observe. It cannot know whether they actually pressed send in
  WhatsApp, so `Lead` counts *requests started*, not confirmed bookings.
- The phone/e-mail `Contact` fires on **every** click, so one determined guest
  tapping the number twice counts twice.

### Implementation notes

- **Phone/e-mail clicks** are caught by a single delegated listener on `document`
  (capture phase) in `MetaPixel.tsx`, because those links are rendered by *server*
  components in four places (footer address, footer icon row, "Prefer to call?",
  the menu's reservation modal). One listener covers all of them, and anything
  added later, without turning each into a client component.
- **Route changes**: the base snippet only runs once per full page load, so
  `usePathname()` mirrors App Router navigations as extra PageViews. The first
  run is skipped (the snippet already counted it) — but repeat visits to a path
  are not, so navigating menu → home still counts.

## 3. Where it loads — and where it doesn't

Mounted in the **root** layout, not the `(site)` group. That group contains only
the homepage; `/menu` sits outside it, so a pixel mounted there would unmount on
the way to the menu and leave it untracked once `MENU_PUBLISHED` flips on.

`MetaPixel` therefore excludes the one route it shouldn't touch itself: anything
under **`/studio`**, the Sanity CMS. That traffic is the owner's own and would
pollute the ad audiences and retargeting pools.

Loading is `afterInteractive`, matching GTM/GA4 — the tracker never competes with
the hero video for bandwidth, so the LCP work stays first. There is also a
`<noscript>` 1×1 beacon for visitors with JavaScript disabled.

## 4. Consent — read this

**The pixel loads for every visitor and does not wait for the cookie banner.**
That was a deliberate choice (maximum campaign data), and it is a departure from
how Google is wired on this site: `app/layout.tsx` defaults `ad_storage`,
`ad_user_data`, `ad_personalization` and `analytics_storage` to **denied** until
`CookieConsent.tsx` grants them.

Worth being aware of, since the site is Greek/EU and the pixel sets cookies and
sends the visitor's IP + browsing to Meta for advertising:

1. Under GDPR/ePrivacy this is the kind of tracker that normally needs prior
   consent. Running it unconditionally is a legal exposure to accept knowingly.
2. `CookieConsent.tsx` currently tells visitors *"You can accept analytics
   cookies or continue with only the essentials."* A visitor who clicks
   **Decline** is still tracked by Meta, so that copy no longer describes what
   the site does.

**To gate it later** (a small change, no rewrite): the banner already persists
the choice in `localStorage` under `"mariposa-consent"` (`"granted"` /
`"denied"`). Have `MetaPixel` read it, fold the result into the existing
`enabled` boolean, and re-render on the banner's decision — the base snippet then
injects only after Accept, and every `trackPixel()` call in the app stays a
harmless no-op until it does.

## 5. Verify after deploy

1. **Meta Pixel Helper** (Chrome extension) on `https://mariposa.restaurant/` —
   expect pixel `974216358924953`, one `PageView`, no warnings.
2. **Events Manager → Test Events**: enter the site URL, then
   - fill the reservation form and press *Reserve via WhatsApp* → `Lead`
   - send the footer contact form → `Contact`
   - tap the phone number → `Contact`
3. **Events Manager → Overview** after a day of traffic: `PageView` should track
   GA4 sessions roughly, and `Lead`/`Contact` should be non-zero.
4. Open **`/studio`** with Pixel Helper on — it must report *no* pixel.

Once `Lead` is arriving, set it as the conversion event for the campaigns
(Sales/Leads objective) rather than optimising for landing-page views.

## 6. Checks run

`pnpm typecheck` · `pnpm lint` · `pnpm build` all clean; `/` first-load JS
unchanged (281 kB). Verified in headless Chromium against a production build with
`fbevents.js` stubbed: exactly one `PageView` on load (no double-count), `Lead`
on reservation submit, `Contact` on both the form and a `tel:` click, extra
PageViews on `/` → `/menu` → back, no payload containing personal data, and
`/studio` free of `fbq`, the snippet, the beacon and any facebook.net request.
