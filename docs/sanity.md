# Sanity CMS

Mariposa's editable content lives in Sanity (project `te38hur6`, dataset
`production`). The Studio is **embedded** in this Next.js app — no separate
deploy.

## Layout

| Path | What |
| --- | --- |
| `sanity.config.ts` / `sanity.cli.ts` | Studio + CLI config |
| `src/sanity/env.ts` | Project id / dataset / API version (public; literals are build defaults) |
| `src/sanity/schemaTypes/` | Schemas: `siteSettings` (singleton), `dish`, `review`, `familyMember`, `occasion`, `service`, `faq` |
| `src/sanity/lib/` | `client`, `image` (urlFor), `queries` (GROQ) |
| `src/sanity/structure.ts` | Studio desk (Site Settings as a singleton) |
| `src/app/studio/[[...tool]]/` | Embedded Studio route → **`/studio`** |
| `src/app/(site)/` | The public marketing site (route group, so the Studio skips its chrome) |
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

> Scalar brand facts (address, phone, ratings, gallery) still come from
> `src/lib/brand.ts` because they also feed the SEO metadata and Restaurant
> JSON-LD. The `siteSettings` singleton is modelled and seeded, ready to wire
> those through next if desired.

## First-time setup

1. **Editing access** — open `/studio` (locally: `pnpm dev` → http://localhost:3000/studio)
   and sign in with the Sanity account that owns project `te38hur6`.
2. **Seed the dataset from the current site content** (one time):
   - Create an **Editor** token: https://www.sanity.io/manage → project
     `te38hur6` → API → Tokens.
   - Add it to `.env.local`: `SANITY_API_WRITE_TOKEN=...`
   - Run `pnpm sanity:import` (add `--replace` to overwrite existing docs).
   - This creates every document and uploads the images referenced in `BRAND`.
3. **CORS** — in the Sanity manage console add your site origins (e.g.
   `http://localhost:3000` and the production URL) under API → CORS origins so
   the Studio can talk to the dataset from the browser.

## Env vars

See `.env.example`. `NEXT_PUBLIC_SANITY_*` are public; `SANITY_API_WRITE_TOKEN`
is only needed to run the importer (or to read a private dataset).
