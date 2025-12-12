"use client";

import { common_GenderEnum, common_Product } from "@/api/proto-http/frontend";

import {
  getCategoryDescription,
  getTopCategoryName,
} from "@/lib/categories-map";
import { useDataContext } from "@/components/contexts/DataContext";
import { Text } from "@/components/ui/text";

import { EmptyCatalog } from "./empty-catalog";
import { InfinityScrollCatalog } from "./infinity-scroll-catalog";
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
    <div className="flex min-h-screen flex-col px-2.5 pt-2">
      {total > 0 ? (
        <div className="flex flex-1 flex-col space-y-6">
          <Text className="w-full lowercase">{categoryDescription}</Text>
          <InfinityScrollCatalog
            firstPageItems={firstPageItems}
            total={total}
          />
        </div>
      ) : (
        <div className="flex h-screen w-full items-center justify-center">
          <EmptyCatalog />
        </div>
      )}
      <div className="sticky bottom-0 z-20 my-5 flex justify-center text-bgColor mix-blend-exclusion">
        <MobileFilter />
      </div>
    </div>
  );
}
