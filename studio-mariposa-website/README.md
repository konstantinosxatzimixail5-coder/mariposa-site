# studio-mariposa-website

Standalone Sanity Studio for the Mariposa site (project `te38hur6`, dataset
`production`).

The site also ships an **embedded** Studio at `/studio` (see the repo root's
`sanity.config.ts` + `src/sanity`). This standalone project is an alternative
editing surface — handy for deploying a hosted Studio at `<name>.sanity.studio`
independent of the website deploy. Both share the same schema types
(`siteSettings`, `dish`, `testimonial`, `familyMember`, `occasion`, `service`),
so they stay in sync; edit either and the site reads the same dataset.

> Generated to match `npm create sanity@latest -- --project te38hur6 --dataset production --template clean --typescript --output-path studio-mariposa-website`.
> The official CLI couldn't run in the build container (it requires an
> interactive `sanity login`, and the container's network egress blocks the
> Sanity API), so the files were written by hand from the repo's schemas.

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

## Seeding the dataset

Run the migration from the **repo root** (it lives there, alongside the site):

```bash
npx sanity login
npm run seed         # = sanity exec scripts/seed.ts --with-user-token
```

…or trigger the **Sanity import** GitHub Actions workflow (needs the
`SANITY_AUTH_TOKEN` repo secret).
