import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.fly.storage.tigris.dev",
        port: "",
        pathname: "/**",
      },
    ],
  },
  webpack(config, { isServer, nextRuntime }) {
    if (nextRuntime === "edge" || nextRuntime === "nodejs") {
      config.externals = [
        ...(config.externals || []),
        "better-auth/telemetry",
      ];
    }
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname),
    };
    return config;
  },
  turbopack: {},
};

export default nextConfig;
