import { useEffect, useLayoutEffect } from "react";

/**
 * useLayoutEffect warns during SSR; swap to useEffect on the server. GSAP setup
 * wants layout timing on the client, so this gives us that without the warning.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
