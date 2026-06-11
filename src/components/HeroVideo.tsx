"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { BRAND } from "@/lib/brand";

/**
 * Plays the restaurant's own cinematic 4K hero footage as the furthest-back
 * hero layer (the Remotion-rendered loop is the documented fallback/alt asset).
 * It is purely decorative atmosphere, so:
 *
 *  - Under prefers-reduced-motion it renders nothing — the CSS gradient behind
 *    it (Hero's -z-10 layer) is the complete, calm fallback.
 *  - If the file is missing, the <video> simply fails to load; we keep it
 *    invisible so the gradient shows through. Nothing breaks.
 *
 * Muted + playsInline + loop so it autoplays everywhere without controls.
 */
export function HeroVideo() {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    // If metadata is already available (cached), reveal immediately.
    if (v.readyState >= 1) setReady(true);
  }, []);

  if (reducedMotion) return null;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-[8] overflow-hidden">
      <video
        ref={ref}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onLoadedData={() => setReady(true)}
        className="h-full w-full object-cover transition-opacity duration-700"
        style={{ opacity: ready ? 0.55 : 0 }}
      >
        <source src={BRAND.heroVideo} type="video/mp4" />
      </video>
    </div>
  );
}
