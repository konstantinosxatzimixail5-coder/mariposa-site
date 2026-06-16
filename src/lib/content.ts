import "server-only";

import { BRAND, type Brand } from "@/lib/brand";
import { FAQS } from "@/lib/faq";
import { client } from "@/sanity/lib/client";
import {
  settingsQuery,
  dishesQuery,
  reviewsQuery,
  familyQuery,
  occasionsQuery,
  servicesQuery,
  faqsQuery,
} from "@/sanity/lib/queries";

/**
 * Content layer. Each getter reads from Sanity and falls back to the static
 * `BRAND` / `FAQS` data whenever the dataset is empty or unreachable, so the
 * site renders identically before any content is entered and switches over
 * automatically once it is. Shapes mirror `BRAND` so section components can
 * consume the result with no change to their props.
 *
 * Sanity image fields arrive as `imageUrl`; we map them back onto the `image`
 * key the components already read, leaving the static paths untouched on
 * fallback.
 */

async function fetchOr<T>(query: string, fallback: T): Promise<T> {
  try {
    const data = await client.fetch<T>(query);
    if (data == null) return fallback;
    if (Array.isArray(data) && data.length === 0) return fallback;
    return data;
  } catch {
    return fallback;
  }
}

type WithImageUrl = { imageUrl?: string | null; image?: string };
function withImage<T extends WithImageUrl>(item: T): T {
  if (item.imageUrl) return { ...item, image: item.imageUrl };
  return item;
}

export async function getSettings(): Promise<Brand> {
  const remote = await fetchOr<Partial<Brand> | null>(settingsQuery, null);
  // Merge over the static brand so any field left blank in the CMS keeps its
  // canonical value rather than going undefined. (List content — dishes,
  // reviews, etc. — stays from BRAND here; those have their own getters.)
  return { ...BRAND, ...(remote ?? {}) };
}

export async function getDishes(): Promise<(typeof BRAND.dishes)[number][]> {
  const remote = await fetchOr<WithImageUrl[]>(dishesQuery, []);
  if (remote.length === 0) return [...BRAND.dishes];
  return remote.map(withImage) as unknown as (typeof BRAND.dishes)[number][];
}

export async function getReviews(): Promise<(typeof BRAND.reviews)[number][]> {
  const remote = await fetchOr<(typeof BRAND.reviews)[number][]>(reviewsQuery, []);
  return remote.length ? remote : [...BRAND.reviews];
}

export async function getFamily(): Promise<(typeof BRAND.family)[number][]> {
  const remote = await fetchOr<WithImageUrl[]>(familyQuery, []);
  if (remote.length === 0) return [...BRAND.family];
  return remote.map(withImage) as unknown as (typeof BRAND.family)[number][];
}

export async function getOccasions(): Promise<(typeof BRAND.occasions)[number][]> {
  const remote = await fetchOr<(typeof BRAND.occasions)[number][]>(occasionsQuery, []);
  return remote.length ? remote : [...BRAND.occasions];
}

export async function getServices(): Promise<(typeof BRAND.services)[number][]> {
  const remote = await fetchOr<WithImageUrl[]>(servicesQuery, []);
  if (remote.length === 0) return [...BRAND.services];
  return remote.map(withImage) as unknown as (typeof BRAND.services)[number][];
}

export async function getFaqs(): Promise<(typeof FAQS)[number][]> {
  const remote = await fetchOr<(typeof FAQS)[number][]>(faqsQuery, []);
  return remote.length ? remote : [...FAQS];
}
