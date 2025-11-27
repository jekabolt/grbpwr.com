import type {
    ValidateOrderItemsInsertResponse,
    common_OrderItemInsert,
    common_PaymentMethodNameEnum,
} from "@/api/proto-http/frontend";

import { serviceClient } from "@/lib/api";
import type { CartProduct } from "@/lib/stores/cart/store-types";

export type CartValidationParams = {
    products: CartProduct[];
    currency: string;
    promoCode?: string;
    shipmentCarrierId?: string | number | undefined;
    country?: string | undefined;
    paymentMethod?: common_PaymentMethodNameEnum | undefined;
};

export type CartValidationResult = {
    response: ValidateOrderItemsInsertResponse;
    hasItemsChanged: boolean;
};

export async function validateCartItems({
    products,
    currency,
    promoCode,
    shipmentCarrierId,
    country,
    paymentMethod,
}: CartValidationParams): Promise<CartValidationResult | null> {
    const items: common_OrderItemInsert[] = products.map((p) => ({
        productId: p.id,
        quantity: p.quantity,
        sizeId: Number(p.size),
    }));

    if (!items.length) return null;

    const response = await serviceClient.ValidateOrderItemsInsert({
        items,
        promoCode: promoCode ?? undefined,
        shipmentCarrierId:
            shipmentCarrierId !== undefined
                ? Number(shipmentCarrierId)
                : undefined,
        country,
        paymentMethod,
        currency,
    });

    const requestedQuantity = items.reduce(
        (sum, item) => sum + (item.quantity || 0),
        0,
    );
    const validatedQuantity = (response.validItems || []).reduce(
        (sum, validItem) => sum + (validItem.orderItem?.quantity || 0),
        0,
    );

    const hasItemsChanged = validatedQuantity !== requestedQuantity;

    return { response, hasItemsChanged };
}


