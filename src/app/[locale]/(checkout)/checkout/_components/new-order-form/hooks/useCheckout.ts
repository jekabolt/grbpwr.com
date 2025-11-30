// hooks/useCheckoutEffects.ts
import { useRouter } from "next/navigation";
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
    const lastValidatedCountRef = useRef<number | null>(null);
    const [orderModifiedToastOpen, setOrderModifiedToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState("cart outdated");

    useEffect(() => {
        if (loading) return;

        const shouldRedirect =
            products.length === 0 ||
            (order?.validItems?.length === 0 && lastValidatedCountRef.current !== null);

        if (shouldRedirect) {
            setToastMessage("cart outdated");
            setOrderModifiedToastOpen(true);
            setTimeout(() => router.push("/"), 2000);
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

    useEffect(() => {
        if (countryCode && !form.getValues("country")) {
            form.setValue("country", countryCode, { shouldValidate: true });
        }
    }, [countryCode, form]);

    useEffect(() => {
        const subscription = form.watch((_: any, { name }: { name?: string }) => {
            handleFormChange(name);
        });
        return () => subscription.unsubscribe();
    }, [form, handleFormChange]);

    return {
        orderModifiedToastOpen,
        toastMessage,
        setOrderModifiedToastOpen,
    };
};
