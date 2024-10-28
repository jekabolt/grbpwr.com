import type { common_OrderItem } from "@/api/proto-http/frontend";

import { cn } from "@/lib/utils";
import Image from "@/components/ui/image";

import CartItemSize from "./CartItemSize";
import ProductAmountButtons from "./ProductAmountButtons";
import ProductRemoveButton from "./ProductRemoveButton";

export default function CartItemRow({
  product,
  className,
}: {
  product?: common_OrderItem;
  className?: string;
}) {
  if (!product) return null;

  return (
    <div className={cn("flex justify-between gap-3 text-textColor", className)}>
      <div className="h-full w-28 flex-none">
        <Image
          src={product.thumbnail || ""}
          alt="product"
          fit="cover"
          aspectRatio="3/4"
        />
      </div>
      <div className="flex grow flex-col justify-between gap-3">
        <div className="space-y-3">
          <p>{product.productName}</p>
          <div>
            <p>{product.color}</p>
            <CartItemSize sizeId={product.orderItem?.sizeId + ""} />
          </div>
        </div>
        {product.orderItem?.productId !== undefined && (
          <ProductAmountButtons
            id={product.orderItem?.productId}
            size={product.orderItem?.sizeId + "" || ""}
          >
            {product.orderItem?.quantity || 0}
          </ProductAmountButtons>
        )}
      </div>
      <div className="flex grow flex-col items-end justify-between gap-3">
        <ProductRemoveButton
          id={product.orderItem?.productId || 0}
          size={product.orderItem?.sizeId + "" || ""}
        />
        <p>BTC {product.productPrice}</p>
      </div>
    </div>
  );
}
