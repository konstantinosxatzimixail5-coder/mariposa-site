/**
 * Embedded Sanity Studio at /studio. The catch-all route lets the Studio handle
 * its own client-side navigation. Force-static keeps it out of SSR data fetching.
 */
import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";

export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
