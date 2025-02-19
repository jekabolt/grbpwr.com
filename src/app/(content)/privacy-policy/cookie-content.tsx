"use client";

import { useEffect, useState } from "react";

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
      <Text className="lowercase">
        A cookie is a small text file that is stored in a dedicated location on
        your computer, tablet, smartphone or other device when you use your
        browser to visit an online service. A cookie allows its sender to
        identify the device on which it is stored during the period of validity
        of consent, which does not exceed 13 months.
      </Text>

      <ToggleSwitch label="functional cookie (non-optional)" disabled checked />

      <Text className="lowercase">
        These cookies are required for optimum operation of the website, and
        cannot be configured. They allow us to offer you the key functions of
        the website (language used, display resolution, account access, shopping
        bag, wish list, etc.), provide you with online advice and secure our
        website against any attempted fraud.
      </Text>

      <ToggleSwitch
        label="statistical analysis cookies"
        checked={activePreferences?.statistical}
        onCheckedChange={(checked) =>
          handlePreferenceChange("statistical", checked)
        }
      />

      <Text className="lowercase">
        These cookies are used to measure and analyse our website audience
        (visitor volume, pages viewed, average browsing time, etc.) to help us
        improve its performance.By accepting these cookies, you are helping us
        to improve our website.
      </Text>

      <ToggleSwitch
        label="advertising and social media cookies"
        checked={activePreferences?.advertising_social_media}
        onCheckedChange={(checked) =>
          handlePreferenceChange("advertising_social_media", checked)
        }
      />

      <Text className="lowercase">
        These cookies are used for Off White advertisements displayed on
        third-party websites, including social media, and are tailored to your
        preferences and to help us measure the effectiveness of our advertising
        campaigns. If you deactivate these cookies,advertising (including ours)
        will continue to be displayed as you browse the Internet, although they
        will not be specific to your personal interests, and will therefore be
        less relevant.
      </Text>

      <ToggleSwitch
        label="cookies to personalize the grbpwr experience"
        checked={activePreferences?.experience}
        onCheckedChange={(checked) =>
          handlePreferenceChange("experience", checked)
        }
      />

      <Text className="lowercase">
        These cookies allow us to provide you with online or in-store
        recommendations of products, services and content that match your
        expectations and preferences. By accepting these cookies, you are opting
        for an enriched and personalised experience.
      </Text>
    </div>
  );
}
