import type {
    StorefrontAccount,
    StorefrontSavedAddress,
} from "@/api/proto-http/frontend";
import { googletype_Date } from "@/api/proto-http/frontend";
import { COUNTRIES_BY_REGION, EMAIL_PREFERENCES, LANGUAGE_ID_TO_LOCALE } from "@/constants";

import {
    defaultData,
    type AccountEmailPreference,
    type AccountSchema,
    type AddressEditFormData,
} from "./schema";

export type ActivePanel =
    | "personal"
    | "email"
    | "order&returns"
    | "addresses"
    | "private community";

export const ACCOUNT_SECTIONS = [
    {
        label: "order & returns",
        value: "order&returns",
        path: "order-returns",
    },
    {
        label: 'private community',
        value: 'private community',
        path: 'private-community',
    },
    {
        label: "addresses",
        value: "addresses",
        path: "addresses",
    },
    {
        label: "email preferences",
        value: "email",
        path: "email-preferences",
    },
    {
        label: "personal info",
        value: "personal",
        path: "personal-info",
    },
] as const;

export type AccountSection = (typeof ACCOUNT_SECTIONS)[number];
export type AccountSectionPath = (typeof ACCOUNT_SECTIONS)[number]["path"];

export function getAccountSectionByPath(path: string) {
    return ACCOUNT_SECTIONS.find((section) => section.path === path);
}

export const EMAIL_REFERENCE_STEPS = [
    {
        label: "newsletter",
        name: "subscribeNewsletter",
        description:
            "brand updates, considered releases, and occasional private offers",
    },
    {
        label: "new arrivals",
        name: "subscribeNewArrivals",
        description:
            "first notice of new drops, restocked pieces, and seasonal releases",
    },
    {
        label: "events",
        name: "subscribeEvents",
        description:
            "invitations to launches, private viewings, and selected brand moments",
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
    const phone = data.phone?.trim() ?? "";
    const birth = data.birthDate?.trim() ?? "";
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

export function getAddressEditDefaultValues(
    account: StorefrontAccount,
    address: StorefrontSavedAddress,
): AddressEditFormData {
    return {
        firstName: account.firstName ?? "",
        lastName: account.lastName ?? "",
        country: address.country ?? "",
        state: address.state ?? "",
        city: address.city ?? "",
        address: address.addressLineOne ?? "",
        additionalAddress: address.addressLineTwo ?? "",
        company: address.company ?? "",
        phone: account.phone ?? "",
        postalCode: address.postalCode ?? "",
    };
}

export function buildAddressEditPayload(
    data: AddressEditFormData,
    isDefault: boolean | undefined,
) {
    return {
        country: data.country.trim(),
        state: data.state?.trim() ?? "",
        city: data.city.trim(),
        addressLineOne: data.address.trim(),
        addressLineTwo: data.additionalAddress?.trim() ?? "",
        company: data.company?.trim() ?? "",
        postalCode: data.postalCode.trim(),
        isDefault: isDefault ?? false,
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

export function findAddressForCountry(
    addresses: StorefrontSavedAddress[],
    countryCode?: string,
): StorefrontSavedAddress | undefined {
    if (!countryCode?.trim()) return undefined;
    return addresses.find((a) => isSameCountry(a.country, countryCode));
}

export function pickAddressForCountry(
    addresses: StorefrontSavedAddress[],
    countryCode?: string,
): StorefrontSavedAddress | undefined {
    const forCountry = findAddressForCountry(addresses, countryCode);
    if (forCountry) return forCountry;
    return addresses.find((a) => a.isDefault) ?? addresses[0];
}

export const CHECKOUT_SAVED_ADDRESS_FIELDS = [
    "savedAddressId",
    "country",
    "state",
    "city",
    "address",
    "additionalAddress",
    "company",
    "postalCode",
    "phone",
] as const;

type CheckoutFormSetValue = (
    name: (typeof CHECKOUT_SAVED_ADDRESS_FIELDS)[number],
    value: string,
    options?: { shouldValidate?: boolean; shouldDirty?: boolean },
) => void;

export function applySavedAddressToCheckoutForm(
    setValue: CheckoutFormSetValue,
    address: StorefrontSavedAddress,
    profilePhone?: string,
) {
    setValue("savedAddressId", address.id != null ? String(address.id) : "", {
        shouldValidate: false,
    });
    setValue("country", (address.country ?? "").trim().toLowerCase(), {
        shouldValidate: true,
        shouldDirty: true,
    });
    setValue("state", (address.state ?? "").trim(), {
        shouldValidate: false,
        shouldDirty: true,
    });
    setValue("city", (address.city ?? "").trim(), {
        shouldValidate: true,
        shouldDirty: true,
    });
    setValue("address", (address.addressLineOne ?? "").trim(), {
        shouldValidate: true,
        shouldDirty: true,
    });
    setValue("additionalAddress", (address.addressLineTwo ?? "").trim(), {
        shouldValidate: false,
        shouldDirty: true,
    });
    setValue("company", (address.company ?? "").trim(), {
        shouldValidate: false,
        shouldDirty: true,
    });
    setValue("postalCode", (address.postalCode ?? "").trim(), {
        shouldValidate: true,
        shouldDirty: true,
    });
    const phone = (address.phone ?? "").trim() || (profilePhone ?? "").trim();
    setValue("phone", phone, { shouldValidate: true, shouldDirty: true });
}

export function resolveCheckoutAddressSelection(
    addresses: StorefrontSavedAddress[],
    savedAddressId: string | undefined,
    resolvedCheckoutAddress: StorefrontSavedAddress | undefined,
    countryAddress: StorefrontSavedAddress | undefined,
    currentCountryCode?: string,
): StorefrontSavedAddress | undefined {
    if (!resolvedCheckoutAddress?.id) return undefined;

    const persisted = savedAddressId?.trim()
        ? addresses.find((a) => String(a.id ?? "") === savedAddressId.trim())
        : undefined;

    if (
        persisted &&
        (!countryAddress || isSameCountry(persisted.country, currentCountryCode))
    ) {
        return persisted;
    }

    return resolvedCheckoutAddress;
}

export function checkoutAddressSelectionKey(
    address: StorefrontSavedAddress,
    currentCountryCode?: string,
): string {
    return isSameCountry(address.country, currentCountryCode)
        ? `${currentCountryCode ?? ""}:${address.id}`
        : `fallback:${address.id}`;
}

export function checkoutFormMatchesAddress(
    savedAddressId: string | undefined,
    formCountry: string | undefined,
    address: StorefrontSavedAddress,
): boolean {
    return (
        String(savedAddressId ?? "") === String(address.id) &&
        isSameCountry(formCountry, address.country)
    );
}

export function snapshotCheckoutAddressFields(
    values: Record<string, unknown>,
): Record<string, string> {
    return Object.fromEntries(
        CHECKOUT_SAVED_ADDRESS_FIELDS.map((field) => [
            field,
            String(values[field] ?? ""),
        ]),
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

export function encodeEmailBase64(email: string) {
    if (typeof window !== "undefined") {
        return window.btoa(email);
    }

    return Buffer.from(email).toString("base64");
}
