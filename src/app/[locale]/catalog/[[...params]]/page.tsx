import { Metadata } from "next";
import { CATALOG_LIMIT } from "@/constants";
import { getTranslations } from "next-intl/server";

import { serviceClient } from "@/lib/api";
import { resolveCategories } from "@/lib/categories-map";
import { generateCommonMetadata } from "@/lib/common-metadata";
import FlexibleLayout from "@/components/flexible-layout";
import { HeroArchive } from "@/app/[locale]/_components/hero-archive";
import { MobileCatalog } from "@/app/[locale]/catalog/_components/mobile-catalog";

import Catalog from "../_components/catalog";
import { NextCategoryButton } from "../_components/next-category-button";
import {
  getProductsPagedQueryParams,
  parseRouteParams,
} from "../_components/utils";

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

export const dynamic = "force-static";
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

// Products component that can be streamed
async function CatalogProducts({
  searchParams,
  params,
}: {
  searchParams: CatalogPageProps["searchParams"];
  params: CatalogPageProps["params"];
}) {
  const resolvedSearchParams = await searchParams;
  const resolvedParams = await params;

  const { gender, categoryName, subCategoryName } = parseRouteParams(
    resolvedParams?.params,
  );

  const { dictionary } = await serviceClient.GetHero({});

  const { topCategory, subCategory } = resolveCategories(
    dictionary?.categories,
    categoryName,
    subCategoryName,
  );

  // Fetch products - already cached via PRODUCTS_CACHE_TAG in lib/api.ts
  const response = await serviceClient.GetProductsPaged({
    limit: CATALOG_LIMIT,
    offset: 0,
    ...getProductsPagedQueryParams(
      {
        ...resolvedSearchParams,
        gender,
        topCategoryIds: !subCategory ? topCategory?.id?.toString() : undefined,
        subCategoryIds: subCategory?.id?.toString(),
      },
      dictionary,
    ),
  });

  return (
    <>
      <div className="block lg:hidden">
        <MobileCatalog
          firstPageItems={response.products || []}
          total={response.total || 0}
        />
      </div>
      <div className="hidden lg:block">
        <Catalog
          total={response.total || 0}
          firstPageItems={response.products || []}
        />
      </div>
    </>
  );
}

export default async function CatalogPage(props: CatalogPageProps) {
  // Fetch hero data (fast, cached from template.tsx)
  const { hero } = await serviceClient.GetHero({});

  return (
    <FlexibleLayout headerType="catalog">
      <CatalogProducts
        searchParams={props.searchParams}
        params={props.params}
      />

      <div className="flex justify-center pb-5 pt-16">
        <NextCategoryButton />
      </div>
      <div>
        {hero?.entities
          ?.filter((e) => e.type === "HERO_TYPE_FEATURED_ARCHIVE")
          .map((e, i) => (
            <HeroArchive
              entity={e}
              key={i}
              className="space-y-12 pb-40 pt-14 lg:py-32"
            />
          ))}
      </div>
    </FlexibleLayout>
  );
}
