"use client";

import { common_GenderEnum, common_Product } from "@/api/proto-http/frontend";

import {
  getCategoryDescription,
  getTopCategoryName,
} from "@/lib/categories-map";
import { useDataContext } from "@/components/contexts/DataContext";
import { Text } from "@/components/ui/text";
import { InfinityScrollCatalog } from "@/app/[locale]/catalog/_components/infinity-scroll-catalog";

import { Categories } from "./categories/categories";
import { EmptyCatalog } from "./empty-catalog";
import { MobileFilter } from "./mobile-filter";
import { useRouteParams } from "./useRouteParams";

export function MobileCatalog({
  firstPageItems,
  total,
}: {
  firstPageItems: common_Product[];
  total: number;
}) {
  const { dictionary } = useDataContext();
  const { gender, topCategory } = useRouteParams();
  const activeTopCategory = getTopCategoryName(
    dictionary?.categories || [],
    parseInt(topCategory || "0"),
  );
  const categoryDescription = getCategoryDescription(
    activeTopCategory || "",
    gender as common_GenderEnum,
  );

  return (
    <div className="flex flex-col space-y-5 px-2.5 pb-10 pt-2">
      <div className="sticky top-5 z-20 space-y-5 text-bgColor mix-blend-exclusion">
        <div className="w-full overflow-x-auto">
          <Categories />
        </div>
        <MobileFilter />
      </div>
      {total > 0 ? (
        <div>
          <Text className="w-full lowercase">{categoryDescription}</Text>
          <InfinityScrollCatalog
            firstPageItems={firstPageItems}
            total={total}
          />
        </div>
      ) : (
        <div className="h-screen w-full">
          <EmptyCatalog />
        </div>
      )}
    </div>
  );
}
