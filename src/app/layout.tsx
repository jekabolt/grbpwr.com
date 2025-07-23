import { FeatureMono } from "@/fonts";

import { generateCommonMetadata } from "@/lib/common-metadata";
import { CookieBanner } from "@/components/ui/cookie-banner";
import { ToastProvider } from "@/components/ui/toaster";

import "./globals.css";

export const metadata = generateCommonMetadata();

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
    </html>
  );
}
