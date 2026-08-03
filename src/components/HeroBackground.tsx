"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { BRAND } from "@/lib/brand";
import type { VideoSource } from "@/lib/hero-media";

/**
 * Hero background: the poster still + the cinematic video, coordinated so the
 * video plays everywhere (desktop, Android, iOS) without hurting LCP.
 *
 * Paint order / performance:
 *  - The poster (next/image, priority → fetchpriority="high") is the LCP element:
 *    ~50KB, server-rendered, painted immediately over the gradient.
 *  - The video mounts only once the browser is idle (after first paint) with
 *    `preload="metadata"`, so it never competes with the LCP paint and then
 *    *streams* progressively — bytes spread across playback instead of arriving
 *    as one blocking burst.
 *  - Skipped entirely under reduced-motion / Save-Data / 2g: poster only.
 *
 * iOS autoplay (why this is more than just `autoPlay muted playsInline`):
 *  - React assigns `muted` as a property, and Safari can evaluate autoplay
 *    eligibility before that lands — so it blocks playback and you get a frozen
 *    poster. We set muted/playsInline imperatively the moment we get the ref,
 *    before any play attempt.
 *  - `play()` is retried on `canplay`, and once more on the first user gesture
 *    (touch / click / scroll), which recovers devices that refuse autoplay
 *    outright (e.g. iOS Low Power Mode).
 *  - The cross-fade is driven by the `playing` event, not `loadeddata`: if
 *    playback truly can't start we keep showing the poster rather than a frozen
 *    first frame, and the two layers never blend into a "double image".
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
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [show, setShow] = useState(false);
  const [small, setSmall] = useState(false);
  const [playing, setPlaying] = useState(false);

  // Decide whether to load video at all, and defer it past first paint.
  useEffect(() => {
    if (reducedMotion) return;

    const conn = (navigator as Navigator & { connection?: NetworkInfo }).connection;
    if (conn?.saveData === true) return; // data saver → poster only
    if (conn?.effectiveType && /2g/.test(conn.effectiveType)) return;

    setSmall(window.matchMedia("(max-width: 640px)").matches);

    const start = () => setShow(true);
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (w.requestIdleCallback) {
      const handle = w.requestIdleCallback(start, { timeout: 1500 });
      return () => w.cancelIdleCallback?.(handle);
    }
    const timer = window.setTimeout(start, 600);
    return () => window.clearTimeout(timer);
  }, [reducedMotion]);

  const tryPlay = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = true; // required for autoplay; must be true *before* play()
    const p = el.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
  }, []);

  // Ref callback: force the autoplay-critical attributes on before Safari looks.
  const attach = useCallback(
    (el: HTMLVideoElement | null) => {
      videoRef.current = el;
      if (!el) return;
      el.muted = true;
      el.defaultMuted = true;
      el.playsInline = true;
      el.setAttribute("muted", "");
      el.setAttribute("playsinline", "");
      el.setAttribute("webkit-playsinline", "true");
      tryPlay();
    },
    [tryPlay],
  );

  // Last resort: some devices (iOS Low Power Mode) refuse autoplay until the
  // visitor interacts. Retry once on the first gesture, then stop listening.
  useEffect(() => {
    if (!show || playing) return;
    const onGesture = () => tryPlay();
    const opts: AddEventListenerOptions = { passive: true, once: true };
    window.addEventListener("touchstart", onGesture, opts);
    window.addEventListener("click", onGesture, opts);
    window.addEventListener("scroll", onGesture, opts);
    return () => {
      window.removeEventListener("touchstart", onGesture);
      window.removeEventListener("click", onGesture);
      window.removeEventListener("scroll", onGesture);
    };
  }, [show, playing, tryPlay]);

  const sources = small ? smallSources : largeSources;
  const hasVideo = !reducedMotion && show && sources.length > 0;

  return (
    <>
      {/* Poster — the LCP element. Fades out only once the video really plays. */}
      <Image
        src={BRAND.heroPoster}
        alt=""
        aria-hidden
        priority
        fill
        sizes="100vw"
        className="-z-[9] object-cover transition-opacity duration-700"
        style={{ opacity: playing ? 0 : 0.55 }}
      />

      {hasVideo ? (
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-[8] overflow-hidden">
          <video
            ref={attach}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={BRAND.heroPoster}
            onCanPlay={tryPlay}
            onPlaying={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            className="h-full w-full object-cover transition-opacity duration-700"
            style={{ opacity: playing ? 0.55 : 0 }}
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
