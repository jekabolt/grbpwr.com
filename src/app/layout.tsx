import type { Metadata } from "next";
import { FeatureMono } from "@/fonts";

import { CookieBanner } from "@/components/ui/cookie-banner";

import logo from "../../public/grbpwr-logo.webp";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "grbpwr.com",
    template: "%s - grbpwr.com",
  },
  description: "grbpwr.com",

  openGraph: {
    title: "grbpwr.com",
    description:
      "GRBPWR latest ready-to-wear menswear, womenswear, and accessories",
    type: "website",
    siteName: "grbpwr.com",
    images: [
      {
        url: logo.src,
        width: 40,
        height: 40,
      },
    ],
  },
};

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={FeatureMono.className}>
        <div className="lightTheme relative min-h-screen">{children}</div>
        <CookieBanner />
      </body>
    </html>
  );
}
