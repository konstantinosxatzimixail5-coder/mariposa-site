import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // `useCdn` is fine for published content; route handlers that need fresh data
  // can opt out per-request. Keep on for the statically-rendered marketing site.
  useCdn: true,
});
