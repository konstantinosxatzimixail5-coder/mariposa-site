# Mariposa — Asset Inventory (from WordPress/Elementor export)

Source: `mariposarestaurant.WordPress.2026-06-09.xml` (the live site export) +
Tripadvisor. This catalogues every real asset found, every gap, and the
placeholders I need you to supply before the production build.

---

## ✅ VERIFIED FACTS (locked — extracted from the export, do not invent)

- **Owner / chef:** **Konstantinos "Ntinos" Diakosavvas** (WP author `ntinos`,
  display name "Ntinos Diakosavvas"). *Please confirm spelling + how you want it
  shown — "Konstantinos" or "Ntinos".*
- **Email:** `mariposa.rhodos@gmail.com`
- **Tel / WhatsApp:** `+30 6906489686`
- **Address:** Epar.Od. Ialisou-Katavias (Ρόδου–Καμείρου, 20th km), **Theologos
  85106, Rhodes, Greece**
- **Cuisine:** Mediterranean / Greek / European; vegetarian-friendly, vegan options
- **Setting:** outdoor garden terrace under vines, near the beach, Aegean views;
  adjacent **"Mariposa Garden"** grows the kitchen's vegetables
- **Reputation:** **4.9★ · 288 Tripadvisor reviews · Travelers' Choice 2025**
- **Live booking:** the old site is on `simplo.gr` — **no standalone reservation
  URL found.** Still a placeholder (gap #4 below).

### Hours — ⚠️ CONFLICT to resolve
Two different hours appear in the export:
- **Contact / home page:** Breakfast 09:00–11:30 · Lunch 12:00–15:30 · Dinner 18:00–23:00
- **Menu page footer:** "OPEN DAILY 13:00 – 24:00"

Currently using the three-service split (matches the brief's VERIFIED FACTS).
**Which is correct?** (The brief says "Elementor export wins if it differs" —
but the export itself disagrees with itself.)

---

## 📸 IMAGES FOUND (restaurant's own photography — canonical)

Hosted on `mariposa.restaurant/wp-content/uploads/2025/01/`. **Not yet
downloaded into `public/images/`** — they're remote URLs in the export.

### Named dish photography (5)
| Title in export | File |
|---|---|
| Ossobuco alla Milanese | `DSE01583-scaled-1.webp` |
| Octopus with Fava | `DSE01641-scaled-1.webp` |
| Zucchini balls | `DSE01698-scaled-e1695324220548.webp` |
| Green Apple Salad | `DSE01759-scaled-e1695323580708.webp` |
| Garlic Shrimp Spaghetti | `DSE01815-scaled-1.webp` |

### Interior / garden / ambience photography (~10, unnamed `DSE0xxxx`)
`DSE01434-1`, `DSE01440-2`, `DSE01384-1`, `DSE01549`, `DSE01394-1`,
`DSE01404-2`, `DSE01457-1`, `DSE01498`, `DSE01499-2-1` (all `-scaled-1.webp`).
→ Use for Philosophy parallax, Garden scene, Reservation backdrop, OG image.

### Logo / brand mark (canonical 2D — keep untouched)
- `mariposa-trademark.webp`, `mariposa-trademark-white-1-1.webp`,
  `MARIPOSA-LOGO-1.webp`, `cropped-mariposa-trademark.webp`,
  `mariposa-restaurant-white.png`
- SVG marks: `svgviewer-output.svg`, `-1.svg`, `-2.svg`
- *Current site uses a redrawn `ButterflyMark.tsx` — swap in the real
  trademark/SVG to be fully faithful.*

### Hero video (film-grade — already exists!)
- **`Mariposa-Restaurant-Web-Site-Home-Page-4K-1.mp4`** — the client's own 4K
  hero loop. This can either replace or sit alongside the Remotion-rendered loop.

---

## 📝 REAL COPY EXTRACTED (use verbatim / lightly refined)

- **Intro (home H3):** "At Mariposa, you can enjoy a delightful dining experience
  in our lush garden, all while taking in breathtaking views of the Aegean Sea…"
- **Chef's Words:** "As chefs at Mariposa, we believe that great food starts with
  respect for the ingredients and the land that provides them. We handpick the
  freshest, locally sourced produce from our garden…"
- **Page SEO title:** "Farm-to-Table Greek Cuisine in Rhodes – Mariposa Restaurant"
- ⚠️ Note: the original copy uses several **stop-slop banned words** ("delightful",
  "breathtaking", "a celebration of", "not just a meal but…"). Per the brief,
  site copy is rewritten in the sharper voice — the export copy is reference for
  *facts*, not phrasing.

### Full menu with prices (bilingual EN/GR) — found on the Menu page
**Starters (Πρώτα):** Burrata & Heirloom Tomato €14 · Charred Octopus €18 ·
Stuffed Zucchini Flowers €12 · Honey Saganaki €13
**Salads (Σαλάτες):** Mariposa Garden Salad €11 · Watermelon & Feta €12 ·
Roasted Beetroot & Goat Cheese €13
**Main (Κυρίως):** Slow-Braised Lamb Shank €28 · Aegean Sea Bass €26 ·
Wild Mushroom Risotto €22 · Black Angus Ribeye €34
**Dessert (Γλυκά):** Pistachio Baklava Cheesecake €10 · Dark Chocolate Soufflé €12 ·
Lemon & Thyme Panna Cotta €9

*Note: this published menu differs from the brief's "signature dishes guests
name" list (octopus, zucchini balls w/ crab, beef stifado, moussaka, saffron
risotto w/ scampi, sea bass, cheese-almond-lemon-marmalade starter). Which set
should the Dishes section feature — the published menu, or the guest-favourite
list?*

---

## 🔗 SOCIAL / EXTERNAL
- Tripadvisor: `https://www.tripadvisor.com/Restaurant_Review-g7365216-d21208087-Reviews-Mariposa_Restaurant-Theologos_Rhodes_Dodecanese_South_Aegean.html`
- Facebook: `mariposa.restaurant.rhodes`
- Instagram: `@mariposa.restaurant`

---

## ❗ GAPS / PLACEHOLDERS I NEED FROM YOU

| # | Item | Status / blocker |
|---|------|------------------|
| 1 | **Download the real photography** into `public/images/` | URLs known; not yet pulled. Confirm you're OK with me fetching from `mariposa.restaurant`. |
| 2 | **Hours conflict** | Two versions in the export (see above) — which is live? |
| 3 | **Dishes selection** | Published menu vs. guest-favourite list — which to feature? |
| 4 | **Live reservation URL** | None in export (old site = simplo.gr). Still `#reserve`. |
| 5 | **Owner name spelling** | "Konstantinos" vs "Ntinos" Diakosavvas — and is "his wife runs the kitchen" (per brief) accurate to print? |
| 6 | **Reviews permission** | Tripadvisor excerpts are real but need owner permission or the official widget/API for production. |
| 7 | **Exact map pin** | Refine `BRAND.geo` from the Google embed coords. |
| 8 | **Use client 4K hero video?** | `…Home-Page-4K-1.mp4` exists — use it, the Remotion loop, or both? |

---

## DECISIONS LOCKED (this build)
- Standalone Next.js 15 app in `./mariposa`.
- Fraunces (display) + Inter (body), self-hosted.
- 2D butterfly mark stays canonical; procedural R3F butterfly is the hero 3D
  treatment; Remotion renders the cinematic background loop.

---

## 🗺️ IMAGE → SECTION MAP (Delta v4, current build)

Pool actually present in `public/images/`: **5 dish photos**, **9 garden/interior
photos** (`garden-01`…`garden-09`), logos, `public/video/mariposa-hero-4k.mp4`.

### Dish photography (5) — each shown ONCE, only in Menu/Signature Plates
The Experience no longer borrows these; it uses garden ambience shots instead,
so no dish photo repeats anywhere on the page.
| File | Menu plate (Dishes) |
|---|---|
| `octopus-fava.webp` | Grilled Octopus |
| `zucchini-balls.webp` | Zucchini Balls with Crab |
| `ossobuco.webp` | Beef Stifado *(placeholder — see gap A)* |
| `garlic-shrimp-spaghetti.webp` | Saffron Risotto with Scampi |
| `green-apple-salad.webp` | Refined Moussaka *(placeholder — see gap B)* |

### Garden / interior photography (9) — now deduped, each index used once
| Index | Section · slot |
|---|---|
| `gallery[0]` garden-01 | Garden — lead composition (top tile) |
| `gallery[1]` garden-02 | Garden — lead composition (lower tile) |
| `gallery[2]` garden-03 | Garden — beat "The Garden" |
| `gallery[3]` garden-04 | Garden — beat "The Menu" |
| `gallery[4]` garden-05 | Garden — beat "The Setting" |
| `gallery[5]` garden-06 | The Experience — **Breakfast** service cut-out |
| `gallery[6]` garden-07 | The Experience — **Lunch** service cut-out |
| `gallery[7]` garden-08 | The Experience — **Dinner** service cut-out |
| `gallery[8]` garden-09 | Celebrations — cover image |

Hero background: `mariposa-hero-4k.mp4` (HeroVideo, decorative, reduced-motion off).
Removed the non-existent `/video/hero.webm` `<source>` (was a guaranteed 404).

### Within-page duplicates — RESOLVED
- Garden previously reused `gallery[7]` and `gallery[4]` twice each (lead +
  beats). Reassigned to unique indices `[0],[1]` (lead) and `[2],[3],[4]` (beats).

### Remaining unavoidable overlap (logged, not a bug)
- RESOLVED (Delta v5): The Experience's three service cut-outs (B/L/D) now use
  the previously-spare garden ambience shots `garden-06/07/08` instead of the
  dish photos. No photograph now appears twice anywhere on the page. The pool is
  fully allocated: 5 dish photos (Menu only) + 9 garden shots (5 Garden, 3 The
  Experience, 1 Celebrations).

## ❗ NEW GAPS (Delta v4)

- **Gap A — Beef Stifado photo:** mapped to `ossobuco.webp` (a braised-meat
  stand-in). Visually close but not the real dish. Replace when supplied.
- **Gap B — Refined Moussaka photo:** mapped to `green-apple-salad.webp` — the
  **weakest** mapping (a salad standing in for a layered bake). High-priority
  swap; only used because no moussaka photo exists in the export.
- **Family portraits (5):** `public/images/family/{despoina,konstantin,mara,
  nickolas,salvatore}.webp` are referenced by `BRAND.family` but **not present** —
  TheFamily renders designed monogram placeholders until the client sends photos.
- **Contact endpoint:** footer form posts to `/api/contact` (placeholder ack);
  wire `BRAND.contactEndpoint` to the real inbox/integration for production.
- **Google reviews URL:** `BRAND.googleReviewsUrl` is `GOOGLE_REVIEWS_URL`;
  Reviews falls back to a Maps search until the live profile link is supplied.
