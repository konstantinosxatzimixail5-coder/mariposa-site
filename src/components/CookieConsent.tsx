"use client";

import { useEffect, useState } from "react";

/**
 * GDPR cookie-consent banner, wired to Google Consent Mode v2.
 *
 * Consent defaults to "denied" before GTM loads (set in app/layout.tsx). This
 * banner lets the visitor grant or refuse the non-essential storage types and
 * records the choice in localStorage:
 *   - Accept  → gtag('consent','update', { …: 'granted' }) and remember it.
 *   - Decline → stays denied (cookieless / modeled mode), remembered.
 * Returning visitors don't see the banner; their stored choice is re-applied on
 * load (since the page-level default is "denied" on every fresh load).
 */
const STORAGE_KEY = "mariposa-consent";
type Choice = "granted" | "denied";

type Gtag = (...args: unknown[]) => void;

function applyConsent(choice: Choice) {
  const w = window as Window & { gtag?: Gtag; dataLayer?: unknown[] };
  const gtag: Gtag =
    w.gtag ??
    function (...args: unknown[]) {
      (w.dataLayer = w.dataLayer || []).push(args);
    };
  gtag("consent", "update", {
    ad_storage: choice,
    ad_user_data: choice,
    ad_personalization: choice,
    analytics_storage: choice,
  });
}

export function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let stored: Choice | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY) as Choice | null;
    } catch {
      /* storage blocked — show the banner */
    }
    if (stored === "granted") {
      applyConsent("granted"); // re-apply the remembered grant (default is denied)
      return;
    }
    if (stored === "denied") return; // already denied by default; no banner
    setOpen(true);
  }, []);

  function choose(choice: Choice) {
    try {
      localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      /* ignore */
    }
    applyConsent(choice);
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-[95] px-4 pb-4 sm:px-6 sm:pb-6"
    >
      <div
        className="mx-auto flex max-w-3xl flex-col gap-4 rounded-xl border p-5 shadow-lg sm:flex-row sm:items-center sm:gap-6 sm:p-6"
        style={{
          background: "var(--color-surface)",
          borderColor: "var(--color-line)",
          boxShadow: "0 12px 40px -16px color-mix(in oklab, #000 55%, transparent)",
        }}
      >
        <p className="flex-1 text-sm leading-relaxed text-ink-dim">
          We use cookies to understand how our site is used and improve your visit.
          You can accept analytics cookies or continue with only the essentials.
        </p>
        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={() => choose("denied")}
            className="rounded-full border px-5 py-2.5 text-sm font-medium text-ink transition-colors duration-200 hover:border-[color:var(--color-amber-deep)] hover:text-[color:var(--color-amber-deep)]"
            style={{ borderColor: "var(--color-line)" }}
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => choose("granted")}
            className="rounded-full px-5 py-2.5 text-sm font-medium text-[color:var(--color-on-accent)] transition-colors duration-200 hover:bg-amber-bright"
            style={{ background: "var(--color-amber)" }}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
