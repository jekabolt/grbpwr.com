import { Suspense } from "react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { generateCommonMetadata } from "@/lib/common-metadata";

import { CatalogContent } from "../_components/catalog-content";
import { CatalogSkeleton } from "../_components/catalog-skeleton";

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

  const firstParam = routeParams?.[0]?.toLowerCase();
  const descriptionKey =
    firstParam === "men"
      ? "men description"
      : firstParam === "women"
        ? "women description"
        : firstParam === "objects"
          ? "objects description"
          : "catalog description";

  const title =
    firstParam === "men"
      ? "men"
      : firstParam === "women"
        ? "women"
        : firstParam === "objects"
          ? "objects"
          : t("catalog");

  return generateCommonMetadata({
    title: title.toUpperCase(),
    description: t(descriptionKey),
  });
}

export default function CatalogPage(props: CatalogPageProps) {
  return (
    <Suspense fallback={<CatalogSkeleton />}>
      <CatalogContent {...props} />
    </Suspense>
  );
}
