"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { BRAND } from "@/lib/brand";
import type { VideoSource } from "@/lib/hero-media";

/**
 * The restaurant's cinematic hero loop, layered above the server-rendered poster
 * (Hero's LCP element) and below the type. It plays on BOTH desktop and mobile —
 * but it is never the LCP element and never blocks first paint:
 *
 *  - prefers-reduced-motion → render nothing (poster + gradient are the calm
 *    fallback).
 *  - Save-Data / 2g → skip the download on either breakpoint, leave the poster.
 *  - Otherwise it mounts only AFTER first paint (on idle), with preload="none",
 *    then sets its source, plays, and fades in over the poster. The encode set is
 *    chosen by viewport (720p on small, 1080p on larger) and is resolved on the
 *    server to the files that actually exist, so the video always plays.
 *
 * Muted + playsInline + loop so it autoplays everywhere without controls.
 */
type NetworkInfo = { saveData?: boolean; effectiveType?: string };

export function HeroVideo({
  small: smallSources,
  large: largeSources,
}: {
  small: VideoSource[];
  large: VideoSource[];
}) {
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

  // Kick off playback once mounted (belt-and-braces for preload="none").
  useEffect(() => {
    if (show) ref.current?.play().catch(() => {});
  }, [show]);

  const sources = small ? smallSources : largeSources;
  if (reducedMotion || !show || sources.length === 0) return null;

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
        {sources.map((s) => (
          <source key={s.src} src={s.src} type={s.type} />
        ))}
      </video>
    </div>
  );
}
