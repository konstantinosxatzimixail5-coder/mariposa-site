import "server-only";
import { existsSync } from "node:fs";
import { join } from "node:path";

/**
 * Resolve the hero <video> sources at render time from the files that actually
 * exist in /public/video. This guarantees the hero video is always playable with
 * whatever is committed today, and automatically upgrades to the cinematic
 * encodes (hero-1080.webm / hero-1080.mp4 / hero-720.mp4) the moment they're
 * added — no code change needed. See docs/hero-video-encoding.md for the ffmpeg
 * commands that produce them.
 *
 * Order = preference: best/correct encode first, smaller in-repo encodes last.
 */
export type VideoSource = { src: string; type: string };

const PUBLIC = join(process.cwd(), "public");
const exists = (src: string) => existsSync(join(PUBLIC, src.replace(/^\//, "")));

// Largest → smallest preference per breakpoint; filtered to what's on disk.
const LARGE: VideoSource[] = [
  { src: "/video/hero-1080.webm", type: "video/webm" },
  { src: "/video/hero-1080.mp4", type: "video/mp4" },
  { src: "/video/hero.webm", type: "video/webm" },
  { src: "/video/hero.mp4", type: "video/mp4" },
];

const SMALL: VideoSource[] = [
  { src: "/video/hero-720.mp4", type: "video/mp4" },
  { src: "/video/hero.webm", type: "video/webm" },
  { src: "/video/hero.mp4", type: "video/mp4" },
];

export function getHeroSources(): { small: VideoSource[]; large: VideoSource[] } {
  return {
    small: SMALL.filter((s) => exists(s.src)),
    large: LARGE.filter((s) => exists(s.src)),
  };
}
