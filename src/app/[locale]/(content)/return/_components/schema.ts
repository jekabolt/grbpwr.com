import { errorMessages } from "@/constants";
import { z } from "zod";

export const refundForm = z.object({
    email: z
        .string()
        .max(40, errorMessages.email.max)
        .email(errorMessages.email.invalid)
        .trim(),
    orderUuid: z.string().trim().min(1, "required"),
    reason: z.string(),
});

export const defaultData = {
    email: "",
    orderUuid: "",
    reason: "other",
};

export type RefundSchema = z.infer<typeof refundForm>;
