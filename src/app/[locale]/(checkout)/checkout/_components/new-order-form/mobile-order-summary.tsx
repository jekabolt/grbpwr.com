"use client";

import { useState } from "react";
import {
  common_OrderItem,
  ValidateOrderItemsInsertResponse,
} from "@/api/proto-http/frontend";
import { currencySymbols } from "@/constants";
import { useTranslations } from "next-intl";
import { UseFormReturn } from "react-hook-form";

import { formatPrice } from "@/lib/currency";
import { cn } from "@/lib/utils";
import { useDataContext } from "@/components/contexts/DataContext";
import { Overlay } from "@/components/ui/overlay";
import { Text } from "@/components/ui/text";

import FieldsGroupContainer from "./fields-group-container";
import { OrderProducts } from "./order-products";
import { PriceSummary } from "./price-summary";

type Props = {
  validatedProducts?: common_OrderItem[];
  form: UseFormReturn<any>;
  order?: ValidateOrderItemsInsertResponse;
  orderCurrency?: string;
  disabled?: boolean;
  showCheckoutFields?: boolean;
  overlay?: boolean;
};

export function MobileOrderSummary({
  form,
  validatedProducts,
  order,
  orderCurrency,
  disabled = false,
  overlay = false,
}: Props) {
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
    <>
      <Overlay
        cover="screen"
        trigger="active"
        color="dark"
        active={overlay && !!isOpen}
        onClick={handleToggle}
      />
      <FieldsGroupContainer
        signType="plus-minus"
        className={cn(
          "relative z-40 space-y-0 border border-textInactiveColor p-2.5",
          {
            "text-textInactiveColor": disabled,
          },
        )}
        signPosition="before"
        title={`${isOpen ? t("hide") : t("show")} ${t("order summary")}`}
        preview={
          <Text
            className={cn({
              "text-textInactiveColor": disabled,
            })}
          >
            {formatPrice(
              order?.totalSale?.value || "0",
              currency,
              currencySymbol,
            )}
          </Text>
        }
        isOpen={isOpen}
        disabled={disabled}
        onToggle={handleToggle}
      >
        <div className="pt-6">
          <OrderProducts
            validatedProducts={validatedProducts}
            currencyKey={orderCurrency}
            disabled={disabled}
            disableProductLinks
          />
        </div>
        <div onClick={() => setIsOpen(false)}>
          <PriceSummary
            form={form}
            order={order}
            orderCurrency={orderCurrency}
          />
        </div>
      </FieldsGroupContainer>
    </>
  );
}
