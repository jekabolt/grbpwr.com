"use client";

import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";

import type { ValidateOrderItemsInsertResponse } from "@/api/proto-http/frontend";
import { useDataContext } from "@/components/contexts/DataContext";
import { validateCartItems } from "@/lib/cart/validate-cart-items";
import { useCart } from "@/lib/stores/cart/store-provider";

import { useCurrency } from "@/lib/stores/currency/store-provider";
import { CheckoutData } from "../schema";

export function useValidatedOrder(form: UseFormReturn<CheckoutData>) {
  const [validatedOrder, setValidatedOrder] = useState<
    ValidateOrderItemsInsertResponse | undefined
  >(undefined);
  const products = useCart((cart) => cart.products);
  const syncWithValidatedItems = useCart((cart) => cart.syncWithValidatedItems);
  const { dictionary } = useDataContext();
  const { selectedCurrency } = useCurrency((state) => state);
  const currency = selectedCurrency || dictionary?.baseCurrency || "EUR";

  const validateItems = async (shipmentCarrierId?: string) => {
    const promoCode: string = form.getValues("promoCode") || "";
    const carrierId = shipmentCarrierId || form.getValues("shipmentCarrierId") || "";
    const country = form.getValues("country") || undefined;
    const paymentMethod = form.getValues("paymentMethod") || undefined;

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
      syncWithValidatedItems(normalizedResponse);
    }

    return normalizedResponse;
  };

  useEffect(() => {
    if (products.length !== 0 && !validatedOrder) validateItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products]);

  return { order: validatedOrder, validateItems };
}
