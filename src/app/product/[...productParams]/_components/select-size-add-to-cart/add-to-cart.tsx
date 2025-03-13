"use client";

import { common_ProductFull } from "@/api/proto-http/frontend";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

import { useData } from "./useData";

interface Props {
  product: common_ProductFull;
  isLoading: boolean;
  className?: string;
  handleAddToCart: () => void;
}

export function AddToCart({
  product,
  isLoading,
  className,
  handleAddToCart,
}: Props) {
  const { preorder, isSaleApplied, priceMinusSale, priceWithSale, price } =
    useData({ product });

  return (
    <div className={cn(className)}>
      <Button
        className={cn("blackTheme flex w-full justify-between uppercase", {
          "justify-center": isLoading,
        })}
        variant="simpleReverse"
        size="lg"
        onClick={handleAddToCart}
        loading={isLoading}
      >
        <Text variant="inherit">{preorder ? "preorder" : "add"}</Text>
        {isSaleApplied ? (
          <Text variant="inactive">
            {priceMinusSale}
            <Text component="span">{priceWithSale}</Text>
          </Text>
        ) : (
          <Text variant="inherit">{price}</Text>
        )}
      </Button>
    </div>
  );
}
