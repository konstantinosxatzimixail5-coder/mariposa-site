/**
 * One-off content migration: pushes the canonical values in src/lib/brand.ts
 * into the Sanity dataset (project te38hur6 / production), so the site — which
 * already reads from Sanity with a BRAND fallback — starts serving editable
 * content.
 *
 * Run it with the Sanity CLI, which compiles this TS file and injects an
 * authenticated client from your logged-in session:
 *
 *     npx sanity login            # once
 *     npm run seed                # = sanity exec scripts/seed.ts --with-user-token
 *
 * It is idempotent: documents use deterministic ids and are createOrReplace'd,
 * so you can re-run it safely. Local images referenced in brand.ts are uploaded
 * as assets when the file exists under /public.
 */
import { createReadStream, existsSync } from "node:fs";
import { join } from "node:path";
import { getCliClient } from "sanity/cli";
import { BRAND } from "../src/lib/brand";

const client = getCliClient({ apiVersion: "2025-06-16" });
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

  await tx.commit();
  console.log("✓ Seed complete — content written to the dataset.");
}

run().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
