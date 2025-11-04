import * as DialogPrimitives from "@radix-ui/react-dialog";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

import { Collection } from "./collection";
import { Sizes } from "./sizes";
import Sort from "./Sort";
import useFilterQueryParams from "./useFilterQueryParams";
import { useRouteParams } from "./useRouteParams";
import { useTotalProducts } from "./useTotalProducts";

export function MobileFilter() {
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
          <div className="flex h-full w-full flex-col gap-6 overflow-y-auto">
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
              <DialogPrimitives.Close asChild>
                <Button className="w-full uppercase" size="lg" variant="main">
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
