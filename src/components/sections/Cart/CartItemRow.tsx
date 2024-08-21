import { changeCartProductQuantity, removeCartProduct } from "@/actions/cart";
import type { common_OrderItem } from "@/api/proto-http/frontend";
import ImageComponent from "@/components/ui/Image";
import ProductAmountButtons from "./ProductAmountButtons";

export default function CartItemRow({
  product,
}: {
  product?: common_OrderItem;
}) {
  if (!product) return null;

  const basicCurrencyValue = product.productPrice;

  return (
    <div className="flex justify-between gap-6 text-textColor">
      <div className="flex w-1/2 gap-6">
        <div className="h-full w-28 flex-none">
          <ImageComponent
            src={product.thumbnail || ""}
            alt="product"
            fit="cover"
            aspectRatio="2/3"
          />
        </div>
        <div className="space-y-2">
          <p className="text-md">{product.productName}</p>
          <p className="text-sm">{product.color}</p>
          // TO-DO map size id
          <p className="text-xs">{product.orderItem?.sizeId}</p>
        </div>
      </div>
      <div className="flex w-1/2 whitespace-nowrap text-sm">
        {product.id && basicCurrencyValue && (
          <ProductAmountButtons
            id={product.id}
            // MAP size id or use size id on cookie key
            size={product.orderItem?.sizeId}
            price={parseInt(basicCurrencyValue)}
            removeProduct={removeCartProduct}
            changeProductAmount={changeCartProductQuantity}
          />
        )}
        <div className="font-bold">quantity: {product.orderItem?.quantity}</div>
      </div>
      <div className="flex w-1/2 flex-col items-end space-y-2">
        <p className="text-md">BTC {product.productPrice}</p>
        <p className="text-xs line-through">BTC {product.productPrice}</p>
      </div>
    </div>
  );
}
