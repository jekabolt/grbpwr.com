import {
    CHECKOUT_ERROR_PHONE_COUNTRY,
    EMAIL_PREFERENCES,
    errorMessages,
} from "@/constants";
import { isValidPhoneForCountry } from "@/lib/phone/phone-validation";
import { z } from "zod";

/** Proto `ShoppingPreferenceEnum` strings (matches `EMAIL_PREFERENCES` values). */
const SHOPPING_PREFERENCE_ENUM = [
    EMAIL_PREFERENCES.all,
    EMAIL_PREFERENCES.men,
    EMAIL_PREFERENCES.women,
] as const;

export type AccountEmailPreference = (typeof SHOPPING_PREFERENCE_ENUM)[number];

const accountFieldsSchema = ({
    invalidDate,
    validBirthDate,
}: {
    invalidDate: string;
    validBirthDate: string;
}) =>
    z.object({
        firstName: z
            .string()
            .min(1, errorMessages.firstName.min)
            .max(40, errorMessages.firstName.max)
            .regex(
                errorMessages.firstName.regex.restriction,
                errorMessages.firstName.regex.message,
            )
            .trim(),
        lastName: z
            .string()
            .min(1, errorMessages.lastName.min)
            .max(40, errorMessages.lastName.max)
            .regex(
                errorMessages.lastName.regex.restriction,
                errorMessages.lastName.regex.message,
            )
            .trim(),
        phone: z.union([
            z.literal(""),
            z
                .string()
                .min(5, errorMessages.phone.min)
                .max(15, errorMessages.phone.max)
                .trim(),
        ])
            .optional(),
        birthDate: z
            .union([
                z.literal(""),
                z
                    .string()
                    .regex(/^\d{4}-\d{2}-\d{2}$/, invalidDate)
                    .refine((s) => {
                        const parsed = new Date(`${s}T12:00:00`);
                        if (Number.isNaN(parsed.getTime())) return false;
                        if (parsed > new Date()) return false;
                        if (parsed < new Date("1900-01-01T12:00:00")) return false;
                        return true;
                    }, validBirthDate),
            ])
            .optional(),
        subscribeNewsletter: z.boolean(),
        subscribeNewArrivals: z.boolean(),
        subscribeEvents: z.boolean(),
        shoppingPreference: z.enum(SHOPPING_PREFERENCE_ENUM),
        defaultCountry: z.string(),
    }).superRefine((data, ctx) => {
        if (
            data.phone &&
            data.defaultCountry &&
            !isValidPhoneForCountry(data.phone, data.defaultCountry)
        ) {
            ctx.addIssue({
                path: ["phone"],
                code: z.ZodIssueCode.custom,
                message: CHECKOUT_ERROR_PHONE_COUNTRY,
            });
        }
    });

export function createAccountSchema(t: (key: string) => string) {
    return accountFieldsSchema({
        invalidDate: t("invalid date"),
        validBirthDate: t("enter a valid date of birth"),
    });
}

export function createAddressEditSchema(t: (key: string) => string) {
    return z.object({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        country: z.string().min(2, t("country is required")),
        state: z.string().optional(),
        city: z.string().min(1, t("city is required")),
        address: z.string().min(3, t("address is required")),
        additionalAddress: z.string().optional(),
        company: z.string().optional(),
        phone: z.string().optional(),
        postalCode: z.string().min(2, t("postal code is required")),
    }).superRefine((data, ctx) => {
        if (
            data.phone &&
            data.country &&
            !isValidPhoneForCountry(data.phone, data.country)
        ) {
            ctx.addIssue({
                path: ["phone"],
                code: z.ZodIssueCode.custom,
                message: CHECKOUT_ERROR_PHONE_COUNTRY,
            });
        }
    });
}

export type AddressEditFormData = z.infer<
    ReturnType<typeof createAddressEditSchema>
>;

export const accountSchema = accountFieldsSchema({
    invalidDate: "invalid date",
    validBirthDate: "enter a valid date of birth",
});

export type AccountSchema = z.infer<typeof accountSchema>;

export const defaultData: AccountSchema = {
    firstName: "",
    lastName: "",
    phone: "",
    birthDate: "",
    subscribeNewsletter: false,
    subscribeNewArrivals: false,
    subscribeEvents: false,
    shoppingPreference: EMAIL_PREFERENCES.all,
    defaultCountry: "",
};
