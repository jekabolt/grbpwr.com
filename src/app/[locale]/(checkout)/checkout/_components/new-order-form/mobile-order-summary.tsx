"use client";

import { useState } from "react";
import {
  common_OrderItem,
  ValidateOrderItemsInsertResponse,
} from "@/api/proto-http/frontend";
import { currencySymbols } from "@/constants";
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
      styling={{
        sign: "plus-minus",
        signPosition: "before",
      }}
      title={`${isOpen ? "hide" : "show"} order summary`}
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
