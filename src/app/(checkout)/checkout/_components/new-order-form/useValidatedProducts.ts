"use client";

import { useEffect, useState } from "react";
import type { common_OrderItem } from "@/api/proto-http/frontend";
import { UseFormReturn } from "react-hook-form";

import { serviceClient } from "@/lib/api";
import { useCart } from "@/lib/stores/cart/store-provider";

import { CheckoutData } from "./schema";

export function useValidatedProducts(form: UseFormReturn<CheckoutData>) {
  const [validatedProducts, setValidatedProducts] = useState<
    common_OrderItem[] | undefined
  >(undefined);
  const products = useCart((cart) => cart.products);

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
      setValidatedProducts(response.validItems);
    }

    return response;
  };

  useEffect(() => {
    validateItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { products: validatedProducts, validateItems };
}
