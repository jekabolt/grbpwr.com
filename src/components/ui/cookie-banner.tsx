"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { CookieContent } from "@/app/[locale]/(content)/_components/cookie-content";
import { ModalTransition } from "@/components/modal-transition";
import { Text } from "@/components/ui/text";

import { Banner } from "./banner";
import { Button } from "./button";
import { MobileCookieModal } from "./mobile-cookie-modal";
import { Overlay } from "./overlay";

export const defaultCookiePreferences = {
  functional: true,
  statistical: true,
  advertising_social_media: true,
  experience: true,
};

interface CookieBannerProps {
  defaultVisible?: boolean;
}

function updateConsentMode(prefs: typeof defaultCookiePreferences) {
  if (typeof window === "undefined" || typeof window.gtag !== "function")
    return;
  window.gtag("consent", "update", {
    analytics_storage: prefs.statistical ? "granted" : "denied",
    ad_storage: prefs.advertising_social_media ? "granted" : "denied",
    ad_user_data: prefs.advertising_social_media ? "granted" : "denied",
    ad_personalization: prefs.advertising_social_media ? "granted" : "denied",
  });
}

const hasConsentCookie = () =>
  typeof document !== "undefined" &&
  document.cookie
    .split("; ")
    .some((c) => c.startsWith("cookieConsent="));

const setConsentCookie = () => {
  const secure =
    typeof window !== "undefined" && window.location.protocol === "https:"
      ? ";Secure"
      : "";
  document.cookie = `cookieConsent=1;path=/;max-age=31536000;SameSite=Lax${secure}`;
};

export function CookieBanner(_props: CookieBannerProps = {}) {
  // Server-render hidden; client decides after reading cookie + localStorage.
  // This avoids a flash when the cookie was cleared but localStorage still has consent.
  const [isVisible, setIsVisible] = useState(false);
  const [open, setOpenStatus] = useState(false);
  const [preferences, setPreferences] = useState(defaultCookiePreferences);
  const t = useTranslations("cookies");
  const tAccessibility = useTranslations("accessibility");

  useEffect(() => {
    const savedConsent = localStorage.getItem("cookieConsent");
    const cookiePresent = hasConsentCookie();
    if (savedConsent && !cookiePresent) setConsentCookie();
    if (!savedConsent && !cookiePresent) setIsVisible(true);
  }, []);

  const handleSaveCookies = () => {
    // "accept all" must grant every category, regardless of current toggles.
    setPreferences(defaultCookiePreferences);
    localStorage.setItem(
      "cookieConsent",
      JSON.stringify(defaultCookiePreferences),
    );
    setConsentCookie();
    updateConsentMode(defaultCookiePreferences);
    window.dispatchEvent(new Event("cookie-consent-accepted"));
    setIsVisible(false);
  };

  const handleRejectCookies = () => {
    // "reject all": deny every optional category; functional stays on.
    const rejected = {
      functional: true,
      statistical: false,
      advertising_social_media: false,
      experience: false,
    };
    setPreferences(rejected);
    localStorage.setItem("cookieConsent", JSON.stringify(rejected));
    setConsentCookie();
    updateConsentMode(rejected);
    // Generic "decision made" signal, kept for parity with accept.
    // It must NOT grant consent — analytics/ads are denied above.
    window.dispatchEvent(new Event("cookie-consent-accepted"));
    setIsVisible(false);
    setOpenStatus(false);
  };

  const handlePreferenceChange = (key: string, value: boolean) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSavePreferences = () => {
    localStorage.setItem("cookieConsent", JSON.stringify(preferences));
    setConsentCookie();
    updateConsentMode(preferences);
    setIsVisible(false);
    setOpenStatus(false);
    window.dispatchEvent(new Event("cookie-consent-accepted"));
  };

  if (!isVisible) return null;

  return (
    <Banner role="region" ariaLabel={tAccessibility("cookie preferences")}>
      <div className="block lg:hidden">
        <MobileCookieModal
          isVisible={isVisible}
          preferences={preferences}
          handleSaveCookies={handleSaveCookies}
          handleRejectCookies={handleRejectCookies}
          handleSavePreferences={handleSavePreferences}
          handlePreferenceChange={handlePreferenceChange}
        />
      </div>
      <div className="hidden space-y-6 p-2.5 lg:block">
        <span>
          <Text component="span" variant="inherit">
            {t("cookies title")}
          </Text>
          <Button
            variant="underline"
            className="inline"
            onClick={() => setOpenStatus((v) => !v)}
          >
            {t("cookie preferences")}
          </Button>
        </span>
        <div className="flex flex-col gap-2">
          <Button
            variant="secondary"
            size="lg"
            className="w-full uppercase"
            onClick={handleSaveCookies}
          >
            {t("accept all cookies")}
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className="w-full uppercase"
            onClick={handleRejectCookies}
          >
            {t("reject all cookies")}
          </Button>
        </div>
      </div>
      {open && (
        <div className="hidden lg:block">
          <Overlay
            cover="screen"
            onClick={() => setOpenStatus(false)}
            disablePointerEvents={false}
          />
          <ModalTransition
            isOpen={open}
            contentSlideFrom="right"
            contentClassName="fixed inset-y-2 right-2 z-30 w-[459px] border border-textInactiveColor bg-bgColor p-2.5 mix-blend-normal"
            content={
              <div className="flex h-full flex-col gap-y-6">
                <div className="flex items-center justify-between">
                  <Text variant="uppercase">{t("cookie preferences")}</Text>
                  <Button
                    aria-label={tAccessibility("close")}
                    onClick={() => setOpenStatus(false)}
                  >
                    [x]
                  </Button>
                </div>
                <div className="h-full overflow-y-scroll border-b">
                  <CookieContent
                    preferences={preferences}
                    onPreferenceChange={handlePreferenceChange}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="main"
                    onClick={handleSaveCookies}
                    size="lg"
                    className="w-full uppercase"
                  >
                    {t("accept all cookies")}
                  </Button>
                  <Button
                    variant="main"
                    onClick={handleRejectCookies}
                    size="lg"
                    className="w-full uppercase"
                  >
                    {t("reject all cookies")}
                  </Button>
                  <Button
                    variant="simpleReverse"
                    onClick={handleSavePreferences}
                    size="lg"
                    className="w-full uppercase"
                  >
                    {t("save preferences")}
                  </Button>
                </div>
              </div>
            }
          />
        </div>
      )}
    </Banner>
  );
}
