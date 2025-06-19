'use client'

import { useEffect, useRef, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { CheckoutData, checkoutSchema } from "../schema";
import { GROUP_FIELDS, OpenGroups } from "./constants";

const groupOrder: OpenGroups[] = ["contact", "shipping", "payment"];

export function useAutoGroupOpen(form: UseFormReturn<CheckoutData>) {
    const [openGroup, setOpenGroup] = useState<OpenGroups>("contact");
    const prevComplete = useRef<Record<OpenGroups, boolean>>({
        contact: false,
        shipping: false,
        payment: false,
    });

    function isGroupComplete(group: OpenGroups) {
        const fields = GROUP_FIELDS[group];

        return fields.every((field) => {
            const { error, invalid, isDirty } = form.getFieldState(field);
            const value = form.getValues(field);

            if (value === '' || value === undefined || value === null) {
                return false;
            }

            if (typeof value === 'boolean') {
                if (field === 'termsOfService') {
                    return value === true && !error && !invalid;
                }
                return !error && !invalid;
            }

            if (field === 'email') {
                if (!isDirty) return false;
                try {
                    checkoutSchema.shape.email.parse(value);
                    return !error && !invalid;
                } catch {
                    return false;
                }
            }

            return !error && !invalid;
        });
    };

    function isGroupDisabled(group: OpenGroups) {
        const id = groupOrder.indexOf(group);
        if (id === 0) return false;
        return groupOrder.slice(0, id).some((g) => !isGroupComplete(g));
    }

    useEffect(() => {
        const subscription = form.watch((value, { name }) => {
            if (name && ['email', 'termsOfService'].includes(name)) {
                form.trigger(name);
            }
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
        })
        return () => subscription.unsubscribe()
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