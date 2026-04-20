import { NextResponse } from "next/server";

import {
  jsonWithRefreshedSession,
  unauthorizedAccountResponse,
} from "./account-response-builders";
import type { AccountSessionResult } from "./session-executor";

type RespondWithAccountSessionOptions<T> = {
  clearCookiesOnAuthFailure: boolean;
  badRequestFallback: string;
  toJsonBody?: (data: T) => unknown;
};


export async function respondWithAccountSession<T>(
  execute: () => Promise<AccountSessionResult<T>>,
  options: RespondWithAccountSessionOptions<T>,
): Promise<NextResponse> {
  try {
    const result = await execute();
    if (!result.ok) {
      return unauthorizedAccountResponse(options.clearCookiesOnAuthFailure);
    }
    const body = options.toJsonBody
      ? options.toJsonBody(result.data)
      : result.data;
    return jsonWithRefreshedSession(body, result.refreshed);
  } catch (e) {
    const message = e instanceof Error ? e.message : options.badRequestFallback;
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
