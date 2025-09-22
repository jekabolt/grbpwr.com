"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { defaultCookiePreferences } from "@/components/ui/cookie-banner";
import { Text } from "@/components/ui/text";
import { ToggleSwitch } from "@/components/ui/toggle-switch";

interface CookiePreferences {
  functional: boolean;
  statistical: boolean;
  advertising_social_media: boolean;
  experience: boolean;
}

interface Props {
  preferences?: CookiePreferences;
  onPreferenceChange?: (key: string, value: boolean) => void;
  autoSave?: boolean;
}

export function CookieContent({
  preferences: externalPreferences,
  onPreferenceChange,
  autoSave = false,
}: Props) {
  const [internalPreferences, setInternalPreferences] = useState(
    defaultCookiePreferences,
  );
  const t = useTranslations("cookies");

  useEffect(() => {
    if (autoSave) {
      const savedConsent = localStorage.getItem("cookieConsent");
      if (savedConsent) {
        setInternalPreferences(JSON.parse(savedConsent));
      }
    }
  }, [autoSave]);

  const handlePreferenceChange = (key: string, value: boolean) => {
    if (autoSave) {
      const newPreferences = {
        ...internalPreferences,
        [key]: value,
      };
      setInternalPreferences(newPreferences);
      localStorage.setItem("cookieConsent", JSON.stringify(newPreferences));
    } else if (onPreferenceChange) {
      onPreferenceChange(key, value);
    }
  };

  const activePreferences = autoSave
    ? internalPreferences
    : externalPreferences;

  return (
    <div className="space-y-4">
      <Text className="lowercase">{t("content text 1")}</Text>

      <ToggleSwitch
        label={t("functional cookie (non-optional)")}
        disabled
        checked
      />

      <Text className="lowercase">{t("content text 2")}</Text>

      <ToggleSwitch
        label={t("statistical analysis cookies")}
        checked={activePreferences?.statistical}
        onCheckedChange={(checked) =>
          handlePreferenceChange("statistical", checked)
        }
      />

      <Text className="lowercase">{t("content text 3")}</Text>

      <ToggleSwitch
        label={t("advertising and social media cookies")}
        checked={activePreferences?.advertising_social_media}
        onCheckedChange={(checked) =>
          handlePreferenceChange("advertising_social_media", checked)
        }
      />

      <Text className="lowercase">{t("content text 4")}</Text>

      <ToggleSwitch
        label={t("cookies to personalize the grbpwr experience")}
        checked={activePreferences?.experience}
        onCheckedChange={(checked) =>
          handlePreferenceChange("experience", checked)
        }
      />

      <Text className="lowercase">{t("content text 5")}</Text>
    </div>
  );
}
