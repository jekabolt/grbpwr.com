import { z } from 'zod';

export const supportSchema = z.object({
    name: z.string().min(2, "Name is required"),
    orderNumber: z.string().min(1, "Order number is required"),
    trackingNumber: z.string().min(1, "Tracking number is required"),
    request: z.string().min(1, "Request is required"),
});

export const defaultValues = {
    name: "",
    orderNumber: "",
    trackingNumber: "",
    request: "",
};

export type SupportData = z.infer<typeof supportSchema>;
