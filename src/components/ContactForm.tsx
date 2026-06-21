"use client";

import { useId, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { Honeypot } from "@/components/Honeypot";

/**
 * Footer contact form — name / email / message, wired to /api/contact.
 *
 * Matches the reservation form's grammar: real <label>s, inline invalid state,
 * a submit button that locks + spins in flight, and a graceful success panel.
 * The footer also carries phone, email and WhatsApp as the always-live path.
 */

type Status = "idle" | "submitting" | "success" | "error";

const FIELD_CLASS =
  "w-full rounded-md border bg-[var(--color-surface)] px-4 py-3 text-ink transition-colors duration-200 placeholder:text-muted focus:border-[color:var(--color-amber-deep)]";

export function ContactForm() {
  const baseId = useId();
  const ids = {
    name: `${baseId}-name`,
    email: `${baseId}-email`,
    message: `${baseId}-message`,
  };

  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [invalid, setInvalid] = useState<string[]>([]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      message: String(data.get("message") ?? "").trim(),
      company: String(data.get("company") ?? ""), // honeypot
    };

    setStatus("submitting");
    setMessage("");
    setInvalid([]);

    try {
      const res = await fetch("/api/contact", {
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
      setMessage(result.error ?? "Something went wrong. Please email us instead.");
    } catch {
      setStatus("error");
      setMessage("We couldn't send that just now. Please call or email us.");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="flex flex-col items-start rounded-xl border px-6 py-8"
        style={{
          borderColor: "var(--color-line)",
          background: "color-mix(in oklab, var(--color-olive) 12%, var(--color-surface))",
        }}
      >
        <span
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[color:var(--color-on-accent)]"
          style={{ background: "var(--color-amber)" }}
        >
          <Check className="h-5 w-5" aria-hidden />
        </span>
        <h3 className="font-display mt-5" style={{ fontSize: "var(--text-lg)" }}>
          Message received
        </h3>
        <p className="mt-2 text-pretty text-sm text-ink-dim">
          Thank you for writing. We&apos;ll reply shortly — for anything urgent,
          call or WhatsApp us directly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-4">
      <Honeypot />
      <div>
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
        <label htmlFor={ids.email} className="mb-2 block text-sm text-ink">
          Email
        </label>
        <input
          id={ids.email}
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          aria-invalid={invalid.includes("email")}
          className={FIELD_CLASS}
          style={{ borderColor: invalid.includes("email") ? "var(--color-amber)" : "var(--color-line)" }}
        />
      </div>

      <div>
        <label htmlFor={ids.message} className="mb-2 block text-sm text-ink">
          Message
        </label>
        <textarea
          id={ids.message}
          name="message"
          rows={4}
          required
          placeholder="How can we help?"
          aria-invalid={invalid.includes("message")}
          className={`${FIELD_CLASS} resize-none`}
          style={{ borderColor: invalid.includes("message") ? "var(--color-amber)" : "var(--color-line)" }}
        />
      </div>

      {status === "error" && message ? (
        <p role="alert" className="text-sm text-[color:var(--color-clay)]">
          {message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 font-medium text-[color:var(--color-on-accent)] transition-[background-color,opacity] duration-200 hover:bg-amber-bright disabled:cursor-not-allowed disabled:opacity-70"
        style={{ background: "var(--color-amber)" }}
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            Sending…
          </>
        ) : (
          "Send Message"
        )}
      </button>
    </form>
  );
}
