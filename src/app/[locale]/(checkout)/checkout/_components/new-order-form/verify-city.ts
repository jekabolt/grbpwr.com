/**
 * Client-only: validates that a city name matches Google Places "(cities)"
 * predictions for the given ISO country code. Returns true when Places is
 * unavailable so checkout still works without the Maps script.
 */
export async function verifyCityInCountry(
  city: string,
  countryCode: string,
): Promise<boolean> {
  if (typeof window === "undefined") return true;

  const g = (
    window as Window & { google?: typeof google }
  ).google?.maps?.places;
  if (!g?.AutocompleteService) return true;

  const trimmed = city.trim();
  if (!trimmed || !countryCode) return true;

  const service = new g.AutocompleteService();
  const cc = countryCode.toLowerCase();

  return new Promise((resolve) => {
    service.getPlacePredictions(
      {
        input: trimmed,
        types: ["(cities)"],
        componentRestrictions: { country: cc },
      },
      (predictions, status) => {
        if (status !== "OK" || !predictions?.length) {
          resolve(false);
          return;
        }
        const n = trimmed.toLowerCase();
        const ok = predictions.some((p) => {
          const main = p.structured_formatting.main_text.toLowerCase();
          if (main === n) return true;
          const withComma = n + ",";
          if (main.startsWith(withComma)) return true;
          const desc = (p.description || "").toLowerCase();
          return desc === n || desc.startsWith(withComma);
        });
        resolve(ok);
      },
    );
  });
}
