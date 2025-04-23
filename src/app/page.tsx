import { Metadata } from "next";

import { serviceClient } from "@/lib/api";
import FlexibleLayout from "@/components/flexible-layout";
import { EmptyHero } from "@/components/ui/empty-hero";
import { Ads } from "@/app/_components/ads";

import { MainAds } from "./_components/main-ads";

export async function generateMetadata(): Promise<Metadata> {
  const { hero } = await serviceClient.GetHero({});
  const heroImage =
    hero?.entities?.[0]?.main?.single?.mediaLandscape?.media?.fullSize
      ?.mediaUrl || "";

  return {
    openGraph: {
      title: "GRBPWR",
      description:
        "Discover the latest ready-to-wear GRBPWR menswear, womenswear, and accessories at the GRBPWR online store. Worldwide express shipping.",
      type: "website",
      // url: "https://grbpwr.com",
      siteName: "grbpwr.com",
      images: heroImage
        ? [
            {
              url: heroImage,
              width: 1200,
              height: 630,
              alt: "GRBPWR",
            },
          ]
        : undefined,
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
