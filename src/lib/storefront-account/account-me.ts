import { respondWithAccountSession } from "./account-responses";
import { executeWithAccountSession } from "./session-executor";

/** Proxies the same data as backend `GET api/frontend/account/me` (see GetAccount in proto client). */
export function getAccountMeResponse() {
  return respondWithAccountSession(
    () => executeWithAccountSession((client) => client.GetAccount({})),
    {
      clearCookiesOnAuthFailure: true,
      badRequestFallback: "get account failed",
      toJsonBody: (data) => ({ account: data.account }),
    },
  );
}
