import { respondWithAccountSession } from "./account-responses";
import { executeWithAccountSession } from "./session-executor";

export function listMyOrdersResponse(limit: number, offset: number) {
    return respondWithAccountSession(
        () => executeWithAccountSession((client) => client.ListMyOrders({ limit, offset })),
        {
            clearCookiesOnAuthFailure: true,
            badRequestFallback: "list my orders failed",
        },
    );
}