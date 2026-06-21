import { NextResponse } from "next/server";
import { sendEmail, escapeHtml } from "@/lib/email";
import { rateLimit, clientIp } from "@/lib/rate-limit";

/**
 * Contact intake — sends the message to the restaurant inbox via Resend.
 *
 * Validates name / email / message server-side, then emails it to
 * RESERVATION_TO_EMAIL (defaults to the published address) with the guest's
 * address as reply-to. If Resend isn't configured the send is "skipped" and we
 * still acknowledge (the footer also shows phone / email / WhatsApp directly);
 * if a configured send fails we surface an error so the form shows the fallback.
 *
 * Spam protection: a hidden honeypot field and a per-IP rate limit.
 */

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_LEN = 4000;

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  company?: unknown; // honeypot — must stay empty
};

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

export async function POST(request: Request) {
  if (!rateLimit(`contact:${clientIp(request)}`)) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again in a minute." },
      { status: 429 },
    );
  }

  let body: ContactPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed request." }, { status: 400 });
  }

  // Honeypot: real users never see or fill `company`. If it's set, accept
  // silently (200) so the bot believes it succeeded, but send nothing.
  if (isNonEmptyString(body.company)) {
    return NextResponse.json({ ok: true, message: "Message received." });
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

  const name = (body.name as string).trim().slice(0, 200);
  const email = (body.email as string).trim().slice(0, 200);
  const text = (body.message as string).trim().slice(0, MAX_LEN);

  const lines = [`Name: ${name}`, `Email: ${email}`, `Message: ${text}`];
  const html =
    `<h2 style="font-family:Georgia,serif;color:#1e1b16">New message via mariposa.restaurant</h2>` +
    `<p style="font-family:Arial,sans-serif;font-size:15px;color:#1e1b16"><b style="color:#8a6a30">From:</b> ${escapeHtml(
      name,
    )} &lt;${escapeHtml(email)}&gt;</p>` +
    `<p style="font-family:Arial,sans-serif;font-size:15px;color:#1e1b16;white-space:pre-wrap">${escapeHtml(
      text,
    )}</p>`;

  const { outcome, error } = await sendEmail({
    subject: `New message from ${name} via mariposa.restaurant`,
    text: `New message via mariposa.restaurant\n\n${lines.join("\n")}`,
    html,
    replyTo: email,
  });

  if (outcome === "failed") {
    console.error("[contact] email delivery failed:", error);
    return NextResponse.json(
      { ok: false, error: "We couldn't send that just now. Please email or call us directly." },
      { status: 502 },
    );
  }

  if (outcome === "skipped") {
    console.warn("[contact] RESEND_API_KEY not set — message accepted but not emailed.");
  }

  return NextResponse.json({ ok: true, message: "Message received." });
}
