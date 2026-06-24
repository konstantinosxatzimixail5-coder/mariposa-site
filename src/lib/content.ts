import "server-only";
import { client } from "@/sanity/lib/client";
import { BRAND, type SiteContent } from "@/lib/brand";
import { COPY, type Copy } from "@/lib/copy";
import { MENU, type MenuSection } from "@/lib/menu";

const MENU_QUERY = /* groq */ `*[_type == "menuSection"]|order(order asc){
  title,
  subtitle,
  "items": items[]{
    name, description, price, available, vegetarian, vegan, glutenFree, rating, reviewCount,
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
 *
 * Dishes carry a daily on/off switch (`available` in Sanity): an item is hidden
 * only when explicitly set to `false`, so missing/true stays visible (and the
 * static fallback, which has no flag, shows everything). Sections left with no
 * visible dishes are dropped so the page never shows an empty heading.
 */
export async function getMenu(): Promise<MenuSection[]> {
  try {
    const data = await client.fetch<MenuSection[]>(MENU_QUERY, {}, { cache: "no-store" });
    const sections = data && data.length ? data : MENU;
    return sections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => item.available !== false),
      }))
      .filter((section) => section.items.length > 0);
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

export type { Copy };

// Pull every editable string for the page-copy singleton, deep-merged below.
const COPY_QUERY = /* groq */ `*[_type == "pageCopy"][0]{
  hero, dishes, garden, chefsWords, experience, celebrations, reviews,
  reservation, family, faq, footer, menu
}`;

type Plain = Record<string, unknown>;
const isObject = (v: unknown): v is Plain =>
  typeof v === "object" && v !== null && !Array.isArray(v);
const isBlank = (v: unknown): boolean =>
  v === undefined || v === null || (typeof v === "string" && v.trim() === "");

/**
 * Deep-merge a Sanity-sourced value over a default, per-field. A blank string,
 * null or undefined in the override falls back to the default. Arrays (e.g. the
 * Garden beats) are taken wholesale from the override only when present and
 * non-empty, otherwise the default array is kept — and each element is itself
 * merged over the corresponding default to fill any blank fields.
 */
function deepMerge<T>(base: T, override: unknown): T {
  if (Array.isArray(base)) {
    if (!Array.isArray(override) || override.length === 0) return base;
    return override.map((item, i) =>
      i < base.length ? deepMerge(base[i], item) : item,
    ) as unknown as T;
  }
  if (isObject(base)) {
    const out: Plain = { ...base };
    const ov = isObject(override) ? override : {};
    for (const key of Object.keys(base as Plain)) {
      out[key] = deepMerge((base as Plain)[key], ov[key]);
    }
    return out as T;
  }
  return (isBlank(override) ? base : override) as T;
}

/**
 * Fetch editable page copy from Sanity (the pageCopy singleton), deep-merged
 * over the COPY defaults so any blank field falls back per-field. Resilient: any
 * failure or empty document resolves to COPY.
 */
export async function getCopy(): Promise<Copy> {
  try {
    const data = await client.fetch<Plain | null>(COPY_QUERY, {}, { cache: "no-store" });
    if (!data) return COPY;
    return deepMerge(COPY as unknown as Copy, data);
  } catch {
    return COPY;
  }
}
