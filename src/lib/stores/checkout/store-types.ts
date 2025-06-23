import type { CheckoutData } from "@/app/(checkout)/checkout/_components/new-order-form/schema";

export interface CheckoutState {
    formData: Partial<CheckoutData>;
    hasPersistedData: boolean;
    rehydrated: boolean;
}

export interface CheckoutActions {
    updateFormData: (data: Partial<CheckoutData>) => void;
    clearFormData: () => void;
    resetStore: () => void;
}

export type CheckoutStore = CheckoutState & CheckoutActions; 
