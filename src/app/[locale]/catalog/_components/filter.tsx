import * as DialogPrimitives from "@radix-ui/react-dialog";
import { useTranslations } from "next-intl";

import { ModalTransition } from "@/components/modal-transition";
import { Button } from "@/components/ui/button";
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
  const tNav = useTranslations("navigation");

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

  const isObjectsCategory = topCategory?.name?.toLowerCase() === "objects";

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
    <div className="z-50 w-full">
      <DialogPrimitives.Root
        open={isModalOpen}
        onOpenChange={(o) => {
          if (!o) toggleModal();
        }}
      >
        <DialogPrimitives.Portal>
          <DialogPrimitives.Overlay className="fixed inset-0 z-20 hidden bg-overlay lg:block" />
          <ModalTransition
            isOpen={isModalOpen}
            contentSlideFrom="right"
            contentClassName="fixed inset-y-2 right-2 z-30 hidden w-[445px] border border-textInactiveColor bg-bgColor p-2.5 text-textColor lg:block"
            content={
              <DialogPrimitives.Content className="flex h-full flex-col">
                <DialogPrimitives.Title className="sr-only">
                  {t("filter")}
                </DialogPrimitives.Title>
                <div className="flex items-center justify-between">
                  <Text variant="uppercase">{t("filter")}</Text>
                  <DialogPrimitives.Close asChild>
                    <Button aria-label={tNav("close")}>[x]</Button>
                  </DialogPrimitives.Close>
                </div>
                <div className="h-full space-y-10 overflow-y-scroll pt-6">
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
                  <Button
                    className="w-1/2 uppercase"
                    size="lg"
                    variant="main"
                    onClick={() => toggleModal()}
                  >
                    {t("show")} {total > 0 ? `[${total}]` : ""}
                  </Button>
                </div>
              </DialogPrimitives.Content>
            }
          />
        </DialogPrimitives.Portal>
      </DialogPrimitives.Root>
    </div>
  );
}
