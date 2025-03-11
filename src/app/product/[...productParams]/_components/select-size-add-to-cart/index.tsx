"use client";

import { useEffect } from "react";
import type { common_ProductFull } from "@/api/proto-http/frontend";

import { cn } from "@/lib/utils";
import {
  AccordionContent,
  AccordionItem,
  AccordionRoot,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

import { useData } from "./useData";
import { useDisabled } from "./useDisabled";
import { useHandlers } from "./useHandlers";

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
    handleAddToCart,
    handleSizeSelect,
    onAccordionChange,
  } = useHandlers({
    id,
    onSizeAccordionStateChange,
  });

  const {
    triggerText,
    preorder,
    sizeNames,
    isSaleApplied,
    price,
    priceMinusSale,
    priceWithSale,
    isOneSize,
    sizeQuantity,
  } = useData({
    product,
    activeSizeId,
  });

  const { outOfStock } = useDisabled({ id, activeSizeId, product });

  useEffect(() => {
    if (isOneSize && sizeNames) {
      handleSizeSelect(sizeNames[0].id);
    }
  }, [isOneSize, handleSizeSelect, sizeNames]);

  return (
    <div className={cn("flex flex-col justify-between", className)}>
      {isOneSize ? (
        <Text variant="uppercase">one size</Text>
      ) : (
        <AccordionRoot
          type="single"
          collapsible
          value={openItem}
          onValueChange={onAccordionChange}
        >
          <AccordionItem value="size" className="flex h-full flex-col gap-y-5">
            <AccordionTrigger className="border-inactive border-b">
              <Text variant="uppercase" className="flex items-center">
                {triggerText}
              </Text>
            </AccordionTrigger>
            <AccordionContent className="grid grid-cols-4 gap-2">
              {sizeNames?.map(({ name, id }) => (
                <Button
                  className={cn("group relative uppercase", {
                    "border-b border-black": activeSizeId === id,
                    "hover:border-b hover:border-black": !outOfStock[id],
                  })}
                  key={id}
                  onClick={() => handleSizeSelect(id)}
                  disabled={outOfStock[id]}
                >
                  <Text
                    className={cn("transition-opacity", {
                      "group-hover:opacity-0":
                        sizeQuantity[id] <= 5 && sizeQuantity[id] != 0,
                    })}
                  >
                    {name}
                  </Text>
                  {sizeQuantity[id] <= 5 && sizeQuantity[id] > 0 && (
                    <Text className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                      {`${sizeQuantity[id]} left`}
                    </Text>
                  )}
                </Button>
              ))}
            </AccordionContent>
          </AccordionItem>
        </AccordionRoot>
      )}
      <div
        className={cn("grid gap-3", {
          hidden: openItem,
        })}
      >
        {preorder && <Text variant="uppercaseWithColors">{preorder}</Text>}
        <Button
          className={cn("blackTheme flex justify-between uppercase", {
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
    </div>
  );
}

interface Props {
  id: number;
  product: common_ProductFull;
  className?: string;
  onSizeAccordionStateChange: (isOpen: boolean) => void;
}
