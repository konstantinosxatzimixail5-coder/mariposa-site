"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The hero's dappled-light layer (two slow, transform-only drifting blobs). The
 * animation is compositor-friendly but runs forever, so we pause it whenever the
 * hero scrolls out of view — no continuous paint/composite once you're past the
 * fold. Reduced motion is already handled in CSS.
 */
export function HeroAmbience() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(!!entry?.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const playState = visible ? "running" : "paused";
  return (
    <div ref={ref} aria-hidden className="absolute inset-0 -z-[4] overflow-hidden">
      <span className="leaf-light leaf-light--a" style={{ animationPlayState: playState }} />
      <span className="leaf-light leaf-light--b" style={{ animationPlayState: playState }} />
    </div>
  );
}
