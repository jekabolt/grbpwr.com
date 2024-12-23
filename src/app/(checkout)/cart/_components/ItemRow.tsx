import type { common_OrderItem } from "@/api/proto-http/frontend";

import { cn } from "@/lib/utils";
import Image from "@/components/ui/image";
import { Text } from "@/components/ui/text";

import CartItemSize from "./CartItemSize";
import ProductAmountButtons from "./ProductAmountButtons";
import ProductRemoveButton from "./ProductRemoveButton";

export default function ItemRow({ product, hideQuantityButtons }: Props) {
  if (!product) return null;

  return (
    <div className="flex justify-between gap-3 border-b border-dashed border-textInactiveColor pb-6 pt-6 text-textColor last:border-b-0 last:pb-0">
      <div className="h-full w-28 flex-none">
        <Image
          src={product.thumbnail || ""}
          alt="product"
          fit="contain"
          aspectRatio="3/4"
        />
      </div>
      <div className="flex grow flex-col justify-between gap-3">
        <div className="space-y-3">
          <Text variant="uppercase">{product.productName}</Text>
          <div>
            <Text>{product.color}</Text>
            <CartItemSize sizeId={product.orderItem?.sizeId + ""} />
          </div>
        </div>
        {product.orderItem?.productId !== undefined && !hideQuantityButtons ? (
          <ProductAmountButtons
            id={product.orderItem?.productId}
            size={product.orderItem?.sizeId + "" || ""}
            quantity={product.orderItem?.quantity || 3}
          />
        ) : (
          product.orderItem?.quantity || 3
        )}
      </div>
      <div
        className={cn("flex grow flex-col items-end justify-between gap-3", {
          "justify-end": hideQuantityButtons,
        })}
      >
        {!hideQuantityButtons && (
          <ProductRemoveButton
            id={product.orderItem?.productId || 0}
            size={product.orderItem?.sizeId + "" || ""}
          />
        )}
        <p>BTC {product.productPrice}</p>
      </div>
    </div>
  );
}

type Props = {
  product?: common_OrderItem;
  hideQuantityButtons?: boolean;
};
