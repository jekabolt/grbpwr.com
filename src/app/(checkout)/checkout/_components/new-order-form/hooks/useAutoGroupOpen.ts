"use client";

import { useEffect, useState } from "react";
import { UseFormReturn, useFormState } from "react-hook-form";
import { CheckoutData } from "../schema";
import { GROUP_FIELDS, OpenGroups, } from "./constants";


export function useAutoGroupOpen(form: UseFormReturn<CheckoutData>) {
    const [openGroups, setOpenGroups] = useState<OpenGroups>("contact");
    const { dirtyFields, errors } = useFormState({ control: form.control });

    const isGroupComplete = (group: OpenGroups) => {
        return GROUP_FIELDS[group].every((field) => {
            return dirtyFields[field] && !errors[field];
        });
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
    }, [form, openGroups]);

    const handleGroupToggle = (group: OpenGroups) => {
        setOpenGroups(group);
    };

    return {
        openGroups,
        handleGroupToggle,
    };
}
