import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // This app lives in a subfolder of a larger repo; pin tracing to itself so
  // Next doesn't pick a parent lockfile as the workspace root.
  outputFileTracingRoot: import.meta.dirname,
  // R3F / three need to be transpiled in the Next build pipeline.
  transpilePackages: ["three"],
  images: {
    formats: ["image/avif", "image/webp"],
    // Sanity-hosted images (dishes, services, family portraits) come from the
    // asset CDN once content is migrated into the dataset.
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
    // Inline critical CSS and defer the rest so the stylesheet stops blocking
    // first paint (Critters).
    optimizeCss: true,
  },
  // Long-lived immutable caching for the static hero media in /public/video.
  async headers() {
    return [
      {
        source: "/video/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
