import { parseAdminOrigins } from "@/lib/admin-origins";

// This message gate and next.config.ts's frame-ancestors directive share the
// same parser, defaults and build-time environment value.
export const ADMIN_ORIGINS = parseAdminOrigins(
  process.env.NEXT_PUBLIC_ADMIN_ORIGINS,
  true,
);
