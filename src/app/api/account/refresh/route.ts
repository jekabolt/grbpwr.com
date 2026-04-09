import { refreshAccountSessionResponse } from "@/lib/storefront-account";

export async function POST() {
  return refreshAccountSessionResponse();
}
