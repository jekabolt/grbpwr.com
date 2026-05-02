import type { UpdateAccountRequest } from "@/api/proto-http/frontend";

import { respondWithAccountSession } from "./account-responses";
import { executeWithAccountSession } from "./session-executor";

export function updateAccountResponse(body: UpdateAccountRequest) {
  return respondWithAccountSession(
    () => executeWithAccountSession((client) => client.UpdateAccount(body)),
    {
      clearCookiesOnAuthFailure: true,
      badRequestFallback: "update failed",
      toJsonBody: (data) => ({ account: data.account }),
    },
  );
}
