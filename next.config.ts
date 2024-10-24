import withMDX from "@next/mdx";
import type { NextConfig } from "next/types";

const mdxConfig = withMDX({
  extension: /\.mdx?$/,
});

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

export default mdxConfig(nextConfig);
