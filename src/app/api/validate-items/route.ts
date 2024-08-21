import { addCartProduct, clearCartProducts } from "@/actions/cart";
import { serviceClient } from "@/lib/api";
import {
  getCartProductIdAndSizeFromKey,
  getCookieCart,
} from "@/lib/utils/cart";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    const cartData = getCookieCart();

    console.log(cartData);
    if (!cartData || !cartData.products) {
      return NextResponse.json({ result: [] }, { status: 200 });
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

    console.log(response);
    return NextResponse.json({ result: response }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
