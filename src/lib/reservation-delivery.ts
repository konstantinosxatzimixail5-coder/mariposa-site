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
import twilio from "twilio";
import { BRAND } from "@/lib/brand";
import { sendEmail as sendTransactionalEmail, linesToHtml } from "@/lib/email";

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

async function sendEmail(b: Booking): Promise<ChannelOutcome> {
  const lines = formatLines(b);
  // Reservations have no email field, so no reply-to; the phone is in the body.
  const { outcome } = await sendTransactionalEmail({
    subject: `New reservation request — ${b.name}, ${b.party} guests, ${b.date} ${b.time}`,
    text: `New reservation request\n\n${lines.join("\n")}`,
    html: linesToHtml(lines, "New reservation request"),
  });
  return outcome;
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
