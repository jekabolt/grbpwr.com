import { Metadata } from "next";
import { cookies } from "next/headers";
import { FeatureMono } from "@/fonts";
import { routing } from "@/i18n/routing";
import { GoogleTagManager } from "@next/third-parties/google";
import { NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";

import { generateCommonMetadata } from "@/lib/common-metadata";
import { AnalyticsInit } from "@/components/analytics-init";
import { PageTransition } from "@/components/page-transition";
import { CookieBanner } from "@/components/ui/cookie-banner";
import { GeoSuggestWrapper } from "@/components/ui/geo-suggest-wrapper";
import { SiteGuard } from "@/components/ui/site-guard";
import { ToastProvider } from "@/components/ui/toaster";

import "../globals.css";

import { HtmlThemeSync } from "@/components/html-theme-sync";
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
};

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

const CONSENT_COOKIE = "cookieConsent";

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);
  const messages = await getMessages();
  const cookieStore = await cookies();
  const hasConsent = !!cookieStore.get(CONSENT_COOKIE)?.value;

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
        <NextIntlClientProvider locale={locale} messages={messages}>
          <HtmlThemeSync />
          <CookieBanner defaultVisible={!hasConsent} />
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
