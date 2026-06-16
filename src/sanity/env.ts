/**
 * Sanity project connection values.
 *
 * The project id and dataset are public (they ship in the browser bundle), so
 * sensible defaults are baked in for project `te38hur6` and the `production`
 * dataset; environment variables override them if you point the site at a
 * different project/dataset. Only the write token (used by the seed script and
 * any server-side mutations) is a secret — see SANITY_AUTH_TOKEN in .env.example.
 */
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-06-16";

export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "te38hur6";
