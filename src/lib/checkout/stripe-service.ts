import type { Stripe, StripeElements } from "@stripe/stripe-js";

export type StripeBillingDetails = {
    name?: string;
    email?: string;
    phone?: string;
    address?: {
        line1?: string;
        line2?: string;
        city?: string;
        state?: string;
        postal_code?: string;
        country?: string;
    };
};

export type ConfirmPaymentParams = {
    stripe: Stripe;
    elements: StripeElements;
    clientSecret: string;
    orderUuid: string;
    returnUrl: string;
    billingDetails?: StripeBillingDetails;
    /** Set when elements.submit() was already called during the user gesture. */
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
    billingDetails,
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
            ...(billingDetails
                ? { payment_method_data: { billing_details: billingDetails } }
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

