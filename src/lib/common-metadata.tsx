// src/lib/metadata.ts
import { Metadata } from "next";

import logo from "../../public/app-logo.webp";

type GenerateOgParams = {
  title?: string;
  description?: string;
  imageUrl?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageAlt?: string;
};

export function generateOpenGraph({
  title = "grbpwr.com",
  description = "latest ready-to-wear menswear, womenswear, and accessories".toUpperCase(),
  imageUrl = logo.src,
  imageWidth = 512,
  imageHeight = 512,
  imageAlt = "GRBPWR",
}: GenerateOgParams = {}): Metadata["openGraph"] {
  return {
    title,
    description,
    type: "website",
    siteName: "grbpwr.com",
    images: [
      {
        url: imageUrl,
        width: imageWidth,
        height: imageHeight,
        alt: imageAlt,
      },
    ],
  };
}

export function generateCommonMetadata({
  title = "grbpwr.com",
  description = "latest ready-to-wear menswear, womenswear, and accessories",
  ogParams = {},
}: {
  title?: string;
  templateTitle?: string;
  description?: string;
  ogParams?: GenerateOgParams;
} = {}): Metadata {
  return {
    title: {
      default: title,
      template: "%s - grbpwr.com",
    },
    description,
    manifest: "/manifest.json",
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: "GRBPWR",
    },
    openGraph: generateOpenGraph({
      title,
      description: description.toUpperCase(),
      ...ogParams,
    }),
    twitter: {
      card: "player",
      title,
      description: description.toUpperCase(),
      images: [ogParams.imageUrl || logo.src],
    },
  };
}
