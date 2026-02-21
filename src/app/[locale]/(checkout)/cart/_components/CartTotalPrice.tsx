"use client";

import { currencySymbols } from "@/constants";
import { formatPrice } from "@/lib/currency";
import { useTranslations } from "next-intl";

import { useCart } from "@/lib/stores/cart/store-provider";
import { Text } from "@/components/ui/text";

export default function CartTotalPrice() {
  const { subTotalPrice, validatedCurrency } = useCart((state) => state);
  const t = useTranslations("cart");

  return (
    <div className="flex items-center justify-between border-t border-solid border-textInactiveColor pt-3">
      <Text variant="uppercase">{t("subtotal")}:</Text>
      <Text variant="uppercase" size="small">
        {formatPrice(subTotalPrice, validatedCurrency || "EUR", currencySymbols[validatedCurrency || "EUR"])}
      </Text>
    </div>
  );
}
