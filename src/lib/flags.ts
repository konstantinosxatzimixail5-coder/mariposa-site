/**
 * Site feature flags.
 *
 * MENU_PUBLISHED — controls the standalone /menu page. While `false`, the full
 * menu is hidden everywhere:
 *   - the /menu route redirects to the homepage,
 *   - the "view the full menu" call-to-action on the homepage is not rendered,
 *   - /menu is excluded from the sitemap, and
 *   - the Menu node / breadcrumb item is dropped from the JSON-LD.
 * Flip to `true` to re-publish the menu (no other change needed).
 */
export const MENU_PUBLISHED = false;
