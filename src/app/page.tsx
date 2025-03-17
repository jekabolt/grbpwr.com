import { Metadata } from "next";

import { serviceClient } from "@/lib/api";
import FlexibleLayout from "@/components/flexible-layout";
import { EmptyHero } from "@/components/ui/empty-hero";
import { Ads } from "@/app/_components/ads";

import { MainAds } from "./_components/main-ads";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const { hero } = await serviceClient.GetHero({});
    const main =
      hero?.entities?.[0].main?.single?.mediaLandscape?.media?.fullSize
        ?.mediaUrl;
    const single =
      hero?.entities?.[0].single?.mediaLandscape?.media?.fullSize?.mediaUrl;
    const double =
      hero?.entities?.[0].double?.left?.mediaLandscape?.media?.fullSize
        ?.mediaUrl;

    return {
      title: "main",
      description: "main",
      openGraph: {
        images: main,
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
