'use client'

import { useCheckoutStore } from "@/lib/stores/checkout/store-provider";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { CheckoutData } from "../schema";
import { GROUP_FIELDS, OpenGroups } from "./constants";

const groupOrder: OpenGroups[] = ["contact", "shipping", "payment"];

export function useAutoGroupOpen(form: UseFormReturn<CheckoutData>) {
    const { rehydrated, hasPersistedData } = useCheckoutStore((state) => state);
    const [openGroups, setOpenGroups] = useState<Set<OpenGroups>>(() => new Set(["contact"]));


    useEffect(() => {
        if (!rehydrated) return;

        if (hasPersistedData) {
            setOpenGroups(prev => {
                const newSet = new Set<OpenGroups>();

                let foundIncomplete = false;
                for (const group of groupOrder) {
                    if (!foundIncomplete && isGroupCompleteSync(group, form)) {
                        newSet.add(group);
                    } else if (!foundIncomplete) {
                        newSet.add(group);
                        foundIncomplete = true;
                    }
                }

                if (newSet.size === 0 || !foundIncomplete) {
                    groupOrder.forEach(group => newSet.add(group));
                }

                return newSet;
            });
        }
    }, [rehydrated, hasPersistedData, form]);

    function isGroupComplete(group: OpenGroups) {
        return isGroupCompleteSync(group, form);
    }

    function hasGroupValidationErrors(group: OpenGroups) {
        const fields = GROUP_FIELDS[group];

        return fields.some((field) => {
            const { error, invalid } = form.getFieldState(field);
            const value = form.getValues(field);

            if (value === '' || value == null) return false;

            return error || invalid;
        });
    }

    function isGroupDisabled(group: OpenGroups) {
        const id = groupOrder.indexOf(group);
        if (id === 0) return false;
        return groupOrder.slice(0, id).some((g) => !isGroupComplete(g) || hasGroupValidationErrors(g));
    }

    function isGroupOpen(group: OpenGroups) {
        return openGroups.has(group);
    }

    function handleGroupToggle(group: OpenGroups) {
        if (isGroupDisabled(group)) return;

        setOpenGroups(prev => {
            const newSet = new Set(prev);
            if (newSet.has(group)) {
                newSet.delete(group);
            } else {
                newSet.add(group);
            }
            return newSet;
        });
    }

    function handleFormChange(fieldName?: string) {
        if (fieldName) {
            form.trigger(fieldName as keyof CheckoutData);
        }

        setTimeout(() => {
            setOpenGroups(prev => {
                const newSet = new Set(prev);

                for (let i = 0; i < groupOrder.length - 1; i++) {
                    const currentGroup = groupOrder[i];
                    const nextGroup = groupOrder[i + 1];

                    if (isGroupComplete(currentGroup) && !hasGroupValidationErrors(currentGroup) && !isGroupDisabled(nextGroup)) {
                        newSet.add(nextGroup);
                    }

                    if (!isGroupComplete(currentGroup) || hasGroupValidationErrors(currentGroup)) {
                        for (let j = i + 1; j < groupOrder.length; j++) {
                            newSet.delete(groupOrder[j]);
                        }
                        break;
                    }
                }
                return newSet;
            });
        }, 0);
    }

    return {
        openGroups,
        isGroupOpen,
        handleGroupToggle,
        handleFormChange,
        isGroupComplete,
        isGroupDisabled,
        hasGroupValidationErrors
    };
}


function isGroupCompleteSync(group: OpenGroups, form: UseFormReturn<CheckoutData>) {
    const fields = GROUP_FIELDS[group];

    return fields.every((field) => {
        const { error, invalid } = form.getFieldState(field);
        const value = form.getValues(field);
        const hasError = error || invalid;

        if (value === '' || value == null) return false;

        if (typeof value === 'boolean') {
            return field === 'termsOfService' ? value && !hasError : !hasError;
        }

        return !hasError;
    });
}
