import { blurhashToBase64 } from "blurhash-base64";

/**
 * Decode blurhash string to a base64 data URL for Next.js Image placeholder.
 * Works in both Node (SSR) and browser.
 */
export function blurhashToDataURL(hash: string): string {
  return blurhashToBase64(hash);
}
