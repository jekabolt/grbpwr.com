import { Metadata } from "next";
import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";

import { serviceClient } from "@/lib/api";
import { generateCommonMetadata } from "@/lib/common-metadata";
import FlexibleLayout from "@/components/flexible-layout";
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
  const c = await cookies();
  const all = Object.fromEntries(
    c.getAll().map(({ name, value }) => [name, value]),
  );
  return (
    <FlexibleLayout theme={isHero ? "light" : "dark"}>
      <pre>{JSON.stringify(all, null, 2)}</pre>
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
