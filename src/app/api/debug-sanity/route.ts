import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { projectId, dataset, apiVersion } from "@/sanity/env";

// Always run fresh — never cached.
export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Temporary diagnostic. Reports whether the running deployment has the read
 * token, which commit it's running, and what the site's own client reads.
 * Remove once content is confirmed flowing.
 */
export async function GET() {
  const base = {
    projectId,
    dataset,
    apiVersion,
    // Is the read token actually present in THIS running deployment?
    tokenPresent: Boolean(process.env.SANITY_API_READ_TOKEN),
    tokenLength: process.env.SANITY_API_READ_TOKEN?.length ?? 0,
    // Which build is serving this? (Vercel system env)
    commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "unknown",
  };
  try {
    // This is the site's own client (gets the token if it's set in env).
    const data = await client.fetch<{ dishCount: number; dishNames: string[] }>(`{
      "dishCount": count(*[_type == "dish"]),
      "dishNames": *[_type == "dish"]|order(order asc).name
    }`);
    return NextResponse.json({
      ok: true,
      ...base,
      dishCount: data?.dishCount ?? 0,
      dishNames: data?.dishNames ?? [],
    });
  } catch (err) {
    return NextResponse.json({
      ok: false,
      ...base,
      error: err instanceof Error ? err.message : String(err),
    });
  }
}
