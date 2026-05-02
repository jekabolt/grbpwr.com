import { EMAIL_PREFERENCES, errorMessages } from "@/constants";
import { z } from "zod";

/** Proto `ShoppingPreferenceEnum` strings (matches `EMAIL_PREFERENCES` values). */
const SHOPPING_PREFERENCE_ENUM = [
    EMAIL_PREFERENCES.all,
    EMAIL_PREFERENCES.men,
    EMAIL_PREFERENCES.women,
] as const;

export type AccountEmailPreference = (typeof SHOPPING_PREFERENCE_ENUM)[number];

const baseAccountSchema = z.object({
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
                .regex(/^\d{4}-\d{2}-\d{2}$/, "invalid date")
                .refine((s) => {
                    const parsed = new Date(`${s}T12:00:00`);
                    if (Number.isNaN(parsed.getTime())) return false;
                    if (parsed > new Date()) return false;
                    if (parsed < new Date("1900-01-01T12:00:00")) return false;
                    return true;
                }, "enter a valid date of birth"),
        ])
        .optional(),
    subscribeNewsletter: z.boolean(),
    subscribeNewArrivals: z.boolean(),
    subscribeEvents: z.boolean(),
    shoppingPreference: z.enum(SHOPPING_PREFERENCE_ENUM),
    defaultCountry: z.string(),

});

export const accountSchema = baseAccountSchema;

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
