"use client";

import { common_GenderEnum, common_Product } from "@/api/proto-http/frontend";

import {
  getCategoryDescription,
  getTopCategoryName,
} from "@/lib/categories-map";
import { useDataContext } from "@/components/contexts/DataContext";
import { Text } from "@/components/ui/text";

import { Categories } from "./categories/categories";
import { EmptyCatalog } from "./empty-catalog";
import { InfinityScrollCatalog } from "./infinity-scroll-catalog";
import Size from "./Size";
import Sort from "./Sort";
import { useRouteParams } from "./useRouteParams";

export default function Catalog({
  total,
  firstPageItems,
}: {
  total: number;
  firstPageItems: common_Product[];
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
    <div className="flex flex-col gap-6 px-7 pt-24">
      <div className="sticky top-20 z-10 flex items-start justify-between text-bgColor mix-blend-exclusion">
        <Categories />
        <div className="flex w-auto gap-24">
          <Sort />
          <Size />
        </div>
      </div>
      {total > 0 ? (
        <div>
          <Text className="w-2/3 lowercase">{categoryDescription}</Text>
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
