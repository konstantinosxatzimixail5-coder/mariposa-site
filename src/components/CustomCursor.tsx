"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Subtle, desktop-only custom cursor: a small amber ring that eases toward the
 * pointer and dilates over interactive elements. Pointer-events disabled so it
 * never blocks clicks. Hidden entirely for touch / coarse pointers and for
 * reduced-motion users (we keep the native cursor there).
 */
export function CustomCursor({ enabled }: { enabled: boolean }) {
  const ring = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    setActive(true);

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const target = { ...pos };
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      const el = e.target as HTMLElement | null;
      setHovering(Boolean(el?.closest("a, button, [data-cursor='hover']")));
    };

    const tick = () => {
      pos.x += (target.x - pos.x) * 0.18;
      pos.y += (target.y - pos.y) * 0.18;
      if (ring.current) {
        ring.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
      setActive(false);
    };
  }, [enabled]);

  if (!active) return null;

  return (
    <div
      ref={ring}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 hidden md:block"
      style={{ zIndex: "var(--z-cursor)" }}
    >
      <div
        className="rounded-full border transition-[width,height,opacity,background-color] duration-300"
        style={{
          width: hovering ? 56 : 26,
          height: hovering ? 56 : 26,
          borderColor: "var(--color-amber)",
          backgroundColor: hovering
            ? "color-mix(in oklab, var(--color-amber) 12%, transparent)"
            : "transparent",
          transitionTimingFunction: "var(--ease-out-soft)",
        }}
      />
    </div>
  );
}
