import "server-only";
import { client } from "@/sanity/lib/client";
import { BRAND, type SiteContent } from "@/lib/brand";
import { MENU, type MenuSection } from "@/lib/menu";

const MENU_QUERY = /* groq */ `*[_type == "menuSection"]|order(order asc){
  title,
  subtitle,
  "items": items[]{
    name, description, price, vegetarian, vegan, glutenFree, rating, reviewCount,
    "photo": photo.asset->url,
    "plated": plated.asset->url,
    "detail": detail.asset->url,
    "video": video.asset->url,
    "spin": spin[].asset->url,
    reviews[]{ author, quote, rating }
  }
}`;

/**
 * Full à la carte menu for /menu. Reads Sanity (menuSection docs), falls back to
 * the static MENU when empty or unreachable.
 */
export async function getMenu(): Promise<MenuSection[]> {
  try {
    const data = await client.fetch<MenuSection[]>(MENU_QUERY, {}, { cache: "no-store" });
    return data && data.length ? data : MENU;
  } catch {
    return MENU;
  }
}

/**
 * Site content data layer.
 *
 * The site reads its content from Sanity (project te38hur6), but every field
 * falls back to the canonical values in src/lib/brand.ts. That means the site
 * renders identically to before until the dataset is seeded — and if Sanity is
 * unreachable or a field is left blank, the hardcoded value is used. So the
 * migration is non-breaking: nothing on the live site can go missing.
 *
 * `BRAND` stays the single source of seed/fallback truth; `getContent()` is what
 * the pages and sections consume.
 */

// Widen BRAND's deeply-literal `as const` type to plain string/number/etc. so a
// Sanity-sourced object (plain types) is assignable, while keeping arrays
// readonly so BRAND itself remains a valid default.
export type { SiteContent };

type ImageRef = { asset?: { url?: string | null } } | null | undefined;
const imageUrl = (img: ImageRef, fallback: string): string => img?.asset?.url ?? fallback;

// One round-trip: pull the singleton settings plus every collection.
const QUERY = /* groq */ `{
  "settings": *[_type == "siteSettings"][0],
  "dishes": *[_type == "dish"]|order(order asc, name asc){..., image{asset->{url}}},
  "testimonials": *[_type == "testimonial"]|order(order asc, _createdAt asc),
  "services": *[_type == "service"]|order(order asc){..., image{asset->{url}}},
  "occasions": *[_type == "occasion"]|order(order asc),
  "family": *[_type == "familyMember"]|order(order asc){..., image{asset->{url}}}
}`;

type RawSettings = Record<string, unknown> | null;
type RawDoc = Record<string, unknown>;
type RawResult = {
  settings: RawSettings;
  dishes: RawDoc[];
  testimonials: RawDoc[];
  services: RawDoc[];
  occasions: RawDoc[];
  family: RawDoc[];
};

/**
 * Fetch site content from Sanity, deep-merged over BRAND defaults. Cached for a
 * short window (ISR) and resilient: any failure resolves to BRAND.
 */
export async function getContent(): Promise<SiteContent> {
  let data: RawResult | null = null;
  try {
    data = await client.fetch<RawResult>(QUERY, {}, { cache: "no-store" });
  } catch {
    return BRAND;
  }
  if (!data) return BRAND;

  const s = (data.settings ?? {}) as Record<string, never>;
  const pick = <K extends keyof typeof BRAND>(key: K): (typeof BRAND)[K] =>
    (s[key as keyof typeof s] as unknown as (typeof BRAND)[K]) ?? BRAND[key];

  const dishes = data.dishes?.length
    ? data.dishes.map((d, i) => ({
        slug: ((d.slug as { current?: string })?.current ?? "") || `dish-${i}`,
        name: (d.name as string) ?? "",
        tagline: (d.tagline as string) ?? "",
        note: (d.note as string) ?? "",
        image: imageUrl(d.image as ImageRef, BRAND.dishes[i]?.image ?? ""),
        media: { spin: null, video: null },
        review: (d.review as (typeof BRAND.dishes)[number]["review"]) ?? {
          quote: "",
          author: "",
          city: "",
        },
      }))
    : BRAND.dishes;

  const reviews = data.testimonials?.length
    ? data.testimonials.map((t) => ({
        quote: (t.quote as string) ?? "",
        author: (t.author as string) ?? "",
        city: (t.city as string) ?? "",
      }))
    : BRAND.reviews;

  const services = data.services?.length
    ? data.services.map((sv, i) => ({
        label: (sv.label as string) ?? "",
        time: (sv.time as string) ?? "",
        opens: (sv.opens as string) ?? "",
        closes: (sv.closes as string) ?? "",
        line: (sv.line as string) ?? "",
        image: imageUrl(sv.image as ImageRef, BRAND.services[i]?.image ?? ""),
      }))
    : BRAND.services;

  const occasions = data.occasions?.length
    ? data.occasions.map((o) => ({
        value: (o.value as string) ?? "",
        title: (o.title as string) ?? "",
        line: (o.line as string) ?? "",
      }))
    : BRAND.occasions;

  const family = data.family?.length
    ? data.family.map((m, i) => ({
        name: (m.name as string) ?? "",
        role: (m.role as string) ?? "",
        line: (m.line as string) ?? "",
        image: imageUrl(m.image as ImageRef, BRAND.family[i]?.image ?? ""),
      }))
    : BRAND.family;

  return {
    ...BRAND,
    name: pick("name"),
    legalName: pick("legalName"),
    tagline: pick("tagline"),
    meaning: pick("meaning"),
    cuisine: pick("cuisine"),
    owner: pick("owner"),
    ownerRole: pick("ownerRole"),
    phone: pick("phone"),
    phoneHref: pick("phoneHref"),
    email: pick("email"),
    emailHref: pick("emailHref"),
    whatsapp: pick("whatsapp"),
    reservationUrl: pick("reservationUrl"),
    tripadvisorUrl: pick("tripadvisorUrl"),
    rating: pick("rating"),
    reviewCount: pick("reviewCount"),
    award: pick("award"),
    ranking: pick("ranking"),
    googleReviewsUrl: pick("googleReviewsUrl"),
    googleMapsSearch: pick("googleMapsSearch"),
    googleReview: pick("googleReview"),
    menuUrl: pick("menuUrl"),
    address: pick("address"),
    geo: pick("geo"),
    hours: pick("hours"),
    social: pick("social"),
    dishes,
    reviews,
    services,
    occasions,
    family,
  } as SiteContent;
}
