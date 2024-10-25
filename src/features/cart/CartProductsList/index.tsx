import { addCartProduct, clearCartProducts } from "@/features/cart/action";
import { serviceClient } from "@/lib/api";
import { getValidateOrderItemsInsertItems } from "@/features/cart/utils";
import CartItemRow from "@/features/cart/CartItemRow";
import SelectedCurrency from "@/features/cart/TotalPrice/SelectedCurrency";
import HACK__UpdateCookieCart from "@/features/cart/HACK__UpdateCookieCart";

export default async function CartProductsList({
  className,
}: {
  className?: string;
}) {
  const items = await getValidateOrderItemsInsertItems();

  if (items.length === 0) return null;

  const response = await serviceClient.ValidateOrderItemsInsert({
    items,
    shipmentCarrierId: undefined,
    promoCode: undefined,
  });

  const updateCookieCart = async () => {
    "use server";

    if (response?.validItems && response?.validItems?.length > 0) {
      clearCartProducts();

      for (const p of response.validItems) {
        if (
          p.orderItem?.productId &&
          p.orderItem.quantity &&
          p.orderItem.sizeId
        ) {
          addCartProduct({
            id: p.orderItem.productId,
            size: p.orderItem.sizeId.toString(),
            quantity: p.orderItem.quantity,
          });
        }
      }
    }
  };

  return (
    <div className={"space-y-6"}>
      {response?.validItems?.map((p, i) => (
        <CartItemRow
          key={(p.id as number) + i}
          product={p}
          className={className}
        />
      ))}
      <SelectedCurrency baseCurrencyTotal={Number(response.totalSale?.value)} />
      {response.hasChanged && (
        <HACK__UpdateCookieCart updateCookieCart={updateCookieCart} />
      )}
    </div>
  );
}
