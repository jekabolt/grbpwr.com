import { cookies, headers } from "next/headers";
import { getMessages } from "next-intl/server";

import { GeoSuggestBanner } from "./geo-suggest-banner";

export async function GeoSuggestWrapper() {
  const cookieStore = await cookies();
  const headersList = await headers();

  // Cookies are set in response on first visit, so read from request headers
  // (middleware passes x-geo-suggest-* when geo differs and user has no cookies yet)
  const suggestCountry =
    cookieStore.get("NEXT_SUGGEST_COUNTRY")?.value ??
    headersList.get("x-geo-suggest-country");
  const suggestLocale =
    cookieStore.get("NEXT_SUGGEST_LOCALE")?.value ??
    headersList.get("x-geo-suggest-locale");
  const currentCountry =
    cookieStore.get("NEXT_SUGGEST_CURRENT_COUNTRY")?.value ??
    headersList.get("x-geo-suggest-current") ??
    undefined;

  if (!suggestCountry || !suggestLocale) return null;

  // Get suggested locale messages for banner text
  const suggestedMessages = await getMessages({ locale: suggestLocale });

  return (
    <GeoSuggestBanner
      suggestCountry={suggestCountry}
      suggestLocale={suggestLocale}
      currentCountry={currentCountry}
      messages={suggestedMessages}
    />
  );
}
