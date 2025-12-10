"use client";

import { common_GenderEnum, common_Product } from "@/api/proto-http/frontend";

import {
  getCategoryDescription,
  getTopCategoryName,
} from "@/lib/categories-map";
import { useDataContext } from "@/components/contexts/DataContext";
import { Text } from "@/components/ui/text";
import { InfinityScrollCatalog } from "@/app/[locale]/catalog/_components/infinity-scroll-catalog";

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
    <div className="relative flex h-screen flex-col space-y-6 border border-blue-500 px-2.5 pb-10 pt-2">
      {total > 0 ? (
        <div className="relative border border-red-500">
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
      <div className="sticky bottom-0 z-20 mt-6 text-bgColor mix-blend-exclusion">
        {/* <div className="w-full overflow-x-auto">
              <Categories />
            </div> */}
        <MobileFilter />
      </div>
    </div>
  );
}
