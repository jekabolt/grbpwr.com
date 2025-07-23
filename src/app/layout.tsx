import { FeatureMono } from "@/fonts";

import { generateCommonMetadata } from "@/lib/common-metadata";
import { CookieBanner } from "@/components/ui/cookie-banner";
import { ToastProvider } from "@/components/ui/toaster";

import "./globals.css";

export const metadata = generateCommonMetadata();

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
  minimumScale: 1.0,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, viewport-fit=cover"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Safari zoom prevention
              document.addEventListener('gesturestart', function (e) {
                e.preventDefault();
              });
              document.addEventListener('gesturechange', function (e) {
                e.preventDefault();
              });
              document.addEventListener('gestureend', function (e) {
                e.preventDefault();
              });
            `,
          }}
        />
      </head>
      <body className={FeatureMono.className}>
        <ToastProvider>
          <div className="lightTheme relative min-h-screen">{children}</div>
          <CookieBanner />
        </ToastProvider>
      </body>
    </html>
  );
}
