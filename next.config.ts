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
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

export default nextConfig;
