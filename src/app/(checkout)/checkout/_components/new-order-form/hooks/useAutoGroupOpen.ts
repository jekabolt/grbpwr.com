'use client'

import { useEffect, useRef, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { CheckoutData } from "../schema";
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
        return GROUP_FIELDS[group].every((field) => {
            const { error } = form.getFieldState(field);
            const value = form.getValues(field);
            if (typeof value === 'boolean') return field === 'termsOfService' ? value === true : !error;
            return value !== '' && value !== undefined && !error;
        })
    };

    function isGroupDisabled(group: OpenGroups) {
        const id = groupOrder.indexOf(group);
        if (id === 0) return false;
        return groupOrder.slice(0, id).some((g) => !isGroupComplete(g));
    }

    useEffect(() => {
        const subscription = form.watch(() => {
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