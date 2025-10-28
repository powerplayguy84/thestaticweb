import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // Enable static export
  distDir: "dist", // Use 'dist' instead of 'out' for better compatibility
  images: {
    unoptimized: true, // Required for static export
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
