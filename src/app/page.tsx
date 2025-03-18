import { Metadata } from "next/types";

import { serviceClient } from "@/lib/api";
import FlexibleLayout from "@/components/flexible-layout";
import { EmptyHero } from "@/components/ui/empty-hero";
import { Ads } from "@/app/_components/ads";

import { MainAds } from "./_components/main-ads";

export async function generateMetadata(): Promise<Metadata> {
  const { hero } = await serviceClient.GetHero({});
  const mainImage =
    hero?.entities?.[0]?.main?.single?.mediaLandscape?.media?.fullSize
      ?.mediaUrl ||
    hero?.entities?.[0].single?.mediaLandscape?.media?.fullSize?.mediaUrl ||
    "";

  return {
    title: "GRBPWR",
    description:
      "Discover the latest ready-to-wear GRBPWR menswear, womenswear, and accessories at the GRBPWR online store. Worldwide express shipping.",
    openGraph: {
      title: "GRBPWR",
      description:
        "Discover the latest ready-to-wear GRBPWR menswear, womenswear, and accessories at the GRBPWR online store. Worldwide express shipping.",
      images: [
        {
          url: mainImage,
          width: 1200,
          height: 630,
          alt: "GRBPWR",
        },
      ],
    },
  };
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
