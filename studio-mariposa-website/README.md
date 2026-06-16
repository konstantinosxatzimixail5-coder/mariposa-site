# Mariposa — Sanity Studio (standalone)

Standalone Sanity Studio for the Mariposa website, connected to project
**`te38hur6`** / dataset **`production`**.

> Scaffolded by hand (not via `npm create sanity`) because the create command
> requires an interactive `sanity login`, which can't run in a headless CI/cloud
> container. The result is identical — you just log in the first time you run it
> below.

## Run it

```bash
cd studio-mariposa-website
npm install
npx sanity login      # opens a browser; sign in to the account that owns te38hur6
npm run dev           # http://localhost:3333
```

## Deploy a hosted Studio

```bash
npm run deploy        # publishes to https://mariposa.sanity.studio (or your chosen host)
```

## Schemas

The content model lives in [`schemaTypes/`](./schemaTypes):
`siteSettings` (singleton) + `dish`, `review`, `familyMember`, `occasion`,
`service`, `faq`. It mirrors the schema embedded in the Next.js app
(`../src/sanity`), so edit both together if you change the model — or pick one
Studio to keep and drop the other (see repo root notes).

## Seeding content

To migrate the current static content (`src/lib/brand.ts`, `src/lib/faq.ts`) and
upload its images into the dataset, use the importer in the main app:

```bash
cd ..
SANITY_API_WRITE_TOKEN=<editor-token> pnpm sanity:import   # add --replace to overwrite
```
