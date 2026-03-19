import { useCheckoutStore } from "@/lib/stores/checkout/store-provider";
import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { CheckoutData, defaultData } from "../schema";

export const useOrderPersistence = (
    form: UseFormReturn<CheckoutData>,
    currentCountryCode?: string,
) => {
    const {
        formData,
        hasPersistedData,
        rehydrated,
        updateFormData,
        clearFormData,
    } = useCheckoutStore((state) => state);

    useEffect(() => {
        const subscription = form.watch((value) => {
            updateFormData(value as Partial<CheckoutData>);
        });
        return () => subscription.unsubscribe();
    }, [form.watch, updateFormData]);

    useEffect(() => {
        if (!rehydrated) return;
        const hasStash =
            typeof sessionStorage !== "undefined" &&
            sessionStorage.getItem("checkout-country-change-stash");
        const hasFormData =
            hasPersistedData && Object.keys(formData).length > 0;
        if (!hasStash && !hasFormData) return;

        setTimeout(() => {
            let data = {
                ...defaultData,
                ...formData,
                ...(currentCountryCode && { country: currentCountryCode }),
            };
            try {
                const stash = sessionStorage.getItem("checkout-country-change-stash");
                if (stash) {
                    const { email, promoCode } = JSON.parse(stash);
                    data = {
                        ...data,
                        email: email ?? data.email,
                        promoCode: promoCode ?? data.promoCode,
                    };
                    sessionStorage.removeItem("checkout-country-change-stash");
                }
            } catch {
            }
            form.reset(data);
        }, 0);
    }, [rehydrated]);

    return {
        clearFormData,
    }
};
