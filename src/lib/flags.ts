/**
 * Site feature flags.
 *
 * MENU_PUBLISHED — controls the standalone /menu page. While `false`, the full
 * menu is hidden from the public:
 *   - the /menu route redirects to the homepage (unless previewing, see below),
 *   - the "view the full menu" call-to-action on the homepage is not rendered,
 *   - /menu is excluded from the sitemap, and
 *   - the Menu node / breadcrumb item is dropped from the JSON-LD.
 * Flip to `true` to re-publish the menu (no other change needed).
 */
export const MENU_PUBLISHED = false;

/**
 * MENU_PREVIEW_KEY — private preview of the hidden menu. While MENU_PUBLISHED is
 * false, visiting `/menu?preview=<MENU_PREVIEW_KEY>` renders the menu instead of
 * redirecting, so the owner can view it via a secret link. The page stays
 * noindex and out of the sitemap and isn't linked anywhere, so it never becomes
 * public. (Override with the MENU_PREVIEW_KEY env var if you want.)
 */
export const MENU_PREVIEW_KEY = process.env.MENU_PREVIEW_KEY || "mariposa-preview-9f3a";

/**
 * RESERVATION_FORM_ENABLED — controls the on-site reservation form.
 *
 * While `false`, the form is hidden and reservations are taken on WhatsApp only:
 * the reservation section shows a "Reserve on WhatsApp" button that opens a chat
 * (with a prefilled request) to RESERVATION_WHATSAPP. That WhatsApp chat is the
 * record of who booked and what — no submissions touch the server. Flip to
 * `true` to bring the form back (it still posts to /api/reservations).
 */
export const RESERVATION_FORM_ENABLED = false;

/**
 * Reservation WhatsApp number in wa.me form (country code + number, no `+`).
 * +30 690 648 9705.
 */
export const RESERVATION_WHATSAPP = "306906489705";

