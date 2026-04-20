type ErrorResponse = {
  error?: string;
};

export async function parseApiError(
  response: Response,
  fallbackMessage: string,
) {
  const data = (await response.json().catch(() => ({}))) as ErrorResponse;
  return data.error || fallbackMessage;
}
