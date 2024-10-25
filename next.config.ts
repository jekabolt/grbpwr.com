import type { NextConfig } from "next/types";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "files.grbpwr.com",
      },
      {
        protocol: "https",
        hostname: "cdn.builder.io",
      },
    ],
  },
  pageExtensions: ["mdx", "ts", "tsx"],
};

export default nextConfig;
