"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { BRAND } from "@/lib/brand";
import type { VideoSource } from "@/lib/hero-media";

/**
 * Hero background: the poster still + the cinematic video, coordinated so they
 * never blend into a "double image".
 *
 *  - The poster (next/image, priority → fetchpriority="high") is the LCP element,
 *    server-rendered and painted immediately at 55% over the gradient.
 *  - The video is deferred (mounts on idle, preload="none") and skipped entirely
 *    under reduced-motion / Save-Data / 2g, so phones and data-savers keep just
 *    the poster.
 *  - The moment the video is actually playing (onLoadedData) the poster fades to
 *    0 as the video fades to 55% — a clean cross-fade, so only ONE layer is ever
 *    visible. (Previously both sat at 55% and their differing frames ghosted.)
 */
type NetworkInfo = { saveData?: boolean; effectiveType?: string };

export function HeroBackground({
  small: smallSources,
  large: largeSources,
}: {
  small: VideoSource[];
  large: VideoSource[];
}) {
  const reducedMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [show, setShow] = useState(false);
  const [small, setSmall] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (reducedMotion) return;

    const conn = (navigator as Navigator & { connection?: NetworkInfo }).connection;
    const saveData = conn?.saveData === true;
    const slow = !!conn?.effectiveType && /2g/.test(conn.effectiveType);
    if (saveData || slow) return; // poster only

    setSmall(window.matchMedia("(max-width: 640px)").matches);

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

  useEffect(() => {
    if (show) videoRef.current?.play().catch(() => {});
  }, [show]);

  const sources = small ? smallSources : largeSources;
  const hasVideo = !reducedMotion && show && sources.length > 0;

  return (
    <>
      {/* Poster — LCP element; fades out once the video is playing. */}
      <Image
        src={BRAND.heroPoster}
        alt=""
        aria-hidden
        priority
        fill
        sizes="100vw"
        className="-z-[9] object-cover transition-opacity duration-700"
        style={{ opacity: ready ? 0 : 0.55 }}
      />

      {hasVideo ? (
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-[8] overflow-hidden">
          <video
            ref={videoRef}
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
      ) : null}
    </>
  );
}
