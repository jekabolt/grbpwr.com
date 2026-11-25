import { GRBPWR_PACK } from "@/brands/grbpwr/config";
import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";

import { getShopPack } from "@/lib/shop/server";

import { routing } from "./routing";

type Messages = Record<string, unknown>;

/** Pack copy over the base messages, key by key (nested namespaces merge). */
function mergeMessages(base: Messages, over: Messages): Messages {
  const out: Messages = { ...base };
  for (const [key, value] of Object.entries(over)) {
    const prev = out[key];
    out[key] =
      value && typeof value === "object" && prev && typeof prev === "object"
        ? mergeMessages(prev as Messages, value as Messages)
        : value;
  }
  return out;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const base = (await import(`../../messages/${locale}.json`)).default;
  if ((await getShopPack()) !== GRBPWR_PACK) {
    return { locale, messages: base };
  }
  const pack = (await import(`../brands/grbpwr/messages/${locale}.json`))
    .default;
  return { locale, messages: mergeMessages(base, pack) };
});
