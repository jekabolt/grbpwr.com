import { Metadata } from "next";

import { serviceClient } from "@/lib/api";
import FlexibleLayout from "@/components/flexible-layout";
import { EmptyHero } from "@/components/ui/empty-hero";
import { Ads } from "@/app/_components/ads";

import logo from "../../public/grbpwr-logo.webp";
import { MainAds } from "./_components/main-ads";

export async function generateMetadata(): Promise<Metadata> {
  const { hero } = await serviceClient.GetHero({});
  const heroImage =
    hero?.entities?.[0]?.main?.single?.mediaPortrait?.media?.thumbnail
      ?.mediaUrl || "";

  return {
    openGraph: {
      title: "grbpwr.com",
      description:
        "latest ready-to-wear menswear, womenswear, and accessories".toUpperCase(),
      type: "website",
      siteName: "grbpwr.com",
      images: heroImage
        ? [
            {
              url: heroImage,
              alt: "main hero image",
              width: 40,
              height: 40,
            },
          ]
        : [{ url: logo.src, alt: "grbpwr logo", width: 40, height: 40 }],
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
