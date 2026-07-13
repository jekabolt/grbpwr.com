export function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

// Errors thrown by the API client (see src/lib/api.ts) carry the HTTP `status`
// and the gRPC `code` from the gateway. These map the two the storefront cares
// about so callers can show localized copy instead of the raw server message.
type ApiError = { status?: number; code?: number };

// HTTP 429 / gRPC ResourceExhausted (8) — rate limit hit.
export function isRateLimitError(error: unknown): boolean {
  const e = error as ApiError | null;
  return e?.status === 429 || e?.code === 8;
}

// HTTP 400 / gRPC InvalidArgument (3) — bad input (e.g. malformed email).
export function isInvalidInputError(error: unknown): boolean {
  const e = error as ApiError | null;
  return e?.status === 400 || e?.code === 3;
}
