/**
 * One-shot importer: seeds the Sanity dataset from the static `BRAND` / `FAQS`
 * data and uploads the images they reference from `public/`.
 *
 * Usage:
 *   1. Create an Editor token: sanity.io/manage → project te38hur6 → API → Tokens
 *   2. Add it to .env.local as SANITY_API_WRITE_TOKEN=...
 *   3. pnpm sanity:import        (add --replace to overwrite existing docs)
 *
 * Idempotent: documents use deterministic ids, so re-running with --replace
 * refreshes content in place rather than duplicating it.
 */
import { createReadStream, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { createClient } from "next-sanity";

import { BRAND } from "../src/lib/brand";
import { FAQS } from "../src/lib/faq";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "te38hur6";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;
const replace = process.argv.includes("--replace");

if (!token) {
  console.error(
    "✗ SANITY_API_WRITE_TOKEN is not set. Create an Editor token in the Sanity\n" +
      "  manage console and add it to .env.local, then re-run.",
  );
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion: "2025-06-16", token, useCdn: false });

const publicDir = path.resolve(fileURLToPath(new URL("../public", import.meta.url)));
const assetCache = new Map<string, string>();

/** Upload a /images/... path from public/ and return a Sanity image field. */
async function imageField(relPath?: string) {
  if (!relPath) return undefined;
  const file = path.join(publicDir, relPath.replace(/^\//, ""));
  if (!existsSync(file)) {
    console.warn(`  ! missing image, skipping: ${relPath}`);
    return undefined;
  }
  let assetId = assetCache.get(relPath);
  if (!assetId) {
    const asset = await client.assets.upload("image", createReadStream(file), {
      filename: path.basename(file),
    });
    assetId = asset._id as string;
    assetCache.set(relPath, assetId);
  }
  return { _type: "image", asset: { _type: "reference", _ref: assetId } };
}

async function put(doc: Record<string, unknown> & { _id: string; _type: string }) {
  if (replace) await client.createOrReplace(doc);
  else await client.createIfNotExists(doc);
}

async function main() {
  console.log(`→ Importing into ${projectId}/${dataset}${replace ? " (replace)" : ""}\n`);

  // Site settings singleton
  await put({
    _id: "siteSettings",
    _type: "siteSettings",
    name: BRAND.name,
    legalName: BRAND.legalName,
    tagline: BRAND.tagline,
    meaning: BRAND.meaning,
    cuisine: BRAND.cuisine,
    owner: BRAND.owner,
    ownerRole: BRAND.ownerRole,
    phone: BRAND.phone,
    email: BRAND.email,
    whatsapp: BRAND.whatsapp,
    reservationUrl: BRAND.reservationUrl,
    menuUrl: BRAND.menuUrl,
    social: { ...BRAND.social },
    address: { ...BRAND.address },
    geo: { _type: "geopoint", lat: BRAND.geo.lat, lng: BRAND.geo.lng },
    rating: BRAND.rating,
    reviewCount: BRAND.reviewCount,
    award: BRAND.award,
    ranking: BRAND.ranking,
    tripadvisorUrl: BRAND.tripadvisorUrl,
    googleReviewsUrl: BRAND.googleReviewsUrl,
    googleMapsSearch: BRAND.googleMapsSearch,
    googleReview: { ...BRAND.googleReview },
    hours: { ...BRAND.hours },
    heroVideo: BRAND.heroVideo,
  });
  console.log("✓ siteSettings");

  for (const [i, d] of BRAND.dishes.entries()) {
    await put({
      _id: `dish-${d.slug}`,
      _type: "dish",
      name: d.name,
      slug: { _type: "slug", current: d.slug },
      order: i,
      tagline: d.tagline,
      note: d.note,
      image: await imageField(d.image),
      review: { ...d.review },
      media: { ...d.media },
    });
  }
  console.log(`✓ ${BRAND.dishes.length} dishes`);

  for (const [i, r] of BRAND.reviews.entries()) {
    await put({ _id: `review-${i}`, _type: "review", order: i, quote: r.quote, author: r.author, city: r.city });
  }
  console.log(`✓ ${BRAND.reviews.length} reviews`);

  for (const [i, m] of BRAND.family.entries()) {
    await put({
      _id: `family-${i}`,
      _type: "familyMember",
      order: i,
      name: m.name,
      role: m.role,
      line: m.line,
      image: await imageField(m.image),
    });
  }
  console.log(`✓ ${BRAND.family.length} family members`);

  for (const [i, o] of BRAND.occasions.entries()) {
    await put({ _id: `occasion-${o.value}`, _type: "occasion", order: i, value: o.value, title: o.title, line: o.line });
  }
  console.log(`✓ ${BRAND.occasions.length} occasions`);

  for (const [i, s] of BRAND.services.entries()) {
    await put({
      _id: `service-${i}`,
      _type: "service",
      order: i,
      label: s.label,
      time: s.time,
      opens: s.opens,
      closes: s.closes,
      line: s.line,
      image: await imageField(s.image),
    });
  }
  console.log(`✓ ${BRAND.services.length} services`);

  for (const [i, f] of FAQS.entries()) {
    await put({ _id: `faq-${i}`, _type: "faq", order: i, question: f.q, answer: f.a });
  }
  console.log(`✓ ${FAQS.length} FAQs`);

  console.log("\n✔ Import complete.");
}

main().catch((err) => {
  console.error("\n✗ Import failed:", err.message);
  process.exit(1);
});
