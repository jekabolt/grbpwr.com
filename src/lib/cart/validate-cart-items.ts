import type {
    ValidateOrderItemsInsertResponse,
    common_OrderItemInsert,
    common_PaymentMethodNameEnum,
} from "@/api/proto-http/frontend";

import { serviceClient } from "@/lib/api";
import {
    clearIdempotencyKey,
    getStoredIdempotencyKey,
    setIdempotencyKey,
} from "@/lib/checkout/idempotency-key";
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

const PAYMENT_ALREADY_COMPLETED_MESSAGE =
    "Payment already completed for this session";
const PAYMENT_UNAVAILABLE_MESSAGES = [
    "payment unavailable",
    "failed to create payment intent",
];

export function getValidationErrorToastKey(error: unknown): string {
    const message =
        error instanceof Error ? error.message : String(error ?? "");
    if (message.includes(PAYMENT_ALREADY_COMPLETED_MESSAGE)) {
        return "payment_already_completed";
    }
    if (
        PAYMENT_UNAVAILABLE_MESSAGES.some((m) =>
            message.toLowerCase().includes(m),
        )
    ) {
        return "payment_unavailable";
    }
    return "validation_error";
}

function isPaymentAlreadyCompletedError(error: unknown): boolean {
    const message =
        error instanceof Error ? error.message : String(error ?? "");
    return message.includes(PAYMENT_ALREADY_COMPLETED_MESSAGE);
}

function isCardPaymentMethod(
    method: common_PaymentMethodNameEnum | undefined,
): boolean {
    return (
        method === "PAYMENT_METHOD_NAME_ENUM_CARD" ||
        method === "PAYMENT_METHOD_NAME_ENUM_CARD_TEST"
    );
}

async function callValidateOrderItemsInsert(
    params: {
        items: common_OrderItemInsert[];
        promoCode?: string;
        shipmentCarrierId?: number;
        country?: string;
        paymentMethod?: common_PaymentMethodNameEnum;
        currency: string;
        idempotencyKey?: string;
    },
): Promise<ValidateOrderItemsInsertResponse> {
    const request: Parameters<typeof serviceClient.ValidateOrderItemsInsert>[0] =
        {
            items: params.items,
            promoCode: params.promoCode,
            shipmentCarrierId: params.shipmentCarrierId,
            country: params.country,
            paymentMethod: params.paymentMethod,
            currency: params.currency,
            idempotencyKey: params.idempotencyKey,
        };
    return serviceClient.ValidateOrderItemsInsert(request);
}

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

    const requestParams = {
        items,
        promoCode: promoCode ?? undefined,
        shipmentCarrierId:
            shipmentCarrierId !== undefined
                ? Number(shipmentCarrierId)
                : undefined,
        country,
        paymentMethod,
        currency,
    };

    const tryValidate = async (
        idempotencyKey?: string,
    ): Promise<CartValidationResult> => {
        const response = await callValidateOrderItemsInsert({
            ...requestParams,
            idempotencyKey,
        });

        // Only store idempotency key when we sent full checkout params (country, currency, payment_method)
        const hasCheckoutParams =
            country &&
            currency &&
            isCardPaymentMethod(paymentMethod);
        if (hasCheckoutParams && response.idempotencyKey) {
            setIdempotencyKey(response.idempotencyKey);
        }

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
    };

    const storedKey = getStoredIdempotencyKey();

    try {
        return await tryValidate(storedKey ?? undefined);
    } catch (error) {
        if (
            isPaymentAlreadyCompletedError(error) &&
            storedKey !== null &&
            storedKey !== undefined
        ) {
            clearIdempotencyKey();
            try {
                return await tryValidate(undefined);
            } catch (retryError) {
                throw retryError;
            }
        }
        throw error;
    }
}
