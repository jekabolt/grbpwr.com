import { refreshAccountSessionResponse } from "@/lib/storefront-account/account-auth";


export async function POST() {
  return refreshAccountSessionResponse();
}
