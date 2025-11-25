"use client";

import { useState } from "react";
import {
  common_OrderItem,
  ValidateOrderItemsInsertResponse,
} from "@/api/proto-http/frontend";
import { currencySymbols } from "@/constants";
import { useTranslations } from "next-intl";
import { UseFormReturn } from "react-hook-form";

import { useCurrency } from "@/lib/stores/currency/store-provider";
import { useDataContext } from "@/components/contexts/DataContext";
import { Text } from "@/components/ui/text";

import FieldsGroupContainer from "./fields-group-container";
import { OrderProducts } from "./order-products";
import { PriceSummary } from "./price-summary";

type Props = {
  validatedProducts?: common_OrderItem[];
  form: UseFormReturn<any>;
  order?: ValidateOrderItemsInsertResponse;
};

export function MobileOrderSummary({ form, validatedProducts, order }: Props) {
  const t = useTranslations("checkout");

  const { dictionary } = useDataContext();
  const { selectedCurrency } = useCurrency((state) => state);

  const [isOpen, setIsOpen] = useState(false);

  const currencySymbol =
    currencySymbols[selectedCurrency] ||
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
      <PriceSummary form={form} order={order} />
      <OrderProducts validatedProducts={validatedProducts} />
    </FieldsGroupContainer>
  );
}
