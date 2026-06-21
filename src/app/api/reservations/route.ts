import { NextResponse } from "next/server";
import { deliverReservation, type Booking } from "@/lib/reservation-delivery";
import { rateLimit, clientIp } from "@/lib/rate-limit";

/**
 * Reservation intake.
 *
 * Validates a booking server-side, then delivers it to the restaurant over two
 * independent channels — transactional email (Resend) and WhatsApp (Twilio).
 * The two are attempted in parallel and a failure in one never discards the
 * booking: as long as at least one configured channel delivers (or no channel
 * is configured at all, e.g. local dev), the guest sees success. If every
 * configured channel fails, we report an error so the form can fall back to the
 * phone/WhatsApp links shown beneath it.
 *
 * Secrets live only in the environment — see .env.example for the full list.
 */

// Twilio's SDK relies on Node APIs, so pin this handler to the Node runtime.
export const runtime = "nodejs";

const MAX_PARTY = 12;
const SERVICE_OPEN = 13; // 13:00 — table seatings begin at lunch (doors open earlier, at 09:00)
const SERVICE_LAST = 23; // last seating hour before midnight close

// Allowed occasion values (mirrors BRAND.occasions + the form's none/other).
const OCCASIONS = new Set([
  "none",
  "birthday",
  "anniversary",
  "proposal",
  "wedding",
  "corporate",
  "other",
]);

type ReservationPayload = {
  name?: unknown;
  phone?: unknown;
  date?: unknown;
  time?: unknown;
  party?: unknown;
  occasion?: unknown;
  note?: unknown;
  company?: unknown; // honeypot — must stay empty
};

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

export async function POST(request: Request) {
  if (!rateLimit(`reservations:${clientIp(request)}`)) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again in a minute." },
      { status: 429 },
    );
  }

  let body: ReservationPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed request." }, { status: 400 });
  }

  // Honeypot: real guests never fill `company`. If set, acknowledge silently
  // (200) without delivering anything.
  if (isNonEmptyString(body.company)) {
    return NextResponse.json({ ok: true, message: "Reservation request received." });
  }

  const errors: string[] = [];

  if (!isNonEmptyString(body.name)) errors.push("name");

  // Phone is optional, but if supplied it must look like a real number
  // (digits, with optional +, spaces, dashes and parens — 6 to 20 digits).
  if (isNonEmptyString(body.phone)) {
    const digits = body.phone.replace(/[^\d]/g, "");
    if (!/^\+?[\d\s()-]+$/.test(body.phone) || digits.length < 6 || digits.length > 20) {
      errors.push("phone");
    }
  }

  // Date must be a real, future-or-today calendar date.
  let dateValid = false;
  if (isNonEmptyString(body.date)) {
    const d = new Date(`${body.date}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dateValid = !Number.isNaN(d.getTime()) && d >= today;
  }
  if (!dateValid) errors.push("date");

  // Time within service hours.
  let timeValid = false;
  if (isNonEmptyString(body.time)) {
    const match = /^(\d{2}):(\d{2})$/.exec(body.time);
    if (match) {
      const hour = Number(match[1]);
      timeValid = hour >= SERVICE_OPEN && hour <= SERVICE_LAST;
    }
  }
  if (!timeValid) errors.push("time");

  const party = Number(body.party);
  if (!Number.isInteger(party) || party < 1 || party > MAX_PARTY) errors.push("party");

  // Occasion is optional; reject only an unrecognised non-empty value.
  if (typeof body.occasion === "string" && body.occasion && !OCCASIONS.has(body.occasion)) {
    errors.push("occasion");
  }

  if (errors.length > 0) {
    return NextResponse.json(
      { ok: false, error: "Please check your details.", fields: errors },
      { status: 422 },
    );
  }

  const booking: Booking = {
    name: (body.name as string).trim(),
    phone: isNonEmptyString(body.phone) ? body.phone.trim() : "",
    date: body.date as string,
    time: body.time as string,
    party,
    occasion: typeof body.occasion === "string" ? body.occasion : "none",
    note: isNonEmptyString(body.note) ? body.note.trim() : "",
  };

  const delivery = await deliverReservation(booking);

  // Surface delivery failures in the server log regardless of outcome.
  if (delivery.errors.length > 0) {
    console.error("[reservations] delivery issues:", delivery.errors.join(" | "));
  }

  const attempted = [delivery.email, delivery.whatsapp].filter((s) => s !== "skipped");
  const anyDelivered = attempted.includes("sent");
  const allConfiguredFailed = attempted.length > 0 && !anyDelivered;

  // Every configured channel failed — don't pretend the booking went through.
  if (allConfiguredFailed) {
    return NextResponse.json(
      {
        ok: false,
        error: "We couldn't send your request just now. Please call or WhatsApp us directly.",
        delivery,
      },
      { status: 502 },
    );
  }

  // Delivered through at least one channel (or nothing configured, e.g. dev).
  return NextResponse.json({
    ok: true,
    message: "Reservation request received.",
    delivery,
  });
}
