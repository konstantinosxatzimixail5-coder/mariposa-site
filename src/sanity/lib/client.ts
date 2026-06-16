import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

/**
 * Read-only client for fetching published content on the site. `useCdn` serves
 * cached, edge-delivered content (fast, eventually consistent) — ideal for a
 * marketing site. Studio writes go through its own authenticated client.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
});
