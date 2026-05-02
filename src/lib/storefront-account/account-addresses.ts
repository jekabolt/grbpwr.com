import type {
  AddSavedAddressRequest,
  DeleteSavedAddressResponse,
  ListSavedAddressesResponse,
  SetDefaultSavedAddressResponse,
  StorefrontSavedAddress,
} from "@/api/proto-http/frontend";

import { respondWithAccountSession } from "./account-responses";
import { executeWithAccountSession } from "./session-executor";

export function listSavedAddressesResponse() {
  return respondWithAccountSession(
    () =>
      executeWithAccountSession((client) =>
        client.ListSavedAddresses({}) as Promise<ListSavedAddressesResponse>,
      ),
    {
      clearCookiesOnAuthFailure: false,
      badRequestFallback: "list addresses failed",
    },
  );
}

export function addSavedAddressResponse(body: AddSavedAddressRequest) {
  return respondWithAccountSession(
    () => executeWithAccountSession((client) => client.AddSavedAddress(body)),
    {
      clearCookiesOnAuthFailure: true,
      badRequestFallback: "add address failed",
    },
  );
}

export function setDefaultSavedAddressResponse(id: number) {
  return respondWithAccountSession(
    () =>
      executeWithAccountSession((client) =>
        client.SetDefaultSavedAddress({ id }) as Promise<SetDefaultSavedAddressResponse>,
      ),
    {
      clearCookiesOnAuthFailure: true,
      badRequestFallback: "set default address failed",
    },
  );
}

export function updateSavedAddressResponse(
  id: number,
  address: StorefrontSavedAddress,
) {
  return respondWithAccountSession(
    () =>
      executeWithAccountSession((client) =>
        client.UpdateSavedAddress({ id, address }),
      ),
    {
      clearCookiesOnAuthFailure: true,
      badRequestFallback: "update address failed",
    },
  );
}

export function deleteSavedAddressResponse(id: number) {
  return respondWithAccountSession(
    () =>
      executeWithAccountSession((client) =>
        client.DeleteSavedAddress({ id }) as Promise<DeleteSavedAddressResponse>,
      ),
    {
      clearCookiesOnAuthFailure: true,
      badRequestFallback: "delete address failed",
    },
  );
}
