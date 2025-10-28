import { useEffect, useState } from "react";
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
  const { defaultValue: sortValue, handleFilterChange: handleSortChange } =
    useFilterQueryParams("sort");
  const { defaultValue: orderValue } = useFilterQueryParams("order");
  const { defaultValue: saleValue } = useFilterQueryParams("sale");
  const { gender, topCategory, subCategory } = useRouteParams();
  const { sizeOptions } = useSizeFiltering();

  const [total, setTotal] = useState(0);
  const t = useTranslations("catalog");
  const sizes = dictionary?.sizes || [];
  const initSize = sizes?.find((s) => s.name === defaultValue)?.id?.toString();
  const [selectedSizes, setSelectedSizes] = useState<string[]>(
    initSize ? [initSize] : [],
  );

  const hasActiveFilters =
    selectedSizes.length > 0 || !!sortValue || !!orderValue || !!saleValue;

  const getSizeNameById = (id?: string) =>
    sizeOptions?.find((s) => String(s.id) === id)?.name.toLowerCase();

  useEffect(() => {
    const fetchInitialTotal = async () => {
      try {
        const response = await serviceClient.GetProductsPaged({
          limit: CATALOG_LIMIT,
          offset: 0,
          ...getProductsPagedQueryParams(
            {
              topCategoryIds: topCategory?.id?.toString(),
              subCategoryIds: subCategory?.id?.toString(),
              gender,
            },
            dictionary,
          ),
        });
        setTotal(response.total ?? 0);
      } catch {
        setTotal(0);
      }
    };

    if (isModalOpen) {
      fetchInitialTotal();
    }
  }, [isModalOpen, gender, topCategory?.id, subCategory?.id, dictionary]);

  const handleSizeToggle = async (sizeId: string) => {
    const newSelectedSizes = selectedSizes.includes(sizeId)
      ? selectedSizes.filter((id) => id !== sizeId)
      : [...selectedSizes, sizeId];

    setSelectedSizes(newSelectedSizes);

    const sizeNames = newSelectedSizes
      .map(getSizeNameById)
      .filter(Boolean)
      .join(",");

    handleFilterChange(sizeNames || undefined);

    if (newSelectedSizes.length === 0) {
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
            size: sizeNames,
          },
          dictionary,
        ),
      });
      setTotal(response.total ?? 0);
    } catch {
      setTotal(0);
    }
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
                <FilterOptionButtons
                  selectedValues={selectedSizes}
                  handleFilterChange={handleSizeToggle}
                  values={sizeOptions || []}
                  topCategoryId={topCategory?.id?.toString()}
                />
              </div>

              <div className="flex items-center justify-end gap-2 bg-bgColor">
                {hasActiveFilters && (
                  <Button
                    className="w-1/2 uppercase"
                    size="lg"
                    variant="simpleReverseWithBorder"
                    onClick={() => {
                      setSelectedSizes([]);
                      setTotal(0);
                      handleFilterChange(undefined);
                      handleSortChange(undefined, {
                        order: "",
                        sale: "",
                      });
                    }}
                  >
                    {t("clear all")}
                  </Button>
                )}
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
