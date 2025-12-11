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
    <div className="flex flex-col space-y-6 px-2.5 pb-10 pt-2">
      {total > 0 ? (
        <>
          <Text className="w-full lowercase">{categoryDescription}</Text>
          <InfinityScrollCatalog
            firstPageItems={firstPageItems}
            total={total}
          />
        </>
      ) : (
        <div className="h-screen w-full">
          <EmptyCatalog />
        </div>
      )}
      <div className="sticky bottom-0 z-20 mt-auto flex justify-center text-bgColor mix-blend-exclusion">
        <MobileFilter />
      </div>
    </div>
  );
}
