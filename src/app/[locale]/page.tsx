import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { getHero, getLatestProductDate } from "@/lib/api";
import { generateCommonMetadata } from "@/lib/common-metadata";
import { siteJsonLd } from "@/lib/structured-data";
import { isVideo } from "@/lib/utils";
import FlexibleLayout from "@/components/flexible-layout";
import { Disabled } from "@/components/ui/disabled";
import { EmptyHero } from "@/components/ui/empty-hero";

import { Ads } from "./_components/ads";
import { MainAds } from "./_components/main-ads";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  const description = t("description");

  // Prefer the hero's landscape image as the social preview — a real preview
  // beats the square logo. getHero() is React-cached, so this is deduped with
  // the page render below (no extra request). Fall back to the logo for video
  // heroes or when no hero is set.
  const { hero } = await getHero();
  const heroMedia = hero?.entities?.[0]?.main?.single?.mediaLandscape?.media;
  const heroUrl = heroMedia?.fullSize?.mediaUrl;
  const useHero = Boolean(heroUrl) && !isVideo(heroUrl);

  return generateCommonMetadata({
    title: "GRBPWR — Ready-to-wear & Archive",
    description,
    locale,
    path: "",
    ogParams: useHero
      ? {
          imageUrl: heroUrl,
          imageWidth: heroMedia?.fullSize?.width || undefined,
          imageHeight: heroMedia?.fullSize?.height || undefined,
          imageAlt: "GRBPWR",
        }
      : {
          imageUrl: "/app-logo.webp",
          imageWidth: 512,
          imageHeight: 512,
          imageAlt: "GRBPWR",
        },
  });
}

// Mirror catalog/product: serve a statically generated (ISR) homepage so it is
// CDN-cacheable instead of a full SSR + cache MISS on every request. Revalidated
// on demand via /api/revalidate like the rest of the catalog.
export const dynamic = "force-static";
export const dynamicParams = true;

export default async function Page() {
  // Fetch in parallel so the freshness query doesn't add latency to the homepage.
  const [{ hero, dictionary }, latestProductDate] = await Promise.all([
    getHero(),
    getLatestProductDate(),
  ]);
  const isHero = hero?.entities?.length;
  const isWebsiteEnabled = dictionary?.siteEnabled;

  // Get the hero image URL for background color extraction
  // const heroImageUrl =
  //   hero?.entities?.[0]?.main?.single?.mediaPortrait?.media?.thumbnail
  //     ?.mediaUrl;

  if (!isWebsiteEnabled) {
    return <Disabled />;
  }
  if (!isHero) {
    return <EmptyHero />;
  }

  const jsonLd = siteJsonLd(latestProductDate);

  return (
    <FlexibleLayout showAnnounce={true}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* <PageBackground imageUrl={heroImageUrl} /> */}
      <MainAds main={hero?.entities?.[0]?.main} />
      <Ads entities={hero?.entities || []} />
    </FlexibleLayout>
  );
}
