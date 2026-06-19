"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { RotateCw } from "lucide-react";

/**
 * Drag-to-rotate 360° viewer. Cycles through ordered frames as the pointer
 * drags horizontally. Render only when `frames.length > 1`.
 */
export function Spin360({ frames, alt }: { frames: string[]; alt: string }) {
  const [index, setIndex] = useState(0);
  const drag = useRef<{ x: number; start: number } | null>(null);

  function onDown(e: React.PointerEvent) {
    drag.current = { x: e.clientX, start: index };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }
  function onMove(e: React.PointerEvent) {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    const step = Math.round(dx / 8);
    const next = (((drag.current.start + step) % frames.length) + frames.length) % frames.length;
    setIndex(next);
  }
  function onUp() {
    drag.current = null;
  }

  const deg = Math.round((index / frames.length) * 360);

  return (
    <div
      className="relative h-full w-full cursor-ew-resize touch-none select-none"
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
    >
      <Image src={frames[index]!} alt={alt} fill sizes="(min-width:768px) 36rem, 90vw" className="object-cover" priority />
      <span
        className="absolute left-3 top-3 rounded-full px-2 py-1 text-xs font-medium"
        style={{ background: "color-mix(in oklab, var(--color-ink) 70%, transparent)", color: "var(--color-ivory)" }}
      >
        {deg}°
      </span>
      <span
        className="absolute bottom-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 rounded-full px-3 py-1.5 text-xs uppercase tracking-[0.18em]"
        style={{ background: "color-mix(in oklab, var(--color-ink) 70%, transparent)", color: "var(--color-ivory)" }}
      >
        <RotateCw className="h-3.5 w-3.5" /> Drag to rotate
      </span>
    </div>
  );
}
