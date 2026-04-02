"use client";

import type { common_OrderFull } from "@/api/proto-http/frontend";
import { currencySymbols } from "@/constants";
import { formatPrice } from "@/lib/currency";
import { useTranslations } from "next-intl";
import { useState } from "react";

import FieldsGroupContainer from "@/app/[locale]/(checkout)/checkout/_components/new-order-form/fields-group-container";
import { Text } from "@/components/ui/text";

import {
  OrderSummaryProducts,
  OrderSummaryPromoRows,
  OrderSummaryShippingAndTotal,
} from "./order-summary-shared";

type Props = {
  orderData: common_OrderFull;
};

export function MobileOrderSummary({ orderData }: Props) {
  const t = useTranslations("checkout");
  const [isOpen, setIsOpen] = useState(false);

  const { order } = orderData;
  const orderCurrencyKey = order?.currency?.toUpperCase() || "EUR";
  const orderCurrency = currencySymbols[orderCurrencyKey];

  return (
    <FieldsGroupContainer
      signType="plus-minus"
      className="space-y-0 border border-textInactiveColor p-2.5"
      signPosition="before"
      title={`${isOpen ? t("hide") : t("show")} ${t("order summary")}`}
      preview={
        <Text>
          {formatPrice(
            order?.totalPrice?.value || "0",
            orderCurrencyKey,
            orderCurrency,
          )}
        </Text>
      }
      isOpen={isOpen}
      onToggle={() => setIsOpen((prev) => !prev)}
    >
      <div className="mt-4 space-y-3">
        <OrderSummaryPromoRows promoCode={orderData.promoCode} />
        <OrderSummaryProducts
          order={orderData.order}
          orderItems={orderData.orderItems}
        />
        <OrderSummaryShippingAndTotal
          order={orderData.order}
          shipment={orderData.shipment}
        />
      </div>
    </FieldsGroupContainer>
  );
}
