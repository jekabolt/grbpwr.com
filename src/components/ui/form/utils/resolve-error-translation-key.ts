import { errorMap } from "@/constants";

const KNOWN_ERROR_TYPES = new Set([
  "regex",
  "invalidCharacter",
  "min",
  "max",
  "required",
  "invalid",
  "countryMismatch",
]);

export function resolveErrorTranslationKey(error: {
  type?: string;
  message?: string;
}): string | null {
  const errorMessage = String(error.message || "");
  const errorType = String(error.type || "");

  if (KNOWN_ERROR_TYPES.has(errorType)) {
    return errorType;
  }

  const fromMap = Object.entries(errorMap).find(([key]) =>
    errorMessage.toLowerCase().includes(key.toLowerCase()),
  )?.[1];
  if (fromMap) return fromMap;

  return null;
}
