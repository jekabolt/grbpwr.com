import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { getHero, getLatestProductDate } from "@/lib/api";
import { generateCommonMetadata } from "@/lib/common-metadata";
import { setRequestShopFrom } from "@/lib/shop/request-host";
import { getShopMeta } from "@/lib/shop/server";
import { jsonLdHtml, siteJsonLd } from "@/lib/structured-data";
import FlexibleLayout from "@/components/flexible-layout";
import { Disabled } from "@/components/ui/disabled";
import { EmptyHero } from "@/components/ui/empty-hero";

import { HeroView } from "./_components/hero-view";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  await setRequestShopFrom(params);
  const brand = await getShopMeta();
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  const description = t("description", { brand: brand.name });

  // Social preview is the shop's logo (from its brand block), not the hero
  // image — keeps link previews consistent regardless of the current hero.
  return generateCommonMetadata({
    brand,
    title: brand.homeTitle ?? brand.name,
    description: brand.description ?? description,
    locale,
    path: "",
    ...(brand.homeOg ? { ogParams: brand.homeOg } : {}),
  });
}

// Mirror catalog/product: serve a statically generated (ISR) homepage so it is
// CDN-cacheable instead of a full SSR + cache MISS on every request. The
// `[shop]` segment keys the cache per host. Revalidated on demand via
// /api/revalidate like the rest of the catalog.
export const dynamic = "force-static";
export const dynamicParams = true;

export default async function Page({
  params,
}: {
  params: Promise<{ shop: string }>;
}) {
  await setRequestShopFrom(params);
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

  const jsonLd = siteJsonLd(await getShopMeta(), latestProductDate);

  // A NEWSLETTER hero block already captures email on the page, so suppress the
  // duplicate footer newsletter when one is present.
  const hasNewsletterHero = hero?.entities?.some(
    (e) => e.type === "HERO_TYPE_NEWSLETTER",
  );

  return (
    <FlexibleLayout
      showAnnounce={true}
      hideFooterNewsletter={hasNewsletterHero}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdHtml(jsonLd) }}
      />
      {/* <PageBackground imageUrl={heroImageUrl} /> */}
      <HeroView hero={hero} />
    </FlexibleLayout>
  );
}
