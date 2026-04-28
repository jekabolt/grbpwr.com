import type { StorefrontAccount } from "@/api/proto-http/frontend";
import { googletype_Date } from "@/api/proto-http/frontend";
import { COUNTRIES_BY_REGION, EMAIL_PREFERENCES, LANGUAGE_ID_TO_LOCALE } from "@/constants";

import {
    defaultData,
    type AccountEmailPreference,
    type AccountSchema,
} from "./schema";

export type ActivePanel =
    | "personal"
    | "email"
    | "order&returns"
    | "addresses"
    | "private";

export const ACCOUNT_SECTIONS = [
    {
        label: "order & returns",
        value: "order&returns",
    },
    {
        label: "personal info",
        value: "personal",
    },
    {
        label: "addresses",
        value: "addresses",
    },
    {
        label: "email preferences",
        value: "email",
    },
    {
        label: "private community",
        value: "private",
    },
] as const;

export const EMAIL_REFERENCE_ACTIONS = [
    { label: "subscribe", value: true },
    { label: "unsubscribe", value: false },
] as const;

export const EMAIL_REFERENCE_STEPS = [
    {
        label: "newsletter",
        name: "subscribeNewsletter",
        description:
            "brand updates, considered releases, and occasional private offers",
        actions: EMAIL_REFERENCE_ACTIONS,
    },
    {
        label: "new arrivals",
        name: "subscribeNewArrivals",
        description:
            "first notice of new drops, restocked pieces, and seasonal releases",
        actions: EMAIL_REFERENCE_ACTIONS,
    },
    {
        label: "events",
        name: "subscribeEvents",
        description:
            "invitations to launches, private viewings, and selected brand moments",
        actions: EMAIL_REFERENCE_ACTIONS,
    },
] as const;

export type AccountUpdateContext = {
    languageId: number;
    currentCountryCode: string | undefined;
};


export function getAccountFormDefaultValues(
    account: StorefrontAccount,
): AccountSchema {
    return {
        ...defaultData,
        firstName: account.firstName?.trim() ?? "",
        lastName: account.lastName?.trim() ?? "",
        phone: account.phone?.trim() ?? "",
        birthDate: accountBirthToInputValue(account.birthDate),
        subscribeNewsletter: account.subscribeNewsletter === true,
        subscribeNewArrivals: account.subscribeNewArrivals === true,
        subscribeEvents: account.subscribeEvents === true,
        shoppingPreference:
            account.shoppingPreference != null
                ? (account.shoppingPreference as AccountEmailPreference)
                : EMAIL_PREFERENCES.all,
        defaultCountry: account.defaultCountry?.trim().toLowerCase() ?? "",
    };
}

/** Builds JSON body for `POST /api/account/update` from the unified account form. */
export function buildAccountUpdatePayload(
    data: AccountSchema,
    ctx: AccountUpdateContext,
    mode: "full" | "personal" | "email",
): Record<string, unknown> {
    const phone = data.phone.trim();
    const birth = data.birthDate.trim();
    const countryFromStore = ctx.currentCountryCode?.trim();
    const defaultLanguage = LANGUAGE_ID_TO_LOCALE[ctx.languageId] ?? "en";
    const countryFromForm = data.defaultCountry?.trim();
    /** Prefer saved account country from the form; fall back to browsing session. */
    const effectiveDefaultCountry = countryFromForm || countryFromStore;

    const base: Record<string, unknown> = {
        defaultLanguage,
        ...(effectiveDefaultCountry
            ? { defaultCountry: effectiveDefaultCountry }
            : {}),
    };

    if (mode === "email") {
        return {
            ...base,
            subscribeNewsletter: data.subscribeNewsletter,
            subscribeNewArrivals: data.subscribeNewArrivals,
            subscribeEvents: data.subscribeEvents,
            ...(data.subscribeNewArrivals
                ? { shoppingPreference: data.shoppingPreference }
                : {}),
        };
    }

    if (mode === "personal") {
        return {
            ...base,
            firstName: data.firstName,
            lastName: data.lastName,
            ...(phone.length > 0 ? { phone } : {}),
            ...(birth.length > 0 ? { birthDate: inputValueToBirthDate(birth) } : {}),
        };
    }

    /** `full` — registration uses one opt-in checkbox for all subscription flags. */
    const marketingOptIn = data.subscribeNewArrivals;
    return {
        ...base,
        firstName: data.firstName,
        lastName: data.lastName,
        subscribeNewsletter: marketingOptIn,
        subscribeNewArrivals: marketingOptIn,
        subscribeEvents: marketingOptIn,
        ...(phone.length > 0 ? { phone } : {}),
        ...(birth.length > 0 ? { birthDate: inputValueToBirthDate(birth) } : {}),
        ...(marketingOptIn ? { shoppingPreference: data.shoppingPreference } : {}),
    };
}

export function accountBirthToInputValue(b: googletype_Date | undefined): string {
    if (!b?.year || !b?.month || !b?.day) return "";
    const m = String(b.month).padStart(2, "0");
    const d = String(b.day).padStart(2, "0");
    return `${b.year}-${m}-${d}`;
}

export function inputValueToBirthDate(s: string): googletype_Date {
    const [ys, ms, ds] = s.split("-");
    return {
        year: Number(ys),
        month: Number(ms),
        day: Number(ds),
    };
}

export function accountNeedsNameCompletion(account: StorefrontAccount): boolean {
    return !account.firstName?.trim() || !account.lastName?.trim();
}

export function formatOrderDate(value?: string) {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear());
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} / ${hours}:${minutes}`;
}

export function isSameCountry(addressCountry?: string, currentCountryCode?: string) {
    if (!currentCountryCode) return true;
    return (
        addressCountry?.trim().toLowerCase() ===
        currentCountryCode.trim().toLowerCase()
    );
}

export function getCountryMeta(countryCode?: string) {
    if (!countryCode) return undefined;
    return Object.values(COUNTRIES_BY_REGION)
        .flat()
        .find(
            (country) =>
                country.countryCode.toLowerCase() === countryCode.trim().toLowerCase(),
        );
}