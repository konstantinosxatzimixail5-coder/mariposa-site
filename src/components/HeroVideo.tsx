"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { BRAND } from "@/lib/brand";

/**
 * The restaurant's cinematic hero loop, layered above the server-rendered poster
 * (Hero's LCP element) and below the type. It plays on BOTH desktop and mobile —
 * but it is never the LCP element and never blocks first paint:
 *
 *  - prefers-reduced-motion → render nothing (poster + gradient are the calm
 *    fallback).
 *  - Save-Data / 2g → skip the download on either breakpoint, leave the poster.
 *  - Otherwise it mounts only AFTER first paint (on idle), with preload="none",
 *    then sets its source, plays, and fades in over the poster. The encode is
 *    chosen by viewport: 720p on small screens, 1080p (WebM → MP4) on larger.
 *    The small in-repo encodes are listed last as a fallback so the hero still
 *    plays before the cinematic 1080p/720p files are generated.
 *
 * Muted + playsInline + loop so it autoplays everywhere without controls.
 */
type NetworkInfo = { saveData?: boolean; effectiveType?: string };

export function HeroVideo() {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);
  const [show, setShow] = useState(false);
  const [small, setSmall] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (reducedMotion) return;

    const conn = (navigator as Navigator & { connection?: NetworkInfo }).connection;
    const saveData = conn?.saveData === true;
    const slow = !!conn?.effectiveType && /2g/.test(conn.effectiveType);
    // Data-savers / very slow links keep the poster only (both breakpoints).
    if (saveData || slow) return;

    setSmall(window.matchMedia("(max-width: 640px)").matches);

    // Defer until the browser is idle so the video bytes follow the LCP paint.
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

  // Once mounted, kick off playback (autoPlay covers most browsers; this is a
  // belt-and-braces call for any that defer it with preload="none").
  useEffect(() => {
    if (show) ref.current?.play().catch(() => {});
  }, [show]);

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
        {small ? (
          <source src={BRAND.heroVideo720} type="video/mp4" />
        ) : (
          <>
            <source src={BRAND.heroVideo1080Webm} type="video/webm" />
            <source src={BRAND.heroVideo1080} type="video/mp4" />
          </>
        )}
        {/* Fallbacks already in the repo — used until the cinematic encodes land,
            and as a last resort. The browser falls through on a 404. */}
        <source src={BRAND.heroVideoWebm} type="video/webm" />
        <source src={BRAND.heroVideo} type="video/mp4" />
      </video>
    </div>
  );
}
