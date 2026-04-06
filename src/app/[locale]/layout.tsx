import { Metadata } from "next";
import Script from "next/script";
import { FeatureMono } from "@/fonts";
import { routing } from "@/i18n/routing";
import { GoogleTagManager } from "@next/third-parties/google";
import { NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";

import { GA4_MEASUREMENT_ID } from "@/lib/analitycs/utils";
import { generateCommonMetadata } from "@/lib/common-metadata";
import { AnalyticsInit } from "@/components/analytics-init";
import { PageTransition } from "@/components/page-transition";
import { CookieBanner } from "@/components/ui/cookie-banner";
import { GeoSuggestWrapper } from "@/components/ui/geo-suggest-wrapper";
import { SiteGuard } from "@/components/ui/site-guard";
import { ToastProvider } from "@/components/ui/toaster";

import "../globals.css";

import { UpdateLocation } from "@/components/ui/update-location";

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
        <link rel="preconnect" href="https://files.grbpwr.com" />
        <link rel="dns-prefetch" href="https://files.grbpwr.com" />
        <link rel="preconnect" href="https://backend.grbpwr.com" />
        <link rel="dns-prefetch" href="https://backend.grbpwr.com" />
      </head>
      <GoogleTagManager gtmId="GTM-WFC98J99" />
      <body className={FeatureMono.className}>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA4_MEASUREMENT_ID}',{send_page_view:false});`}
        </Script>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <CookieBanner />
          <ToastProvider>
            <PageTransition>
              <SiteGuard>
                <div className="relative min-h-screen">{children}</div>
              </SiteGuard>
            </PageTransition>
            <GeoSuggestWrapper />
            <UpdateLocation />
            <AnalyticsInit />
          </ToastProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
