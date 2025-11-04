import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Overlay } from "@/components/ui/overlay";
import { Text } from "@/components/ui/text";

import { Collection } from "./collection";
import { Sizes } from "./sizes";
import Sort from "./Sort";
import useFilterQueryParams from "./useFilterQueryParams";
import { useRouteParams } from "./useRouteParams";
import { useTotalProducts } from "./useTotalProducts";

export function Filter({
  isModalOpen,
  toggleModal,
}: {
  isModalOpen: boolean;
  toggleModal: () => void;
}) {
  const t = useTranslations("catalog");

  const { defaultValue, handleFilterChange } = useFilterQueryParams("size");
  const { defaultValue: sortValue } = useFilterQueryParams("sort");
  const { defaultValue: orderValue } = useFilterQueryParams("order");
  const { defaultValue: saleValue } = useFilterQueryParams("sale");
  const { defaultValue: collectionValue } = useFilterQueryParams("collection");
  const { gender, topCategory, subCategory } = useRouteParams();
  const { total, resetTotal } = useTotalProducts({
    gender,
    topCategoryId: topCategory?.id,
    subCategoryId: subCategory?.id,
    isModalOpen,
  });

  const hasActiveFilters =
    !!defaultValue ||
    !!sortValue ||
    !!orderValue ||
    !!saleValue ||
    !!collectionValue;

  const handleClearAll = () => {
    resetTotal();
    handleFilterChange(undefined, {
      collection: "",
      sort: "",
      order: "",
      sale: "",
    });
  };

  return (
    <>
      {isModalOpen && (
        <div className="hidden lg:block">
          <Overlay
            cover="screen"
            onClick={toggleModal}
            disablePointerEvents={false}
          />
          <div className="blackTheme fixed inset-y-0 right-0 z-50 h-screen w-[450px] bg-bgColor p-2.5 text-textColor">
            <div className="flex h-full flex-col justify-between">
              <div className="space-y-10">
                <div className="flex items-center justify-between">
                  <Text variant="uppercase">{t("filter")}</Text>
                  <Button onClick={toggleModal}>[x]</Button>
                </div>
                <div className="space-y-6">
                  <Text variant="uppercase" className="text-textInactiveColor">
                    {t("sort by")}
                  </Text>
                  <Sort />
                </div>
                <Collection />
                <Sizes topCategoryId={topCategory?.id} gender={gender} />
              </div>

              <div className="flex items-center justify-end gap-2 bg-bgColor">
                <Button
                  className={cn("hidden w-1/2 uppercase", {
                    block: hasActiveFilters,
                  })}
                  size="lg"
                  variant="simpleReverseWithBorder"
                  onClick={handleClearAll}
                >
                  {t("clear all")}
                </Button>
                <Button
                  className="w-1/2 uppercase"
                  size="lg"
                  variant="main"
                  onClick={() => toggleModal()}
                >
                  {t("show")} {total > 0 ? `[${total}]` : ""}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
