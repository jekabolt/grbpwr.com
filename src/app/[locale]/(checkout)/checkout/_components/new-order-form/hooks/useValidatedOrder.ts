"use client";

import { useEffect, useRef, useState } from "react";
import { UseFormReturn } from "react-hook-form";

import type { ValidateOrderItemsInsertResponse } from "@/api/proto-http/frontend";
import { useDataContext } from "@/components/contexts/DataContext";
import { validateCartItems } from "@/lib/cart/validate-cart-items";
import { useCart } from "@/lib/stores/cart/store-provider";

import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { CheckoutData } from "../schema";

export function useValidatedOrder(form: UseFormReturn<CheckoutData>) {
  const [validatedOrder, setValidatedOrder] = useState<
    ValidateOrderItemsInsertResponse | undefined
  >(undefined);
  const [orderCurrency, setOrderCurrency] = useState<string>("EUR");
  const products = useCart((cart) => cart.products);
  const syncWithValidatedItems = useCart((cart) => cart.syncWithValidatedItems);
  const { dictionary } = useDataContext();
  const { currentCountry } = useTranslationsStore((state) => state);
  const currency = currentCountry.currencyKey || dictionary?.baseCurrency || "EUR";
  const prevCurrencyRef = useRef(currency);
  const initialValidationStartedRef = useRef(false);

  const validateItems = async (shipmentCarrierId?: string) => {
    const promoCode: string = form.getValues("promoCode") || "";
    const carrierId = shipmentCarrierId || form.getValues("shipmentCarrierId") || "";
    const country = form.getValues("country") || currentCountry.countryCode || undefined;
    const paymentMethod =
      form.getValues("paymentMethod") || "PAYMENT_METHOD_NAME_ENUM_CARD_TEST";

    console.log("validating products ⌛️");
    const result = await validateCartItems({
      products,
      currency,
      promoCode,
      shipmentCarrierId: carrierId,
      country,
      paymentMethod,
    });
    console.log("finished validating products 🎉");

    if (!result) return null;

    const { response, hasItemsChanged } = result;
    const normalizedResponse: ValidateOrderItemsInsertResponse = hasItemsChanged
      ? { ...response, hasChanged: true }
      : response;

    if (normalizedResponse.validItems) {
      setValidatedOrder(normalizedResponse);
      setOrderCurrency(currency);
      const maxOrderItems = dictionary?.maxOrderItems || 3;
      syncWithValidatedItems(normalizedResponse, maxOrderItems);
    }

    return normalizedResponse;
  };

  useEffect(() => {
    if (products.length === 0 || validatedOrder || initialValidationStartedRef.current) {
      return;
    }
    initialValidationStartedRef.current = true;
    validateItems();
    // validatedOrder intentionally omitted: only products should re-trigger this gate
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products]);

  useEffect(() => {
    if (prevCurrencyRef.current !== currency && validatedOrder && products.length > 0) {
      validateItems();
    }
    prevCurrencyRef.current = currency;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency]);

  const shipmentCarrierId = form.watch("shipmentCarrierId");
  const country = form.watch("country");
  const lastValidatedParamsRef = useRef<string | null>(null);
  useEffect(() => {
    const paramsKey = `${shipmentCarrierId}:${country}`;
    if (
      validatedOrder &&
      products.length > 0 &&
      shipmentCarrierId &&
      country &&
      lastValidatedParamsRef.current !== paramsKey
    ) {
      lastValidatedParamsRef.current = paramsKey;
      validateItems(shipmentCarrierId);
    }
  }, [shipmentCarrierId, country, validatedOrder]);

  return { order: validatedOrder, validateItems, orderCurrency };
}
