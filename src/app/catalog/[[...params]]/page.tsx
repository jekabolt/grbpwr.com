import { serviceClient } from "@/lib/api";
import { getTopCategoryId } from "@/lib/categories-map";
import { cn } from "@/lib/utils";
import { DataContextProvider } from "@/components/contexts/DataContext";
import FlexibleLayout from "@/components/flexible-layout";

import { getProductsPagedQueryParams } from "../_components/utils";
import { HeroArchive } from "../../_components/hero-archive";
// import Catalog from "../_components/catalog";
// import { MobileCatalog } from "../_components/mobile-catalog";
// import { NextCategoryButton } from "../_components/next-category-button";
import { CATALOG_LIMIT } from "../../../constants";

interface CatalogParamsPageProps {
  params: Promise<{
    params?: string[];
  }>;
}

// Generate static params for base routes
export async function generateStaticParams() {
  const { dictionary } = await serviceClient.GetHero({});
  const staticParams = [];

  // Base gender routes
  staticParams.push(
    { params: ["men"] },
    { params: ["women"] },
    { params: ["unisex"] },
  );

  // Gender + category routes
  if (dictionary?.categories) {
    const topCategories = dictionary.categories.filter(
      (cat) => cat.level === "top_category",
    );
    for (const category of topCategories) {
      if (category.name) {
        const categoryUrlName = category.name.toLowerCase();
        staticParams.push(
          { params: ["men", categoryUrlName] },
          { params: ["women", categoryUrlName] },
          { params: ["unisex", categoryUrlName] },
        );
      }
    }
  }

  return staticParams;
}

export default async function CatalogParamsPage({
  params,
}: CatalogParamsPageProps) {
  const { hero, dictionary, rates } = await serviceClient.GetHero({});
  const { params: routeParams } = await params;
  const [gender, categoryName] = routeParams || [];
  const categoryId = getTopCategoryId(dictionary, categoryName)?.toString();

  // Base data without search params (for static generation)
  const response = await serviceClient.GetProductsPaged({
    limit: CATALOG_LIMIT,
    offset: 0,
    ...getProductsPagedQueryParams({
      gender,
      topCategoryIds: categoryId,
    }),
  });

  return (
    <DataContextProvider hero={hero} dictionary={dictionary} rates={rates}>
      <FlexibleLayout headerType="catalog" footerType="regular">
        {/* <div className="block lg:hidden">
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
        </div> */}
        <div className="p-8">
          <h1>Catalog Page - useSearchParams components commented out</h1>
          <p>Total products: {response.total}</p>
          <p>Products loaded: {response.products?.length}</p>
        </div>
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
    </DataContextProvider>
  );
}
