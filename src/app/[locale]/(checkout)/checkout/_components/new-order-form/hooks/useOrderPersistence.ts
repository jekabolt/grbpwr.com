import type { StorefrontAccount } from "@/api/proto-http/frontend";
import { useDataContext } from "@/components/contexts/DataContext";
import { useCheckoutStore } from "@/lib/stores/checkout/store-provider";
import { useEffect, useRef } from "react";
import { UseFormReturn } from "react-hook-form";
import { CheckoutData, defaultData } from "../schema";
import { resolveCardPaymentMethod } from "../utils";

type CheckoutIdentityData = Pick<
    CheckoutData,
    "email" | "firstName" | "lastName" | "phone" | "country"
>;

type ApplyCheckoutIdentityOptions = {
    overwriteExisting?: boolean;
    forceReset?: boolean;
    shouldValidate?: boolean;
};

export const useOrderPersistence = (
    form: UseFormReturn<CheckoutData>,
    currentCountryCode?: string,
    opts?: {
        isSignedIn?: boolean;
        initialAccount?: StorefrontAccount | null;
    },
) => {
    const {
        formData,
        hasPersistedData,
        rehydrated,
        updateFormData,
        clearFormData,
    } = useCheckoutStore((state) => state);
    const { dictionary } = useDataContext();
    const didHydrateFormRef = useRef(false);

    useEffect(() => {
        const subscription = form.watch((value) => {
            updateFormData(value as Partial<CheckoutData>);
        });
        return () => subscription.unsubscribe();
    }, [form.watch, updateFormData]);

    const applyCheckoutIdentity = (
        incoming: Partial<CheckoutIdentityData>,
        options?: ApplyCheckoutIdentityOptions,
    ) => {
        const {
            overwriteExisting = false,
            forceReset = false,
            shouldValidate = false,
        } = options ?? {};

        const identity: Partial<CheckoutIdentityData> = {
            ...(incoming.email?.trim() ? { email: incoming.email.trim() } : {}),
            ...(incoming.firstName?.trim()
                ? { firstName: incoming.firstName.trim() }
                : {}),
            ...(incoming.lastName?.trim() ? { lastName: incoming.lastName.trim() } : {}),
            ...(incoming.phone?.trim() ? { phone: incoming.phone.trim() } : {}),
            ...(incoming.country?.trim()
                ? { country: incoming.country.trim().toLowerCase() }
                : currentCountryCode
                    ? { country: currentCountryCode }
                    : {}),
        };

        if (Object.keys(identity).length === 0) return;

        if (forceReset) {
            clearFormData();
            form.reset({
                ...defaultData,
                ...(currentCountryCode ? { country: currentCountryCode } : {}),
                ...identity,
            });
            updateFormData(identity);
            return;
        }

        const currentValues = form.getValues();
        const patch: Partial<CheckoutData> = {};
        for (const [key, value] of Object.entries(identity)) {
            const field = key as keyof CheckoutIdentityData;
            const currentValue = (currentValues[field] as string | undefined)?.trim();
            if (overwriteExisting || !currentValue) {
                patch[field] = value as never;
            }
        }

        if (Object.keys(patch).length === 0) return;
        for (const [key, value] of Object.entries(patch)) {
            form.setValue(key as keyof CheckoutData, value as never, {
                shouldDirty: false,
                shouldValidate,
            });
        }
        updateFormData(patch);
    };

    useEffect(() => {
        if (!rehydrated || didHydrateFormRef.current) return;
        const hasStash =
            typeof sessionStorage !== "undefined" &&
            sessionStorage.getItem("checkout-country-change-stash");
        const hasFormData =
            hasPersistedData && Object.keys(formData).length > 0;
        if (!hasStash && !hasFormData) return;

        didHydrateFormRef.current = true;
        setTimeout(() => {
            let data = {
                ...defaultData,
                ...formData,
                ...(currentCountryCode && { country: currentCountryCode }),
            };
            try {
                const stash = sessionStorage.getItem("checkout-country-change-stash");
                if (stash) {
                    const { email, promoCode } = JSON.parse(stash);
                    data = {
                        ...data,
                        email: email ?? data.email,
                        promoCode: promoCode ?? data.promoCode,
                    };
                    sessionStorage.removeItem("checkout-country-change-stash");
                }
            } catch {
            }
            // Live/test routing is an environment concern, never a persisted
            // value: re-resolve from the dictionary so a stale TEST enum saved
            // from a prior session can't follow a real shopper into production.
            data.paymentMethod = resolveCardPaymentMethod(dictionary?.isProd);
            form.reset(data);
        }, 0);
    }, [
        currentCountryCode,
        form,
        formData,
        hasPersistedData,
        rehydrated,
        dictionary?.isProd,
    ]);

    useEffect(() => {
        if (!opts?.isSignedIn || !opts.initialAccount) return;

        const account = opts.initialAccount;
        const accountEmail = account.email?.trim();
        if (!accountEmail) return;

        const persistedEmail = form.getValues("email")?.trim().toLowerCase();
        const signedInEmail = accountEmail.toLowerCase();
        const switchedAccount = !!persistedEmail && persistedEmail !== signedInEmail;
        const profilePhone = account.phone?.trim() ?? "";

        applyCheckoutIdentity(
            {
                email: accountEmail,
                firstName: account.firstName?.trim() ?? "",
                lastName: account.lastName?.trim() ?? "",
                ...(switchedAccount ? { phone: profilePhone } : {}),
                country: account.defaultCountry?.trim() ?? currentCountryCode ?? "",
            },
            {
                overwriteExisting: !switchedAccount,
                forceReset: switchedAccount,
                shouldValidate: false,
            },
        );

        if (!switchedAccount && profilePhone) {
            const currentPhone = form.getValues("phone")?.trim();
            if (!currentPhone) {
                form.setValue("phone", profilePhone, {
                    shouldDirty: false,
                    shouldValidate: false,
                });
                updateFormData({ phone: profilePhone });
            }
        }
    }, [currentCountryCode, form, opts?.initialAccount, opts?.isSignedIn, updateFormData]);

    return {
        clearFormData,
        applyCheckoutIdentity,
    }
};
