import { useState } from "react";
import { CATALOG_LIMIT } from "@/constants";
import { useTranslations } from "next-intl";

import { serviceClient } from "@/lib/api";
import { useDataContext } from "@/components/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Overlay } from "@/components/ui/overlay";
import { Text } from "@/components/ui/text";

import FilterOptionButtons from "./FilterOptionButtons";
import Sort from "./Sort";
import useFilterQueryParams from "./useFilterQueryParams";
import { useRouteParams } from "./useRouteParams";
import { useSizeFiltering } from "./useSizeFiltering";
import { getProductsPagedQueryParams } from "./utils";

export function Filter({
  isModalOpen,
  toggleModal,
}: {
  isModalOpen: boolean;
  toggleModal: () => void;
}) {
  const { dictionary } = useDataContext();
  const { defaultValue, handleFilterChange } = useFilterQueryParams("size");
  const { gender, topCategory, subCategory } = useRouteParams();
  const { sizeOptions } = useSizeFiltering();

  const [total, setTotal] = useState(0);
  const t = useTranslations("catalog");
  const sizes = dictionary?.sizes || [];
  const initSize = sizes?.find((s) => s.name === defaultValue)?.id?.toString();
  const [selectedSize, setSelectedSize] = useState<string>(initSize || "");

  const getSizeNameById = (id?: string) =>
    sizeOptions?.find((s) => String(s.id) === id)?.name.toLowerCase();

  const handleSizeClick = async (sizeId?: string) => {
    setSelectedSize(sizeId ?? "");

    if (!sizeId) {
      setTotal(0);
      return;
    }

    try {
      const response = await serviceClient.GetProductsPaged({
        limit: CATALOG_LIMIT,
        offset: 0,
        ...getProductsPagedQueryParams(
          {
            topCategoryIds: topCategory?.id?.toString(),
            subCategoryIds: subCategory?.id?.toString(),
            gender,
            size: getSizeNameById(sizeId),
          },
          dictionary,
        ),
      });
      setTotal(response.total ?? 0);
    } catch {
      setTotal(0);
    }
  };

  function handleShowSize(selectedSize: string) {
    const sizeName = getSizeNameById(selectedSize);
    handleFilterChange(sizeName || undefined);
    toggleModal();
  }

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
                <FilterOptionButtons
                  defaultValue={selectedSize}
                  handleFilterChange={handleSizeClick}
                  values={sizeOptions || []}
                  topCategoryId={topCategory?.id?.toString()}
                />
              </div>
              {selectedSize && (
                <div className="flex justify-between gap-2 bg-bgColor">
                  <Button
                    className="w-full uppercase"
                    size="lg"
                    variant="main"
                    onClick={() => {
                      handleSizeClick(undefined);
                      handleFilterChange(undefined);
                    }}
                  >
                    {t("clear all")}
                  </Button>
                  <Button
                    className="w-full uppercase"
                    size="lg"
                    variant="main"
                    onClick={() => handleShowSize(selectedSize)}
                  >
                    {t("show")} {selectedSize && total > 0 ? `[${total}]` : ""}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
