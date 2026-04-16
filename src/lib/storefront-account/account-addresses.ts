import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import type {
  AddSavedAddressRequest,
  DeleteSavedAddressResponse,
  ListSavedAddressesResponse,
  SetDefaultSavedAddressResponse,
  StorefrontSavedAddress,
} from "@/api/proto-http/frontend";

import { createAccountServiceClient } from "./authed-client";
import { ACCESS_COOKIE } from "./session-cookies";

async function getAuthedAccountClient() {
  const store = await cookies();
  const access = store.get(ACCESS_COOKIE)?.value;
  if (!access) return null;
  return createAccountServiceClient(() => access);
}

export async function listSavedAddressesResponse(): Promise<NextResponse> {
  const client = await getAuthedAccountClient();
  if (!client) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const data = (await client.ListSavedAddresses(
      {},
    )) as ListSavedAddressesResponse;
    return NextResponse.json(data);
  } catch (e) {
    const message = e instanceof Error ? e.message : "list addresses failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function addSavedAddressResponse(
  body: AddSavedAddressRequest,
): Promise<NextResponse> {
  const client = await getAuthedAccountClient();
  if (!client) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const data = await client.AddSavedAddress(body);
    return NextResponse.json(data);
  } catch (e) {
    const message = e instanceof Error ? e.message : "add address failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function setDefaultSavedAddressResponse(
  id: number,
): Promise<NextResponse> {
  const client = await getAuthedAccountClient();
  if (!client) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const data = (await client.SetDefaultSavedAddress({
      id,
    })) as SetDefaultSavedAddressResponse;
    return NextResponse.json(data);
  } catch (e) {
    const message = e instanceof Error ? e.message : "set default address failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function updateSavedAddressResponse(
  id: number,
  address: StorefrontSavedAddress,
): Promise<NextResponse> {
  const client = await getAuthedAccountClient();
  if (!client) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const data = await client.UpdateSavedAddress({ id, address });
    return NextResponse.json(data);
  } catch (e) {
    const message = e instanceof Error ? e.message : "update address failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function deleteSavedAddressResponse(
  id: number,
): Promise<NextResponse> {
  const client = await getAuthedAccountClient();
  if (!client) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const data = (await client.DeleteSavedAddress({
      id,
    })) as DeleteSavedAddressResponse;
    return NextResponse.json(data);
  } catch (e) {
    const message = e instanceof Error ? e.message : "delete address failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
