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
import { HoverText } from "@/components/ui/hover-text";
import { Text } from "@/components/ui/text";

import { MobileSelectSize } from "./mobile-select-size";
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
    triggerDialodRef,
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
    isOneSize,
    sizeQuantity,
    isSaleApplied,
    price,
    priceMinusSale,
    priceWithSale,
  } = useData({ product, activeSizeId });

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
        <>
          <div className="block lg:hidden">
            <MobileSelectSize
              product={product}
              activeSizeId={activeSizeId}
              triggerRef={triggerDialodRef}
              handleSizeSelect={handleSizeSelect}
            />
          </div>
          <div className="hidden lg:block">
            <AccordionRoot
              type="single"
              collapsible
              value={openItem}
              onValueChange={onAccordionChange}
            >
              <AccordionItem
                value="size"
                className="flex h-full flex-col gap-y-5"
              >
                <AccordionTrigger useMinus className="border-inactive border-b">
                  <Text variant="uppercase" className="flex items-center">
                    {triggerText}
                  </Text>
                </AccordionTrigger>
                <AccordionContent className="grid grid-cols-4 gap-2">
                  {sizeNames?.map(({ name, id }) => (
                    <Button
                      className={cn({
                        "border-b border-black": activeSizeId === id,
                        "hover:border-b hover:border-black": !outOfStock[id],
                      })}
                      key={id}
                      onClick={() => handleSizeSelect(id)}
                      disabled={outOfStock[id]}
                    >
                      <HoverText
                        defaultText={name}
                        hoveredText={`${sizeQuantity[id]} left`}
                        hoverTextCondition={sizeQuantity[id] > 5}
                      />
                    </Button>
                  ))}
                </AccordionContent>
              </AccordionItem>
            </AccordionRoot>
          </div>
        </>
      )}

      <div
        className={cn("grid gap-3", {
          "lg:hidden": openItem,
        })}
      >
        {preorder && <Text variant="uppercaseWithColors">{preorder}</Text>}
        <div className="fixed inset-x-2.5 bottom-4 z-10 lg:relative lg:inset-x-0 lg:bottom-0">
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
