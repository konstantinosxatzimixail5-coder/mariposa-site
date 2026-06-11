import { NextResponse } from "next/server";

/**
 * Contact intake — placeholder message endpoint.
 *
 * Validates and acknowledges a name / email / message so the footer form is
 * genuinely wired end-to-end. In production this handler is where you'd forward
 * the message to the venue's inbox (e.g. email via Resend, or a POST to the
 * client's CONTACT_ENDPOINT). Until that integration is supplied it simply
 * confirms receipt — the footer also offers phone, email and WhatsApp directly.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
};

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

export async function POST(request: Request) {
  let body: ContactPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed request." }, { status: 400 });
  }

  const errors: string[] = [];

  if (!isNonEmptyString(body.name)) errors.push("name");
  if (!isNonEmptyString(body.email) || !EMAIL_RE.test(body.email.trim())) errors.push("email");
  if (!isNonEmptyString(body.message)) errors.push("message");

  if (errors.length > 0) {
    return NextResponse.json(
      { ok: false, error: "Please check your details.", fields: errors },
      { status: 422 },
    );
  }

  // Placeholder for the real downstream integration (BRAND.contactEndpoint).
  // e.g. await sendContactEmail({ name, email, message })

  return NextResponse.json({
    ok: true,
    message: "Message received.",
  });
}
