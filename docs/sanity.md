# Sanity CMS

Mariposa's editable content lives in Sanity (project `te38hur6`, dataset
`production`). The Studio is a **standalone project** in `studio-mariposa-website/`;
the Next.js site reads the same dataset via `next-sanity`.

## Layout

| Path | What |
| --- | --- |
| `studio-mariposa-website/` | Standalone Sanity Studio (config, schemas, desk). Run/deploy from here. |
| `src/sanity/env.ts` | Project id / dataset / API version (public; literals are build defaults) |
| `src/sanity/lib/` | `client`, `image` (urlFor), `queries` (GROQ) — the site's read path |
| `src/app/(site)/` | The public marketing site (route group) |
| `src/lib/content.ts` | Fetchers that read Sanity and **fall back to `BRAND`/`FAQS`** |
| `scripts/sanity-import.ts` | One-shot seeder (`pnpm sanity:import`) |

## How the site reads content

`src/app/(site)/page.tsx` fetches the collections (dishes, reviews, services,
occasions, family, FAQs) and passes them to the sections. Each fetcher in
`content.ts` returns Sanity data, or the static `BRAND`/`FAQS` data when the
dataset is empty or unreachable — so the site renders identically until content
is entered, then switches over automatically. The page uses ISR
(`revalidate = 60`), so published edits appear within a minute without a
redeploy.

The `siteSettings` singleton (name, tagline, contact, address, geo, hours,
ratings/award, social, menu/hero URLs) is also wired through `getSettings()`
into the Hero, Footer, Reservation, Testimonials, SiteNav, the page metadata
(`generateMetadata`) and the Restaurant JSON-LD — all with the same
fall-back-to-`BRAND` behaviour. Only the static art-direction gallery
(`BRAND.gallery`, used by Garden/Celebrations) is intentionally left in code.

## First-time setup

1. **Editing access** — run the Studio and sign in with the account that owns
   project `te38hur6`:
   ```bash
   cd studio-mariposa-website
   npm install
   npx sanity login
   npm run dev        # http://localhost:3333  (npm run deploy → <name>.sanity.studio)
   ```
2. **Seed the dataset from the current site content** (one time, from the repo root):
   - Create an **Editor** token: https://www.sanity.io/manage → project
     `te38hur6` → API → Tokens.
   - Add it to `.env.local`: `SANITY_API_WRITE_TOKEN=...`
   - Run `pnpm sanity:import` (add `--replace` to overwrite existing docs).
   - This creates every document and uploads the images referenced in `BRAND`.
3. **CORS** — in the Sanity manage console add your site origins (e.g.
   `http://localhost:3333`, `http://localhost:3000` and the production URL) under
   API → CORS origins so the Studio can talk to the dataset from the browser.

## Env vars

See `.env.example`. `NEXT_PUBLIC_SANITY_*` are public; `SANITY_API_WRITE_TOKEN`
is only needed to run the importer (or to read a private dataset).
