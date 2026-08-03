import "server-only";
import { existsSync } from "node:fs";
import { join } from "node:path";

/**
 * Resolve the hero <video> sources at render time from the files that exist in
 * /public/video — emitting exactly ONE resolution tier per breakpoint so the
 * browser downloads a single file, never all the fallbacks.
 *
 * Tiers are tried in order; the first whose files exist wins. Only hero-720.mp4
 * (mobile) or hero-1080.mp4 (desktop) is ever served — both full-length encodes
 * of the cinematic footage. The video is deferred and never the LCP element.
 * See docs/hero-video-encoding.md.
 */
export type VideoSource = { src: string; type: string };

const PUBLIC = join(process.cwd(), "public");
const exists = (src: string) => existsSync(join(PUBLIC, src.replace(/^\//, "")));

// Each entry is one tier (same footage, possibly multiple formats). Pick the
// first tier that exists on disk; emit only that tier's files.
// NOTE: mariposa-hero-4k.mp4 (12MB) is deliberately NOT listed. It is the encode
// source only — never served to a visitor. If an encode is missing the hero
// simply keeps the poster, which is far better than shipping 12MB.
const LARGE_TIERS: VideoSource[][] = [
  [{ src: "/video/hero-1080.mp4", type: "video/mp4" }],
  [{ src: "/video/hero-720.mp4", type: "video/mp4" }],
];

const SMALL_TIERS: VideoSource[][] = [
  [{ src: "/video/hero-720.mp4", type: "video/mp4" }],
  [{ src: "/video/hero-1080.mp4", type: "video/mp4" }],
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
