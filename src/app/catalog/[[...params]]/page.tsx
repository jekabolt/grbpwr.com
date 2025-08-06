import { Metadata } from "next";
import { CATALOG_LIMIT } from "@/constants";

import { serviceClient } from "@/lib/api";
import { resolveCategories } from "@/lib/categories-map";
import { generateCommonMetadata } from "@/lib/common-metadata";
import { cn } from "@/lib/utils";
import FlexibleLayout from "@/components/flexible-layout";
import { HeroArchive } from "@/app/_components/hero-archive";
import { MobileCatalog } from "@/app/catalog/_components/mobile-catalog";

import Catalog from "../_components/catalog";
import { NextCategoryButton } from "../_components/next-category-button";
import {
  getProductsPagedQueryParams,
  parseRouteParams,
} from "../_components/utils";

interface CatalogPageProps {
  params?: Promise<{
    params: string[];
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

export async function generateMetadata(): Promise<Metadata> {
  return generateCommonMetadata({
    title: "catalog".toUpperCase(),
  });
}
export const dynamic = "force-static";

export default async function CatalogPage(props: CatalogPageProps) {
  const { hero, dictionary } = await serviceClient.GetHero({});
  const searchParams = await props.searchParams;
  const params = await props.params;

  const { gender, categoryName, subCategoryName } = parseRouteParams(
    params?.params,
  );
  const { topCategory, subCategory } = resolveCategories(
    dictionary?.categories,
    categoryName,
    subCategoryName,
  );

  const response = await serviceClient.GetProductsPaged({
    limit: CATALOG_LIMIT,
    offset: 0,
    ...getProductsPagedQueryParams(
      {
        ...searchParams,
        gender,
        topCategoryIds: !subCategory ? topCategory?.id?.toString() : undefined,
        subCategoryIds: subCategory?.id?.toString(),
      },
      dictionary,
    ),
  });

  return (
    <FlexibleLayout headerType="catalog">
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
      <div
        className={cn("block", {
          hidden: !response.total,
        })}
      >
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
      </div>
    </FlexibleLayout>
  );
}
