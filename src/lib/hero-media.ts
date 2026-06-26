import "server-only";
import { existsSync } from "node:fs";
import { join } from "node:path";

/**
 * Resolve the hero <video> sources at render time from the files that exist in
 * /public/video — emitting exactly ONE resolution tier per breakpoint so the
 * browser downloads a single file, never all the fallbacks.
 *
 * Tiers are tried in order; the first whose files exist wins. The 12MB 4K master
 * (mariposa-hero-4k.mp4) is the encode source and is only ever a last resort if
 * no optimized encode is present — so on the live site only hero-720.mp4 (mobile)
 * or hero-1080.* (desktop) is served. The video is deferred and never the LCP
 * element. See docs/hero-video-encoding.md.
 */
export type VideoSource = { src: string; type: string };

const PUBLIC = join(process.cwd(), "public");
const exists = (src: string) => existsSync(join(PUBLIC, src.replace(/^\//, "")));

// Each entry is one tier (same footage, possibly multiple formats). Pick the
// first tier that exists on disk; emit only that tier's files.
const LARGE_TIERS: VideoSource[][] = [
  [
    { src: "/video/hero-1080.webm", type: "video/webm" },
    { src: "/video/hero-1080.mp4", type: "video/mp4" },
  ],
  [{ src: "/video/mariposa-hero-4k.mp4", type: "video/mp4" }],
];

const SMALL_TIERS: VideoSource[][] = [
  [{ src: "/video/hero-720.mp4", type: "video/mp4" }],
  [{ src: "/video/hero-1080.mp4", type: "video/mp4" }],
  [{ src: "/video/mariposa-hero-4k.mp4", type: "video/mp4" }],
];

function pickTier(tiers: VideoSource[][]): VideoSource[] {
  for (const tier of tiers) {
    const present = tier.filter((s) => exists(s.src));
    if (present.length) return present;
  }
  return [];
}

export function getHeroSources(): { small: VideoSource[]; large: VideoSource[] } {
  return {
    small: pickTier(SMALL_TIERS),
    large: pickTier(LARGE_TIERS),
  };
}
