import { Composition } from "remotion";
import { HeroLoop } from "./HeroLoop";

/**
 * Composition registry. A single 1080p, 30fps, 10-second cinematic loop that
 * sits furthest back in the hero (-z-[8]) beneath the gradient and the live R3F
 * butterfly. 300 frames @ 30fps = 10s; every animated value is periodic over
 * that window so the exported clip loops seamlessly when played with `loop`.
 */
export function RemotionRoot() {
  return (
    <Composition
      id="HeroLoop"
      component={HeroLoop}
      durationInFrames={300}
      fps={30}
      width={1920}
      height={1080}
    />
  );
}
