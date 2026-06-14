import { Suspense } from "react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { generateCommonMetadata } from "@/lib/common-metadata";
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

export async function generateStaticParams() {
  return [
    { params: [] },
    { params: ["men"] },
    { params: ["women"] },
    { params: ["objects"] },
  ];
}

export const dynamic = "force-static";
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; params?: string[] }>;
}): Promise<Metadata> {
  const { locale, params: routeParams } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  const { title, descriptionKey } = resolveCatalogCopy(routeParams?.[0]);
  const displayTitle = title === "catalog" ? t("catalog") : title;

  return generateCommonMetadata({
    title: displayTitle.toUpperCase(),
    description: t(descriptionKey),
    locale,
    path: routeParams?.length
      ? `/catalog/${routeParams.join("/")}`
      : "/catalog",
  });
}

export default async function CatalogPage(props: CatalogPageProps) {
  const { locale, params: routeParams } = await props.params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const { title, descriptionKey } = resolveCatalogCopy(routeParams?.[0]);
  const displayTitle = title === "catalog" ? t("catalog") : title;

  const jsonLd = catalogJsonLd({
    locale,
    routeParams,
    name: displayTitle.toUpperCase(),
    description: t(descriptionKey),
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
