"use client";

import { useState } from "react";
import { common_GenderEnum, common_Product } from "@/api/proto-http/frontend";
import { useTranslations } from "next-intl";

import {
  getCategoryDescription,
  getTopCategoryName,
} from "@/lib/categories-map";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { useDataContext } from "@/components/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

import { Categories } from "./categories/categories";
import { EmptyCatalog } from "./empty-catalog";
import { Filter } from "./filter";
import { InfinityScrollCatalog } from "./infinity-scroll-catalog";
import { useRouteParams } from "./useRouteParams";

export default function Catalog({
  total,
  firstPageItems,
}: {
  total: number;
  firstPageItems: common_Product[];
}) {
  const { dictionary } = useDataContext();
  const { languageId } = useTranslationsStore((state) => state);
  const { gender, topCategory } = useRouteParams();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const t = useTranslations("catalog");

  const activeTopCategory = getTopCategoryName(
    dictionary?.categories || [],
    parseInt(topCategory || "0"),
    languageId,
  );
  const categoryDescription = getCategoryDescription(
    activeTopCategory || "",
    gender as common_GenderEnum,
  );

  function toggleModal() {
    setIsModalOpen(!isModalOpen);
  }

  return (
    <div className="flex flex-col gap-6 px-7 pt-24">
      <div className="sticky top-20 z-10 flex items-start justify-between text-bgColor mix-blend-exclusion">
        <Categories />
        <Button className="flex w-auto uppercase" onClick={toggleModal}>
          {t("filter")} +
        </Button>
      </div>
      <Filter isModalOpen={isModalOpen} toggleModal={toggleModal} />
      {total > 0 ? (
        <div className="mix-blend-normal">
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
