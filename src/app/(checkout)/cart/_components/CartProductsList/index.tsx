import { addCartProduct, clearCartProducts } from "@/lib/actions/cart";
import { serviceClient } from "@/lib/api";
import CartItemRow from "@/app/(checkout)/cart/_components/CartItemRow";
import HACK__UpdateCookieCart from "@/app/(checkout)/cart/_components/HACK__UpdateCookieCart";
import SelectedCurrency from "@/app/(checkout)/cart/_components/TotalPrice/SelectedCurrency";
import { getValidateOrderItemsInsertItems } from "@/app/(checkout)/cart/_components/utils";

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
