"use server";

import { serviceClient } from "@/lib/api";

export async function unsubscribeAction(email: string) {
    try {
        await serviceClient.UnsubscribeNewsletter({
            email: email,
        });
        return { success: true };
    } catch (error) {
        console.error("Error unsubscribing:", error);
        return { success: false };
    }
}

