import { serviceClient } from "@/lib/api";
import { getTopCategoryId } from "@/lib/categories-map";
import { cn } from "@/lib/utils";
import FlexibleLayout from "@/components/flexible-layout";

import { ClientCatalogWrapper } from "../_components/client-catalog-wrapper";
import { NextCategoryButton } from "../_components/next-category-button";
import { getProductsPagedQueryParams } from "../_components/utils";
import { HeroArchive } from "../../_components/hero-archive";
import { CATALOG_LIMIT } from "../../../constants";

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
    // Fetch dictionary to get actual categories
    const { dictionary } = await serviceClient.GetHero({});

    const staticPaths: { params: string[] | undefined }[] = [
      // Base catalog route
      { params: undefined },
    ];

    // Generate gender-only routes
    const genders = ["male", "female", "unisex"];
    genders.forEach((gender) => {
      staticPaths.push({ params: [gender] });
    });

    // Generate gender + category combinations for top categories
    if (dictionary?.categories) {
      const topCategories = dictionary.categories
        .filter((cat) => cat.levelId === 0) // Top-level categories only
        .slice(0, 5); // Limit to prevent too many static routes

      genders.forEach((gender) => {
        topCategories.forEach((category) => {
          if (category.name) {
            staticPaths.push({
              params: [gender, category.name.toLowerCase()],
            });
          }
        });
      });
    }

    return staticPaths;
  } catch (error) {
    console.error("Failed to generate static params:", error);
    // Fallback to basic routes if API fails
    return [
      { params: undefined },
      { params: ["male"] },
      { params: ["female"] },
      { params: ["unisex"] },
    ];
  }
}

// Allow non-pregenerated paths to be statically generated at runtime
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
      <ClientCatalogWrapper
        firstPageItems={response.products || []}
        total={response.total || 0}
        hero={hero}
        dictionary={dictionary}
      />
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
