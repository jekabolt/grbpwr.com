import { changeCartProductQuantity, removeCartProduct } from "@/actions/cart";
import type { common_ProductFull } from "@/api/proto-http/frontend";
import ImageComponent from "@/components/ui/Image";
import ProductAmountButtons from "./ProductAmountButtons";

export default function CartItemRow({
  product,
  quantity,
  size,
}: {
  product?: common_ProductFull;
  quantity: number;
  size: string;
}) {
  if (!product) return null;

  const { product: p } = product;
  const basicCurrencyValue = p?.productDisplay?.productBody?.price?.value;

  return (
    <div className="flex justify-between gap-6 text-textColor">
      <div className="flex w-1/2 gap-6">
        <div className="h-full w-28 flex-none">
          <ImageComponent
            src={p?.productDisplay?.thumbnail?.media?.thumbnail?.mediaUrl || ""}
            alt="product"
            fit="cover"
            aspectRatio="2/3"
          />
        </div>
        <div className="space-y-2">
          <p className="text-md">{p?.productDisplay?.productBody?.name}</p>
          <p className="text-sm">{p?.productDisplay?.productBody?.color}</p>
          <p className="text-xs">{size}</p>
        </div>
      </div>
      <div className="flex w-1/2 whitespace-nowrap text-sm">
        {p?.slug && basicCurrencyValue && (
          <ProductAmountButtons
            slug={p?.slug || ""}
            size={size}
            price={parseInt(basicCurrencyValue)}
            removeProduct={removeCartProduct}
            changeProductAmount={changeCartProductQuantity}
          />
        )}
        <div className="font-bold">quantity: {quantity}</div>
      </div>
      <div className="flex w-1/2 flex-col items-end space-y-2">
        <p className="text-md">
          BTC {p?.productDisplay?.productBody?.price?.value}
        </p>
        <p className="text-xs line-through">
          BTC {p?.productDisplay?.productBody?.price?.value}
        </p>
      </div>
    </div>
  );
}
