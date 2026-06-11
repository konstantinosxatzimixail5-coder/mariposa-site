import { registerRoot } from "remotion";
import { RemotionRoot } from "./Root";

// Entry point for the Remotion bundle. Studio (`pnpm remotion:studio`) and the
// CLI renders (`pnpm remotion:render`) both load this file. It is intentionally
// outside src/ and excluded from the Next build + tsconfig so the heavy
// @remotion/* deps never touch the site bundle — the rendered .mp4/.webm/poster
// are committed to public/video and played by the lightweight <HeroVideo>.
registerRoot(RemotionRoot);
