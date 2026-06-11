"use client";

import { createElement, useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

/**
 * Lightweight scroll-reveal wrapper built on IntersectionObserver (no library).
 * Adds `is-in` once the element enters the viewport, triggering the CSS
 * transitions defined in globals.css (`reveal` / `clip-reveal`). Under
 * reduced-motion the CSS forces the final state immediately, so this is a no-op.
 *
 * In Phase 2 the richer section choreography moves to GSAP ScrollTrigger; this
 * primitive stays for simple one-shot reveals.
 */
export function Reveal({
  children,
  as: Tag = "div",
  variant = "reveal",
  delay = 0,
  className = "",
  style,
  once = true,
}: {
  children: ReactNode;
  as?: ElementType;
  variant?: "reveal" | "clip-reveal";
  delay?: number;
  className?: string;
  style?: CSSProperties;
  once?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // The element that actually transitions: the inner span for clip reveals,
    // the element itself for plain reveals. The delay is applied there.
    const animated = (el.querySelector(".clip-inner") as HTMLElement | null) ?? el;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            animated.style.transitionDelay = `${delay}ms`;
            entry.target.classList.add("is-in");
            if (once) io.unobserve(entry.target);
          } else if (!once) {
            entry.target.classList.remove("is-in");
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.15 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [delay, once]);

  // createElement (not JSX) for the dynamic tag: once @react-three/fiber's
  // global JSX augmentation is in the build, a JSX `<Tag>` with ElementType
  // collapses its props to `never`. createElement keeps this fully typed.
  const inner =
    variant === "clip-reveal" ? <span className="clip-inner">{children}</span> : children;
  return createElement(Tag, { ref, className: `${variant} ${className}`, style }, inner);
}
