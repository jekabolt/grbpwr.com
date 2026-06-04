import { Metadata } from "next";
import Script from "next/script";
import { FeatureMono } from "@/fonts";
import { routing } from "@/i18n/routing";
import { NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";

import { GA4_MEASUREMENT_ID } from "@/lib/analitycs/utils";
import { generateCommonMetadata } from "@/lib/common-metadata";
import { AnalyticsInit } from "@/components/analytics-init";
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
        {/* Analytics deferred to lazyOnload so it doesn't compete with the
            initial render / hydration on the main thread. */}
        <Script id="gtm-init" strategy="lazyOnload">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-WFC98J99');`}
        </Script>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`}
          strategy="lazyOnload"
        />
        <Script id="gtag-init" strategy="lazyOnload">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA4_MEASUREMENT_ID}',{send_page_view:false});`}
        </Script>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <CookieBanner />
          <ToastProvider>
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
          </ToastProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
