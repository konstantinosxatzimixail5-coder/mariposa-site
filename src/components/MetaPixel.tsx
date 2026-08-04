"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { META_PIXEL_ID, trackPixel } from "@/lib/meta-pixel";

/**
 * Meta (Facebook) Pixel loader.
 *
 * Mounted in the ROOT layout, alongside GTM/GA4 — deliberately *not* in the
 * (site) group, which holds only the homepage: `/menu` sits outside it, so a
 * pixel mounted there would unmount on the way to the menu and leave that page
 * untracked once it's published. Instead the pixel lives above every route and
 * excludes the one place it isn't wanted: the Sanity Studio at /studio, whose
 * traffic is the owner's own and would pollute the ad audiences.
 *
 * Three jobs:
 *  1. Inject the base snippet + the initial PageView. It loads
 *     `afterInteractive` — same as GTM/GA4 in `app/layout.tsx` — so the tracker
 *     never competes with the hero for bandwidth and the LCP work stays first.
 *  2. Mirror App Router client-side navigations as PageViews (the base snippet
 *     only runs once per full page load).
 *  3. Report phone / e-mail link clicks as `Contact`, via one delegated listener.
 *
 * NOTE ON CONSENT: this pixel loads for every visitor, independently of the
 * cookie banner (`CookieConsent.tsx`) — an explicit product decision. Google's
 * tags in `app/layout.tsx` do the opposite: they default to consent-denied and
 * wait for the banner. To bring the pixel in line with them, render this
 * component only once consent has been granted (the banner already persists the
 * choice in localStorage under "mariposa-consent") — see SUMMARY-meta-pixel.md.
 */
export function MetaPixel() {
  const pathname = usePathname();
  // Off with no id configured (NEXT_PUBLIC_META_PIXEL_ID set empty, e.g. locally)
  // and off inside the Studio.
  const enabled = Boolean(META_PIXEL_ID) && !pathname.startsWith("/studio");

  // Last path we counted. `null` until the first effect run, which is the page
  // the base snippet already reported — counting it here too would double it.
  const countedPath = useRef<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    if (countedPath.current === pathname) return; // same page (or a re-run)
    const isFirstRun = countedPath.current === null;
    countedPath.current = pathname;
    if (!isFirstRun) trackPixel("PageView");
  }, [enabled, pathname]);

  useEffect(() => {
    if (!enabled) return;
    // Phone and e-mail links are rendered by *server* components in several
    // places (footer address + icon row, "Prefer to call?", the menu's
    // reservation modal). One document-level listener covers all of them — and
    // anything added later — without converting each to a client component.
    function handleClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest<HTMLAnchorElement>(
        'a[href^="tel:"], a[href^="mailto:"]',
      );
      if (!link) return;
      // No PII: the channel, not the number or address that was clicked.
      trackPixel("Contact", {
        content_name: link.href.startsWith("tel:") ? "Phone click" : "Email click",
        content_category: "contact",
      });
    }

    // Capture phase, so the event is recorded even if a handler further down
    // stops propagation before it reaches the document.
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`}
      </Script>
      {/* Fallback for visitors with JavaScript disabled — a 1×1 beacon that
          registers the PageView server-side. */}
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          alt=""
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
