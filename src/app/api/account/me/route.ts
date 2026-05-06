import { getAccountMeResponse } from "@/lib/storefront-account/account-me";

export async function GET() {
  return getAccountMeResponse();
}
