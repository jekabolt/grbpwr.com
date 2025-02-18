import type { common_OrderItem } from "@/api/proto-http/frontend";
import { currencySymbols } from "@/constants";

import { useCurrency } from "@/lib/stores/currency/store-provider";
import { cn } from "@/lib/utils";
import Image from "@/components/ui/image";
import { Text } from "@/components/ui/text";

import CartItemSize from "./CartItemSize";
import ProductRemoveButton from "./ProductRemoveButton";
import { getPreorderDate } from "./utils";

export default function ItemRow({ product, hideQuantityButtons }: Props) {
  const { selectedCurrency, convertPrice } = useCurrency((state) => state);

  if (!product) return null;

  const preorderDate = getPreorderDate(product);

  return (
    <div className="flex gap-3 border-b border-solid border-textInactiveColor py-6 text-textColor first:pt-0 last:border-b-0 ">
      <div className="w-[90px]">
        <Image
          src={product.thumbnail || ""}
          alt="product"
          fit="contain"
          aspectRatio="3/4"
        />
      </div>
      <div className="flex grow justify-between">
        <div className="flex flex-col gap-y-3">
          <Text variant="uppercase">{product.productName}</Text>
          <div>
            <Text>{product.color}</Text>
            <CartItemSize sizeId={product.orderItem?.sizeId + ""} />
          </div>
          {preorderDate && (
            <Text variant="inactive" className="whitespace-nowrap">
              {preorderDate}
            </Text>
          )}
        </div>
        <div
          className={cn(
            "flex w-1/2 grow flex-col items-end justify-between gap-3",
          )}
        >
          {!hideQuantityButtons && (
            <ProductRemoveButton
              id={product.orderItem?.productId || 0}
              size={product.orderItem?.sizeId + "" || ""}
            />
          )}
          <Text>
            {currencySymbols[selectedCurrency]}{" "}
            {convertPrice(product.productPrice || "")}
          </Text>
        </div>
      </div>
    </div>
  );
}

type Props = {
  product?: common_OrderItem;
  hideQuantityButtons?: boolean;
};
