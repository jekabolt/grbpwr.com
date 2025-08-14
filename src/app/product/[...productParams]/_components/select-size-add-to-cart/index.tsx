"use client";

import { useEffect } from "react";
import type { common_ProductFull } from "@/api/proto-http/frontend";

import { cn, isDateTodayOrFuture } from "@/lib/utils";
import { Text } from "@/components/ui/text";

import { LoadingButton } from "../loading-button";
import { useActiveSizeInfo } from "../utils/useActiveSizeInfo";
import { useDisabled } from "../utils/useDisabled";
import { useHandlers } from "../utils/useHandlers";
import { useProductBasics } from "../utils/useProductBasics";
import { useProductPricing } from "../utils/useProductPricing";
import { useProductSizes } from "../utils/useProductSizes";

export function AddToCartForm({
  id,
  className,
  product,
  onSizeAccordionStateChange,
}: Props) {
  const {
    activeSizeId,
    openItem,
    isLoading,
    // triggerDialodRef,
    handleAddToCart,
    handleSizeSelect,
    onAccordionChange,
  } = useHandlers({
    id,
    onSizeAccordionStateChange,
  });
  const { preorder, preorderRaw } = useProductBasics({ product });
  const { sizeNames, isOneSize, sizeQuantity } = useProductSizes({ product });
  const { triggerText, lowStockText } = useActiveSizeInfo({
    product,
    activeSizeId,
  });
  const { isSaleApplied, price, priceMinusSale, priceWithSale } =
    useProductPricing({ product });

  const { outOfStock } = useDisabled({ id, activeSizeId, product });

  useEffect(() => {
    if (isOneSize && sizeNames) {
      handleSizeSelect(sizeNames[0].id);
    }
  }, [isOneSize, handleSizeSelect, sizeNames]);

  return (
    <div className={cn("flex flex-col justify-between", className)}>
      <div
        className={cn(
          "blackTheme fixed inset-x-2.5 bottom-2.5 z-10 grid gap-3 mix-blend-hard-light lg:relative lg:inset-x-0 lg:bottom-0 lg:bg-textColor lg:p-0 lg:text-bgColor lg:mix-blend-normal",
          {
            "lg:hidden": openItem,
            "bg-bgColor": preorder,
          },
        )}
      >
        {preorder && isDateTodayOrFuture(preorderRaw || "") && (
          <Text
            variant="inactive"
            className="text-center uppercase lg:text-left"
          >
            {preorder}
          </Text>
        )}
        <LoadingButton
          variant="simpleReverse"
          size="lg"
          onAction={handleAddToCart}
          isLoadingExternal={isLoading}
          className="border border-textColor lg:border-none"
        >
          <Text variant="inherit">
            {preorder && isDateTodayOrFuture(preorderRaw || "")
              ? "preorder"
              : "add"}
          </Text>
          {isSaleApplied ? (
            <Text variant="inactive">
              {priceMinusSale}
              <Text component="span">{priceWithSale}</Text>
            </Text>
          ) : (
            <Text variant="inherit">{price}</Text>
          )}
        </LoadingButton>
      </div>
    </div>
  );
}

interface Props {
  id: number;
  product: common_ProductFull;
  className?: string;
  onSizeAccordionStateChange?: (isOpen: boolean) => void;
}
