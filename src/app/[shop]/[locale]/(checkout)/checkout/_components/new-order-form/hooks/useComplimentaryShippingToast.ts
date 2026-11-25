"use client";

import { useEffect, useState } from "react";
import type { ValidateOrderItemsInsertResponse } from "@/api/proto-http/frontend";
import { currencySymbols } from "@/constants";
import { useTranslations } from "next-intl";

import { formatPrice } from "@/lib/currency";
import { useDataContext } from "@/components/contexts/DataContext";

const COMPLIMENTARY_SHIPPING_DISMISSED_KEY =
  "complimentary-shipping-dismissed-at";
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function isComplimentaryShippingDismissedRecently(): boolean {
  try {
    if (typeof window === "undefined") return false;
    const raw = localStorage.getItem(COMPLIMENTARY_SHIPPING_DISMISSED_KEY);
    if (!raw) return false;
    const dismissedAt = parseInt(raw, 10);
    if (Number.isNaN(dismissedAt)) return false;
    return Date.now() - dismissedAt < ONE_WEEK_MS;
  } catch {
    return false;
  }
}

function setComplimentaryShippingDismissed(): void {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        COMPLIMENTARY_SHIPPING_DISMISSED_KEY,
        String(Date.now()),
      );
    }
  } catch {
    // localStorage unavailable
  }
}

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

  const [complimentaryToastOpen, setComplimentaryToastOpen] = useState(false);

  useEffect(() => {
    if (showComplimentaryToast) {
      setComplimentaryToastOpen(!isComplimentaryShippingDismissedRecently());
    } else {
      setComplimentaryToastOpen(false);
    }
  }, [showComplimentaryToast]);

  const dismissComplimentaryToast = () => {
    setComplimentaryToastOpen(false);
    setComplimentaryShippingDismissed();
  };

  return {
    showComplimentaryToast,
    complimentaryToastMessage,
    complimentaryToastOpen,
    dismissComplimentaryToast,
  };
}
