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
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { getPreorderDate } from "@/app/(checkout)/cart/_components/utils";

export function AddToCartForm({ sizes, id, className, product }: Props) {
  const { dictionary } = useDataContext();
  const { increaseQuantity, products } = useCart((state) => state);
  const { selectedCurrency, convertPrice } = useCurrency((state) => state);
  const [activeSizeId, setActiveSizeId] = useState<number | undefined>();
  const currencyPrice = `${currencySymbols[selectedCurrency]} ${convertPrice(product.product?.productDisplay?.productBody?.price?.value || "")}`;
  const preorder = getPreorderDate(product);
  const isSaleApplied =
    product.product?.productDisplay?.productBody?.salePercentage?.value !== "0";
  const salePercentage =
    product.product?.productDisplay?.productBody?.salePercentage?.value;
  const priceWithSale = calculatePriceWithSale(
    product.product?.productDisplay?.productBody?.price?.value,
    product.product?.productDisplay?.productBody?.salePercentage?.value,
  );

  const sizeNames = sizes.map((s) => ({
    id: s.sizeId as number,
    name: dictionary?.sizes?.find((dictS) => dictS.id === s.sizeId)?.name || "",
  }));

  const productQuanityInCart = products.find(
    (p) => p.id === id && p.size === activeSizeId?.toString(),
  )?.quantity;

  const isMaxQuantity =
    productQuanityInCart &&
    productQuanityInCart >= (dictionary?.maxOrderItems || 3);

  const handleAddToCart = async () => {
    if (!activeSizeId || isMaxQuantity) return;

    await increaseQuantity(id, activeSizeId?.toString() || "", 1);
  };

  return (
    // <div className={cn("flex flex-col justify-between", className)}>
    <div className="flex flex-col justify-between border border-red-500">
      <div className="grid grid-cols-4 gap-2 border border-blue-500">
        {sizeNames.map(({ name, id }) => (
          <Button
            className={cn("p-1 uppercase", {
              "bg-textColor uppercase text-bgColor": activeSizeId === id,
            })}
            key={id}
            onClick={() => setActiveSizeId(id)}
          >
            {dictionary?.sizes?.find((dictS) => dictS.id === id)?.name || ""}
          </Button>
        ))}
      </div>
      <div className="grid gap-3">
        {preorder && <Text variant="uppercase">{preorder}</Text>}
        <Button
          className="flex items-center justify-between uppercase"
          variant="main"
          size="lg"
          // disabled={!activeSizeId || isMaxQuantity}
          onClick={handleAddToCart}
        >
          <Text component="span" variant="inherit">
            add
          </Text>
          {isSaleApplied ? (
            <Text variant="inactive">
              {`${currencyPrice} - ${salePercentage}`} ={" "}
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
    // </div>
  );
}

interface Props {
  id: number;
  sizes: common_ProductSize[];
  product: common_ProductFull;
  className?: string;
}
