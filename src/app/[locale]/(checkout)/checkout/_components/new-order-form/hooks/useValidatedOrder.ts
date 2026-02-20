"use client";

import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";

import type { ValidateOrderItemsInsertResponse } from "@/api/proto-http/frontend";
import { useDataContext } from "@/components/contexts/DataContext";
import { validateCartItems } from "@/lib/cart/validate-cart-items";
import { useCart } from "@/lib/stores/cart/store-provider";

import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import {
  hasCheckoutInitialValidationRun,
  setCheckoutInitialValidationDone,
} from "@/lib/checkout/checkout-validation-state";
import { CheckoutData } from "../schema";

export function useValidatedOrder(form: UseFormReturn<CheckoutData>) {
  const [validatedOrder, setValidatedOrder] = useState<
    ValidateOrderItemsInsertResponse | undefined
  >(undefined);
  const products = useCart((cart) => cart.products);
  const syncWithValidatedItems = useCart((cart) => cart.syncWithValidatedItems);
  const { dictionary } = useDataContext();
  const { currentCountry } = useTranslationsStore((state) => state);
  const currency = currentCountry.currencyKey || dictionary?.baseCurrency || "EUR";

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
      // Sync cart with validated items (remove invalid/unavailable items)
      const maxOrderItems = dictionary?.maxOrderItems || 3;
      syncWithValidatedItems(normalizedResponse, maxOrderItems);
    }

    return normalizedResponse;
  };

  useEffect(() => {
    if (
      products.length !== 0 &&
      !validatedOrder &&
      !hasCheckoutInitialValidationRun()
    ) {
      setCheckoutInitialValidationDone();
      validateItems();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products]);

  return { order: validatedOrder, validateItems };
}
