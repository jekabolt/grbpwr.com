import type { CheckoutData } from "@/app/[locale]/(checkout)/checkout/_components/new-order-form/schema";

export interface CheckoutState {
    formData: Partial<CheckoutData>;
    hasPersistedData: boolean;
    rehydrated: boolean;
    isSubmitting: boolean;
}

export interface CheckoutActions {
    updateFormData: (data: Partial<CheckoutData>) => void;
    clearFormData: () => void;
    resetStore: () => void;
    setIsSubmitting: (value: boolean) => void;
}

export type CheckoutStore = CheckoutState & CheckoutActions; 
