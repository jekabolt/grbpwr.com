import { Metadata } from "next";

import { serviceClient } from "@/lib/api";
import { generateCommonMetadata } from "@/lib/common-metadata";
import FlexibleLayout from "@/components/flexible-layout";
import { EmptyHero } from "@/components/ui/empty-hero";
import { Ads } from "@/app/_components/ads";

import { MainAds } from "./_components/main-ads";

export const dynamic = "force-static";

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

  if (!hero?.entities?.length) return <EmptyHero />;

  return (
    <>
      <FlexibleLayout headerType="catalog" footerType="regular">
        <MainAds main={hero?.entities?.[0]?.main} />
        <Ads entities={hero?.entities || []} />
      </FlexibleLayout>
    </>
  );
}
