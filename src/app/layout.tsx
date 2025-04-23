import type { Metadata } from "next";
import { FeatureMono } from "@/fonts";

import { CookieBanner } from "@/components/ui/cookie-banner";

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
        url: "https://cdn.rickowens.eu/products/192775/product/RL01E5716_PCVS_09_01.jpg?1739878889",
        width: 600,
        height: 600,
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
