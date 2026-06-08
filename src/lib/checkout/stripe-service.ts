import type { Stripe, StripeElements } from "@stripe/stripe-js";

export type ConfirmPaymentParams = {
    stripe: Stripe;
    elements: StripeElements;
    clientSecret: string;
    orderUuid: string;
    returnUrl: string;
    billingCountry?: string;
    elementsSubmitted?: boolean;
};

export type ConfirmPaymentResult =
    | { success: true; orderUuid: string }
    | { success: false; error: string };

export async function confirmStripePayment({
    stripe,
    elements,
    clientSecret,
    orderUuid,
    returnUrl,
    billingCountry,
    elementsSubmitted = false,
}: ConfirmPaymentParams): Promise<ConfirmPaymentResult> {
    if (
        !clientSecret ||
        typeof clientSecret !== "string" ||
        clientSecret.trim() === "" ||
        !orderUuid
    ) {
        const errorMessage = "Missing clientSecret or orderUuid";
        console.error(errorMessage, {
            clientSecret,
            orderUuid,
        });
        return { success: false, error: errorMessage };
    }

    if (!elementsSubmitted) {
        const { error: submitError } = await elements.submit();

        if (submitError) {
            console.error("Error submitting payment elements:", submitError);
            return {
                success: false,
                error: submitError.message || "Failed to submit payment elements",
            };
        }
    }

    const { error } = await stripe.confirmPayment({
        clientSecret,
        elements,
        confirmParams: {
            return_url: returnUrl,
            // Country is hidden in the Payment Element (we collect it in shipping).
            // Pass only country here — full billing_details overrides Apple Pay wallet data.
            ...(billingCountry
                ? {
                    payment_method_data: {
                        billing_details: {
                            address: { country: billingCountry },
                        },
                    },
                }
                : {}),
        },
        redirect: "if_required",
    });

    if (error) {
        console.error("Error confirming payment:", error.message);
        return { success: false, error: error.message || "Failed to confirm payment" };
    }

    return { success: true, orderUuid };
}

