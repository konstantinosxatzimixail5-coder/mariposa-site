import "server-only";
import { Resend } from "resend";

/**
 * Shared transactional-email sender (Resend).
 *
 * One place that owns the Resend client, the From/To resolution and the
 * skip/sent/failed contract used by both the reservation and contact handlers.
 * It never throws: callers get a typed outcome so they can decide what to show.
 *
 * Required env (see .env.example):
 *   RESEND_API_KEY          — Resend API key. If absent, sending is "skipped"
 *                             (so local dev works without credentials).
 *   RESERVATION_FROM_EMAIL  — verified sender on the owned domain, e.g.
 *                             "Mariposa <reservations@mariposa.restaurant>".
 *                             If absent we fall back to Resend's onboarding
 *                             sender for testing (deliverable only to the
 *                             account owner — verify a domain for production).
 *   RESERVATION_TO_EMAIL    — recipient inbox. Defaults to the published address.
 */

export type MailOutcome = "sent" | "skipped" | "failed";

export type MailResult = { outcome: MailOutcome; error?: string };

// The restaurant's published inbox is the default destination.
const DEFAULT_TO = "mariposa.rhodos@gmail.com";

// TODO: verify the mariposa.restaurant domain in Resend and set
// RESERVATION_FROM_EMAIL so mail is sent from the brand address. Until then the
// onboarding sender works for testing but only delivers to the account owner.
const FALLBACK_FROM = "Mariposa <onboarding@resend.dev>";

export async function sendEmail(opts: {
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
}): Promise<MailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { outcome: "skipped" };

  const from = process.env.RESERVATION_FROM_EMAIL || FALLBACK_FROM;
  const to = process.env.RESERVATION_TO_EMAIL || DEFAULT_TO;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      subject: opts.subject,
      text: opts.text,
      html: opts.html,
      ...(opts.replyTo ? { replyTo: opts.replyTo } : {}),
    });
    if (error) return { outcome: "failed", error: error.message };
    return { outcome: "sent" };
  } catch (err) {
    return { outcome: "failed", error: err instanceof Error ? err.message : "unknown error" };
  }
}

/** Escape user-supplied text before interpolating into the HTML email body. */
export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Render labelled "Label: value" lines as a simple HTML table. */
export function linesToHtml(lines: string[], heading: string): string {
  return (
    `<h2 style="font-family:Georgia,serif;color:#1e1b16">${escapeHtml(heading)}</h2>` +
    `<table style="font-family:Arial,sans-serif;font-size:15px;color:#1e1b16;border-collapse:collapse">` +
    lines
      .map((line) => {
        const [label, ...rest] = line.split(": ");
        return (
          `<tr><td style="padding:4px 16px 4px 0;color:#8a6a30;font-weight:bold">${escapeHtml(
            label ?? "",
          )}</td><td style="padding:4px 0">${escapeHtml(rest.join(": "))}</td></tr>`
        );
      })
      .join("") +
    `</table>`
  );
}
