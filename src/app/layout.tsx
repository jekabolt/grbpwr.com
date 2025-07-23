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
              // Enhanced mobile detection
              function isMobileDevice() {
                return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                       (typeof window.orientation !== "undefined") ||
                       (window.innerWidth <= 768 && 'ontouchstart' in window);
              }
              
              // Apply zoom prevention only on mobile
              if (isMobileDevice()) {
                let isScrolling = false;
                
                // Track scrolling state
                document.addEventListener('scroll', function() {
                  isScrolling = true;
                  setTimeout(() => { isScrolling = false; }, 100);
                }, { passive: true });
                
                // Aggressive multi-touch prevention
                document.addEventListener('touchstart', function (event) {
                  if (event.touches.length > 1) {
                    event.preventDefault();
                    event.stopPropagation();
                  }
                }, { passive: false, capture: true });
                
                document.addEventListener('touchmove', function (event) {
                  if (event.touches.length > 1) {
                    event.preventDefault();
                    event.stopPropagation();
                  }
                }, { passive: false, capture: true });
                
                document.addEventListener('touchend', function (event) {
                  if (event.touches.length > 0) {
                    event.preventDefault();
                  }
                }, { passive: false, capture: true });
                
                // Safari gesture prevention
                ['gesturestart', 'gesturechange', 'gestureend'].forEach(function(event) {
                  document.addEventListener(event, function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                  }, { passive: false, capture: true });
                });
              }
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
