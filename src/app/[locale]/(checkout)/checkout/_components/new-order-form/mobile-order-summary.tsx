"use client";

import { useState } from "react";
import {
  common_OrderItem,
  ValidateOrderItemsInsertResponse,
} from "@/api/proto-http/frontend";
import { currencySymbols } from "@/constants";
import { useTranslations } from "next-intl";
import { UseFormReturn } from "react-hook-form";

import { useDataContext } from "@/components/contexts/DataContext";
import { Text } from "@/components/ui/text";

import FieldsGroupContainer from "./fields-group-container";
import { OrderProducts } from "./order-products";
import { PriceSummary } from "./price-summary";

type Props = {
  validatedProducts?: common_OrderItem[];
  form: UseFormReturn<any>;
  order?: ValidateOrderItemsInsertResponse;
  orderCurrency?: string;
};

export function MobileOrderSummary({ form, validatedProducts, order, orderCurrency }: Props) {
  const t = useTranslations("checkout");

  const { dictionary } = useDataContext();

  const [isOpen, setIsOpen] = useState(false);

  const currency = orderCurrency || "EUR";
  const currencySymbol =
    currencySymbols[currency] ||
    currencySymbols[dictionary?.baseCurrency || "EUR"];

  function handleToggle() {
    setIsOpen((prev) => !prev);
  }

  return (
    <FieldsGroupContainer
      signType="plus-minus"
      className="space-y-0 border border-textInactiveColor p-2.5"
      signPosition="before"
      title={`${isOpen ? t("hide") : t("show")} ${t("order summary")}`}
      preview={
        <Text>{`${currencySymbol} ${order?.totalSale?.value || ""}`}</Text>
      }
      isOpen={isOpen}
      onToggle={handleToggle}
    >
      <PriceSummary form={form} order={order} orderCurrency={orderCurrency} />
      <OrderProducts validatedProducts={validatedProducts} currencyKey={orderCurrency} />
    </FieldsGroupContainer>
  );
}
