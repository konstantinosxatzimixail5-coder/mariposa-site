/**
 * Server-side reservation delivery — email (Resend) + WhatsApp (Twilio).
 *
 * This module never runs on the client: it reads secrets from the environment
 * and is imported only by the /api/reservations route handler. Each channel is
 * attempted independently so a failure in one never blocks the other — the
 * booking is delivered through whatever channels are configured and working,
 * and per-channel outcomes are returned to the caller to surface.
 *
 * Required env vars (see .env.example):
 *   Email   — RESEND_API_KEY, RESERVATION_FROM_EMAIL, RESERVATION_TO_EMAIL
 *   WhatsApp — TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN,
 *              TWILIO_WHATSAPP_FROM, RESTAURANT_WHATSAPP_TO
 *
 * A channel whose env vars are absent is reported as "skipped" (not "failed"),
 * so local development without credentials still succeeds end-to-end.
 */
import { Resend } from "resend";
import twilio from "twilio";
import { BRAND } from "@/lib/brand";

export type Booking = {
  name: string;
  phone: string;
  date: string;
  time: string;
  party: number;
  occasion: string;
  note: string;
};

export type ChannelOutcome = "sent" | "failed" | "skipped";

export type DeliveryResult = {
  email: ChannelOutcome;
  whatsapp: ChannelOutcome;
  errors: string[];
};

// Human label for an occasion value (mirrors the form's options).
function occasionLabel(value: string): string {
  if (!value || value === "none") return "An evening out";
  if (value === "other") return "Something else";
  return BRAND.occasions.find((o) => o.value === value)?.title ?? value;
}

// Shared plain-text body — used verbatim for WhatsApp and as the email's text part.
function formatLines(b: Booking): string[] {
  return [
    `Name: ${b.name}`,
    b.phone ? `Phone: ${b.phone}` : null,
    `Date: ${b.date}`,
    `Time: ${b.time}`,
    `Party: ${b.party} ${b.party === 1 ? "guest" : "guests"}`,
    `Occasion: ${occasionLabel(b.occasion)}`,
    b.note ? `Notes: ${b.note}` : null,
  ].filter((line): line is string => line !== null);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function sendEmail(b: Booking): Promise<ChannelOutcome> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESERVATION_FROM_EMAIL;
  // Falls back to the restaurant's published address if no override is set.
  const to = process.env.RESERVATION_TO_EMAIL || BRAND.email;

  if (!apiKey || !from || !to) return "skipped";

  const lines = formatLines(b);
  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to,
    subject: `New reservation request — ${b.name}, ${b.date} ${b.time} (${b.party})`,
    text: `New reservation request\n\n${lines.join("\n")}`,
    html:
      `<h2 style="font-family:Georgia,serif;color:#1e1b16">New reservation request</h2>` +
      `<table style="font-family:Arial,sans-serif;font-size:15px;color:#1e1b16;border-collapse:collapse">` +
      lines
        .map((line) => {
          const [label, ...rest] = line.split(": ");
          return `<tr><td style="padding:4px 16px 4px 0;color:#8a6a30;font-weight:bold">${escapeHtml(
            label ?? "",
          )}</td><td style="padding:4px 0">${escapeHtml(rest.join(": "))}</td></tr>`;
        })
        .join("") +
      `</table>`,
  });

  return error ? "failed" : "sent";
}

async function sendWhatsApp(b: Booking): Promise<ChannelOutcome> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM;
  const to = process.env.RESTAURANT_WHATSAPP_TO;

  if (!sid || !token || !from || !to) return "skipped";

  // Twilio expects the `whatsapp:` channel prefix on both numbers.
  const withChannel = (n: string) => (n.startsWith("whatsapp:") ? n : `whatsapp:${n}`);

  const client = twilio(sid, token);
  await client.messages.create({
    from: withChannel(from),
    to: withChannel(to),
    body: `🦋 New reservation request\n\n${formatLines(b).join("\n")}`,
  });

  return "sent";
}

/**
 * Deliver a booking through every configured channel. Resolves with the outcome
 * of each so the API route can return a clear, per-channel status: it never
 * throws, even if a provider call rejects.
 */
export async function deliverReservation(b: Booking): Promise<DeliveryResult> {
  const errors: string[] = [];

  const [email, whatsapp] = await Promise.all([
    sendEmail(b).catch((err: unknown) => {
      errors.push(`email: ${err instanceof Error ? err.message : "unknown error"}`);
      return "failed" as const;
    }),
    sendWhatsApp(b).catch((err: unknown) => {
      errors.push(`whatsapp: ${err instanceof Error ? err.message : "unknown error"}`);
      return "failed" as const;
    }),
  ]);

  // A "failed" outcome from Resend (which returns an error object rather than
  // throwing) won't have pushed a message above — record one for completeness.
  if (email === "failed" && !errors.some((e) => e.startsWith("email"))) {
    errors.push("email: provider rejected the message");
  }

  return { email, whatsapp, errors };
}
