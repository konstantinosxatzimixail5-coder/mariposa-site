"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Single source of truth for the smooth-scroll instance and for the app's only
 * RAF loop.
 *
 * Integration model (the canonical Lenis + GSAP recipe):
 *   - GSAP's ticker is the one RAF — it drives `lenis.raf()` each frame.
 *   - Lenis's `scroll` event drives `ScrollTrigger.update()`.
 *   - lagSmoothing is disabled so heavy frames don't desync scroll ↔ triggers.
 * This keeps Lenis, all ScrollTrigger choreography and (Phase 3) the R3F render
 * loop perfectly in lockstep at 60fps.
 *
 * Under `prefers-reduced-motion` we never instantiate Lenis: native scroll, no
 * inertia. Section animations are independently gated via `gsap.matchMedia`, so
 * the page is fully static in that mode.
 */
const LenisContext = createContext<Lenis | null>(null);

export function useLenis(): Lenis | null {
  return useContext(LenisContext);
}

export function SmoothScroll({
  children,
  reducedMotion,
}: {
  children: ReactNode;
  reducedMotion: boolean;
}) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (reducedMotion) return;

    const instance = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.2,
    });

    setLenis(instance);
    document.documentElement.classList.add("lenis");

    instance.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => {
      // GSAP ticker time is in seconds; Lenis expects milliseconds.
      instance.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Recalculate trigger positions once smooth scroll is live.
    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(tick);
      instance.off("scroll", ScrollTrigger.update);
      document.documentElement.classList.remove("lenis");
      instance.destroy();
      setLenis(null);
    };
  }, [reducedMotion]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
