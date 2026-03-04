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
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("consent", "update", {
    analytics_storage: prefs.statistical ? "granted" : "denied",
    ad_storage: prefs.advertising_social_media ? "granted" : "denied",
    ad_user_data: prefs.advertising_social_media ? "granted" : "denied",
    ad_personalization: prefs.advertising_social_media ? "granted" : "denied",
  });
}

export function CookieBanner({ defaultVisible = false }: CookieBannerProps) {
  const [isVisible, setIsVisible] = useState(defaultVisible);
  const [open, setOpenStatus] = useState(false);
  const [preferences, setPreferences] = useState(defaultCookiePreferences);
  const t = useTranslations("cookies");

  useEffect(() => {
    const savedConsent = localStorage.getItem("cookieConsent");
    if (savedConsent) {
      setIsVisible(false);
    }
  }, []);

  const setConsentCookie = () => {
    document.cookie = "cookieConsent=1;path=/;max-age=31536000;SameSite=Lax";
  };

  const handleSaveCookies = () => {
    localStorage.setItem("cookieConsent", JSON.stringify(preferences));
    setConsentCookie();
    updateConsentMode(preferences);
    window.dispatchEvent(new Event("cookie-consent-accepted"));
    setIsVisible(false);
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
    <Banner>
      <div className="block lg:hidden">
        <MobileCookieModal
          isVisible={isVisible}
          preferences={preferences}
          handleSaveCookies={handleSaveCookies}
          handlePreferenceChange={handlePreferenceChange}
        />
      </div>
      <div className="hidden space-y-6 p-2.5 lg:block">
        <span className="inline-flex flex-nowrap items-baseline gap-x-1 tracking-wider">
          <Text component="span" variant="inherit">{t("cookies title")}</Text>
          <Button
            variant="underline"
            className="inline"
            onClick={() => setOpenStatus((v) => !v)}
          >
            {t("cookie preferences")}
          </Button>
        </span>
        <Button
          variant="secondary"
          size="lg"
          className="uppercase"
          onClick={handleSaveCookies}
        >
          {t("accept")}
        </Button>
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
                  <Button onClick={() => setOpenStatus(false)}>[x]</Button>
                </div>
                <div className="h-full overflow-y-scroll border-b">
                  <CookieContent
                    preferences={preferences}
                    onPreferenceChange={handlePreferenceChange}
                  />
                </div>
                <div className="flex gap-x-6">
                  <Button
                    variant="main"
                    onClick={handleSaveCookies}
                    size="lg"
                    className="w-1/2 uppercase"
                  >
                    {t("accept all cookies")}
                  </Button>
                  <Button
                    variant="simpleReverse"
                    onClick={handleSavePreferences}
                    size="lg"
                    className="uppercase"
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
