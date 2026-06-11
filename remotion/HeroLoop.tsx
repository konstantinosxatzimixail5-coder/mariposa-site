import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * Mariposa hero light-field — a slow, cinematic morning over the garden.
 *
 * Everything is periodic over `durationInFrames` so the exported file loops
 * seamlessly: the two coloured light pools orbit on full sine/cosine cycles, the
 * amber sun breathes on a whole number of cycles, and each pollen speck runs a
 * complete fade-in/fade-out lifecycle that ends where it began. No assets, no
 * video footage — pure layered gradients rendered by Remotion to mp4/webm.
 *
 * Brand palette only: ink ground, olive light pool, amber sun. (The cool Aegean
 * pool was removed so the loop reads as warm garden light, with no sea effect.)
 */

const INK = "#0E0F0D";
const OLIVE = "#6B7B52";
const AMBER = "#C9A86A";

const POLLEN_COUNT = 70;

export function HeroLoop() {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();

  // Normalised loop position 0..1 and the matching angle for periodic motion.
  const p = frame / durationInFrames;
  const tau = Math.PI * 2;

  // Olive pool counter-orbits low-left, completing exactly one revolution per
  // loop so the exported file stays seamless.
  const oliveX = 16 + Math.cos(p * tau + Math.PI) * 8;
  const oliveY = 96 + Math.sin(p * tau + Math.PI) * 5;

  // The amber "sun" breathes over two full cycles across the loop.
  const sunGlow = interpolate(Math.sin(p * tau * 2), [-1, 1], [0.32, 0.52]);

  return (
    <AbsoluteFill style={{ backgroundColor: INK }}>
      {/* Olive light pool */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(60% 55% at ${oliveX}% ${oliveY}%, ${rgba(OLIVE, 0.4)} 0%, transparent 58%)`,
        }}
      />
      {/* Amber morning sun, upper-right, breathing */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(40% 40% at 78% 4%, ${rgba(AMBER, sunGlow)} 0%, transparent 55%)`,
        }}
      />

      {/* Drifting pollen */}
      {Array.from({ length: POLLEN_COUNT }, (_, i) => (
        <Pollen key={i} index={i} p={p} width={width} height={height} />
      ))}

      {/* Vignette to settle the edges and keep focus centre-stage */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(75% 75% at 50% 45%, transparent 55%, ${rgba(INK, 0.85)} 100%)`,
        }}
      />
    </AbsoluteFill>
  );
}

/** A single amber speck rising and fading on a self-contained loop. */
function Pollen({ index, p, width, height }: { index: number; p: number; width: number; height: number }) {
  // Stable per-speck traits from a seeded RNG (deterministic across renders).
  const baseX = random(`x-${index}`) * width;
  const size = 2 + random(`s-${index}`) * 4;
  const sway = 18 + random(`w-${index}`) * 40;
  const phase = random(`p-${index}`); // staggers each speck along the lifecycle

  // Lifecycle 0..1, wrapped so it always completes a whole cycle per loop.
  const life = (p + phase) % 1;

  // Rise from just below the frame to just above it.
  const y = interpolate(life, [0, 1], [height * 1.05, -height * 0.05]);
  const x = baseX + Math.sin(life * Math.PI * 2 + index) * sway;

  // Fade in at the bottom, hold, fade out at the top — ends at 0, like it began.
  const opacity = interpolate(life, [0, 0.12, 0.85, 1], [0, 0.7, 0.7, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: "50%",
        background: AMBER,
        opacity,
        filter: "blur(0.5px)",
        boxShadow: `0 0 ${size * 2}px ${rgba(AMBER, 0.6)}`,
      }}
    />
  );
}

/** Hex (#RRGGBB) → rgba() string at the given alpha. */
function rgba(hex: string, alpha: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
