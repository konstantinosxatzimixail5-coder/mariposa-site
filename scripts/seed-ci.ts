/**
 * CI variant of scripts/seed.ts.
 *
 * Identical content migration, but instead of the Sanity CLI's
 * `--with-user-token` (which reads a logged-in session and isn't reliably
 * populated from env in CI), this builds a client from an explicit token in
 * `SANITY_AUTH_TOKEN`. That makes it runnable head-lessly on GitHub Actions.
 *
 *     SANITY_AUTH_TOKEN=<editor token> pnpm seed:ci
 *
 * Idempotent: deterministic ids + createOrReplace, so it is safe to re-run.
 * Local images referenced in brand.ts are uploaded as assets when present.
 */
import { createReadStream, existsSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "next-sanity";
import { BRAND } from "../src/lib/brand";

const token = process.env.SANITY_AUTH_TOKEN;
if (!token) {
  console.error("✗ SANITY_AUTH_TOKEN is not set. Provide a Sanity Editor token.");
  process.exit(1);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "te38hur6",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-06-16",
  token,
  useCdn: false,
});

const PUBLIC = join(process.cwd(), "public");

type ImageValue = { _type: "image"; asset: { _type: "reference"; _ref: string } };
const assetCache = new Map<string, string>();

async function uploadImage(publicPath: string): Promise<ImageValue | undefined> {
  if (!publicPath) return undefined;
  const filePath = join(PUBLIC, publicPath.replace(/^\//, ""));
  if (!existsSync(filePath)) {
    console.warn(`  ↳ skip image (not found): ${publicPath}`);
    return undefined;
  }
  let assetId = assetCache.get(filePath);
  if (!assetId) {
    const asset = await client.assets.upload("image", createReadStream(filePath), {
      filename: publicPath.split("/").pop(),
    });
    assetId = asset._id;
    assetCache.set(filePath, assetId);
  }
  return { _type: "image", asset: { _type: "reference", _ref: assetId } };
}

async function run() {
  const tx = client.transaction();

  // Site settings (singleton)
  tx.createOrReplace({
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
    phoneHref: BRAND.phoneHref,
    email: BRAND.email,
    emailHref: BRAND.emailHref,
    whatsapp: BRAND.whatsapp,
    reservationUrl: BRAND.reservationUrl,
    tripadvisorUrl: BRAND.tripadvisorUrl,
    googleReviewsUrl: BRAND.googleReviewsUrl,
    googleMapsSearch: BRAND.googleMapsSearch,
    menuUrl: BRAND.menuUrl,
    social: { ...BRAND.social },
    rating: BRAND.rating,
    reviewCount: BRAND.reviewCount,
    award: BRAND.award,
    ranking: BRAND.ranking,
    googleReview: { ...BRAND.googleReview },
    address: { ...BRAND.address },
    geo: { ...BRAND.geo },
    hours: { ...BRAND.hours },
  });

  // Dishes
  for (let i = 0; i < BRAND.dishes.length; i++) {
    const d = BRAND.dishes[i]!;
    const image = await uploadImage(d.image);
    tx.createOrReplace({
      _id: `dish.${d.slug}`,
      _type: "dish",
      name: d.name,
      slug: { _type: "slug", current: d.slug },
      tagline: d.tagline,
      note: d.note,
      ...(image ? { image } : {}),
      review: { ...d.review },
      order: i,
    });
  }

  // Reviews
  BRAND.reviews.forEach((r, i) => {
    tx.createOrReplace({
      _id: `testimonial.${i}`,
      _type: "testimonial",
      quote: r.quote,
      author: r.author,
      city: r.city,
      order: i,
    });
  });

  // Services
  for (let i = 0; i < BRAND.services.length; i++) {
    const s = BRAND.services[i]!;
    const image = await uploadImage(s.image);
    tx.createOrReplace({
      _id: `service.${s.label.toLowerCase()}`,
      _type: "service",
      label: s.label,
      time: s.time,
      opens: s.opens,
      closes: s.closes,
      line: s.line,
      ...(image ? { image } : {}),
      order: i,
    });
  }

  // Occasions
  BRAND.occasions.forEach((o, i) => {
    tx.createOrReplace({
      _id: `occasion.${o.value}`,
      _type: "occasion",
      value: o.value,
      title: o.title,
      line: o.line,
      order: i,
    });
  });

  // Family
  for (let i = 0; i < BRAND.family.length; i++) {
    const m = BRAND.family[i]!;
    const image = await uploadImage(m.image);
    tx.createOrReplace({
      _id: `familyMember.${m.name.toLowerCase()}`,
      _type: "familyMember",
      name: m.name,
      role: m.role,
      line: m.line,
      ...(image ? { image } : {}),
      order: i,
    });
  }

  const result = await tx.commit();
  console.log("✓ Seed complete — content written to the dataset.");
  console.log("  commit results:", result.results?.length ?? "n/a");

  // Verify, with the authenticated client, what now exists in the dataset.
  const cfg = client.config();
  const verify = await client.fetch(`{
    "dishCount": count(*[_type == "dish"]),
    "dishIds": *[_type == "dish"]._id,
    "draftDishIds": *[_id in path("drafts.**") && _type == "dish"]._id
  }`);
  console.log("  VERIFY target:", JSON.stringify({ projectId: cfg.projectId, dataset: cfg.dataset }));
  console.log("  VERIFY result:", JSON.stringify(verify));
}

run().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
