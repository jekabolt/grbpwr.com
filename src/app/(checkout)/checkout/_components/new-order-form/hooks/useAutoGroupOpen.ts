"use client";

import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { CheckoutData } from "../schema";
import { GROUP_FIELDS, OpenGroups } from "./constants";

export function useAutoGroupOpen(form: UseFormReturn<CheckoutData>) {
    const [openGroups, setOpenGroups] = useState<OpenGroups>("contact");

    const isGroupComplete = (group: OpenGroups) => {
        return GROUP_FIELDS[group].every((field) => {
            const fieldState = form.getFieldState(field);
            const value = form.getValues(field);

            const hasValue = value !== "" && value !== undefined && value !== null;
            const isValid = !fieldState.error;

            if (typeof value === "boolean") {
                return field === "termsOfService" ? value === true : isValid;
            }

            return hasValue && isValid;
        });
    };

    const isGroupDisabled = (group: OpenGroups) => {
        switch (group) {
            case "contact":
                return false;
            case "shipping":
                return !isGroupComplete("contact");
            case "payment":
                return !isGroupComplete("contact") || !isGroupComplete("shipping");
            default:
                return false;
        }
    };

    useEffect(() => {
        const subscription = form.watch((_, { name }) => {
            if (!name) return;

            if (openGroups === "contact" && isGroupComplete("contact")) {
                setOpenGroups("shipping");
            } else if (openGroups === "shipping" && isGroupComplete("shipping")) {
                setOpenGroups("payment");
            }
        });

        return () => subscription.unsubscribe();
    }, [form, openGroups, isGroupComplete]);

    const handleGroupToggle = (group: OpenGroups) => {

        if (isGroupDisabled(group)) return;
        setOpenGroups(group);
    };

    return {
        openGroups,
        handleGroupToggle,
        isGroupComplete,
        isGroupDisabled,
    };
}
