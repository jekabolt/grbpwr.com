"use server";

import { serviceClient } from "@/lib/api";
import { getErrorMessage } from "@/lib/error-message";

export async function unsubscribeAction(email: string) {
    try {
        await serviceClient.UnsubscribeNewsletter({
            email: email,
        });
        return { success: true as const };
    } catch (error) {
        console.error("Error unsubscribing:", error);
        return {
            success: false as const,
            error: getErrorMessage(error, "Failed to unsubscribe"),
        };
    }
}
