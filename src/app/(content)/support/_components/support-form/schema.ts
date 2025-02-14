import { z } from "zod";

export const supportSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  orderRef: z.string().min(1, "Order reference is required"),
  trackingId: z.string().min(1, "Tracking ID is required").optional(),
  reason: z.string().min(1, "Reason is required"),
  otherReason: z.string().optional(),
});

export const defaultValues = {
  email: "",
  firstName: "",
  lastName: "",
  orderRef: "",
  trackingId: "",
  reason: "",
  otherReason: "",
};

export type SupportData = z.infer<typeof supportSchema>;
