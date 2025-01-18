import type { common_OrderItem } from "@/api/proto-http/frontend";

import { cn } from "@/lib/utils";
import { useDataContext } from "@/components/DataContext";
import Image from "@/components/ui/image";
import { Text } from "@/components/ui/text";

import CartItemSize from "./CartItemSize";
import ProductRemoveButton from "./ProductRemoveButton";

export default function ItemRow({ product, hideQuantityButtons }: Props) {
  const { selectedCurrency } = useDataContext();
  if (!product) return null;

  return (
    <div className="flex gap-3 border-b border-dashed border-textInactiveColor py-6 text-textColor first:pt-0 last:border-b-0 last:pb-0 ">
      <div className="w-28">
        <Image
          src={product.thumbnail || ""}
          alt="product"
          fit="contain"
          aspectRatio="3/4"
        />
      </div>
      <div className="flex grow flex-col justify-between gap-3">
        <div className="w-3/4 space-y-3">
          <Text variant="uppercase">{product.productName}</Text>
          <div>
            <Text>{product.color}</Text>
            <CartItemSize sizeId={product.orderItem?.sizeId + ""} />
          </div>
        </div>
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
        <p>
          {selectedCurrency} {product.productPrice}
        </p>
      </div>
    </div>
  );
}

type Props = {
  product?: common_OrderItem;
  hideQuantityButtons?: boolean;
};
