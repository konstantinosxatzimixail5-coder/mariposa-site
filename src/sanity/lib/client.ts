import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

/**
 * Read-only client for fetching published content on the site. `useCdn: false`
 * reads from the live API so published edits are picked up immediately (paired
 * with ISR + the /api/revalidate webhook); the CDN's ~60s cache would otherwise
 * delay updates. Studio writes go through its own authenticated client.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: "published",
});
