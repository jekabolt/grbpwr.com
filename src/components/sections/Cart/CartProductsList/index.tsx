import { addCartProduct, clearCartProducts } from "@/actions/cart";
import { Button } from "@/components/ui/Button";
import { serviceClient } from "@/lib/api";
import { getValidateOrderItemsInsertItems } from "@/lib/utils/cart";
import Link from "next/link";
import CartItemRow from "../CartItemRow";
import SelectedCurrency from "../TotalPrice/SelectedCurrency";
import HACK__UpdateCookieCart from "./HACK__UpdateCookieCart";

export default async function CartProductsList() {
  const items = getValidateOrderItemsInsertItems();

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
    <div>
      {response.hasChanged && (
        <HACK__UpdateCookieCart updateCookieCart={updateCookieCart} />
      )}
      {response?.validItems?.map((p, i) => (
        <Button key={(p.id as number) + i} asChild>
          <Link href={p.slug || ""}>
            <CartItemRow product={p} />
          </Link>
        </Button>
      ))}
      <p className="mb-8 text-sm">total:</p>
      <SelectedCurrency baseCurrencyTotal={Number(response.totalSale?.value)} />
    </div>
  );
}
