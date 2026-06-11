"use client";

import dynamic from "next/dynamic";
import { useCanRender3D } from "@/lib/useCanRender3D";

const Atmosphere = dynamic(() => import("./Atmosphere"), { ssr: false });

/**
 * Fixed, full-viewport, pointer-transparent atmosphere layer behind the entire
 * page. Held at a low opacity so the soft cyan ripples read as the calm of the
 * Aegean just beneath the surface rather than an effect. Sits behind all content
 * (z-index -1). Degrades to nothing; the page art-direction stands alone.
 */
export function AtmosphereMount() {
  const canRender = useCanRender3D();
  if (!canRender) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: -1, opacity: 0.6 }}
    >
      <Atmosphere />
    </div>
  );
}
