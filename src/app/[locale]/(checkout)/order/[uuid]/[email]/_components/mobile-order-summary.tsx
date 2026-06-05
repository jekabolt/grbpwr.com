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
  // Order summary is expanded by default on the order view page.
  const [isOpen, setIsOpen] = useState(true);

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
      <div className="pt-6">
        <OrderSummaryProducts
          order={orderData.order}
          orderItems={orderData.orderItems}
        />
      </div>
      <div className="space-y-3">
        <OrderSummaryPromoRows promoCode={orderData.promoCode} />
        <OrderSummaryShippingAndTotal
          order={orderData.order}
          shipment={orderData.shipment}
        />
      </div>
    </FieldsGroupContainer>
  );
}
