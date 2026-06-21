"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { BRAND } from "@/lib/brand";

/**
 * The restaurant's cinematic hero loop, layered above the server-rendered
 * poster (Hero's LCP element) and below the type. Purely decorative atmosphere,
 * so it is loaded as late and as cheaply as possible:
 *
 *  - Under prefers-reduced-motion it renders nothing — the poster + gradient are
 *    the complete, calm fallback.
 *  - On small viewports, Save-Data, or slow (2g) connections it renders nothing
 *    either: the poster alone is the background, so phones never download video.
 *  - Otherwise it mounts only once the browser is idle (after first paint), with
 *    preload="none" and the small webm/mp4 encodes (not the 12MB 4K master), so
 *    the video bytes never compete with the LCP poster or critical content.
 *
 * Muted + playsInline + loop so it autoplays everywhere without controls, fading
 * in once the first frame is decoded.
 */
type NetworkInfo = { saveData?: boolean; effectiveType?: string };

export function HeroVideo() {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);
  const [show, setShow] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (reducedMotion) return;

    const conn = (navigator as Navigator & { connection?: NetworkInfo }).connection;
    const saveData = conn?.saveData === true;
    const slow = !!conn?.effectiveType && /2g/.test(conn.effectiveType);
    const small = window.matchMedia("(max-width: 640px)").matches;
    // Phones / data-savers / slow links keep the poster only.
    if (small || saveData || slow) return;

    // Defer until the browser is idle so video bytes follow the LCP paint.
    const start = () => setShow(true);
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    let id: number;
    if (w.requestIdleCallback) {
      id = w.requestIdleCallback(start, { timeout: 2000 });
      return () => w.cancelIdleCallback?.(id);
    }
    id = window.setTimeout(start, 800);
    return () => window.clearTimeout(id);
  }, [reducedMotion]);

  if (reducedMotion || !show) return null;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-[8] overflow-hidden">
      <video
        ref={ref}
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        poster={BRAND.heroPoster}
        onLoadedData={() => setReady(true)}
        className="h-full w-full object-cover transition-opacity duration-700"
        style={{ opacity: ready ? 0.55 : 0 }}
      >
        <source src={BRAND.heroVideoWebm} type="video/webm" />
        <source src={BRAND.heroVideo} type="video/mp4" />
      </video>
    </div>
  );
}
