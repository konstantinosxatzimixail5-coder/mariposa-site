import { NextResponse } from "next/server";

/**
 * Reservation intake — placeholder booking endpoint.
 *
 * This validates and acknowledges a request so the front-end form is genuinely
 * wired end-to-end. In production this handler is where you'd forward the
 * booking to the venue's inbox / reservation platform (e.g. email via Resend,
 * or a POST to OpenTable/Quandoo). Until that integration is supplied it simply
 * confirms receipt — the form already offers phone + WhatsApp as the live path.
 */

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
  date?: unknown;
  time?: unknown;
  party?: unknown;
  occasion?: unknown;
  note?: unknown;
};

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

export async function POST(request: Request) {
  let body: ReservationPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed request." }, { status: 400 });
  }

  const errors: string[] = [];

  if (!isNonEmptyString(body.name)) errors.push("name");

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

  // Placeholder for the real downstream booking integration.
  // e.g. await sendReservationEmail({ name, date, time, party, note })

  return NextResponse.json({
    ok: true,
    message: "Reservation request received.",
  });
}
