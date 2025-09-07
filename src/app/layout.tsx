import { FeatureMono } from "@/fonts";
import { GoogleTagManager } from "@next/third-parties/google";

import { generateCommonMetadata } from "@/lib/common-metadata";
import { CookieBanner } from "@/components/ui/cookie-banner";
import { ToastProvider } from "@/components/ui/toaster";

import "./globals.css";

export const metadata = generateCommonMetadata();

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={FeatureMono.className}>
        <ToastProvider>
          <div className="lightTheme relative min-h-screen">{children}</div>
          <CookieBanner />
        </ToastProvider>
      </body>
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID || ""} />
    </html>
  );
}
