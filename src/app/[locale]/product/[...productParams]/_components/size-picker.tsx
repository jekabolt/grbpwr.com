"use client";

import { useTranslations } from "next-intl";

import { sendOutOfStockClickEvent } from "@/lib/analitycs/product-engagement";
import { sendSizeSelectedEvent } from "@/lib/analitycs/sizes";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { HoverText } from "@/components/ui/hover-text";
import { Overlay } from "@/components/ui/overlay";
import { Text } from "@/components/ui/text";

type ProductContext = {
  productId: string;
  productName: string;
  productCategory: string;
  productPrice: number;
  currency: string;
};

type Props = {
  sizeNames: { name: string; id: number }[];
  activeSizeId: number;
  outOfStock?: Record<number, boolean>;
  sizeQuantity?: Record<number, number>;
  isOneSize?: boolean;
  view?: "grid" | "line";
  className?: string;
  shouldBlink?: boolean;
  productContext?: ProductContext;
  handleSizeSelect: (id: number) => void;
  onOutOfStockHover?: (sizeId: number | null) => void;
};

export function SizePicker({
  sizeNames,
  activeSizeId,
  outOfStock,
  sizeQuantity,
  isOneSize,
  view = "grid",
  className,
  shouldBlink = false,
  productContext,
  handleSizeSelect,
  onOutOfStockHover,
}: Props) {
  const t = useTranslations("product");
  const isSingleDisplayedSize = (sizeNames?.length ?? 0) === 1;

  const handleAnalytics = (
    sizeId: number,
    sizeName: string,
    isOutOfStock: boolean,
  ) => {
    if (!productContext) {
      console.warn("SizePicker: productContext is required for analytics");
      return;
    }

    if (isOutOfStock) {
      sendOutOfStockClickEvent({
        product_id: productContext.productId,
        product_name: productContext.productName,
        size_id: sizeId,
        size_name: sizeName,
        product_category: productContext.productCategory,
        product_price: productContext.productPrice,
        currency: productContext.currency,
      });
    } else if (sizeId !== activeSizeId) {
      sendSizeSelectedEvent({
        product_id: productContext.productId,
        product_name: productContext.productName,
        size_id: sizeId,
        size_name: sizeName,
        product_category: productContext.productCategory,
        in_stock: true,
      });
    }
  };

  return (
    <div className="relative">
      {shouldBlink && <Overlay color="highlight" cover="container" />}
      <div
        className={cn(
          {
            "grid grid-cols-4 gap-x-3 gap-y-4": view === "grid",
            "flex w-full flex-row flex-wrap items-center justify-center gap-5":
              view === "line",
            "flex items-center justify-start": isOneSize,
          },
          className,
        )}
      >
        {sizeNames?.map(({ name, id }) => {
          const isTrulyOutOfStock = outOfStock?.[id];
          const hasNoAvailableQty = sizeQuantity?.[id] === 0;
          const isOutOfStock = isTrulyOutOfStock || hasNoAvailableQty;
          const isActive = activeSizeId === id;
          const isDisabled = hasNoAvailableQty && !isTrulyOutOfStock;
          const displayName =
            isOneSize || name.toLowerCase() === "one size"
              ? t("one size")
              : name;
          const quantity = sizeQuantity?.[id] ?? 0;

          return (
            <Button
              type="button"
              disabled={isDisabled}
              variant={isOutOfStock ? "strikeThrough" : "default"}
              className={cn(
                "inline-flex min-h-11 min-w-11 items-center justify-center leading-none",
                {
                  "border-b border-transparent": !isSingleDisplayedSize,
                  "border-textColor":
                    !isSingleDisplayedSize && isActive && !isOutOfStock,
                  "hover:border-textColor":
                    !isSingleDisplayedSize && !isActive && !isOutOfStock,
                  "px-3 py-0.5": view === "line" && !isOneSize,
                },
              )}
              key={id}
              onClick={() => handleSizeSelect(id)}
              onPointerDown={() => handleAnalytics(id, name, isOutOfStock)}
              onMouseEnter={() => isOutOfStock && onOutOfStockHover?.(id)}
              onMouseLeave={() => isOutOfStock && onOutOfStockHover?.(null)}
            >
              {quantity > 0 ? (
                <HoverText
                  defaultText={displayName}
                  hoveredText={t("quantity left", { count: quantity })}
                  hoverTextCondition={quantity > 5}
                />
              ) : (
                <Text variant="uppercase">{displayName}</Text>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
