import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove 'output: export' for Vercel deployment - it breaks dynamic routing
  // distDir defaults to '.next' which Vercel expects
  images: {
    // Keep unoptimized for remote images
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
