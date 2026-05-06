"use client";

import { useState } from "react";
import { currencySymbols } from "@/constants";
import { useTranslations } from "next-intl";

import { formatPrice } from "@/lib/currency";
import { useCart } from "@/lib/stores/cart/store-provider";
import { cn } from "@/lib/utils";
import { useDataContext } from "@/components/contexts/DataContext";
import { Overlay } from "@/components/ui/overlay";
import { Text } from "@/components/ui/text";
import FieldsGroupContainer from "@/app/[locale]/(checkout)/checkout/_components/new-order-form/fields-group-container";
import { OrderProducts } from "@/app/[locale]/(checkout)/checkout/_components/new-order-form/order-products";

function useAccountCartSummaryData() {
  const t = useTranslations("checkout");
  const { dictionary } = useDataContext();
  const { products, validatedCurrency, subTotalPrice, totalPrice } = useCart(
    (state) => state,
  );

  const validatedProducts = products
    .map((product) => product.productData)
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const currency = validatedCurrency || "EUR";
  const currencySymbol =
    currencySymbols[currency] ||
    currencySymbols[dictionary?.baseCurrency || "EUR"];

  return {
    t,
    validatedProducts,
    validatedCurrency,
    subTotalPrice,
    totalPrice,
    currency,
    currencySymbol,
  };
}

export function AccountCartMobileOrderSummary() {
  const {
    t,
    validatedProducts,
    validatedCurrency,
    subTotalPrice,
    totalPrice,
    currency,
    currencySymbol,
  } = useAccountCartSummaryData();
  const [isOpen, setIsOpen] = useState(false);

  if (!validatedProducts.length) return null;

  function handleToggle() {
    setIsOpen((prev) => !prev);
  }

  return (
    <>
      <Overlay
        cover="screen"
        trigger="active"
        color="dark"
        active={isOpen}
        disablePointerEvents={false}
        onClick={handleToggle}
      />
      <FieldsGroupContainer
        signType="plus-minus"
        className="relative z-40 space-y-0 border border-textInactiveColor p-2.5"
        signPosition="before"
        title={`${isOpen ? t("hide") : t("show")} ${t("order summary")}`}
        isOpen={isOpen}
        onToggle={handleToggle}
      >
        <div className="pt-6">
          <OrderProducts
            validatedProducts={validatedProducts}
            currencyKey={validatedCurrency}
            disableProductLinks
          />
        </div>
        <div
          className={cn(
            "mt-4 space-y-3 border-t border-textInactiveColor pt-4",
          )}
          onClick={() => setIsOpen(false)}
        >
          <div className="flex justify-between">
            <Text variant="uppercase">{t("subtotal")}:</Text>
            <Text>{formatPrice(subTotalPrice, currency, currencySymbol)}</Text>
          </div>
          <div className="flex justify-between">
            <Text variant="uppercase">{t("grand total")}:</Text>
            <Text>{formatPrice(totalPrice, currency, currencySymbol)}</Text>
          </div>
        </div>
      </FieldsGroupContainer>
    </>
  );
}

export function AccountCartDesktopOrderSummary() {
  const {
    t,
    validatedProducts,
    validatedCurrency,
    subTotalPrice,
    totalPrice,
    currency,
    currencySymbol,
  } = useAccountCartSummaryData();

  if (!validatedProducts.length) return null;

  return (
    <div className="space-y-8">
      <Text variant="uppercase">{t("order summary")}</Text>
      <OrderProducts
        validatedProducts={validatedProducts}
        currencyKey={validatedCurrency}
        disableProductLinks
      />
      <div className="space-y-3 border-t border-textInactiveColor pt-4">
        <div className="flex justify-between">
          <Text variant="uppercase">{t("subtotal")}:</Text>
          <Text>{formatPrice(subTotalPrice, currency, currencySymbol)}</Text>
        </div>
        <div className="flex justify-between">
          <Text variant="uppercase">{t("grand total")}:</Text>
          <Text>{formatPrice(totalPrice, currency, currencySymbol)}</Text>
        </div>
      </div>
    </div>
  );
}
