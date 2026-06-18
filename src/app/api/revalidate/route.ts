import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

/**
 * On-demand revalidation endpoint for Sanity webhooks.
 *
 * Configure a webhook in Sanity (manage → API → Webhooks) pointing at:
 *   https://<your-domain>/api/revalidate?secret=<SANITY_REVALIDATE_SECRET>
 * triggering on create/update/delete (publish). When content is published,
 * Sanity POSTs here and we purge the cached pages so the edit shows within
 * seconds instead of waiting on the ISR window.
 *
 * Set SANITY_REVALIDATE_SECRET in the site's env (e.g. Vercel project settings).
 */
export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  const expected = process.env.SANITY_REVALIDATE_SECRET;

  if (!expected || secret !== expected) {
    return NextResponse.json(
      { revalidated: false, message: "Invalid or missing secret" },
      { status: 401 },
    );
  }

  // Revalidate everything under the root layout (the single-page marketing site).
  revalidatePath("/", "layout");

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
