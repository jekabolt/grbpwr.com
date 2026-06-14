"use client";

import { useEffect, useMemo, useState } from "react";
import { COUNTRIES_BY_REGION, LANGUAGE_ID_TO_LOCALE } from "@/constants";

import { useTranslationsStore } from "@/lib/stores/translations/store-provider";

import { Banner } from "./banner";
import { Button } from "./button";
import { Text } from "./text";

const CHOSEN_COOKIE = "NEXT_LANG_CHOSEN";
const ONE_YEAR = 60 * 60 * 24 * 365;

function hasCookie(name: string): boolean {
  return (
    typeof document !== "undefined" &&
    document.cookie.split("; ").some((c) => c.startsWith(`${name}=`))
  );
}

function writeCookie(name: string, value: string): void {
  const secure =
    typeof window !== "undefined" && window.location.protocol === "https:"
      ? "; Secure"
      : "";
  document.cookie = `${name}=${value}; Path=/; Max-Age=${ONE_YEAR}; SameSite=Lax${secure}`;
}

type LangOption = { lng: string; label: string };

/**
 * First-visit language choice: when the detected country offers more than one
 * language (e.g. France → français + english), let the visitor pick instead of
 * silently defaulting to the local language. Shown only until a choice is made
 * (NEXT_LANG_CHOSEN cookie) and after cookie consent, and never stacked on top
 * of the geo-suggest (country) banner. Dismiss keeps the current/local language.
 */
export function LanguageSuggestBanner() {
  const [visible, setVisible] = useState(false);
  const { currentCountry, languageId } = useTranslationsStore((s) => s);

  const code = currentCountry.countryCode?.toLowerCase();
  const currentLng = LANGUAGE_ID_TO_LOCALE[languageId];

  const options = useMemo<LangOption[]>(() => {
    if (!code) return [];
    const seen = new Set<string>();
    const out: LangOption[] = [];
    for (const list of Object.values(COUNTRIES_BY_REGION)) {
      for (const c of list) {
        if (c.countryCode.toLowerCase() === code && !seen.has(c.lng)) {
          seen.add(c.lng);
          out.push({ lng: c.lng, label: c.displayLng || c.lng });
        }
      }
    }
    return out;
  }, [code]);

  useEffect(() => {
    // Only multilingual countries offer a choice; single-language ones (gb/us…)
    // never show it.
    if (options.length < 2 || hasCookie(CHOSEN_COOKIE)) return;

    const evaluate = () => {
      const consent =
        localStorage.getItem("cookieConsent") || hasCookie("cookieConsent");
      const geoSuggestActive = hasCookie("NEXT_SUGGEST_COUNTRY");
      if (consent && !geoSuggestActive && !hasCookie(CHOSEN_COOKIE)) {
        setVisible(true);
      }
    };

    evaluate();
    window.addEventListener("cookie-consent-accepted", evaluate);
    return () =>
      window.removeEventListener("cookie-consent-accepted", evaluate);
  }, [options.length]);

  if (!visible || options.length < 2 || !code) return null;

  const choose = (lng: string) => {
    writeCookie(CHOSEN_COOKIE, "1");
    setVisible(false);
    // Already on the chosen language — nothing to navigate.
    if (lng === currentLng) return;
    // Mirror the picker's language switch: persist cookies + reload via
    // from_picker so middleware re-syncs and the store re-inits.
    writeCookie("NEXT_COUNTRY", code);
    writeCookie("NEXT_LOCALE", lng);
    const stripped =
      window.location.pathname.replace(
        /^\/(?:[A-Za-z]{2}\/[a-z]{2}|[a-z]{2})(?=\/|$)/,
        "",
      ) || "";
    const url = new URL(`/${code}/${lng}${stripped}`, window.location.origin);
    new URLSearchParams(window.location.search).forEach((value, key) => {
      if (key !== "from_picker") url.searchParams.set(key, value);
    });
    url.searchParams.set("from_picker", "1");
    window.location.href = url.toString();
  };

  const dismiss = () => {
    // Keep the current/local language, but remember the choice so we don't ask
    // again.
    writeCookie(CHOSEN_COOKIE, "1");
    setVisible(false);
  };

  return (
    <Banner>
      <div className="flex flex-col gap-y-4 p-4">
        <div className="flex items-start justify-between gap-x-4">
          <Text variant="uppercase">language</Text>
          <button
            type="button"
            onClick={dismiss}
            aria-label="dismiss"
            className="uppercase"
          >
            [x]
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {options.map((o) => (
            <Button
              key={o.lng}
              variant="main"
              size="lg"
              onClick={() => choose(o.lng)}
              className="uppercase"
            >
              {o.label}
            </Button>
          ))}
        </div>
      </div>
    </Banner>
  );
}
