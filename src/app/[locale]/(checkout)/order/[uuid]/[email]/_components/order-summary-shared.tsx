"use client";

import type { common_OrderFull } from "@/api/proto-http/frontend";
import { currencySymbols } from "@/constants";
import { formatPrice } from "@/lib/currency";
import { useTranslations } from "next-intl";

import { OrderProducts } from "@/app/[locale]/(checkout)/checkout/_components/new-order-form/order-products";
import { Text } from "@/components/ui/text";

type OrderSummaryPick = Pick<
  common_OrderFull,
  "order" | "orderItems" | "shipment" | "promoCode"
>;

export function OrderSummaryPromoRows({
  promoCode,
}: {
  promoCode: OrderSummaryPick["promoCode"];
}) {
  const t = useTranslations("order-info");
  const tCheckout = useTranslations("checkout");
  const code = promoCode?.promoCodeInsert?.code;
  if (!code) return null;

  return (
    <div className="space-y-3">
      <div className="flex justify-between">
        <Text variant="uppercase">{t("discount code")}</Text>
        <Text>{code}</Text>
      </div>
      <div className="flex justify-between">
        <Text variant="uppercase">{tCheckout("promo discount")}</Text>
        <Text>{promoCode?.promoCodeInsert?.discount?.value} %</Text>
      </div>
    </div>
  );
}

export function OrderSummaryProducts({
  order,
  orderItems,
}: Pick<OrderSummaryPick, "order" | "orderItems">) {
  return (
    <OrderProducts
      validatedProducts={orderItems || []}
      currencyKey={order?.currency?.toUpperCase()}
    />
  );
}

export function OrderSummaryShippingAndTotal({
  order,
  shipment,
}: Pick<OrderSummaryPick, "order" | "shipment">) {
  const t = useTranslations("order-info");
  const tCheckout = useTranslations("checkout");
  const orderCurrencyKey = order?.currency?.toUpperCase() || "EUR";
  const orderCurrency = currencySymbols[orderCurrencyKey];

  return (
    <div className="space-y-3 pt-3">
      <div className="flex justify-between">
        <Text variant="uppercase">{t("shipping")}:</Text>
        <Text>
          {shipment?.freeShipping
            ? tCheckout("FREE")
            : formatPrice(
                shipment?.cost?.value ?? "0",
                orderCurrencyKey,
                orderCurrency,
              )}
        </Text>
      </div>
      <div className="flex justify-between border-t border-textInactiveColor pt-3">
        <Text variant="uppercase">{tCheckout("grand total")}:</Text>
        <Text>
          {formatPrice(
            order?.totalPrice?.value || "0",
            orderCurrencyKey,
            orderCurrency,
          )}
        </Text>
      </div>
    </div>
  );
}
