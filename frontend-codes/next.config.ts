import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["better-auth"],
  experimental: {
    serverMinification: false,
  },
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

  env: {
    NEXT_PUBLIC_API_BASE_URL:
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000",
  },
};

export default nextConfig;