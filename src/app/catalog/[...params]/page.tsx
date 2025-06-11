import { Metadata } from "next";
import { notFound } from "next/navigation";
import { CATALOG_LIMIT } from "@/constants";

import { serviceClient } from "@/lib/api";
import {
  getTopCategoryIdByName,
  getTopCategoryName,
} from "@/lib/categories-map";
import { generateCommonMetadata } from "@/lib/common-metadata";
import { cn } from "@/lib/utils";
import FlexibleLayout from "@/components/flexible-layout";
import { MobileCatalog } from "@/app/catalog/_components/mobile-catalog";

import Catalog from "../_components/catalog";
import { NextCategoryButton } from "../_components/next-category-button";
import { getProductsPagedQueryParams } from "../_components/utils";
import { HeroArchive } from "../../_components/hero-archive";

interface CatalogParamsPageProps {
  params: {
    params: string[];
  };
  searchParams: {
    order?: string;
    sort?: string;
    size?: string;
    subCategoryIds?: string;
    typeIds?: string;
    sale?: string;
    tag?: string;
  };
}

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: CatalogParamsPageProps): Promise<Metadata> {
  const { params: routeParams } = params;
  const [gender, categoryName] = routeParams || [];

  const { dictionary } = await serviceClient.GetHero({});

  const title = categoryName
    ? `${gender} ${
        getTopCategoryName(
          dictionary?.categories || [],
          getTopCategoryIdByName(dictionary?.categories || [], categoryName) ||
            0,
        ) || categoryName.replace("-", " ")
      } catalog`.toUpperCase()
    : gender
      ? `${gender} catalog`.toUpperCase()
      : "catalog".toUpperCase();

  return generateCommonMetadata({
    title,
  });
}

export default async function CatalogParamsPage({
  params,
  searchParams,
}: CatalogParamsPageProps) {
  const { dictionary, hero } = await serviceClient.GetHero({});

  const [gender, categoryName] = params.params || [];

  // Validate gender parameter
  const validGenders = ["men", "women", "unisex"];
  if (gender && !validGenders.includes(gender)) {
    notFound();
  }

  let topCategoryId: string | undefined;
  if (categoryName) {
    const categoryId = getTopCategoryIdByName(
      dictionary?.categories || [],
      categoryName,
    );
    if (!categoryId) {
      notFound();
    }
    topCategoryId = categoryId.toString();
  }

  const response = await serviceClient.GetProductsPaged({
    limit: CATALOG_LIMIT,
    offset: 0,
    ...getProductsPagedQueryParams({
      ...searchParams,
      gender,
      topCategoryIds: topCategoryId,
    }),
  });

  return (
    <FlexibleLayout headerType="catalog" footerType="regular">
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
            ?.filter((e: any) => e.type === "HERO_TYPE_FEATURED_ARCHIVE")
            .map((e: any, i: number) => (
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
