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
  return [{ params: [] }, { params: ["men"] }, { params: ["women"] }];
}

// export const dynamic = "force-static";
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  const title = t("catalog");
  const description = t("description");

  return generateCommonMetadata({
    title: title.toUpperCase(),
    description,
  });
}

export default function CatalogPage(props: CatalogPageProps) {
  return (
    <Suspense fallback={<CatalogSkeleton />}>
      <CatalogContent {...props} />
    </Suspense>
  );
}
