import type { Stripe, StripeElements } from "@stripe/stripe-js";

export type ConfirmPaymentParams = {
    stripe: Stripe;
    elements: StripeElements;
    clientSecret: string;
    orderUuid: string;
    email: string;
    country: string;
};

export type ConfirmPaymentResult =
    | { success: true; orderUuid: string }
    | { success: false; error: string };

export async function confirmStripePayment({
    stripe,
    elements,
    clientSecret,
    orderUuid,
    email,
    country,
}: ConfirmPaymentParams): Promise<ConfirmPaymentResult> {
    // Validate required parameters
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

    // Submit payment elements
    const { error: submitError } = await elements.submit();

    if (submitError) {
        console.error("Error submitting payment elements:", submitError);
        return { success: false, error: submitError.message || "Failed to submit payment elements" };
    }

    // Confirm payment
    const { error } = await stripe.confirmPayment({
        clientSecret,
        elements,
        confirmParams: {
            return_url: `${window.location.origin}/order/${orderUuid}/${window.btoa(email)}`,
            payment_method_data: {
                billing_details: {
                    address: {
                        country,
                    },
                },
            },
        },
        redirect: "if_required",
    });

    if (error) {
        console.error("Error confirming payment:", error.message);
        return { success: false, error: error.message || "Failed to confirm payment" };
    }

    return { success: true, orderUuid };
}

