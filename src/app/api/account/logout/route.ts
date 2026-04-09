import { revokeAccountSessionResponse } from "@/lib/storefront-account";

export async function POST() {
  return revokeAccountSessionResponse();
}
