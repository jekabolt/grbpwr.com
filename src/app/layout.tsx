import type { Metadata } from "next";
import { FeatureMono } from "@/fonts";

import { CookieBanner } from "@/components/ui/cookie-banner";

import "./globals.css";

export const metadata: Metadata = {
  title: "grbpwr", // Change from "grbpwr.com title" to just "grbpwr"
  description: "grbpwr", // Change from "grbpwr.com desc" to just "grbpwr"
  openGraph: {
    title: "grbpwr",
    siteName: "grbpwr",
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
