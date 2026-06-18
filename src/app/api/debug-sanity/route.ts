import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { projectId, dataset, apiVersion } from "@/sanity/env";
import { getContent } from "@/lib/content";

// Always run fresh — never cached — so this reflects live Sanity right now.
export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Temporary diagnostic: reports exactly what the server reads from Sanity, vs.
 * what the site's content layer resolves. Hit /api/debug-sanity and compare the
 * `rawDishNames` (straight from Sanity) against what's on the page. Remove once
 * the content pipeline is confirmed.
 */
export async function GET() {
  const base = { projectId, dataset, apiVersion };
  try {
    const raw = await client.fetch<{
      dishes: { name: string }[];
      settingsName: string | null;
    }>(`{
      "dishes": *[_type == "dish"]|order(order asc){name},
      "settingsName": *[_type == "siteSettings"][0].name
    }`);

    const content = await getContent();

    return NextResponse.json({
      ok: true,
      ...base,
      rawDishCount: raw?.dishes?.length ?? 0,
      rawDishNames: raw?.dishes?.map((d) => d.name) ?? [],
      rawSettingsName: raw?.settingsName ?? null,
      resolvedDishNames: content.dishes.map((d) => d.name),
      resolvedSiteName: content.name,
    });
  } catch (err) {
    return NextResponse.json({
      ok: false,
      ...base,
      error: err instanceof Error ? err.message : String(err),
    });
  }
}
