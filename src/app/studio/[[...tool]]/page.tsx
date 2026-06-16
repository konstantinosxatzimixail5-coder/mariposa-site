/**
 * Embedded Sanity Studio, served at `/studio` (and all sub-routes).
 *
 * Rendered fully client-side; `dynamic`/`force-static` keep the catch-all route
 * out of static export and give the Studio the document title it expects.
 */
import { NextStudio } from "next-sanity/studio";

import config from "../../../../sanity.config";

export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
