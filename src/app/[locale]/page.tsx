import { Metadata } from "next";
import { routing } from "@/i18n/routing";

import { serviceClient } from "@/lib/api";
import { generateCommonMetadata } from "@/lib/common-metadata";
import FlexibleLayout from "@/components/flexible-layout";
import { EmptyHero } from "@/components/ui/empty-hero";

import { Ads } from "./_components/ads";
import { MainAds } from "./_components/main-ads";

// export const dynamic = "force-static";

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({
    locale,
  }));
}

export async function generateMetadata(): Promise<Metadata> {
  const { hero } = await serviceClient.GetHero({});
  const heroImage =
    hero?.entities?.[0]?.main?.single?.mediaPortrait?.media?.thumbnail
      ?.mediaUrl;

  return generateCommonMetadata({
    ogParams: {
      imageUrl: heroImage,
      imageAlt: "main hero image",
    },
  });
}

export default async function Page() {
  const { hero } = await serviceClient.GetHero({});
  const isHero = hero?.entities?.length;

  return (
    <FlexibleLayout theme={isHero ? "light" : "dark"}>
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
