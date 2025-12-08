import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { serviceClient } from "@/lib/api";
import { generateCommonMetadata } from "@/lib/common-metadata";
import FlexibleLayout from "@/components/flexible-layout";
import { EmptyHero } from "@/components/ui/empty-hero";

import { Ads } from "./_components/ads";
import { HeroBackground } from "./_components/hero-background";
import { MainAds } from "./_components/main-ads";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  const description = t("description");

  const { hero } = await serviceClient.GetHero({});
  const heroImage =
    hero?.entities?.[0]?.main?.single?.mediaPortrait?.media?.thumbnail
      ?.mediaUrl;

  return generateCommonMetadata({
    description,
    ogParams: {
      imageUrl: heroImage,
      imageAlt: "main hero image",
    },
  });
}

export default async function Page() {
  const { hero } = await serviceClient.GetHero({});
  const isHero = hero?.entities?.length;

  // Get the hero image URL for background color extraction
  const heroImageUrl =
    hero?.entities?.[0]?.main?.single?.mediaPortrait?.media?.thumbnail
      ?.mediaUrl;

  return (
    <FlexibleLayout theme={isHero ? "light" : "dark"} showAnnounce={true}>
      <HeroBackground imageUrl={heroImageUrl} />
      {isHero ? (
        <>
          <MainAds main={hero?.entities?.[0]?.main} />
          <Ads entities={hero?.entities || []} />
        </>
      ) : (
        <EmptyHero />
      )}
    </FlexibleLayout>
  );
}
