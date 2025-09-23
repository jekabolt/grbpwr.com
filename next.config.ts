import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from "next/types";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: {
      compilationMode: 'annotation'
    }
  },
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

export default withNextIntl(nextConfig);

