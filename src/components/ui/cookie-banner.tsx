"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { Text } from "@/components/ui/text";
import { CookieContent } from "@/app/[locale]/(content)/_components/cookie-content";

import { Banner } from "./banner";
import { Button } from "./button";
import { MobileCookieModal } from "./mobile-cookie-modal";

export const defaultCookiePreferences = {
  functional: true,
  statistical: true,
  advertising_social_media: true,
  experience: true,
};

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [open, setOpenStatus] = useState(false);
  const [preferences, setPreferences] = useState(defaultCookiePreferences);
  const t = useTranslations("cookies");

  useEffect(() => {
    const savedConsent = localStorage.getItem("cookieConsent");
    if (!savedConsent) {
      setIsVisible(true);
    }
  }, []);

  const handleSaveCookies = () => {
    localStorage.setItem("cookieConsent", JSON.stringify(preferences));
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
    setIsVisible(false);
    setOpenStatus(false);
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
        <Text variant="inherit" className="tracking-wider">
          {t("cookies title")}
          <Button
            variant="underline"
            className="inline"
            onClick={() => setOpenStatus((v) => !v)}
          >
            {t("cookie preferences")}
          </Button>
        </Text>
        <Button
          variant="secondary"
          size="lg"
          className="uppercase"
          onClick={handleSaveCookies}
        >
          {t("accept")}
        </Button>
      </div>
      <div
        className={cn(
          "fixed inset-y-2 right-2 z-30 hidden w-[459px] bg-bgColor p-2.5 mix-blend-normal",
          {
            block: open,
          },
        )}
      >
        <div className="flex h-full flex-col gap-y-6">
          <div className="flex items-center justify-between">
            <Text variant="uppercase">{t("cookie preferences")}</Text>
            <Button onClick={() => setOpenStatus((v) => !v)}>[x]</Button>
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
      </div>
    </Banner>
  );
}
