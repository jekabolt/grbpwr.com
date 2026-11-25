import { Metadata } from "next";
import { notFound } from "next/navigation";
import { FeatureMono } from "@/fonts";
import { routing } from "@/i18n/routing";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";

import { generateCommonMetadata } from "@/lib/common-metadata";
import { shopThemeCss } from "@/lib/shop/profile";
import {
  getShopMeta,
  getShopPack,
  getShopProfile,
  shopBrandOf,
} from "@/lib/shop/server";
import { AnalyticsInit } from "@/components/analytics-init";
import { ShopContextProvider } from "@/components/contexts/ShopContext";
import { DeferredAnalytics } from "@/components/deferred-analytics";
import { InternalNavigationTracker } from "@/components/internal-navigation-tracker";
import { MotionConfigProvider } from "@/components/motion-config-provider";
import { PageTransition } from "@/components/page-transition";
import { CookieBanner } from "@/components/ui/cookie-banner";
import { GeoSuggestWrapper } from "@/components/ui/geo-suggest-wrapper";
import { SiteGuard } from "@/components/ui/site-guard";
import { ToastProvider } from "@/components/ui/toaster";
import { VisitedLinksSync } from "@/components/visited-links-sync";

import "../../globals.css";

import { ConsoleArtInit } from "@/brands/grbpwr/components/console-art-init";
import {
  GRBPWR_ANALYTICS,
  GRBPWR_PACK,
  GRBPWR_SITE,
} from "@/brands/grbpwr/config";

import { setRequestShopFrom } from "@/lib/shop/request-host";
import { UpdateLocation } from "@/components/ui/update-location";

import { CountriesPopup } from "./_components/CountriesPopup";
import { ShopClosed } from "./_components/shop-closed";
import { ShopProviders } from "./_components/shop-providers";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  await setRequestShopFrom(params);
  const brand = await getShopMeta();
  const { locale } = await params;
  // Unknown single-segment paths (e.g. /llms.txt, /anything.ext that bypasses
  // middleware) match this [locale] route — reject them with a real 404 instead
  // of rendering the homepage with a bogus locale (soft-404).
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "meta" });

  const description =
    brand.description ?? t("description", { brand: brand.name });

  return generateCommonMetadata({
    brand,
    description,
  });
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
  await setRequestShopFrom(params);
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  // Which shop: the request host. No shop on this host → 404; backend down →
  // error page (never a cached 404); shop switched off → closed page.
  const shop = await getShopProfile();
  if (shop.status === "unknown") notFound();
  if (shop.status === "error") throw new Error("shop profile unavailable");
  if (shop.status === "closed") {
    return (
      <html lang={locale}>
        <body className={FeatureMono.variable}>
          <ShopClosed name={shop.profile?.name} />
        </body>
      </html>
    );
  }
  const pack = await getShopPack();
  const isGrbpwr = pack === GRBPWR_PACK;
  const brand = shopBrandOf(shop.profile, pack);
  const themeCss = shopThemeCss(shop.profile.colors);
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        {themeCss ? (
          <style dangerouslySetInnerHTML={{ __html: themeCss }} />
        ) : null}
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
        {/* grbpwr: files.grbpwr.com serves the LCP hero media. */}
        {isGrbpwr ? (
          <link
            rel="preconnect"
            href={GRBPWR_SITE.mediaOrigin}
            crossOrigin="anonymous"
          />
        ) : null}
      </head>
      <body className={FeatureMono.variable}>
        {/* GTM + GA4 load on first interaction (or an idle fallback) to keep
            third-party JS off the main thread during the initial load. Only a
            pack carries ids; any other shop loads no analytics. */}
        <DeferredAnalytics
          gtmId={isGrbpwr ? GRBPWR_ANALYTICS.gtmId : undefined}
          ga4Id={isGrbpwr ? GRBPWR_ANALYTICS.ga4Id : undefined}
        />
        <ShopProviders>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <ShopContextProvider brand={brand}>
              <CookieBanner />
              <ToastProvider>
                <MotionConfigProvider>
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
                  {isGrbpwr ? <ConsoleArtInit /> : null}
                </MotionConfigProvider>
              </ToastProvider>
            </ShopContextProvider>
          </NextIntlClientProvider>
        </ShopProviders>
      </body>
    </html>
  );
}
