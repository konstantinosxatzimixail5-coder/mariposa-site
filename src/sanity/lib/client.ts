import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

/**
 * Read client for fetching published content on the site.
 *
 * - `useCdn: false` reads from the live API so published edits appear immediately
 *   (paired with ISR + the /api/revalidate webhook).
 * - `token` is read from the non-public `SANITY_API_READ_TOKEN` env var, so it is
 *   only present on the server (it's stripped from the browser bundle). This lets
 *   the site read a dataset that isn't publicly readable. On a public dataset it's
 *   simply unused. Never use a NEXT_PUBLIC_ var for this — that would leak it.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: "published",
  token: process.env.SANITY_API_READ_TOKEN,
});
