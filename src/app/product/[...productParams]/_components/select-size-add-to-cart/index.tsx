"use client";

import { useEffect } from "react";
import type { common_ProductFull } from "@/api/proto-http/frontend";

import { useCart } from "@/lib/stores/cart/store-provider";
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

import { LoadingButton } from "../loading-button";
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
  const { openCart } = useCart((state) => state);
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
    lowStockText,
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
                <AccordionTrigger
                  useMinus
                  className="border-inactive border-b pb-2.5"
                >
                  <Text variant="uppercase">
                    {triggerText}
                    <Text
                      component="span"
                      variant="uppercase"
                      className="text-textInactiveColor"
                    >
                      {" "}
                      {lowStockText}
                    </Text>
                  </Text>
                </AccordionTrigger>
                <AccordionContent className="grid grid-cols-4 gap-2">
                  {sizeNames?.map(({ name, id }) => (
                    <Button
                      className={cn("border-b border-transparent", {
                        "border-textColor": activeSizeId === id,
                        "hover:border-textColor": !outOfStock[id],
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
        className={cn(
          "fixed inset-x-0 bottom-0 z-10 grid gap-3 px-2.5 pb-5 pt-2.5 lg:relative lg:inset-x-0 lg:bottom-0 lg:p-0",
          {
            "lg:hidden": openItem,
            "bg-bgColor": preorder,
          },
        )}
      >
        {preorder && (
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
