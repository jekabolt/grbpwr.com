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

export function AddToCartForm({
  sizes,
  id,
  className,
  product,
  onSizeAccordionStateChange,
}: Props) {
  const { dictionary } = useDataContext();
  const { increaseQuantity, products } = useCart((state) => state);
  const { selectedCurrency, convertPrice } = useCurrency((state) => state);
  const [activeSizeId, setActiveSizeId] = useState<number | undefined>();
  const [openItem, setOpenItem] = useState<string | undefined>(undefined);
  const [pendingAddToCart, setPendingAddToCart] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const activeSizeName = activeSizeId
    ? sizeNames.find((size) => size.id === activeSizeId)?.name
    : "";

  const productQuantityInCart =
    products.find((p) => p.id === id && p.size === activeSizeId?.toString())
      ?.quantity || 0;

  const maxOrderItems = dictionary?.maxOrderItems || 3;
  const isMaxQuantity = productQuantityInCart >= maxOrderItems;

  const handleAddToCart = async () => {
    if (isMaxQuantity) return;
    if (!activeSizeId) {
      onAccordionChange("size");
      setPendingAddToCart(true);
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      await increaseQuantity(id, activeSizeId?.toString() || "", 1);
    } finally {
      setIsLoading(false);
      setOpenItem("");
    }
  };

  const onAccordionChange = (value: string | undefined) => {
    setOpenItem(value);
    onSizeAccordionStateChange(value === "size");
  };

  const handleSizeSelect = async (sizeId: number) => {
    setActiveSizeId(sizeId);
    onAccordionChange("");

    if (pendingAddToCart) {
      setPendingAddToCart(false);
      setIsLoading(true);
      try {
        await increaseQuantity(id, sizeId.toString(), 1);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className={cn("flex flex-col justify-between", className)}>
      <AccordionRoot
        type="single"
        collapsible
        value={openItem}
        onValueChange={onAccordionChange}
      >
        <AccordionItem value="size" className="flex h-full flex-col gap-y-5">
          <AccordionTrigger className="border-inactive border-b">
            <Text variant="uppercase">
              {activeSizeId ? activeSizeName : "size"}
            </Text>
          </AccordionTrigger>
          <AccordionContent className={cn("grid grid-cols-4 gap-2", {})}>
            {sizeNames.map(({ name, id }) => (
              <Button
                className={cn("uppercase hover:border-b hover:border-black", {
                  "border-b border-black": activeSizeId === id,
                })}
                key={id}
                onClick={() => handleSizeSelect(id)}
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
          className={cn(
            "flex items-center justify-between bg-textColor uppercase text-bgColor",
            {
              "justify-center": isLoading,
            },
          )}
          size="lg"
          onClick={handleAddToCart}
          loading={isLoading}
          disabled={isMaxQuantity}
        >
          <Text component="span" variant="inherit">
            {preorder ? "preorder" : "add"}
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
  onSizeAccordionStateChange: (isOpen: boolean) => void;
}
