# Google Ads conversions — code side

The site now pushes four named conversion events onto the dataLayer, and the GTM
container was swapped to the one that will carry the Google Ads tags.

**Nothing is counted in Google Ads yet.** The remaining work is in the GTM UI and
Google Ads (section 4), and it needs a conversion ID + labels that don't exist
until the three conversion actions are created.

## 1. What changed

| File | Change |
|------|--------|
| `src/app/layout.tsx` | `GTM-KB7XQXGB` → **`GTM-NQWTBSMG`**; mounts `<ConversionLinks />` |
| `src/lib/tracking.ts` | *new* — `trackConversion()`, the dataLayer push |
| `src/components/ConversionLinks.tsx` | *new* — one delegated listener for phone / e-mail / WhatsApp link clicks, reporting to **both** Meta and GTM |
| `src/components/MetaPixel.tsx` | the phone/e-mail listener moved out to `ConversionLinks` |
| `src/components/WhatsAppReservationForm.tsx` | fires `reservation_request` |
| `src/components/ContactForm.tsx` | fires `contact_form_submit` |
| `src/app/(site)/layout.tsx` · `package.json` | `<SpeedInsights />` and its dependency removed (section 6) |

### Events on the dataLayer

| Event | Fires when | Payload |
|-------|-----------|---------|
| `reservation_request` | "Reserve via WhatsApp", **after** validation passes | `guests`, `service`, `booking_date` |
| `phone_click` | any `tel:` link | — |
| `whatsapp_click` | a standalone `wa.me` link (footer icon, menu page) | — |
| `contact_form_submit` | the contact form is delivered (not on click) | — |

No personal data in any payload — never the guest's name, number, notes or
message. `guests` is there so a 6-cover booking can later be valued above a
2-cover one instead of both counting the same.

Meta keeps firing independently from `meta-pixel.ts`: `Lead` on the same
reservation submit, `Contact` on the contact form and on phone/e-mail clicks.
Neither platform can take the other down.

## 2. Four deviations from the spec, and why

The plan this came from was sound, but implementing it verbatim would have caused
real damage. What was changed:

1. **The Meta `Lead` event was kept.** The spec's replacement `handleReserve`
   omitted `trackPixel("Lead", …)`, which would have deleted the Meta conversion
   to gain the Google one.
2. **Validation was kept.** The spec called a `buildWhatsAppUrl()` that doesn't
   exist here and skipped the `name / phone / date / slot` checks — conversions
   would have fired on empty forms. `trackConversion` now sits *after* the guard.
   (Verified: an empty submit counts nothing.)
3. **`window.open` was kept instead of `window.location.href`.** Two reasons.
   The guest stays on the site rather than being navigated away — and it is
   *better* for tracking, because a surviving page lets both beacons finish at
   leisure. Deferring the open into an `eventCallback` would also have been
   eaten by popup blockers, which only permit `window.open` inside the user's own
   gesture.
4. **The GTM-loaded check is `window.google_tag_manager`, not `dataLayer`.**
   Testing `dataLayer` would never have worked here: the Consent Mode stub in
   `layout.tsx` creates it on every load, blocker or not — so every visitor with
   GTM blocked would have waited out the full 1s timeout before their phone call
   started.

**A fifth, structural one:** the spec's `<TrackedLink>` wrapper was not used. It
intercepts the click with `preventDefault` and re-navigates, which buys nothing
for these links — `tel:`/`mailto:` are handed to the OS and the WhatsApp links
open in a new tab, so **none of them unload the page** and the beacons complete
regardless. A single delegated listener in `ConversionLinks.tsx` covers all five
link sites (three on the homepage, two more on the menu page) with no extra
client components, no `target="_blank"` lost, and no modifier-key handling to get
wrong. `trackConversion` still accepts an optional `next` callback with the full
`eventCallback` + timeout guard, for the day a conversion does precede a real
same-tab navigation.

Because the reservation control is a `<button>` and not an anchor, it cannot
match the link listener — which is what stops a booking being counted twice, as
both `reservation_request` and `whatsapp_click`. (Verified.)

## 3. The container swap

`GTM-KB7XQXGB` → `GTM-NQWTBSMG`, one string in `app/layout.tsx`. Safe from the
code's side: nothing in the repo reads the container — no `sendGTMEvent`, no
dataLayer consumers. GA4 (`G-EJ1LSJ3489`) and the Meta Pixel are both loaded
directly in `app/layout.tsx` and are unaffected.

Two things to keep in mind:

- **Whatever lived inside the old container stopped firing.** That can only be
  checked in the GTM UI, not here. If `GTM-KB7XQXGB` held anything — remarketing,
  Clarity, a verification tag — recreate it in the new container.
- **Do not add a GA4 configuration tag to `GTM-NQWTBSMG`.** GA4 is hard-coded;
  a container tag would double-count every pageview.

## 4. What's left — GTM and Google Ads

First create the three conversion actions (**Goals → Conversions → New conversion
action → Website**), then read the ID and labels off each action's
**Tag setup → Use Google Tag Manager** screen:

| Conversion action | Category | Count |
|---|---|---|
| Reservation Request (WhatsApp) | Submit lead form | One |
| Phone Call Click | Phone call lead | One |
| WhatsApp Chat Start | Contact | One |

Then, in `GTM-NQWTBSMG`:

1. **Conversion Linker** tag, trigger *All Pages*. Build it first — without it
   attribution silently degrades.
2. **Custom Event triggers**, names matching `tracking.ts` exactly:
   `reservation_request`, `phone_click`, `whatsapp_click`.
3. **Data Layer Variables** for `guests` and `service`.
4. **Three Google Ads Conversion Tracking tags**, one per trigger, currency EUR.
   Derive the values from `avg spend per cover × avg party size × show-up rate` —
   the *ratio* between the three matters more than the absolute numbers.
5. **Submit → Publish.** An unpublished container does nothing.

`contact_form_submit` is on the dataLayer but has no conversion action yet; wire
it as a Secondary action if you want it.

## 5. Consent — this affects the numbers

`app/layout.tsx` defaults `ad_storage`, `ad_user_data` and `ad_personalization`
to **denied** on every load until the visitor accepts the cookie banner. Google
Ads conversion tags that fire in that state write no cookies: the conversions get
modeled rather than attributed to a click, so **Smart Bidding will be learning
from partial data** for every visitor who doesn't press Accept.

Nothing here is broken — it's how Consent Mode is meant to work — but it caps how
much the Ads side can ever see, and it's worth deciding deliberately rather than
discovering later. (The Meta Pixel, by contrast, was deliberately left ungated;
see `SUMMARY-meta-pixel.md`.)

It also affects **how you verify**: in a fresh browser where you haven't pressed
Accept, the network request to `googleads.g.doubleclick.net/pagead` may look
missing or different. Press Accept first, then measure.

## 6. Speed Insights removed

`POST …/vitals` was returning **503** on every page load: `@vercel/speed-insights`
posts to `/speed-insights/vitals`, which 503s unless Speed Insights is enabled for
the Vercel project. The component and the dependency are gone, so the failing
request is too. To bring it back, enable Speed Insights in the Vercel project
first, then re-add `<SpeedInsights />` to `(site)/layout.tsx`.

## 7. Checks run

`pnpm typecheck` · `pnpm lint` · `pnpm build` clean. Verified in headless Chromium
against a production build, with GTM and `fbevents.js` stubbed:

- `gtm.js` loads `GTM-NQWTBSMG`; `GTM-KB7XQXGB` appears nowhere.
- One `phone_click`, one `whatsapp_click`, one `contact_form_submit`.
- One `reservation_request`, carrying `guests: 6`, `service`, `booking_date` and
  no PII — and **zero** from an empty submit.
- The reservation did **not** also fire `whatsapp_click`.
- Meta still fired `Lead` ×1 and `Contact` ×2 alongside.
- `window.open` still called with `_blank` (not a same-tab navigation).
- With GTM **and** Meta blocked outright: events still queue for a late container,
  click → `window.open` measured in-page at **0.4 ms**, no console errors.
