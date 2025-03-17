import { Metadata } from "next";

import { serviceClient } from "@/lib/api";
import FlexibleLayout from "@/components/flexible-layout";
import { EmptyHero } from "@/components/ui/empty-hero";
import { Ads } from "@/app/_components/ads";

import { MainAds } from "./_components/main-ads";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const { hero } = await serviceClient.GetHero({});
    const imageUrl =
      hero?.entities?.[0]?.main?.single?.mediaLandscape?.media?.fullSize
        ?.mediaUrl ||
      hero?.entities?.[0]?.single?.mediaLandscape?.media?.fullSize?.mediaUrl ||
      hero?.entities?.[0]?.double?.left?.mediaLandscape?.media?.fullSize
        ?.mediaUrl ||
      hero?.entities?.[0]?.double?.right?.mediaLandscape?.media?.fullSize
        ?.mediaUrl;

    return {
      title: "GRBPWR",
      description:
        "Discover the latest ready-to-wear GRBPWR menswear, womenswear, and accessories at the GRBPWR online store. Worldwide express shipping.",
      openGraph: {
        title: "GRBPWR",
        description:
          "Discover the latest ready-to-wear GRBPWR menswear, womenswear, and accessories at the GRBPWR online store. Worldwide express shipping.",
        images: imageUrl,
        siteName: "GRBPWR",
      },
    };
  } catch (error) {
    return {
      title: "My Page Title",
      description: "My Page Description",
    };
  }
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
