import { cookies } from "next/headers";

import { GeoSuggestBanner } from "./geo-suggest-banner";

export async function GeoSuggestBannerServer() {
  const cookieStore = await cookies();
  const suggestCountry = cookieStore.get("NEXT_SUGGEST_COUNTRY")?.value;
  const suggestLocale = cookieStore.get("NEXT_SUGGEST_LOCALE")?.value;
  const suggestPath = cookieStore.get("NEXT_SUGGEST_PATH")?.value;
  const currentCountry = cookieStore.get("NEXT_SUGGEST_CURRENT_COUNTRY")?.value;
  const currentLocale = cookieStore.get("NEXT_SUGGEST_CURRENT_LOCALE")?.value;

  if (!suggestCountry || !suggestLocale) return null;

  return (
    <GeoSuggestBanner
      suggestCountry={suggestCountry}
      suggestLocale={suggestLocale}
      suggestPath={suggestPath}
      currentCountry={currentCountry}
      currentLocale={currentLocale}
    />
  );
}
