import { getCookieCart } from "@/features/cart/utils";
import SelectedCurrency from "./SelectedCurrency";

export default async function TotalPrice() {
  const cartData = await getCookieCart();

  if (!cartData) return;

  const total = Object.values(cartData.products).reduce(
    // @ts-ignore
    (acc, p) => acc + p.price,
    0,
  );

  return <SelectedCurrency baseCurrencyTotal={total} />;
}
