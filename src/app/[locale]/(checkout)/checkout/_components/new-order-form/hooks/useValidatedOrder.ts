"use client";

import type { ValidateOrderItemsInsertResponse } from "@/api/proto-http/frontend";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";

import { useDataContext } from "@/components/contexts/DataContext";
import { serviceClient } from "@/lib/api";
import { useCart } from "@/lib/stores/cart/store-provider";

import { useCurrency } from "@/lib/stores/currency/store-provider";
import { CheckoutData } from "../schema";

export function useValidatedOrder(form: UseFormReturn<CheckoutData>) {
  const [validatedOrder, setValidatedOrder] = useState<
    ValidateOrderItemsInsertResponse | undefined
  >(undefined);
  const products = useCart((cart) => cart.products);
  const { dictionary } = useDataContext();
  const { selectedCurrency } = useCurrency((state) => state);
  const currency = selectedCurrency || dictionary?.baseCurrency;

  const validateItems = async (shipmentCarrierId?: string) => {
    const items = products.map((p) => ({
      productId: p.id,
      quantity: p.quantity,
      sizeId: parseInt(p.size),
    }));

    if (!items || items?.length === 0) return null;

    const promoCode = form.getValues("promoCode");
    const carrierId = shipmentCarrierId || form.getValues("shipmentCarrierId");
    const country = form.getValues("country");
    const paymentMethod = form.getValues("paymentMethod");

    console.log("validating products ⌛️");
    const response = await serviceClient.ValidateOrderItemsInsert({
      items,
      promoCode,
      shipmentCarrierId: parseInt(carrierId),
      country,
      paymentMethod,
      currency,
    });
    console.log("finished validating products 🎉");

    if (response.validItems) {
      setValidatedOrder(response);
    }

    return response;
  };

  useEffect(() => {
    if (products.length !== 0 && !validatedOrder) validateItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products]);

  return { order: validatedOrder, validateItems };
}
