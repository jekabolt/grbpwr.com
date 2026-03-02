"use client";

import { useState } from "react";
import type { ValidateOrderItemsInsertResponse } from "@/api/proto-http/frontend";
import { currencySymbols } from "@/constants";
import { useTranslations } from "next-intl";

import { formatPrice } from "@/lib/currency";
import { useDataContext } from "@/components/contexts/DataContext";

export function useComplimentaryShippingToast(
  order: ValidateOrderItemsInsertResponse | undefined,
  orderCurrency: string | undefined,
) {
  const { dictionary } = useDataContext();
  const t = useTranslations("checkout");

  const currency = orderCurrency || "EUR";
  const currencySymbol =
    currencySymbols[currency] ||
    currencySymbols[dictionary?.baseCurrency || "EUR"];
  const thresholdDecimal = dictionary?.complimentaryShippingPrices?.[currency];
  const threshold = thresholdDecimal?.value
    ? parseFloat(thresholdDecimal.value)
    : undefined;
  const subtotalNum = order ? parseFloat(order.subtotal?.value || "0") : 0;
  const promoFreeShipping = !!order?.promo?.freeShipping;

  const showComplimentaryToast =
    !!order &&
    !!threshold &&
    !order.freeShipping &&
    !promoFreeShipping &&
    subtotalNum < threshold;

  const complimentaryToastMessage = showComplimentaryToast
    ? t("complimentary shipping available for", {
        amount: formatPrice(threshold!, currency, currencySymbol),
      })
    : undefined;

  const [complimentaryToastOpen, setComplimentaryToastOpen] = useState(true);

  return {
    showComplimentaryToast,
    complimentaryToastMessage,
    complimentaryToastOpen,
    setComplimentaryToastOpen,
  };
}
