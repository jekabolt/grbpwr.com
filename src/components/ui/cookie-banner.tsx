"use client";

import { useEffect, useState } from "react";

import { Text } from "@/components/ui/text";

import { Button } from "./button";
import CareComposition from "./care-composition";
import RadioGroupComponent from "./radio-group";

const cookieOptions = [
  { label: "accept all", value: "accept" },
  { label: "deny all", value: "deny" },
];

interface Props {
  isPrivacyPage?: boolean;
}

export function CookieBanner({ isPrivacyPage = false }: Props) {
  const [isVisible, setIsVisible] = useState(false);
  const [consent, setConsent] = useState<"accept" | "deny" | null>(null);
  const baseStyles = isPrivacyPage
    ? "space-y-6"
    : "fixed bottom-0 left-0 right-0 z-50 space-y-6 bg-white p-4";

  useEffect(() => {
    const savedConsent = localStorage.getItem("cookieConsent");
    if (savedConsent) {
      setConsent(savedConsent === "true" ? "accept" : "deny");
    }
    if (!savedConsent || isPrivacyPage) {
      setIsVisible(true);
    }
  }, [isPrivacyPage]);

  if (!isVisible && !isPrivacyPage) return null;

  const handleConsent = (value: string) => {
    setConsent(value as "accept" | "deny");
  };

  const handleSubmit = () => {
    if (!consent) return;
    localStorage.setItem(
      "cookieConsent",
      consent === "accept" ? "true" : "false",
    );
    setIsVisible(false);
  };

  return (
    <div className={baseStyles}>
      <div>
        <Text variant="uppercase">
          {isPrivacyPage
            ? "7. managing your data preferences"
            : "managing your data preferences"}
        </Text>
      </div>
      <div>
        <Text>
          you can manage your preferences regarding your data trough our website
        </Text>
      </div>
      {isPrivacyPage && <CareComposition className="space-y-6" />}
      <RadioGroupComponent
        name="cookieConsent"
        items={cookieOptions}
        onValueChange={handleConsent}
        value={consent ?? undefined}
        className="grid max-w-xs grid-cols-2"
      />
      <div>
        <Button
          variant="main"
          size="lg"
          className="uppercase"
          onClick={handleSubmit}
        >
          submit
        </Button>
      </div>
    </div>
  );
}
