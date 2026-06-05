import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { getHero, getLatestProductDate } from "@/lib/api";
import { generateCommonMetadata } from "@/lib/common-metadata";
import { siteJsonLd } from "@/lib/structured-data";
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

  return generateCommonMetadata({
    description,
    ogParams: {
      imageUrl: "/app-logo.webp",
      imageWidth: 512,
      imageHeight: 512,
      imageAlt: "GRBPWR",
    },
  });
}

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
