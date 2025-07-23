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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Prevent pinch zoom using Safari gesture events
              document.addEventListener("gesturestart", function (e) {
                e.preventDefault();
                document.body.style.zoom = 0.99;
              });

              document.addEventListener("gesturechange", function (e) {
                e.preventDefault();
                document.body.style.zoom = 0.99;
              });
              
              document.addEventListener("gestureend", function (e) {
                e.preventDefault();
                document.body.style.zoom = 1;
              });
              
              // Fallback for non-Safari browsers
              document.addEventListener('touchstart', function(e) {
                if (e.touches.length > 1) {
                  e.preventDefault();
                }
              }, { passive: false });
            `,
          }}
        />
      </body>
    </html>
  );
}
