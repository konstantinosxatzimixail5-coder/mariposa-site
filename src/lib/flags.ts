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

