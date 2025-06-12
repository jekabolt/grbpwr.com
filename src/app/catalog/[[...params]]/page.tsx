import { serviceClient } from "@/lib/api";
import { getTopCategoryId } from "@/lib/categories-map";
import { cn } from "@/lib/utils";
import FlexibleLayout from "@/components/flexible-layout";

import Catalog from "../_components/catalog";
import { MobileCatalog } from "../_components/mobile-catalog";
import { NextCategoryButton } from "../_components/next-category-button";
import { getProductsPagedQueryParams } from "../_components/utils";
import { HeroArchive } from "../../_components/hero-archive";
import { CATALOG_LIMIT } from "../../../constants";

// Force static generation despite client components

interface CatalogParamsPageProps {
  params: Promise<{
    params: string[];
  }>;
  searchParams: Promise<{
    order?: string;
    sort?: string;
    size?: string;
    subCategoryIds?: string;
    typeIds?: string;
    sale?: string;
    tag?: string;
  }>;
}

export async function generateStaticParams() {
  try {
    const { dictionary } = await serviceClient.GetHero({});

    // Generate static params for main category pages only
    const staticParams = [
      { params: [] }, // Root catalog
      { params: ["men"] },
      { params: ["women"] },
      { params: ["unisex"] },
    ];

    // Add main categories for each gender
    if (dictionary?.categories) {
      for (const category of dictionary.categories) {
        if (category.level === "1" && category.name) {
          staticParams.push(
            { params: ["men", category.name.toLowerCase()] },
            { params: ["women", category.name.toLowerCase()] },
            { params: ["unisex", category.name.toLowerCase()] },
          );
        }
      }
    }

    return staticParams;
  } catch (error) {
    console.error("Error generating static params:", error);
    return [{ params: [] }];
  }
}

// Allow dynamic params for filtered routes
export const dynamicParams = true;

export default async function CatalogParamsPage({
  params,
  searchParams,
}: CatalogParamsPageProps) {
  const { hero, dictionary } = await serviceClient.GetHero({});
  const { params: routeParams } = await params;
  const searchParamsResolved = await searchParams;
  const [gender, categoryName] = routeParams || [];
  const categoryId = getTopCategoryId(dictionary, categoryName)?.toString();

  const response = await serviceClient.GetProductsPaged({
    limit: CATALOG_LIMIT,
    offset: 0,
    ...getProductsPagedQueryParams({
      ...searchParamsResolved,
      gender,
      topCategoryIds: categoryId,
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
