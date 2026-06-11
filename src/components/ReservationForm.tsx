"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { BRAND } from "@/lib/brand";

/**
 * Reservation request form — wired to /api/reservations.
 *
 * Built for the dark Michelin aesthetic: ink-soft surface, hairline borders,
 * amber focus. Every control has a real <label>, the submit button locks +
 * spins while in flight, validation errors surface inline near the field, and a
 * graceful success panel replaces the form on completion. Phone + WhatsApp live
 * in the parent section as the always-available direct path.
 */

const SERVICE_OPEN_HOUR = 13;
const SERVICE_LAST_HOUR = 23;

// Half-hour seatings across the single continuous service (13:00 → 23:00).
function buildSlots(): string[] {
  const slots: string[] = [];
  for (let h = SERVICE_OPEN_HOUR; h <= SERVICE_LAST_HOUR; h++) {
    slots.push(`${String(h).padStart(2, "0")}:00`);
    if (h < SERVICE_LAST_HOUR) slots.push(`${String(h).padStart(2, "0")}:30`);
  }
  return slots;
}

type Status = "idle" | "submitting" | "success" | "error";

const FIELD_CLASS =
  "w-full rounded-md border bg-[var(--color-surface)] px-4 py-3 text-ink transition-colors duration-200 placeholder:text-muted focus:border-[color:var(--color-amber-deep)]";

export function ReservationForm() {
  const slots = useMemo(buildSlots, []);
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const baseId = useId();
  const ids = {
    name: `${baseId}-name`,
    date: `${baseId}-date`,
    time: `${baseId}-time`,
    party: `${baseId}-party`,
    occasion: `${baseId}-occasion`,
    note: `${baseId}-note`,
  };

  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [invalid, setInvalid] = useState<string[]>([]);
  const [occasion, setOccasion] = useState("none");
  const occasionRef = useRef<HTMLSelectElement>(null);

  // The Celebrations grid pre-fills the occasion via a CustomEvent, then the
  // anchor carries the guest down here; we surface the choice and nudge focus.
  useEffect(() => {
    function onOccasion(event: Event) {
      const value = (event as CustomEvent<string>).detail;
      if (!value) return;
      setOccasion(value);
      window.setTimeout(() => occasionRef.current?.focus(), 700);
    }
    window.addEventListener("mariposa:occasion", onOccasion);
    return () => window.removeEventListener("mariposa:occasion", onOccasion);
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? "").trim(),
      date: String(data.get("date") ?? ""),
      time: String(data.get("time") ?? ""),
      party: Number(data.get("party") ?? 0),
      occasion: String(data.get("occasion") ?? "none"),
      note: String(data.get("note") ?? "").trim(),
    };

    setStatus("submitting");
    setMessage("");
    setInvalid([]);

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await res.json()) as {
        ok: boolean;
        error?: string;
        fields?: string[];
      };

      if (res.ok && result.ok) {
        setStatus("success");
        return;
      }
      setStatus("error");
      setInvalid(result.fields ?? []);
      setMessage(result.error ?? "Something went wrong. Please call us instead.");
    } catch {
      setStatus("error");
      setMessage("We couldn't send that just now. Please call or WhatsApp us.");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="flex flex-col items-center rounded-xl border px-8 py-12 text-center"
        style={{
          borderColor: "var(--color-line)",
          background: "color-mix(in oklab, var(--color-olive) 12%, var(--color-ink-soft))",
        }}
      >
        <span
          className="inline-flex h-12 w-12 items-center justify-center rounded-full text-[color:var(--color-on-accent)]"
          style={{ background: "var(--color-amber)" }}
        >
          <Check className="h-6 w-6" aria-hidden />
        </span>
        <h3 className="font-display mt-6" style={{ fontSize: "var(--text-xl)" }}>
          Request received
        </h3>
        <p className="mt-3 max-w-sm text-pretty text-ink-dim">
          Thank you. We&apos;ll confirm your table by phone shortly. For anything
          urgent, call or WhatsApp us directly.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-xl border p-6 text-left md:p-8"
      style={{ borderColor: "var(--color-line)", background: "var(--color-surface)" }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor={ids.name} className="mb-2 block text-sm text-ink">
            Name
          </label>
          <input
            id={ids.name}
            name="name"
            type="text"
            autoComplete="name"
            required
            placeholder="Your name"
            aria-invalid={invalid.includes("name")}
            className={FIELD_CLASS}
            style={{ borderColor: invalid.includes("name") ? "var(--color-amber)" : "var(--color-line)" }}
          />
        </div>

        <div>
          <label htmlFor={ids.date} className="mb-2 block text-sm text-ink">
            Date
          </label>
          <input
            id={ids.date}
            name="date"
            type="date"
            required
            min={today}
            defaultValue={today}
            aria-invalid={invalid.includes("date")}
            className={`${FIELD_CLASS} [color-scheme:light]`}
            style={{ borderColor: invalid.includes("date") ? "var(--color-amber)" : "var(--color-line)" }}
          />
        </div>

        <div>
          <label htmlFor={ids.time} className="mb-2 block text-sm text-ink">
            Time
          </label>
          <select
            id={ids.time}
            name="time"
            required
            defaultValue="20:00"
            aria-invalid={invalid.includes("time")}
            className={FIELD_CLASS}
            style={{ borderColor: invalid.includes("time") ? "var(--color-amber)" : "var(--color-line)" }}
          >
            {slots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={ids.party} className="mb-2 block text-sm text-ink">
            Party size
          </label>
          <select
            id={ids.party}
            name="party"
            required
            defaultValue="2"
            aria-invalid={invalid.includes("party")}
            className={FIELD_CLASS}
            style={{ borderColor: invalid.includes("party") ? "var(--color-amber)" : "var(--color-line)" }}
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={ids.occasion} className="mb-2 block text-sm text-ink">
            Occasion <span className="text-muted">(optional)</span>
          </label>
          <select
            id={ids.occasion}
            name="occasion"
            ref={occasionRef}
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
            className={FIELD_CLASS}
            style={{ borderColor: "var(--color-line)" }}
          >
            <option value="none">An evening out</option>
            {BRAND.occasions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.title}
              </option>
            ))}
            <option value="other">Something else</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={ids.note} className="mb-2 block text-sm text-ink">
            Notes <span className="text-muted">(optional)</span>
          </label>
          <textarea
            id={ids.note}
            name="note"
            rows={3}
            placeholder="Allergies, a high chair, a window table at sunset…"
            className={`${FIELD_CLASS} resize-none`}
            style={{ borderColor: "var(--color-line)" }}
          />
        </div>
      </div>

      {status === "error" && message ? (
        <p role="alert" className="mt-4 text-sm text-[color:var(--color-clay)]">
          {message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-8 py-4 font-medium text-[color:var(--color-on-accent)] transition-[background-color,opacity] duration-200 hover:bg-amber-bright disabled:cursor-not-allowed disabled:opacity-70"
        style={{ background: "var(--color-amber)" }}
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            Sending…
          </>
        ) : (
          "Request a Table"
        )}
      </button>
    </form>
  );
}
