"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

/**
 * Scrubbed parallax driven by ScrollTrigger. `speed` is the fraction of its own
 * height the element travels across the viewport pass (negative = moves up
 * faster, i.e. recedes). Gated behind `prefers-reduced-motion: no-preference`
 * via gsap.matchMedia so reduced-motion users get a static element.
 */
export function Parallax({
  children,
  speed = -0.15,
  className,
  style,
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Parallax is a desktop/wheel enhancement only. Scrubbed ScrollTrigger forces
    // layout work on every scroll frame, which makes touch scrolling stutter, so
    // we gate it to fine-pointer devices — phones/tablets get a static element
    // (and so do reduced-motion users).
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference) and (pointer: fine)", () => {
      gsap.fromTo(
        el,
        { yPercent: -speed * 50 },
        {
          yPercent: speed * 50,
          ease: "none",
          scrollTrigger: {
            trigger: el.parentElement ?? el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    });

    return () => mm.revert();
  }, [speed]);

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
