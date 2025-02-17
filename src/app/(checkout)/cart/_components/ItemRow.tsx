import type { common_OrderItem } from "@/api/proto-http/frontend";
import { currencySymbols } from "@/constants";

import { useCurrency } from "@/lib/stores/currency/store-provider";
import { cn } from "@/lib/utils";
import Image from "@/components/ui/image";
import { Text } from "@/components/ui/text";

import CartItemSize from "./CartItemSize";
import ProductRemoveButton from "./ProductRemoveButton";

const isValidDate = (date: string) => {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime()) && d.getFullYear() > 2000;
};

export default function ItemRow({ product, hideQuantityButtons }: Props) {
  const { selectedCurrency, convertPrice } = useCurrency((state) => state);
  const isValidPreorderDate = product?.preorder
    ? isValidDate(product?.preorder)
    : false;
  const preorderDate = isValidPreorderDate
    ? new Date(product?.preorder || "").toLocaleDateString().replace(/\//g, ".")
    : null;

  if (!product) return null;

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
          <Text variant="inactive" className="whitespace-nowrap">
            {preorderDate ? `ship by ${preorderDate}` : ""}
          </Text>
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
