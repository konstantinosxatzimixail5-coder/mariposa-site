"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Tiny IntersectionObserver hook used to mount/unmount the WebGL canvases so a
 * GPU context only exists while its section is near the viewport. The generous
 * default rootMargin pre-warms the scene just before it scrolls into view.
 */
export function useInView<T extends Element>(rootMargin = "200px") {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => setInView(entries[0]?.isIntersecting ?? false),
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return [ref, inView] as const;
}
