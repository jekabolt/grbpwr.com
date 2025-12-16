import { CATALOG_LIMIT } from "@/constants";

import { serviceClient } from "@/lib/api";
import { resolveCategories } from "@/lib/categories-map";
import { cn } from "@/lib/utils";
import FlexibleLayout from "@/components/flexible-layout";

import { HeroArchive } from "../../_components/hero-archive";
import Catalog from "./catalog";
import { getProductsPagedQueryParams, parseRouteParams } from "./utils";

interface CatalogContentProps {
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

export async function CatalogContent(props: CatalogContentProps) {
  // Small delay to show skeleton
  await new Promise((resolve) => setTimeout(resolve, 1000));

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
    <FlexibleLayout className="pt-16 lg:pt-0" headerType="catalog">
      <Catalog
        total={response.total || 0}
        firstPageItems={response.products || []}
      />
      <div
        className={cn("block", {
          hidden: !response.total,
        })}
      >
        {/* <div className="flex justify-center pb-5 pt-16">
          <NextCategoryButton />
        </div> */}
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
