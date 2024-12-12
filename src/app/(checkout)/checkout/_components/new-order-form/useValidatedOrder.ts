"use client";

import { useEffect, useState } from "react";
import type { ValidateOrderItemsInsertResponse } from "@/api/proto-http/frontend";
import { UseFormReturn } from "react-hook-form";

import { serviceClient } from "@/lib/api";
import { useCart } from "@/lib/stores/cart/store-provider";

import { CheckoutData } from "./schema";

export function useValidatedOrder(form: UseFormReturn<CheckoutData>) {
  const [validatedOrder, setValidatedOrder] = useState<
    ValidateOrderItemsInsertResponse | undefined
  >(undefined);
  const products = useCart((cart) => cart.products);

  console.log(products);

  const validateItems = async () => {
    const items = products.map((p) => ({
      productId: p.id,
      quantity: p.quantity,
      sizeId: parseInt(p.size),
    }));

    if (!items || items?.length === 0) return null;

    const promoCode = form.getValues("promoCode");
    const shipmentCarrierId = form.getValues("shipmentCarrierId");

    console.log("validating products ⌛️");
    const response = await serviceClient.ValidateOrderItemsInsert({
      items,
      promoCode,
      shipmentCarrierId: parseInt(shipmentCarrierId),
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
