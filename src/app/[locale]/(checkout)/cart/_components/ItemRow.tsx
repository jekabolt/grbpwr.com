import Link from "next/link";
import type { common_OrderItem } from "@/api/proto-http/frontend";
import { currencySymbols } from "@/constants";
import { useTranslations } from "next-intl";

import { useCurrency } from "@/lib/stores/currency/store-provider";
import { cn, isDateTodayOrFuture } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "@/components/ui/image";
import { Text } from "@/components/ui/text";

import CartItemSize from "./CartItemSize";
import ProductRemoveButton from "./ProductRemoveButton";
import { getPreorderDate } from "./utils";

export default function ItemRow({
  product,
  hideQuantityButtons,
  index,
}: Props) {
  const { selectedCurrency, convertPrice } = useCurrency((state) => state);
  const isSaleApplied = parseInt(product?.productSalePercentage || "0");
  const priceWithoutSale = `${currencySymbols[selectedCurrency]}  ${convertPrice(product?.productPrice || "")}`;
  const priceWithSale = `${currencySymbols[selectedCurrency]} ${convertPrice(product?.productPriceWithSale || "")}`;
  const t = useTranslations("product");
  const tColors = useTranslations("colors");

  if (!product) return null;

  const preorderDate = getPreorderDate(product, t);
  const rawPreorderDate = product.preorder;

  return (
    <Button asChild>
      <Link href={product.slug || ""}>
        <div className="relative flex gap-x-3 border-b border-solid border-textInactiveColor py-6 text-textColor first:pt-0 last:border-b-0">
          <div className="min-w-[90px]">
            <Image
              src={product.thumbnail || ""}
              alt="product"
              fit="contain"
              aspectRatio="3/4"
            />
          </div>
          <div className="flex w-full justify-between">
            <div className="flex w-full flex-col justify-between">
              <div className="space-y-3">
                <Text
                  className="line-clamp-1 overflow-hidden text-ellipsis"
                  variant="uppercase"
                >
                  {product.productName}
                </Text>
                <div>
                  <Text variant="uppercase">
                    {tColors(product.color || "")}
                  </Text>
                  <CartItemSize sizeId={product.orderItem?.sizeId + ""} />
                </div>
              </div>
              {preorderDate && isDateTodayOrFuture(rawPreorderDate || "") && (
                <Text
                  variant="uppercase"
                  className="whitespace-nowrap text-textInactiveColor"
                >
                  {preorderDate}
                </Text>
              )}
            </div>
            <div
              className={cn(
                "flex w-full flex-col items-end justify-between gap-3",
                {
                  "justify-end": hideQuantityButtons,
                },
              )}
            >
              {!hideQuantityButtons && (
                <ProductRemoveButton
                  id={product.orderItem?.productId || 0}
                  size={product.orderItem?.sizeId + "" || ""}
                  index={index}
                />
              )}
              <div className="flex items-center whitespace-nowrap">
                {isSaleApplied ? (
                  <div className="flex items-center gap-x-2">
                    <Text variant="strileTroughInactive">
                      {priceWithoutSale}
                    </Text>
                    <Text>{priceWithSale}</Text>
                  </div>
                ) : (
                  <Text>{priceWithoutSale}</Text>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </Button>
  );
}

type Props = {
  product?: common_OrderItem;
  hideQuantityButtons?: boolean;
  index?: number;
};
