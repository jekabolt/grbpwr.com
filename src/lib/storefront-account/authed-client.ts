import { createFrontendServiceClient } from "@/api/proto-http/frontend";
import { getCurrentShopHost } from "#shop-current-host";

import {
  MissingShopHostError,
  SHOP_HOST_HEADER,
  shopBackendUrl,
} from "@/lib/shop/host";

type Handler = Parameters<typeof createFrontendServiceClient>[0];

/** Per-request client: pass a getter so the token is read when each RPC runs. */
export function createAccountServiceClient(
  getAccessToken: () => string | undefined,
): ReturnType<typeof createFrontendServiceClient> {
  const handler: Handler = async (req, meta) => {
    const token = getAccessToken();
    // The backend checks the token's shop against this host: a session from
    // shop A is refused at shop B.
    const host = await getCurrentShopHost();
    if (!host) throw new MissingShopHostError();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      [SHOP_HOST_HEADER]: host,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const response = await fetch(shopBackendUrl(process.env.NEXT_PUBLIC_BACKEND_URL ?? "", req.path, host), {
      method: req.method,
      body: req.body,
      headers,
    });

    const data = await response.json();
    if (!response.ok) {
      const err = new Error((data?.message as string) || response.statusText) as Error & {
        code?: number;
        status?: number;
      };
      err.code = data?.code;
      err.status = response.status;
      throw err;
    }

    return data;
  };
  return createFrontendServiceClient(handler);
}
