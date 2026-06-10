import { Metadata } from "next";
import { notFound } from "next/navigation";
import { MotionConfig } from "framer-motion";
import { FeatureMono } from "@/fonts";
import { routing } from "@/i18n/routing";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";

import { generateCommonMetadata } from "@/lib/common-metadata";
import { AnalyticsInit } from "@/components/analytics-init";
import { DeferredAnalytics } from "@/components/deferred-analytics";
import { InternalNavigationTracker } from "@/components/internal-navigation-tracker";
import { PageTransition } from "@/components/page-transition";
import { ConsoleArtInit } from "@/components/ui/art/console-art-init";
import { CookieBanner } from "@/components/ui/cookie-banner";
import { GeoSuggestWrapper } from "@/components/ui/geo-suggest-wrapper";
import { SiteGuard } from "@/components/ui/site-guard";
import { ToastProvider } from "@/components/ui/toaster";
import { VisitedLinksSync } from "@/components/visited-links-sync";

import "../globals.css";

import { UpdateLocation } from "@/components/ui/update-location";

import { CountriesPopup } from "./_components/CountriesPopup";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  // Unknown single-segment paths (e.g. /llms.txt, /anything.ext that bypasses
  // middleware) match this [locale] route — reject them with a real 404 instead
  // of rendering the homepage with a bogus locale (soft-404).
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "meta" });

  const description = t("description");

  return generateCommonMetadata({ description });
}

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `html{background-color:#fff}body{background-color:#fff;touch-action:manipulation}html.blackTheme,html.blackTheme body{background-color:#000}`,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var p=window.location.pathname;if(/\\/timeline(\\/|$)/.test(p))document.documentElement.classList.add("blackTheme");})();`,
          }}
        />
        {/* files.grbpwr.com serves the LCP hero media — keep this preconnect.
            backend.grbpwr.com is only called server-side, so a browser preconnect
            is wasted; dropped along with the redundant dns-prefetch hints. */}
        <link
          rel="preconnect"
          href="https://files.grbpwr.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className={FeatureMono.className}>
        {/* GTM + GA4 load on first interaction (or an idle fallback) to keep
            third-party JS off the main thread during the initial load. */}
        <DeferredAnalytics />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <CookieBanner />
          <ToastProvider>
            {/* reducedMotion="user" makes every framer-motion animation
                (modal slides, bottom-sheet spring) honor the OS setting; CSS
                animations are covered by the reduced-motion block in globals.css. */}
            <MotionConfig reducedMotion="user">
              <PageTransition>
                <SiteGuard>
                  <div className="relative min-h-dvh">{children}</div>
                </SiteGuard>
              </PageTransition>
              <CountriesPopup />
              <GeoSuggestWrapper />
              <UpdateLocation />
              <AnalyticsInit />
              <InternalNavigationTracker />
              <VisitedLinksSync />
              <ConsoleArtInit />
            </MotionConfig>
          </ToastProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
