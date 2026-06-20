"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { useLenis } from "./SmoothScroll";
import { ButterflyMark } from "./ButterflyMark";
import { BRAND } from "@/lib/brand";

const DURATION = 2300; // ms — slow, weighty
const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

export function Preloader() {
  const reducedMotion = useReducedMotion();
  const lenis = useLenis();
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const skipped = useRef(false);

  // The intro is a desktop flourish only. On touch devices (coarse pointer) it
  // locks scroll for over two seconds and is heavy on first paint, so we skip it
  // there entirely. Detected in a layout effect (before paint) to avoid a flash.
  const [coarse, setCoarse] = useState(false);
  useIsomorphicLayoutEffect(() => {
    if (typeof window !== "undefined" && !window.matchMedia("(pointer: fine)").matches) {
      setCoarse(true);
    }
  }, []);
  const skipIntro = reducedMotion || coarse;

  // Count-up + reveal. Runs once; deliberately independent of `lenis` so the
  // timing loop is never torn down and restarted when smooth-scroll initialises
  // (which would reset the counter and freeze the intro). A hard fallback timer
  // guarantees the overlay always dismisses even if rAF is throttled.
  useEffect(() => {
    if (skipIntro) {
      setDone(true);
      return;
    }

    let raf = 0;
    let start: number | null = null;

    const tick = (now: number) => {
      if (start === null) start = now;
      const elapsed = skipped.current ? DURATION : now - start;
      const t = Math.min(1, elapsed / DURATION);
      setProgress(Math.round(easeOutExpo(t) * 100));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        // Brief hold on 100, then reveal.
        window.setTimeout(() => setDone(true), 320);
      }
    };
    raf = requestAnimationFrame(tick);

    // Safety net: never trap the page behind the overlay.
    const fallback = window.setTimeout(() => {
      setProgress(100);
      setDone(true);
    }, DURATION + 1200);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(fallback);
    };
  }, [skipIntro]);

  // Lock scroll while the overlay is up; release once it's gone. Kept separate
  // from the timing loop so attaching to Lenis doesn't restart the count. When
  // the intro is skipped, never lock — just make sure scrolling is free.
  useEffect(() => {
    if (skipIntro) {
      document.documentElement.classList.remove("lenis-stopped");
      document.body.style.overflow = "";
      return;
    }
    if (done) {
      lenis?.start();
      document.documentElement.classList.remove("lenis-stopped");
      document.body.style.overflow = "";
    } else {
      lenis?.stop();
      document.documentElement.classList.add("lenis-stopped");
      document.body.style.overflow = "hidden";
    }
  }, [done, lenis, skipIntro]);

  // No intro on touch / reduced-motion: render nothing (and never paint the
  // overlay), so the page is immediately scrollable.
  if (skipIntro) return null;

  const draw = progress / 100;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 flex flex-col items-center justify-center"
          style={{ zIndex: "var(--z-preloader)", background: "var(--color-ink)" }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } }}
          role="status"
          aria-label={`Loading Mariposa, ${progress} percent`}
        >
          {/* The real mark rises into view from beneath a clip as the count
              climbs, gathering a soft amber glow toward completion. */}
          <div
            className="relative h-28 w-28 md:h-36 md:w-36"
            aria-hidden
            style={{ filter: `drop-shadow(0 0 ${draw * 26}px color-mix(in oklab, var(--color-amber) 60%, transparent))` }}
          >
            <ButterflyMark title="" className="h-full w-full text-amber" />
            <div
              className="absolute inset-0"
              style={{
                background: "var(--color-ink)",
                clipPath: `inset(0 0 ${draw * 100}% 0)`,
              }}
            />
          </div>

          <div className="mt-10 flex items-baseline gap-3 font-display">
            <span className="text-amber" style={{ fontSize: "var(--text-2xl)" }}>
              {String(progress).padStart(3, "0")}
            </span>
            <span className="text-sm uppercase tracking-[0.3em] text-ivory-dim">{BRAND.name}</span>
          </div>

          <button
            type="button"
            onClick={() => (skipped.current = true)}
            className="absolute bottom-8 right-8 text-xs uppercase tracking-[0.25em] text-ivory-dim transition-colors duration-200 hover:text-ivory"
          >
            Skip intro
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
