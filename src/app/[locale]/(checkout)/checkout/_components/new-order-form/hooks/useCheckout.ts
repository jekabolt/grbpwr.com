// hooks/useCheckoutEffects.ts
import { LANGUAGE_ID_TO_LOCALE } from "@/constants";
import { useCheckoutStore } from "@/lib/stores/checkout/store-provider";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface UseCheckoutEffectsProps {
    order: any;
    products: any[];
    loading: boolean;
    form: any;
    countryCode: string;
    onAmountChange: (amount: number) => void;
    handleFormChange: (name?: string) => void;
}

export const useCheckoutEffects = ({
    order,
    products,
    loading,
    form,
    countryCode,
    onAmountChange,
    handleFormChange,
}: UseCheckoutEffectsProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const lastValidatedCountRef = useRef<number | null>(null);
    const previousCountryRef = useRef<string | null>(null);
    const [orderModifiedToastOpen, setOrderModifiedToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState("cart outdated");
    const { rehydrated, clearFormData } = useCheckoutStore((state) => state);
    const { currentCountry, languageId } = useTranslationsStore((state) => state);

    useEffect(() => {
        if (loading) return;

        const shouldRedirect =
            products.length === 0 ||
            (order?.validItems?.length === 0 && lastValidatedCountRef.current !== null);

        if (shouldRedirect) {
            // Don't redirect if we're already on the checkout page
            // User should stay on checkout page even after country change (cart cleared)
            const isOnCheckoutPage = pathname?.includes("/checkout");

            if (!isOnCheckoutPage) {
                setToastMessage("cart outdated");
                setOrderModifiedToastOpen(true);
                setTimeout(() => {
                    // Redirect to home page with current country/locale to preserve the selected country
                    const locale = LANGUAGE_ID_TO_LOCALE[languageId] || "en";
                    const country = currentCountry.countryCode?.toLowerCase() || "us";
                    router.push(`/${country}/${locale}`);
                }, 2000);
            }
            return;
        }

        if (!order?.validItems) return;

        const currentCount = order.validItems.reduce(
            (sum: number, item: any) => sum + (item.orderItem?.quantity || 0),
            0
        );

        if (
            lastValidatedCountRef.current !== null &&
            currentCount !== lastValidatedCountRef.current
        ) {
            setToastMessage("your order has been modified");
            setOrderModifiedToastOpen(true);
        }

        lastValidatedCountRef.current = currentCount;
    }, [order?.validItems, products.length, router, loading]);

    useEffect(() => {
        if (order?.totalSale?.value) {
            onAmountChange(Math.round(parseFloat(order.totalSale.value)));
        }
    }, [order?.totalSale?.value, onAmountChange]);

    // Initialize country from store only on mount, don't update when store changes
    // This prevents geo-suggest banner from changing the form before user accepts
    const countryInitializedRef = useRef(false);
    const skipCountryWatchRef = useRef(false);
    useEffect(() => {
        if (!countryInitializedRef.current && countryCode) {
            const currentFormCountry = form.getValues("country");
            // Update country if form doesn't have one, or if it differs from store (e.g., after geo-suggest accept)
            // This ensures the form country matches the store after page reload
            // Use shouldValidate: false to avoid showing errors on untouched fields (e.g. empty email) on fresh load
            if (!currentFormCountry || currentFormCountry !== countryCode) {
                skipCountryWatchRef.current = true;
                form.setValue("country", countryCode, { shouldValidate: false });
            }
            countryInitializedRef.current = true;
        }
    }, [countryCode, form]);

    // Also update country after form persistence is restored, in case persisted data had old country
    // This ensures country is synced with store even if useOrderPersistence restores old data
    // Use shouldValidate: false to avoid showing errors on untouched fields on rehydration
    useEffect(() => {
        if (rehydrated && countryCode) {
            const formCountry = form.getValues("country");
            if (formCountry !== countryCode) {
                skipCountryWatchRef.current = true;
                form.setValue("country", countryCode, { shouldValidate: false });
            }
        }
    }, [rehydrated, countryCode, form]);

    // Clear form storage when country changes (after initial mount)
    useEffect(() => {
        if (!countryCode) return;

        // On initial mount, just store the current country
        if (previousCountryRef.current === null) {
            previousCountryRef.current = countryCode;
            return;
        }

        // If country changed, clear form storage
        if (previousCountryRef.current !== countryCode) {
            clearFormData();
            previousCountryRef.current = countryCode;
        }
    }, [countryCode, clearFormData]);

    useEffect(() => {
        const subscription = form.watch((_: any, { name }: { name?: string }) => {
            // Skip handleFormChange when country was just set by initial sync/rehydration.
            // handleFormChange calls form.trigger() which validates the whole form and would
            // show errors (e.g. invalid email) on untouched fields after cache clear.
            if (name === "country" && skipCountryWatchRef.current) {
                skipCountryWatchRef.current = false;
                return;
            }
            handleFormChange(name);
        });
        return () => subscription.unsubscribe();
    }, [form, handleFormChange]);

    return {
        orderModifiedToastOpen,
        toastMessage,
        setOrderModifiedToastOpen,
        setToastMessage,
    };
};
