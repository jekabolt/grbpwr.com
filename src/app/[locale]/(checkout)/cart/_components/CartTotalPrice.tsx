"use client";

import { currencySymbols } from "@/constants";
import { useTranslations } from "next-intl";

import { useCart } from "@/lib/stores/cart/store-provider";
import { useCurrency } from "@/lib/stores/currency/store-provider";
import { Text } from "@/components/ui/text";

export default function CartTotalPrice() {
  const { selectedCurrency, convertPrice } = useCurrency((state) => state);
  const { subTotalPrice } = useCart((state) => state);
  const t = useTranslations("cart");

  return (
    <div className="flex items-center justify-between border-t border-solid border-textInactiveColor pt-3">
      <Text variant="uppercase">{t("subtotal")}:</Text>
      <Text variant="uppercase" size="small">
        {currencySymbols[selectedCurrency]}{" "}
        {convertPrice(subTotalPrice.toString())}
      </Text>
    </div>
  );
}
