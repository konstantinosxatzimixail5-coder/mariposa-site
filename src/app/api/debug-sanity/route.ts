import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { projectId, dataset, apiVersion } from "@/sanity/env";

// Always run fresh — never cached — so this reflects live Sanity right now.
export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Temporary diagnostic. `published` uses the site's published-perspective client;
 * `raw` uses the raw perspective (drafts + published) so we can see whether dish
 * docs exist only as drafts. Remove once the content pipeline is confirmed.
 */
export async function GET() {
  const base = { projectId, dataset, apiVersion };
  try {
    const rawClient = client.withConfig({ perspective: "raw" });

    const [publishedDishCount, rawIds] = await Promise.all([
      client.fetch<number>(`count(*[_type == "dish"])`),
      rawClient.fetch<{ dishIds: string[]; byType: Record<string, number> }>(`{
        "dishIds": *[_type == "dish"]._id,
        "byType": {
          "dish": count(*[_type == "dish"]),
          "testimonial": count(*[_type == "testimonial"]),
          "service": count(*[_type == "service"]),
          "occasion": count(*[_type == "occasion"]),
          "familyMember": count(*[_type == "familyMember"]),
          "siteSettings": count(*[_type == "siteSettings"])
        }
      }`),
    ]);

    return NextResponse.json({
      ok: true,
      ...base,
      publishedDishCount,
      rawDishIds: rawIds?.dishIds ?? [],
      rawCountsByType: rawIds?.byType ?? {},
    });
  } catch (err) {
    return NextResponse.json({
      ok: false,
      ...base,
      error: err instanceof Error ? err.message : String(err),
    });
  }
}
