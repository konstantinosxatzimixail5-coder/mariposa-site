# studio-mariposa-website

Standalone Sanity Studio for the Mariposa site (project `te38hur6`, dataset
`production`). This is the editing UI; the public site reads the same dataset
via `next-sanity` in the parent app.

> Generated to match `npm create sanity@latest -- --project te38hur6 --dataset production --template clean --typescript --output-path studio-mariposa-website`.
> The official CLI couldn't run in the build container (it requires an
> interactive `sanity login`), so the same files were written by hand. The
> schemas are shared with the parent app's embedded Studio.

## Run it

```bash
cd studio-mariposa-website
npm install
npx sanity login     # one-time browser auth for project te38hur6
npm run dev          # http://localhost:3333
```

## Deploy it (hosted at <name>.sanity.studio)

```bash
npm run deploy
```

## Schemas

`siteSettings` (singleton) + `dish`, `review`, `familyMember`, `occasion`,
`service`, `faq` — see `schemaTypes/`. To seed the dataset from the site's
current content, run `pnpm sanity:import` from the **parent** repo (needs a
`SANITY_API_WRITE_TOKEN`).
