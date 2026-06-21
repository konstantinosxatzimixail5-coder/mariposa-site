import "server-only";
import { existsSync } from "node:fs";
import { join } from "node:path";

/**
 * Resolve the hero <video> sources at render time from the files that actually
 * exist in /public/video.
 *
 * The REAL cinematic restaurant footage lives only in mariposa-hero-4k.mp4.
 * (`hero.webm`/`hero.mp4` are a separate abstract Remotion light-field loop and
 * are NOT the hero film, so they are not used here.) We serve the cinematic
 * master directly so the actual footage always plays, and automatically prefer
 * the optimized cinematic encodes (hero-1080.webm / hero-1080.mp4 / hero-720.mp4)
 * the moment they're added — see docs/hero-video-encoding.md. The 4K master is
 * deferred and never the LCP element, so it doesn't block first paint.
 *
 * Order = preference: smallest correct encode first, cinematic master last.
 */
export type VideoSource = { src: string; type: string };

const PUBLIC = join(process.cwd(), "public");
const exists = (src: string) => existsSync(join(PUBLIC, src.replace(/^\//, "")));

const LARGE: VideoSource[] = [
  { src: "/video/hero-1080.webm", type: "video/webm" },
  { src: "/video/hero-1080.mp4", type: "video/mp4" },
  { src: "/video/mariposa-hero-4k.mp4", type: "video/mp4" },
];

const SMALL: VideoSource[] = [
  { src: "/video/hero-720.mp4", type: "video/mp4" },
  { src: "/video/hero-1080.mp4", type: "video/mp4" },
  { src: "/video/mariposa-hero-4k.mp4", type: "video/mp4" },
];

export function getHeroSources(): { small: VideoSource[]; large: VideoSource[] } {
  return {
    small: SMALL.filter((s) => exists(s.src)),
    large: LARGE.filter((s) => exists(s.src)),
  };
}
