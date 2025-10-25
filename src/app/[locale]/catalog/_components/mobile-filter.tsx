import { useState } from "react";
import { CATALOG_LIMIT } from "@/constants";
import * as DialogPrimitives from "@radix-ui/react-dialog";
import { useTranslations } from "next-intl";

import { serviceClient } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useDataContext } from "@/components/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

import FilterOptionButtons from "./FilterOptionButtons";
import Sort from "./Sort";
import useFilterQueryParams from "./useFilterQueryParams";
import { useRouteParams } from "./useRouteParams";
import { useSizeFiltering } from "./useSizeFiltering";
import { getProductsPagedQueryParams } from "./utils";

export function MobileFilter() {
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
  }

  return (
    <DialogPrimitives.Root>
      <DialogPrimitives.Trigger asChild className="w-full text-right">
        <Button className="uppercase">{t("filter")} +</Button>
      </DialogPrimitives.Trigger>
      <DialogPrimitives.Portal>
        <DialogPrimitives.Overlay className="fixed inset-0 z-20 bg-overlay opacity-40" />
        <DialogPrimitives.Content className="blackTheme fixed inset-0 z-50 h-dvh bg-bgColor p-2.5 text-textColor lg:hidden">
          <DialogPrimitives.Title className="sr-only">
            grbpwr mobile menu
          </DialogPrimitives.Title>
          <div className="flex h-full w-full flex-col gap-6 overflow-y-auto border-2 border-red-500">
            <div className="space-y-10 pb-24">
              <DialogPrimitives.Close asChild>
                <div className="fixed inset-x-2.5 top-2.5 flex items-center justify-between bg-bgColor">
                  <Text variant="uppercase">{t("filter")}</Text>
                  <Button>[x]</Button>
                </div>
              </DialogPrimitives.Close>
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

            <div
              className={cn(
                "fixed inset-x-2.5 bottom-5 hidden gap-2 bg-bgColor",
                {
                  "flex justify-between": selectedSize,
                },
              )}
            >
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
              <DialogPrimitives.Close asChild>
                <Button
                  className="w-full uppercase"
                  size="lg"
                  variant="main"
                  onClick={() => handleShowSize(selectedSize)}
                >
                  {t("show")} {selectedSize && total > 0 ? `[${total}]` : ""}
                </Button>
              </DialogPrimitives.Close>
            </div>
          </div>
        </DialogPrimitives.Content>
      </DialogPrimitives.Portal>
    </DialogPrimitives.Root>
  );
}
