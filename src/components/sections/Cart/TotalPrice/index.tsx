import { getCookieCart } from "@/lib/utils/cart";
import SelectedCurrency from "./SelectedCurrency";

export default function TotalPrice() {
  const cartData = getCookieCart();

  if (!cartData) return;

  const total = Object.values(cartData.products).reduce(
    // @ts-ignore
    (acc, p) => acc + p.price,
    0,
  );

  return (
    <div>
      <SelectedCurrency baseCurrencyTotal={total} />
    </div>
  );
}
