"use server";

import { serviceClient } from "@/lib/api";

export async function unsubscribeAction(email: string) {
    try {
        await serviceClient.UnsubscribeNewsletter({
            email: email,
            // All three false → unsubscribe from every channel (preserves the
            // previous "unsubscribe from everything" behaviour of this link).
            subscribeNewsletter: false,
            subscribeNewArrivals: false,
            subscribeEvents: false,
        });
        return { success: true as const };
    } catch (error) {
        console.error("Error unsubscribing:", error);
        return { success: false as const };
    }
}
