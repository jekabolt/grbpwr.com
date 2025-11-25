import type { common_OrderNew } from "@/api/proto-http/frontend";
import { serviceClient } from "@/lib/api";

export type SubmitOrderResult =
    | { ok: true; order: Awaited<ReturnType<typeof serviceClient.SubmitOrder>> }
    | { ok: false };

export async function submitNewOrder(
    newOrderData: common_OrderNew,
    paymentIntentId: string,
): Promise<SubmitOrderResult> {
    console.log("order data: ", {
        order: newOrderData,
    });

    try {
        const submitOrderResponse = await serviceClient.SubmitOrder({
            order: newOrderData,
            paymentIntentId: paymentIntentId,
        });

        if (!submitOrderResponse?.orderUuid) {
            console.log("no data to create order invoice");

            return {
                ok: false,
            };
        }

        console.log({
            ok: true,
            order: submitOrderResponse,
        });

        return {
            ok: true,
            order: submitOrderResponse,
        };
    } catch (error) {
        console.error("Error submitting new order:", error);
        return {
            ok: false,
        };
    }
}

