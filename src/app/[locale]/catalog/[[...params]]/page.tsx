import { Suspense } from "react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { generateCommonMetadata } from "@/lib/common-metadata";
import { getShopMeta } from "@/lib/shop/server";
import { catalogJsonLd, jsonLdHtml } from "@/lib/structured-data";

import { CatalogContent } from "../_components/catalog-content";
import { CatalogSkeleton } from "../_components/catalog-skeleton";

/** Shared resolution of the listing's display title + description key. */
function resolveCatalogCopy(firstParam?: string) {
  const p = firstParam?.toLowerCase();
  const title =
    p === "men"
      ? "men"
      : p === "women"
        ? "women"
        : p === "objects"
          ? "objects"
          : "catalog";
  const descriptionKey =
    p === "men"
      ? "men description"
      : p === "women"
        ? "women description"
        : p === "objects"
          ? "objects description"
          : "catalog description";
  return { title, descriptionKey };
}

interface CatalogPageProps {
  params: Promise<{
    locale: string;
    params?: string[];
  }>;
  searchParams: Promise<{
    order?: string;
    sort?: string;
    size?: string;
    subCategoryIds?: string;
    topCategoryIds?: string;
    sale?: string;
    tag?: string;
  }>;
}

// lekalo-shop: rendered per request — the page depends on the request host
// (which shop). A static/ISR page would be built without a host and could be
// served to every shop. Backend data stays in Next's data cache, keyed per shop.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; params?: string[] }>;
}): Promise<Metadata> {
  const brand = await getShopMeta();
  const { locale, params: routeParams } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  const { title, descriptionKey } = resolveCatalogCopy(routeParams?.[0]);
  const displayTitle = title === "catalog" ? t("catalog") : title;

  return generateCommonMetadata({
    brand,
    title: displayTitle.toUpperCase(),
    description: t(descriptionKey, { brand: brand.name }),
    locale,
    path: routeParams?.length
      ? `/catalog/${routeParams.join("/")}`
      : "/catalog",
  });
}

export default async function CatalogPage(props: CatalogPageProps) {
  const brand = await getShopMeta();
  const { locale, params: routeParams } = await props.params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const { title, descriptionKey } = resolveCatalogCopy(routeParams?.[0]);
  const displayTitle = title === "catalog" ? t("catalog") : title;

  const jsonLd = catalogJsonLd({
    site: brand,
    locale,
    routeParams,
    name: displayTitle.toUpperCase(),
    description: t(descriptionKey, { brand: brand.name }),
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdHtml(jsonLd) }}
      />
      <Suspense fallback={<CatalogSkeleton />}>
        <CatalogContent {...props} />
      </Suspense>
    </>
  );
}
