import { errorMessages } from "@/constants";
import { z } from "zod";


export const notifySchema = z.object({
    email: z.string().max(40, errorMessages.email.max).email(errorMessages.email.invalid).trim(),
    productId: z.number(),
    sizeId: z.number().min(1, "please select a size"),
})


export const defaultData = {
    email: "",
    productId: 0,
    sizeId: 0,
}

export type NotifySchema = z.infer<typeof notifySchema>