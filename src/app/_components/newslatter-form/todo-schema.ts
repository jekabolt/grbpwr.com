'use server'

import { serviceClient } from "@/lib/api";

export async function formSubmitClick(data: FormData): Promise<void> {
    try {
        const payload: { email: string; name: string } = {
            email: data.get("email") as string,
            name: "no field for name",
        };
        await serviceClient.SubscribeNewsletter(payload);
    } catch (error) {
        throw error;
    }
}