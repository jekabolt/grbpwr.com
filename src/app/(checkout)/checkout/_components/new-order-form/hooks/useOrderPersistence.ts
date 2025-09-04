import { useCheckoutStore } from "@/lib/stores/checkout/store-provider";
import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { CheckoutData, defaultData } from "../schema";

export const useOrderPersistence = (form: UseFormReturn<CheckoutData>) => {
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
        if (rehydrated && hasPersistedData && Object.keys(formData).length > 0) {
            setTimeout(() => {
                form.reset({
                    ...defaultData,
                    ...formData,
                });
            }, 0);
        }
    }, [rehydrated]);

    return {
        clearFormData,
    }
};
