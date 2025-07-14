import { errorMessages } from "@/app/(checkout)/checkout/_components/new-order-form/error-messages";
import { z } from "zod";

export const aftersaleForm = z.object({
    topic: z.string().min(1),
    subject: z.string().min(1),
    civility: z.string().min(1),
    email: z.string().max(40, errorMessages.email.max).email(errorMessages.email.invalid).trim(),
    firstName: z.string().min(1, errorMessages.firstName.min).max(40, errorMessages.firstName.max).regex(errorMessages.firstName.regex.restriction, errorMessages.firstName.regex.message).trim(),
    lastName: z.string().min(1, errorMessages.lastName.min).max(40, errorMessages.lastName.max).regex(errorMessages.lastName.regex.restriction, errorMessages.lastName.regex.message).trim(),
    orderReference: z.string().optional(),
    notes: z.string().optional(),
})

export const defaultValues = {
    topic: "product information",
    subject: "",
    civility: "",
    email: "",
    firstName: "",
    lastName: "",
    orderReference: "",
    notes: "",
}

export type AftersaleSchema = z.infer<typeof aftersaleForm>