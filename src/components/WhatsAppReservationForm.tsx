"use client";

import { useId, useMemo, useState } from "react";
import { MessageCircle } from "lucide-react";
import { RESERVATION_WHATSAPP } from "@/lib/flags";
import { trackPixel } from "@/lib/meta-pixel";
import { trackConversion } from "@/lib/tracking";

/**
 * WhatsApp reservation form — no server, no API, no cost.
 *
 * It collects the booking details client-side and, on submit, builds a wa.me
 * click-to-chat link with a prefilled message and opens it in a new tab. The
 * guest sends it from their own WhatsApp, so it lands in the restaurant's chat
 * as a normal message with their number attached. There is no <form> element
 * (a plain button) so nothing ever submits or reloads.
 *
 * The number comes from NEXT_PUBLIC_WHATSAPP_NUMBER (international format, digits
 * only, e.g. "30" + the Greek mobile). It falls back to RESERVATION_WHATSAPP so
 * the form works out of the box; set NEXT_PUBLIC_WHATSAPP_NUMBER in .env.local
 * and in the Vercel project's Environment Variables to override it.
 */
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || RESERVATION_WHATSAPP;

// The service windows guests can book into. Breakfast and Lunch are single
// windows; Dinner is split into two sittings with specific start times.
const SERVICE_SLOTS = ["Breakfast · 09:00 – 11:30", "Lunch · 12:00 – 15:30"] as const;
const DINNER_FIRST = ["17:30", "17:40", "17:50", "18:10", "18:20", "18:40", "18:50", "19:10", "19:20"] as const;
const DINNER_SECOND = ["20:15", "20:40", "20:50", "21:10", "21:20", "21:40", "21:50", "22:10", "22:15"] as const;

const FIELD_CLASS =
  "w-full rounded-md border bg-[var(--color-surface)] px-4 py-3 text-ink transition-colors duration-200 placeholder:text-muted focus:border-[color:var(--color-amber-deep)]";

type Field = "name" | "phone" | "date" | "slot" | "guests" | "notes";

export function WhatsAppReservationForm() {
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const baseId = useId();
  const id = (f: Field) => `${baseId}-${f}`;

  const [form, setForm] = useState<Record<Field, string>>({
    name: "",
    phone: "",
    date: today,
    slot: "",
    guests: "2",
    notes: "",
  });
  const [error, setError] = useState("");

  const update =
    (field: Field) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = () => {
    if (!WHATSAPP_NUMBER) {
      setError("Reservation number not configured.");
      return;
    }
    if (!form.name || !form.phone || !form.date || !form.slot) {
      setError("Please add your name, contact number, date and a time.");
      return;
    }
    setError("");

    const message = [
      "🦋 New reservation request — Mariposa",
      "",
      `Name: ${form.name}`,
      `Contact: ${form.phone}`,
      `Date: ${form.date}`,
      `Time: ${form.slot}`,
      `Guests: ${form.guests || "—"}`,
      form.notes ? `Notes: ${form.notes}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    // Both ad platforms' primary conversion: this click IS the booking request.
    // Reported only after the validation above, so an empty form never counts.
    // Only non-personal context is sent — never the guest's name, number or
    // notes. `guests` is what later lets a 6-cover booking be valued above a
    // 2-cover one instead of treating them identically.
    trackPixel("Lead", {
      content_name: "WhatsApp reservation request",
      content_category: "reservation",
      service_slot: form.slot,
      num_guests: Number(form.guests) || undefined,
    });
    trackConversion("reservation_request", {
      guests: Number(form.guests) || undefined,
      service: form.slot,
      booking_date: form.date,
    });

    // Opened straight after the pushes, NOT from an eventCallback: window.open
    // only survives inside the user's own gesture, so deferring it would get the
    // hand-off eaten by the popup blocker. Nothing is lost by not waiting — the
    // new tab leaves this page alive, so both beacons finish in their own time.
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className="rounded-xl border p-6 text-left md:p-8"
      style={{ borderColor: "var(--color-line)", background: "var(--color-surface)" }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor={id("name")} className="mb-2 block text-sm text-ink">
            Name
          </label>
          <input
            id={id("name")}
            type="text"
            autoComplete="name"
            placeholder="Your name"
            value={form.name}
            onChange={update("name")}
            className={FIELD_CLASS}
            style={{ borderColor: "var(--color-line)" }}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={id("phone")} className="mb-2 block text-sm text-ink">
            Contact number <span className="text-muted">(so we can confirm)</span>
          </label>
          <input
            id={id("phone")}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+30 …"
            value={form.phone}
            onChange={update("phone")}
            className={FIELD_CLASS}
            style={{ borderColor: "var(--color-line)" }}
          />
        </div>

        <div>
          <label htmlFor={id("date")} className="mb-2 block text-sm text-ink">
            Date
          </label>
          <input
            id={id("date")}
            type="date"
            min={today}
            value={form.date}
            onChange={update("date")}
            className={`${FIELD_CLASS} [color-scheme:light]`}
            style={{ borderColor: "var(--color-line)" }}
          />
        </div>

        <div>
          <label htmlFor={id("slot")} className="mb-2 block text-sm text-ink">
            Time
          </label>
          <select
            id={id("slot")}
            value={form.slot}
            onChange={update("slot")}
            className={FIELD_CLASS}
            style={{ borderColor: "var(--color-line)" }}
          >
            <option value="" disabled>
              Choose a time
            </option>
            {SERVICE_SLOTS.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
            <optgroup label="Dinner — first sitting">
              {DINNER_FIRST.map((t) => (
                <option key={`first-${t}`} value={`Dinner (first sitting) · ${t}`}>
                  {t}
                </option>
              ))}
            </optgroup>
            <optgroup label="Dinner — second sitting">
              {DINNER_SECOND.map((t) => (
                <option key={`second-${t}`} value={`Dinner (second sitting) · ${t}`}>
                  {t}
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={id("guests")} className="mb-2 block text-sm text-ink">
            Guests
          </label>
          <select
            id={id("guests")}
            value={form.guests}
            onChange={update("guests")}
            className={FIELD_CLASS}
            style={{ borderColor: "var(--color-line)" }}
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={String(n)}>
                {n} {n === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={id("notes")} className="mb-2 block text-sm text-ink">
            Notes <span className="text-muted">(optional)</span>
          </label>
          <textarea
            id={id("notes")}
            rows={3}
            placeholder="Anything we should know? (allergies, an occasion…)"
            value={form.notes}
            onChange={update("notes")}
            className={`${FIELD_CLASS} resize-none`}
            style={{ borderColor: "var(--color-line)" }}
          />
        </div>
      </div>

      {error ? (
        <p role="alert" className="mt-4 text-sm text-[color:var(--color-clay)]">
          {error}
        </p>
      ) : null}

      <button
        type="button"
        onClick={handleSubmit}
        className="mt-6 inline-flex w-full items-center justify-center gap-2.5 rounded-full px-8 py-4 font-medium text-[color:var(--color-on-accent)] transition-[background-color] duration-200 hover:bg-amber-bright"
        style={{ background: "var(--color-amber)" }}
      >
        <MessageCircle className="h-5 w-5" aria-hidden />
        Reserve via WhatsApp
      </button>
      <p className="mt-3 text-center text-xs text-muted">
        Opens WhatsApp with your request ready to send — you send it from your phone.
      </p>
    </div>
  );
}
