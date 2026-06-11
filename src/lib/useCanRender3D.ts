"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "./useReducedMotion";

/**
 * GPU-aware gate for the WebGL scenes. 3D is a luxury garnish, never a
 * requirement — so we only light up the renderer when the device can clearly
 * afford it and the user hasn't asked for calm. Everything degrades to the
 * already-built CSS/SVG art direction when this returns false.
 *
 * Heuristics (all must pass): no Save-Data, not obviously low-memory, not a
 * phone-sized viewport (mobile-lite), and a usable WebGL context exists.
 */
function detectCapable(): boolean {
  if (typeof window === "undefined") return false;

  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };

  if (nav.connection?.saveData) return false;
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory > 0 && nav.deviceMemory < 4) {
    return false;
  }
  // Mobile-lite: phones keep the lightweight CSS scene (battery + perf).
  if (window.matchMedia("(max-width: 640px)").matches) return false;

  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    return Boolean(gl);
  } catch {
    return false;
  }
}

export function useCanRender3D(): boolean {
  const reducedMotion = useReducedMotion();
  // Server + first client paint render nothing (false), then we re-evaluate on
  // mount — this keeps SSR markup stable and avoids hydration mismatch.
  const [capable, setCapable] = useState(false);

  useEffect(() => {
    setCapable(detectCapable());
  }, []);

  return capable && !reducedMotion;
}
