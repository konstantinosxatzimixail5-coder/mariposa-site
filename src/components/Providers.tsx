"use client";

import type { ReactNode } from "react";
import { SmoothScroll } from "./SmoothScroll";
import { CustomCursor } from "./CustomCursor";
import { Preloader } from "./Preloader";
import { AtmosphereMount } from "./three/AtmosphereMount";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * Client boundary for everything motion-related. Reading reduced-motion once
 * here lets both the scroll engine and the cursor branch off a single source.
 */
export function Providers({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();

  return (
    <SmoothScroll reducedMotion={reducedMotion}>
      <Preloader />
      <AtmosphereMount />
      {children}
      <CustomCursor enabled={!reducedMotion} />
    </SmoothScroll>
  );
}
