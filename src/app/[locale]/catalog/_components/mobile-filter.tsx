import { useState } from "react";
import * as DialogPrimitives from "@radix-ui/react-dialog";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

import { Collection } from "./collection";
import { Sizes } from "./sizes";
import Sort from "./Sort";
import useFilterQueryParams from "./useFilterQueryParams";
import { useRouteParams } from "./useRouteParams";
import { useTotalProducts } from "./useTotalProducts";

export function MobileFilter() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("catalog");
  const tAccessibility = useTranslations("accessibility");

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
  });

  const isObjectsCategory =
    topCategory?.name?.toLowerCase() === "objects";

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
    <DialogPrimitives.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitives.Trigger
        asChild
        className="w-auto px-9 pt-12 text-center"
      >
        <Button className="uppercase">
          {t("filter")} {total > 0 ? `[${total}]` : ""}
        </Button>
      </DialogPrimitives.Trigger>
      <DialogPrimitives.Portal>
        <DialogPrimitives.Overlay className="fixed inset-0 z-20 h-screen bg-overlay" />
        <DialogPrimitives.Content className="fixed inset-x-2 bottom-2 top-2 z-50 border border-textInactiveColor bg-bgColor p-2.5 text-textColor lg:hidden">
          <DialogPrimitives.Title className="sr-only">
            {tAccessibility("mobile menu")}
          </DialogPrimitives.Title>
          <div className="flex h-full flex-col justify-between">
            <DialogPrimitives.Close asChild>
              <div className="flex items-center justify-between">
                <Text variant="uppercase">{t("filter")}</Text>
                <Button>[x]</Button>
              </div>
            </DialogPrimitives.Close>
            <div className="h-full space-y-10 overflow-y-scroll pt-10">
              <div className="space-y-6">
                <Text variant="uppercase">{t("sort by")}</Text>
                <Sort />
              </div>
              <Collection />
              {!isObjectsCategory && <Sizes gender={gender} />}
            </div>
            <div className="flex items-center justify-end gap-2 bg-bgColor">
              <Button
                className="w-1/2 uppercase"
                size="lg"
                variant="simpleReverseWithBorder"
                onClick={handleClearAll}
                disabled={!hasActiveFilters}
              >
                {t("clear all")}
              </Button>
              <DialogPrimitives.Close asChild>
                <Button className="w-1/2 uppercase" size="lg" variant="main">
                  {t("show")} {total > 0 ? `[${total}]` : ""}
                </Button>
              </DialogPrimitives.Close>
            </div>
          </div>
        </DialogPrimitives.Content>
      </DialogPrimitives.Portal>
    </DialogPrimitives.Root>
  );
}
