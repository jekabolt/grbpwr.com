import type { common_OrderNew } from "@/api/proto-http/frontend";
import { serviceClient } from "@/lib/api";
import {
    GA4_MEASUREMENT_ID,
    ensureGtag,
    normalizeGtagClientIdField,
    readGa4ClientIdFromDocumentCookie,
    readStoredGa4ClientId,
    writeStoredGa4ClientId,
} from "@/lib/analitycs/utils";

export type SubmitOrderResult =
    | { ok: true; order: Awaited<ReturnType<typeof serviceClient.SubmitOrder>> }
    | { ok: false };

const GA4_CLIENT_ID_GET_MS = 4000;

function getGA4ClientId(): Promise<string | undefined> {
    const cached = readStoredGa4ClientId();
    if (cached) return Promise.resolve(cached);

    return new Promise((resolve) => {
        if (typeof window === "undefined") {
            resolve(undefined);
            return;
        }
        ensureGtag();

        const settle = (gtagValue: string | undefined) => {
            const fromCookie = readGa4ClientIdFromDocumentCookie();
            const best = gtagValue || fromCookie;
            if (best) writeStoredGa4ClientId(best);
            resolve(best);
        };

        const timeout = setTimeout(() => settle(undefined), GA4_CLIENT_ID_GET_MS);
        try {
            window.gtag!("get", GA4_MEASUREMENT_ID, "client_id", (raw: unknown) => {
                clearTimeout(timeout);
                settle(normalizeGtagClientIdField(raw));
            });
        } catch {
            clearTimeout(timeout);
            settle(undefined);
        }
    });
}

export async function submitNewOrder(
    newOrderData: common_OrderNew,
    paymentIntentId: string,
): Promise<SubmitOrderResult> {
    console.log("order data: ", {
        order: newOrderData,
    });

    try {
        const gaClientId = await getGA4ClientId();

        const submitOrderResponse = await serviceClient.SubmitOrder({
            order: newOrderData,
            paymentIntentId: paymentIntentId,
            gaClientId: gaClientId,
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
