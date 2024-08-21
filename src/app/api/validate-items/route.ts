import { addCartProduct, clearCartProducts } from "@/actions/cart";
import { serviceClient } from "@/lib/api";
import {
  getCartProductIdAndSizeFromKey,
  getCookieCart,
} from "@/lib/utils/cart";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const cartData = getCookieCart();

    if (!cartData || !cartData.products) {
      return res.status(200).json({ result: [] });
    }

    const items = Object.entries(cartData.products).map(([key, quantity]) => {
      const productIdAndSize = getCartProductIdAndSizeFromKey(key);
      return {
        productId: Number(productIdAndSize?.id),
        sizeId: Number(productIdAndSize?.size),
        quantity,
      };
    });

    const { shipmentCarrierId, promoCode } = req.body;

    const response = await serviceClient.ValidateOrderItemsInsert({
      items,
      shipmentCarrierId,
      promoCode,
    });

    if (response.hasChanged) {
      clearCartProducts();

      response.validItems?.forEach((p) => {
        if (
          p.orderItem?.productId &&
          p.orderItem.quantity &&
          p.orderItem.sizeId
        ) {
          addCartProduct({
            id: p.orderItem.productId,
            size: p.orderItem.sizeId.toString(),
            quantity: p.orderItem.quantity,
          });
        }
      });
    }

    return res.status(200).json({ result: response });
  } catch (error) {
    return res.status(500).json({ error });
  }
}
