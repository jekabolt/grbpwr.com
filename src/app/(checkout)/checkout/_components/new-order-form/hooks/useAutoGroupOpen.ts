'use client'

import { useCheckoutStore } from "@/lib/stores/checkout/store-provider";
import { useEffect, useRef, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { CheckoutData, checkoutSchema } from "../schema";
import { GROUP_FIELDS, OpenGroups } from "./constants";

const groupOrder: OpenGroups[] = ["contact", "shipping", "payment"];

export function useAutoGroupOpen(form: UseFormReturn<CheckoutData>) {
    const [openGroup, setOpenGroup] = useState<OpenGroups>("contact");
    const { rehydrated, hasPersistedData } = useCheckoutStore((state) => state);
    const prevComplete = useRef<Record<OpenGroups, boolean>>({
        contact: false,
        shipping: false,
        payment: false,
    });
    const emailTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    function isGroupComplete(group: OpenGroups) {
        const fields = GROUP_FIELDS[group];

        return fields.every((field) => {
            const { error, invalid } = form.getFieldState(field);
            const value = form.getValues(field);
            const hasError = error || invalid;
            if (value === '' || value == null) return false;
            if (typeof value === 'boolean') {
                return field === 'termsOfService' ? value && !hasError : !hasError;
            }
            if (field === 'email') {
                return checkoutSchema.shape.email.safeParse(value).success && !hasError;
            }
            return !hasError;
        });
    };

    function isGroupDisabled(group: OpenGroups) {
        const id = groupOrder.indexOf(group);
        if (id === 0) return false;
        return groupOrder.slice(0, id).some((g) => !isGroupComplete(g));
    }

    useEffect(() => {
        if (rehydrated && hasPersistedData) {
            setTimeout(() => {
                const firstIncompleteGroup = groupOrder.find(group => !isGroupComplete(group));
                if (firstIncompleteGroup) {
                    setOpenGroup(firstIncompleteGroup);
                } else {
                    setOpenGroup("payment");
                }
            }, 0);
        }
    }, [rehydrated, hasPersistedData]);

    useEffect(() => {
        const subscription = form.watch((value, { name }) => {
            if (name && ['termsOfService'].includes(name)) {
                form.trigger(name);
            }

            const handleAutoAdvance = () => {
                const id = groupOrder.indexOf(openGroup);
                if (id === -1 || id === groupOrder.length - 1) return;
                const current = groupOrder[id];
                const next = groupOrder[id + 1];
                if (!prevComplete.current[current] && isGroupComplete(current)) {
                    setOpenGroup(next);
                }
                groupOrder.forEach((g) => {
                    prevComplete.current[g] = isGroupComplete(g);
                });
            };

            if (name === 'email') {
                if (emailTimeoutRef.current) {
                    clearTimeout(emailTimeoutRef.current);
                }
                emailTimeoutRef.current = setTimeout(handleAutoAdvance, 1000);
            } else {
                handleAutoAdvance();
            }
        })
        return () => {
            subscription.unsubscribe();
            if (emailTimeoutRef.current) {
                clearTimeout(emailTimeoutRef.current);
            }
        }
    }, [form, openGroup]);

    function handleGroupToggle(group: OpenGroups) {
        if (!isGroupComplete(group)) setOpenGroup(group)
    }

    return {
        openGroup,
        handleGroupToggle,
        isGroupComplete,
        isGroupDisabled
    }
} 