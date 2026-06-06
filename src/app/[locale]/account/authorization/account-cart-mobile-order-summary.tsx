"use client";

import { useState } from "react";
import { currencySymbols } from "@/constants";
import { useTranslations } from "next-intl";
import { createPortal } from "react-dom";

import { formatPrice } from "@/lib/currency";
import { useCart } from "@/lib/stores/cart/store-provider";
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
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .map((item) =>
      item.orderItem
        ? {
            ...item,
            orderItem: { ...item.orderItem, quantity: 1 },
          }
        : item,
    );

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
      <div className="pointer-events-auto flex max-h-full min-h-0 w-full flex-col justify-end overflow-hidden">
        <FieldsGroupContainer
          signType="plus-minus"
          className="relative z-40 flex max-h-full min-h-0 flex-col space-y-0 overflow-hidden border border-textInactiveColor p-2.5"
          childrenSpacingClass="flex min-h-0 flex-1 flex-col overflow-hidden space-y-0"
          signPosition="before"
          title={`${isOpen ? t("hide") : t("show")} ${t("order summary")}`}
          isOpen={isOpen}
          onToggle={handleToggle}
        >
          <div className="min-h-0 flex-1 overflow-y-auto pt-6">
            <OrderProducts
              validatedProducts={validatedProducts}
              currencyKey={validatedCurrency}
              disableProductLinks
            />
          </div>
          <div
            className="mt-4 shrink-0 space-y-3 border-t border-textInactiveColor pt-4"
            onClick={() => setIsOpen(false)}
          >
            <div className="flex justify-between">
              <Text variant="uppercase">{t("subtotal")}:</Text>
              <Text>
                {formatPrice(subTotalPrice, currency, currencySymbol)}
              </Text>
            </div>
            <div className="flex justify-between">
              <Text variant="uppercase">{t("grand total")}:</Text>
              <Text>{formatPrice(totalPrice, currency, currencySymbol)}</Text>
            </div>
          </div>
        </FieldsGroupContainer>
      </div>
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
    <AccountSummaryWrapper
      t={t}
      subTotalPrice={subTotalPrice}
      totalPrice={totalPrice}
      currency={currency}
      currencySymbol={currencySymbol}
    >
      <OrderProducts
        validatedProducts={validatedProducts}
        currencyKey={validatedCurrency}
        disableProductLinks
        className="min-h-0"
      />
    </AccountSummaryWrapper>
  );
}

function AccountSummaryWrapper({
  t,
  subTotalPrice,
  totalPrice,
  currency,
  currencySymbol,
  children,
}: {
  t: ReturnType<typeof useTranslations>;
  subTotalPrice: number;
  totalPrice: number;
  currency: string;
  currencySymbol: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-y-8">
      <Text variant="uppercase" className="shrink-0">
        {t("order summary")}
      </Text>
      <div className="shrink-0 space-y-3 border-t border-textInactiveColor pt-4">
        <div className="flex justify-between">
          <Text variant="uppercase">{t("subtotal")}:</Text>
          <Text>{formatPrice(subTotalPrice, currency, currencySymbol)}</Text>
        </div>
        <div className="flex justify-between">
          <Text variant="uppercase">{t("grand total")}:</Text>
          <Text>{formatPrice(totalPrice, currency, currencySymbol)}</Text>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
