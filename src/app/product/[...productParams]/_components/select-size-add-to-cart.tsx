"use client";

import { useState } from "react";
import type {
  common_ProductFull,
  common_ProductSize,
} from "@/api/proto-http/frontend";
import { currencySymbols } from "@/constants";

import { useCart } from "@/lib/stores/cart/store-provider";
import { useCurrency } from "@/lib/stores/currency/store-provider";
import { calculatePriceWithSale, cn } from "@/lib/utils";
import { useDataContext } from "@/components/DataContext";
import {
  AccordionContent,
  AccordionItem,
  AccordionRoot,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { getPreorderDate } from "@/app/(checkout)/cart/_components/utils";

export function AddToCartForm({ sizes, id, className, product }: Props) {
  const { dictionary } = useDataContext();
  const { increaseQuantity, products } = useCart((state) => state);
  const { selectedCurrency, convertPrice } = useCurrency((state) => state);
  const [activeSizeId, setActiveSizeId] = useState<number | undefined>();
  const [openItem, setOpenItem] = useState<string | undefined>(undefined);

  const productBody = product.product?.productDisplay?.productBody;
  const price = productBody?.price?.value || "0";
  const salePercentage = productBody?.salePercentage?.value || "0";
  const isSaleApplied = salePercentage !== "0";

  const currencyPrice = `${currencySymbols[selectedCurrency]} ${convertPrice(price)}`;
  const priceWithSale = calculatePriceWithSale(price, salePercentage);
  const preorder = getPreorderDate(product);

  const sizeNames = sizes.map((s) => ({
    id: s.sizeId as number,
    name: dictionary?.sizes?.find((dictS) => dictS.id === s.sizeId)?.name || "",
  }));

  const productQuantityInCart =
    products.find((p) => p.id === id && p.size === activeSizeId?.toString())
      ?.quantity || 0;

  const maxOrderItems = dictionary?.maxOrderItems || 3;
  const isMaxQuantity = productQuantityInCart >= maxOrderItems;

  const handleAddToCart = async () => {
    if (!activeSizeId || isMaxQuantity) return;
    await increaseQuantity(id, activeSizeId.toString(), 1);
  };

  return (
    <div className={cn("flex flex-col justify-between", className)}>
      <AccordionRoot
        type="single"
        collapsible
        value={openItem}
        onValueChange={setOpenItem}
        className="h-full"
      >
        <AccordionItem value="size" className="relative h-full">
          <AccordionTrigger className="border-inactive border-b-2">
            <Text variant="uppercase">size</Text>
          </AccordionTrigger>
          <AccordionContent
            className={cn("grid grid-cols-4 gap-2", {
              "absolute inset-x-0 bottom-0": openItem,
            })}
          >
            {sizeNames.map(({ name, id: sizeId }) => (
              <Button
                className={cn("uppercase", {
                  "border-b-2 border-black": activeSizeId === sizeId,
                })}
                key={sizeId}
                onClick={() => setActiveSizeId(sizeId)}
              >
                {name}
              </Button>
            ))}
          </AccordionContent>
        </AccordionItem>
      </AccordionRoot>
      <div
        className={cn("grid gap-3", {
          hidden: openItem,
        })}
      >
        {preorder && <Text variant="uppercaseWithColors">{preorder}</Text>}
        <Button
          className="flex items-center justify-between uppercase"
          variant="main"
          size="lg"
          onClick={handleAddToCart}
          disabled={!activeSizeId || isMaxQuantity}
        >
          <Text component="span" variant="inherit">
            {!activeSizeId
              ? "select size"
              : isMaxQuantity
                ? `max ${maxOrderItems}`
                : "add"}
          </Text>
          {isSaleApplied ? (
            <Text variant="inactive">
              {`${currencyPrice} - ${salePercentage}%`} ={" "}
              <Text variant={"inherit"} component="span">
                {`${currencySymbols[selectedCurrency]} ${priceWithSale}`}
              </Text>
            </Text>
          ) : (
            <Text variant="inherit">{currencyPrice}</Text>
          )}
        </Button>
      </div>
    </div>
  );
}

interface Props {
  id: number;
  sizes: common_ProductSize[];
  product: common_ProductFull;
  className?: string;
}
