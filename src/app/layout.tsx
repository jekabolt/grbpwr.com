import { FeatureMono } from "@/fonts";

import { generateCommonMetadata } from "@/lib/common-metadata";
import { CookieBanner } from "@/components/ui/cookie-banner";

import "./globals.css";

export const metadata = generateCommonMetadata();

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
