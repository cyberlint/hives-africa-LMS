import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nexthive-lms.fly.storage.tigris.dev",
        pathname: "/**",
      },
    ],
  },

  serverExternalPackages: ["prettier"],

  experimental: {
  },

  env: {
    NEXT_PUBLIC_API_BASE_URL:
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  },
};

export default nextConfig;